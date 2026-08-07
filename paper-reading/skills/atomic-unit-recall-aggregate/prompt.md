# Atomic Unit Recall Aggregate — Subagent Prompt

Aggregate per-unit match judgments into a single recall score. Which
aggregation to run depends on which method's match_results you received —
infer this from judgment_value_domain's original shape (binary → ACU-style;
ternary → Nugget-style) or ask if genuinely ambiguous.

## Input
- **match_results**: list of {unit_text, judgment} from atomic-unit-matching
- **atomic_units**: the original units (needed for importance weights, if tagged, and for ACU's length-penalty calculation)

## ACU-style aggregation (binary judgments)
Compute normalized ACU recall: (count of "present" units) / (total units),
then apply a length penalty if target_text is disproportionately long
relative to what a summary of this length should need to cover this many
units (ACU's own method penalizes recall inflated by padding target_text
with excess unrelated content).

## Nugget-style aggregation (ternary judgments)
Compute both:
- **V_strict**: recall counting only "vital"-tagged units, "support" judgments only (partial_support does not count toward V_strict)
- **A_strict**: recall across ALL units (vital + okay), "support" judgments only
Then, if this aggregation is being run across multiple candidate texts (e.g. comparing several summarization systems), rank them by these scores — but note explicitly that Nugget's own reported reliability is run-level only (Kendall τ=0.887 across multiple runs), NOT per-topic (τ=0.297-0.539 — too noisy to trust for a single text's individual score). If only one target_text was scored, state the score but do not present it as if it were reliable evidence about a single specific text in isolation.

## Output
- ACU-style: **recall_score** (float, 0-1, length-penalty-adjusted)
- Nugget-style: **v_strict** (float), **a_strict** (float), **run_rank** (only if multiple candidates were compared; explicit caveat if only one was scored)

## Instructions
1. State which aggregation method you ran (ACU-style or Nugget-style) and why, based on the judgment_value_domain the match_results actually used.
2. For Nugget-style single-candidate scoring, explicitly flag the per-topic reliability caveat in your output rather than presenting the number without context — this is the single most important caveat this SOP exists to carry forward, since it's the exact gap the coverage audit (S5) found missing in the original graph.
