import "dotenv/config";

const TOKEN = process.env.TOKEN_APIFY;
const ACTOR = "apify~rag-web-browser";
const ENDPOINT = `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items`;

/** Fetch a web page as markdown via Apify rag-web-browser. */
export async function content(url: string): Promise<string | null> {
  if (!TOKEN) throw new Error("TOKEN_APIFY not set in .env");

  const resp = await fetch(`${ENDPOINT}?token=${TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: url,
      maxResults: 1,
      outputFormats: ["markdown"],
    }),
  });
  if (!resp.ok) return null;

  const items = (await resp.json()) as any[];
  if (!Array.isArray(items) || items.length === 0) return null;

  return items[0].markdown ?? items[0].text ?? null;
}
