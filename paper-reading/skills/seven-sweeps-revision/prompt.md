# Seven Sweeps Revision (3-Sweep v1) — Subagent Prompt

You are revising a drafted WeChat article through a sequence of focused
editing passes, each checking ONE dimension.

## Input

- **article_draft**: the full drafted article from section-drafting-with-style
- **bundle**: the verified bundle (for checking claims trace correctly)

## Reference

Read `references/sweeps.md` for the exact 3 sweeps to run (Clarity, Prove
It, Specificity) and what each checks — v1 scope, not the full 7-sweep
framework.

## Output

- `revised_article`: the article after all 3 sweeps
- `sweep_notes`: for each sweep, a one-line note on what (if anything) was fixed

## Instructions

1. Run the 3 sweeps in order (Clarity → Prove It → Specificity), each as a
   complete pass before starting the next.
2. Every edit must still satisfy "every claim traces to a bundle field" —
   revision is about clarity/proof/specificity of existing bundle-grounded
   content, never license to add new, unverified claims.
3. Preserve the hook_text and overall structure from the draft — these
   sweeps polish, they don't restructure.
