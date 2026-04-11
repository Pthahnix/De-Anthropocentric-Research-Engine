---
name: Idea Augmentation
description: Improve existing ideas using SCAMPER + Surgery + any IDEATION SOP
type: tactic
layer: tactic
calls: [scamper, component-surgery, reviewer2-hat, constraint-injection, ...]
input: existingIdeas (Idea[]), context
output: Idea[] — improved versions of existing ideas
---

# Idea Augmentation Tactic

## Minimum Augmentation Standard

<HARD-GATE>
**Every idea MUST receive:**
1. A reviewer2-hat critique (mandatory — no exceptions)
2. At least 1 improvement method (scamper OR component-surgery OR other creative method)

Do NOT return an idea that only received reviewer2 critique without any improvement attempt.
Do NOT skip reviewer2 for any idea, even if it seems strong.

The purpose of augmentation is stress-testing AND improving. Both steps are required.
</HARD-GATE>

## Procedure
1. For each existing idea:
   a. Run **reviewer2-hat SOP** → identify weaknesses
   b. Run **scamper tactic** → generate variants that address weaknesses
   c. Run **component-surgery tactic** → structural improvements
2. Optionally: **constraint-injection SOP** for creative constraints
3. Return augmented Idea[] set

## Yield Report

<HARD-GATE>
### Yield Report: idea-augmentation
| Metric | Count |
|--------|-------|
| Ideas received | ?? |
| Ideas critiqued (reviewer2) | ?? |
| Ideas improved (method applied) | ?? |
| Improvement methods used | [list names] |
| Ideas strengthened | ?? |
| Ideas abandoned (too weak) | ?? |
</HARD-GATE>
