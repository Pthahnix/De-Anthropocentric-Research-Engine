---
name: Paper Rating
description: Rate a paper's relevance, quality, and novelty for a specific research topic
type: sop
layer: sop
agent: dare-agents
tools: [paper_rate]
input: digest (Digest JSON), topic (research topic string)
output: Rating — scores + reasoning
---

# Paper Rating SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `paper_rate`
- **Called by**: academic-research tactic only
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive digest + research topic from calling tactic
2. Call `paper_rate({ digest: JSON.stringify(digest), topic })` via dare-agents
3. Parse response: Rating with relevance, quality, novelty scores (0-10) + reasoning
4. Return Rating to calling tactic

## Output Schema
```json
{
  "relevance": 8,
  "quality": 7,
  "novelty": 6,
  "overall": 7.0,
  "reasoning": "This paper directly addresses...",
  "keyInsight": "The main takeaway for our research is..."
}
```
