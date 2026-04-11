---
name: Component Surgery
description: AI selects surgical operations to transform an idea's components
type: tactic
layer: tactic
calls: [surgery-subtract, surgery-multiply, surgery-divide, surgery-unify, surgery-redirect]
input: idea (Idea JSON) or method (Method JSON), context (string)
output: Idea[] transformed variants
---

# Component Surgery Tactic

## Layer Rules
- **Layer**: tactic — orchestrates Surgery SOPs
- **Called by**: structural-deconstruction tactic, idea-augmentation tactic

## Minimum Operation Usage

<HARD-GATE>
**You MUST use at least 2 surgery operations.** Single-operation runs produce shallow results.

The 5 surgery operations: subtract, multiply, divide, unify, redirect

Selection guidance:
- Prefer operations that produce CONTRASTING ideas
- Good pairs: subtract + multiply (remove vs add), divide + unify (split vs merge)
- redirect is good as a third operation for lateral thinking
</HARD-GATE>

## Procedure
1. Decompose idea into components (model, data, loss, evaluation, preprocessing)
2. Select surgical operations based on component analysis:
   - Redundant components? → **Subtract**
   - Single-variant component that could be multi? → **Multiply**
   - Monolithic component? → **Divide**
   - Fragmented components? → **Unify**
   - Component serving wrong purpose? → **Redirect**
3. Call selected SOP(s) sequentially
4. Return transformed variants

## Yield Report

<HARD-GATE>
### Yield Report: component-surgery
| Metric | Count |
|--------|-------|
| Operations used | ?? |
| Operation names | [list] |
| Ideas generated per operation | ?? |
| Total ideas generated | ?? |
</HARD-GATE>
