---
name: research-question-appraisal
description: Judge a paper's stated research question against the FINER criteria (Feasible, Interesting, Novel, Ethical, Relevant) — five independent judgments with justification, evaluating the question itself, not the paper's results. Use this whenever the user wants to know whether a paper is asking a good research question, distinct from whether it answered that question well.
version: 1.0.0
category: paper-reading
type: sop
execution: subagent
prompt: ./prompt.md
input: 'source_path (string), meta_path (string)'
reads: 'abstract, introduction, and any limitations or ethics section'
output: 'finer_appraisal (dict — feasible, interesting, novel, ethical, relevant, each with a judgment and one-sentence justification)'
dependencies:
  sops:
  - spawn-agent
---

# Research Question Appraisal

FINER: five independent judgments on the paper's stated research question (not on its execution or results). Structurally closer to a quality-appraisal checklist than to slot-filling — do not merge with question-framing (graph correction M15: PICO/PECO/SPIDER fill slots, FINER judges).

## Execution

Subagent — spawned via spawn-agent skill.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
