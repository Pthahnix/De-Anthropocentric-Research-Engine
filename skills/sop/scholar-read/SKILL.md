---
name: Scholar Read
description: AI three-pass reading of a paper using Keshav method
type: sop
layer: sop
agent: dare-scholar
tools: [paper_reading]
input: paperMeta (PaperMeta with markdownPath), prompt (optional custom reading focus)
output: PaperReadingReport — structured three-pass analysis
---

# Scholar Read SOP

## Layer Rules
- **Agent**: dare-scholar MCP tool `paper_reading`
- **Called by**: academic-research or web-research tactic
- **Never calls**: other SOPs (leaf node — direct MCP tool wrapper)

## Procedure
1. Receive PaperMeta (with markdownPath) from calling tactic
2. Call `paper_reading({ papers: [{ markdownPath, title }], prompt })` via dare-scholar
3. Return structured reading report to calling tactic
