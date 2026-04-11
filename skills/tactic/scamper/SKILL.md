---
name: SCAMPER
description: AI selects and applies SCAMPER operations to mutate ideas
type: tactic
layer: tactic
calls: [scamper-substitute, scamper-combine, scamper-adapt, scamper-modify,
  scamper-put-other-use, scamper-eliminate, scamper-reverse]
input: idea (Idea JSON), context (string)
output: Idea[] variants from selected SCAMPER operations
---

# SCAMPER Tactic

## Layer Rules
- **Layer**: tactic — orchestrates SCAMPER SOPs
- **Called by**: structural-deconstruction tactic, idea-augmentation tactic
- **Calls**: 1-3 SCAMPER SOPs selected by AI based on idea characteristics

## Procedure
1. Analyze the idea to determine which SCAMPER operations are most promising:
   - Has replaceable components? → **Substitute**
   - Can merge with another idea? → **Combine** (requires secondIdea)
   - Domain transfer opportunity? → **Adapt**
   - Scale up/down an aspect? → **Modify**
   - Solve a different problem? → **Put Other Use**
   - Simpler version possible? → **Eliminate**
   - Invert something? → **Reverse**
2. Select top 2-3 operations based on analysis
3. Call selected SOP(s) sequentially
4. Aggregate all variants from all operations
5. Return Idea[] variants

## Selection Heuristic
- First run: try Substitute + Eliminate + Reverse (highest novelty potential)
- If idea has clear domain transfer: add Adapt
- If two ideas available: prioritize Combine
