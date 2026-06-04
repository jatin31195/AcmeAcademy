/**
 * MathInsertButton.jsx
 * ----------------------------------------------------------------------------
 * Drop-in "fx" button placed next to ANY text field (question, options,
 * solution). Clicking it opens the visual EquationEditorDialog; on insert it
 * splices the `$...$` LaTeX into the bound field at the current cursor
 * position — without disturbing the manual-typing flow.
 *
 * Usage:
 *   <MathInsertButton
 *     getTarget={() => fieldRefs.current.question}   // the <textarea>/<input> DOM node
 *     value={form.question}
 *     onValueChange={(next) => setForm(p => ({ ...p, question: next }))}
 *   />
 */
import { useState, lazy, Suspense } from "react";
import { Sigma } from "lucide-react";
import { Button } from "@/components/ui/button";
import { spliceAtCursor } from "@/lib/mathStorage";

// Lazy: MathLive (~1 MB) only downloads the first time a teacher opens the editor.
const EquationEditorDialog = lazy(() => import("./EquationEditorDialog"));

const MathInsertButton = ({ getTarget, value, onValueChange, label = "Insert Math" }) => {
  const [open, setOpen] = useState(false);

  const handleInsert = (snippet) => {
    const el = typeof getTarget === "function" ? getTarget() : null;
    const start = el?.selectionStart;
    const end = el?.selectionEnd;

    const { value: next, caret } = spliceAtCursor(value, snippet, start, end);
    onValueChange(next);

    // Restore focus + caret after React re-renders the controlled input.
    if (el) {
      requestAnimationFrame(() => {
        el.focus();
        try {
          el.setSelectionRange(caret, caret);
        } catch {
          /* inputs without selection support */
        }
      });
    }
  };

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-7 gap-1 px-2 text-xs"
        onClick={() => setOpen(true)}
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
          />
        </Suspense>
      )}
    </>
  );
};

export default MathInsertButton;
