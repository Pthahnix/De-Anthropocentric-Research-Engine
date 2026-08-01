---
name: seven-sweeps-revision
description: Revise a drafted WeChat article through 3 focused editing passes (Clarity, Prove It, Specificity), each checking one dimension before the next runs. Use this after section-drafting-with-style produces the initial article_draft, before the post-write drift check. Named after the copy-editing "Seven Sweeps" framework this is adapted from — v1 implements 3 of the 7 sweeps; the rest are deferred until real usage shows they're needed.
execution: subagent
prompt: ./prompt.md
input: article_draft (string), bundle (dict)
output: revised_article (string), sweep_notes (list of strings)
dependencies:
  sops:
  - spawn-agent
---

# Seven Sweeps Revision (3-Sweep v1)

Sequential focused revision passes: Clarity, Prove It, Specificity. Adapted from the `marketing-skills` plugin's `copy-editing` skill, copied inline per design spec §9.

## Execution

Subagent — spawned via subagent-spawning/spawn-agent skill.

## v1 Scope Note

Only 3 of the framework's original 7 sweeps are implemented (Clarity, Prove It, Specificity) — see `references/sweeps.md` for why these 3 and what's deferred. This is a ponytail-approved trim: the design spec's own `content-faithful` tactic (deferred to v2) already conceded 2 sweeps suffice for a non-persuasion-oriented path; marketing-led keeps one more (Specificity) since a public-audience piece benefits from concreteness-checking, but the full 7 is not built until a real draft shows a gap the 3-sweep version misses (Voice/Tone, So What, Heightened Emotion, or Zero Risk).

## Reference

See `references/sweeps.md` for the exact sweep definitions — read before drafting, per the Progressive Disclosure pattern.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
