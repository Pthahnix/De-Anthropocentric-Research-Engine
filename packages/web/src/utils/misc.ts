/** Normalize a URL into a safe, dedup-friendly cache key. */
export function normUrl(url: string): string {
  return url
    .replace(/^https?:\/\//, "")  // strip protocol
    .replace(/[?#].*$/, "")       // strip query params and fragment
    .replace(/\/+$/, "")          // strip trailing slashes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")  // non-alphanum → _
    .replace(/_+/g, "_")          // collapse multiple _
    .replace(/^_|_$/g, "");       // strip leading/trailing _
}
