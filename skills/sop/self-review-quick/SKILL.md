---
name: Self-Review Quick
description: Single-call self-review using combined C→D→J in one LLM pass
type: sop
layer: sop
agent: dare-agents
tools: [self_review]
input: artifact (JSON string of item to review), artifactType (gap|idea|experiment-design|experiment-result)
output: SelfReviewResult — verdict + reasoning
---

# Self-Review Quick SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `self_review`
- **Called by**: review tactic (P1), or any tactic needing lightweight validation
- **Never calls**: other SOPs (leaf node)
- **Mode**: Single LLM call that combines Critic + Defender + Judge internally

## Procedure
1. Receive artifact + artifactType from calling tactic
2. Call `self_review({ artifact, artifactType })` via dare-agents
3. Parse response: `{ verdict: 'ACCEPT'|'REJECT'|'REVISE', confidence, reasoning, suggestions }`
4. Return result to calling tactic. If verdict is REVISE with confidence < 0.5, tactic may escalate to full multiagent-debate

## When to Use
- Quick validation during iterative loops (low cost, single LLM call)
- First-pass filter before expensive multiagent debate
- NOT for final validation of high-stakes artifacts (use multiagent-debate instead)
