# paper-reading v2 Package Design

> Status: drafted 2026-08-07, pending user review
> Scope: rebuild `paper-reading` on the v2 architecture — 46 verified single-paper reading/extraction methodologies, deduplicated into a 32-node SOP dependency graph. Supersedes the v1 design (`2026-07-30-paper-reading-pkg-design.md`), which is staged at `staged/wechat-article-v1/` and remains recoverable via the `v1-wechat-pipeline` branch.

## 1. Purpose

Given one specified academic paper, run it through any of ~32 independent, individually-testable SOPs, each implementing a distinct published reading/evaluation/extraction methodology (Keshav's three-pass, RoB2, AZ/CoreSC, SciREX, ACU, SciFact, etc.), each producing a differently-shaped structured artifact. This is a shift from v1's single fixed pipeline (paper → WeChat article) to a **library of independently invokable SOPs** — a "SOP lake" the user can compose from later via higher-level tactics, rather than one baked-in sequence.

This package sits inside the DARE (De-Anthropocentric Research Engine) skill ecosystem as its own standalone repository, following the same conventions as `literature-engine`, `deep-insight`, `knowledge-acquisition`.

## 2. Background — how this design was reached

Four research passes (documented in `context/`, chronological order) produced this design:

1. **2026-08-06 four-line scoping** (`2026-08-06-16-35-single-paper-reading-sop-research.md`): A1 (成文阅读法: Keshav/QALMRI/Teufel AZ/CoreSC/Swales) + A2 (批判性评估工具: RoB2/GRADE/AMSTAR-2/etc.) + B1 (facet抽取: CSFCube/SciERC/SciREX/ORKG/NCG) + B2 (原子单元: TDMS/QASPER/SciFact/ACU/nugget/CODA-19) — 46 methodologies verified to primary-source detail (exact category counts, inter-annotator agreement figures, algorithmic structure).
2. **Axis discovery**: 7 independent dimensions the 46 methods diverge along — evaluative stance, content layer, determinism, output anchor strength, cross-paper alignability, domain specificity, aggregation span.
3. **Matrix generation** (`2026-08-07-10-26-sop-menu-final.md`): evaluative-stance × content-layer cross gave a 4×3 matrix, 8/12 cells occupied by existing methods, 4 empty — 4 unverified proposal SOPs were drafted to fill those gaps (`rhetorical-structure-quality`, `engineering-config-grading`, `rhetorical-completeness-check`, `reproducibility-third-party-verification`).
4. **Graph construction + independent coverage audit** (`2026-08-07-13-42-sop-pipeline-graph.html` + `2026-08-07-14-08-sop-graph-coverage-audit.md`): the 46 methods were split/merged into a dependency graph. A v1 attempt (22 nodes) was audited by an independent Opus pass and found to only be **executably correct for ~30/46 methods** — cascaded methods (GRADE, Keshav, SciREX, ACU/Nugget, SciFact) had been flattened into single nodes, losing steps their original algorithms require. The graph was repaired to v2 (31 nodes) fixing all 7 flagged severe issues, then a `paper-fetch` entry node was added (v3, 32 nodes) after the user noted the graph had no node responsible for actually retrieving the paper's full text.

This design doc's job is **not** to re-derive the architecture — that work is done and lives in the graph file, which is this doc's primary source of truth for per-SOP behavior. This doc's job is to lay out how the 32 graph nodes become an actual skill-creator-compliant repository: what gets built, in what dependency order, and what each SOP's file contract looks like.

## 3. Architecture — flat SOP layer, no strategy/tactic layer (yet)

Unlike v1 (which used DARE's full strategy→tactic→sop hierarchy for one fixed pipeline) or other DARE campaigns (`deep-insight`: 112 skills across 4 layers), v2 is **all SOPs, no strategies or tactics** at this stage. Rationale: the 32 nodes are not steps in one campaign toward one output — they're independent, individually-useful methodologies that happen to share some pipeline structure (a few 2-3-step cascades). Composing them into higher-level "read this paper thoroughly using methods X, Y, Z" tactics is an explicitly deferred follow-up, per the user's original framing: build the SOP lake first, add tactics on top of it later once the lake exists and its individual pieces have been tested.

```
paper_ref (input: title / arXiv ID / DOI / URL)
  │
  ▼
paper-fetch (sop)                  — the graph's sole entry point, no in-edges
  │
  ├─→ first-pass-skim → second-pass-grasp → third-pass-deep-read     (Keshav cascade)
  ├─→ unit-segmentation → unit-classification → [rhetorical-structure-quality | quality-appraisal-checklist]
  ├─→ unit-segmentation → unit-classification → multi-stage-cascade-extraction  (wait — see §5 dependency note)
  ├─→ study-design-tool-gate → {signalling-question-answering, star-awarding, quality-appraisal-checklist, reporting-standard-checklist, engineering-config-grading}
  ├─→ atomic-unit-writing → atomic-unit-matching → atomic-unit-recall-aggregate
  ├─→ claim-writing → rationale-selection → claim-label-prediction
  ├─→ multi-stage-cascade-extraction  (direct, per graph edge — see §5 correction)
  └─→ {qalmri, qasper-evidence-qa, template-slot-filling, question-framing, research-question-appraisal}  (standalone, no further steps)
```

Two nodes are documented in the graph as **out of scope** and produce no skill: `grade-out-of-scope` (needs cross-study evidence body inputs a single paper can't provide) and `csfcube-facet` (its executable task is multi-document retrieval, not single-paper extraction — only its 3 facet-label definitions are reused, as a parameter inside `unit-classification`).

## 4. Repository structure

```
paper-reading/
├── skills/
│   ├── paper-fetch/SKILL.md                              [sop, subagent]
│   ├── first-pass-skim/SKILL.md                          [sop, subagent]  — carried over from v1, re-verified against Keshav's original semantics
│   ├── second-pass-grasp/SKILL.md                        [sop, subagent]
│   ├── third-pass-deep-read/SKILL.md                     [sop, subagent]  — renamed from v1's third-pass-verify per the coverage audit's S2 fix
│   ├── unit-segmentation/SKILL.md                        [sop, subagent]
│   ├── unit-classification/SKILL.md                      [sop, subagent]
│   ├── multi-stage-cascade-extraction/SKILL.md           [sop, subagent]
│   ├── rhetorical-structure-quality/SKILL.md             [sop, subagent]  — proposal, unverified
│   ├── study-design-tool-gate/SKILL.md                   [sop, subagent]
│   ├── signalling-question-answering/SKILL.md            [sop, subagent]
│   ├── domain-level-judgment/SKILL.md                    [sop, subagent]
│   ├── star-awarding/SKILL.md                            [sop, subagent]
│   ├── worst-case-lookup/SKILL.md                        [sop, subagent]
│   ├── sum-threshold-scoring/SKILL.md                    [sop, subagent]
│   ├── quality-appraisal-checklist/SKILL.md              [sop, subagent]
│   ├── reporting-standard-checklist/SKILL.md             [sop, subagent]
│   ├── dual-column-self-check/SKILL.md                   [sop, subagent]
│   ├── engineering-config-grading/SKILL.md               [sop, subagent]  — proposal, unverified
│   ├── rhetorical-completeness-check/SKILL.md            [sop, subagent]  — proposal, unverified
│   ├── atomic-unit-writing/SKILL.md                      [sop, subagent]
│   ├── atomic-unit-matching/SKILL.md                     [sop, subagent]
│   ├── atomic-unit-recall-aggregate/SKILL.md             [sop, subagent]
│   ├── claim-writing/SKILL.md                            [sop, subagent]
│   ├── rationale-selection/SKILL.md                      [sop, subagent]
│   ├── claim-label-prediction/SKILL.md                   [sop, subagent]
│   ├── reproducibility-third-party-verification/SKILL.md [sop, subagent]  — proposal, unverified
│   ├── qalmri/SKILL.md                                   [sop, subagent]
│   ├── qasper-evidence-qa/SKILL.md                       [sop, subagent]
│   ├── template-slot-filling/SKILL.md                    [sop, subagent]
│   ├── question-framing/SKILL.md                         [sop, subagent]
│   └── research-question-appraisal/SKILL.md              [sop, subagent]
├── docs/superpowers/{specs,plans}/      — this spec, later the implementation plan
├── context/                             — research context (already populated through the graph-construction phase)
├── tests/                                — skill-creator convention: evals/, workspace/
└── evals/                                — top-level eval set for description-triggering optimization (skill-creator step, deferred to end)
```

**30 buildable SOPs** (32 graph nodes minus the 2 out-of-scope ones). No strategy or tactic files in this round.

## 5. Per-SOP contract table

Source of truth for every field below is the graph file (`2026-08-07-13-42-sop-pipeline-graph.html`, `nodes`/`edges` arrays) and, for `paper-fetch`, the dedicated design doc (`2026-08-07-15-15-paper-fetch-sop-design.md`). This table is a transcription, not a re-derivation — where the graph's `desc` already specifies a behavior, that behavior is definitive.

| SOP | Depends on (in-edge) | Feeds into (out-edge) | Parameterizes on |
|---|---|---|---|
| `paper-fetch` | *(none — entry point)* | 11 chain-head nodes below | — |
| `first-pass-skim` | `paper-fetch` | `second-pass-grasp` | — |
| `second-pass-grasp` | `first-pass-skim` | `third-pass-deep-read` | — |
| `third-pass-deep-read` | `second-pass-grasp` | *(terminal)* | — |
| `unit-segmentation` | `paper-fetch` | `unit-classification` | segmentation granularity (sentence/clause), scope (full text/abstract/intro-only) |
| `unit-classification` | `unit-segmentation` | `rhetorical-structure-quality`, `quality-appraisal-checklist` (via `rhetorical-completeness-check`), `reproducibility-third-party-verification` | label set, hierarchy toggle (Swales move/step), output type (single-label/span/tuple) |
| `multi-stage-cascade-extraction` | `paper-fetch` | *(terminal)* | stage count, per-stage label/relation set, saliency layer toggle |
| `rhetorical-structure-quality` | `unit-classification` | *(terminal)* | — (proposal) |
| `study-design-tool-gate` | `paper-fetch` | `signalling-question-answering`, `star-awarding`, `quality-appraisal-checklist`, `reporting-standard-checklist`, `engineering-config-grading` | study-design → tool/item-set dispatch table |
| `signalling-question-answering` | `study-design-tool-gate` | `domain-level-judgment` | domain set, per-domain question set, branch rules |
| `domain-level-judgment` | `signalling-question-answering` | `worst-case-lookup` (RoB2/ROBINS-I only — QUADAS-2 terminates here) | lookup-table rule, dual-axis toggle (QUADAS-2) |
| `star-awarding` | `study-design-tool-gate` | `sum-threshold-scoring` | — |
| `worst-case-lookup` | `domain-level-judgment`, `quality-appraisal-checklist` | *(terminal)* | value domain, pre-filter-by-weight toggle |
| `sum-threshold-scoring` | `star-awarding` | *(terminal)* | — |
| `quality-appraisal-checklist` | `study-design-tool-gate`, `unit-classification` (via proposal) | `worst-case-lookup` (AMSTAR-2 only) | item set |
| `reporting-standard-checklist` | `study-design-tool-gate` | *(terminal)* | item set (incl. a/b sub-item hierarchy) |
| `dual-column-self-check` | *(standalone — no in-edge in current graph; see note below)* | *(terminal)* | item set |
| `engineering-config-grading` | `study-design-tool-gate` | *(terminal)* | — (proposal) |
| `rhetorical-completeness-check` | *(logical: consumes `unit-classification` output)* | `quality-appraisal-checklist` | — (proposal) |
| `atomic-unit-writing` | `paper-fetch` | `atomic-unit-matching` | unit source (extracted/authored), importance-tagging toggle |
| `atomic-unit-matching` | `atomic-unit-writing` | `atomic-unit-recall-aggregate` | judgment value domain |
| `atomic-unit-recall-aggregate` | `atomic-unit-matching` | *(terminal)* | — |
| `claim-writing` | `paper-fetch` | `rationale-selection` | — |
| `rationale-selection` | `claim-writing` | `claim-label-prediction` | — |
| `claim-label-prediction` | `rationale-selection` | *(terminal)* | — |
| `reproducibility-third-party-verification` | `unit-classification` | *(terminal)* | — (proposal) |
| `qalmri` | `paper-fetch` | *(terminal)* | — |
| `qasper-evidence-qa` | `paper-fetch` | *(terminal)* | — |
| `template-slot-filling` | `paper-fetch` | *(terminal)* | template attribute schema |
| `question-framing` | `paper-fetch` | *(terminal)* | slot definitions (PICO/PECO/SPIDER) |
| `research-question-appraisal` | `paper-fetch` | *(terminal)* | — |

**Two things this table surfaces that the graph file leaves implicit, flagged here rather than silently resolved:**

- `dual-column-self-check` has no in-edge in the current graph — it's reachable only by direct invocation, not by walking from `paper-fetch`. This is consistent with the other checklist SOPs being study-design-gated, but `dual-column-self-check`'s 5 methods (ML Reproducibility Checklist, REFORMS, etc.) are engineering self-audits, not tied to a clinical study design — so no dispatch from `study-design-tool-gate` was ever drawn for it. Treat this as intentional: it's invoked directly when the input is an ML/CS paper needing a reproducibility self-check, not gated by study design.
- `multi-stage-cascade-extraction` has both a direct edge from `paper-fetch` and would logically also want segmented input like the `unit-classification` chain does. The graph draws it as a direct `paper-fetch` child (not gated behind `unit-segmentation`), reflecting that SciERC/SciREX/NCG's cascade (mention detection → coreference → relation extraction) doesn't need the same sentence/clause pre-segmentation the single-layer classification methods do — it operates over spans it discovers itself. This is preserved as-is per the graph, not "fixed" to add a segmentation dependency that was deliberately not there.

## 6. Build sequencing

Not layer-based (there's no strategy/tactic layer to sequence), but **complexity-based**, so early builds validate the SOP execution pattern itself before the more structurally intricate cascades are attempted:

1. **`paper-fetch`** — build first; every other SOP is unreachable without it, and its design is already fully specified (`2026-08-07-15-15-paper-fetch-sop-design.md`).
2. **Keshav cascade** (`first-pass-skim`, `second-pass-grasp`, `third-pass-deep-read`) — v1 precedent exists at `staged/wechat-article-v1/skills/{first-pass-skim,second-pass-grasp,third-pass-verify}/`; adapt rather than write from scratch, applying the S2 corrections (no v1-specific "structured bundle" output; third pass restored to the full re-implementation read, not a skippable no-op).
3. **Standalone single-step SOPs** (`qalmri`, `qasper-evidence-qa`, `template-slot-filling`, `question-framing`, `research-question-appraisal`, `dual-column-self-check`) — no internal dependencies, each validates a different output shape (free-text worksheet / span-anchored QA / template-fill / slot-fill / five-point appraisal / dual-column self-check) before tackling cascades.
4. **Unit classification family** (`unit-segmentation`, `unit-classification`, `multi-stage-cascade-extraction`, `rhetorical-structure-quality`) — the B0→B→B2 chain plus its second-order consumer.
5. **Atomic-unit family** (`atomic-unit-writing`, `atomic-unit-matching`, `atomic-unit-recall-aggregate`) — sequential 3-step chain.
6. **SciFact family** (`claim-writing`, `rationale-selection`, `claim-label-prediction`) — sequential 3-step chain.
7. **Gate + bias-risk family** (`study-design-tool-gate`, `signalling-question-answering`, `domain-level-judgment`, `star-awarding`, `worst-case-lookup`, `sum-threshold-scoring`) — gate plus its two-level judgment cascade.
8. **Checklist family** (`quality-appraisal-checklist`, `reporting-standard-checklist`, `engineering-config-grading`, `rhetorical-completeness-check`) — downstream of the gate, but each closer to a standalone parameterized checklist than a cascade; kept as its own group (not merged into group 7) so each SKILL.md's design questions (item set semantics, evaluative stance) stay separable and reviewable, rather than repeating the coverage audit's M9 finding (checklists spanning two evaluative stances got merged into one node and lost meaning).

Groups 3-8 require no further design discussion before drafting — their behavior is already fixed in the graph's `desc` fields (see §5). Drafting each SKILL.md is a transcription exercise per skill-creator's conventions (§7), not a new design decision.

## 7. skill-creator compliance

Every SKILL.md in this package must follow skill-creator's conventions:

- YAML frontmatter with `name` + `description` (description written "pushy" per skill-creator's own guidance on avoiding under-triggering); `execution: subagent` + `prompt: ./prompt.md` for every SOP (all 30 are subagent-executed — no deterministic-script SOPs identified, matching v1's precedent of Keshav's three passes).
- SKILL.md body under ~500 lines; any SOP whose parameter set is large (e.g. `study-design-tool-gate`'s dispatch table across 8+ CASP variants, 6+ JBI variants) gets a `references/` file with a table of contents rather than inlining the full table.
- `dependencies.sops: [spawn-agent]` for every subagent-executed SOP (matching `first-pass-skim`'s existing pattern), since `spawn-agent`'s default strategy (opus, full MCP tool access, markdown output) is what every one of these SOPs needs — no per-SOP override anticipated unless a specific SOP's evaluation shows otherwise during testing.
- After each build group (§6) completes, run skill-creator's test-case + eval loop (2-3 realistic prompts per SOP, with-skill vs. baseline, human review via `generate_review.py`) before moving to the next group — this catches drift from the graph's intended behavior early, rather than after all 30 are drafted.
- Description-triggering optimization (`run_loop.py`) deferred to after all groups pass their functional eval, per skill-creator's recommended sequencing.

## 8. MCP Tools

| MCP Server | Tools used | Used by |
|---|---|---|
| alphaxiv | `discover_papers`, `get_paper_content`, `answer_pdf_queries` | `paper-fetch` (primary channel) |
| semantic-scholar | `relevanceSearch`, `paper`, `paperBatch` | `paper-fetch` (venue/externalIds lookup for channel routing) |
| biorxiv | `search_preprints`, `fetch_fulltext` | `paper-fetch` (bio-domain fallback) |
| medrxiv | `search_preprints`, `fetch_fulltext` | `paper-fetch` (bio-domain fallback) |

No other SOP calls any external MCP tool directly — every SOP downstream of `paper-fetch` operates on the `full_text` string it already received, per `paper-fetch`'s decoupling design (§9 below).

## 9. Relationship to `literature-engine` (carried over from the paper-fetch design doc, restated here for package-level visibility)

`paper-fetch` is deliberately **not** built on top of `literature-engine`'s `literature-overview`/`literature-search`/`literature-research` SOPs. Those three already have an alphaxiv-primary/SS-supplementary two-tier search pattern, but none has a bioRxiv/medRxiv branch or an explicit "can't retrieve → halt, don't proceed" contract. Rather than extending those SOPs (which are used across other DARE packages and have their own scope), `paper-reading` holds its own self-contained fetch logic. This is a one-time architectural decision, not a pattern to be revisited per-SOP — no other SOP in this package should ever call MCP retrieval tools directly; they all consume `paper-fetch`'s output.

## 10. Explicitly out of scope for this round

- **Strategy/tactic layer.** Composing multiple SOPs into higher-level "read this paper using methods X/Y/Z" workflows is deferred — build the SOP lake first, per the user's original framing.
- **`grade-out-of-scope` and `csfcube-facet`.** No skill is built for either; both are documented in the graph as structurally inapplicable to a single-paper SOP (see §3).
- **The 4 proposal SOPs' validation.** `rhetorical-structure-quality`, `engineering-config-grading`, `rhetorical-completeness-check`, `reproducibility-third-party-verification` are unverified design proposals (no primary-source precedent, unlike the other 26 SOPs). They are built and tested like the rest, but flagged in their own SKILL.md frontmatter/description as proposal-status, not equivalent-confidence to a verified methodology.
- **Registering this package into the main `de-anthropocentric-research-engine` repo** as a submodule/cross-reference — a separate follow-up after the package is built and tested standalone, matching how `literature-engine`/`deep-insight` exist as independent repos DARE's main repo references.
- **Multi-paper / cross-paper synthesis.** Every SOP in this package is scoped to exactly one paper per run, per the graph's design throughout.
