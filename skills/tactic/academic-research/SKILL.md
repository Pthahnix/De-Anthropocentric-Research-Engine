---
name: Academic Research
description: Orchestrate a single iteration of academic paper discovery — search, read, extract, rate
type: tactic
layer: tactic
calls: [acd-searching, scholar-read, digest-extraction, facet-extraction, paper-rating]
input: queries (string[]), topic (string), knowledge (string), papersRead (string[])
output: NewPapers[] with digests, facets, ratings + updated knowledge
---

# Academic Research Tactic

## Layer Rules
- **Layer**: tactic — orchestrates SOPs, NEVER calls MCP tools directly
- **Called by**: lit-survey strategy, gap-analysis strategy, round strategy
- **Calls**: acd-searching SOP → scholar-read SOP → digest-extraction SOP → facet-extraction SOP → paper-rating SOP

## Procedure

### Phase 1: Search
1. For each query in `queries` (typically 3 queries per iteration):
   - Call **acd-searching SOP** with `{ query, maxResults: 10 }`
   - Deduplicate against `papersRead` — skip already-read papers
2. Collect all new PaperMeta[] (target: 8-12 new papers)

### Phase 2: Read + Extract
3. For each new paper with a `markdownPath`:
   - Call **scholar-read SOP** via dare-scholar `paper_reading` (batch: up to 4 concurrent)
   - Call **digest-extraction SOP** with paper markdown → get Digest
   - Call **facet-extraction SOP** with Digest → get Facet[]
   - Call **paper-rating SOP** with Digest + topic → get Rating

### Phase 3: Filter + Return
4. Sort papers by rating (overall score descending)
5. Return top papers with their digests, facets, and ratings
6. Append paper titles to `papersRead` state

## State Updates
- `papersRead`: extended with newly read paper titles
- `knowledge`: extended with key findings from top-rated papers
