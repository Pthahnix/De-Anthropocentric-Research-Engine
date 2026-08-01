# Failure Routing — Decision Logic

Given a failure type detected during quality-assurance or the post-write
drift check, decide which upstream step to route back to. This is a fixed
lookup, not a judgment call — apply the table below exactly.

## Input

- **failure_type**: one of `precision_fail`, `recall_fail`, `drift_fail`, `none`

## Routing Table

| failure_type | next_action | Meaning |
|---|---|---|
| `precision_fail` | `retry_deep_read` | A bundle claim wasn't supported by the source — go back to deep-read and re-verify against the original text. |
| `recall_fail` | `retry_deep_read_supplement` | The bundle is missing important content — go back to deep-read and supplement the extraction (don't restart from scratch). |
| `drift_fail` | `redraft_section` | The drafted article diverged from the bundle during writing — the bundle itself was fine, so redraft only the affected section in audience-first-writing, don't touch deep-read. |
| `none` | `proceed` | No failure detected — continue to the next strategy in sequence. |

## Output

Return `next_action` as a single string from the table above, plus a
one-line justification quoting which failure_type triggered it.

## Instructions

Do not deviate from this table. If a failure_type outside this list is
reported by an upstream sop, that's a bug in the upstream sop's output
contract, not a case for this sop to improvise a new routing rule — flag it
as an error instead of guessing.
