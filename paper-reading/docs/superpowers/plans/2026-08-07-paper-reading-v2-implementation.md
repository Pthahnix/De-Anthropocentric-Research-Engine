# paper-reading v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Before drafting any SKILL.md or prompt.md file in this plan, invoke the `skill-creator` skill first** (`Skill({skill: "skill-creator"})`) to load its Anatomy-of-a-Skill / Progressive-Disclosure / Writing-Patterns guidance into context. This is a hard requirement for every SOP-authoring task below, not a one-time setup step — the skill's guidance (pushy descriptions, <500-line bodies, `references/` for large tables) must be freshly in context for each file, since a fresh subagent or a later session picks up this plan without having read it earlier in the same context.

**Goal:** Build all 30 buildable SOPs from the `paper-reading` v2 pipeline graph (`context/2026-08-07-13-42-sop-pipeline-graph.html`) as skill-creator-compliant `SKILL.md`/`prompt.md` files, in the complexity-ordered sequence the spec lays out — from the `paper-fetch` entry point through the Keshav cascade, standalone single-step SOPs, and the four multi-step cascades (unit-classification, atomic-unit, SciFact, bias-risk/checklist).

**Architecture:** Flat SOP layer, no strategy/tactic layer (per spec §3 — that composition is deferred). Every SOP is `execution: subagent`, dispatched via the existing `spawn-agent` skill (opus, full MCP access, markdown output) — matching v1's precedent and skill-creator's own `execution: subagent` convention. `paper-fetch` is the sole entry point and the only SOP that calls MCP retrieval tools (alphaxiv/semantic-scholar/bioRxiv/medRxiv) directly; every other SOP consumes the `full_text` string `paper-fetch` already retrieved.

**Tech Stack:** Markdown `SKILL.md`/`prompt.md` files (DARE skill format — note: this uses DARE's own `execution`/`prompt`/`input`/`output`/`dependencies` frontmatter convention, not the narrower native Claude Code skill frontmatter schema that `skill-creator`'s `quick_validate.py` enforces; see Task 1's tool choice), Python 3 + PyYAML for the frontmatter/length validator script, `spawn-agent` skill for subagent dispatch, alphaxiv/semantic-scholar/biorxiv/medrxiv MCP tools (used only by `paper-fetch`), git.

## Global Constraints

Copied verbatim from the spec (`docs/superpowers/specs/2026-08-07-paper-reading-v2-design.md`) plus two corrections found while planning (see the note below the list) — every task's requirements implicitly include these:

- **Flat SOP layer only.** No strategy/tactic files this round — composing SOPs into higher-level tactics is explicitly deferred. (Spec §3, §10)
- **30 buildable SOPs** (32 graph nodes minus `grade-out-of-scope` and `csfcube-facet`, which produce no skill). (Spec §3, §4)
- **Every SOP is `execution: subagent`**, dispatched via `spawn-agent`. No deterministic-script SOPs in this package. (Spec §7)
- **`paper-fetch` is the only SOP that calls MCP retrieval tools directly** (alphaxiv, semantic-scholar, biorxiv, medrxiv). Every other SOP operates only on the `full_text` string it receives. (Spec §8, §9)
- **`paper-fetch` is NOT built on `literature-engine`'s `literature-overview`/`literature-search`/`literature-research`.** It holds its own fetch logic — no delegation, no shared code. (Spec §9)
- **The graph file (`context/2026-08-07-13-42-sop-pipeline-graph.html`) is the source of truth for each SOP's behavior** (its `desc`, `methods`, and parameterization fields). Drafting is a transcription exercise, not a new design decision — no task below re-derives what a SOP does; each cites the graph's own wording. (Spec §5, §6)
- **4 SOPs are unverified proposals** (`rhetorical-structure-quality`, `engineering-config-grading`, `reproducibility-third-party-verification`, and the folded `rhetorical-completeness-check` mode inside `quality-appraisal-checklist` — see correction below). They get built and tested like the other 26, but their frontmatter `description` must say "(proposal, unverified)" so triggering never implies equivalent confidence to a verified methodology. (Spec §10)
- **SKILL.md body under ~500 lines**; large parameter tables (e.g. `study-design-tool-gate`'s dispatch table) go in `references/` with a table of contents. (Spec §7, skill-creator conventions)
- **`dependencies.sops: [spawn-agent]` on every SOP.** No per-SOP model/tool override unless a specific SOP's testing shows otherwise. (Spec §7)
- **No naming collisions with the existing flat DARE `.claude/skills/` namespace.** Re-verified for all 30 names below (Task 1, Step 5) — confirmed clean as of this plan's writing.
- **Full skill-creator eval loop (test cases, with-skill/baseline runs, benchmark, description-triggering optimization) runs once per build group** (i.e. once per task below that produces multiple SOPs), not per individual file — per spec §7's sequencing and skill-creator's own guidance that triggering-optimization is a final, package-wide pass.

**Two corrections made to the spec while planning, flagged here rather than silently baked in:**

1. **`rhetorical-completeness-check` is not a graph node.** Checking the graph file's actual `nodes` array (32 objects) against spec §4's repository-structure tree (31 lines) turned up a mismatch: spec §4 lists `rhetorical-completeness-check/SKILL.md` as its own file, but the graph only ever mentions `rhetorical-completeness-check（提案）` as a **method label on one edge** (`unit-classification → quality-appraisal-checklist`), with the edge's own comment describing it as "quality-appraisal-checklist 的一个入口模式" (a dispatch mode into that SOP, not a separate node). Per the spec's own rule that the graph is the source of truth over the transcription, this plan builds it as a parameterized entry mode of `quality-appraisal-checklist` (Task 9), not a 31st standalone file. This keeps the buildable count at exactly 30, matching spec §4's own stated total.
2. **`reproducibility-third-party-verification` was missing from spec §6's build-sequencing groups**, even though it's a real graph node (25th in the `nodes` array) with its own contract-table row (spec §5). Added to Group 8 below (Task 9) — it's closest in shape to the checklist family (a standalone parameterized criteria-check downstream of `unit-classification`), not a cascade.

## File Structure

```
paper-reading/
├── scripts/
│   └── validate_skill.py                                  (Task 1)
├── tests/
│   └── test_validate_skill.py                              (Task 1)
├── skills/
│   ├── paper-fetch/SKILL.md, prompt.md                     (Task 2)
│   ├── first-pass-skim/SKILL.md, prompt.md                 (Task 3)
│   ├── second-pass-grasp/SKILL.md, prompt.md                (Task 3)
│   ├── third-pass-deep-read/SKILL.md, prompt.md             (Task 3)
│   ├── qalmri/SKILL.md, prompt.md                           (Task 4)
│   ├── qasper-evidence-qa/SKILL.md, prompt.md               (Task 4)
│   ├── template-slot-filling/SKILL.md, prompt.md            (Task 4)
│   ├── question-framing/SKILL.md, prompt.md                 (Task 4)
│   ├── research-question-appraisal/SKILL.md, prompt.md      (Task 4)
│   ├── dual-column-self-check/SKILL.md, prompt.md            (Task 4)
│   ├── unit-segmentation/SKILL.md, prompt.md                (Task 5)
│   ├── unit-classification/SKILL.md, prompt.md              (Task 5)
│   ├── multi-stage-cascade-extraction/SKILL.md, prompt.md   (Task 5)
│   ├── rhetorical-structure-quality/SKILL.md, prompt.md     (Task 5)
│   ├── atomic-unit-writing/SKILL.md, prompt.md              (Task 6)
│   ├── atomic-unit-matching/SKILL.md, prompt.md             (Task 6)
│   ├── atomic-unit-recall-aggregate/SKILL.md, prompt.md     (Task 6)
│   ├── claim-writing/SKILL.md, prompt.md                    (Task 7)
│   ├── rationale-selection/SKILL.md, prompt.md               (Task 7)
│   ├── claim-label-prediction/SKILL.md, prompt.md           (Task 7)
│   ├── study-design-tool-gate/SKILL.md, prompt.md            (Task 8)
│   │   └── references/tool-dispatch-table.md                (Task 8)
│   ├── signalling-question-answering/SKILL.md, prompt.md    (Task 8)
│   ├── domain-level-judgment/SKILL.md, prompt.md            (Task 8)
│   ├── star-awarding/SKILL.md, prompt.md                    (Task 8)
│   ├── worst-case-lookup/SKILL.md, prompt.md                (Task 8)
│   ├── sum-threshold-scoring/SKILL.md, prompt.md            (Task 8)
│   ├── quality-appraisal-checklist/SKILL.md, prompt.md      (Task 9)
│   │   └── references/item-sets.md                          (Task 9)
│   ├── reporting-standard-checklist/SKILL.md, prompt.md     (Task 9)
│   │   └── references/item-sets.md                          (Task 9)
│   ├── engineering-config-grading/SKILL.md, prompt.md       (Task 9)
│   └── reproducibility-third-party-verification/SKILL.md, prompt.md (Task 9)
└── docs/superpowers/{specs,plans}/                           — already exist
```

Every SOP directory holds `SKILL.md` (frontmatter + orchestration notes) and `prompt.md` (the subagent role/instructions `spawn-agent` reads), matching the existing pattern at `staged/wechat-article-v1/skills/first-pass-skim/`.

---

## Task 1: Skill-file validator script

**Files:**
- Create: `paper-reading/scripts/validate_skill.py`
- Create: `paper-reading/tests/test_validate_skill.py`
- Test: `paper-reading/tests/test_validate_skill.py`

**Interfaces:**
- Produces: `validate_skill(path: str) -> list[str]` — empty list = valid. Every later task's "validate" step runs `python scripts/validate_skill.py skills/<name>/SKILL.md` and expects `No errors found` + exit code 0.

**Why this script, not skill-creator's own `scripts/quick_validate.py`:** `quick_validate.py` enforces the *native* Claude Code skill frontmatter schema — it rejects any frontmatter key outside `{name, description, license, allowed-tools, metadata, compatibility}`. This package's SOPs use DARE's own convention (`execution`, `prompt`, `input`, `output`, `dependencies`), the same one already used throughout `staged/wechat-article-v1/skills/*` and the 920-skill flat `.claude/skills/` namespace — these files aren't loaded by Claude Code's native skill loader, they're read and orchestrated by `spawn-agent`. Running `quick_validate.py` against them would reject every single one for "unexpected keys". `validate_skill.py` (recreated below) checks what actually matters for this convention: frontmatter parses as YAML, `name`+`description` present, body under 500 lines. This script already existed once (v1 commit `c9d6f1f`) and was removed only because v1 itself was staged away (commit `4f33398`) — recreating it verbatim is reuse, not new design (ponytail ladder rung 2: already-written-once beats rewriting).

- [ ] **Step 1: Write the failing tests**

Create `paper-reading/tests/test_validate_skill.py`:

```python
import sys
import os
import tempfile
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scripts"))
from validate_skill import validate_skill


def _write(tmp_path, content):
    path = os.path.join(tmp_path, "SKILL.md")
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    return path


@pytest.fixture
def tmp_dir():
    return tempfile.mkdtemp()


def test_valid_skill_has_no_errors(tmp_dir):
    content = "---\nname: example-skill\ndescription: Does a thing.\n---\n\n# Example\n\nBody.\n"
    path = _write(tmp_dir, content)
    assert validate_skill(path) == []


def test_missing_name_field_is_an_error(tmp_dir):
    content = "---\ndescription: Does a thing.\n---\n\n# Example\n"
    path = _write(tmp_dir, content)
    errors = validate_skill(path)
    assert any("name" in e for e in errors)


def test_missing_description_field_is_an_error(tmp_dir):
    content = "---\nname: example-skill\n---\n\n# Example\n"
    path = _write(tmp_dir, content)
    errors = validate_skill(path)
    assert any("description" in e for e in errors)


def test_missing_frontmatter_is_an_error(tmp_dir):
    content = "# Example\n\nNo frontmatter at all.\n"
    path = _write(tmp_dir, content)
    errors = validate_skill(path)
    assert any("frontmatter" in e.lower() for e in errors)


def test_body_over_500_lines_is_an_error(tmp_dir):
    body = "\n".join(f"line {i}" for i in range(600))
    content = f"---\nname: example-skill\ndescription: Does a thing.\n---\n\n{body}\n"
    path = _write(tmp_dir, content)
    errors = validate_skill(path)
    assert any("500" in e for e in errors)


def test_nonexistent_file_is_an_error():
    errors = validate_skill("/nonexistent/SKILL.md")
    assert len(errors) == 1
    assert "not found" in errors[0].lower()
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `D:\anaconda3\python.exe -m pytest paper-reading/tests/test_validate_skill.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'validate_skill'`.

- [ ] **Step 3: Write the implementation**

Create `paper-reading/scripts/validate_skill.py`:

```python
"""Validate a DARE-style SKILL.md file: frontmatter presence, required
fields, and body length. See paper-reading/docs/superpowers/specs/
2026-08-07-paper-reading-v2-design.md §7 for the convention this checks.
"""
import sys
import yaml

MAX_BODY_LINES = 500
REQUIRED_FIELDS = ["name", "description"]


def validate_skill(path: str) -> list[str]:
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

    body_lines = body.count("\n")
    if body_lines > MAX_BODY_LINES:
        errors.append(
            f"Body is {body_lines} lines, exceeds the {MAX_BODY_LINES}-line "
            "guideline (spec §7) — split large reference material into references/"
        )

    return errors


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python validate_skill.py <path/to/SKILL.md>")
        sys.exit(1)

    errors = validate_skill(sys.argv[1])
    if errors:
        for e in errors:
            print(f"ERROR: {e}")
        sys.exit(1)
    else:
        print("No errors found")
        sys.exit(0)
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `D:\anaconda3\python.exe -m pytest paper-reading/tests/test_validate_skill.py -v`
Expected: 6 passed

- [ ] **Step 5: Naming-collision check against the existing DARE namespace**

```bash
cd "D:\YOGSOTH-AI\.claude\skills"
for name in paper-fetch first-pass-skim second-pass-grasp third-pass-deep-read qalmri qasper-evidence-qa template-slot-filling question-framing research-question-appraisal dual-column-self-check unit-segmentation unit-classification multi-stage-cascade-extraction rhetorical-structure-quality atomic-unit-writing atomic-unit-matching atomic-unit-recall-aggregate claim-writing rationale-selection claim-label-prediction study-design-tool-gate signalling-question-answering domain-level-judgment star-awarding worst-case-lookup sum-threshold-scoring quality-appraisal-checklist reporting-standard-checklist engineering-config-grading reproducibility-third-party-verification; do
  [ -d "$name" ] && echo "COLLISION: $name"
done
echo "check complete"
```

Expected: only `check complete` printed. This exact list was already checked once during this plan's writing (clean) — this step re-confirms it hasn't changed since.

- [ ] **Step 6: Commit**

```bash
cd "D:\YOGSOTH-AI\paper-reading"
git add scripts/validate_skill.py tests/test_validate_skill.py
git commit -m "Add SKILL.md frontmatter/length validator for v2"
```

---

## Task 2: `paper-fetch` SOP (entry point)

**Files:**
- Create: `paper-reading/skills/paper-fetch/SKILL.md`
- Create: `paper-reading/skills/paper-fetch/prompt.md`

**Interfaces:**
- Consumes: `paper_ref` (string — title, arXiv ID, DOI, or URL). Nothing upstream — this is the pipeline's sole entry point.
- Produces: `{status: "found" | "not_found", full_text: string | null, source_channel: "alphaxiv" | "biorxiv" | "medrxiv" | null, source_url: string | null, identifier: string | null}` — the exact schema fixed in `context/2026-08-07-15-15-paper-fetch-sop-design.md`. This is what **every** downstream task in this plan consumes as its `full_text` input. `status: "not_found"` means every other field is `null` and no downstream SOP may proceed.

Before writing, run `Skill({skill: "skill-creator"})`.

This SOP's behavior is not being re-derived here — it was already fully designed in `context/2026-08-07-15-15-paper-fetch-sop-design.md` (the dedicated design doc from this package's brainstorming phase). This task transcribes that design into skill-creator-compliant files.

- [ ] **Step 1: Write `paper-fetch/prompt.md`**

```markdown
# Paper Fetch — Subagent Prompt

You are retrieving the full text of one specified academic paper, trying
four channels in a fixed order, and stopping the moment one succeeds. You
do NOT delegate this to any other reading skill — you call the search/fetch
MCP tools directly, yourself, in this subagent.

## Input

- **paper_ref**: title, arXiv ID, DOI, or URL — any one of these, caller's choice

## Decision flow (follow in this exact order — do not skip or reorder steps)

### Step 1: alphaxiv

Call `mcp__alphaxiv__discover_papers` or resolve `paper_ref` directly against
alphaxiv, then `mcp__alphaxiv__get_paper_content(fullText: true)`.

alphaxiv's own declared coverage is CS / math / physics / statistics /
quantitative biology-finance / EE — NOT biomedical/clinical/life-science. A
hit here is itself the signal that this paper is outside the bio domain; a
miss is your first (not yet conclusive) signal that it might be a bio paper.

- **Found** → stop here. Return `status: found, source_channel: alphaxiv,
  source_url: <the resolved URL>, identifier: <arXiv ID>, full_text: <the
  fetched text>`.
- **Not found** → continue to Step 2.

### Step 2: Semantic Scholar (routing lookup, not a fetch)

Call `mcp__semantic-scholar__relevanceSearch` or `mcp__semantic-scholar__paper`
using the title/DOI from `paper_ref`. You are not trying to read the paper
here — you're reading its `venue` and `externalIds` to decide where to look
next.

- If `externalIds` contains an arXiv ID that alphaxiv didn't have indexed
  (e.g. the paper is very new) → retry Step 1 with that specific arXiv ID.
  Found on retry → return as in Step 1.
- If `venue` indicates bioRxiv / medRxiv / PubMed-family, OR Semantic Scholar
  itself returns nothing, OR `venue` is unrecognizable → in every one of
  these cases, proceed to Step 3 carrying whatever DOI Semantic Scholar gave
  you (or the raw title if it gave no DOI). Do not treat "SS found nothing"
  as a dead end — it routes to Step 3 exactly like a bio-venue hit does.

### Step 3: bioRxiv / medRxiv

Call `mcp__biorxiv__search_preprints` and `mcp__medrxiv__search_preprints`
with the title (these are keyword search tools, not direct-by-ID lookups —
you cannot query them by DOI directly, only match by title/keywords and then
confirm the DOI in the result).

- **High-confidence title match found** → call the matching `fetch_fulltext(doi)`
  tool (`mcp__biorxiv__fetch_fulltext` or `mcp__medrxiv__fetch_fulltext`).
  Return `status: found, source_channel: biorxiv` or `medrxiv`,
  `source_url` (construct from the DOI per that channel's convention),
  `identifier: <the DOI>`, `full_text: <the fetched text>`.
- **No confident match in either** → continue to Step 4.

### Step 4: Exhausted — report failure

Return exactly:
```json
{"status": "not_found", "full_text": null, "source_channel": null, "source_url": null, "identifier": null}
```

Do NOT fabricate any text, summary, or partial content. Do NOT fall back to
your own background knowledge of the paper's likely content. A `not_found`
result is a valid, complete, and final answer — the caller is expected to
halt the entire downstream pipeline on it, not retry you with a vaguer query.

## Output

Return ONLY the JSON structure shown in whichever step you stopped at
(Step 1, Step 3, or Step 4) — no additional commentary, no partial fields
filled in speculatively.

## Instructions

1. Try the steps in order. Never skip a step because you "expect" the paper
   is in a particular domain — the routing logic exists precisely because a
   guess ("this sounds biomedical, skip straight to bioRxiv") would miss a
   cross-domain paper (e.g. ML applied to genomics) that alphaxiv actually
   does index.
2. Stop at the first success. Do not continue checking further channels
   "just to be thorough" once you have `full_text`.
3. `source_anchor`-level precision is not this SOP's job — that happens
   downstream, once other SOPs read the `full_text` you return. Your only
   job is retrieval + channel bookkeeping.
```

- [ ] **Step 2: Write `paper-fetch/SKILL.md`**

```markdown
---
name: paper-fetch
description: Retrieve the full text of one specified academic paper (by title, arXiv ID, DOI, or URL) by trying alphaxiv, then Semantic Scholar for channel routing, then bioRxiv/medRxiv, in that fixed order, stopping at the first success. Use this as the mandatory first step whenever any other paper-reading SOP in this package needs the actual text of a paper — it is the sole entry point of the pipeline and every downstream SOP depends on its output. If it returns not_found, halt immediately; do not fabricate content or guess at the paper's likely contents.
execution: subagent
prompt: ./prompt.md
input: paper_ref (string — title, arXiv ID, DOI, or URL)
output: status (string: "found" | "not_found"), full_text (string | null), source_channel (string | null), source_url (string | null), identifier (string | null)
dependencies:
  sops:
  - spawn-agent
---

# Paper Fetch

The pipeline's sole entry point: retrieves a paper's full text via a fixed four-channel fallback (alphaxiv → Semantic Scholar routing → bioRxiv/medRxiv → not_found), decoupled from `literature-engine`'s `literature-research`/`literature-search`/`literature-overview` — this SOP holds its own MCP tool calls rather than delegating.

## Execution

Subagent — spawned via spawn-agent skill.

## Why Subagent

Multi-step channel fallback with domain-inference judgment calls (is a Semantic-Scholar miss a bio signal or a "just not indexed anywhere" signal?) benefits from a dedicated context that can hold the whole decision tree without the noise of whatever task will consume its output next.

## Why Not Built on literature-engine

`literature-overview`/`literature-search`/`literature-research` already have an alphaxiv-primary/SS-supplementary pattern, but none has a bioRxiv/medRxiv branch or an explicit "can't retrieve → halt" contract, and this package is deliberately decoupled from that pipeline's scope (see `context/2026-08-07-15-15-paper-fetch-sop-design.md` and spec §9). Do not refactor this SOP to import those skills later without revisiting that decision explicitly.

## Full design reference

`context/2026-08-07-15-15-paper-fetch-sop-design.md` — the complete decision-flow rationale (why alphaxiv's coverage list is the domain signal, why an SS miss still routes to bio rather than dead-ending) lives there; `prompt.md` here is that design already transcribed into subagent instructions.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 3: Validate**

```bash
cd "D:\YOGSOTH-AI\paper-reading"
D:\anaconda3\python.exe scripts/validate_skill.py skills/paper-fetch/SKILL.md
```

Expected: `No errors found`

- [ ] **Step 4: Commit**

```bash
cd "D:\YOGSOTH-AI\paper-reading"
git add skills/paper-fetch/
git commit -m "Add paper-fetch entry-point SOP"
```

---

## Task 3: Keshav cascade — `first-pass-skim`, `second-pass-grasp`, `third-pass-deep-read`

**Files:**
- Create: `paper-reading/skills/first-pass-skim/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/second-pass-grasp/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/third-pass-deep-read/SKILL.md`, `prompt.md`

**Interfaces:**
- `first-pass-skim` consumes: `full_text` from `paper-fetch`. Produces: `skim_notes` (string — one-sentence core claim, abstract's stated main result, load-bearing figure/table titles), `read_deeper` (bool — whether this paper warrants passes 2-3 at all). Consumed by `second-pass-grasp`.
- `second-pass-grasp` consumes: `full_text`, `skim_notes` from `first-pass-skim`. Produces: `grasp_summary` (string — a paragraph a peer-level summary of the paper's main contribution, per Keshav's own criterion: "able to summarize the main thrust of the paper, with supporting evidence, to someone else"). Consumed by `third-pass-deep-read`.
- `third-pass-deep-read` consumes: `full_text`, `grasp_summary`. Produces: `deep_read_notes` (string — implicit assumptions surfaced, a virtual re-implementation attempt, specific points where the paper's own approach could be improved). Terminal — no downstream SOP.

Before writing any file below, run `Skill({skill: "skill-creator"})`.

**Correcting v1's version of this cascade (S2 fix from the coverage audit — apply, don't just copy):** v1's `first-pass-skim`/`second-pass-grasp`/`third-pass-verify` (at `staged/wechat-article-v1/skills/`) built a "structured bundle draft + uncertain_fields" output that belongs to v1's own WeChat-article pipeline, not to Keshav's original method. The graph's `desc` for `second-pass-grasp` is explicit: "产出是叠进式理解本身，非持久化结构物（Keshav是46项里唯一不落盘结构化物的方法）" — the output IS the accumulated understanding, not a structured artifact. And `third-pass-verify` was corrected to `third-pass-deep-read` specifically because v1's "no-op if nothing flagged uncertain" framing deleted Keshav's third pass entirely — the real third pass is "4-5小时以上：逐句重读含证明，virtual re-implementation…三遍里最重的一遍，不是可空转的复核步." Do not port v1's `uncertain_fields`/bundle-schema logic into these three files.

- [ ] **Step 1: Write `first-pass-skim/prompt.md`**

```markdown
# First Pass Skim — Subagent Prompt

You are doing Keshav's first pass over one paper: 5-10 minutes, title,
abstract, section headings, figures/tables, and conclusion only. This pass
decides whether the paper is worth a deeper read at all — it is not a
content-extraction pass.

## Input

- **full_text**: the paper's full text (from paper-fetch)

## Instructions

1. Read title + abstract.
2. Skim section headings only — do not read section bodies.
3. Look at figure/table captions only, not surrounding body text.
4. Read the conclusion.
5. Decide: does this paper warrant the deeper passes? Keshav's own criterion
   is whether you can already tell, from this shallow pass, that the paper
   is (a) relevant to what you need it for, and (b) not fundamentally flawed
   in a way visible even at this depth (e.g. the abstract's claim and the
   conclusion's claim don't match).

## Output

- **skim_notes**: one-sentence core claim + the abstract's stated main
  result (quote it) + any figure/table titles that look load-bearing.
- **read_deeper**: true/false — your judgment from step 5. If false, say why
  in one sentence inside skim_notes; the caller may still choose to proceed
  to second-pass-grasp regardless of this flag, but the flag itself must
  reflect your honest first-pass judgment, not be defaulted to true.
```

- [ ] **Step 2: Write `first-pass-skim/SKILL.md`**

```markdown
---
name: first-pass-skim
description: Keshav's first pass over one paper — a 5-10 minute skim of title, abstract, headings, figures, and conclusion only, producing skim notes and a read-deeper judgment. Use this as the first step whenever a paper is being read via the Keshav three-pass method; always precedes second-pass-grasp and never reads section bodies itself.
execution: subagent
prompt: ./prompt.md
input: full_text (string)
output: skim_notes (string), read_deeper (boolean)
dependencies:
  sops:
  - spawn-agent
---

# First Pass Skim

Keshav's first pass: title/abstract/headings/figures/conclusion only, no body text — cheaply decides whether a paper is worth the deeper passes.

## Execution

Subagent — spawned via spawn-agent skill.

## Why Subagent

A dedicated context keeps the "first impression" honest and separately reviewable from the deeper passes that follow — it should not already know what pass 2 will later discover.

## Scope boundary (do not blur into second-pass-grasp)

This pass never reads section bodies. If asked to justify a claim by reading Methods/Results, that request belongs to second-pass-grasp, not here.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 3: Write `second-pass-grasp/prompt.md`**

```markdown
# Second Pass Grasp — Subagent Prompt

You are doing Keshav's second pass: read the whole paper with care, but
ignore proof/derivation details for now. The goal, in Keshav's own words, is
to be able to "summarize the main thrust of the paper, with supporting
evidence, to someone else." This produces accumulated understanding, not a
structured data artifact — do not force your output into a fixed-field
schema.

## Input

- **full_text**: the paper's full text
- **skim_notes**: output from first-pass-skim

## Instructions

1. Read the whole paper (Introduction, Method, Results, Discussion), noting
   figures/diagrams carefully — Keshav highlights that diagrams and other
   illustrations are usually the most useful sections.
2. Note any unfamiliar terminology and mark it, but do not chase it down by
   researching outside the paper — flag it for the third pass instead if it
   turns out to matter.
3. Ignore proofs of theorems and mathematical derivation details in this
   pass — those are the third pass's job, not this one's.

## Output

- **grasp_summary**: a paragraph capable of standing in for "explain this
  paper's main contribution and its supporting evidence to a colleague who
  hasn't read it." Include what you'd flag as needing the third pass's
  deeper scrutiny (e.g. "the claim in section 4.2 rests on a derivation I
  haven't verified" or "term X is used without definition and matters for
  understanding the result").

## Instructions (continued)

Do not draft a fixed-schema bundle (problem/method/result/limitation
fields) here — that is a downstream package's concern (e.g.
`extract-structured-bundle`-style SOPs elsewhere in this pipeline, not this
one). Keshav's second pass output is prose understanding, by design.
```

- [ ] **Step 4: Write `second-pass-grasp/SKILL.md`**

```markdown
---
name: second-pass-grasp
description: Keshav's second pass — a careful full read (ignoring proof/derivation detail) producing prose-level understanding sufficient to explain the paper's main contribution and evidence to a colleague. Use this after first-pass-skim, as the main content-grasping pass of the Keshav three-pass method; do not force its output into a structured data schema.
execution: subagent
prompt: ./prompt.md
input: full_text (string), skim_notes (string)
output: grasp_summary (string)
dependencies:
  sops:
  - spawn-agent
---

# Second Pass Grasp

Keshav's second pass: full read, proofs/derivations deferred, output is accumulated prose understanding (not a structured artifact — this is the one method in this package's whole method set that deliberately does not produce a persisted structured object).

## Execution

Subagent — spawned via spawn-agent skill.

## Why Subagent

Full-text reading toward a genuine "could explain this to a colleague" understanding benefits from an uninterrupted context, distinct from the shallow first pass and the exhaustive third pass.

## Do not port v1's bundle schema here

An earlier version of this package (`staged/wechat-article-v1/skills/second-pass-grasp/`) produced a `draft_bundle` + `uncertain_fields` structure for its own WeChat-article pipeline. That was correct for v1's purpose but is NOT Keshav's original second pass — this v2 SOP's output is prose, per the graph's explicit correction (`context/2026-08-07-13-42-sop-pipeline-graph.html`, node `second-pass-grasp`, "S2修订"). Do not reintroduce the bundle schema here.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 5: Write `third-pass-deep-read/prompt.md`**

```markdown
# Third Pass Deep Read — Subagent Prompt

You are doing Keshav's third pass — the heaviest of the three, meant to take
4-5+ hours of a human reader's time (scale your own effort accordingly: this
is not a quick recap step). The goal is to be able to virtually
re-implement the paper: reconstruct the same or a similar system purely
from the paper's description, then compare your reconstruction against the
actual paper to surface every implicit assumption and every place where
the approach could be improved.

