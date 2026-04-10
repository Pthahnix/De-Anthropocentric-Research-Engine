---
name: Scholar Enrich
description: Enrich Scholar results with metadata from arXiv, S2, Unpaywall
type: sop
layer: sop
agent: dare-scholar
tools: [paper_searching]
input: rawResult (single raw Scholar result with title, authors, year, link, snippet)
output: PaperMeta — enriched metadata (abstract, arxivUrl, oaPdfUrl, s2Id, citationCount)
---

# Scholar Enrich SOP

## Layer Rules
- **Agent**: dare-scholar MCP tool `paper_searching`
- **Called by**: academic-research or web-research tactic
- **Never calls**: other SOPs (leaf node — direct MCP tool wrapper)

## Procedure
1. Receive a single raw Scholar result from calling tactic
2. Call `paper_searching({ title, authors, year, link, documentLink, searchMatch })` via dare-scholar
3. Return enriched PaperMeta to calling tactic
