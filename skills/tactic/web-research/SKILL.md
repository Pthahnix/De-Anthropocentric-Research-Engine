---
name: Web Research
description: Orchestrate a single iteration of web content discovery — search, fetch, summarize
type: tactic
layer: tactic
calls: [web-searching, web-read]
input: queries (string[]), topic (string), urlsVisited (string[])
output: WebContent[] with summaries + updated urlsVisited
---

# Web Research Tactic

## Layer Rules
- **Layer**: tactic — orchestrates SOPs, NEVER calls MCP tools directly
- **Called by**: lit-survey strategy, gap-analysis strategy, round strategy
- **Calls**: web-searching SOP → web-read SOP

## Procedure

### Phase 1: Search
1. For each query in `queries` (typically 3 queries per iteration):
   - Call **web-searching SOP** with `{ query, maxResults: 5 }`
   - Deduplicate against `urlsVisited`
2. Collect all new WebMeta[]

### Phase 2: Read + Summarize
3. For each new web page with content:
   - Call **web-read SOP** to get cached markdown content
   - Summarize key points relevant to `topic`
4. Return WebContent[] with summaries

## State Updates
- `urlsVisited`: extended with newly visited URLs
- `knowledge`: extended with key points from web content

## Minimum Yield Standard

<HARD-GATE>
**Hard floor: 5 web pages fetched per invocation.**

If the initial queries yield fewer than 5 pages:
1. Expand query terms: add synonyms, related concepts, or broader scope
2. Try different query patterns: "[topic] tutorial", "[topic] survey", "[topic] comparison"
3. Use Brave search with different keywords if Apify results are insufficient
4. Try domain-specific searches: add "site:arxiv.org", "site:github.com", "site:medium.com"

Do NOT return with fewer than 3 pages fetched unless ALL expansion strategies are exhausted.
</HARD-GATE>

## Yield Report

<HARD-GATE>
### Yield Report: web-research
| Metric | Count |
|--------|-------|
| Queries used | ?? |
| Web pages fetched | ?? |
| Web pages successfully read | ?? |
| Failed fetches | ?? |
| Key findings extracted | ?? |
</HARD-GATE>
