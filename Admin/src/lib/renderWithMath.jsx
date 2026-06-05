import { InlineMath, BlockMath } from "react-katex";

/**
 * Student-style math renderer — matches the portal's renderWithMath so admin
 * previews show exactly what students will see.
 */
export const renderWithMath = (text, emptyFallback = null) => {
  if (!text) return emptyFallback;

  const parts = text.split(/(\$[^$]+\$)/g);

  return parts.map((part, i) => {
    if (part.startsWith("$") && part.endsWith("$")) {
      let math = part.slice(1, -1).trim();
      const isMatrix = /\\begin\{bmatrix\}|\\begin\{pmatrix\}|\\\\/.test(math);

      math = math
        .replace(/\\\\/g, "\\")
        .replace(/\\times/g, " \\times ")
        .replace(/\\div/g, " \\div ")
        .replace(/\\cdot/g, " \\cdot ")
        .replace(/\\pm/g, " \\pm ")
        .replace(/\\le/g, " \\le ")
        .replace(/\\ge/g, " \\ge ")
        .replace(/\\neq/g, " \\neq ")
        .replace(/\\infty/g, " \\infty ")
        .replace(/\\sqrt/g, " \\sqrt ")
        .replace(/\\frac/g, " \\frac ")
        .replace(/\\sum/g, " \\sum ")
        .replace(/\\to/g, " \\to ")
        .replace(/\\alpha/g, " \\alpha ")
        .replace(/\\beta/g, " \\beta ")
        .replace(/\\gamma/g, " \\gamma ")
        .replace(/\\delta/g, " \\delta ")
        .replace(/\\theta/g, " \\theta ")
        .replace(/\\pi/g, " \\pi ")
        .replace(/\\phi/g, " \\phi ")
        .replace(/\\sigma/g, " \\sigma ")
        .replace(/\\mu/g, " \\mu ")
        .replace(/\\lambda/g, " \\lambda ")
        .replace(/\{?(\d+)\s*\\choose\s*(\d+)\}?/g, "{$1 \\choose $2}")
        .replace(/\{?(\d+)\s*[Cc]\s*(\d+)\}?/g, "{$1 \\choose $2}")
        .replace(/\{?(\d+)\s*[Pp]\s*(\d+)\}?/g, "{$1 \\mathrm{P} $2}");

      return isMatrix ? (
        <BlockMath key={i} math={math} />
      ) : (
        <InlineMath key={i} math={math} />
      );
    }

    return <span key={i}>{part}</span>;
  });
};

export const hasMath = (text) => Boolean(text?.includes("$"));
