/**
 * mathStorage.js
 * ----------------------------------------------------------------------------
 * Bridges MathLive's LaTeX output to the EXACT storage format the student
 * renderer (`renderWithMath`) expects: math wrapped in single dollar signs,
 * e.g.  Find $\frac{a+b}{c}$ and evaluate.
 *
 * We do NOT change the storage format or the student-facing renderer.
 * These helpers only normalise MathLive quirks into plain KaTeX-safe LaTeX
 * so the existing `$...$` parser keeps working.
 */

/**
 * MathLive sometimes emits macros that KaTeX does not understand
 * (`\mleft`, `\mright`, `\placeholder{}`, `\differentialD`, non-breaking
 * spaces, etc.). Strip / map them to plain KaTeX equivalents.
 *
 * @param {string} latex raw LaTeX from a MathLive math-field
 * @returns {string} KaTeX-compatible LaTeX (no surrounding $)
 */
export function sanitizeForKatex(latex) {
  if (!latex) return "";

  return (
    latex
      // MathLive "smart" delimiters -> standard ones
      .replace(/\\mleft\s*/g, "\\left")
      .replace(/\\mright\s*/g, "\\right")
      // empty/placeholder tokens left behind by the visual editor
      .replace(/\\placeholder\{[^}]*\}/g, "")
      .replace(/\\placeholder(?![a-zA-Z])/g, "")
      // differential 'd' -> literal d
      .replace(/\\differentialD/g, "d")
      .replace(/\\exponentialE/g, "e")
      .replace(/\\imaginaryI/g, "i")
      // MathLive non-breaking / control spaces
      .replace(/\\,/g, " ")
      .replace(/ /g, " ")
      // collapse runs of whitespace, trim
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * The student renderer (`renderWithMath`) runs `.replace(/\\\\/g, "\\")`, i.e.
 * it COLLAPSES every `\\` (LaTeX row break, used in matrices) down to a single
 * `\` before handing the string to KaTeX. A single `\` is NOT a valid row
 * break, so matrices would render wrong.
 *
 * To survive that collapse we pre-double every row-break `\\` -> `\\\\`.
 * After the renderer collapses it once, KaTeX receives the correct `\\`.
 * Single-backslash commands (\frac, \sqrt, \sin ...) contain no consecutive
 * backslashes, so they are never touched.
 *
 * @param {string} latex
 * @returns {string}
 */
export function escapeForRenderer(latex) {
  // match exactly two consecutive backslashes, emit four
  return latex.replace(/\\\\/g, () => "\\\\\\\\");
}

/**
 * Wrap a LaTeX expression in single dollars, the delimiter the renderer
 * splits on: /(\$[^$]+\$)/g. We also guarantee the body never contains a
 * literal `$` (which would break that regex), and we escape matrix row breaks
 * so they survive the renderer's backslash-collapse.
 *
 * @param {string} latex sanitized LaTeX (no $)
 * @returns {string} e.g. "$\\frac{a+b}{c}$"  — or "" if empty
 */
export function wrapInDollars(latex) {
  const clean = sanitizeForKatex(latex).replace(/\$/g, "");
  if (!clean) return "";
  return `$${escapeForRenderer(clean)}$`;
}

/**
 * Insert `snippet` into `text` at [start,end], replacing any selection.
 * Adds a single space around the snippet when it butts directly against a
 * word character, so "Find$x$" never happens.
 *
 * @returns {{ value: string, caret: number }} new text + caret position
 */
export function spliceAtCursor(text, snippet, start, end) {
  const src = text || "";
  const s = typeof start === "number" ? start : src.length;
  const e = typeof end === "number" ? end : src.length;

  const before = src.slice(0, s);
  const after = src.slice(e);

  const needLeadingSpace = before && !/\s$/.test(before);
  const needTrailingSpace = after && !/^\s/.test(after);

  const piece =
    (needLeadingSpace ? " " : "") + snippet + (needTrailingSpace ? " " : "");

  return {
    value: before + piece + after,
    caret: (before + piece).length,
  };
}
