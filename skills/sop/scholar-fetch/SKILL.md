---
name: Scholar Fetch
description: Fetch full paper as markdown (cache-first, multi-source fallback)
type: sop
layer: sop
agent: dare-scholar
tools: [paper_fetching]
input: paperMeta (PaperMeta with at least one of: arxivUrl, oaPdfUrl, s2Id)
output: PaperMeta with markdownPath populated — path to cached markdown file
---

# Scholar Fetch SOP

## Layer Rules
- **Agent**: dare-scholar MCP tool `paper_fetching`
- **Called by**: academic-research or web-research tactic
- **Never calls**: other SOPs (leaf node — direct MCP tool wrapper)

## Procedure
1. Receive enriched PaperMeta from calling tactic
2. Call `paper_fetching({ title, arxivId, arxivUrl, oaPdfUrl, s2Id, ... })` via dare-scholar
3. Return PaperMeta with `markdownPath` field populated (or unchanged if fetch failed)
