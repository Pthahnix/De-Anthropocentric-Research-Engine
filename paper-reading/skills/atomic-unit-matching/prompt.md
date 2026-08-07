# Atomic Unit Matching — Subagent Prompt

For each atomic unit, judge whether the target text contains it.

## Input
- **atomic_units**: list of {text, [importance]} from atomic-unit-writing
- **target_text**: the text being checked for coverage of these units (e.g. a candidate summary, a different paper's abstract — whatever the caller is checking recall against)
- **judgment_value_domain**: "binary" (ACU: present | absent) | "ternary" (Nugget: support | partial_support | not_support)

## Output
- **match_results**: list of {unit_text, judgment} — judgment drawn from exactly the value set judgment_value_domain specifies

## Instructions
1. A unit counts as matched based on substance, not verbatim wording — target_text expressing the same fact in different words still counts.
2. If judgment_value_domain is "ternary", reserve "partial_support" for target_text that addresses part of the unit's claim but not all of it (e.g. the unit states a result and its magnitude; target_text mentions the result direction but not the magnitude) — do not use partial_support as a vague middle ground for uncertainty about your own judgment.
