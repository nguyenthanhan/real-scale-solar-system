"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { easeInOutCubic, type EasingFunction } from "@/utils/easing-functions";
import {
  interpolateDate,
  calculateAnimationDuration,
  determineTimeDirection,
  isSameDate,
  isValidAnimationDate,
  type TimeDirection,
  type AnimationDurationConfig,
} from "@/utils/date-interpolation";

export interface DateTransitionConfig extends AnimationDurationConfig {
  easingFunction: EasingFunction;
}

export interface DateTransitionState {
  isAnimating: boolean;
  startDate: Date;
  targetDate: Date;
  currentDate: Date;
  progress: number; // 0-1
  canCancel: boolean;
  direction: TimeDirection;
}

export interface UseDateTransitionReturn {
  state: DateTransitionState;
  startTransition: (targetDate: Date) => void;
  cancelTransition: () => void;
  setAnimationSpeed: (speed: number) => void;
  animationSpeed: number;
  isInstantMode: boolean;
}

const DEFAULT_CONFIG: DateTransitionConfig = {
  minDuration: 300,
  maxDuration: 3000,
  easingFunction: easeInOutCubic,
};

export function useDateTransition(
  currentDate: Date,
  onDateChange: (date: Date) => void,
  config: Partial<DateTransitionConfig> = {},
): UseDateTransitionReturn {
  // NOTE: Config objects should be memoized by callers to avoid unnecessary recalculation.
  // If passing inline config objects (e.g., { minDuration: 500 }), wrap them in useMemo
  // to prevent the mergedConfig from recalculating on every render due to new object references.
  const mergedConfig = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    [config],
  );

  const [state, setState] = useState<DateTransitionState>({
    isAnimating: false,
    startDate: currentDate,
    targetDate: currentDate,
    currentDate: currentDate,
    progress: 0,
    canCancel: false,
    direction: "forward",
  });

  const [animationSpeed, setAnimationSpeed] = useState(0.5); // 0-1 scale
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const cancelTransitionInternal = useCallback(
    (targetDate: Date) => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      setState((prev) => ({
        ...prev,
        isAnimating: false,
        currentDate: targetDate,
        progress: 1,
        canCancel: false,
      }));
      onDateChange(targetDate);
    },
    [onDateChange],
  );

  const startTransition = useCallback(
    (targetDate: Date) => {
      // Validate target date
      if (!isValidAnimationDate(targetDate)) {
        console.error("Invalid target date for animation");
        return;
      }

      // Cancel any existing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      // Get the actual current date - use the latest date from state or prop
      const startDate = state.currentDate || currentDate;

      // Instant mode: skip animation
      if (animationSpeed >= 1) {
        onDateChange(targetDate);
        setState((prev) => ({
          ...prev,
          isAnimating: false,
          currentDate: targetDate,
          targetDate: targetDate,
          progress: 1,
          canCancel: false,
        }));
        return;
      }

      // No-op if same date
      if (isSameDate(startDate, targetDate)) {
        return;
      }

      const duration = calculateAnimationDuration(
        startDate,
        targetDate,
        animationSpeed,
        mergedConfig,
      );

      // If duration is 0, skip animation
      if (duration === 0) {
        onDateChange(targetDate);
        return;
      }

      const direction = determineTimeDirection(startDate, targetDate);
      startTimeRef.current = performance.now();
      durationRef.current = duration;

      setState({
        isAnimating: true,
        startDate,
        targetDate,
        currentDate: startDate,
        progress: 0,
        canCancel: true,
        direction,
      });

      const animate = (currentTime: number) => {
        try {
          const elapsed = currentTime - startTimeRef.current;
          const rawProgress = Math.min(elapsed / durationRef.current, 1);
          const easedProgress = mergedConfig.easingFunction(rawProgress);

          // Interpolate date
          const interpolatedDate = interpolateDate(
            startDate,
            targetDate,
            easedProgress,
          );

          setState((prev) => ({
            ...prev,
            currentDate: interpolatedDate,
            progress: rawProgress,
          }));

          // Update planet positions
          onDateChange(interpolatedDate);

          if (rawProgress < 1) {
            animationRef.current = requestAnimationFrame(animate);
          } else {
            // Animation complete
            setState((prev) => ({
              ...prev,
              isAnimating: false,
              currentDate: targetDate,
              progress: 1,
              canCancel: false,
            }));
            onDateChange(targetDate);
            animationRef.current = null;
          }
        } catch (error) {
          console.error("Animation frame error:", error);
          // Cancel animation and jump to target
          cancelTransitionInternal(targetDate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    },
    [
      currentDate,
      state.currentDate,
      onDateChange,
      animationSpeed,
      mergedConfig,
      cancelTransitionInternal,
    ],
  );

  const cancelTransition = useCallback(() => {
    cancelTransitionInternal(state.targetDate);
  }, [cancelTransitionInternal, state.targetDate]);

  return {
    state,
    startTransition,
    cancelTransition,
    setAnimationSpeed,
    animationSpeed,
    isInstantMode: animationSpeed >= 1,
  };
}
