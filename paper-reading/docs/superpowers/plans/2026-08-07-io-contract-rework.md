# Paper-Reading v2 I/O Contract Rework — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every SOP's hardcoded `full_text` input with a path-plus-section-index contract, then build five tactics that orchestrate those SOPs into complete reading workflows.

**Architecture:** `paper-fetch` lands each paper once at `context/papers/<timestamp>-<title-slug>/source.md` with a companion `source.meta.json` holding line-number ranges per heading. Downstream SOPs receive `source_path` + `meta_path` and do their own offset reads against the index, so an SOP needing 5% of a paper pays for 5%. Tactics are pure orchestration — they declare which SOPs run in what order and what each receives, and contain no executable logic of their own, because in DARE's four-layer model (campaign → strategy → tactic → SOP) only SOPs do work.

**Tech Stack:** Markdown skills with YAML frontmatter (no runtime code), Python 3 for the validator, pytest for validator tests.

## Global Constraints

- **Work in `d:\YOGSOTH-AI\de-anthropocentric-research-engine\paper-reading\`.** This is the development location. The standalone repo `d:\YOGSOTH-AI\paper-reading\` receives a sync at the very end (Task 17) and must not be edited before then.
- **Commit and push after every single task.** One task = one commit = one `git push`. Never batch two tasks into one commit. Commits happen from the DARE repo root (`d:\YOGSOTH-AI\de-anthropocentric-research-engine\`) with paths prefixed `paper-reading/`.
- **Push target is `origin main`** on the DARE repo. This repo is maintained publicly; frequent small commits are intentional, not accidental.
- **Every landed filename and directory name is lowercase.** Slugs: lowercase, runs of non-alphanumerics collapsed to a single hyphen, Windows-illegal characters (`: * ? " < > |`) dropped, truncated to 60 chars at a hyphen boundary (Windows 260-char path limit).
- **Platform is Windows.** Shell is PowerShell or Git Bash. Do not emit `NUL`, backslash-escaped continuations, or PowerShell here-strings in committed content.
- **DARE frontmatter convention** for every skill: `name`, `description`, `version: 1.0.0`, `category: paper-reading`, `type: sop` or `type: tactic`, then `execution`, `prompt`, `input`, `output`, `dependencies`. Order matters for readability; the validator only checks presence.
- **`input:`/`output:` values are single-quoted YAML strings in prose-ish form**, matching DARE's existing style (e.g. `input: 'system architecture description, component list'`). Not JSON schema.
- **Body of any SKILL.md stays under 500 lines** (spec §7). Bulk reference material goes in that skill's `references/` subdirectory.
- **No new `execution:` values.** The existing enum across DARE is `subagent`, `campaign`, `strategy`, `tactic`, `sop`, `sequential`, `dialogue`, `import`, `entry`, `reference`. Every SOP here stays `execution: subagent`; every tactic is `execution: tactic`.
- **Do not edit files under `context/`** except where a task explicitly says to. Those are historical research records. In particular the node-name drift in `context/2026-08-07-13-42-sop-pipeline-graph.html` (`third-pass-verify` vs the real directory `third-pass-deep-read`) is left as-is; it is a record of what was decided then.
- **Verification for every task:** `python scripts/validate_skill.py <each changed SKILL.md>` must print `No errors found`, and `python -m pytest tests/ -q` must pass. Run both before every commit.
- **The shared read protocol is temporary.** Keep `skills/_conventions/reading-the-source.md` as the single source while Tasks 2-15 are under development. Before the final standalone sync, Task 16 must copy that file into each of the 19 consuming SOP directories as `reading-the-source.md` and change each prompt to reference `./reading-the-source.md`. Do not leave those SOPs dependent on `_conventions/` at runtime.

## Already Done — Do Not Redo

`skills/paper-fetch/` was reworked and pushed before this plan was written. It already lands files, builds the section index, checks the cache, and carries `version`/`category`/`type`. Read it before Task 1 — it is the reference implementation every other SOP's contract must match. Do not modify it except where Task 13 says to.

## File Structure

| Path | Responsibility |
|---|---|
| `skills/_conventions/reading-the-source.md` | **Temporary during development.** The shared section-index read protocol, copied into all 19 consuming prompts by Task 16 before release. |
| `skills/<19 sops>/SKILL.md` + `prompt.md` | Contract migrated from `full_text` to `source_path` + `meta_path`. |
| `skills/<30 sops>/SKILL.md` | Three frontmatter keys added. |
| `skills/keshav-three-pass/SKILL.md` | **New tactic.** 4-SOP accumulating chain. |
| `skills/qalmri-worksheet/SKILL.md` | **New tactic.** 2-SOP minimal chain. |
| `skills/argumentative-zoning/SKILL.md` | **New tactic.** 3-SOP segment-then-label chain. |
| `skills/acu-nugget-recall/SKILL.md` | **New tactic.** 4-SOP chain with external `target_summary` input. |
| `skills/reforms-grading/SKILL.md` | **New tactic.** 3-SOP gated chain. |
| `scripts/validate_skill.py` | Add three required fields; add tactic→SOP closure check. |
| `tests/test_validate_skill.py` | Tests for the new validator rules. |
| `context/2026-08-07-23-01-sop-io-contract-simulation.md` | Append one checkpoint recording the decisions this plan implements. |
| `README.md` | Update to describe the tactic layer and the landing convention. |

---

### Task 1: The shared read protocol (development source)

Nineteen prompts need to be told how to read a paper via the index. Keep one canonical copy during development; Task 16 inlines it into every consuming prompt before release.

**Files:**
- Create: `skills/_conventions/reading-the-source.md`

**Interfaces:**
- Consumes: nothing.
- Produces: a document at a fixed path that Tasks 2-8 reference by the exact line `Read `../_conventions/reading-the-source.md` before you start.`

- [ ] **Step 1: Create the file with this exact content**

````markdown
# Reading the Source

Every reading SOP in this package receives two paths from `paper-fetch`
rather than the paper's text:

- **source_path** — the paper as fetched, e.g.
  `context/papers/2026-08-07-23-01-kimi-k3-scaling/source.md`
- **meta_path** — its companion index, e.g.
  `context/papers/2026-08-07-23-01-kimi-k3-scaling/source.meta.json`

## Read the index first

`source.meta.json` looks like this:

```json
{
  "identifier": "arXiv:2607.24653",
  "title": "the paper's title as retrieved",
  "title_slug": "the-slug",
  "source_channel": "alphaxiv",
  "source_url": "https://...",
  "fetched_at": "2026-08-07T23:01",
  "total_lines": 1240,
  "sections": {
    "abstract": [12, 34],
    "1 introduction": [36, 118],
    "3 method": [200, 445],
    "6 conclusion": [890, 920]
  },
  "figure_captions": [145, 203, 288, 402]
}
```

- `sections` keys are the paper's own headings, lowercased, in document
  order. Values are `[first_line, last_line]`, 1-indexed and inclusive.
- `figure_captions` is a flat list of line numbers, not ranges — captions
  are scattered rather than contiguous.

The index is small. Always read it in full before touching `source.md`.

## Then read only what your task needs

Use your file-reading tool's offset and limit parameters against
`source_path`. To read `3 method` from the example above: offset 200, limit
246 (`445 - 200 + 1`).

If your SOP's own prompt names the sections it needs, read those and stop.
Reading the whole paper when you were told to read two sections is not
thoroughness — it defeats the reason this contract exists, and for some SOPs
it breaks a methodological constraint (`first-pass-skim` is defined by *not*
reading section bodies).

## Matching section names

Heading text varies between papers: `3 method`, `methods`,
`3 our approach`, `methodology`. Match on meaning, not string equality. If
your prompt asks for "method" and the paper calls it `3 our approach`, that
is the section you want.

If a section your prompt names genuinely has no counterpart in this paper,
say so explicitly in your output. Do not silently substitute a different
section, and do not fall back to reading everything.

## When the index is unusable

If `sections` is `{}` or the file carries `"index_reliable": false`, the
paper's heading structure could not be indexed. Read `source.md` in full and
say in your output that you did so because the index was unavailable. This
is a documented degradation path, not an error to work around silently.

## Never quote what you did not read

Every quote you produce must come from a range you actually read from
`source.md`. Do not reconstruct a quote from memory of the paper, and do not
paraphrase and present it as a quote. If you need a verbatim quote from a
section you did not read, read that section first.
````

- [ ] **Step 2: Verify the file has no frontmatter and is not picked up as a skill**

Run from `paper-reading/`:
```bash
python scripts/validate_skill.py skills/_conventions/reading-the-source.md
```
Expected: `ERROR: No YAML frontmatter found (file must start with '---')`

That error is the correct outcome — this is a reference document, not a skill. Confirm the file is not named `SKILL.md`, so no skill-discovery scan will treat it as one.

- [ ] **Step 3: Commit and push**

From the DARE repo root:
```bash
git add paper-reading/skills/_conventions/reading-the-source.md
git commit -m "Add shared section-index read protocol for reading SOPs

Nineteen SOP prompts are about to be migrated from receiving the paper as
\`full_text\` to receiving \`source_path\` + \`meta_path\`. Each needs the same
explanation of how to read the index and do offset reads against it.

Writing that into nineteen prompts means nineteen copies that drift. This
is the single copy they reference.

Covers: reading the index first, offset-reading only the named sections,
matching heading names by meaning rather than string equality, the
\`index_reliable: false\` degradation path, and the rule that a quote must
come from a range actually read rather than from memory of the paper.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
git push origin main
```

---

### Task 2: Migrate the Keshav chain contracts

Three SOPs, one accumulating chain. This task establishes the migration pattern that Tasks 3-8 repeat.

**Files:**
- Modify: `skills/first-pass-skim/SKILL.md` (line 6), `skills/first-pass-skim/prompt.md`
- Modify: `skills/second-pass-grasp/SKILL.md` (line 6), `skills/second-pass-grasp/prompt.md`
- Modify: `skills/third-pass-deep-read/SKILL.md` (line 6), `skills/third-pass-deep-read/prompt.md`

**Interfaces:**
- Consumes: `skills/_conventions/reading-the-source.md` from Task 1.
- Produces: the contract shape `input: 'source_path (string), meta_path (string), ...'` that Tasks 3-8 follow, and the `reads:` frontmatter key that Task 9's validator does *not* require (it is documentation, optional, present only on SOPs doing partial reads).

- [ ] **Step 1: `first-pass-skim/SKILL.md` — replace line 6**

Find:
```yaml
input: 'full_text (string)'
```
Replace with:
```yaml
input: 'source_path (string), meta_path (string)'
reads: 'title, abstract, all headings, figure captions, conclusion — never section bodies'
```

- [ ] **Step 2: `first-pass-skim/prompt.md` — replace the Input block**

Find:
```markdown
## Input

- **full_text**: the paper's full text (from paper-fetch)
```
Replace with:
````markdown
## Input

- **source_path**: path to the landed paper (`source.md`)
- **meta_path**: path to its section index (`source.meta.json`)

Read `../_conventions/reading-the-source.md` before you start.

## What you may read

