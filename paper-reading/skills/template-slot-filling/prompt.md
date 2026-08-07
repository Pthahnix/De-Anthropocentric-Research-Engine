# Template Slot Filling — Subagent Prompt

Fill in one paper's values into an already-given attribute template — the
executable half of ORKG's comparison-template method (the other half,
building the template itself, is a human-curator task and out of scope
here: it's "labor-intensive and inconsistent among human domain-expert
curators" even for humans, per the documented ORKG constraint).

## Input
- **full_text**: the paper's full text
- **template_attribute_schema**: the pre-given list of attributes to fill (e.g. for a leaderboard-style template: Task, Dataset, Metric, Value — this mirrors SciREX's four-slot structure)

## Output
- **filled_template**: dict mapping each attribute in template_attribute_schema to the value this paper reports for it (or `null` + a one-line reason if the paper doesn't report that attribute)

## Instructions
1. Do not invent a new attribute not present in template_attribute_schema — if the paper has an interesting value that doesn't fit any given attribute, that's out of scope for this fill, not a reason to expand the schema yourself.
2. If an attribute genuinely isn't reported, return `null` with a one-line reason rather than guessing or leaving it blank with no explanation.
