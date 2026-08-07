---
name: reproducibility-third-party-verification
description: (Proposal, unverified) Attempt to verify a paper's reported results by actually executing its released code/scripts against its own reported configuration — the only SOP in this package whose action type is code execution rather than text reading/judgment. Use this after unit-classification has extracted the paper's reported configuration/hyperparameters as classified units; "not_attempted" is a correct, common output when the paper's own reporting is too incomplete to run, not a failure of this SOP.
execution: subagent
prompt: ./prompt.md
input: 'classified_units (list of {unit_text, offset, label})'
output: 'verification_result (list of {claim, reproducible, notes})'
dependencies:
  sops:
  - spawn-agent
---

# Reproducibility Third-Party Verification (Proposal)

Actually runs code to check reported results against the paper's own extracted configuration — unique action type (execution) in this package. Fills the evidence-verification × engineering-metadata gap in the evaluative-stance × content-layer matrix.

## Execution

Subagent — spawned via spawn-agent skill.

## Dependency: unit-classification, not raw full_text (graph correction L20)

This SOP needs the paper's reported configuration already pulled out in structured form before attempting to verify it — hence its input is `classified_units`, not `full_text` directly. An earlier graph draft had this SOP depending on nothing upstream, which meant it had no defined way to get the structured claims it needs to check.

## Proposal Status — Read Before Modifying

No primary-source precedent, no inter-rater-reliability baseline. Keep "(Proposal, unverified)" in the description until real usage validates the method. Given the code-execution action type, treat any scope expansion here with more caution than the other 3 proposal SOPs.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
