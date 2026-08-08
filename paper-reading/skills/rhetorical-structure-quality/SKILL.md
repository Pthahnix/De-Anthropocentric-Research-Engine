---
name: rhetorical-structure-quality
description: (Proposal, unverified) Judge whether argumentative relations between unit-classification's rhetorical labels actually hold in a paper (e.g. is an AIM label adequately substantiated by BACKGROUND labels) — a second-order quality judgment over already-classified units, not raw text. Use this after unit-classification has labeled a paper's units with a rhetorical/argumentative label set, when the user wants to know if the paper's argument structure is actually sound, not just what role each sentence plays.
version: 1.0.0
category: paper-reading
type: sop
execution: subagent
prompt: ./prompt.md
input: 'classified_units (list of {unit_text, offset, label})'
output: 'argument_relations (list of {label_a, label_b, relation_holds, justification})'
dependencies:
  sops:
  - spawn-agent
---

# Rhetorical Structure Quality (Proposal)

Second-order SOP: judges whether rhetorical/argumentative labels (from unit-classification) actually substantiate each other, e.g. AIM vs BACKGROUND. Fills a gap in the evaluative-stance × content-layer matrix (quality-judgment × argumentative-rhetorical-role) that no verified method covers — this is a design proposal, not a transcription of an established methodology.

## Execution

Subagent — spawned via spawn-agent skill.

## Proposal Status — Read Before Modifying

This SOP has no primary-source precedent (unlike CoreSC/AZ, which it consumes labels from). Its description explicitly says "(Proposal, unverified)" so it is never triggered with the same implied confidence as a verified method. Do not remove that qualifier from the description without re-validating the method against real usage first.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
