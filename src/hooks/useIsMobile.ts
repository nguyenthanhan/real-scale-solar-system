import * as React from "react";

export const MOBILE_BREAKPOINT = 768;

export function isMobileViewport(
  width = typeof window !== "undefined" ? window.innerWidth : MOBILE_BREAKPOINT,
): boolean {
  return width < MOBILE_BREAKPOINT;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(isMobileViewport);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(isMobileViewport());
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
