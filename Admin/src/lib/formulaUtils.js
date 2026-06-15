/**
 * formulaUtils.js
 * ----------------------------------------------------------------------------
 * Pure UI helpers for *discovering and locating* `$...$` formulas inside a
 * plain text field so the admin editor can surface and edit them.
 *
 * These do NOT change stored data, the storage format, or the math renderer.
 * They only read the existing `$...$` segments (the same delimiter the student
 * renderer splits on) to power formula chips and cursor-aware editing.
 */

// Same delimiter the renderer uses: /(\$[^$]+\$)/g
const FORMULA_RE = /\$[^$]+\$/g;

/** All `$...$` formulas in `text`, with their positions. */
export function findFormulas(text) {
  if (!text) return [];
  const out = [];
  let m;
  FORMULA_RE.lastIndex = 0;
  while ((m = FORMULA_RE.exec(text)) !== null) {
    out.push({
      start: m.index,
      end: m.index + m[0].length,
      raw: m[0], // includes the surrounding $...$
      inner: m[0].slice(1, -1), // latex only
    });
  }
  return out;
}

/** The formula whose range contains the caret position, or null. */
export function formulaAtCursor(text, pos) {
  if (typeof pos !== "number") return null;
  return (
    findFormulas(text).find((f) => pos >= f.start && pos <= f.end) || null
  );
}

/** Replace [start,end) in `text` with `snippet` (used when editing in place). */
export function replaceRange(text, start, end, snippet) {
  const src = text || "";
  return src.slice(0, start) + snippet + src.slice(end);
}

/**
 * Convert a STORED formula body back to plain editor LaTeX. The storage format
 * doubles matrix row-breaks (`\\` -> `\\\\`) so they survive the renderer's
 * backslash-collapse; undo that one transform so MathLive shows correct rows.
 * Simple formulas (no row-breaks) are returned unchanged.
 */
export function latexForEditor(inner) {
  if (!inner) return "";
  return inner.replace(/\\\\\\\\/g, "\\\\");
}
