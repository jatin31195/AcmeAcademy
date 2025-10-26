

export function slugifyQuestion(question) {
  if (!question.question) return "";

  return question.question
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")       // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, "")   // Remove all non-word chars
    .replace(/\-\-+/g, "-")     // Replace multiple hyphens with single
    .replace(/^-+/, "")          // Trim hyphens from start
    .replace(/-+$/, "");         // Trim hyphens from end
}
