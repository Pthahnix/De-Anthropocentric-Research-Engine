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