## Input

- **full_text**: the paper's full text
- **grasp_summary**: output from second-pass-grasp (including anything it
  flagged as needing deeper scrutiny)

## Instructions

1. Re-read the entire paper sentence by sentence, including proofs and
   derivations you skipped in pass 2.
2. Attempt a virtual re-implementation: for each significant design
   decision the paper made, ask "how would I have built this, and does the
   paper's actual choice match, and why might it differ?"
3. Identify implicit assumptions the paper relies on but never states
   explicitly.
4. Note specific, concrete points where the paper's own approach could be
   improved — not generic "more experiments would help" filler, but
   specific technical alternatives grounded in what you just reconstructed.
5. Resolve every item `grasp_summary` flagged for deeper scrutiny.

## Output

- **deep_read_notes**: structured as (a) implicit assumptions surfaced,
  (b) virtual re-implementation notes (what matched your reconstruction,
  what didn't and why), (c) specific improvement points.

## Critical constraint

This pass must not be a no-op or a light "let me just double check
grasp_summary" pass. Per Keshav's own description this is the heaviest of
the three passes — treat "nothing to add beyond pass 2" as a result you
should be suspicious of, not a default outcome, since a genuine sentence-
by-sentence re-implementation attempt on any real paper surfaces something.
```

- [ ] **Step 6: Write `third-pass-deep-read/SKILL.md`**

```markdown
---
name: third-pass-deep-read
description: Keshav's third pass — the heaviest of the three, a full sentence-by-sentence re-read including proofs/derivations, attempting a virtual re-implementation of the paper to surface implicit assumptions and concrete improvement points. Use this after second-pass-grasp, as the terminal step of the Keshav three-pass method, whenever genuine mastery of a paper (not just a summary) is needed. This is not a skippable recap — treat "nothing new to add" as suspicious, not a default outcome.
execution: subagent
prompt: ./prompt.md
input: full_text (string), grasp_summary (string)
output: deep_read_notes (string)
dependencies:
  sops:
  - spawn-agent
---

# Third Pass Deep Read

Keshav's third pass: sentence-by-sentence re-read with proofs/derivations included, attempting virtual re-implementation. The heaviest pass of the three — terminal step of the Keshav cascade.

## Execution

Subagent — spawned via spawn-agent skill.

## Why renamed from `third-pass-verify` (v1's name)

v1's version of this SOP (`staged/wechat-article-v1/skills/third-pass-verify/`) treated this as a "targeted re-check of uncertain_fields, no-op if none flagged" step — which, per the coverage audit's S2 finding, effectively deleted Keshav's real third pass (a 4-5+ hour re-implementation attempt) and replaced it with a cheap verification step serving v1's own pipeline. This v2 SOP restores the actual third pass; the rename to `third-pass-deep-read` marks that this is not the same behavior as the old `third-pass-verify`, even though both sit in the same cascade position.

## Why Subagent

A genuine re-implementation attempt needs a context that can hold the full paper and reason through design alternatives without being anchored to how pass 2 already framed the contribution.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 7: Validate all three**

```bash
cd "D:\YOGSOTH-AI\paper-reading"
for f in skills/first-pass-skim/SKILL.md skills/second-pass-grasp/SKILL.md skills/third-pass-deep-read/SKILL.md; do
  D:\anaconda3\python.exe scripts/validate_skill.py "$f"
done
```

Expected: `No errors found` printed 3 times.

- [ ] **Step 8: Commit**

```bash
cd "D:\YOGSOTH-AI\paper-reading"
git add skills/first-pass-skim/ skills/second-pass-grasp/ skills/third-pass-deep-read/
git commit -m "Add Keshav three-pass cascade SOPs (v2, corrected per coverage audit S2)"
```

- [ ] **Step 9: skill-creator eval loop for this group**

Per the Global Constraints' eval-loop cadence, run skill-creator's test-case + eval process for these 3 SOPs together (2-3 realistic prompts per SOP, with-skill vs. baseline subagent runs, `eval-viewer/generate_review.py` for human review) before moving to Task 4. Re-invoke `Skill({skill: "skill-creator"})` and follow its "Running and evaluating test cases" section (Steps 1-5) verbatim — do not improvise a different eval mechanism.

---

## Task 4: Standalone single-step SOPs — `qalmri`, `qasper-evidence-qa`, `template-slot-filling`, `question-framing`, `research-question-appraisal`, `dual-column-self-check`

**Files:**
- Create: `paper-reading/skills/qalmri/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/qasper-evidence-qa/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/template-slot-filling/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/question-framing/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/research-question-appraisal/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/dual-column-self-check/SKILL.md`, `prompt.md`

**Interfaces:** All six consume `full_text` from `paper-fetch` directly and are terminal (no downstream SOP in this plan). Each produces a differently-shaped output per its own method, as specified per-SOP below.

Before writing any file below, run `Skill({skill: "skill-creator"})`. These six validate 6 different output shapes cheaply (per spec §6 group 3's own rationale) before the cascades in Tasks 5-9 — each is genuinely a single step, so no sub-steps are needed the way Task 3's cascade needed them.

- [ ] **Step 1: `qalmri`**

`prompt.md`:
```markdown
# QALMRI — Subagent Prompt

Produce a free-text worksheet with exactly six slots, per the QALMRI method.
There is no judgment/scoring algorithm here — this is a structured
note-taking format, not an evaluation.

## Input
- **full_text**: the paper's full text

## Output — exactly these six sections, each 1 paragraph
- **Question**: what question is the paper asking?
- **Alternatives**: what competing answers/hypotheses could there be?
- **Logic**: what is the paper's logical argument connecting its method to its question?
- **Method**: what did the paper actually do?
- **Results**: what did the paper find?
- **Inference**: what does the paper conclude, and is that conclusion actually warranted by the results (your own judgment, stated explicitly)?

## Instructions
1. Fill every slot — an empty slot is a sign you haven't found that part of the paper's argument yet, not a valid final answer.
2. "Inference" is the one slot that asks for your own judgment (does the logic hold), the other five are extraction.
```

`SKILL.md`:
```markdown
---
name: qalmri
description: Produce a six-slot QALMRI worksheet (Question, Alternatives, Logic, Method, Results, Inference) as free-text notes on one paper — a structured note-taking format, not a scored evaluation. Use this whenever the user wants a QALMRI-style reading worksheet for a specific paper.
execution: subagent
prompt: ./prompt.md
input: full_text (string)
output: qalmri_worksheet (dict — six string fields: question, alternatives, logic, method, results, inference)
dependencies:
  sops:
  - spawn-agent
---

# QALMRI

Six-slot free-text worksheet (Question/Alternatives/Logic/Method/Results/Inference), no judgment algorithm beyond the Inference slot itself.

## Execution

Subagent — spawned via spawn-agent skill.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 2: `qasper-evidence-qa`**

`prompt.md`:
```markdown
# QASPER Evidence QA — Subagent Prompt

Answer a specific question about the paper, grounding your answer in exact
evidence spans quoted from the text — free-text answer, no schema-driven
categorization.

## Input
- **full_text**: the paper's full text
- **question**: the specific question to answer about this paper

## Output
- **answer**: free-text answer to the question
- **evidence_spans**: list of exact quoted spans from full_text that support the answer (verbatim quotes, not paraphrases)

## Instructions
1. Every claim in `answer` must trace to at least one span in `evidence_spans` — do not answer from anything not directly quotable from full_text.
2. If the paper doesn't actually answer the question, say so explicitly rather than inferring an answer from context.
```

`SKILL.md`:
```markdown
---
name: qasper-evidence-qa
description: Answer a specific question about a paper, grounding the answer in exact quoted evidence spans from the text (QASPER-style question-driven QA with span-level evidence, no schema categorization). Use this whenever the user asks a specific factual question about a paper and wants the answer traceable to exact text spans.
execution: subagent
prompt: ./prompt.md
input: full_text (string), question (string)
output: answer (string), evidence_spans (list of strings)
dependencies:
  sops:
  - spawn-agent
---

# QASPER Evidence QA

Question-driven QA with evidence-span grounding — free text, no normalized schema, since schema-driven categorization methods don't apply to open-ended paper questions.

## Execution

Subagent — spawned via spawn-agent skill.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 3: `template-slot-filling`**

`prompt.md`:
```markdown
# Template Slot Filling — Subagent Prompt

Fill in one paper's values into an already-given attribute template — the
executable half of ORKG's comparison-template method (the other half,
building the template itself, is a human-curator task and out of scope
here: it's "labor-intensive and inconsistent among human domain-expert
curators" even for humans, per the documented ORKG constraint).

## Input
- **full_text**: the paper's full text
- **template_attribute_schema**: the pre-given list of attributes to fill (e.g. for a leaderboard-style template: Task, Dataset, Metric, Value — this mirrors SciREX's four-slot structure)

## Output
- **filled_template**: dict mapping each attribute in template_attribute_schema to the value this paper reports for it (or `null` + a one-line reason if the paper doesn't report that attribute)

## Instructions
1. Do not invent a new attribute not present in template_attribute_schema — if the paper has an interesting value that doesn't fit any given attribute, that's out of scope for this fill, not a reason to expand the schema yourself.
2. If an attribute genuinely isn't reported, return `null` with a one-line reason rather than guessing or leaving it blank with no explanation.
```

`SKILL.md`:
```markdown
---
name: template-slot-filling
description: Fill a paper's reported values into an already-given comparison-template attribute schema (e.g. Task/Dataset/Metric/Value) — the executable half of ORKG's comparison-template method. Use this when a template's attribute schema is already fixed and you need one paper's row filled in; this does NOT build new templates (that half is a human-curator task, out of scope).
execution: subagent
prompt: ./prompt.md
input: full_text (string), template_attribute_schema (list of strings)
output: filled_template (dict — attribute name to value or null+reason)
dependencies:
  sops:
  - spawn-agent
---

# Template Slot Filling

Fills a paper's values into a pre-given attribute template (ORKG comparison-template's executable half). Building the template itself is excluded — documented as a human-curator task, not an LLM-executable SOP.

## Execution

Subagent — spawned via spawn-agent skill.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 4: `question-framing`**

`prompt.md`:
```markdown
# Question Framing — Subagent Prompt

Fill a slot-based question-framing schema (PICO, PECO, or SPIDER — caller
picks which) from the paper's stated research question. This defines what
question is being asked; it does not evaluate the paper's content beyond
that.

## Input
- **full_text**: the paper's full text
- **slot_definitions**: which schema to use — one of `PICO` (Population/Intervention/Comparator/Outcome), `PECO` (Population/Exposure/Comparator/Outcome), `SPIDER` (Sample/Phenomenon of Interest/Design/Evaluation/Research type)

## Output
- **framed_question**: dict with one key per slot in the chosen schema, each value being what the paper's own research question maps to for that slot

## Instructions
1. Use only the schema named in slot_definitions — do not mix slots from a different schema even if they seem to fit better.
2. If a slot genuinely doesn't apply (e.g. no Comparator in a single-arm study), say so explicitly in that slot's value rather than leaving it blank with no explanation.
```

`SKILL.md`:
```markdown
---
name: question-framing
description: Fill a slot-based question-framing schema (PICO, PECO, or SPIDER) from a paper's stated research question. Use this whenever the user wants a paper's research question structured into one of these standard clinical/qualitative-research question frames; this frames what question is being asked, it does not read or evaluate the paper's content otherwise.
execution: subagent
prompt: ./prompt.md
input: full_text (string), slot_definitions (string — one of PICO, PECO, SPIDER)
output: framed_question (dict — schema-specific slot names to values)
dependencies:
  sops:
  - spawn-agent
---

# Question Framing

Slot-filling into PICO/PECO/SPIDER, parameterized on which schema — defines the question being asked, doesn't evaluate paper content.

## Execution

Subagent — spawned via spawn-agent skill.

## Not the same as research-question-appraisal

This SOP fills slots to describe what question is asked. `research-question-appraisal` (FINER) instead judges whether a research question is good — different structure, different SOP, not a parameterization of this one (see graph correction M15).

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 5: `research-question-appraisal`**

`prompt.md`:
```markdown
# Research Question Appraisal — Subagent Prompt

Judge the paper's own research question against the FINER criteria — five
independent judgments, not a slot-filling exercise. You are evaluating the
question itself, not the paper's execution of it.

## Input
- **full_text**: the paper's full text

## Output — one judgment + one-sentence justification per criterion
- **feasible**: can this question realistically be answered with the resources/data a study like this would need?
- **interesting**: would researchers in this area care about the answer?
- **novel**: does this question (or its specific angle) add something beyond what's already known?
- **ethical**: does answering this question raise no unaddressed ethical concerns?
- **relevant**: does the answer matter to patients/practice/the field, not just as an abstract exercise?

## Instructions
1. Each of the 5 is an independent judgment call, not a lookup — justify each with a specific one-sentence reason grounded in what the paper's introduction/motivation actually says.
2. This appraises the research question the paper states it is asking, not whether the paper successfully answered it (that's a different, results-focused judgment, out of scope here).
```

`SKILL.md`:
```markdown
---
name: research-question-appraisal
description: Judge a paper's stated research question against the FINER criteria (Feasible, Interesting, Novel, Ethical, Relevant) — five independent judgments with justification, evaluating the question itself, not the paper's results. Use this whenever the user wants to know whether a paper is asking a good research question, distinct from whether it answered that question well.
execution: subagent
prompt: ./prompt.md
input: full_text (string)
output: finer_appraisal (dict — feasible, interesting, novel, ethical, relevant, each with a judgment and one-sentence justification)
dependencies:
  sops:
  - spawn-agent
---

# Research Question Appraisal

FINER: five independent judgments on the paper's stated research question (not on its execution or results). Structurally closer to a quality-appraisal checklist than to slot-filling — do not merge with question-framing (graph correction M15: PICO/PECO/SPIDER fill slots, FINER judges).

## Execution

Subagent — spawned via spawn-agent skill.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 6: `dual-column-self-check`**

`prompt.md`:
```markdown
# Dual Column Self-Check — Subagent Prompt

Run one of the ML/CS-domain reproducibility self-check checklists (ML
Reproducibility Checklist, REFORMS, NeurIPS Paper Checklist, Model Cards, or
Datasheets for Datasets — caller specifies via item_set) against this
paper, producing a two-column result per item: a category and a free-text
reason.

These checklists were originally written for AUTHORS to self-certify their
own paper before submission. You are using them in reverse — as a READER
auditing someone else's already-published paper — so each item must first
be read as a question about what the paper actually did/reported, not as an
instruction to the paper's own authors.

## Input
- **full_text**: the paper's full text
- **item_set**: which checklist to run (name it explicitly, e.g. "ML Reproducibility Checklist")

## Output
Per item in the chosen checklist:
- **category**: Yes / No / NA
- **reason**: one to two sentences, free text, citing what in the paper supports this category

## Instructions
1. Reverse each item's authorial framing into a reader's question before answering it (e.g. an item phrased "Include a description of computing infrastructure used" becomes "Does this paper describe its computing infrastructure?").
2. NA is a legitimate category when an item genuinely doesn't apply to this paper's type of work (e.g. a theory paper has no training-compute item to report) — do not force every item into Yes/No.
3. This checklist family is NOT gated by clinical study design (unlike quality-appraisal-checklist/reporting-standard-checklist) — invoke this directly whenever the input is an ML/CS-style paper needing a reproducibility self-audit, it has no upstream gate SOP in this package.
```

`SKILL.md`:
```markdown
---
name: dual-column-self-check
description: Run one of the ML/CS reproducibility checklists (ML Reproducibility Checklist, REFORMS, NeurIPS Paper Checklist, Model Cards, Datasheets for Datasets) against a paper as a reader-side audit, producing a category (Yes/No/NA) plus free-text reason per item. Use this whenever the user wants a reproducibility/completeness self-check run on an ML or CS paper — invoke this directly, it has no study-design gate in this package since these checklists are engineering self-audits, not clinical-study tools.
execution: subagent
prompt: ./prompt.md
input: full_text (string), item_set (string — name of the specific checklist)
output: checklist_result (list of {item, category, reason})
dependencies:
  sops:
  - spawn-agent
---

# Dual Column Self-Check

Category (Yes/No/NA) + free-text reason per item, across 5 ML/CS reproducibility checklists. Originally author-facing self-certification tools, reversed here for reader-side auditing — each item's framing must be flipped to a question before being answered.

## Execution

Subagent — spawned via spawn-agent skill.

## No upstream gate (intentional, not a gap)

Unlike `quality-appraisal-checklist`/`reporting-standard-checklist`, this SOP has no in-edge from `study-design-tool-gate` in the graph — its 5 checklists are ML/CS engineering self-audits, not tied to a clinical study design, so no study-design dispatch was ever drawn to it (spec §5's flagged note). Do not add a gate dependency here without revisiting that decision explicitly.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 7: Validate all six**

```bash
cd "D:\YOGSOTH-AI\paper-reading"
for f in skills/qalmri/SKILL.md skills/qasper-evidence-qa/SKILL.md skills/template-slot-filling/SKILL.md skills/question-framing/SKILL.md skills/research-question-appraisal/SKILL.md skills/dual-column-self-check/SKILL.md; do
  D:\anaconda3\python.exe scripts/validate_skill.py "$f"
done
```

Expected: `No errors found` printed 6 times.

- [ ] **Step 8: Commit**

```bash
cd "D:\YOGSOTH-AI\paper-reading"
git add skills/qalmri/ skills/qasper-evidence-qa/ skills/template-slot-filling/ skills/question-framing/ skills/research-question-appraisal/ skills/dual-column-self-check/
git commit -m "Add 6 standalone single-step SOPs (qalmri, qasper, template-fill, question-framing, FINER, dual-column-self-check)"
```

- [ ] **Step 9: skill-creator eval loop for this group**

Re-invoke `Skill({skill: "skill-creator"})` and run its eval process for these 6 SOPs before moving to Task 5.

---

## Task 5: Unit classification family — `unit-segmentation`, `unit-classification`, `multi-stage-cascade-extraction`, `rhetorical-structure-quality`

**Files:**
- Create: `paper-reading/skills/unit-segmentation/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/unit-classification/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/multi-stage-cascade-extraction/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/rhetorical-structure-quality/SKILL.md`, `prompt.md`

**Interfaces:**
- `unit-segmentation` consumes: `full_text` from `paper-fetch`. Produces: `units` (list of strings — sentence or clause spans, per `segmentation_granularity`), `unit_offsets` (list of {start, end} character offsets into `full_text`, so downstream classification can cite exact locations). Consumed by `unit-classification`.
- `unit-classification` consumes: `units`, `unit_offsets` from `unit-segmentation`; `label_set`, `hierarchy_toggle`, `output_type` params. Produces: `classified_units` (list of {unit_text, offset, label} or, if `output_type` is span-level, {label, span_text, span_offset}). Consumed by `rhetorical-structure-quality` and (in Task 9) `quality-appraisal-checklist`'s folded completeness-check mode.
- `multi-stage-cascade-extraction` consumes: `full_text` from `paper-fetch` directly (NOT gated behind `unit-segmentation` — see the note below). Produces: `extraction_graph` (dict — mentions, coreference clusters, [optional saliency labels], and the final N-ary relations/triples, per `stage_count`/`per_stage_label_set`/`saliency_layer_toggle`). Terminal.
- `rhetorical-structure-quality` consumes: `classified_units` from `unit-classification`. Produces: `argument_relations` (list of {label_a, label_b, relation_holds: bool, justification}) — judges whether e.g. an AIM label is adequately substantiated by a BACKGROUND label. Terminal. Proposal SOP (unverified).

Before writing any file below, run `Skill({skill: "skill-creator"})`.

**Why `multi-stage-cascade-extraction` connects directly to `paper-fetch`, not through `unit-segmentation`:** per the graph's edge list, this is a direct edge (`paper-fetch → multi-stage-cascade-extraction`), not routed through `unit-segmentation` the way the AZ/CoreSC/PICO-style classification chain is. The spec (§5's flagged note) explains why: SciERC/SciREX/NCG's cascade (mention detection → coreference → relation extraction) discovers its own spans rather than consuming pre-segmented sentence/clause units — sentence-level pre-segmentation is simply the wrong granularity for a cascade that reasons over document-level coreference clusters. This is preserved as-is, not "fixed" to add a dependency the graph deliberately does not draw.

- [ ] **Step 1: Write `unit-segmentation/prompt.md`**

```markdown
# Unit Segmentation — Subagent Prompt

Split the paper's text into the units that a downstream classification pass
will label one-by-one. This SOP does no labeling itself — only splitting.

## Input
- **full_text**: the paper's full text
- **segmentation_granularity**: "sentence" or "clause" (clause = further split on commas/semicolons within a sentence, matching CODA-19's own approach: 103,978 sentences → 168,286 clause-level fragments)
- **scope**: "full_text" | "abstract" | "intro_only" — which part of full_text to segment (Swales move analysis, for instance, is scoped to the introduction only)

## Output
- **units**: ordered list of the resulting text spans (sentences or clauses per segmentation_granularity, restricted to scope)
- **unit_offsets**: ordered list of {start, end} character offsets into full_text, one per unit, so a downstream SOP can cite exact locations rather than re-searching for the text

## Instructions
1. Respect `scope` strictly — if scope is "intro_only", do not segment the rest of the paper even if it seems useful context; the caller asked for this specific scope for a reason (e.g. Swales's method is defined only over introductions).
2. Clause splitting on commas/semicolons will occasionally produce a fragment that isn't a complete clause grammatically — that's expected and matches the source methodology's own behavior (CODA-19 accepts this trade-off for finer-grained labeling), not a bug to silently "fix" by merging fragments back together.
```

- [ ] **Step 2: Write `unit-segmentation/SKILL.md`**

```markdown
---
name: unit-segmentation
description: Split a paper's text into sentence- or clause-level units (with character offsets) for downstream classification, at a caller-specified granularity and scope (full text, abstract-only, or intro-only). Use this as the mandatory first step whenever any sentence/clause-level classification method (Argumentative Zoning, CoreSC, PubMed-RCT, CSAbstruct, Swales move analysis, CODA-19) needs its input pre-segmented — always precedes unit-classification.
execution: subagent
prompt: ./prompt.md
input: full_text (string), segmentation_granularity (string: "sentence" | "clause"), scope (string: "full_text" | "abstract" | "intro_only")
output: units (list of strings), unit_offsets (list of {start: int, end: int})
dependencies:
  sops:
  - spawn-agent
---

# Unit Segmentation

Splits text into labeling units (sentence or clause granularity, scoped to full text/abstract/intro) — pure segmentation, no labeling.

## Execution

Subagent — spawned via spawn-agent skill.

## Why This Exists As Its Own Step

7 different classification methods (AZ, CoreSC, PubMed-RCT, NICTA-PIBOSO, CSAbstruct, CODA-19, Swales) all need pre-segmented units but disagree on granularity and scope — factoring segmentation out once, parameterized, avoids duplicating this logic inside `unit-classification` seven times over (graph correction L17/L18: the original graph was missing this step entirely, silently assuming pre-segmented input existed).

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 3: Write `unit-classification/prompt.md`**

```markdown
# Unit Classification — Subagent Prompt

Classify each pre-segmented unit independently against a fixed label set —
single-layer, no cross-unit dependency (this is what distinguishes this SOP
from `multi-stage-cascade-extraction`, which explicitly needs cross-unit/
document-level coreference reasoning).

## Input
- **units**: list of text units from unit-segmentation
- **unit_offsets**: matching offsets
- **label_set**: which label vocabulary to use (e.g. Argumentative Zoning's 7 zones, CoreSC's category set, PubMed-RCT's 5 sentence roles, Swales's move/step labels, CODA-19's category set — caller specifies the exact set)
- **hierarchy_toggle**: whether this label_set has a two-level hierarchy (Swales moves contain steps — if true, label both levels; if false, single-level labeling only)
- **output_type**: "single_label" (one label per unit) | "span_level" (labels apply to sub-spans within a unit, not the whole unit) | "tuple" (unit maps to a structured tuple, e.g. TDMS's Task-Dataset-Metric-Score)

## Output
- **classified_units**: per unit, the assigned label(s) per output_type, plus a copy of unit_offsets so downstream consumers can cite exact locations without re-deriving them.

## Instructions
1. Classify each unit independently — do not let the label assigned to unit N influence your read of unit N+1 beyond ordinary paper-level context (this SOP does not do cross-unit clustering; if a method genuinely needs that, it belongs in multi-stage-cascade-extraction, not here).
2. If hierarchy_toggle is true, both levels must be present in every classified unit's output, not just the top level.
3. Use exactly the label_set given — do not invent an "other" or "unclear" label unless the given label_set explicitly includes one.
```

- [ ] **Step 4: Write `unit-classification/SKILL.md`**

```markdown
---
name: unit-classification
description: Classify each pre-segmented text unit independently against a fixed label set (Argumentative Zoning, CoreSC, PubMed-RCT, Swales move/step, CODA-19, TDMS, or CSFCube's facet labels), single-layer with no cross-unit dependency. Use this after unit-segmentation has split the text, whenever a sentence- or clause-level rhetorical/functional classification is needed; do not use this for methods requiring document-level coreference reasoning (see multi-stage-cascade-extraction instead).
execution: subagent
prompt: ./prompt.md
input: units (list of strings), unit_offsets (list of {start, end}), label_set (string — name of the label vocabulary), hierarchy_toggle (boolean), output_type (string: "single_label" | "span_level" | "tuple")
output: classified_units (list of {unit_text, offset, label(s)})
dependencies:
  sops:
  - spawn-agent
---

# Unit Classification

Single-layer per-unit classification against a fixed, parameterized label set — no cross-unit or document-level dependency. Covers 7 methods (AZ/CoreSC/PubMed-RCT/NICTA-PIBOSO/CSAbstruct/CODA-19/Swales) plus TDMS's tuple-output variant, plus CSFCube's 3 facet labels as one more label_set option.

## Execution

Subagent — spawned via spawn-agent skill.

## Why SciERC/SciREX/NCG Are NOT Parameterized Here

An earlier graph draft tried to fold SciERC/SciREX into this node via a boolean toggle; the coverage audit (S6) found this doesn't work — those methods need document-level coreference clustering and (for SciREX) saliency judgment over ALL mentions in the paper, not per-unit independent classification. A boolean can't absorb that difference; they live in `multi-stage-cascade-extraction` instead.

## CSFCube's Role Here

`csfcube-facet` is documented as out-of-scope as its own SOP (its real task — multi-document pairwise relevance ranking — has no single-paper analog), but its 3 facet-label definitions (Background/Objective, Method, Result) are reused here as one more valid `label_set` option, per spec §3.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 5: Write `multi-stage-cascade-extraction/prompt.md`**

```markdown
# Multi-Stage Cascade Extraction — Subagent Prompt

Run a multi-stage extraction cascade over the FULL paper text (not
pre-segmented units — you discover your own spans): mention detection,
then document-level coreference clustering, then (optionally) saliency
judgment, then N-ary relation/triple extraction over the clustered
mentions. Each stage consumes the FULL output of the stage before it.

## Input
- **full_text**: the paper's full text (read directly — do not expect pre-segmented units)
- **stage_count**: how many stages this run uses (2 for a mention+relation-only cascade, 3 to add coreference, 4 to add saliency)
- **per_stage_label_set**: the entity/relation label vocabulary for each stage
- **saliency_layer_toggle**: whether to include a saliency-judgment stage (only some methods, e.g. SciREX, require this; SciERC's cascade doesn't)

## Stages (run in this exact order — do not skip or reorder)

1. **Mention detection**: find every candidate entity mention in the full text (spans, with entity-type label per per_stage_label_set).
2. **Coreference clustering**: group mentions across the ENTIRE document that refer to the same underlying entity (this is document-level — a mention in the Introduction and one in Results can cluster together).
3. **[If saliency_layer_toggle] Saliency judgment**: for each cluster, judge whether it is salient enough to be a candidate for the paper's key claims (SciREX's own finding: this saliency filtering step, done wrong, is where a large share of end-to-end error compounds — over half of NCG's reported accuracy loss traces to compounding errors introduced stage-over-stage, not to any single stage alone).
4. **Relation/triple extraction**: extract N-ary relations or triples (e.g. SciREX's 4-slot Task-Dataset-Metric-Score tuples) over the clustered (and, if applicable, saliency-filtered) mentions — note that SciREX's own tuples are 99% cross-sentence and 55% cross-section, meaning this stage genuinely needs the document-level clustering from stage 2, not per-sentence reasoning.

## Output
- **extraction_graph**: {mentions: [...], clusters: [...], [saliency_labels: [...]], relations: [...]} — include every stage's intermediate output, not just the final relations, since each stage's output is independently useful and errors compound across stages (a caller debugging a bad final relation needs to see which earlier stage introduced the error).

## Instructions
1. Do not collapse stages — even if you could "just see" the final relations directly, produce the intermediate mention/cluster output too, since this cascade's whole point (per the source methodologies) is that later stages depend on and can be debugged against earlier ones.
2. Confidence should generally decrease stage-over-stage — if your saliency or relation-extraction stage produces results you're just as confident about as your mention-detection stage, treat that as a signal to double-check rather than a sign of unusually clean data.
```

- [ ] **Step 6: Write `multi-stage-cascade-extraction/SKILL.md`**

```markdown
---
name: multi-stage-cascade-extraction
description: Run a multi-stage extraction cascade (mention detection, document-level coreference clustering, optional saliency judgment, N-ary relation/triple extraction) directly over a paper's full text — covers SciERC, SciREX, and NLP Contribution Graph. Use this whenever cross-sentence or document-level entity/relation extraction is needed (e.g. SciREX-style Task-Dataset-Metric-Score tuples); do NOT use unit-classification for this, since these methods reason over the whole document's mentions, not independently-classified sentence units.
execution: subagent
prompt: ./prompt.md
input: full_text (string), stage_count (integer), per_stage_label_set (dict), saliency_layer_toggle (boolean)
output: extraction_graph (dict — mentions, clusters, optional saliency_labels, relations)
dependencies:
  sops:
  - spawn-agent
---

# Multi-Stage Cascade Extraction

Mention detection → coreference clustering → [saliency] → relation extraction, all stages consuming the full prior stage's output. Covers SciERC/SciREX/NLP-Contribution-Graph — three methods with different stage counts but the same "consume-the-full-prior-layer" structure (graph correction S6: merged under the unifying rule "same action-sequence length → mergeable via parameterization").

## Execution

Subagent — spawned via spawn-agent skill.

## Why Direct From paper-fetch, Not Through unit-segmentation

This cascade discovers its own mention spans over the whole document rather than consuming pre-segmented sentence/clause units — sentence-level segmentation is the wrong granularity for a method whose relations are 99% cross-sentence (SciREX's own reported figure). This is a deliberate graph choice, not an oversight — see spec §5's flagged note before "fixing" this dependency.

## Errors Compound Stage-Over-Stage

NLP Contribution Graph's own reported consistency figures fall from stage to stage (67.92% → 41.82% → 22.31%) — this is the shared risk profile of this whole method family, not specific to one method. Producing every stage's intermediate output (not just the final relations) is what makes this compounding visible and debuggable.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 7: Write `rhetorical-structure-quality/prompt.md`**

```markdown
# Rhetorical Structure Quality — Subagent Prompt (PROPOSAL, unverified)

You are a second-order SOP: you consume unit-classification's OUTPUT
(already-labeled units), not the raw paper text directly. Judge whether the
argumentative relations between labeled units actually hold — e.g. is a unit
labeled AIM adequately substantiated by units labeled BACKGROUND?

This is an unverified proposal SOP (no primary-source precedent, unlike
CoreSC/AZ themselves) — filling a gap in the evaluative-stance × content-
layer matrix (quality-judgment applied to argumentative/rhetorical roles,
which no existing verified method covers). Treat outputs with proportionally
more skepticism than a verified method's outputs.

## Input
- **classified_units**: output from unit-classification (units + their assigned rhetorical labels)

## Output
- **argument_relations**: list of {label_a, label_b, relation_holds: bool, justification} — one entry per rhetorically-linked label pair you find in the paper's actual structure (not every possible label pair combinatorially — only ones the paper's own argument structure actually connects)

## Instructions
1. Ground every relation_holds judgment in the actual text of the labeled units, not in a generic template of what "should" connect (e.g. don't assume every paper must have an AIM-BACKGROUND link; some papers' argument structure genuinely doesn't need one).
2. Since this is a proposal method with no established inter-annotator-agreement baseline, flag any judgment you're materially uncertain about rather than presenting all judgments with uniform confidence.
```

- [ ] **Step 8: Write `rhetorical-structure-quality/SKILL.md`**

```markdown
---
name: rhetorical-structure-quality
description: (Proposal, unverified) Judge whether argumentative relations between unit-classification's rhetorical labels actually hold in a paper (e.g. is an AIM label adequately substantiated by BACKGROUND labels) — a second-order quality judgment over already-classified units, not raw text. Use this after unit-classification has labeled a paper's units with a rhetorical/argumentative label set, when the user wants to know if the paper's argument structure is actually sound, not just what role each sentence plays.
execution: subagent
prompt: ./prompt.md
input: classified_units (list of {unit_text, offset, label})
output: argument_relations (list of {label_a, label_b, relation_holds, justification})
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
```

- [ ] **Step 9: Validate all four**

```bash
cd "D:\YOGSOTH-AI\paper-reading"
for f in skills/unit-segmentation/SKILL.md skills/unit-classification/SKILL.md skills/multi-stage-cascade-extraction/SKILL.md skills/rhetorical-structure-quality/SKILL.md; do
  D:\anaconda3\python.exe scripts/validate_skill.py "$f"
done
```

Expected: `No errors found` printed 4 times.

- [ ] **Step 10: Commit**

```bash
cd "D:\YOGSOTH-AI\paper-reading"
git add skills/unit-segmentation/ skills/unit-classification/ skills/multi-stage-cascade-extraction/ skills/rhetorical-structure-quality/
git commit -m "Add unit classification family SOPs (B0/B/B2 chain + rhetorical-structure-quality proposal)"
```

- [ ] **Step 11: skill-creator eval loop for this group**

Re-invoke `Skill({skill: "skill-creator"})` and run its eval process for these 4 SOPs before moving to Task 6.

---

## Task 6: Atomic-unit family — `atomic-unit-writing`, `atomic-unit-matching`, `atomic-unit-recall-aggregate`

**Files:**
- Create: `paper-reading/skills/atomic-unit-writing/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/atomic-unit-matching/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/atomic-unit-recall-aggregate/SKILL.md`, `prompt.md`

**Interfaces:**
- `atomic-unit-writing` consumes: `full_text` from `paper-fetch`; `unit_source` ("extracted" | "authored"), `importance_tagging_toggle` params. Produces: `atomic_units` (list of {text, [importance: "vital"|"okay", if importance_tagging_toggle]}). Consumed by `atomic-unit-matching`.
- `atomic-unit-matching` consumes: `atomic_units`; `target_text` (the text being checked for coverage — e.g. a summary or a different paper's abstract, caller-provided); `judgment_value_domain` param. Produces: `match_results` (list of {unit_text, judgment}) where judgment is 2-valued (present/absent, for ACU) or 3-valued (support/partial_support/not_support, for Nugget) per `judgment_value_domain`. Consumed by `atomic-unit-recall-aggregate`.
- `atomic-unit-recall-aggregate` consumes: `match_results`, `atomic_units` (for importance weighting, if tagged). Produces: `recall_score` (float, ACU-style normalized recall with length penalty) or `{v_strict, a_strict, run_rank}` (Nugget-style, per which method's match_results it received). Terminal.

Before writing any file below, run `Skill({skill: "skill-creator"})`.

**On the sequential chain (S5 fix from the coverage audit):** the original graph draft stopped at matching — no node did the summing/normalizing/ranking that ACU and Nugget both require as their actual final output. This 3-SOP chain restores that: `atomic-unit-recall-aggregate` did not exist before the audit; it is the SOP that makes the method's own reported reliability figures (e.g. Nugget's run-level Kendall τ=0.887 vs per-topic τ=0.297–0.539) actually meaningful, since those figures describe the *aggregate*, not any single match judgment.

- [ ] **Step 1: Write `atomic-unit-writing/prompt.md`**

```markdown
# Atomic Unit Writing — Subagent Prompt

Produce a list of atomic content units from the paper — either extracted
verbatim-adjacent facts (ACU style) or freshly-authored short natural-
language statements (Nugget style), per unit_source.

## Input
- **full_text**: the paper's full text
- **unit_source**: "extracted" (ACU — pull atomic facts directly from the paper's own reference summary/abstract, phrased as close to the source as possible) | "authored" (Nugget — write short, fresh natural-language statements, averaging 7-8 tokens each, not required to quote the source verbatim)
- **importance_tagging_toggle**: whether to additionally tag each unit as "vital" or "okay" (Nugget's optional importance binary — vital units are the ones whose omission would make a summary meaningfully incomplete)

## Output
- **atomic_units**: list of {text, [importance: "vital" | "okay", only if importance_tagging_toggle is true]}

## Instructions
1. If unit_source is "extracted", write each unit as a single atomic fact that could stand alone as one clause of a longer summary — do not bundle two facts into one unit.
2. If unit_source is "authored", keep each unit short (aim for the 7-8 token average Nugget's own methodology reports) — a unit that reads like a full sentence with multiple clauses is too long.
3. If importance_tagging_toggle is true, be selective with "vital" — treat it as reserved for units whose omission a knowledgeable reader would actually flag as a problem, not as a default tag for everything that seems important.
```

- [ ] **Step 2: Write `atomic-unit-writing/SKILL.md`**

```markdown
---
name: atomic-unit-writing
description: Extract (ACU-style) or freshly author (Nugget-style) a list of atomic content units from a paper, optionally tagged vital/okay for importance. Use this as the first step whenever building a reference set of atomic facts for later recall-checking a summary or abstract against the paper — always precedes atomic-unit-matching.
execution: subagent
prompt: ./prompt.md
input: full_text (string), unit_source (string: "extracted" | "authored"), importance_tagging_toggle (boolean)
output: atomic_units (list of {text, importance})
dependencies:
  sops:
  - spawn-agent
---

# Atomic Unit Writing

Produces atomic content units — extracted (ACU) or freshly authored (Nugget), optionally importance-tagged. First step of the atomic-unit 3-chain.

## Execution

Subagent — spawned via spawn-agent skill.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 3: Write `atomic-unit-matching/prompt.md`**

```markdown
# Atomic Unit Matching — Subagent Prompt

For each atomic unit, judge whether the target text contains it.

## Input
- **atomic_units**: list of {text, [importance]} from atomic-unit-writing
- **target_text**: the text being checked for coverage of these units (e.g. a candidate summary, a different paper's abstract — whatever the caller is checking recall against)
- **judgment_value_domain**: "binary" (ACU: present | absent) | "ternary" (Nugget: support | partial_support | not_support)

## Output
- **match_results**: list of {unit_text, judgment} — judgment drawn from exactly the value set judgment_value_domain specifies

## Instructions
1. A unit counts as matched based on substance, not verbatim wording — target_text expressing the same fact in different words still counts.
2. If judgment_value_domain is "ternary", reserve "partial_support" for target_text that addresses part of the unit's claim but not all of it (e.g. the unit states a result and its magnitude; target_text mentions the result direction but not the magnitude) — do not use partial_support as a vague middle ground for uncertainty about your own judgment.
```

- [ ] **Step 4: Write `atomic-unit-matching/SKILL.md`**

```markdown
---
name: atomic-unit-matching
description: Judge, per atomic content unit, whether a target text (summary, abstract, or other candidate text) contains it — binary present/absent (ACU) or ternary support/partial_support/not_support (Nugget), per caller's value domain. Use this after atomic-unit-writing has produced the reference units, as the matching step before recall aggregation.
execution: subagent
prompt: ./prompt.md
input: atomic_units (list of {text, importance}), target_text (string), judgment_value_domain (string: "binary" | "ternary")
output: match_results (list of {unit_text, judgment})
dependencies:
  sops:
  - spawn-agent
---

# Atomic Unit Matching

Per-unit coverage judgment against a target text — binary (ACU) or ternary (Nugget) value domain. Middle step of the atomic-unit 3-chain.

## Execution

Subagent — spawned via spawn-agent skill.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 5: Write `atomic-unit-recall-aggregate/prompt.md`**

```markdown
# Atomic Unit Recall Aggregate — Subagent Prompt

Aggregate per-unit match judgments into a single recall score. Which
aggregation to run depends on which method's match_results you received —
infer this from judgment_value_domain's original shape (binary → ACU-style;
ternary → Nugget-style) or ask if genuinely ambiguous.

## Input
- **match_results**: list of {unit_text, judgment} from atomic-unit-matching
- **atomic_units**: the original units (needed for importance weights, if tagged, and for ACU's length-penalty calculation)

## ACU-style aggregation (binary judgments)
Compute normalized ACU recall: (count of "present" units) / (total units),
then apply a length penalty if target_text is disproportionately long
relative to what a summary of this length should need to cover this many
units (ACU's own method penalizes recall inflated by padding target_text
with excess unrelated content).

## Nugget-style aggregation (ternary judgments)
Compute both:
- **V_strict**: recall counting only "vital"-tagged units, "support" judgments only (partial_support does not count toward V_strict)
- **A_strict**: recall across ALL units (vital + okay), "support" judgments only
Then, if this aggregation is being run across multiple candidate texts (e.g. comparing several summarization systems), rank them by these scores — but note explicitly that Nugget's own reported reliability is run-level only (Kendall τ=0.887 across multiple runs), NOT per-topic (τ=0.297-0.539 — too noisy to trust for a single text's individual score). If only one target_text was scored, state the score but do not present it as if it were reliable evidence about a single specific text in isolation.

## Output
- ACU-style: **recall_score** (float, 0-1, length-penalty-adjusted)
- Nugget-style: **v_strict** (float), **a_strict** (float), **run_rank** (only if multiple candidates were compared; explicit caveat if only one was scored)

## Instructions
1. State which aggregation method you ran (ACU-style or Nugget-style) and why, based on the judgment_value_domain the match_results actually used.
2. For Nugget-style single-candidate scoring, explicitly flag the per-topic reliability caveat in your output rather than presenting the number without context — this is the single most important caveat this SOP exists to carry forward, since it's the exact gap the coverage audit (S5) found missing in the original graph.
```

- [ ] **Step 6: Write `atomic-unit-recall-aggregate/SKILL.md`**

```markdown
---
name: atomic-unit-recall-aggregate
description: Aggregate per-unit ACU/Nugget match judgments into a final recall score — normalized length-penalized recall for ACU, or V_strict/A_strict (+ run-level ranking, with an explicit per-topic-unreliability caveat) for Nugget. Use this as the final step of the atomic-unit chain, after atomic-unit-matching; this SOP's existence closes a gap the original pipeline design was missing — without it, per-unit match judgments were never actually summed into the score the source methodologies report.
execution: subagent
prompt: ./prompt.md
input: match_results (list of {unit_text, judgment}), atomic_units (list of {text, importance})
output: recall_score (float) OR {v_strict, a_strict, run_rank} depending on which method's judgments were received
dependencies:
  sops:
  - spawn-agent
---

# Atomic Unit Recall Aggregate

Final aggregation step of the atomic-unit chain — normalized recall (ACU) or V_strict/A_strict + run-level ranking (Nugget). Added specifically to fix coverage-audit finding S5: the original graph's atomic-unit chain was a dead end at matching, with no node computing the actual reported score.

## Execution

Subagent — spawned via spawn-agent skill.

## Nugget's Reliability Caveat Is Load-Bearing

Nugget-style per-topic scores are documented as unreliable (Kendall τ=0.297–0.539) — only run-level aggregation across multiple candidates is trustworthy (τ=0.887). This SOP must carry that caveat forward in its output whenever it runs Nugget-style aggregation on a single candidate; do not silence it for a cleaner-looking report.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 7: Validate all three**

```bash
cd "D:\YOGSOTH-AI\paper-reading"
for f in skills/atomic-unit-writing/SKILL.md skills/atomic-unit-matching/SKILL.md skills/atomic-unit-recall-aggregate/SKILL.md; do
  D:\anaconda3\python.exe scripts/validate_skill.py "$f"
done
```

Expected: `No errors found` printed 3 times.

- [ ] **Step 8: Commit**

```bash
cd "D:\YOGSOTH-AI\paper-reading"
git add skills/atomic-unit-writing/ skills/atomic-unit-matching/ skills/atomic-unit-recall-aggregate/
git commit -m "Add atomic-unit family SOPs (C1a/b/c chain, closes coverage-audit S5 gap)"
```

- [ ] **Step 9: skill-creator eval loop for this group**

Re-invoke `Skill({skill: "skill-creator"})` and run its eval process for these 3 SOPs before moving to Task 7.

---

## Task 7: SciFact family — `claim-writing`, `rationale-selection`, `claim-label-prediction`

**Files:**
- Create: `paper-reading/skills/claim-writing/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/rationale-selection/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/claim-label-prediction/SKILL.md`, `prompt.md`

**Interfaces:**
- `claim-writing` consumes: `citance` (string — a citing sentence that references the paper being read; this is caller-provided, not derived from `paper-fetch`'s own output — see the input-mismatch note below) ONLY. It deliberately does NOT take `full_text` as input — SciFact's blind-rewrite protocol requires the rewrite happen without looking at the cited paper's content at all, to avoid biasing the claim toward what the paper is already known to say. Produces: `atomic_claim` (string — a single, verifiable, blind-rewritten claim). Consumed by `rationale-selection`.
- `rationale-selection` consumes: `atomic_claim`, `full_text` (the candidate abstract/paper being checked against the claim). Produces: `rationale_sentences` (list of 1-3 sentence strings from full_text, verbatim). Consumed by `claim-label-prediction`.
- `claim-label-prediction` consumes: `atomic_claim`, `rationale_sentences`. Produces: `label` ("SUPPORTS" | "REFUTES" | "NOINFO"). Terminal — final output is `{claim: atomic_claim, abstract_source: full_text, label, rationale: rationale_sentences}`.

Before writing any file below, run `Skill({skill: "skill-creator"})`.

**Input-mismatch flag (surfaced, not silently resolved):** the graph's own `desc` for `claim-writing` states plainly: "⚠输入前提：需要「引用了该论文的另一篇论文」作为第二输入，本pkg作为单篇阅读SOP无此输入" — SciFact's claim-writing step fundamentally needs a citing sentence from a SECOND paper, which a single-paper-scoped package's `paper-fetch` never produces on its own. This SOP is buildable and testable (the caller can supply a `citance` string manually, e.g. for someone doing citation-verification work who already has one in hand), but it cannot be exercised end-to-end starting from just a `paper_ref` the way every other Task-4-9 SOP can. Document this explicitly in `claim-writing`'s SKILL.md so a future caller doesn't assume `paper-fetch` alone is sufficient input.

- [ ] **Step 1: Write `claim-writing/prompt.md`**

```markdown
# Claim Writing — Subagent Prompt

Blind-rewrite a citing sentence (citance) into a single atomic, independently
verifiable claim — "blind" means you do NOT look at the cited paper's own
abstract/content while rewriting, only at the citance itself. This mirrors
SciFact's own annotation protocol, which used blind rewriting specifically
to prevent the rewrite from being biased toward whatever the cited paper
actually says.

## Input
- **citance**: the citing sentence (from some OTHER paper) that references the paper under study — this is the second input SciFact's method structurally requires; it is not derivable from paper-fetch's own output for the paper being studied

## Rewrite rules
1. The claim must come from a single source only — do not merge two ideas from the citance into one claim if the citance itself made two separate points.
2. No subjective opinion language ("interestingly," "surprisingly") — state only the factual claim.
3. If the citance contains a compound claim, split it into multiple atomic claims and return each separately — do not force a compound statement into one claim.

## Output
- **atomic_claim**: the single (or, if split per rule 3, first of several) rewritten claim — phrased so it could be checked as true/false/no-info against a specific paper, independent of the citance's original wording or citation context.

## Instructions
1. Do this rewrite BEFORE reading the cited paper's content at all, if you have access to it — reading it first and then rewriting risks unconsciously steering the claim toward what you already know the paper says, defeating the blind-annotation protocol's purpose.
2. If the citance genuinely makes more than one atomic point, return a list of atomic_claim values, one per point — do not silently pick just one and drop the rest.
```

- [ ] **Step 2: Write `claim-writing/SKILL.md`**

```markdown
---
name: claim-writing
description: Blind-rewrite a citing sentence (citance) from another paper into a single atomic, independently-verifiable claim (SciFact's annotation protocol) — never looking at the cited paper's content while rewriting. Use this when you have a specific citing sentence and want it decomposed into checkable atomic claims, as the first step before rationale-selection and claim-label-prediction.
execution: subagent
prompt: ./prompt.md
input: citance (string — a sentence citing the paper under study, supplied by the caller)
output: atomic_claim (string, or list of strings if the citance was compound)
dependencies:
  sops:
  - spawn-agent
---

# Claim Writing

Blind rewrite of a citance into an atomic verifiable claim — first step of the SciFact 3-chain.

## Execution

Subagent — spawned via spawn-agent skill.

## Input Requirement This Package Cannot Auto-Supply

SciFact's own method requires a citance — a sentence FROM ANOTHER PAPER that cites the paper under study. `paper-fetch` only ever retrieves the text of the single paper being read; it has no mechanism to discover or supply a citance about that paper. Callers using this SOP must supply `citance` themselves (e.g. from a specific citation-verification task they already have in hand) — this SOP cannot be exercised end-to-end starting only from a `paper_ref`, unlike every other SOP in this package. Do not "fix" this by having paper-fetch search for citing sentences; that would break paper-fetch's decoupled, single-purpose design (spec §9).

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 3: Write `rationale-selection/prompt.md`**

```markdown
# Rationale Selection — Subagent Prompt

Select the minimal set of sentences (1-3) from the candidate abstract/paper
that, together, are sufficient to entail or refute the atomic claim.

## Input
- **atomic_claim**: the claim from claim-writing
- **full_text**: the candidate paper/abstract being checked against the claim

## Instructions
1. Select the SMALLEST set of sentences sufficient to judge the claim — do not select every sentence that's merely topically related; each selected sentence must be doing real evidentiary work.
2. Quote sentences verbatim from full_text — do not paraphrase.
3. If NO sentence set in full_text is sufficient to judge the claim either way, return an empty list — this is a valid outcome (it will lead to a NOINFO label downstream, not an error).

## Output
- **rationale_sentences**: list of 1-3 verbatim sentences from full_text (or empty list if none suffice)
```

- [ ] **Step 4: Write `rationale-selection/SKILL.md`**

```markdown
---
name: rationale-selection
description: Select the minimal set of 1-3 verbatim sentences from a candidate paper/abstract sufficient to entail or refute an atomic claim (SciFact's rationale-selection step). Use this after claim-writing has produced an atomic claim, as the evidence-gathering step before claim-label-prediction; an empty rationale set is a valid outcome, not an error.
execution: subagent
prompt: ./prompt.md
input: atomic_claim (string), full_text (string)
output: rationale_sentences (list of strings, 0-3 items)
dependencies:
  sops:
  - spawn-agent
---

# Rationale Selection

Selects minimal evidentiary sentence set for a claim — middle step of the SciFact 3-chain, added to close coverage-audit finding S7 (the original graph jumped straight from claim-writing to a three-way label judgment with no evidence-selection step, even though the tag table's own stated output anchor explicitly requires rationale sentences alongside the label).

## Execution

Subagent — spawned via spawn-agent skill.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 5: Write `claim-label-prediction/prompt.md`**

```markdown
# Claim Label Prediction — Subagent Prompt

Given an atomic claim and its selected rationale sentences, judge the
three-way label.

## Input
- **atomic_claim**: the claim being judged
- **rationale_sentences**: the selected evidence sentences (may be empty)

## Output
- **label**: "SUPPORTS" (rationale_sentences entail the claim) | "REFUTES" (rationale_sentences contradict the claim) | "NOINFO" (rationale_sentences is empty, or non-empty but genuinely insufficient to decide either way)

## Instructions
1. Base your label ONLY on rationale_sentences, not on any other knowledge of the topic you might have — the label must be traceable to the specific sentences selected, not to general background knowledge.
2. An empty rationale_sentences list always yields NOINFO — do not attempt to infer a label from the claim's plausibility alone.
```

- [ ] **Step 6: Write `claim-label-prediction/SKILL.md`**

```markdown
---
name: claim-label-prediction
description: Judge a three-way SUPPORTS/REFUTES/NOINFO label for an atomic claim, based only on its selected rationale sentences (SciFact's final classification step). Use this after rationale-selection has produced the evidence sentences — this is the terminal step of the SciFact chain, producing the complete (claim, abstract, label, rationale) tuple.
execution: subagent
prompt: ./prompt.md
input: atomic_claim (string), rationale_sentences (list of strings)
output: label (string: "SUPPORTS" | "REFUTES" | "NOINFO")
dependencies:
  sops:
  - spawn-agent
---

# Claim Label Prediction

Three-way SUPPORTS/REFUTES/NOINFO label, grounded only in the selected rationale sentences — terminal step of the SciFact 3-chain.

## Execution

Subagent — spawned via spawn-agent skill.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 7: Validate all three**

```bash
cd "D:\YOGSOTH-AI\paper-reading"
for f in skills/claim-writing/SKILL.md skills/rationale-selection/SKILL.md skills/claim-label-prediction/SKILL.md; do
  D:\anaconda3\python.exe scripts/validate_skill.py "$f"
done
```

Expected: `No errors found` printed 3 times.

- [ ] **Step 8: Commit**

```bash
cd "D:\YOGSOTH-AI\paper-reading"
git add skills/claim-writing/ skills/rationale-selection/ skills/claim-label-prediction/
git commit -m "Add SciFact family SOPs (C2a/b/c chain, closes coverage-audit S7 gap)"
```

- [ ] **Step 9: skill-creator eval loop for this group**

Re-invoke `Skill({skill: "skill-creator"})` and run its eval process for these 3 SOPs before moving to Task 8. Note for this group specifically: since `claim-writing` cannot be exercised starting only from a bare `paper_ref` (see the input-mismatch flag above), its test prompts must supply a `citance` explicitly rather than following the same "give it a paper reference" pattern every other group's test prompts use.

---

## Task 8: Gate + bias-risk family — `study-design-tool-gate`, `signalling-question-answering`, `domain-level-judgment`, `star-awarding`, `worst-case-lookup`, `sum-threshold-scoring`

**Files:**
- Create: `paper-reading/skills/study-design-tool-gate/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/study-design-tool-gate/references/tool-dispatch-table.md`
- Create: `paper-reading/skills/signalling-question-answering/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/domain-level-judgment/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/star-awarding/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/worst-case-lookup/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/sum-threshold-scoring/SKILL.md`, `prompt.md`

**Interfaces:**
- `study-design-tool-gate` consumes: `full_text` from `paper-fetch`. Produces: `study_design` (string — e.g. "RCT", "cohort", "case-control", "diagnostic-accuracy", "systematic-review", "animal-study", "prediction-model", or `"not_applicable"`), `dispatched_tool` (string — which downstream SOP + which specific variant, e.g. "quality-appraisal-checklist / CASP-RCT", or `"none"` if `study_design` is `not_applicable`). Consumed by whichever of `signalling-question-answering`/`star-awarding`/`quality-appraisal-checklist`/`reporting-standard-checklist`/`engineering-config-grading` matches `dispatched_tool`.
- `signalling-question-answering` consumes: `full_text`; `dispatched_tool` (to know which of RoB2/ROBINS-I/QUADAS-2's domain/question set to use). Produces: `signalling_answers` (list of {domain, question, answer}, answer ∈ 5-value domain: Yes/Probably yes/Probably no/No/No information). Consumed by `domain-level-judgment`.
- `domain-level-judgment` consumes: `signalling_answers`. Produces: `domain_judgments` (list of {domain, judgment} — and, for QUADAS-2 only, TWO judgments per domain D1-D3: {domain, risk_of_bias_judgment, applicability_concern_judgment}, with D4 carrying risk_of_bias_judgment only). Consumed by `worst-case-lookup` for RoB2/ROBINS-I; terminal for QUADAS-2 (no further aggregation step exists for it — see the graph's own comment on this).
- `star-awarding` consumes: `full_text`. Produces: `star_results` (list of {item, stars_awarded} — NOS's own item set: up to 4 stars for Selection, 2 for Comparability, 3 for Outcome/Exposure). Consumed by `sum-threshold-scoring`.
- `worst-case-lookup` consumes: `domain_judgments` (from `domain-level-judgment`, RoB2/ROBINS-I only) OR `checklist_result` (from `quality-appraisal-checklist`, AMSTAR-2 only — this SOP has two distinct upstream callers, not one). Produces: `overall_judgment` (string — the most severe value found, per the caller's own value domain: RoB2's 3-value Low/Some-concerns/High, ROBINS-I's 5-value Low/Moderate/Serious/Critical/No-info, or AMSTAR-2's pre-filter-by-critical-domain result). Terminal.
- `sum-threshold-scoring` consumes: `star_results`. Produces: `nos_grade` (string — "good" (≥7 stars) | "fair" (4-6) | "poor" (0-3)). Terminal.

Before writing any file below, run `Skill({skill: "skill-creator"})`.

**On why this is 6 files, not fewer:** the coverage audit (S3, S4, M10) specifically found the ORIGINAL single-node version of this family flattened two distinct algorithmic levels (signalling-question answering, then a domain-level roll-up) into one step, and merged 3 separate worst-case-taking algorithms that happened to look similar (RoB2/ROBINS-I/AMSTAR-2) without noticing they operate on different inputs from different upstream SOPs. This task deliberately keeps all 6 as separate files per the repaired graph, rather than re-collapsing them for convenience.

- [ ] **Step 1: Write `study-design-tool-gate/references/tool-dispatch-table.md`**

```markdown
# Study Design → Tool Dispatch Table

Full dispatch table for `study-design-tool-gate`. Read this file before
making a dispatch decision — do not guess the mapping from memory.

| study_design | dispatched_tool | Notes |
|---|---|---|
| RCT (parallel-group) | `signalling-question-answering` / RoB2 (parallel RCT version) | RoB2 has separate versions for parallel, cluster, and crossover trials — pick the matching one, they have different domain sets |
| RCT (cluster) | `signalling-question-answering` / RoB2 (cluster version) | |
| RCT (crossover) | `signalling-question-answering` / RoB2 (crossover version) | |
| Non-randomized intervention study (cohort-like, with an intervention) | `signalling-question-answering` / ROBINS-I | |
| Diagnostic accuracy study | `signalling-question-answering` / QUADAS-2 | Terminates at domain-level-judgment — no worst-case-lookup step for this one |
| Cohort study | `quality-appraisal-checklist` / CASP-Cohort, or `star-awarding` / NOS-Cohort | CASP and NOS both have cohort-study variants; if caller doesn't specify a preference, prefer NOS if the goal is a single summary score, CASP if the goal is item-level narrative appraisal |
| Case-control study | `quality-appraisal-checklist` / CASP-Case-Control, or `star-awarding` / NOS-Case-Control | Same CASP-vs-NOS choice as cohort |
| Qualitative research | `quality-appraisal-checklist` / CASP-Qualitative | |
| Systematic review | `quality-appraisal-checklist` / AMSTAR-2, or `reporting-standard-checklist` / PRISMA | AMSTAR-2 judges the review's own methodological quality; PRISMA checks whether the review report is complete — these are different questions, both valid for the same paper |
| Diagnostic test accuracy review | `quality-appraisal-checklist` / JBI (diagnostic-test-accuracy variant) | |
| Prevalence study | `quality-appraisal-checklist` / JBI (prevalence variant) | |
| Case report / case series | `quality-appraisal-checklist` / JBI (case-report or case-series variant) | Two distinct JBI variants — case report is n=1, case series is n>1 |
| Economic evaluation | `quality-appraisal-checklist` / JBI (economic-evaluation variant) | |
| RCT report completeness (as opposed to bias risk) | `reporting-standard-checklist` / CONSORT | |
| Observational-study report completeness | `reporting-standard-checklist` / STROBE | |
| Animal research report completeness | `reporting-standard-checklist` / ARRIVE | |
| Clinical trial protocol completeness | `reporting-standard-checklist` / SPIRIT | |
| Prediction-model study report completeness | `reporting-standard-checklist` / TRIPOD | |
| ML/CS engineering paper — reproducibility config grading | `engineering-config-grading` / (no variant — single item set) | Proposal SOP; note this is NOT gated the same way as dual-column-self-check, which has no gate at all — engineering-config-grading DOES route through this gate because it's evaluative (quality judgment), matching the gate's own evaluative-tool purpose, whereas dual-column-self-check is a report-completeness self-audit that was never drawn as gate-dispatched in the graph |
| Anything not matching any row above | `not_applicable` / `none` | This is a legitimate, complete output — say so explicitly rather than forcing a poor-fit dispatch. E.g. most CS/ML papers with no human/animal study component genuinely have `not_applicable` here for the bias-risk tools, even though other SOPs in this package (unit-classification, multi-stage-cascade-extraction, etc.) may still apply to the same paper. |
```

- [ ] **Step 2: Write `study-design-tool-gate/prompt.md`**

```markdown
# Study Design Tool Gate — Subagent Prompt

Determine what kind of study this paper reports (if any), and which
downstream evaluation/appraisal tool (and specific variant) is the right
fit — or determine that none of these medically-descended tools applies at
all, which is a common and entirely valid outcome for CS/ML papers.

## Input
- **full_text**: the paper's full text

## Reference

Read `references/tool-dispatch-table.md` before making your dispatch
decision — it lists every study_design value this gate recognizes and
exactly which tool+variant each maps to. Do not guess the mapping.

## Output
- **study_design**: your classification (one of the table's left-column values, or "not_applicable")
- **dispatched_tool**: the exact tool+variant from the table's matching row (or "none" if not_applicable)
- **applicability_reasoning**: one to two sentences on why this study_design fits (or why none did) — this is the gate's actual value-add over a keyword match, so don't skip it

## Instructions
1. Most of these tools have a medical/clinical lineage — most of their specific domains (allocation concealment, blinding, intention-to-treat analysis) genuinely have nothing to check in a typical CS/ML paper. Recognizing "not_applicable" for such a paper is this gate doing its job correctly, not a failure to find a match — do not force-fit a paper into RCT or cohort-study just because SOME tool must apply.
2. If a paper's study_design could plausibly map to more than one row (e.g. it's both a systematic review AND reports its own quality), name the primary dispatch but mention the secondary option in applicability_reasoning — the caller may want to run both.
```

- [ ] **Step 3: Write `study-design-tool-gate/SKILL.md`**

```markdown
---
name: study-design-tool-gate
description: Classify a paper's study design (RCT, cohort, case-control, diagnostic-accuracy, systematic-review, animal-study, prediction-model, etc., or not_applicable) and dispatch to the correct downstream bias-risk/quality/reporting tool and specific variant (CASP has 8 variants, JBI ~6, RoB2 has parallel/cluster/crossover versions). Use this as the mandatory first step before running ANY of CASP, JBI, AMSTAR-2, NOS, RoB2, ROBINS-I, QUADAS-2, CONSORT, STROBE, ARRIVE, SPIRIT, TRIPOD, or engineering-config-grading — these tools are all study-design-conditional and picking the wrong variant produces meaningless results. It is entirely correct and common for this gate to determine that none of these medically-descended tools applies (e.g. most CS/ML papers) — that is a valid, complete answer, not a failure.
execution: subagent
prompt: ./prompt.md
input: full_text (string)
output: study_design (string), dispatched_tool (string), applicability_reasoning (string)
dependencies:
  sops:
  - spawn-agent
---

# Study Design Tool Gate

Classifies study design and dispatches to the right bias-risk/quality/reporting tool + variant — or determines none applies. Added per coverage-audit M11: the original graph had no node representing this dispatch decision at all; every A1/A2 tool was drawn as if it started with no gate.

## Execution

Subagent — spawned via spawn-agent skill.

## Reference

`references/tool-dispatch-table.md` — the full dispatch table (every study_design → tool + variant mapping). Read before drafting the prompt's decision, not summarized inline here (kept out of this SKILL.md body per Progressive Disclosure).

## "not_applicable" Is a Correct, Common Answer

This is worth restating: most of these tools carry medical/clinical assumptions baked into their domains, and forcing a dispatch onto a paper that has no matching study design produces a meaningless result, not a conservative one. Do not treat a high not_applicable rate across a batch of CS/ML papers as a sign this SOP is failing to trigger correctly.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 4: Write `signalling-question-answering/prompt.md`**

```markdown
# Signalling Question Answering — Subagent Prompt

Answer each domain's signalling questions for the specific tool variant
study-design-tool-gate dispatched to (RoB2, ROBINS-I, or QUADAS-2 — the
question sets differ per tool and, for RoB2, per trial-design version).

## Input
- **full_text**: the paper's full text
- **dispatched_tool**: which specific tool+variant to run (from study-design-tool-gate)

## Output
- **signalling_answers**: list of {domain, question, answer} — one entry per signalling question in the dispatched tool's own question set, `answer` drawn from exactly this 5-value domain: "Yes" | "Probably yes" | "Probably no" | "No" | "No information"

## Instructions
1. Answer every signalling question in the dispatched tool's own set — do not skip questions that seem redundant or already answered by an earlier question; each is scored independently downstream.
2. "No information" is a legitimate answer when the paper genuinely doesn't report what's needed to answer a question — do not guess an answer to avoid this category.
3. This SOP does NOT itself compute a domain-level or overall judgment — that's domain-level-judgment's job (and, past that, worst-case-lookup's). Stop at raw signalling answers.
```

- [ ] **Step 5: Write `signalling-question-answering/SKILL.md`**

```markdown
---
name: signalling-question-answering
description: Answer per-domain signalling questions (5-value scale: Yes/Probably yes/Probably no/No/No information) for RoB2, ROBINS-I, or QUADAS-2, per whichever variant study-design-tool-gate dispatched to. Use this after study-design-tool-gate has dispatched to one of these three tools; this SOP produces only the raw signalling answers, not any domain-level or overall roll-up — that happens in domain-level-judgment next.
execution: subagent
prompt: ./prompt.md
input: full_text (string), dispatched_tool (string)
output: signalling_answers (list of {domain, question, answer})
dependencies:
  sops:
  - spawn-agent
---

# Signalling Question Answering

Raw per-domain 5-value signalling answers for RoB2/ROBINS-I/QUADAS-2. First of two algorithmic levels these tools require — see domain-level-judgment for the second.

## Execution

Subagent — spawned via spawn-agent skill.

## Scope Note (per coverage-audit M8)

NOS's star-awarding and AMSTAR-2's checklist items are NOT this SOP's concern — an earlier graph draft conflated "answer a domain question" with "award a star" and "check a checklist item," but these are three structurally different actions (5-value signalling judgment vs. binary star-or-not vs. checklist Yes/No/Partial). Keep this SOP scoped to exactly RoB2/ROBINS-I/QUADAS-2's signalling questions.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 6: Write `domain-level-judgment/prompt.md`**

```markdown
# Domain Level Judgment — Subagent Prompt

Fold the raw signalling answers into a domain-level judgment, using the
dispatched tool's own algorithmic lookup rules — this is the FIRST of two
aggregation levels these tools define (the second, only for RoB2/ROBINS-I,
is worst-case-lookup).

## Input
- **signalling_answers**: from signalling-question-answering
- **dispatched_tool**: which tool's lookup rules to apply

## Output

For RoB2/ROBINS-I:
- **domain_judgments**: list of {domain, judgment} — one per domain, judgment value per the dispatched tool's own scale

For QUADAS-2 specifically (dual-axis — this tool evaluates TWO things per domain, not one):
- **domain_judgments**: list of {domain, risk_of_bias_judgment, [applicability_concern_judgment — present for domains D1-D3 only, D4 has no applicability axis]} — 7 total judgments across 4 domains (D1-D3 contribute 2 each, D4 contributes 1)

## Instructions
1. Apply the dispatched tool's own published lookup table exactly — this is a deterministic-per-tool mapping from signalling answers to a domain judgment, not a fresh judgment call you're making from scratch.
2. For QUADAS-2, do not skip the applicability_concern_judgment axis for D1-D3 — the tool is explicitly dual-axis for those domains, and dropping one axis silently loses half the tool's actual output.
3. QUADAS-2 has no further aggregation step past this — domain-level judgment IS its terminal output, do not attempt to roll it up further into a single overall verdict, since the tool itself defines no such rollup.
```

- [ ] **Step 7: Write `domain-level-judgment/SKILL.md`**

```markdown
---
name: domain-level-judgment
description: Fold raw signalling-question answers into domain-level judgments for RoB2, ROBINS-I, or QUADAS-2, per each tool's own lookup rules — the first of two aggregation levels these tools define. QUADAS-2 is dual-axis (risk-of-bias AND applicability-concern per domain, D1-D3) and terminates here with no further rollup; RoB2/ROBINS-I continue on to worst-case-lookup for an overall verdict. Use this after signalling-question-answering has produced the raw answers.
execution: subagent
prompt: ./prompt.md
input: signalling_answers (list of {domain, question, answer}), dispatched_tool (string)
output: domain_judgments (list of {domain, judgment} or, for QUADAS-2, {domain, risk_of_bias_judgment, applicability_concern_judgment})
dependencies:
  sops:
  - spawn-agent
---

# Domain Level Judgment

Signalling answers → domain-level judgments via each tool's own lookup rules. QUADAS-2's dual-axis output (risk-of-bias + applicability-concern per domain) terminates here — no further rollup exists for it. RoB2/ROBINS-I continue to worst-case-lookup.

## Execution

Subagent — spawned via spawn-agent skill.

## Why This SOP Exists (coverage-audit S4)

The original graph connected signalling-question-answering directly to an overall-judgment node, with no place for the first-level domain rollup RoB2/ROBINS-I/QUADAS-2 all define algorithmically before any overall verdict — and no place at all for QUADAS-2's terminal dual-axis output, since QUADAS-2 never reaches a "worst case across domains" step the way RoB2/ROBINS-I do.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 8: Write `star-awarding/prompt.md`**

```markdown
# Star Awarding — Subagent Prompt

Award stars per NOS's own item set: this is a "give a star, yes/no" action
per item, not a 5-value signalling judgment.

## Input
- **full_text**: the paper's full text

## NOS item set (cohort-study version; case-control version has an analogous but distinct item list — confirm which via dispatched_tool if the caller specifies)
- Selection (up to 4 stars): representativeness of exposed cohort, selection of non-exposed cohort, ascertainment of exposure, demonstration outcome not present at start
- Comparability (up to 2 stars): comparability of cohorts on the basis of design or analysis
- Outcome (up to 3 stars): assessment of outcome, was follow-up long enough, adequacy of follow-up

## Output
- **star_results**: list of {item, stars_awarded} — stars_awarded is 0 or 1 for each Selection/Outcome sub-item (max achievable per item shown above), 0 or 1 per Comparability sub-item

## Instructions
1. This is a binary award-or-not decision per item, not a graded score — do not award partial stars.
2. Be specific about which sub-item within Selection/Outcome you're scoring — these categories bundle multiple distinct sub-items, each independently star-eligible.
```

- [ ] **Step 9: Write `star-awarding/SKILL.md`**

```markdown
---
name: star-awarding
description: Award NOS's (Newcastle-Ottawa Scale) stars item-by-item across Selection (up to 4), Comparability (up to 2), and Outcome/Exposure (up to 3) — a binary award-or-not action per item, distinct from a 5-value signalling judgment. Use this after study-design-tool-gate has dispatched to NOS, as the first step before sum-threshold-scoring.
execution: subagent
prompt: ./prompt.md
input: full_text (string)
output: star_results (list of {item, stars_awarded})
dependencies:
  sops:
  - spawn-agent
---

# Star Awarding

NOS's item-by-item star awarding — binary per item, not a signalling-question judgment. Added per coverage-audit M8: the original graph had NOS's stars appearing already-summed at an aggregation node, with no node actually doing the item-level awarding those sums depend on.

## Execution

Subagent — spawned via spawn-agent skill.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 10: Write `worst-case-lookup/prompt.md`**

```markdown
# Worst Case Lookup — Subagent Prompt

Take the single most severe judgment across all domains/items as the
overall verdict — this SOP has TWO distinct possible upstream callers with
different value domains; identify which one you received before applying
the lookup.

## Input — EXACTLY ONE of:
- **domain_judgments** (from domain-level-judgment, RoB2 or ROBINS-I only — QUADAS-2 never reaches this SOP, it terminates at domain-level-judgment) — RoB2: 3-value scale (Low / Some concerns / High); ROBINS-I: 5-value scale (Low / Moderate / Serious / Critical / No information)
- **checklist_result** (from quality-appraisal-checklist, AMSTAR-2 only)

## Instructions
1. If given domain_judgments from RoB2: overall_judgment = the single most severe value present across all domains (High > Some concerns > Low).
2. If given domain_judgments from ROBINS-I: same worst-case logic, on its own 5-value scale (Critical > Serious > Moderate > Low > No information, with No information treated as its own non-comparable category per ROBINS-I's own guidance — do not silently rank it as better or worse than Low).
3. If given checklist_result from AMSTAR-2: FIRST filter to just the items AMSTAR-2 designates "critical domains," THEN if ANY critical domain failed, the result is "Critically Low" regardless of how well non-critical items scored — this pre-filter-by-weight step is what distinguishes AMSTAR-2's aggregation from a simple worst-case scan across ALL items equally.

## Output
- **overall_judgment**: the resulting worst-case value, on whichever scale matches the input received
- **which_algorithm**: state explicitly which of the 3 branches above you used, so the caller can verify you applied the right one for their input
```

- [ ] **Step 11: Write `worst-case-lookup/SKILL.md`**

```markdown
---
name: worst-case-lookup
description: Take the single most severe domain/item judgment as the overall verdict, for RoB2 (3-value), ROBINS-I (5-value), or AMSTAR-2 (pre-filtered by critical-domain status before worst-case). Use this after domain-level-judgment (for RoB2/ROBINS-I) or quality-appraisal-checklist (for AMSTAR-2) has produced per-domain/item judgments — this SOP has two structurally distinct upstream callers and must identify which value domain it received before applying the matching lookup rule. QUADAS-2 never reaches this SOP; it terminates one step earlier at domain-level-judgment.
execution: subagent
prompt: ./prompt.md
input: domain_judgments (list of {domain, judgment}, from RoB2/ROBINS-I) OR checklist_result (from AMSTAR-2) — exactly one of the two
output: overall_judgment (string), which_algorithm (string)
dependencies:
  sops:
  - spawn-agent
---

# Worst Case Lookup

Overall verdict = most severe domain/item value, on the caller's own scale. Merges what were originally 3 separate SOPs (RoB2-aggregate, ROBINS-I-aggregate, AMSTAR-2-aggregate) per coverage-audit M10's finding that they share one algorithm (worst-case-taking) differing only in value domain and, for AMSTAR-2, an extra pre-filter step — the same parameterization principle already used for unit-classification's label_set parameter, applied consistently here.

## Execution

Subagent — spawned via spawn-agent skill.

## Two Distinct Callers — Do Not Assume Which

Unlike most SOPs in this package, this one is called from two different places in the graph with two different input shapes (`domain_judgments` vs `checklist_result`). The prompt's Step 1 instruction to identify which was received before proceeding is load-bearing — applying RoB2's worst-case rule to AMSTAR-2's input (or vice versa) silently produces a wrong answer, not an error.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 12: Write `sum-threshold-scoring/prompt.md`**

```markdown
# Sum Threshold Scoring — Subagent Prompt

Sum NOS's awarded stars and bucket into a grade.

## Input
- **star_results**: from star-awarding

## Output
- **total_stars**: sum of all stars_awarded values (0-9)
- **nos_grade**: "good" (total_stars >= 7) | "fair" (4 <= total_stars <= 6) | "poor" (total_stars <= 3)

## Instructions
1. This is a fixed threshold lookup, not a judgment call — apply the >=7/4-6/<=3 bucketing exactly.
2. Show the total_stars value alongside nos_grade — the grade alone loses information a caller may want (e.g. a study scoring exactly 7 is "good" but by the narrowest margin, which matters for interpretation).
```

- [ ] **Step 13: Write `sum-threshold-scoring/SKILL.md`**

```markdown
---
name: sum-threshold-scoring
description: Sum NOS's item-level stars and bucket into good (≥7)/fair (4-6)/poor (≤3) — a fixed threshold lookup, structurally distinct from worst-case-lookup's take-the-worst-value approach. Use this after star-awarding has produced the per-item stars; this is NOS's terminal step.
execution: subagent
prompt: ./prompt.md
input: star_results (list of {item, stars_awarded})
output: total_stars (integer), nos_grade (string: "good" | "fair" | "poor")
dependencies:
  sops:
  - spawn-agent
---

# Sum Threshold Scoring

Sum-then-bucket, NOS's own aggregation shape — deliberately kept separate from worst-case-lookup since NOS sums rather than takes a worst-case value (structurally different aggregation, not a value-domain variant of the same algorithm).

## Execution

Subagent — spawned via spawn-agent skill.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 14: Validate all six**

```bash
cd "D:\YOGSOTH-AI\paper-reading"
for f in skills/study-design-tool-gate/SKILL.md skills/signalling-question-answering/SKILL.md skills/domain-level-judgment/SKILL.md skills/star-awarding/SKILL.md skills/worst-case-lookup/SKILL.md skills/sum-threshold-scoring/SKILL.md; do
  D:\anaconda3\python.exe scripts/validate_skill.py "$f"
done
```

Expected: `No errors found` printed 6 times.

- [ ] **Step 15: Commit**

```bash
cd "D:\YOGSOTH-AI\paper-reading"
git add skills/study-design-tool-gate/ skills/signalling-question-answering/ skills/domain-level-judgment/ skills/star-awarding/ skills/worst-case-lookup/ skills/sum-threshold-scoring/
git commit -m "Add gate + bias-risk family SOPs (G, A1/A1b/A1c, D1/D2 — closes coverage-audit S3/S4/M8/M10/M11)"
```

- [ ] **Step 16: skill-creator eval loop for this group**

Re-invoke `Skill({skill: "skill-creator"})` and run its eval process for these 6 SOPs before moving to Task 9.

---

## Task 9: Checklist family — `quality-appraisal-checklist`, `reporting-standard-checklist`, `engineering-config-grading`, `reproducibility-third-party-verification`

**Files:**
- Create: `paper-reading/skills/quality-appraisal-checklist/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/quality-appraisal-checklist/references/item-sets.md`
- Create: `paper-reading/skills/reporting-standard-checklist/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/reporting-standard-checklist/references/item-sets.md`
- Create: `paper-reading/skills/engineering-config-grading/SKILL.md`, `prompt.md`
- Create: `paper-reading/skills/reproducibility-third-party-verification/SKILL.md`, `prompt.md`

**Interfaces:**
- `quality-appraisal-checklist` consumes EITHER: (a) `full_text` + `dispatched_tool` from `study-design-tool-gate` (CASP/JBI/AMSTAR-2 mode), OR (b) `classified_units` from `unit-classification` + `entry_mode: "completeness_check"` (the folded `rhetorical-completeness-check` proposal mode — see the correction note in this plan's header). Produces: `checklist_result` (list of {item, judgment: "Yes"|"No"|"Can't tell" or "Yes"|"No"|"Partial Yes"|"Unclear"|"NA", depending on item_set}, plus, when in mode (a), an `overall_appraisal` string since CASP/JBI/AMSTAR-2 all require an integrated verdict, not just item-level answers). Consumed by `worst-case-lookup` (AMSTAR-2 path only).
- `reporting-standard-checklist` consumes: `full_text`, `dispatched_tool`. Produces: `checklist_result` (list of {item, sub_item (a/b, where applicable), judgment: "Yes"|"No"|"NA", location} — `location` is the page/section citation, since these are report-completeness checks and "where it's reported" is itself part of the required output). Terminal.
- `engineering-config-grading` consumes: `full_text`, `dispatched_tool` (from `study-design-tool-gate`). Produces: `grading_result` (list of {item, grade: "complete"|"partial"|"none", justification}). Terminal. Proposal SOP (unverified).
- `reproducibility-third-party-verification` consumes: `classified_units` (from `unit-classification` — needs the paper's own structured claims/config already extracted before attempting to verify them; see the dependency note below). Produces: `verification_result` (list of {claim, reproducible: bool | "not_attempted", notes}). Terminal. Proposal SOP (unverified).

Before writing any file below, run `Skill({skill: "skill-creator"})`.

**On the `rhetorical-completeness-check` fold (see this plan's header correction #1):** rather than a 5th file, `quality-appraisal-checklist`'s `prompt.md` gets a second `entry_mode` branch. This mode's actual behavior per the graph's edge comment: it computes a set-difference between the rhetorical labels `unit-classification` found in the paper and the label set a target checklist expects, surfacing which required argumentative moves are simply absent from the paper's structure — this is a partial, rule-based check (not a full evaluative judgment) that feeds into `quality-appraisal-checklist` rather than into `reporting-standard-checklist`, because per the graph correction M13, it performs a genuine judgment-adjacent operation (label-set differencing against an expected structure) rather than pure "does it report X, yes/no" — closer kin to A2a's evaluative stance than A2b's positional reporting-check stance.

**On `reproducibility-third-party-verification`'s dependency (per this plan's header correction #2 and the graph's L20 note):** this SOP needs the paper's reported configuration/hyperparameters already pulled out in structured form before it can attempt to verify them — hence it depends on `unit-classification`'s output, not on raw `full_text` directly. This SOP's action type (execute code / run scripts) is unlike every other SOP in this package; scope its prompt narrowly to avoid it silently expanding into arbitrary code execution beyond what the paper's own reported config specifies.

- [ ] **Step 1: Write `quality-appraisal-checklist/references/item-sets.md`**

```markdown
# Quality Appraisal Item Sets

Read the relevant section before drafting an appraisal — do not answer from
memory of "roughly what CASP/JBI covers."

## CASP (8 variants, one per study type: RCT, cohort, case-control,
diagnostic, qualitative, systematic-review, economic-evaluation,
clinical-prediction-rule)

Three-section structure, ALL variants share this shape:
- **Section A — screening questions**: gate questions that, if failed, mean stop (the study has a fatal flaw for this appraisal's purpose)
- **Section B — methodological quality**: the bulk of the checklist, study-type-specific items
- **Section C — local applicability**: is this study's result usable in the appraiser's own context

Each section requires its own integrated judgment at the end — CASP does not just tally item answers, it asks the appraiser to synthesize.

## JBI (~6 variants: RCT, cohort, case-control, cross-sectional/prevalence,
case-report, case-series, diagnostic-test-accuracy, economic-evaluation —
count varies by which JBI checklist family version is in use)

Each variant is a flat item list (typically 8-13 items, Yes/No/Unclear/NA
per item), ending in an INCLUDE/EXCLUDE/SEEK-FURTHER-INFO overall
recommendation — this final recommendation is not a simple majority-vote of
item answers, it's the appraiser's own synthesis.

## AMSTAR-2 (systematic-review quality, single variant)

16 items, Yes/Partial-Yes/No per item. 7 of the 16 are "critical domains"
(protocol registration, adequacy of literature search, justification for
excluding studies, risk-of-bias assessment of included studies,
appropriateness of meta-analytic methods, consideration of risk-of-bias in
interpreting results, assessment of publication bias) — see
`worst-case-lookup`'s prompt for how these get pre-filtered before the
overall confidence rating.

## rhetorical-completeness-check mode (proposal, entry_mode only — not a
separate item set of its own)

When entry_mode is "completeness_check": instead of the above item sets,
compute the set difference between the rhetorical labels unit-classification
found in the paper's units, and the label set a caller-specified target
checklist expects to see represented (e.g. "does this paper have units
labeled BACKGROUND, AIM, and RESULT, or is one of those moves simply
missing from its argumentative structure?"). Output uses the same
checklist_result shape as the other modes, with judgment values limited to
"Yes" (label present) / "No" (label absent from the paper's structure).
```

- [ ] **Step 2: Write `quality-appraisal-checklist/prompt.md`**

```markdown
# Quality Appraisal Checklist — Subagent Prompt

Run a study-type-specific quality-appraisal checklist (CASP, JBI, or
AMSTAR-2), OR run the proposal rhetorical-completeness-check mode against
already-classified rhetorical labels — check `entry_mode` first to know
which.

## Input

### Mode (a): item-set checklist (entry_mode = "checklist", the default if unspecified)
- **full_text**: the paper's full text
- **dispatched_tool**: which specific checklist+variant (from study-design-tool-gate)

### Mode (b): completeness check (entry_mode = "completeness_check", proposal)
- **classified_units**: output from unit-classification
- **target_checklist_labels**: the label set a caller-specified target checklist expects to see represented

## Reference

Read `references/item-sets.md` before drafting — do not answer from memory
of roughly what these checklists cover; the exact item lists and,
critically, each checklist's OWN synthesis step (CASP's 3-section
integration, JBI's include/exclude/seek-further-info, AMSTAR-2's
critical-domain-aware confidence rating) matter.

## Output

Mode (a):
- **checklist_result**: list of {item, judgment} per the dispatched checklist's own value domain
- **overall_appraisal**: the checklist's own required synthesis judgment (not a simple tally — see reference file)

Mode (b):
- **checklist_result**: list of {item: <label name>, judgment: "Yes" | "No"} — "No" meaning that rhetorical move is absent from the paper's classified units

## Instructions
1. If in Mode (a), always produce `overall_appraisal` — these three tools all define their own integration step distinct from item-by-item scoring; stopping at just the item list is an incomplete answer for any of them.
2. If in Mode (b), this is a partial/rule-based check (a set difference), not a full evaluative judgment — do not synthesize an overall_appraisal for this mode, it doesn't apply.
```

- [ ] **Step 3: Write `quality-appraisal-checklist/SKILL.md`**

```markdown
---
name: quality-appraisal-checklist
description: Run CASP (8 study-type variants), JBI (~6 variants), or AMSTAR-2 quality-appraisal checklists — each ending in the tool's own required integrated judgment, not just item tallies. Also runs a proposal "rhetorical-completeness-check" mode (entry_mode="completeness_check") that instead diffs unit-classification's rhetorical labels against a target checklist's expected label set. Use this after study-design-tool-gate has dispatched to CASP/JBI/AMSTAR-2 (mode a), or directly after unit-classification when checking for missing argumentative moves (mode b, proposal/unverified).
execution: subagent
prompt: ./prompt.md
input: (mode a) full_text (string), dispatched_tool (string) — OR (mode b) classified_units (list), target_checklist_labels (list of strings), entry_mode ("checklist" | "completeness_check")
output: checklist_result (list of {item, judgment}), overall_appraisal (string, mode a only)
dependencies:
  sops:
  - spawn-agent
---

# Quality Appraisal Checklist

CASP/JBI/AMSTAR-2 item-level appraisal + each tool's own required overall synthesis. Also hosts the proposal rhetorical-completeness-check as a second entry mode (see below) rather than as its own SOP file.

## Execution

Subagent — spawned via spawn-agent skill.

## Reference

`references/item-sets.md` — full item lists per tool/variant, read before drafting; kept out of this SKILL.md body per Progressive Disclosure (CASP alone has 8 variants).

## Why rhetorical-completeness-check Is a Mode Here, Not Its Own File

This plan's header documents a correction found while planning: the pipeline graph (`context/2026-08-07-13-42-sop-pipeline-graph.html`) never defines `rhetorical-completeness-check` as a node in its `nodes` array — it only appears as a method label on the edge `unit-classification → quality-appraisal-checklist`, with the edge's own inline comment ("M13修订") describing it as an entry mode into THIS SOP, not a standalone one. The design spec (§4) listed it as a separate file, but per the spec's own stated rule that the graph is the source of truth over the transcription, this SOP's `entry_mode` parameter is the correct home for it — building a 5th file here would silently inflate the buildable-SOP count past the spec's own stated total of 30.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 4: Write `reporting-standard-checklist/references/item-sets.md`**

```markdown
# Reporting Standard Item Sets

6 checklists: PRISMA (systematic reviews), CONSORT (RCTs), STROBE
(observational studies), ARRIVE (animal research), SPIRIT (trial
protocols), TRIPOD (prediction-model studies). All 6 share the same
structural shape: a flat item list, several items with a/b sub-items (e.g.
"describe randomization" (a) generation method, (b) allocation
concealment), each item judged Yes/No/NA plus a location citation (page or
section where the item is — or isn't — addressed).

These checklists were WRITTEN for authors preparing a submission (an
authorial, forward-looking checklist). Using them as a READER auditing an
already-published paper means reversing each item's framing: an item
originally phrased as an instruction ("Describe randomization method") must
be read as a question ("Does this paper describe its randomization
method, and if so, where?") before it can be answered against a finished
paper. This reversal applies to all 6 checklists in this SOP, not something
specific to one of them.

There is no integration/synthesis step across these 6 checklists — unlike
CASP/JBI/AMSTAR-2, judgment IS the terminal output per item; there's no
overall_appraisal field for this SOP.
```

- [ ] **Step 5: Write `reporting-standard-checklist/prompt.md`**

```markdown
# Reporting Standard Checklist — Subagent Prompt

Check whether the paper reports each item from the dispatched reporting
standard (PRISMA/CONSORT/STROBE/ARRIVE/SPIRIT/TRIPOD), and cite WHERE it's
reported.

## Input
- **full_text**: the paper's full text
- **dispatched_tool**: which specific standard (from study-design-tool-gate)

## Reference

Read `references/item-sets.md` first — in particular, the note on reversing
each item's authorial framing into a reader's question before answering it.

## Output
- **checklist_result**: list of {item, [sub_item: "a" | "b", where the item has sub-items], judgment: "Yes" | "No" | "NA", location} — `location` must be a specific page/section reference when judgment is "Yes"; may be empty when judgment is "No" or "NA"

## Instructions
1. Reverse each item's authorial framing before answering — see the reference file's note on this; skipping this step and answering the item's literal instruction-form wording produces a nonsensical result against a finished paper.
2. Every item with documented a/b sub-items must be scored per sub-item, not collapsed into one judgment for the whole item.
3. There is no overall synthesis step for this SOP — stop at the per-item table, do not manufacture an overall_appraisal.
```

- [ ] **Step 6: Write `reporting-standard-checklist/SKILL.md`**

```markdown
---
name: reporting-standard-checklist
description: Check whether a paper reports each item from PRISMA, CONSORT, STROBE, ARRIVE, SPIRIT, or TRIPOD (per whichever study-design-tool-gate dispatched to), citing where each item is or isn't addressed — including a/b sub-item hierarchy where the standard defines one. Use this after study-design-tool-gate has dispatched to one of these 6 reporting standards; this checks report completeness (did they say where), not methodological quality (was the study done well) — there is no overall synthesis step, judgment per item is the terminal output.
execution: subagent
prompt: ./prompt.md
input: full_text (string), dispatched_tool (string)
output: checklist_result (list of {item, sub_item, judgment, location})
dependencies:
  sops:
  - spawn-agent
---

# Reporting Standard Checklist

Per-item report-completeness check (with location citation) across PRISMA/CONSORT/STROBE/ARRIVE/SPIRIT/TRIPOD. No integration step — unlike quality-appraisal-checklist, judgment per item IS the terminal output.

## Execution

Subagent — spawned via spawn-agent skill.

## Reference

`references/item-sets.md` — the authorial-to-reader reversal note that applies to all 6 standards is there, read before drafting (Progressive Disclosure — kept out of this SKILL.md body).

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 7: Write `engineering-config-grading/prompt.md`**

```markdown
# Engineering Config Grading — Subagent Prompt (PROPOSAL, unverified)

Grade reproducibility-relevant configuration items on a 3-level completeness
scale (complete/partial/none) rather than a binary Yes/No — this requires
you to first establish what "complete" should look like for each item, then
judge where the paper falls short of it. That standard-setting step is what
makes this a QUALITY judgment, not a report-completeness check (contrast
with reporting-standard-checklist, which never needs to define what
"complete" means beyond "is it present").

This is an unverified proposal SOP filling a gap in the evaluative-stance ×
content-layer matrix (quality-judgment applied to engineering/reproducibility
metadata, which no existing verified checklist covers at the graded level —
dual-column-self-check's checklists are binary Yes/No/NA, not graded).

## Input
- **full_text**: the paper's full text
- **dispatched_tool**: confirms this gate dispatch (engineering-config-grading has a single item set, no variants)

## Output
- **grading_result**: list of {item, grade: "complete" | "partial" | "none", justification} — items cover things like hyperparameter-search-range reporting, compute-budget reporting, random-seed handling, dataset-split reproducibility

## Instructions
1. For each item, state explicitly (in justification) what "complete" reporting would look like for that item BEFORE judging where this paper falls on the scale — this makes your standard-setting step auditable rather than an implicit judgment call.
2. Since this is a proposal method with no established baseline, be conservative — reserve "complete" for items that genuinely leave no reasonable follow-up question unanswered, not for items that are merely present.
```

- [ ] **Step 8: Write `engineering-config-grading/SKILL.md`**

```markdown
---
name: engineering-config-grading
description: (Proposal, unverified) Grade reproducibility-relevant engineering configuration items (hyperparameter search range, compute budget, seed handling, dataset splits) on a complete/partial/none scale, requiring the grader to first define what "complete" means per item before judging against it. Use this after study-design-tool-gate has dispatched an ML/CS engineering paper here; this is a graded QUALITY judgment, distinct from dual-column-self-check's binary Yes/No/NA self-audit checklists.
execution: subagent
prompt: ./prompt.md
input: full_text (string), dispatched_tool (string)
output: grading_result (list of {item, grade, justification})
dependencies:
  sops:
  - spawn-agent
---

# Engineering Config Grading (Proposal)

Graded (not binary) reproducibility-config quality judgment. Fills the quality-judgment × engineering-metadata gap in the evaluative-stance × content-layer matrix (spec §2, matrix-generation phase). Per coverage-audit M14: an earlier draft folded this into dual-column-self-check via a value-domain toggle alone, which dropped the actual judgment-defining action (establishing what "complete" means) that distinguishes this from a binary checklist.

## Execution

Subagent — spawned via spawn-agent skill.

## Proposal Status — Read Before Modifying

No primary-source precedent (unlike NOS, which it's structurally modeled after but applies to a different content layer). Keep "(Proposal, unverified)" in the description until real usage validates the method.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
```

- [ ] **Step 9: Write `reproducibility-third-party-verification/prompt.md`**

```markdown
# Reproducibility Third-Party Verification — Subagent Prompt (PROPOSAL, unverified)

Attempt to verify the paper's own reported results by actually running
code/scripts, if the paper's configuration was extracted with enough
structure to attempt this. This is the one SOP in this whole package whose
action type is "execute code," not "read and judge text" — treat that
difference seriously in how you scope your own actions.

## Input
- **classified_units**: output from unit-classification (must include the paper's own reported configuration/hyperparameter claims already extracted as classified units — this SOP does not itself re-derive that extraction from raw full_text)

## Output
- **verification_result**: list of {claim, reproducible: true | false | "not_attempted", notes} — "not_attempted" is the correct value whenever the paper's own reporting is too incomplete to actually attempt a run (e.g. no code released, no dataset access, missing critical hyperparameters) — this is a common and expected outcome, not a failure of this SOP

## Instructions
1. Only attempt actual code execution when the paper provides (or links to) runnable code/scripts AND the classified_units contain enough configuration detail to run it as the paper describes — do not attempt to reconstruct missing code from a paper's prose description alone and call that a "reproduction attempt."
2. If code is available but the paper's reported config is incomplete in some specific way, say exactly what's missing in notes rather than guessing plausible values to fill the gap — a "verification" that silently filled in guessed hyperparameters is not actually verifying the paper's own reported setup.
3. This is a proposal method with no inter-rater-reliability baseline (unlike, say, SciFact's reported Cohen's κ figures) — present results with appropriate uncertainty, not as a definitive pass/fail.
```

- [ ] **Step 10: Write `reproducibility-third-party-verification/SKILL.md`**

```markdown
---
name: reproducibility-third-party-verification
description: (Proposal, unverified) Attempt to verify a paper's reported results by actually executing its released code/scripts against its own reported configuration — the only SOP in this package whose action type is code execution rather than text reading/judgment. Use this after unit-classification has extracted the paper's reported configuration/hyperparameters as classified units; "not_attempted" is a correct, common output when the paper's own reporting is too incomplete to run, not a failure of this SOP.
execution: subagent
prompt: ./prompt.md
input: classified_units (list of {unit_text, offset, label})
output: verification_result (list of {claim, reproducible, notes})
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
```

- [ ] **Step 11: Validate all four**

```bash
cd "D:\YOGSOTH-AI\paper-reading"
for f in skills/quality-appraisal-checklist/SKILL.md skills/reporting-standard-checklist/SKILL.md skills/engineering-config-grading/SKILL.md skills/reproducibility-third-party-verification/SKILL.md; do
  D:\anaconda3\python.exe scripts/validate_skill.py "$f"
done
```

Expected: `No errors found` printed 4 times.

- [ ] **Step 12: Commit**

```bash
cd "D:\YOGSOTH-AI\paper-reading"
git add skills/quality-appraisal-checklist/ skills/reporting-standard-checklist/ skills/engineering-config-grading/ skills/reproducibility-third-party-verification/
git commit -m "Add checklist family SOPs (A2a/A2b + 2 proposals), completing all 30 buildable SOPs"
```

- [ ] **Step 13: skill-creator eval loop for this group**

Re-invoke `Skill({skill: "skill-creator"})` and run its eval process for these 4 SOPs. This is the final build group — once its eval loop completes, all 30 buildable SOPs from the pipeline graph exist as skill-creator-compliant files.

- [ ] **Step 14: Package-wide description-triggering optimization**

Per skill-creator's own recommended sequencing ("Description Optimization" section) and this plan's Global Constraints (triggering optimization deferred to a final, package-wide pass), run `scripts/run_loop.py` per SOP now that all 30 exist and have passed their functional evals — this is explicitly the LAST step of the whole plan, not something to interleave per-group, since a description's triggering accuracy is best tuned once the full sibling-SOP set exists (so eval queries can include genuine near-miss cases against actual sibling descriptions, not hypothetical ones).

---

## Final State

After Task 9 completes: all 30 buildable SOPs from the pipeline graph exist as skill-creator-compliant `SKILL.md`/`prompt.md` pairs (plus 3 `references/` files for the largest parameter tables), each independently invokable, each validated against `scripts/validate_skill.py`, each having passed its own group's skill-creator eval loop. The 2 out-of-scope graph nodes (`grade-out-of-scope`, `csfcube-facet`) remain undocumented as skills, per spec §10. No strategy/tactic layer exists yet — composing these 30 SOPs into higher-level "read this paper using methods X/Y/Z" tactics is the explicitly deferred next phase, per the user's original "build the SOP lake first" framing.

