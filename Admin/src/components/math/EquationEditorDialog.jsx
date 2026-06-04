/**
 * EquationEditorDialog.jsx
 * ----------------------------------------------------------------------------
 * Microsoft-Word-style visual equation editor.
 *
 *  - Teacher types/clicks visually in a MathLive field.
 *  - Toolbar buttons insert templates (fraction, root, matrix, integral, ...).
 *  - Live KaTeX preview shows EXACTLY what the student will see
 *    (rendered through the same react-katex the portal uses).
 *  - On "Insert", we hand the parent a `$...$`-wrapped string in the portal's
 *    storage format. Storage format and student renderer are untouched.
 */
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import MathField from "./MathField";
import { wrapInDollars, sanitizeForKatex } from "@/lib/mathStorage";

/**
 * Toolbar definition.
 * `latex` is a MathLive insertion template:
 *   #0 = current selection, #? = empty placeholder the cursor jumps to.
 */
const TOOLBAR = [
  {
    group: "Basic",
    items: [
      { label: "x²", title: "Power / superscript", latex: "#0^{#?}" },
      { label: "x₂", title: "Subscript", latex: "#0_{#?}" },
      { label: "a/b", title: "Fraction", latex: "\\frac{#0}{#?}" },
      { label: "√", title: "Square root", latex: "\\sqrt{#0}" },
      { label: "ⁿ√", title: "nth root", latex: "\\sqrt[#?]{#0}" },
      { label: "( )", title: "Parentheses", latex: "\\left(#0\\right)" },
    ],
  },
  {
    group: "Calculus",
    items: [
      { label: "∫", title: "Integral", latex: "\\int_{#?}^{#?} #0 \\, d#?" },
      { label: "∮", title: "Definite / contour", latex: "\\oint #0" },
      { label: "lim", title: "Limit", latex: "\\lim_{#? \\to #?} #0" },
      { label: "∑", title: "Summation", latex: "\\sum_{#?}^{#?} #0" },
      { label: "∏", title: "Product", latex: "\\prod_{#?}^{#?} #0" },
      { label: "d/dx", title: "Derivative", latex: "\\frac{d}{dx}\\left(#0\\right)" },
    ],
  },
  {
    group: "Matrices",
    items: [
      {
        label: "[ ]",
        title: "Matrix (brackets)",
        latex: "\\begin{bmatrix} #0 & #? \\\\ #? & #? \\end{bmatrix}",
      },
      {
        label: "( )ₘ",
        title: "Matrix (parentheses)",
        latex: "\\begin{pmatrix} #0 & #? \\\\ #? & #? \\end{pmatrix}",
      },
      {
        label: "| |",
        title: "Determinant",
        latex: "\\begin{vmatrix} #0 & #? \\\\ #? & #? \\end{vmatrix}",
      },
      { label: "vec", title: "Vector", latex: "\\vec{#0}" },
    ],
  },
  {
    group: "Functions",
    items: [
      { label: "sin", title: "Sine", latex: "\\sin(#0)" },
      { label: "cos", title: "Cosine", latex: "\\cos(#0)" },
      { label: "tan", title: "Tangent", latex: "\\tan(#0)" },
      { label: "log", title: "Logarithm", latex: "\\log_{#?}(#0)" },
      { label: "ln", title: "Natural log", latex: "\\ln(#0)" },
      { label: "θ", title: "Theta", latex: "\\theta" },
      { label: "π", title: "Pi", latex: "\\pi" },
      { label: "∞", title: "Infinity", latex: "\\infty" },
    ],
  },
];

const EquationEditorDialog = ({ open, onOpenChange, onInsert, initialLatex = "" }) => {
  const [latex, setLatex] = useState(initialLatex);
  const apiRef = useRef(null);

  const preview = sanitizeForKatex(latex);

  const handleInsert = () => {
    const snippet = wrapInDollars(latex);
    if (snippet) onInsert?.(snippet);
    setLatex("");
    apiRef.current?.clear();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[hsl(var(--card))] text-foreground border border-border">
        <DialogHeader>
          <DialogTitle>Insert Equation</DialogTitle>
        </DialogHeader>

        {/* Toolbar */}
        <div className="space-y-3">
          {TOOLBAR.map((group) => (
            <div key={group.group}>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group.group}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((it) => (
                  <button
                    key={it.label}
                    type="button"
                    title={it.title}
                    onClick={() => apiRef.current?.insert(it.latex)}
                    className="min-w-[44px] rounded-md border border-border bg-secondary px-2.5 py-1.5 text-sm font-medium transition hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-900/30"
                  >
                    {it.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Visual editor */}
        <div className="mt-2">
          <p className="mb-1 text-sm font-medium text-muted-foreground">
            Type your equation
          </p>
          <MathField
            value={latex}
            onChange={setLatex}
            apiRef={apiRef}
            placeholder="e.g. \frac{a+b}{c}"
          />
        </div>

        {/* Live preview = exactly what students will see */}
        <div className="mt-2 rounded-lg bg-muted/40 p-3">
          <p className="mb-2 text-xs font-medium text-indigo-600">
            Student preview (KaTeX)
          </p>
          <div className="min-h-[40px] text-base">
            {preview ? (
              <BlockMath
                math={preview}
                renderError={() => (
                  <span className="text-sm text-amber-600">
                    Incomplete equation…
                  </span>
                )}
              />
            ) : (
              <span className="text-sm text-muted-foreground">
                Nothing to preview yet
              </span>
            )}
          </div>
          {preview && (
            <p className="mt-2 break-all font-mono text-[11px] text-muted-foreground">
              Stored as: {wrapInDollars(latex)}
            </p>
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-indigo-600 text-white hover:bg-indigo-500"
            onClick={handleInsert}
            disabled={!preview}
          >
            Insert into field
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EquationEditorDialog;
