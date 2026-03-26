# Academic Searching Pipeline (acd-searching)

Fixed workflow for searching Google Scholar, enriching results, and fetching full paper text.

## Input

- `queries: string[]` — 1-3 search keywords
- `papersRead: Set<string>` — normalizedTitles already processed (for dedup)

## Output

- `PaperMeta[]` — enriched paper metadata. Each object contains:
  - `title`, `normalizedTitle`, `authors`, `year`
  - `arxivUrl?`, `oaPdfUrl?`, `s2Id?`, `doi?`, `arxivId?`
  - `markdownPath?` — non-empty if full text fetched and cached
  - `abstract?`, `citationCount?`
  - `fetchFailed?` — true if fetching was attempted but failed

## Execution

### SEARCH phase

For each query, call in parallel:

```
google-scholar-scraper({ keyword: query, maxItems: 20 })
```

Merge all results. Deduplicate by normalizedTitle. Skip papers already in `papersRead`.

### ENRICH phase

For each Scholar result, call **sequentially** (Semantic Scholar rate limit):

```
paper_searching({ title, link, authors, year, citations, searchMatch })
```

Pass through all fields from the Scholar result. Collect all returned PaperMeta.

### FETCH phase

Filter: only papers where `arxivUrl` or `oaPdfUrl` is non-empty.

For each paper, call **sequentially** (MinerU processing limit):

```
paper_fetching({
  title, normalizedTitle,
  arxivUrl, arxivId, oaPdfUrl,
  doi, s2Id, abstract, year, authors, citationCount, sourceUrl
})
```

If a paper fails to fetch, set `fetchFailed = true` on its PaperMeta and continue to the next paper. Do not block.

## Error Handling

| Failure | Action |
|---|---|
| `paper_searching` timeout | Retry 1x, skip on second failure |
| `paper_fetching` failure | Mark `fetchFailed = true`, continue |
| `google-scholar-scraper` failure | Log error, use results from other queries |
| All fetches fail | Return enriched metadata only (no markdownPath) — downstream can still use abstracts |

## Notes

- ENRICH and FETCH phases are sequential by design. Two-phase batch (all enriching, then all fetching) was chosen over sliding-window because CC cannot maintain concurrent state via markdown instructions.
- Wall-clock time: enriching is fast (~30-60s total), fetching is the bottleneck (~1-5 min per paper).
- See `skill/dare-scholar.md` for detailed tool parameter reference.
