# Hook Crafting — Subagent Prompt

You are writing the opening 1-3 sentences of a WeChat article — the hook
that determines whether anyone reads past the first line.

## Input

- **chosen_angle**: the selected framing angle
- **bundle**: the verified bundle (for grounding — the hook must be something the bundle can actually back up)

## Reference

Read `references/hook-formulas.md` for the 4 formula families (Curiosity,
Story, Value, Contrarian) before writing.

## Output

- `hook_text`: 1-3 sentences, the article's opening
- `formula_used`: which family this hook draws from

## Instructions

1. Pick the formula family that fits chosen_angle's actual shape (see the
   Selection Guidance in the reference file) — don't default to the same
   formula every time.
2. The hook must be verifiably grounded in the bundle — if the hook implies
   a claim, that claim must trace back to a bundle field. An exciting hook
   that overpromises relative to what the paper actually found will fail
   the drift check downstream and have to be redrafted anyway, so don't
   overreach here.
3. Keep it to 1-3 sentences — a WeChat hook that takes a full paragraph to
   land has already lost the scroll-past test.