From the index, read only: the title, the `abstract` range, the full list of
`sections` **keys** (the heading text alone — not the line ranges' contents),
the lines listed in `figure_captions`, and the conclusion range.

You may not read section bodies. This is not a cost optimization — it is
what makes this a first pass. Keshav's method works because the first pass
is shallow enough to be cheap enough to run on papers you end up rejecting.
A first pass that reads the body has no first-pass judgment left to make.

If the index is unusable (`sections: {}` or `index_reliable: false`), read
only the first 40 lines of `source.md` plus its last 40, and say in
`skim_notes` that you worked from a degraded index.
````

- [ ] **Step 3: `second-pass-grasp/SKILL.md` — replace line 6**

Find:
```yaml
input: 'full_text (string), skim_notes (string)'
```
Replace with:
```yaml
input: 'source_path (string), meta_path (string), skim_notes (string)'
reads: 'full paper body; skips proofs and derivations by instruction, not by omission'
```

- [ ] **Step 4: `second-pass-grasp/prompt.md` — replace the Input block**

Find:
```markdown
## Input

- **full_text**: the paper's full text
- **skim_notes**: output from first-pass-skim
```
Replace with:
```markdown
## Input

- **source_path**: path to the landed paper (`source.md`)
- **meta_path**: path to its section index (`source.meta.json`)
- **skim_notes**: output from first-pass-skim

Read `../_conventions/reading-the-source.md` before you start.

## What you may read

The whole paper. This pass genuinely needs it — read `source.md` in full.

`skim_notes` tells you which parts the first pass flagged as load-bearing;
use it to decide where to slow down, not to decide what to skip.
```

- [ ] **Step 5: `third-pass-deep-read/SKILL.md` — replace line 6**

Find:
```yaml
input: 'full_text (string), grasp_summary (string)'
```
Replace with:
```yaml
input: 'source_path (string), meta_path (string), grasp_summary (string)'
reads: 'full paper body including proofs and derivations'
```

- [ ] **Step 6: `third-pass-deep-read/prompt.md` — replace the Input block**

Find:
```markdown
## Input

- **full_text**: the paper's full text
- **grasp_summary**: output from second-pass-grasp (including anything it
  flagged as needing deeper scrutiny)
```
Replace with:
```markdown
## Input

- **source_path**: path to the landed paper (`source.md`)
- **meta_path**: path to its section index (`source.meta.json`)
- **grasp_summary**: output from second-pass-grasp (including anything it
  flagged as needing deeper scrutiny)

Read `../_conventions/reading-the-source.md` before you start.

## What you may read

The whole paper, including everything the second pass skipped — proofs,
derivations, appendices, supplementary sections listed in the index.

Every item `grasp_summary` flagged must be resolved against text you
actually read here, not against your recollection of the second pass.
```

- [ ] **Step 7: Validate**

Run from `paper-reading/`:
```bash
python scripts/validate_skill.py skills/first-pass-skim/SKILL.md
python scripts/validate_skill.py skills/second-pass-grasp/SKILL.md
python scripts/validate_skill.py skills/third-pass-deep-read/SKILL.md
```
Expected: `No errors found` three times.

- [ ] **Step 8: Confirm no `full_text` remains in these three**

```bash
grep -rn "full_text" skills/first-pass-skim/ skills/second-pass-grasp/ skills/third-pass-deep-read/
```
Expected: no output. If any line matches, it was missed above — fix it before committing.

- [ ] **Step 9: Commit and push**

```bash
git add paper-reading/skills/first-pass-skim/ paper-reading/skills/second-pass-grasp/ paper-reading/skills/third-pass-deep-read/
git commit -m "Migrate Keshav chain to path-based source contract

The three passes now receive \`source_path\` + \`meta_path\` instead of
\`full_text\`, and each declares in a \`reads:\` key what it actually reads.

The interesting one is first-pass-skim. Its defining constraint is that it
reads headings and captions but never section bodies — that is what makes
it a first pass rather than a cheap second pass. Under the old contract the
full text was handed to it and the constraint survived on self-restraint.
Now it is given the index and told to read heading keys, the abstract
range, and the caption lines, so the bodies are never in its window at all.

Passes 2 and 3 genuinely need the whole paper and read it in full. There is
no cost saving available there and none is attempted.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
git push origin main
```

---

### Task 3: Migrate the single-shot reading SOPs

Four SOPs that read a paper and produce one artifact, with no chain around them.

**Files:**
- Modify: `skills/qalmri/SKILL.md`, `skills/qalmri/prompt.md`
- Modify: `skills/qasper-evidence-qa/SKILL.md`, `skills/qasper-evidence-qa/prompt.md`
- Modify: `skills/research-question-appraisal/SKILL.md`, `skills/research-question-appraisal/prompt.md`
- Modify: `skills/template-slot-filling/SKILL.md`, `skills/template-slot-filling/prompt.md`

**Interfaces:**
- Consumes: the contract shape from Task 2.
- Produces: nothing new.

- [ ] **Step 1: `qalmri` — frontmatter and prompt**

In `SKILL.md`, find `input: 'full_text (string)'` and replace with:
```yaml
input: 'source_path (string), meta_path (string)'
reads: 'full paper — all six QALMRI slots draw on different parts'
```

In `prompt.md`, find:
```markdown
## Input
- **full_text**: the paper's full text
```
Replace with:
```markdown
## Input
- **source_path**: path to the landed paper (`source.md`)
- **meta_path**: path to its section index (`source.meta.json`)

Read `../_conventions/reading-the-source.md` before you start.

Read the whole paper. The six slots draw on different parts of it —
Question and Alternatives from the introduction and related work, Logic and
Method from the method section, Results from results and tables, Inference
from the discussion — so there is no useful subset to restrict to.
```

- [ ] **Step 2: `qasper-evidence-qa` — frontmatter and prompt**

In `SKILL.md`, find `input: 'full_text (string), question (string)'` and replace with:
```yaml
input: 'source_path (string), meta_path (string), question (string)'
reads: 'full paper — the answering span may be anywhere'
```

In `prompt.md`, find the line reading `- **full_text**: the paper's full text` and replace that line with:
```markdown
- **source_path**: path to the landed paper (`source.md`)
- **meta_path**: path to its section index (`source.meta.json`)
```
Then immediately after the Input block's last bullet, add:
```markdown

Read `../_conventions/reading-the-source.md` before you start.

Read the whole paper. You cannot know in advance which section answers the
question, and `evidence_spans` must be verbatim from text you actually read
— a span quoted from a section you skipped is fabricated evidence, which is
the one failure mode this SOP exists to prevent.
```

- [ ] **Step 3: `research-question-appraisal` — frontmatter and prompt**

In `SKILL.md`, find `input: 'full_text (string)'` and replace with:
```yaml
input: 'source_path (string), meta_path (string)'
reads: 'abstract, introduction, and any limitations or ethics section'
```

In `prompt.md`, find the line `- **full_text**: the paper's full text` and replace it with:
```markdown
- **source_path**: path to the landed paper (`source.md`)
- **meta_path**: path to its section index (`source.meta.json`)
```
Then after that block add:
```markdown

Read `../_conventions/reading-the-source.md` before you start.

Read the `abstract` and introduction ranges, plus any limitations, ethics,
or broader-impact section the index lists. FINER judges the research
question itself — Feasible, Interesting, Novel, Ethical, Relevant — and the
question is stated in the front matter. Results do not change whether the
question was worth asking.

If you cannot judge Ethical from those sections because the paper has no
ethics or impact statement, say that rather than reading further to hunt
for one; the absence is itself the finding.
```

- [ ] **Step 4: `template-slot-filling` — frontmatter and prompt**

In `SKILL.md`, find `input: 'full_text (string), template_attribute_schema (list of strings)'` and replace with:
```yaml
input: 'source_path (string), meta_path (string), template_attribute_schema (list of strings)'
reads: 'sections relevant to the requested attributes; the whole paper if the schema is broad'
```

In `prompt.md`, find the line `- **full_text**: the paper's full text` and replace it with:
```markdown
- **source_path**: path to the landed paper (`source.md`)
- **meta_path**: path to its section index (`source.meta.json`)
```
Then after that block add:
```markdown

Read `../_conventions/reading-the-source.md` before you start.

Which sections you need depends on `template_attribute_schema`. Read the
index, decide which sections could plausibly carry each requested
attribute, and read those. When an attribute could be anywhere, read the
whole paper rather than guessing — a `null` returned because you did not
look is different from a `null` because the paper does not report it, and
this SOP's output is only useful if the caller can trust that difference.
```

- [ ] **Step 5: Validate all four**

```bash
python scripts/validate_skill.py skills/qalmri/SKILL.md
python scripts/validate_skill.py skills/qasper-evidence-qa/SKILL.md
python scripts/validate_skill.py skills/research-question-appraisal/SKILL.md
python scripts/validate_skill.py skills/template-slot-filling/SKILL.md
```
Expected: `No errors found` four times.

- [ ] **Step 6: Confirm no `full_text` remains**

```bash
grep -rn "full_text" skills/qalmri/ skills/qasper-evidence-qa/ skills/research-question-appraisal/ skills/template-slot-filling/
```
Expected: no output.

- [ ] **Step 7: Commit and push**

```bash
git add paper-reading/skills/qalmri/ paper-reading/skills/qasper-evidence-qa/ paper-reading/skills/research-question-appraisal/ paper-reading/skills/template-slot-filling/
git commit -m "Migrate single-shot reading SOPs to path-based source contract

Four SOPs that read a paper and emit one artifact, with no chain around
them: qalmri, qasper-evidence-qa, research-question-appraisal,
template-slot-filling.

Two of them save real cost. research-question-appraisal only needs the
abstract, introduction, and any ethics section — FINER judges the research
question, which is stated in the front matter, and results do not change
whether the question was worth asking. template-slot-filling reads whichever
sections its requested attributes could live in.

The other two read everything and say why: QALMRI's six slots draw on
different parts of the paper, and qasper-evidence-qa cannot know in advance
which section answers the question. For qasper the rule is stated sharply,
because a span quoted from a section that was skipped is fabricated
evidence — the exact failure this SOP exists to prevent.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
git push origin main
```

---

### Task 4: Migrate the gate and the unit chain head

**Files:**
- Modify: `skills/study-design-tool-gate/SKILL.md`, `skills/study-design-tool-gate/prompt.md`
- Modify: `skills/unit-segmentation/SKILL.md`, `skills/unit-segmentation/prompt.md`

**Interfaces:**
- Consumes: the contract shape from Task 2.
- Produces: `unit-segmentation` now emits `unit_offsets` as **line-and-character offsets into `source.md`**, not into an in-memory string. Task 5's `unit-classification` and Task 12's `argumentative-zoning` tactic both depend on this.

- [ ] **Step 1: `study-design-tool-gate/SKILL.md` — replace line 6**

Find `input: 'full_text (string)'` and replace with:
```yaml
input: 'source_path (string), meta_path (string)'
reads: 'abstract and method sections only'
```

- [ ] **Step 2: `study-design-tool-gate/prompt.md` — replace the Input block**

Find:
```markdown
## Input
- **full_text**: the paper's full text
```
Replace with:
```markdown
## Input
- **source_path**: path to the landed paper (`source.md`)
- **meta_path**: path to its section index (`source.meta.json`)

Read `../_conventions/reading-the-source.md` before you start.

Read the `abstract` range and the method section. A paper's study design is
declared in those two places — if it is an RCT, the abstract says so and the
method describes the randomization. Results and discussion do not change
what design was run.

The most common correct answer for a CS/ML paper is `not_applicable`, and
you can usually reach it from the abstract alone. Reading the whole paper
looking for something to dispatch to is how a gate turns into a force-fit.
```

- [ ] **Step 3: `unit-segmentation/SKILL.md` — replace lines 6-7**

Find:
```yaml
input: 'full_text (string), segmentation_granularity (string: "sentence" | "clause"), scope (string: "full_text" | "abstract" | "intro_only")'
output: 'units (list of strings), unit_offsets (list of {start: int, end: int})'
```
Replace with:
```yaml
input: 'source_path (string), meta_path (string), segmentation_granularity (string: "sentence" | "clause"), scope (string: "full_text" | "abstract" | "intro_only")'
output: 'units (list of strings), unit_offsets (list of {line: int, start: int, end: int} — line is 1-indexed into source.md, start/end are character offsets within that line)'
reads: 'exactly the range named by scope'
```

- [ ] **Step 4: `unit-segmentation/prompt.md` — replace the Input block**

Find:
```markdown
## Input
- **full_text**: the paper's full text
- **segmentation_granularity**: "sentence" or "clause" (clause = further split on commas/semicolons within a sentence, matching CODA-19's own approach: 103,978 sentences → 168,286 clause-level fragments)
- **scope**: "full_text" | "abstract" | "intro_only" — which part of full_text to segment (Swales move analysis, for instance, is scoped to the introduction only)
```
Replace with:
```markdown
## Input
- **source_path**: path to the landed paper (`source.md`)
- **meta_path**: path to its section index (`source.meta.json`)
- **segmentation_granularity**: "sentence" or "clause" (clause = further split on commas/semicolons within a sentence, matching CODA-19's own approach: 103,978 sentences → 168,286 clause-level fragments)
- **scope**: "full_text" | "abstract" | "intro_only" — which part of the paper to segment (Swales move analysis, for instance, is scoped to the introduction only)

Read `../_conventions/reading-the-source.md` before you start.

`scope` maps directly onto the index: `abstract` is the `abstract` range,
`intro_only` is the introduction range, `full_text` is the whole file. Read
exactly that range and nothing more — the caller chose a narrow scope for a
methodological reason, and segmenting past it produces units that the
downstream label set was never defined over.
```

- [ ] **Step 5: `unit-segmentation/prompt.md` — replace the offsets bullet in the Output block**

Find:
```markdown
- **unit_offsets**: ordered list of {start, end} character offsets into full_text, one per unit, so a downstream SOP can cite exact locations rather than re-searching for the text
```
Replace with:
```markdown
- **unit_offsets**: ordered list of `{line, start, end}`, one per unit — `line` is the 1-indexed line number in `source.md`, `start`/`end` are character offsets within that line. A unit spanning a line break gets the line where it starts.

  Line-anchored offsets, rather than offsets into one flat string, are what
  let a downstream SOP re-read a specific unit with an offset read instead
  of loading the whole paper to count characters.
```

- [ ] **Step 6: Validate**

```bash
python scripts/validate_skill.py skills/study-design-tool-gate/SKILL.md
python scripts/validate_skill.py skills/unit-segmentation/SKILL.md
```
Expected: `No errors found` twice.

- [ ] **Step 7: Confirm no `full_text` remains as an input reference**

```bash
grep -rn "full_text" skills/study-design-tool-gate/ skills/unit-segmentation/
```
Expected: only matches where `"full_text"` is a **value** of the `scope` parameter in `unit-segmentation` (the quoted string in the input declaration and the prompt's scope bullet). Those are correct and must stay — `scope: "full_text"` means "segment the whole paper", which is unrelated to the old input field of the same name. Any match that refers to an input field is a miss; fix it.

- [ ] **Step 8: Commit and push**

```bash
git add paper-reading/skills/study-design-tool-gate/ paper-reading/skills/unit-segmentation/
git commit -m "Migrate gate and unit-chain head to path-based source contract

study-design-tool-gate now reads the abstract and method sections only. A
study design is declared in those two places, and for a CS/ML paper the
correct answer is usually \`not_applicable\` reachable from the abstract
alone. Handing it the whole paper invited exactly the force-fit its own
prompt warns against.

unit-segmentation reads precisely the range its \`scope\` parameter names.
Its offsets also change shape: \`{line, start, end}\` anchored to line
numbers in source.md, rather than character offsets into one flat string.
That is what lets a downstream SOP re-read a single unit with an offset read
instead of loading the whole paper to count characters to it.

Note \`scope: \"full_text\"\` survives as a parameter value and is unrelated
to the retired input field of the same name — it means \"segment the whole
paper\".

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
git push origin main
```

---

### Task 5: Migrate the ACU/Nugget family and unit-classification's offsets

`unit-classification` and `atomic-unit-matching` never took `full_text`, but both carry offsets or text that the new shape touches.

**Files:**
- Modify: `skills/atomic-unit-writing/SKILL.md`, `skills/atomic-unit-writing/prompt.md`
- Modify: `skills/unit-classification/SKILL.md` (line 6 only), `skills/unit-classification/prompt.md`

**Interfaces:**
- Consumes: `unit_offsets` shape from Task 4.
- Produces: `atomic_units` unchanged; `classified_units` now carries the `{line, start, end}` offset shape.

- [ ] **Step 1: `atomic-unit-writing/SKILL.md` — replace line 6**

Find `input: 'full_text (string), unit_source (string: "extracted" | "authored"), importance_tagging_toggle (boolean)'` and replace with:
```yaml
input: 'source_path (string), meta_path (string), unit_source (string: "extracted" | "authored"), importance_tagging_toggle (boolean)'
reads: 'abstract only — both ACU and Nugget define their units over the reference summary'
```

- [ ] **Step 2: `atomic-unit-writing/prompt.md` — replace the first Input bullet**

Find:
```markdown
- **full_text**: the paper's full text
```
Replace with:
```markdown
- **source_path**: path to the landed paper (`source.md`)
- **meta_path**: path to its section index (`source.meta.json`)
```

- [ ] **Step 3: `atomic-unit-writing/prompt.md` — add the read scope after the Input block**

Immediately after the `importance_tagging_toggle` bullet (the last one in the Input block), add:
```markdown

Read `../_conventions/reading-the-source.md` before you start.

Read the `abstract` range only. Both source methods define their units over
the paper's own reference summary — ACU extracts atomic facts from it,
Nugget authors short statements covering the same ground. Units drawn from
the full body would not be the reference set either method's recall score is
defined against, so the score would no longer mean what the method says it
means.

If the paper has no abstract in the index, read its first 60 lines and note
in your output that you substituted the opening for a missing abstract.
```

- [ ] **Step 4: `unit-classification/SKILL.md` — replace line 6**

Find:
```yaml
input: 'units (list of strings), unit_offsets (list of {start, end}), label_set (string — name of the label vocabulary), hierarchy_toggle (boolean), output_type (string: "single_label" | "span_level" | "tuple")'
```
Replace with:
```yaml
input: 'units (list of strings), unit_offsets (list of {line, start, end}), label_set (string — name of the label vocabulary), hierarchy_toggle (boolean), output_type (string: "single_label" | "span_level" | "tuple")'
```

- [ ] **Step 5: `unit-classification/prompt.md` — replace the offsets bullet**

Find:
```markdown
- **unit_offsets**: matching offsets
```
Replace with:
```markdown
- **unit_offsets**: matching offsets from unit-segmentation, each `{line, start, end}` — `line` is 1-indexed into `source.md`
```

- [ ] **Step 6: Validate**

```bash
python scripts/validate_skill.py skills/atomic-unit-writing/SKILL.md
python scripts/validate_skill.py skills/unit-classification/SKILL.md
```
Expected: `No errors found` twice.

- [ ] **Step 7: Commit and push**

```bash
git add paper-reading/skills/atomic-unit-writing/ paper-reading/skills/unit-classification/
git commit -m "Scope atomic-unit-writing to the abstract; thread new offset shape

atomic-unit-writing reads the abstract range only, which is where both
source methods actually define their units: ACU extracts atomic facts from
the paper's reference summary, Nugget authors short statements covering the
same ground. Units drawn from the full body would not be the reference set
either method's recall is defined against, so the resulting score would
stop meaning what the method says it means. This is the cheapest read in
the package — roughly 1k tokens against a 70k paper.

unit-classification did not take full_text, but its \`unit_offsets\` now
carry the \`{line, start, end}\` shape unit-segmentation emits, so its
declaration and prompt are updated to match.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
git push origin main
```

---

### Task 6: Migrate the checklist family

Five SOPs. Four take `full_text` plus a dispatched tool or item set; one has a two-mode input that this migration collapses.

**Files:**
- Modify: `skills/signalling-question-answering/SKILL.md`, `prompt.md`
- Modify: `skills/star-awarding/SKILL.md`, `prompt.md`
- Modify: `skills/reporting-standard-checklist/SKILL.md`, `prompt.md`
- Modify: `skills/dual-column-self-check/SKILL.md`, `prompt.md`
- Modify: `skills/quality-appraisal-checklist/SKILL.md`, `prompt.md`

**Interfaces:**
- Consumes: the contract shape from Task 2; `dispatched_tool` from `study-design-tool-gate`.
- Produces: nothing new.

- [ ] **Step 1: Apply the same three edits to `signalling-question-answering`, `star-awarding`, `reporting-standard-checklist`, and `dual-column-self-check`**

For each of those four, in `SKILL.md` replace the `full_text (string)` fragment at the start of the `input:` value with `source_path (string), meta_path (string)`, keeping every other parameter on that line unchanged. Then add a `reads:` line directly beneath `input:`, using the value from this table:

| Skill | `reads:` value |
|---|---|
| `signalling-question-answering` | `'method and results sections — signalling questions ask what was done, not what it meant'` |
| `star-awarding` | `'method and results sections'` |
| `reporting-standard-checklist` | `'full paper — a reporting checklist asks whether each item appears anywhere'` |
| `dual-column-self-check` | `'full paper — a completeness self-audit asks whether each item appears anywhere'` |

In each `prompt.md`, replace the `- **full_text**: the paper's full text` bullet with:
```markdown
- **source_path**: path to the landed paper (`source.md`)
- **meta_path**: path to its section index (`source.meta.json`)
```

Then after the last bullet of that Input block, add the matching note:

For `signalling-question-answering` and `star-awarding`:
```markdown

Read `../_conventions/reading-the-source.md` before you start.

Read the method and results sections. Signalling questions and NOS items ask
what the study did — how it allocated, how it measured, how it followed up —
and that is reported in the method, with the outcome data in results. The
introduction and discussion argue about meaning, which is not what you are
judging.
```

For `reporting-standard-checklist` and `dual-column-self-check`:
```markdown

Read `../_conventions/reading-the-source.md` before you start.

Read the whole paper. A reporting checklist asks whether each item appears
*anywhere* in it, so a section you skipped is a section where you cannot
honestly answer "not reported". This SOP is one where the full read is the
methodologically correct choice, not a fallback.
```

- [ ] **Step 2: `quality-appraisal-checklist/SKILL.md` — collapse the two-mode input**

Find:
```yaml
input: '(mode a) full_text (string), dispatched_tool (string) — OR (mode b) classified_units (list), target_checklist_labels (list of strings), entry_mode ("checklist" | "completeness_check")'
```
Replace with:
```yaml
input: 'entry_mode (string: "checklist" | "completeness_check"), source_path (string) and meta_path (string) and dispatched_tool (string) when entry_mode is "checklist", OR classified_units (list) and target_checklist_labels (list of strings) when entry_mode is "completeness_check"'
reads: 'method and results sections in checklist mode; nothing in completeness_check mode'
```

`entry_mode` moves to the front because it is what determines which other parameters are present. The old declaration made the caller infer the mode from which parameters they happened to pass.

- [ ] **Step 3: `quality-appraisal-checklist/prompt.md` — replace the Input block**

Find the Input block's `full_text` bullet and its mode description, and replace the whole block with:
```markdown
## Input
- **entry_mode**: `"checklist"` | `"completeness_check"` — determines which of the following are supplied
- **source_path** (checklist mode): path to the landed paper (`source.md`)
- **meta_path** (checklist mode): path to its section index (`source.meta.json`)
- **dispatched_tool** (checklist mode): the exact tool+variant from study-design-tool-gate, e.g. `CASP-Cohort`, `AMSTAR-2`, `JBI (prevalence variant)`
- **classified_units** (completeness_check mode): labelled units from unit-classification
- **target_checklist_labels** (completeness_check mode): which labels must be present for the paper to count as complete

Read `../_conventions/reading-the-source.md` before you start, if you are in
checklist mode.

In **checklist mode**, read the method and results sections. Appraisal items
ask what the study did and what it found.

In **completeness_check mode**, do not read the paper at all. You are
checking whether `classified_units` covers `target_checklist_labels` — a
question about the label set, answerable from the units alone. Reading the
paper here would let you fill in a judgment the labels do not support, which
defeats the purpose of running classification first.
```

- [ ] **Step 4: Validate all five**

```bash
python scripts/validate_skill.py skills/signalling-question-answering/SKILL.md
python scripts/validate_skill.py skills/star-awarding/SKILL.md
python scripts/validate_skill.py skills/reporting-standard-checklist/SKILL.md
python scripts/validate_skill.py skills/dual-column-self-check/SKILL.md
python scripts/validate_skill.py skills/quality-appraisal-checklist/SKILL.md
```
Expected: `No errors found` five times.

- [ ] **Step 5: Confirm no `full_text` remains**

```bash
grep -rn "full_text" skills/signalling-question-answering/ skills/star-awarding/ skills/reporting-standard-checklist/ skills/dual-column-self-check/ skills/quality-appraisal-checklist/
```
Expected: no output.

- [ ] **Step 6: Commit and push**

```bash
git add paper-reading/skills/signalling-question-answering/ paper-reading/skills/star-awarding/ paper-reading/skills/reporting-standard-checklist/ paper-reading/skills/dual-column-self-check/ paper-reading/skills/quality-appraisal-checklist/
git commit -m "Migrate checklist family to path-based source contract

Five SOPs, split by what their items actually ask.

signalling-question-answering and star-awarding read method and results:
their items ask what the study did — how it allocated, measured, followed up
— and the introduction and discussion argue about meaning rather than
reporting procedure.

reporting-standard-checklist and dual-column-self-check read everything, and
say why: a reporting checklist asks whether each item appears anywhere, so a
skipped section is one where 'not reported' cannot honestly be claimed. The
full read is the correct choice here, not a fallback.

quality-appraisal-checklist's two-mode input is also restructured.
\`entry_mode\` moves to the front of the declaration because it determines
which other parameters exist; previously the caller had to infer the mode
from whichever parameters they happened to pass. Its completeness_check mode
now explicitly reads nothing — it answers a question about label coverage
from classified_units alone, and reading the paper there would let it
substitute a judgment the labels do not support.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
git push origin main
```

---

### Task 7: Migrate the remaining four SOPs

**Files:**
- Modify: `skills/engineering-config-grading/SKILL.md`, `prompt.md`
- Modify: `skills/multi-stage-cascade-extraction/SKILL.md`, `prompt.md`
- Modify: `skills/question-framing/SKILL.md`, `prompt.md`
- Modify: `skills/rationale-selection/SKILL.md`, `prompt.md`

**Interfaces:**
- Consumes: the contract shape from Task 2.
- Produces: nothing new.

- [ ] **Step 1: `engineering-config-grading`**

In `SKILL.md`, replace the `full_text (string)` fragment of the `input:` value with `source_path (string), meta_path (string)`, then add:
```yaml
reads: 'method, experiments, and appendix sections — where configuration is reported'
```

In `prompt.md`, replace the `- **full_text**: the paper's full text` bullet with the standard two-path pair, then after the Input block add:
```markdown

Read `../_conventions/reading-the-source.md` before you start.

Read the method, experimental setup, and any appendix or supplementary
sections the index lists. Hyperparameter ranges, compute budgets, seeds, and
dataset splits live there — very often in the appendix specifically, which is
why it must not be skipped as "supplementary". The introduction and related
work do not report configuration.
```

- [ ] **Step 2: `multi-stage-cascade-extraction`**

In `SKILL.md`, replace the `full_text (string)` fragment with `source_path (string), meta_path (string)`, then add:
```yaml
reads: 'full paper — coreference resolution needs every mention, wherever it occurs'
```

In `prompt.md`, replace the `full_text` bullet with the standard two-path pair, then after the Input block add:
```markdown

Read `../_conventions/reading-the-source.md` before you start.

Read the whole paper. The coreference stage's job is to cluster every mention
of the same entity, and a mention you never read is a cluster you silently
got wrong — with no signal that anything was missed. This is the SOP where a
partial read does the most damage, because the error is invisible in the
output.
```

- [ ] **Step 3: `question-framing`**

In `SKILL.md`, replace the `full_text (string)` fragment with `source_path (string), meta_path (string)`, then add:
```yaml
reads: 'abstract and method sections'
```

In `prompt.md`, replace the `full_text` bullet with the standard two-path pair, then after the Input block add:
```markdown

Read `../_conventions/reading-the-source.md` before you start.

Read the `abstract` range and the method section. PICO, PECO, and SPIDER
slots — population, intervention or exposure, comparator, outcome — are all
stated in those two places. You are framing what the study set out to
examine, not what it concluded.

Leave a slot empty rather than inferring it from the discussion. An empty
comparator slot is a real finding about the study's design; a comparator
reconstructed from the discussion's framing is a fabrication.
```

- [ ] **Step 4: `rationale-selection`**

In `SKILL.md`, find:
```yaml
input: 'atomic_claim (string), full_text (string)'
```
Replace with:
```yaml
input: 'atomic_claim (string), source_path (string), meta_path (string)'
reads: 'full paper — the entailing sentences may be anywhere'
```

In `prompt.md`, find:
```markdown
- **full_text**: the candidate paper/abstract being checked against the claim
```
Replace with:
```markdown
- **source_path**: path to the landed paper (`source.md`) being checked against the claim
- **meta_path**: path to its section index (`source.meta.json`)

Read `../_conventions/reading-the-source.md` before you start.

Read the whole paper. You cannot know in advance which sentences entail or
refute the claim, and every sentence you return must be verbatim from a range
you actually read — the downstream label is required to be traceable to these
exact sentences, so a sentence reconstructed from memory breaks the whole
chain's warrant.
```

Then in the same file, in the Instructions block, find:
```markdown
2. Quote sentences verbatim from full_text — do not paraphrase.
```
Replace with:
```markdown
2. Quote sentences verbatim from `source.md` — do not paraphrase.
```

And find:
```markdown
3. If NO sentence set in full_text is sufficient to judge the claim either way, return an empty list — this is a valid outcome (it will lead to a NOINFO label downstream, not an error).
```
Replace with:
```markdown
3. If NO sentence set in the paper is sufficient to judge the claim either way, return an empty list — this is a valid outcome (it will lead to a NOINFO label downstream, not an error).
```

Finally, in the Output block find:
```markdown
- **rationale_sentences**: list of 1-3 verbatim sentences from full_text (or empty list if none suffice)
```
Replace with:
```markdown
- **rationale_sentences**: list of 1-3 verbatim sentences from `source.md` (or empty list if none suffice)
```

- [ ] **Step 5: Validate**

```bash
python scripts/validate_skill.py skills/engineering-config-grading/SKILL.md
python scripts/validate_skill.py skills/multi-stage-cascade-extraction/SKILL.md
python scripts/validate_skill.py skills/question-framing/SKILL.md
python scripts/validate_skill.py skills/rationale-selection/SKILL.md
```
Expected: `No errors found` four times.

- [ ] **Step 6: Verify zero `full_text` references remain anywhere in `skills/`**

```bash
grep -rn "full_text" skills/
```
Expected: matches **only** in `skills/unit-segmentation/`, where `"full_text"` is a value of the `scope` parameter, and in `skills/paper-fetch/`, where the SKILL.md body explains why the old `full_text` return was replaced. Every other match is a missed migration — fix it before committing.

- [ ] **Step 7: Commit and push**

```bash
git add paper-reading/skills/engineering-config-grading/ paper-reading/skills/multi-stage-cascade-extraction/ paper-reading/skills/question-framing/ paper-reading/skills/rationale-selection/
git commit -m "Migrate remaining SOPs to path-based source contract

Completes the migration: nineteen SOPs no longer take the paper by value.

engineering-config-grading reads method, experiments, and appendix — the
appendix specifically, since that is where hyperparameter ranges and compute
budgets usually end up, and skipping it as 'supplementary' would miss the
items this SOP exists to grade.

question-framing reads abstract and method, and is told to leave a slot
empty rather than infer it from the discussion: an empty comparator is a
real finding about the study's design, a reconstructed one is a fabrication.

multi-stage-cascade-extraction and rationale-selection read everything.
Cascade extraction is the SOP where a partial read does the most damage — a
mention never read is a coreference cluster silently wrong, with nothing in
the output to signal it. rationale-selection must return verbatim sentences
that the downstream label is traceable to, so a sentence from memory breaks
the chain's warrant.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
git push origin main
```

---

### Task 8: Add DARE frontmatter keys to all 30 SOPs

Every SOP needs `version`, `category`, and `type`. Without `type:`, DARE's dependency-closure verification and its `available-tables` generator cannot see these skills at all, so the tactics in Tasks 10-14 would reference SOPs that DARE's tooling considers nonexistent.

`paper-fetch` already has all three — skip it.

**Files:**
- Modify: `skills/*/SKILL.md` — all except `paper-fetch`

**Interfaces:**
- Consumes: nothing.
- Produces: `type: sop` on every SOP, which Task 9's closure check and Tasks 10-14's tactics depend on.

- [ ] **Step 1: Add the three keys to each SKILL.md**

In every `skills/*/SKILL.md` except `paper-fetch/SKILL.md`, insert these three lines immediately after the `description:` value ends (that is, on the line before `execution:`):

```yaml
version: 1.0.0
category: paper-reading
type: sop
```

`description:` values are multi-line folded YAML in some files — insert **after** the whole folded value, not after its first line. If you insert into the middle of a folded scalar, the YAML will still parse but the description will be silently truncated and the rest will become garbage keys.

Do not add `campaign:`. This package has no campaign layer, and inventing a campaign name that no campaign skill defines would create a dangling reference.

- [ ] **Step 2: Verify all 30 have all three keys**

```bash
grep -l "^type: sop" skills/*/SKILL.md | wc -l
grep -l "^version: 1.0.0" skills/*/SKILL.md | wc -l
grep -l "^category: paper-reading" skills/*/SKILL.md | wc -l
```
Expected: `30` three times.

- [ ] **Step 3: Verify every description survived**

```bash
python - <<'PY'
import glob, yaml
bad = []
for p in sorted(glob.glob("skills/*/SKILL.md")):
    t = open(p, encoding="utf-8").read()
    fm = yaml.safe_load(t[4:t.find("\n---\n", 4)])
    for k in ("name", "description", "version", "category", "type", "execution"):
        if not fm.get(k):
            bad.append(f"{p}: missing/empty {k}")
    if fm.get("type") != "sop":
        bad.append(f"{p}: type is {fm.get('type')!r}, expected 'sop'")
    d = fm.get("description") or ""
    if len(d) < 40:
        bad.append(f"{p}: description only {len(d)} chars — likely truncated by a bad insert")
print("\n".join(bad) if bad else "all 30 OK")
PY
```
Expected: `all 30 OK`

- [ ] **Step 4: Run the full validator and test suite**

```bash
for f in skills/*/SKILL.md; do python scripts/validate_skill.py "$f" || echo "FAILED: $f"; done
python -m pytest tests/ -q
```
Expected: `No errors found` 30 times with no `FAILED:` lines, and pytest passing.

- [ ] **Step 5: Commit and push**

```bash
git add paper-reading/skills/
git commit -m "Add DARE frontmatter keys to all 30 SOPs

Adds \`version: 1.0.0\`, \`category: paper-reading\`, and \`type: sop\` to
every SOP that lacked them.

This is not tidying. DARE reconstructs its entire 2476-edge skill call graph
from frontmatter alone, and its \`available-tables\` generator scans by
\`type:\`. Without that key these thirty skills are invisible to both, so the
tactics added next would declare dependencies on SOPs that DARE's own
tooling considers nonexistent — and the closure check would report a graph
that silently excludes this whole package.

No \`campaign:\` key: this package has no campaign layer, and naming a
campaign that no campaign skill defines would create a dangling reference
rather than a useful one.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
git push origin main
```

---

### Task 9: Teach the validator the new rules

**Files:**
- Modify: `scripts/validate_skill.py`
- Modify: `tests/test_validate_skill.py`

**Interfaces:**
- Consumes: `type: sop` from Task 8.
- Produces: `validate_skill(path, skills_root=None)` — the second parameter is optional and only used for the tactic closure check; existing single-argument calls keep working.

- [ ] **Step 1: Write the failing tests**

Append to `tests/test_validate_skill.py`:

```python
def test_missing_version_field_is_an_error(tmp_dir):
    content = (
        "---\nname: example-skill\ndescription: Does a thing.\n"
        "category: paper-reading\ntype: sop\n---\n\n# Example\n"
    )
    path = _write(tmp_dir, content)
    errors = validate_skill(path)
    assert any("version" in e for e in errors)


def test_missing_category_field_is_an_error(tmp_dir):
    content = (
        "---\nname: example-skill\ndescription: Does a thing.\n"
        "version: 1.0.0\ntype: sop\n---\n\n# Example\n"
    )
    path = _write(tmp_dir, content)
    errors = validate_skill(path)
    assert any("category" in e for e in errors)


def test_missing_type_field_is_an_error(tmp_dir):
    content = (
        "---\nname: example-skill\ndescription: Does a thing.\n"
        "version: 1.0.0\ncategory: paper-reading\n---\n\n# Example\n"
    )
    path = _write(tmp_dir, content)
    errors = validate_skill(path)
    assert any("type" in e for e in errors)


def test_unknown_type_value_is_an_error(tmp_dir):
    content = (
        "---\nname: example-skill\ndescription: Does a thing.\n"
        "version: 1.0.0\ncategory: paper-reading\ntype: gadget\n---\n\n# Example\n"
    )
    path = _write(tmp_dir, content)
    errors = validate_skill(path)
    assert any("gadget" in e for e in errors)


def _write_skill(root, name, body_frontmatter):
    d = os.path.join(root, "skills", name)
    os.makedirs(d, exist_ok=True)
    p = os.path.join(d, "SKILL.md")
    with open(p, "w", encoding="utf-8") as f:
        f.write(body_frontmatter)
    return p


def test_tactic_with_resolvable_sops_has_no_errors(tmp_dir):
    _write_skill(
        tmp_dir,
        "real-sop",
        "---\nname: real-sop\ndescription: A real one.\n"
        "version: 1.0.0\ncategory: paper-reading\ntype: sop\n---\n\n# Real\n",
    )
    tactic = _write_skill(
        tmp_dir,
        "my-tactic",
        "---\nname: my-tactic\ndescription: A tactic.\n"
        "version: 1.0.0\ncategory: paper-reading\ntype: tactic\n"
        "dependencies:\n  sops:\n  - real-sop\n---\n\n# Tactic\n",
    )
    assert validate_skill(tactic, skills_root=os.path.join(tmp_dir, "skills")) == []


def test_tactic_with_dangling_sop_is_an_error(tmp_dir):
    tactic = _write_skill(
        tmp_dir,
        "my-tactic",
        "---\nname: my-tactic\ndescription: A tactic.\n"
        "version: 1.0.0\ncategory: paper-reading\ntype: tactic\n"
        "dependencies:\n  sops:\n  - no-such-sop\n---\n\n# Tactic\n",
    )
    errors = validate_skill(tactic, skills_root=os.path.join(tmp_dir, "skills"))
    assert any("no-such-sop" in e for e in errors)


def test_tactic_without_dependencies_is_an_error(tmp_dir):
    tactic = _write_skill(
        tmp_dir,
        "empty-tactic",
        "---\nname: empty-tactic\ndescription: A tactic.\n"
        "version: 1.0.0\ncategory: paper-reading\ntype: tactic\n---\n\n# Tactic\n",
    )
    errors = validate_skill(tactic, skills_root=os.path.join(tmp_dir, "skills"))
    assert any("dependencies" in e for e in errors)
```

- [ ] **Step 2: Run them to verify they fail**

```bash
python -m pytest tests/test_validate_skill.py -q
```
Expected: the seven new tests FAIL. The `version`/`category`/`type` ones fail because those fields are not yet required; the tactic ones fail with `TypeError: validate_skill() got an unexpected keyword argument 'skills_root'`.

- [ ] **Step 3: Update `scripts/validate_skill.py`**

Replace the module's header constants and the `validate_skill` signature/body with:

```python
"""Validate a DARE-style SKILL.md file: frontmatter presence, required
fields, body length, and — for tactics — that every declared SOP resolves
to a real skill directory. See paper-reading/docs/superpowers/specs/
2026-08-07-paper-reading-v2-design.md §7 for the convention this checks.
"""
import os
import sys
import yaml

MAX_BODY_LINES = 500
REQUIRED_FIELDS = ["name", "description", "version", "category", "type"]
VALID_TYPES = ["sop", "tactic", "strategy", "campaign"]


def validate_skill(path: str, skills_root: str = None) -> list[str]:
    errors = []
    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        return [f"File not found: {path}"]

    if not content.startswith("---\n"):
        return ["No YAML frontmatter found (file must start with '---')"]

    end_marker = content.find("\n---\n", 4)
    if end_marker == -1:
        return ["Frontmatter opened with '---' but never closed"]

    frontmatter_text = content[4:end_marker]
    body = content[end_marker + 5:]

    try:
        frontmatter = yaml.safe_load(frontmatter_text) or {}
    except yaml.YAMLError as e:
        return [f"Frontmatter is not valid YAML: {e}"]

    for field in REQUIRED_FIELDS:
        if field not in frontmatter or not frontmatter[field]:
            errors.append(f"Missing required frontmatter field: '{field}'")

    skill_type = frontmatter.get("type")
    if skill_type and skill_type not in VALID_TYPES:
        errors.append(
            f"Unknown type: '{skill_type}' — expected one of {', '.join(VALID_TYPES)}"
        )

    if skill_type == "tactic":
        errors.extend(_check_tactic_closure(frontmatter, path, skills_root))

    body_lines = body.count("\n")
    if body_lines > MAX_BODY_LINES:
        errors.append(
            f"Body is {body_lines} lines, exceeds the {MAX_BODY_LINES}-line "
            "guideline (spec §7) — split large reference material into references/"
        )

    return errors


def _check_tactic_closure(frontmatter, path, skills_root):
    """A tactic orchestrates SOPs; every SOP it names must actually exist."""
    declared = (frontmatter.get("dependencies") or {}).get("sops") or []
    if not declared:
        return [
            "type is 'tactic' but dependencies.sops is empty — a tactic that "
            "orchestrates no SOPs cannot do anything, since only SOPs execute"
        ]

    if skills_root is None:
        skills_root = os.path.dirname(os.path.dirname(os.path.abspath(path)))

    return [
        f"dependencies.sops names '{sop}', but {skills_root}/{sop}/SKILL.md does not exist"
        for sop in declared
        if not os.path.isfile(os.path.join(skills_root, sop, "SKILL.md"))
    ]
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
python -m pytest tests/ -q
```
Expected: all tests pass, including the six pre-existing ones. If `test_valid_skill_has_no_errors` now fails, that is correct behavior surfacing — update that one test's fixture content to include `version: 1.0.0`, `category: paper-reading`, and `type: sop`, since a skill without them is now genuinely invalid.

- [ ] **Step 5: Run the validator across all 30 SOPs**

```bash
for f in skills/*/SKILL.md; do python scripts/validate_skill.py "$f" || echo "FAILED: $f"; done
```
Expected: `No errors found` 30 times, no `FAILED:` lines. If any fail, Task 8 missed that file.

- [ ] **Step 6: Commit and push**

```bash
git add paper-reading/scripts/validate_skill.py paper-reading/tests/test_validate_skill.py
git commit -m "Require DARE frontmatter keys and check tactic-to-SOP closure

The validator previously accepted any file with a name and a description
under 500 lines. Two additions:

Required fields now include \`version\`, \`category\`, and \`type\`, with
\`type\` constrained to sop/tactic/strategy/campaign. A typo'd type silently
excludes a skill from DARE's frontmatter-derived call graph, so it is worth
catching at validation time rather than discovering as an absence.

Tactics additionally get a closure check: every name in
\`dependencies.sops\` must resolve to a real \`skills/<name>/SKILL.md\`. This
mirrors DARE's own machine-verified 2476/2476 edge closure. An empty
\`dependencies.sops\` on a tactic is also an error — only SOPs execute, so a
tactic orchestrating nothing cannot do anything.

\`skills_root\` is an optional second parameter, defaulting to the skill's
own parent directory, so existing single-argument calls are unaffected.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
git push origin main
```

---

### Task 10: Tactic — keshav-three-pass

The first tactic. Establishes the shape the other four follow: DARE's tactic body sections, prose orchestration (no YAML step machinery — branching and looping are described in sentences, exactly as `competing-hypothesis-matrix` does it), and the output-landing convention.

**Files:**
- Create: `skills/keshav-three-pass/SKILL.md`

**Interfaces:**
- Consumes: `paper-fetch` (paths), `first-pass-skim`, `second-pass-grasp`, `third-pass-deep-read` from Tasks 2 and the existing paper-fetch.
- Produces: the tactic frontmatter shape and the `context/papers/<dir>/<tactic-name>/NN-<sop-name>.<ext>` output convention that Tasks 11-14 reuse. Its `grasp_summary` output file is consumed by Task 13's tactic.

- [ ] **Step 1: Create `skills/keshav-three-pass/SKILL.md`**

````markdown
---
name: keshav-three-pass
description: 'Tactic: Read one paper by Keshav''s three-pass method — a 5-10 minute skim that decides whether to go deeper, an hour-long pass that grasps the contribution, then a multi-hour pass that virtually re-implements the paper to surface its implicit assumptions. Use this when the goal is understanding a paper rather than extracting structured data from it; the output is three layers of prose notes, not a filled schema.'
version: 1.0.0
category: paper-reading
type: tactic
execution: tactic
input: 'paper_ref (string — title, arXiv ID, DOI, or URL)'
output: 'three files under context/papers/<dir>/keshav-three-pass/ — 01-first-pass-skim.md, 02-second-pass-grasp.md, 03-third-pass-deep-read.md'
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

Read one paper the way Keshav's *How to Read a Paper* prescribes: three passes of increasing depth, each one deciding whether the next is warranted.

## Orchestration Intent

The three passes exist because reading every paper deeply is not affordable, and deciding what deserves depth requires having read something first. Pass 1 is cheap enough to spend on a paper you will reject. Pass 2 costs an hour and yields enough to explain the paper to someone. Pass 3 costs most of a day and is the only one that surfaces what the paper does not say about itself.

The passes cannot be reordered or skipped in the middle. Running pass 3 without pass 2 means the deep read has no map of where the load-bearing claims are, and each pass's output is an input to the next specifically so that the deeper read knows where to slow down.

This tactic produces **accumulating prose**, not a schema. Each pass's output is longer and more specific than the last, and none of it is aligned to fixed fields. That is the method's own design, and it is why its cross-paper comparability is weak — if you need output that lines up across papers, use a different tactic.

## Available SOPs

| SOP | Responsibility | When to call |
|---|---|---|
| paper-fetch | Land the paper at `context/papers/<timestamp>-<title-slug>/` and return paths | Always first; every later SOP reads the files it lands |
| first-pass-skim | 5-10 minute skim of title, abstract, headings, captions, conclusion; emits `skim_notes` and a `read_deeper` judgment | Always, immediately after fetch |
| second-pass-grasp | Full read ignoring proofs and derivations; emits `grasp_summary` plus flags for pass 3 | After pass 1, subject to the `read_deeper` gate below |
| third-pass-deep-read | Sentence-by-sentence read including proofs; virtual re-implementation; emits `deep_read_notes` | Last, after pass 2 |

## Orchestration Pattern

**Step 1 — fetch.** Call `paper-fetch` with `paper_ref`. If it returns `status: not_found`, stop the entire tactic and report that. Do not proceed with any pass, and do not substitute your own knowledge of the paper. If it returns `cache_hit: true`, that is a normal success — the paper was already landed by an earlier run.

Create `context/papers/<dir>/keshav-three-pass/` for this tactic's outputs. All filenames lowercase.

**Step 2 — first pass.** Call `first-pass-skim` with `source_path` and `meta_path`. Write its output to `01-first-pass-skim.md` with frontmatter recording `read_deeper`.

**Step 3 — the `read_deeper` gate.** If `read_deeper` is `false`, stop here by default and report the skim's reasoning. This is the method working, not a failure: the first pass exists precisely to let you decline the other two.

Override the gate and continue only if the caller explicitly asked for all three passes regardless of the judgment. When you override, say so in `02-second-pass-grasp.md`'s frontmatter (`gate_overridden: true`) so the record shows the deeper passes ran against the skim's own recommendation.

**Step 4 — second pass.** Call `second-pass-grasp` with `source_path`, `meta_path`, and the `skim_notes` from step 2. Write to `02-second-pass-grasp.md`.

**Step 5 — third pass.** Call `third-pass-deep-read` with `source_path`, `meta_path`, and the `grasp_summary` from step 4. Write to `03-third-pass-deep-read.md`.

Do not shorten this pass because pass 2 already covered the paper. Its own prompt treats "nothing to add beyond pass 2" as a result to be suspicious of rather than a valid outcome, and a pass 3 that merely restates pass 2 is the specific failure this chain has been audited for before (coverage audit S2).

## Output Layout

```
context/papers/<timestamp>-<title-slug>/
  source.md
  source.meta.json
  keshav-three-pass/
    01-first-pass-skim.md
    02-second-pass-grasp.md
    03-third-pass-deep-read.md
```

Each file carries YAML frontmatter with `sop`, `tactic`, `written_at`, and whichever of `read_deeper` / `gate_overridden` applies. Prose goes in markdown rather than JSON — these outputs are paragraphs, and a paragraph inside a JSON string field is unreadable in a diff and unpleasant to edit by hand.

## Minimum Yield

- `01-first-pass-skim.md`: the paper's core claim in one sentence, its abstract's main result quoted verbatim, load-bearing figure/table titles, and an explicit `read_deeper` judgment with reasoning
- `02-second-pass-grasp.md`: a passage that could stand in for explaining the paper's contribution and supporting evidence to a colleague who has not read it, plus explicit flags for pass 3
- `03-third-pass-deep-read.md`: implicit assumptions surfaced, virtual re-implementation notes (what matched the reconstruction and what did not), and specific improvement points — not generic "more experiments would help" filler

## Yield Report

Report to the caller after execution:
- Whether the `read_deeper` gate passed, and whether it was overridden
- The paper's core claim in one sentence
- The count of implicit assumptions pass 3 surfaced, and the most consequential one
- Any flag pass 2 raised that pass 3 could not resolve, and why
- Paths to the three output files
````

- [ ] **Step 2: Validate, including the new closure check**

```bash
python scripts/validate_skill.py skills/keshav-three-pass/SKILL.md
```
Expected: `No errors found`. If it reports a dangling SOP, the named SOP directory does not exist — check spelling against `ls skills/`. Note `third-pass-deep-read` is the real directory name; the pipeline-graph HTML in `context/` calls it `third-pass-verify`, which is stale and must not be copied.

- [ ] **Step 3: Commit and push**

```bash
git add paper-reading/skills/keshav-three-pass/
git commit -m "Add keshav-three-pass tactic

The package's first tactic, and the shape the other four follow.

Orchestration is prose, matching DARE's existing tactic bodies
(competing-hypothesis-matrix and its peers) rather than inventing YAML step
machinery. Branching and gating are described in sentences because a tactic
does not execute — in DARE's four-layer model only SOPs do work, so a tactic
is instructions for how to sequence them, not a runtime.

The \`read_deeper\` gate is the interesting decision. Pass 1 exists to let a
reader decline passes 2 and 3, so the default on \`read_deeper: false\` is to
stop and report. A caller can override, but the override is recorded in the
output frontmatter as \`gate_overridden: true\` — otherwise the record would
not show that the deep passes ran against the skim's own recommendation.

Establishes the output convention the remaining tactics reuse:
\`context/papers/<dir>/<tactic>/NN-<sop>.<ext>\`, lowercase, prose in markdown
with frontmatter and structured results in JSON. Paragraphs inside JSON
string fields are unreadable in a diff.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
git push origin main
```

---

### Task 11: Tactic — qalmri-worksheet

**Files:**
- Create: `skills/qalmri-worksheet/SKILL.md`

**Interfaces:**
- Consumes: `paper-fetch`, `qalmri` (Task 3).
- Produces: nothing other tasks depend on.

- [ ] **Step 1: Create `skills/qalmri-worksheet/SKILL.md`**

````markdown
---
name: qalmri-worksheet
description: 'Tactic: Fill a six-slot QALMRI worksheet for one paper — Question, Alternatives, Logic, Method, Results, Inference. Use this when the goal is a structured reading worksheet rather than a graded evaluation; five of the six slots are extraction and only Inference is judgment, so the output records what the paper says rather than how good it is.'
version: 1.0.0
category: paper-reading
type: tactic
execution: tactic
input: 'paper_ref (string — title, arXiv ID, DOI, or URL)'
output: 'one file at context/papers/<dir>/qalmri-worksheet/01-qalmri.md — six prose sections'
sops:
- paper-fetch
- qalmri
dependencies:
  sops:
  - paper-fetch
  - qalmri
---

# QALMRI Worksheet

Read one paper into the six QALMRI slots: Question, Alternatives, Logic, Method, Results, Inference.

## Orchestration Intent

QALMRI is the shortest useful chain in this package — fetch, then one SOP. It earns a tactic of its own because the alternative is calling `qalmri` directly with hand-assembled paths, and the fetch-then-read handoff plus the output-landing convention are worth naming once rather than reconstructing each time.

The worksheet's value is in the **Alternatives** slot, which most reading formats have no place for. Asking what competing explanations the paper had to rule out is what separates a worksheet from a summary — a summary records the claim, a worksheet records the claim's competition.

Only **Inference** is a judgment slot. The other five are extraction. Keep that separation when filling them: an Alternatives slot listing your own objections rather than the paper's stated alternatives has quietly become an Inference slot, and the worksheet loses its use as a record of what the paper argued.

## Available SOPs

| SOP | Responsibility | When to call |
|---|---|---|
| paper-fetch | Land the paper and return paths | Always first |
| qalmri | Produce the six-slot worksheet from the landed paper | After fetch |

## Orchestration Pattern

**Step 1 — fetch.** Call `paper-fetch` with `paper_ref`. On `status: not_found`, stop and report; do not fill the worksheet from your own knowledge of the paper. A `cache_hit: true` is a normal success.

Create `context/papers/<dir>/qalmri-worksheet/`.

**Step 2 — worksheet.** Call `qalmri` with `source_path` and `meta_path`. Write its six sections to `01-qalmri.md`.

**No gate, no branch, no loop.** If `qalmri` reports it could not fill a slot from the paper, that empty slot is the output — record it as empty with the reason. Do not re-call the SOP with a broader read hoping to fill it, and do not fill it yourself. A paper that never states its alternatives has an empty Alternatives slot, and that absence is a finding about the paper.

## Output Layout

```
context/papers/<timestamp>-<title-slug>/
  source.md
  source.meta.json
  qalmri-worksheet/
    01-qalmri.md
```

Frontmatter records `sop: qalmri`, `tactic: qalmri-worksheet`, `written_at`, and `slots_empty` listing any slot the paper did not support.

## Minimum Yield

- All six slots present as sections, each either filled with one paragraph or explicitly marked empty with the reason
- The Alternatives slot reflects the paper's own stated competing explanations, not the reader's objections
- The Inference slot is the only one containing judgment

## Yield Report

Report to the caller after execution:
- Which slots were fillable and which were empty, with the reason for each empty one
- The Question slot in one sentence
- Whether the paper stated any alternatives at all — a paper with none is a notable finding about how it argues
- Path to the output file
````

- [ ] **Step 2: Validate**

```bash
python scripts/validate_skill.py skills/qalmri-worksheet/SKILL.md
```
Expected: `No errors found`

- [ ] **Step 3: Commit and push**

```bash
git add paper-reading/skills/qalmri-worksheet/
git commit -m "Add qalmri-worksheet tactic

The shortest chain in the package: fetch, then one SOP. It earns a tactic
anyway, because the alternative is calling \`qalmri\` with hand-assembled
paths and re-deriving the output-landing convention every time.

Records what the worksheet is actually for: the Alternatives slot, which
most reading formats have no place for. A summary records the claim; a
worksheet records the claim's competition. And the constraint that keeps
that useful — only Inference is a judgment slot, so an Alternatives slot
holding the reader's own objections has quietly become a second Inference
slot and stops being a record of what the paper argued.

An unfillable slot stays empty with its reason rather than being filled by
a broader re-read or by the reader. A paper that never states its
alternatives has an empty Alternatives slot, and that absence is the
finding.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
git push origin main
```

---

### Task 12: Tactic — argumentative-zoning

**Files:**
- Create: `skills/argumentative-zoning/SKILL.md`

**Interfaces:**
- Consumes: `paper-fetch`, `unit-segmentation` (Task 4), `unit-classification` (Task 5). Depends on the `{line, start, end}` offset shape from Task 4.
- Produces: nothing other tasks depend on.

- [ ] **Step 1: Create `skills/argumentative-zoning/SKILL.md`**

````markdown
---
name: argumentative-zoning
description: 'Tactic: Label every sentence of one paper with its rhetorical role using Teufel''s Argumentative Zoning scheme — AIM, BACKGROUND, OWN, CONTRAST, BASIS, TEXTUAL, OTHER. Use this when the goal is output that lines up across papers; sentence-level rhetorical labels are the most cross-paper-alignable artifact in this package, because the label set is fixed and independent of what any individual paper is about.'
version: 1.0.0
category: paper-reading
type: tactic
execution: tactic
input: 'paper_ref (string — title, arXiv ID, DOI, or URL), scope (string: "full_text" | "abstract" | "intro_only", default "full_text")'
output: 'two files under context/papers/<dir>/argumentative-zoning/ — 01-unit-segmentation.json, 02-unit-classification.json'
sops:
- paper-fetch
- unit-segmentation
- unit-classification
dependencies:
  sops:
  - paper-fetch
  - unit-segmentation
  - unit-classification
---

# Argumentative Zoning

Segment one paper into sentences, then label each with its rhetorical role in Teufel's seven-zone scheme.

## Orchestration Intent

Split-then-label is two SOPs rather than one because the split is mechanical and the label is judgment, and mixing them produces a labeller that quietly re-segments to suit whatever label it wants to assign. Keeping segmentation upstream means the unit boundaries are fixed before any labelling decision sees them.

This tactic produces the most **cross-paper-alignable** output in the package. The seven zones are defined over rhetorical function, not subject matter, so two papers in unrelated fields yield label sequences that can be compared directly. That is the opposite trade-off from `keshav-three-pass`: prose that captures a specific paper well but lines up with nothing.

The zones themselves: AIM (the paper's own goal), BACKGROUND (generally accepted context), OWN (the authors' own work), CONTRAST (comparison against or criticism of other work), BASIS (other work this paper builds on), TEXTUAL (statements about the paper's own structure), OTHER (other researchers' work, neutrally described).

## Available SOPs

| SOP | Responsibility | When to call |
|---|---|---|
| paper-fetch | Land the paper and return paths | Always first |
| unit-segmentation | Split the requested scope into sentences with line-anchored offsets | After fetch |
| unit-classification | Assign one AZ zone per sentence | After segmentation |

## Orchestration Pattern

**Step 1 — fetch.** Call `paper-fetch` with `paper_ref`. On `not_found`, stop and report. Create `context/papers/<dir>/argumentative-zoning/`.

**Step 2 — segment.** Call `unit-segmentation` with `source_path`, `meta_path`, `segmentation_granularity: "sentence"`, and the caller's `scope` (default `"full_text"`). Write `units` and `unit_offsets` to `01-unit-segmentation.json`.

Granularity is `sentence`, not `clause`. AZ's zones are defined over sentences — a clause-level split produces fragments the scheme was never annotated against, and the labels stop being comparable to any published AZ data.

**Step 3 — classify.** Call `unit-classification` with the `units` and `unit_offsets` from step 2, plus:
- `label_set: "argumentative-zoning"` (the seven zones above)
- `hierarchy_toggle: false` (AZ is single-level; Swales moves-and-steps is the scheme that needs two)
- `output_type: "single_label"`

Write to `02-unit-classification.json`.

**On scope.** If the caller passes `scope: "abstract"` or `"intro_only"`, pass it straight through and note it in the output frontmatter. A narrower scope is a legitimate request — AZ over abstracts alone is a common configuration — but the resulting label distribution is not comparable to a full-text run, since abstracts carry almost no TEXTUAL and far less CONTRAST.

**No loop, no gate.** Every sentence gets exactly one label. If the classifier finds a sentence it cannot place, it must use OTHER rather than inventing a label or skipping the sentence — a gap in the sequence breaks the alignment that is this tactic's whole point.

## Output Layout

```
context/papers/<timestamp>-<title-slug>/
  source.md
  source.meta.json
  argumentative-zoning/
    01-unit-segmentation.json
    02-unit-classification.json
```

JSON rather than markdown here: these outputs are per-sentence records with offsets, which is genuinely structured data. Each file's top level carries `sop`, `tactic`, `written_at`, `scope`, and `unit_count` alongside the payload.

## Minimum Yield

- One label per segmented sentence, no gaps, no invented labels outside the seven zones
- Every unit carries its `{line, start, end}` offset so any label can be traced back to its exact place in `source.md`
- Zone distribution reported as counts — a paper with zero CONTRAST sentences is a real finding about how it positions itself

## Yield Report

Report to the caller after execution:
- Sentence count and the scope used
- Zone distribution as counts across the seven zones
- Whether any zone came out empty, and what that suggests about the paper's rhetoric (no CONTRAST means it never positions against prior work; no BASIS means it claims no foundations)
- Paths to both output files
````

- [ ] **Step 2: Validate**

```bash
python scripts/validate_skill.py skills/argumentative-zoning/SKILL.md
```
Expected: `No errors found`

- [ ] **Step 3: Commit and push**

```bash
git add paper-reading/skills/argumentative-zoning/
git commit -m "Add argumentative-zoning tactic

Segment-then-label across two SOPs. They stay separate because the split is
mechanical and the label is judgment: fold them together and the labeller
quietly re-segments to suit whichever zone it wants to assign, so unit
boundaries have to be fixed before any labelling decision sees them.

This is the package's most cross-paper-alignable output — the seven zones
are defined over rhetorical function rather than subject matter, so papers
in unrelated fields produce directly comparable label sequences. The exact
opposite trade-off from keshav-three-pass, which captures one paper well and
lines up with nothing.

Two configuration constraints are recorded with their reasons. Granularity
is \`sentence\` because AZ's zones were annotated over sentences and a
clause-level split yields fragments the scheme was never defined against.
\`hierarchy_toggle\` is false because AZ is single-level; Swales
moves-and-steps is the scheme that needs two.

An unplaceable sentence gets OTHER rather than being skipped — a gap in the
sequence breaks the alignment this tactic exists to produce.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
git push origin main
```

---

### Task 13: Tactic — acu-nugget-recall

This tactic needs an input the paper cannot supply. `atomic-unit-matching` requires a `target_text` — the summary whose coverage is being checked — and a single paper has no such thing until something writes one.

**Files:**
- Create: `skills/acu-nugget-recall/SKILL.md`

**Interfaces:**
- Consumes: `paper-fetch`, `atomic-unit-writing` (Task 5), `atomic-unit-matching`, `atomic-unit-recall-aggregate`. Optionally consumes Task 10's `02-second-pass-grasp.md` as `target_summary`.
- Produces: nothing other tasks depend on.

- [ ] **Step 1: Create `skills/acu-nugget-recall/SKILL.md`**

````markdown
---
name: acu-nugget-recall
description: 'Tactic: Extract atomic content units from one paper, then score how much of them a given summary covers — ACU-style binary matching or Nugget-style ternary. Use this to check whether a summary you already have (for instance the grasp_summary from keshav-three-pass) actually covers the paper; it requires a target summary as input and cannot run on a paper alone.'
version: 1.0.0
category: paper-reading
type: tactic
execution: tactic
input: 'paper_ref (string — title, arXiv ID, DOI, or URL), target_summary (string — the summary text whose coverage is being scored; supplied by the caller, NOT derivable from the paper), method (string: "acu" | "nugget", default "acu")'
output: 'three files under context/papers/<dir>/acu-nugget-recall/ — 01-atomic-unit-writing.json, 02-atomic-unit-matching.json, 03-recall-aggregate.json'
sops:
- paper-fetch
- atomic-unit-writing
- atomic-unit-matching
- atomic-unit-recall-aggregate
dependencies:
  sops:
  - paper-fetch
  - atomic-unit-writing
  - atomic-unit-matching
  - atomic-unit-recall-aggregate
---

# ACU / Nugget Recall

Extract the paper's atomic content units, then measure how many of them a given summary covers.

## Orchestration Intent

The order is the point. Units are extracted from the paper **before** the summary is examined, so the reference set is not shaped by what the summary happens to contain. Reverse the order — read the summary, then check the paper for what it mentioned — and you reproduce whatever the summary already got wrong, because you never look for what it omitted.

This ordering was the one design the v1 smoke test validated rather than falsified: independent extraction first caught three items a bundle-then-diff check had missed, including a 2.5× efficiency figure that had been dropped during drafting (`context/2026-08-06-13-24-carry-forward-v1-findings.md`).

**This tactic cannot run on a paper alone.** `target_summary` is a required caller-supplied input. The natural source is `keshav-three-pass`'s `02-second-pass-grasp.md`, which makes this a recall check on our own reading — did the grasp summary actually cover the paper, or did it drift toward what was easy to summarize? Any other summary works equally well: a published abstract, an LLM-generated digest, a colleague's notes.

## Available SOPs

| SOP | Responsibility | When to call |
|---|---|---|
| paper-fetch | Land the paper and return paths | Always first |
| atomic-unit-writing | Extract or author atomic units from the paper's abstract | After fetch, before the summary is looked at |
| atomic-unit-matching | Judge, per unit, whether `target_summary` contains it | After units exist |
| atomic-unit-recall-aggregate | Fold per-unit judgments into a recall score | Last |

## Orchestration Pattern

**Step 0 — check the input.** If the caller did not supply `target_summary`, stop and say so. Do not generate a summary yourself to score: a summary written by the same reader that extracted the units measures nothing, since both come from the same reading of the paper and will agree by construction. Ask the caller for one, or suggest running `keshav-three-pass` first and passing its `grasp_summary`.

**Step 1 — fetch.** Call `paper-fetch` with `paper_ref`. On `not_found`, stop. Create `context/papers/<dir>/acu-nugget-recall/`.

**Step 2 — extract units, without looking at the summary.** Call `atomic-unit-writing` with `source_path`, `meta_path`, and:
- `method: "acu"` → `unit_source: "extracted"`, `importance_tagging_toggle: false`
- `method: "nugget"` → `unit_source: "authored"`, `importance_tagging_toggle: true`

Write to `01-atomic-unit-writing.json`.

Do not pass `target_summary` into this call. It is not a parameter this SOP accepts, and including it in the surrounding context would let the extraction drift toward the summary's framing — which is the exact contamination the ordering exists to prevent.

**Step 3 — match.** Call `atomic-unit-matching` with the `atomic_units` from step 2, `target_text: <target_summary>`, and:
- `method: "acu"` → `judgment_value_domain: "binary"`
- `method: "nugget"` → `judgment_value_domain: "ternary"`

Write to `02-atomic-unit-matching.json`. This runs once over the whole unit list, not once per unit — the SOP takes the list and returns a judgment per unit.

**Step 4 — aggregate.** Call `atomic-unit-recall-aggregate` with `match_results` and the original `atomic_units`. Write to `03-recall-aggregate.json`.

**Carry the reliability caveat into your report.** For `method: "nugget"` scoring a single summary, the aggregate SOP is required to flag that Nugget's own reported reliability is run-level (Kendall τ=0.887 across runs) and not per-topic (τ=0.297-0.539). A single summary's Nugget score is too noisy to treat as evidence about that summary specifically. Reproduce that caveat in your yield report rather than reporting the bare number — dropping it is how a noisy score becomes a confident claim.

## Output Layout

```
context/papers/<timestamp>-<title-slug>/
  source.md
  source.meta.json
  acu-nugget-recall/
    01-atomic-unit-writing.json
    02-atomic-unit-matching.json
    03-recall-aggregate.json
```

Each file's top level carries `sop`, `tactic`, `written_at`, `method`, and — in `02` and `03` — a `target_summary_source` field recording where the scored summary came from (a file path if it was another tactic's output, otherwise `caller-supplied`).

## Minimum Yield

- Units extracted from the paper with no reference to `target_summary`
- One judgment per unit, drawn from exactly the value set `method` implies
- A recall score, with ACU's length penalty applied or Nugget's V_strict and A_strict both reported
- For single-summary Nugget runs, the per-topic reliability caveat stated alongside the score
- The list of unmatched units — which is the actually useful output, since it names what the summary missed

## Yield Report

Report to the caller after execution:
- Unit count, method used, and where `target_summary` came from
- The recall score, with the Nugget caveat if applicable
- **Every unmatched unit, listed.** A score of 0.8 tells the caller little; the four units that were missed tell them what to fix
- Paths to the three output files
````

- [ ] **Step 2: Validate**

```bash
python scripts/validate_skill.py skills/acu-nugget-recall/SKILL.md
```
Expected: `No errors found`

- [ ] **Step 3: Commit and push**

```bash
git add paper-reading/skills/acu-nugget-recall/
git commit -m "Add acu-nugget-recall tactic

Extract the paper's atomic units, then score how much of a given summary
covers them. The ordering is the whole design: units come from the paper
before the summary is examined, so the reference set is not shaped by what
the summary happens to contain. Reversed — read the summary, then check the
paper for what it mentioned — you reproduce whatever the summary already got
wrong, because you never look for what it omitted.

This is the one v1 design the smoke test validated rather than falsified:
independent extraction first caught three dropped items, including a 2.5x
efficiency figure lost during drafting.

The tactic cannot run on a paper alone. \`target_summary\` is required and
caller-supplied, because atomic-unit-matching needs something to check
coverage against and a single paper has none. Explicitly refuses to generate
that summary itself: a summary written by the same reader that extracted the
units measures nothing, since both come from one reading and agree by
construction. The natural source is keshav-three-pass's grasp_summary, which
makes this a recall check on our own reading.

The Nugget reliability caveat is carried into the yield report rather than
left in the SOP: run-level tau is 0.887 but per-topic is 0.297-0.539, so a
single summary's score is too noisy to be evidence about that summary.
Dropping the caveat is how a noisy number becomes a confident claim.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
git push origin main
```

---

### Task 14: Tactic — reforms-grading

**Files:**
- Create: `skills/reforms-grading/SKILL.md`

**Interfaces:**
- Consumes: `paper-fetch`, `study-design-tool-gate` (Task 4), `engineering-config-grading` (Task 7).
- Produces: nothing other tasks depend on.

- [ ] **Step 1: Create `skills/reforms-grading/SKILL.md`**

````markdown
---
name: reforms-grading
description: 'Tactic: Grade an ML/CS paper''s reproducibility-relevant configuration reporting on a three-level scale — complete, partial, or none — after confirming through the study-design gate that the medical appraisal tools do not apply. Use this for engineering papers where the question is whether someone else could rerun the work, not whether the study was biased.'
version: 1.0.0
category: paper-reading
type: tactic
execution: tactic
input: 'paper_ref (string — title, arXiv ID, DOI, or URL)'
output: 'two files under context/papers/<dir>/reforms-grading/ — 01-study-design-tool-gate.json, 02-engineering-config-grading.json'
sops:
- paper-fetch
- study-design-tool-gate
- engineering-config-grading
dependencies:
  sops:
  - paper-fetch
  - study-design-tool-gate
  - engineering-config-grading
---

# REFORMS Grading

Grade an engineering paper's configuration reporting, gated through the study-design dispatcher.

## Orchestration Intent

The gate is not ceremony. Almost every appraisal tool in this package descends from clinical research — RoB2, ROBINS-I, QUADAS-2, NOS, AMSTAR-2, CASP, JBI — and their domains (allocation concealment, blinding, intention-to-treat) have nothing to check in a typical ML paper. Running the gate first produces an explicit `not_applicable` for those tools, which is a recorded finding rather than a silent omission.

That recorded `not_applicable` is also the only empirical check on whether the gate works. The gate was added to the pipeline graph in response to a coverage audit (S3/S4) which found that applying medical tools to CS papers had no guard at all. Every run of this tactic on an ML paper tests that guard.

The grading itself fills a hole in the evaluative-stance × content-layer matrix: quality judgment applied to engineering metadata. Existing checklists cover this ground only in binary present/absent form, which cannot distinguish "reports a learning rate" from "reports the search range, the selection criterion, and the final value". Three levels can.

This is a **proposal SOP** — unverified, with no published baseline. Treat its grades as a first attempt at a scale, not as calibrated measurement.

## Available SOPs

| SOP | Responsibility | When to call |
|---|---|---|
| paper-fetch | Land the paper and return paths | Always first |
| study-design-tool-gate | Classify study design; dispatch to the fitting tool or return `not_applicable` | After fetch, before grading |
| engineering-config-grading | Grade config items complete / partial / none | After the gate dispatches here |

## Orchestration Pattern

**Step 1 — fetch.** Call `paper-fetch` with `paper_ref`. On `not_found`, stop. Create `context/papers/<dir>/reforms-grading/`.

**Step 2 — gate.** Call `study-design-tool-gate` with `source_path` and `meta_path`. Write `study_design`, `dispatched_tool`, and `applicability_reasoning` to `01-study-design-tool-gate.json`.

**Step 3 — branch on the dispatch.** Three cases:

*Dispatched to `engineering-config-grading`* (the gate row `ML/CS engineering paper — reproducibility config grading`) → proceed to step 4. This is the expected path for an ML paper.

*Returned `not_applicable`* → proceed to step 4 anyway, and record in `02`'s frontmatter that the gate found no medical tool applicable. `not_applicable` means the clinical tools do not fit; it does not mean the paper has no configuration to grade. An ML paper reporting no human-subject study correctly lands here, and its hyperparameters are still gradeable.

*Dispatched to any other tool* (RoB2, CASP, NOS, PRISMA, and the rest) → stop and report. The paper is a clinical or review study, and this tactic is the wrong instrument for it. Name the tool the gate chose so the caller can run the matching tactic instead. Do not force the grading through: config-completeness grades on a clinical trial report would be judging it against a standard it was never written to meet.

**Step 4 — grade.** Call `engineering-config-grading` with `source_path`, `meta_path`, and the `dispatched_tool` from step 2 (pass `"engineering-config-grading"` when the gate returned `not_applicable`). Write to `02-engineering-config-grading.json`.

**No loop.** One pass over the item set, one grade per item.

## Output Layout

```
context/papers/<timestamp>-<title-slug>/
  source.md
  source.meta.json
  reforms-grading/
    01-study-design-tool-gate.json
    02-engineering-config-grading.json
```

`02`'s top level carries `sop`, `tactic`, `written_at`, `gate_verdict` (the gate's `study_design`), and `proposal_sop: true` — the last one so nobody reads these grades later as though they came from a validated instrument.

