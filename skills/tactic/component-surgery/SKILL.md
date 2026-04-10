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
