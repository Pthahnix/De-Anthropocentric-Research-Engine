# Revision Sweeps (v1: 3 of the 7)

Adapted inline from the `marketing-skills` plugin's `copy-editing` skill
("Seven Sweeps" framework) — copied rather than imported per design spec
§9. v1 implements 3 sweeps (Clarity, Prove It, Specificity); the remaining
4 (Voice and Tone, So What, Heightened Emotion, Zero Risk) are deferred —
see plan Deferred Scope. Run in this order, each pass focused on ONE
dimension only.

## Sweep 1: Clarity

Can a reader understand what's being said, on one read?

Check for:
- Confusing sentence structure
- Unclear pronoun references (which "it"?)
- Jargon left unexplained on first use
- Sentences trying to convey two ideas at once

## Sweep 2: Prove It

Is every claim backed by something concrete?

Check for:
- Any claim not traceable to a specific bundle field (this overlaps with,
  but is not a substitute for, post-write-drift-check — this sweep catches
  it earlier, before the dedicated drift check runs)
- Vague attribution ("研究表明" without saying which result)
- Round numbers that should cite the paper's actual figure

## Sweep 3: Specificity

Is the writing concrete enough to be compelling, without overclaiming?

Check for:
- Vague language ("提升了效果" → cite the actual number from key_result)
- Generic statements that could describe any paper in the field
- Hedge_level mismatches (bundle said "suggests", draft says "证明" — this
  is a Sweep 3 catch, separate from the dedicated hedge-calibration sop
  which is a content-faithful-tactic sop, deferred to v2 — see plan
  Deferred Scope; marketing-led relies on this sweep for hedge fidelity)

## Process

1. Do one sweep completely before starting the next — don't try to fix
   everything in one read.
2. After each sweep, briefly re-check the previous sweep(s) weren't broken
   by this sweep's edits (e.g. a Specificity fix that added a number
   should still read clearly per Sweep 1).
3. If a sweep finds nothing to fix, say so explicitly — don't invent edits
   to seem thorough.
