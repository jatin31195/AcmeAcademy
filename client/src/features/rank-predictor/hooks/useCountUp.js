import { useEffect, useRef, useState } from "react";

/**
 * useCountUp — animates a number from 0 → target with an ease-out curve.
 * Presentation only; falls back to the raw value if target is not a number.
 */
export function useCountUp(target, duration = 1300) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    if (target == null || Number.isNaN(Number(target))) {
      setValue(target);
      return;
    }
    const end = Number(target);
    let raf;
    const tick = (t) => {
      if (startRef.current == null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setValue(Math.round(eased * end));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      startRef.current = null;
    };
  }, [target, duration]);

  return value;
}
