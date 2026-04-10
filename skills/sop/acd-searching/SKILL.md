---
name: Academic Searching
description: Execute the academic search pipeline — Scholar search → enrich → fetch
type: sop
layer: sop
agent: orchestration
tools: [google-scholar-scraper, paper_searching, paper_fetching]
input: query (search string), maxResults (number)
output: PaperMeta[] with markdownPaths
---

# Academic Searching SOP

## Layer Rules
- **Agent**: CC orchestration (calls multiple MCP tools in sequence)
- **Called by**: academic-research tactic only
- **Tool sequence**: google-scholar-scraper → paper_searching (per result) → paper_fetching (per result)

## Procedure
1. Receive `query` and `maxResults` from calling tactic
2. **SEARCH**: Call `google-scholar-scraper` with `{ keyword: query, maxItems: maxResults, proxyOptions: { useApifyProxy: true } }`
3. **ENRICH**: For each Scholar result, call `paper_searching` to get PaperMeta (abstract, arxivUrl, oaPdfUrl, s2Id)
4. **FETCH**: For each enriched PaperMeta, call `paper_fetching` to download full text as markdown
5. Return enriched PaperMeta[] with `markdownPath` fields populated

## Error Handling
- Scholar returns no results → return empty array, tactic should try alternative query
- paper_searching fails for one result → skip it, continue with others
- paper_fetching fails (no PDF available) → keep PaperMeta without markdownPath, tactic decides whether to skip