## Minimum Yield

- The gate's verdict recorded with its reasoning, including an explicit `not_applicable` when that is the answer
- One grade per config item, each with a justification that states what "complete" would look like for that item **before** placing the paper on the scale
- The `proposal_sop: true` marker in the output

## Yield Report

Report to the caller after execution:
- The gate's verdict and, if `not_applicable`, that this was the correct outcome for the paper type rather than a failure to match
- Grade distribution across items — how many complete, partial, none
- The items graded `none`, listed. Those are the specific things blocking a rerun
- That these grades come from an unverified proposal SOP with no published baseline
- Paths to both output files
````

- [ ] **Step 2: Validate**

```bash
python scripts/validate_skill.py skills/reforms-grading/SKILL.md
```
Expected: `No errors found`

- [ ] **Step 3: Run the validator over every skill, SOPs and tactics together**

```bash
for f in skills/*/SKILL.md; do python scripts/validate_skill.py "$f" || echo "FAILED: $f"; done
python -m pytest tests/ -q
```
Expected: `No errors found` 35 times (30 SOPs + 5 tactics), no `FAILED:` lines, pytest passing.

- [ ] **Step 4: Commit and push**

```bash
git add paper-reading/skills/reforms-grading/
git commit -m "Add reforms-grading tactic

Grades an ML paper's configuration reporting on a three-level scale, gated
through study-design-tool-gate first.

The gate is not ceremony. Nearly every appraisal tool in this package
descends from clinical research, and their domains — allocation concealment,
blinding, intention-to-treat — have nothing to check in an ML paper. Running
the gate produces an explicit \`not_applicable\` for those tools, which is a
recorded finding rather than a silent omission. It is also the only
empirical check on the guard the coverage audit (S3/S4) added after finding
that applying medical tools to CS papers had no guard at all.

Three-way branch on the dispatch, and the middle case is the one worth
stating: \`not_applicable\` means the clinical tools do not fit, not that the
paper has nothing to grade, so grading proceeds. If the gate dispatches to
an actual clinical tool, the tactic stops and names it — config-completeness
grades on a trial report would judge it against a standard it was never
written to meet.

Output carries \`proposal_sop: true\`, since engineering-config-grading has
no published baseline and its grades should not be read later as
calibrated measurement.

Completes the five-tactic batch. Validator now covers 35 skills.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
git push origin main
```

