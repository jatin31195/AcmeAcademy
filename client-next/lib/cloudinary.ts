// Shared Cloudinary URL helpers, extracted from client/src/pages/Air1Story.jsx
// so both the Server page (metadata/JSON-LD) and the Client content
// component (gallery/hero rendering) can use the same pure functions.

export const cldUploadDate = (url: string): string | undefined => {
  const match = url.match(/\/upload\/v(\d+)\//);
  return match ? new Date(Number(match[1]) * 1000).toISOString() : undefined;
};

export const cldOptimize = (url: string, transform = "f_auto,q_auto") =>
  url.replace("/upload/", `/upload/${transform}/`);

// Dedicated 1200x630 crop for social-share previews (OG/Twitter) — kept
// separate from the hero image transform so the on-page hero is never
// affected.
export const cldSocialImage = (url: string) => cldOptimize(url, "f_auto,q_auto,w_1200,h_630,c_fill,g_auto");

export const cldResponsive = (url: string, widths: number[] = [480, 768, 1080, 1500]) => ({
  src: cldOptimize(url, `f_auto,q_auto,w_${widths[widths.length - 1]}`),
  srcSet: widths.map((w) => `${cldOptimize(url, `f_auto,q_auto,w_${w}`)} ${w}w`).join(", "),
});
