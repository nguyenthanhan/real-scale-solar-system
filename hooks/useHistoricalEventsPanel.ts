import { useState, useCallback, useEffect, useRef } from "react";
import { flushSync } from "react-dom";

interface UseHistoricalEventsPanelOptions {
  isDateMode: boolean;
}

export function useHistoricalEventsPanel({
  isDateMode,
}: UseHistoricalEventsPanelOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const wasOpenBeforeModeSwitchRef = useRef(false);

  const openPanel = useCallback(() => {
    if (isDateMode) {
      setIsOpen(true);
    }
  }, [isDateMode]);

  const closePanel = useCallback(() => {
    setIsOpen(false);
  }, []);

  const togglePanel = useCallback(() => {
    if (isDateMode) {
      setIsOpen((prev) => !prev);
    }
  }, [isDateMode]);

  // Handle mode switching - hide panel when switching to Speed Mode
  // and restore when returning to Date Mode
  useEffect(() => {
    if (!isDateMode) {
      // Switching to Speed Mode - save state and close
      if (isOpen) {
        flushSync(() => {
          wasOpenBeforeModeSwitchRef.current = true;
          setIsOpen(false);
        });
      }
    } else {
      // Returning to Date Mode - restore previous state
      if (wasOpenBeforeModeSwitchRef.current) {
        flushSync(() => {
          setIsOpen(true);
          wasOpenBeforeModeSwitchRef.current = false;
        });
      }
    }
  }, [isDateMode, isOpen]);

  return {
    isOpen,
    openPanel,
    closePanel,
    togglePanel,
  };
}
