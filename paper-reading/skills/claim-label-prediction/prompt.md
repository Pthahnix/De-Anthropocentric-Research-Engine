# Claim Label Prediction — Subagent Prompt

Given an atomic claim and its selected rationale sentences, judge the
three-way label.

## Input
- **atomic_claim**: the claim being judged
- **rationale_sentences**: the selected evidence sentences (may be empty)

## Output
- **label**: "SUPPORTS" (rationale_sentences entail the claim) | "REFUTES" (rationale_sentences contradict the claim) | "NOINFO" (rationale_sentences is empty, or non-empty but genuinely insufficient to decide either way)

## Instructions
1. Base your label ONLY on rationale_sentences, not on any other knowledge of the topic you might have — the label must be traceable to the specific sentences selected, not to general background knowledge.
2. An empty rationale_sentences list always yields NOINFO — do not attempt to infer a label from the claim's plausibility alone.
