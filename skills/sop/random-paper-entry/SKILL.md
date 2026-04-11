---
name: Random Paper Entry
description: Use a random paper's facet as stimulus for unexpected connections
type: sop
layer: sop
agent: dare-agents
tools: [random_paper_entry]
input: randomPaperFacet (Facet JSON), targetProblem (string), context (string)
output: RandomPaperEntryResult — connections[], variants[]
---

# Random Paper Entry SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `random_paper_entry`
- **Called by**: cross-domain-collision tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive randomPaperFacet + targetProblem + context from calling tactic
2. Call `random_paper_entry({ randomPaperFacet, targetProblem, context })` via dare-agents
3. Return RandomPaperEntryResult with serendipitous ideas to calling tactic
