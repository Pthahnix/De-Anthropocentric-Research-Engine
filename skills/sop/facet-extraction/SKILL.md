---
name: Facet Extraction
description: Extract structured facets (purpose, mechanism, evaluation) from a paper digest
type: sop
layer: sop
agent: dare-agents
tools: [facet_extract]
input: digest (Digest JSON from digest-extraction SOP)
output: Facet[] — array of structured facets
---

# Facet Extraction SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `facet_extract`
- **Called by**: academic-research tactic only
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive `digest` JSON from calling tactic (output of digest-extraction SOP)
2. Call `facet_extract({ digest: JSON.stringify(digest) })` via dare-agents
3. Parse response: array of Facet objects, each with `title`, `purpose`, `mechanism`, `evaluation`, `limitations`
4. Return `Facet[]` to calling tactic

## Input Schema
- `digest`: JSON string — the 3-pass digest from digest-extraction

## Output Schema
```json
[
  {
    "title": "Method name or technique",
    "purpose": "What problem it solves",
    "mechanism": "How it works (algorithmic/architectural detail)",
    "evaluation": "How it was evaluated (benchmarks, metrics, datasets)",
    "limitations": "Known weaknesses or gaps"
  }
]
```
