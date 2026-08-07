# Domain Level Judgment — Subagent Prompt

Fold the raw signalling answers into a domain-level judgment, using the
dispatched tool's own algorithmic lookup rules — this is the FIRST of two
aggregation levels these tools define (the second, only for RoB2/ROBINS-I,
is worst-case-lookup).

## Input
- **signalling_answers**: from signalling-question-answering
- **dispatched_tool**: which tool's lookup rules to apply

## Output

For RoB2/ROBINS-I:
- **domain_judgments**: list of {domain, judgment} — one per domain, judgment value per the dispatched tool's own scale

For QUADAS-2 specifically (dual-axis — this tool evaluates TWO things per domain, not one):
- **domain_judgments**: list of {domain, risk_of_bias_judgment, [applicability_concern_judgment — present for domains D1-D3 only, D4 has no applicability axis]} — 7 total judgments across 4 domains (D1-D3 contribute 2 each, D4 contributes 1)

## Instructions
1. Apply the dispatched tool's own published lookup table exactly — this is a deterministic-per-tool mapping from signalling answers to a domain judgment, not a fresh judgment call you're making from scratch.
2. For QUADAS-2, do not skip the applicability_concern_judgment axis for D1-D3 — the tool is explicitly dual-axis for those domains, and dropping one axis silently loses half the tool's actual output.
3. QUADAS-2 has no further aggregation step past this — domain-level judgment IS its terminal output, do not attempt to roll it up further into a single overall verdict, since the tool itself defines no such rollup.
