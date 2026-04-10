---
name: Scholar Reference
description: Get all references of a paper via Semantic Scholar API
type: sop
layer: sop
agent: dare-scholar
tools: [paper_reference]
input: paperMeta (PaperMeta with at least one of: s2Id, arxivId, doi, title + normalizedTitle)
output: PaperMeta[] — array of reference papers with metadata
---

# Scholar Reference SOP

## Layer Rules
- **Agent**: dare-scholar MCP tool `paper_reference`
- **Called by**: academic-research or web-research tactic
- **Never calls**: other SOPs (leaf node — direct MCP tool wrapper)

## Procedure
1. Receive PaperMeta from calling tactic
2. Call `paper_reference({ title, normalizedTitle, s2Id, arxivId, doi, markdownPath })` via dare-scholar
3. Return PaperMeta[] of all references to calling tactic
