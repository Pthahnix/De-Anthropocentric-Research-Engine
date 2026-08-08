---
name: study-design-tool-gate
description: Classify a paper's study design (RCT, cohort, case-control, diagnostic-accuracy, systematic-review, animal-study, prediction-model, etc., or not_applicable) and dispatch to the correct downstream bias-risk/quality/reporting tool and specific variant (CASP has 8 variants, JBI ~6, RoB2 has parallel/cluster/crossover versions). Use this as the mandatory first step before running ANY of CASP, JBI, AMSTAR-2, NOS, RoB2, ROBINS-I, QUADAS-2, CONSORT, STROBE, ARRIVE, SPIRIT, TRIPOD, or engineering-config-grading — these tools are all study-design-conditional and picking the wrong variant produces meaningless results. It is entirely correct and common for this gate to determine that none of these medically-descended tools applies (e.g. most CS/ML papers) — that is a valid, complete answer, not a failure.
execution: subagent
prompt: ./prompt.md
input: 'source_path (string), meta_path (string)'
reads: 'abstract and method sections only'
output: 'study_design (string), dispatched_tool (string), applicability_reasoning (string)'
dependencies:
  sops:
  - spawn-agent
---

# Study Design Tool Gate

Classifies study design and dispatches to the right bias-risk/quality/reporting tool + variant — or determines none applies. Added per coverage-audit M11: the original graph had no node representing this dispatch decision at all; every A1/A2 tool was drawn as if it started with no gate.

## Execution

Subagent — spawned via spawn-agent skill.

## Reference

`references/tool-dispatch-table.md` — the full dispatch table (every study_design → tool + variant mapping). Read before drafting the prompt's decision, not summarized inline here (kept out of this SKILL.md body per Progressive Disclosure).

## "not_applicable" Is a Correct, Common Answer

This is worth restating: most of these tools carry medical/clinical assumptions baked into their domains, and forcing a dispatch onto a paper that has no matching study design produces a meaningless result, not a conservative one. Do not treat a high not_applicable rate across a batch of CS/ML papers as a sign this SOP is failing to trigger correctly.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
