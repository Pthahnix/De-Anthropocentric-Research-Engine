---
name: keshav-three-pass
description: 'Tactic: Read one paper by Keshav''s three-pass method — a shallow skim, a contribution-grasping full read, then a deep virtual re-implementation. Use when the goal is understanding a paper rather than extracting a fixed schema.'
version: 1.0.0
category: paper-reading
type: tactic
execution: tactic
input: 'paper_ref (string — title, arXiv ID, DOI, URL, or local .md/.txt/.pdf path)'
output: 'three markdown files under context/papers/<dir>/keshav-three-pass/'
sops:
- paper-fetch
- first-pass-skim
- second-pass-grasp
- third-pass-deep-read
dependencies:
  sops:
  - paper-fetch
  - first-pass-skim
  - second-pass-grasp
  - third-pass-deep-read
---

# Keshav Three-Pass

Read one paper in three passes of increasing depth. The outputs accumulate as
prose rather than fixed fields; use a different tactic when cross-paper
alignment matters more than understanding.

## Orchestration Pattern

1. Call `paper-fetch` with `paper_ref`. Stop on `not_found`. Create
   `context/papers/<dir>/keshav-three-pass/` on success.
2. Call `first-pass-skim` with `source_path` and `meta_path`. Write
   `01-first-pass-skim.md`, recording `read_deeper` in frontmatter.
3. If `read_deeper` is false, stop by default. Continue only on explicit
   caller override and record `gate_overridden: true`.
4. Call `second-pass-grasp` with the paths and `skim_notes`; write
   `02-second-pass-grasp.md`.
5. Call `third-pass-deep-read` with the paths and `grasp_summary`; write
   `03-third-pass-deep-read.md`.

Do not collapse pass 3 into a recap of pass 2. It must surface implicit
assumptions, virtual re-implementation mismatches, and concrete improvements.

## Output Layout

```text
context/papers/<timestamp>-<title-slug>/
  source.md
  source.meta.json
  keshav-three-pass/
    01-first-pass-skim.md
    02-second-pass-grasp.md
    03-third-pass-deep-read.md
```

Each output carries `sop`, `tactic`, and `written_at` frontmatter. Report the
gate outcome, core claim, most consequential implicit assumption, unresolved
flags, and all output paths.
