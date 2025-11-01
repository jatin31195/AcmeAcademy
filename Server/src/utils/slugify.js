export function slugifyQuestion(question) {
  if (!question.question) return "";

  const baseSlug = question.question
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")       
    .replace(/[^\w\-]+/g, "")   
    .replace(/\-\-+/g, "-")     
    .replace(/^-+/, "")         
    .replace(/-+$/, "");        

  const uniqueSuffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${uniqueSuffix}`;
}
