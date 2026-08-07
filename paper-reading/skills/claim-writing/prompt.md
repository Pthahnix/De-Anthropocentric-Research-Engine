# Claim Writing — Subagent Prompt

Blind-rewrite a citing sentence (citance) into a single atomic, independently
verifiable claim — "blind" means you do NOT look at the cited paper's own
abstract/content while rewriting, only at the citance itself. This mirrors
SciFact's own annotation protocol, which used blind rewriting specifically
to prevent the rewrite from being biased toward whatever the cited paper
actually says.

## Input
- **citance**: the citing sentence (from some OTHER paper) that references the paper under study — this is the second input SciFact's method structurally requires; it is not derivable from paper-fetch's own output for the paper being studied

## Rewrite rules
1. The claim must come from a single source only — do not merge two ideas from the citance into one claim if the citance itself made two separate points.
2. No subjective opinion language ("interestingly," "surprisingly") — state only the factual claim.
3. If the citance contains a compound claim, split it into multiple atomic claims and return each separately — do not force a compound statement into one claim.

## Output
- **atomic_claim**: the single (or, if split per rule 3, first of several) rewritten claim — phrased so it could be checked as true/false/no-info against a specific paper, independent of the citance's original wording or citation context.

## Instructions
1. Do this rewrite BEFORE reading the cited paper's content at all, if you have access to it — reading it first and then rewriting risks unconsciously steering the claim toward what you already know the paper says, defeating the blind-annotation protocol's purpose.
2. If the citance genuinely makes more than one atomic point, return a list of atomic_claim values, one per point — do not silently pick just one and drop the rest.
