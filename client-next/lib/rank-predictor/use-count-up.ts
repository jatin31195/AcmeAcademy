"use client";

import { useEffect, useRef, useState } from "react";

// Ported verbatim from client/src/features/rank-predictor/hooks/useCountUp.js.
// Animates a number from 0 → target with an ease-out curve. Presentation
// only; falls back to the raw value if target is not a number.
export function useCountUp(target: number | null | undefined, duration = 1300) {
  const [value, setValue] = useState<number | null | undefined>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (target == null || Number.isNaN(Number(target))) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- non-numeric fallback, ported behavior
      setValue(target);
      return;
    }
    const end = Number(target);
    let raf: number;
    const tick = (t: number) => {
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
