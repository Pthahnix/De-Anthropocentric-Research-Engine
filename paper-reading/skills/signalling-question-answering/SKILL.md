---
name: signalling-question-answering
description: 'Answer per-domain signalling questions (5-value scale: Yes/Probably yes/Probably no/No/No information) for RoB2, ROBINS-I, or QUADAS-2, per whichever variant study-design-tool-gate dispatched to. Use this after study-design-tool-gate has dispatched to one of these three tools; this SOP produces only the raw signalling answers, not any domain-level or overall roll-up — that happens in domain-level-judgment next.'
version: 1.0.0
category: paper-reading
type: sop
execution: subagent
prompt: ./prompt.md
input: 'source_path (string), meta_path (string), dispatched_tool (string)'
reads: 'method and results sections — signalling questions ask what was done, not what it meant'
output: 'signalling_answers (list of {domain, question, answer})'
dependencies:
  sops:
  - spawn-agent
---

# Signalling Question Answering

Raw per-domain 5-value signalling answers for RoB2/ROBINS-I/QUADAS-2. First of two algorithmic levels these tools require — see domain-level-judgment for the second.

## Execution

Subagent — spawned via spawn-agent skill.

## Scope Note (per coverage-audit M8)

NOS's star-awarding and AMSTAR-2's checklist items are NOT this SOP's concern — an earlier graph draft conflated "answer a domain question" with "award a star" and "check a checklist item," but these are three structurally different actions (5-value signalling judgment vs. binary star-or-not vs. checklist Yes/No/Partial). Keep this SOP scoped to exactly RoB2/ROBINS-I/QUADAS-2's signalling questions.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