---

### Task 15: Record the decisions and update the README

**Files:**
- Modify: `context/2026-08-07-23-01-sop-io-contract-simulation.md` (append)
- Modify: `README.md`

**Interfaces:**
- Consumes: everything from Tasks 1-14.
- Produces: nothing.

- [ ] **Step 1: Append a checkpoint to the simulation record**

Add at the end of `context/2026-08-07-23-01-sop-io-contract-simulation.md`:

```markdown
---

## Checkpoint: 契约定案与五条 tactic 落地

仿真提的七条，六条落地，一条不做。

**定案 C：段落索引，不预切片。** paper-fetch 落 `source.md` + `source.meta.json`，后者存每个标题的行号区间。切片这件事不归 paper-fetch——它不需要知道任何下游 SOP 对「我要的那部分」的定义，只记结构。新增切片需求只改那个 SOP 的 prompt。

否掉的 A：paper-fetch 落盘时多写一份 `shallow.md`。省的 token 一样，但 `first-pass-skim` 的定义性约束会漏进 fetch 层，且切片需求不止一种（`unit-segmentation` 早就带 `scope: full_text | abstract | intro_only`），每加一种改一次 paper-fetch。

否掉的 B：加 `execution: script` 做机械切片。成本同样近零，但要动全 DARE 的 execution 枚举。

**缓存按 identifier 查，不按目录名。** 目录是 `<timestamp>-<title-slug>`，而 `paper_ref` 可能是 arXiv ID。扫 `context/papers/*/source.meta.json` 匹 `identifier` 或 `title_slug`，两个都记就是为了两种形式都能落回。刻意不做模糊匹配：漏命中只多 fetch 一次，误命中会让整条管线读错论文。

**落盘全小写。** slug 去 Windows 非法字符、截 60 字符防路径超长。

**「禁看」由构造保证，不靠自律。** `first-pass-skim` 拿到的是索引里的标题键、abstract 区间、caption 行号——正文体的行号范围它没有。这条同时解掉仿真里 ② 的一半：负约束不必进声明层，切片本身就是负约束。

**19 个 SOP 的 input 换掉后，实际省下的：** `atomic-unit-writing` 只读 abstract（~1k / 70k）、`study-design-tool-gate` 读 abstract + method、`research-question-appraisal` 读 abstract + intro + 伦理段、`first-pass-skim` 读索引 + 五处定点（~4k）。真要全文的（两遍精读、qalmri、cascade-extraction、rationale-selection、两个 reporting checklist）照读，不省，且在 prompt 里写清为什么。

**tactic 层五条，不补 strategy/campaign。** 读单篇没有迭代循环也没有停止条件，strategy 无事可做。等做「一批论文横向读」再说。

**acu-nugget 的 target_summary 定为外部入参。** 单篇论文没有「被检查覆盖率的摘要」，而 tactic 不能自己生成一份来打分——同一个读者抽的 unit 和写的摘要必然自洽，测不出东西。natural source 是 keshav 的 `grasp_summary`，于是它成了对我们自己阅读产出的召回检查。

**SciFact 不做。** `claim-writing` 要的 citance 不在全文里、paper-fetch 不产、而唯一入口的规矩不破。四十多个方法论只做标志性的一批，这条留空。

**校验丢了一半，认了。** input 与禁看进 tactic 散文之后，`validate_skill.py` 管不到。它现在查五个必填键 + tactic→SOP 闭包，其余靠约定。研究包里可接受——是明知的取舍，不是疏忽。
```

- [ ] **Step 2: Read the current README to see what needs changing**

```bash
cat README.md
```

- [ ] **Step 3: Update the README**

Make these changes, preserving the existing tone and structure:

1. Wherever it says the package has 30 SOPs, say 30 SOPs and 5 tactics.
2. Wherever it says `paper-fetch` returns `full_text`, correct it: `paper-fetch` lands `source.md` + `source.meta.json` under `context/papers/<timestamp>-<title-slug>/` and returns paths. Downstream SOPs read what they need via the section index.
3. Add a section listing the five tactics with one line each:

```markdown
## Tactics

Five tactics orchestrate the SOPs into complete reading workflows. A tactic
declares which SOPs run in what order and what each receives; it executes
nothing itself, because in DARE's four-layer model only SOPs do work.

| Tactic | Chain | Output shape |
|---|---|---|
| `keshav-three-pass` | fetch → skim → grasp → deep-read | Three layers of prose, accumulating. Weak cross-paper alignment by design. |
| `qalmri-worksheet` | fetch → qalmri | Six prose slots. Only Inference is judgment. |
| `argumentative-zoning` | fetch → segment → classify | One rhetorical label per sentence. The most cross-paper-alignable output here. |
| `acu-nugget-recall` | fetch → write units → match → aggregate | A recall score plus the list of missed units. Requires a caller-supplied `target_summary`. |
| `reforms-grading` | fetch → gate → grade | Three-level config grades, gated so clinical tools are explicitly ruled out. |

Together they span the range from prose with no fixed anchors to per-item
graded scores, which is what makes them comparable as reading methods rather
than five variations on one.
```

4. Add a short section on the landing convention:

```markdown
## Where output goes

```
context/papers/<timestamp>-<title-slug>/
  source.md            the paper, as fetched
  source.meta.json     metadata + line-number section index
  <tactic-name>/
    01-<sop-name>.md   prose output
    02-<sop-name>.json structured output
```

All names lowercase. Prose lands as markdown with frontmatter, structured
results as JSON — a paragraph inside a JSON string field is unreadable in a
diff and unpleasant to edit.

Re-reading a paper reuses its existing directory: `paper-fetch` scans
`context/papers/*/source.meta.json` and matches on `identifier` or
`title_slug` before making any network call, so running six tactics over one
paper fetches it once.
```

