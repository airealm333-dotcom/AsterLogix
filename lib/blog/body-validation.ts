/** Strip tags / entities for length checks (blog body must not be empty placeholders). */
export function blogBodyPlainLength(html: string): number {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length;
}

const EMPTY_MARKERS = /^(<p>\s*<\/p>|<p><br\s*\/?><\/p>|\s*)$/i;

export function hasMeaningfulBlogBody(html: string, minChars = 30): boolean {
  const t = html?.trim() ?? "";
  if (!t || EMPTY_MARKERS.test(t)) return false;
  return blogBodyPlainLength(t) >= minChars;
}
