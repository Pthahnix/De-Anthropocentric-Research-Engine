---
name: hook-crafting
description: Write a WeChat article's opening 1-3 sentence hook using one of four formula families (curiosity, story, value, contrarian), grounded in the verified bundle so the hook doesn't overpromise. Use this after angle-selection has chosen the article's framing, before section-drafting-with-style writes the full piece.
execution: subagent
prompt: ./prompt.md
input: chosen_angle (string), bundle (dict)
output: hook_text (string), formula_used (string)
dependencies:
  sops:
  - spawn-agent
---

# Hook Crafting

Writes the article's opening hook using one of 4 formula families, grounded in the bundle to avoid overpromising relative to the paper's actual findings.

## Execution

Subagent — spawned via subagent-spawning/spawn-agent skill.

## Reference

See `references/hook-formulas.md` for the full formula library — read it before drafting, per the Progressive Disclosure pattern (large reference material kept out of this SKILL.md body).

## Source of the Formulas

Adapted inline from the `marketing-skills` plugin's `social` skill — copied rather than imported (design spec §9) so this package works standalone without requiring that plugin.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->