- [ ] **Step 4: Verify nothing else in the README still describes the old contract**

```bash
grep -n "full_text" README.md
```
Expected: no output, or only occurrences that refer to `unit-segmentation`'s `scope` parameter value.

- [ ] **Step 5: Commit and push**

```bash
git add paper-reading/context/2026-08-07-23-01-sop-io-contract-simulation.md paper-reading/README.md
git commit -m "Record contract decisions and document the tactic layer

Appends a checkpoint to the simulation record covering what was decided and
what was rejected: option C (section index, no pre-cut slices) over A
(paper-fetch writes a second shallow file) and B (a new \`execution: script\`
type), cache lookup by identifier rather than directory name, lowercase
landing, and why negative constraints ended up enforced by slicing rather
than by a declaration field.

Also records the two things deliberately left undone. SciFact stays
unbuilt — claim-writing needs a citance that is not in the paper, that
paper-fetch does not produce, and that cannot be fetched elsewhere without
breaking the sole-search-entry rule. And validation now covers only the five
required frontmatter keys plus tactic-to-SOP closure; per-SOP input and
withhold rules live in tactic prose where the validator cannot reach them.
That is a known trade-off, not an oversight.

README updated for the tactic layer and the landing convention.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
git push origin main
```

---

### Task 16: Copy the protocol into the 19 consuming skills

