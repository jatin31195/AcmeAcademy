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
 *
 * UI only: toolbar data, MathField wiring, preview and insert logic unchanged.
 */
import { useState, useRef, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sigma, Eye } from "lucide-react";
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

  const preview = useMemo(() => sanitizeForKatex(latex), [latex]);
  const isEdit = Boolean(initialLatex && initialLatex.trim());

  const handleInsert = () => {
    const snippet = wrapInDollars(latex);
    if (snippet) onInsert?.(snippet);
    setLatex("");
    apiRef.current?.clear();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92vh] w-[calc(100%-1rem)] max-w-2xl flex-col gap-0 overflow-hidden rounded-[24px] border-border/70 bg-card p-0 text-foreground shadow-2xl lg:max-w-4xl">
        {/* ---------------- Sticky header ---------------- */}
        <DialogHeader className="shrink-0 space-y-1.5 border-b border-border/70 py-5 pl-6 pr-12">
          <DialogTitle className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-white shadow-glow">
              <Sigma className="h-5 w-5" />
            </span>
            {isEdit ? "Edit Equation" : "Insert Equation"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEdit
              ? "Update this formula visually — changes replace it in place. The preview shows exactly what students will see."
              : "Build it visually with the toolbar — the live preview shows exactly what students will see."}
          </DialogDescription>
        </DialogHeader>

        {/* ---------------- Scrollable body ---------------- */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* Toolbar */}
          <div className="space-y-3 rounded-2xl border border-border/70 bg-secondary/30 p-4">
            {TOOLBAR.map((group) => (
              <div key={group.group}>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.group}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((it) => (
                    <button
                      key={it.label}
                      type="button"
                      title={it.title}
                      aria-label={it.title}
                      onClick={() => apiRef.current?.insert(it.latex)}
                      className="min-w-[44px] rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm font-medium text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/10 hover:text-primary active:translate-y-0"
                    >
                      {it.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Visual editor — larger, comfortable surface */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Equation editor
            </label>
            <MathField
              value={latex}
              onChange={setLatex}
              apiRef={apiRef}
              placeholder="e.g. \frac{a+b}{c}"
              minHeight={140}
            />
          </div>

          {/* Student preview — an exam-style simulation of what students see */}
          <div className="overflow-hidden rounded-2xl border border-primary/20 bg-primary/[0.04]">
            <div className="flex items-center gap-1.5 border-b border-primary/15 bg-primary/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-primary">
              <Eye className="h-3.5 w-3.5" />
              Student Preview
            </div>
            <div className="grid min-h-[88px] place-items-center bg-background px-4 py-6 text-2xl text-foreground transition-all">
              {preview ? (
                <BlockMath
                  math={preview}
                  renderError={() => (
                    <span className="text-sm text-amber-500">
                      Incomplete equation…
                    </span>
                  )}
                />
              ) : (
                <span className="text-sm text-muted-foreground">
                  Your equation will appear here, exactly as students see it.
                </span>
              )}
            </div>
            {preview && (
              <p className="break-all border-t border-primary/10 bg-card/40 px-4 py-2 font-mono text-[11px] text-muted-foreground">
                Stored as: {wrapInDollars(latex)}
              </p>
            )}
          </div>
        </div>

        {/* ---------------- Sticky footer ---------------- */}
        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border/70 px-6 py-4 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
            onClick={handleInsert}
            disabled={!preview}
          >
            <Sigma className="h-4 w-4 mr-2" />
            {isEdit ? "Update equation" : "Insert into field"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EquationEditorDialog;
