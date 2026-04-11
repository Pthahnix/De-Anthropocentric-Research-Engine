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

## Minimum Yield Standard

<HARD-GATE>
**Hard floor: 8 papers fetched, 5 papers read per invocation.**

If the initial 3 queries yield fewer than 8 papers:
1. Generate 3 ALTERNATE queries using different terminology, synonyms, or broader/narrower scope
2. Try alternate data sources: if Google Scholar failed, try alphaXiv embedding search
3. Try citation tracing: if you found ANY good paper, check its references via paper_reference
4. Expand to adjacent sub-fields if the topic is very narrow

Do NOT return with fewer than 5 papers read unless ALL fallback strategies have been exhausted.
If truly exhausted, document which strategies were tried in the Yield Report.
</HARD-GATE>

## Yield Report

<HARD-GATE>
After execution completes, print this report. The calling strategy uses these numbers
to update its State Ledger. Skipping the yield report is a protocol violation.

### Yield Report: academic-research
| Metric | Count |
|--------|-------|
| Papers searched | ?? |
| Papers successfully fetched | ?? |
| Papers read (full text) | ?? |
| Facets extracted | ?? |
| Failed fetches | ?? |
| Queries used | ?? |
</HARD-GATE>