The shared file was useful while the contract was changing, but released
skills must be self-contained. Copy the file into each of the 19 consuming
SOP directories as `reading-the-source.md`, then replace the line
`Read \`../_conventions/reading-the-source.md\` before you start.` with
`Read \`./reading-the-source.md\` before you start.`.

- [ ] **Step 1: Copy the complete protocol file into all 19 SOP directories**
- [ ] **Step 2: Verify no consuming prompt references `_conventions/`**
- [ ] **Step 3: Run the validator and tests**
- [ ] **Step 4: Commit and push**

After the copies pass verification, remove the temporary `_conventions/`
source in the same task; no released SOP may depend on it.

---

### Task 17: Sync to the standalone repo

The standalone repo `d:\YOGSOTH-AI\paper-reading\` is published separately. It has been untouched through Tasks 1-15 and now needs everything.

**Files:**
- Modify: everything under `d:\YOGSOTH-AI\paper-reading\` that differs

**Interfaces:**
- Consumes: the finished state of `de-anthropocentric-research-engine/paper-reading/`.
- Produces: nothing.

- [ ] **Step 1: See exactly what differs before copying anything**

```bash
cd /d/YOGSOTH-AI
diff -rq de-anthropocentric-research-engine/paper-reading paper-reading --exclude=.git
```

Expected differences, all of which are correct and must be preserved:
- `Only in paper-reading: .gitignore` — standalone-only
- `Only in paper-reading: LICENSE` — standalone-only
- `Only in paper-reading: staged` — the v1 archive, standalone-only
- `Only in paper-reading/docs/superpowers/plans: 2026-07-30-paper-reading-v1-mainline.md` — v1 history
- `Only in paper-reading/docs/superpowers/specs: 2026-07-30-paper-reading-pkg-design.md` — v1 history

**Do not delete any of those.** Everything else that differs is a file this work changed and needs copying.

- [ ] **Step 2: Copy the changed directories**

```bash
cd /d/YOGSOTH-AI
cp -r de-anthropocentric-research-engine/paper-reading/skills/. paper-reading/skills/
cp -r de-anthropocentric-research-engine/paper-reading/scripts/. paper-reading/scripts/
cp -r de-anthropocentric-research-engine/paper-reading/tests/. paper-reading/tests/
cp de-anthropocentric-research-engine/paper-reading/README.md paper-reading/README.md
cp de-anthropocentric-research-engine/paper-reading/context/2026-08-07-23-01-sop-io-contract-simulation.md paper-reading/context/
cp de-anthropocentric-research-engine/paper-reading/docs/superpowers/plans/2026-08-07-io-contract-rework.md paper-reading/docs/superpowers/plans/
```

- [ ] **Step 3: Verify the sync left only the expected differences**

```bash
cd /d/YOGSOTH-AI
diff -rq de-anthropocentric-research-engine/paper-reading paper-reading --exclude=.git
```
Expected: only the five standalone-only entries from step 1. Any other difference means a file was missed — copy it.

- [ ] **Step 4: Run the validator and tests in the standalone repo**

```bash
cd /d/YOGSOTH-AI/paper-reading
for f in skills/*/SKILL.md; do python scripts/validate_skill.py "$f" || echo "FAILED: $f"; done
python -m pytest tests/ -q
```
Expected: `No errors found` 35 times, no `FAILED:` lines, pytest passing. Running them here and not only in DARE matters because the standalone repo is what users clone.

- [ ] **Step 5: Commit and push the standalone repo**

```bash
cd /d/YOGSOTH-AI/paper-reading
git add skills/ scripts/ tests/ README.md context/ docs/
git status --short
```

Check the status output before committing. If it shows deletions under `staged/`, `LICENSE`, or `.gitignore`, step 2 overwrote something it should not have — restore those with `git checkout -- <path>` before continuing.

Then:
```bash
git commit -m "Rework SOP I/O contract; add the tactic layer

Syncs the work developed in the DARE monorepo.

**Contract.** paper-fetch no longer returns the paper as \`full_text\`. It
lands \`source.md\` plus a \`source.meta.json\` carrying line-number ranges
per heading, and returns paths. Nineteen downstream SOPs now read only the
sections they need through that index — atomic-unit-writing reads just the
abstract, study-design-tool-gate reads abstract and method,
first-pass-skim reads heading keys and caption lines. The ones that
genuinely need the whole paper still read it, and now say why in their
prompts.

The index also makes first-pass-skim's defining constraint hold by
construction rather than by self-restraint: it is handed the shallow ranges
and never learns where the section bodies are.

paper-fetch also checks \`context/papers/\` before any network call, matching
on \`identifier\` or \`title_slug\`, so running six tactics over one paper
fetches it once.

**Tactic layer.** Five tactics: keshav-three-pass, qalmri-worksheet,
argumentative-zoning, acu-nugget-recall, reforms-grading. They orchestrate
and execute nothing themselves — in DARE's four-layer model only SOPs do
work — so their bodies are prose, matching DARE's existing tactic
convention. Together they span prose with no fixed anchors through per-item
graded scores.

**Also:** all 30 SOPs gain \`version\`/\`category\`/\`type\`, without which
they are invisible to DARE's frontmatter-derived call graph. The validator
now requires those keys and verifies every tactic's declared SOPs resolve
to real directories.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
git push origin main
```

- [ ] **Step 6: Confirm both repos are clean and pushed**

```bash
cd /d/YOGSOTH-AI/paper-reading && git status --short && git log --oneline -1
cd /d/YOGSOTH-AI/de-anthropocentric-research-engine && git status --short && git log --oneline -1
```
Expected: no output from either `git status`, and both logs showing the commit just made.

---

## Verification Summary

After every task: `python scripts/validate_skill.py <changed SKILL.md>` prints `No errors found`, and `python -m pytest tests/ -q` passes.

After Task 14, the whole surface: 35 skills validate clean, tests pass.

**What is not verified by any of this:** no tactic has been run against a real paper. Every task above checks structure — frontmatter validity, contract shape, dependency closure — and none checks that a chain actually produces useful output end to end. A real run needs network access and the caller's go-ahead. Expect the first one to surface things static validation cannot: whether alphaxiv's markdown is regular enough to index reliably, whether heading-name matching by meaning works in practice, and whether the `read_deeper` gate ever actually fires. Do not report this plan's completion as "the pipeline works" — report it as "the pipeline is built and structurally sound, unrun."
