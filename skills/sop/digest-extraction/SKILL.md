---
name: Digest Extraction
description: Generate a structured 3-pass Keshav digest from a paper's markdown content
type: sop
layer: sop
agent: dare-agents
tools: [digest_extract]
input: paperMarkdown (full paper text), paperMeta (title, authors, year)
output: Digest — structured 3-pass reading result
---

# Digest Extraction SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `digest_extract`
- **Called by**: academic-research tactic only
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive paper markdown + metadata from calling tactic
2. Call `digest_extract({ paperMarkdown, title, authors, year })` via dare-agents
3. Parse response: Digest object with pass1 (skim), pass2 (detailed), pass3 (deep)
4. Return Digest to calling tactic

## Input Schema
- `paperMarkdown`: string — full paper text as markdown
- `title`: string — paper title
- `authors`: string — paper authors
- `year`: number — publication year

## Output Schema
```json
{
  "pass1": {
    "category": "empirical|theoretical|survey|position",
    "mainContribution": "One sentence",
    "relevance": "high|medium|low"
  },
  "pass2": {
    "keyFindings": ["..."],
    "methodology": "...",
    "strengths": ["..."],
    "weaknesses": ["..."]
  },
  "pass3": {
    "detailedAnalysis": "...",
    "connections": ["..."],
    "openQuestions": ["..."]
  }
}
```
