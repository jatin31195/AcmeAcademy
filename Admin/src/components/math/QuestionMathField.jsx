import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MathInsertButton from "./MathInsertButton";
import { renderWithMath, hasMath } from "@/lib/renderWithMath";

/** Labelled field with "Insert equation" button and live KaTeX preview. */
const QuestionMathField = ({
  label,
  name,
  value,
  multiline,
  onChange,
  fieldRefs,
}) => {
  const setRef = (el) => {
    if (el) fieldRefs.current[name] = el;
  };
  const Comp = multiline ? Textarea : Input;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <MathInsertButton
          getTarget={() => fieldRefs.current[name]}
          value={value}
          onValueChange={(next) => onChange(name, next)}
          label="Insert equation"
        />
      </div>
      <Comp
        ref={setRef}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={`Type ${label.toLowerCase()} — use the button for equations`}
      />
      {hasMath(value) && (
        <div className="rounded-md border border-border/60 bg-muted/40 px-3 py-2 text-sm leading-relaxed">
          <span className="mr-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
            Preview
          </span>
          {renderWithMath(value)}
        </div>
      )}
    </div>
  );
};

export default QuestionMathField;
