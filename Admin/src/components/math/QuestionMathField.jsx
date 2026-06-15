import { useMemo, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MathInsertButton from "./MathInsertButton";
import { renderWithMath, hasMath } from "@/lib/renderWithMath";
import { findFormulas } from "@/lib/formulaUtils";
import { cn } from "@/lib/utils";
import { Eye, FunctionSquare, Pencil } from "lucide-react";

/** Labelled field with "Insert equation" action, formula discovery chips,
 *  and live KaTeX preview. UI only — ref wiring, value/onChange contract,
 *  insertion and preview logic are unchanged. */
const QuestionMathField = ({
  label,
  name,
  value,
  multiline,
  onChange,
  fieldRefs,
}) => {
  const mathBtnRef = useRef(null);

  const setRef = (el) => {
    if (el) fieldRefs.current[name] = el;
  };
  const Comp = multiline ? Textarea : Input;

  const formulas = useMemo(() => findFormulas(value), [value]);
  const count = formulas.length;
  const showsMath = count > 0 || hasMath(value);

  // Click a chip -> place the caret inside that formula and open the editor,
  // which (being caret-aware) loads it for in-place editing.
  const editFormula = useCallback(
    (f) => {
      const el = fieldRefs.current[name];
      if (el) {
        el.focus();
        try {
          el.setSelectionRange(f.start, f.end);
        } catch {
          /* no selection support */
        }
      }
      mathBtnRef.current?.open();
    },
    [fieldRefs, name]
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
        <label
          htmlFor={name}
          className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground"
        >
          <span className="truncate">{label}</span>
          {count > 0 && (
            <span
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary"
              title={`${count} formula${count > 1 ? "s" : ""} in this field`}
            >
              <FunctionSquare className="h-3 w-3" />
              {count} formula{count > 1 ? "s" : ""}
            </span>
          )}
        </label>
        <MathInsertButton
          apiRef={mathBtnRef}
          getTarget={() => fieldRefs.current[name]}
          value={value}
          onValueChange={(next) => onChange(name, next)}
          label="Insert equation"
        />
      </div>

      {/* Field container — premium focus state on the whole field */}
      <div className="rounded-xl border border-border/70 bg-secondary/40 transition-all focus-within:border-primary focus-within:bg-secondary/60 focus-within:ring-2 focus-within:ring-primary/30">
        <Comp
          id={name}
          ref={setRef}
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={`Type ${label.toLowerCase()} — or insert an equation`}
          className={cn(
            "border-0 bg-transparent shadow-none focus-visible:ring-0",
            multiline && "min-h-[96px] resize-y leading-relaxed"
          )}
        />
      </div>

      {/* Formula navigator — discover & click-to-edit existing formulas */}
      {count > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Formulas
          </span>
          {formulas.map((f, i) => (
            <button
              key={`${f.start}-${i}`}
              type="button"
              onClick={() => editFormula(f)}
              title="Click to edit this equation"
              aria-label={`Edit equation ${i + 1}`}
              className="group inline-flex max-w-[180px] items-center gap-1.5 overflow-hidden rounded-lg border border-border/70 bg-card px-2 py-1 text-xs shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5"
            >
              <span className="grid h-4 w-4 shrink-0 place-items-center rounded bg-primary/10 text-[9px] font-bold text-primary">
                {i + 1}
              </span>
              <span className="truncate text-foreground [&_.katex]:text-[0.85em]">
                {renderWithMath(f.raw)}
              </span>
              <Pencil className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>
      )}

      {/* Student-style preview card */}
      {showsMath && (
        <div className="animate-fade-in rounded-xl border border-primary/20 bg-primary/[0.04] px-4 py-3">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
            <Eye className="h-3.5 w-3.5" />
            Student Preview
          </div>
          <div className="text-base leading-relaxed text-foreground">
            {renderWithMath(value)}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionMathField;
