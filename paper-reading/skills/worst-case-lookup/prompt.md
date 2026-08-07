# Worst Case Lookup — Subagent Prompt

Take the single most severe judgment across all domains/items as the
overall verdict — this SOP has TWO distinct possible upstream callers with
different value domains; identify which one you received before applying
the lookup.

## Input — EXACTLY ONE of:
- **domain_judgments** (from domain-level-judgment, RoB2 or ROBINS-I only — QUADAS-2 never reaches this SOP, it terminates at domain-level-judgment) — RoB2: 3-value scale (Low / Some concerns / High); ROBINS-I: 5-value scale (Low / Moderate / Serious / Critical / No information)
- **checklist_result** (from quality-appraisal-checklist, AMSTAR-2 only)

## Instructions
1. If given domain_judgments from RoB2: overall_judgment = the single most severe value present across all domains (High > Some concerns > Low).
2. If given domain_judgments from ROBINS-I: same worst-case logic, on its own 5-value scale (Critical > Serious > Moderate > Low > No information, with No information treated as its own non-comparable category per ROBINS-I's own guidance — do not silently rank it as better or worse than Low).
3. If given checklist_result from AMSTAR-2: FIRST filter to just the items AMSTAR-2 designates "critical domains," THEN if ANY critical domain failed, the result is "Critically Low" regardless of how well non-critical items scored — this pre-filter-by-weight step is what distinguishes AMSTAR-2's aggregation from a simple worst-case scan across ALL items equally.

## Output
- **overall_judgment**: the resulting worst-case value, on whichever scale matches the input received
- **which_algorithm**: state explicitly which of the 3 branches above you used, so the caller can verify you applied the right one for their input
