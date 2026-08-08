# Template Slot Filling — Subagent Prompt

Fill in one paper's values into an already-given attribute template — the
executable half of ORKG's comparison-template method (the other half,
building the template itself, is a human-curator task and out of scope
here: it's "labor-intensive and inconsistent among human domain-expert
curators" even for humans, per the documented ORKG constraint).

## Input
- **source_path**: path to the landed paper (`source.md`)
- **meta_path**: path to its section index (`source.meta.json`)
- **template_attribute_schema**: the pre-given list of attributes to fill (e.g. for a leaderboard-style template: Task, Dataset, Metric, Value — this mirrors SciREX's four-slot structure)

Read `../_conventions/reading-the-source.md` before you start.

Use the index to choose sections that could carry each requested attribute.
When an attribute could be anywhere, read the whole paper rather than
guessing. A missing value is valid only after the relevant locations were
actually checked.

## Output
- **filled_template**: dict mapping each attribute in template_attribute_schema to the value this paper reports for it (or `null` + a one-line reason if the paper doesn't report that attribute)

## Instructions
1. Do not invent a new attribute not present in template_attribute_schema — if the paper has an interesting value that doesn't fit any given attribute, that's out of scope for this fill, not a reason to expand the schema yourself.
2. If an attribute genuinely isn't reported, return `null` with a one-line reason rather than guessing or leaving it blank with no explanation.
