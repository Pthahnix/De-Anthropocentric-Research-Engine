export interface WebMeta {
  url: string;
  normalizedUrl: string;
  title?: string;
  description?: string;
  snippet?: string;
  markdownPath?: string;
  fetchFailed?: boolean;
}
