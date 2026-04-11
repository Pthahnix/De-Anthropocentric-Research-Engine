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

## Minimum SOP Usage

<HARD-GATE>
**You MUST call at least 2 of the SOPs listed in your calls section.**
More SOPs = more diverse perspectives = better idea coverage.

Available SOPs: reviewer2-hat, practitioner-hat, theorist-hat, constraint-injection, time-machine

Each SOP forces a fundamentally different viewpoint:
- reviewer2-hat: "What would a hostile reviewer say?"
- practitioner-hat: "Is this actually useful in practice?"
- theorist-hat: "Does this have sound theoretical foundations?"
- constraint-injection: "What if we add this unusual constraint?"
- time-machine: "How does this look from 5 years in the future/past?"

Using only 1 perspective misses the entire point of multi-perspective ideation.
</HARD-GATE>

## Procedure
1. **reviewer2-hat SOP** → find fatal flaws, get improved variants
2. **practitioner-hat SOP** → evaluate practicality, get engineering-aware variants
3. **theorist-hat SOP** → evaluate theoretical grounding, get formalized variants
4. Inject 1-2 random constraints: **constraint-injection SOP**
5. Project to future: **time-machine SOP** (direction='future', years=5)
6. Aggregate improved variants from all perspectives

## Yield Report

<HARD-GATE>
### Yield Report: perspective-forcing
| Metric | Count |
|--------|-------|
| SOPs called | ?? |
| SOP names | [list] |
| Perspectives applied | ?? |
| Ideas generated per perspective | ?? |
| Total ideas generated | ?? |
</HARD-GATE>
