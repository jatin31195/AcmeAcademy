/**
 * MathField.jsx
 * ----------------------------------------------------------------------------
 * Thin React 19 wrapper around MathLive's <math-field> web component.
 *
 * - Importing "mathlive" registers the <math-field> custom element.
 * - We control it imperatively via a ref (custom elements expose their state
 *   as DOM properties, not React props) and surface changes through onChange.
 * - `apiRef` is forwarded to the parent so toolbar buttons can call
 *   .insert(...) / .focus() on the live mathfield.
 */
import { useEffect, useImperativeHandle, useRef } from "react";
import { MathfieldElement } from "mathlive";

// Load MathLive fonts/sounds from a CDN so we don't have to copy assets into
// /public. Set once, module-level. (Sounds disabled — silent editor.)
if (typeof window !== "undefined") {
  MathfieldElement.fontsDirectory = "https://cdn.jsdelivr.net/npm/mathlive@0.109.2/fonts";
  MathfieldElement.soundsDirectory = null;
}

const MathField = ({ value = "", onChange, apiRef, placeholder = "" }) => {
  const ref = useRef(null);

  // Expose a minimal imperative API to the parent (toolbar).
  // The empty deps array keeps the handle stable across renders — without it
  // React recreates it every render, which (with a callback ref) loops forever.
  useImperativeHandle(
    apiRef,
    () => ({
      insert: (latex, options) =>
        ref.current?.insert(latex, {
          focus: true,
          feedback: false,
          mode: "math",
          insertionMode: "replaceSelection",
          selectionMode: "placeholder",
          ...options,
        }),
      focus: () => ref.current?.focus(),
      clear: () => {
        if (ref.current) ref.current.value = "";
      },
      getValue: () => ref.current?.value ?? "",
    }),
    []
  );

  // Keep the element's value in sync when the parent value changes externally.
  useEffect(() => {
    const mf = ref.current;
    if (mf && mf.value !== value) mf.value = value;
  }, [value]);

  // Wire the input event (custom element → React state).
  useEffect(() => {
    const mf = ref.current;
    if (!mf) return;

    // Make it behave like a clean equation editor.
    mf.smartMode = true;
    mf.mathModeSpace = "\\,";

    const handler = () => onChange?.(mf.value);
    mf.addEventListener("input", handler);
    return () => mf.removeEventListener("input", handler);
  }, [onChange]);

  return (
    <math-field
      ref={ref}
      placeholder={placeholder}
      style={{
        display: "block",
        width: "100%",
        minHeight: "56px",
        padding: "12px 14px",
        fontSize: "20px",
        border: "1px solid hsl(var(--border))",
        borderRadius: "10px",
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }}
    />
  );
};

export default MathField;
