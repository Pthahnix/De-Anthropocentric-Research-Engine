---
name: Perspective Forcing
description: Orchestrates 5 Cat.4 SOPs for multi-perspective analysis
type: tactic
layer: tactic
calls: [reviewer2-hat, practitioner-hat, theorist-hat, constraint-injection, time-machine]
input: idea (Idea JSON), context
output: Idea[] improved variants from multiple perspectives
---

# Perspective Forcing Tactic (Category 4)

## Procedure
1. **reviewer2-hat SOP** → find fatal flaws, get improved variants
2. **practitioner-hat SOP** → evaluate practicality, get engineering-aware variants
3. **theorist-hat SOP** → evaluate theoretical grounding, get formalized variants
4. Inject 1-2 random constraints: **constraint-injection SOP**
5. Project to future: **time-machine SOP** (direction='future', years=5)
6. Aggregate improved variants from all perspectives
