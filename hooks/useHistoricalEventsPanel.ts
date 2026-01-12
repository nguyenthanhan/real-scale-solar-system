import { useState, useCallback, useEffect } from "react";
import { flushSync } from "react-dom";

interface UseHistoricalEventsPanelOptions {
  isDateMode: boolean;
}

export function useHistoricalEventsPanel({
  isDateMode,
}: UseHistoricalEventsPanelOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [wasOpenBeforeModeSwitch, setWasOpenBeforeModeSwitch] = useState(false);

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
          setWasOpenBeforeModeSwitch(true);
          setIsOpen(false);
        });
      }
    } else {
      // Returning to Date Mode - restore previous state
      if (wasOpenBeforeModeSwitch) {
        flushSync(() => {
          setIsOpen(true);
          setWasOpenBeforeModeSwitch(false);
        });
      }
    }
  }, [isDateMode, isOpen, wasOpenBeforeModeSwitch]);

  return {
    isOpen,
    openPanel,
    closePanel,
    togglePanel,
  };
}
