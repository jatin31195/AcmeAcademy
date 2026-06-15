/**
 * MathInsertButton.jsx
 * ----------------------------------------------------------------------------
 * "fx" action placed next to ANY text field (question, options, solution).
 *
 *  - Click with the caret in plain text  -> opens the editor empty and SPLICES
 *    a new `$...$` at the cursor (original behavior, unchanged).
 *  - Click with the caret inside an existing `$...$` -> opens the editor
 *    PRE-FILLED with that formula and REPLACES it in place on confirm
 *    (true edit experience). Additive: the splice path is untouched.
 *
 * Exposes an imperative `open()` via `apiRef` so the field's formula chips can
 * trigger the same single edit path (no duplicated logic).
 */
import { useState, useRef, useCallback, useImperativeHandle, lazy, Suspense } from "react";
import { Sigma } from "lucide-react";
import { Button } from "@/components/ui/button";
import { spliceAtCursor } from "@/lib/mathStorage";
import { formulaAtCursor, replaceRange, latexForEditor } from "@/lib/formulaUtils";

// Lazy: MathLive (~1 MB) only downloads the first time a teacher opens the editor.
const EquationEditorDialog = lazy(() => import("./EquationEditorDialog"));

const MathInsertButton = ({
  getTarget,
  value,
  onValueChange,
  label = "Insert Math",
  apiRef,
}) => {
  const [open, setOpen] = useState(false);
  const [initialLatex, setInitialLatex] = useState("");
  // Range to replace when editing an existing formula; null = insert-new mode.
  const editRange = useRef(null);

  const openEditor = useCallback(() => {
    const el = typeof getTarget === "function" ? getTarget() : null;
    const pos = el?.selectionStart;
    const found = formulaAtCursor(value, pos);

    if (found) {
      editRange.current = { start: found.start, end: found.end };
      setInitialLatex(latexForEditor(found.inner));
    } else {
      editRange.current = null;
      setInitialLatex("");
    }
    setOpen(true);
  }, [getTarget, value]);

  // Let parent (formula chips) open the SAME edit path imperatively.
  useImperativeHandle(apiRef, () => ({ open: openEditor }), [openEditor]);

  const restoreCaret = (el, caret) => {
    if (!el) return;
    requestAnimationFrame(() => {
      el.focus();
      try {
        el.setSelectionRange(caret, caret);
      } catch {
        /* inputs without selection support */
      }
    });
  };

  const handleInsert = useCallback(
    (snippet) => {
      const el = typeof getTarget === "function" ? getTarget() : null;
      const range = editRange.current;

      if (range) {
        // EDIT existing formula in place.
        const next = replaceRange(value, range.start, range.end, snippet);
        onValueChange(next);
        restoreCaret(el, range.start + snippet.length);
      } else {
        // INSERT new at cursor (unchanged original behavior).
        const start = el?.selectionStart;
        const end = el?.selectionEnd;
        const { value: next, caret } = spliceAtCursor(value, snippet, start, end);
        onValueChange(next);
        restoreCaret(el, caret);
      }
    },
    [getTarget, value, onValueChange]
  );

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={openEditor}
        title="Open the visual equation editor"
        className="h-7 shrink-0 gap-1.5 rounded-lg border-primary/30 bg-primary/5 px-2.5 text-xs font-semibold text-primary shadow-none transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
      >
        <Sigma className="h-3.5 w-3.5" />
        {label}
      </Button>

      {open && (
        <Suspense fallback={null}>
          <EquationEditorDialog
            open={open}
            onOpenChange={setOpen}
            onInsert={handleInsert}
            initialLatex={initialLatex}
          />
        </Suspense>
      )}
    </>
  );
};

export default MathInsertButton;
