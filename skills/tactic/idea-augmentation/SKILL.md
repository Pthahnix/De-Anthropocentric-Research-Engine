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

## Procedure
1. For each existing idea:
   a. Run **reviewer2-hat SOP** → identify weaknesses
   b. Run **scamper tactic** → generate variants that address weaknesses
   c. Run **component-surgery tactic** → structural improvements
2. Optionally: **constraint-injection SOP** for creative constraints
3. Return augmented Idea[] set
