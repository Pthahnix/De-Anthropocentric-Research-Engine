---
name: mechanism-gap-hunting
description: Mechanism-Gap Hunting Campaign — hunt the specific link where scientific
  progress is BLOCKED, not where literature is empty. Use this instead of gap-analysis
  whenever the goal is truth-seeking / AI4S research rather than finding a publishable
  white-space — i.e. when the user asks "where is progress actually stuck", "what
  mechanism is blocking this", or wants a complete blocker set rather than a ranked
  gap list. 4 stages over reused deep-insight SOPs, with injected per-stage directives.
  Exhaustive (no prioritization/ranking).
execution: campaign
dependencies:
  strategies:
  - assumption-audit
  - dialectical-reformulation
  - failure-mode-analysis
  sops:
  - abstraction-laddering
  - context-checkpoint
  - context-init
  - current-reality-tree
  - deep-insight-assumption-surfacing
  - failure-clustering
  - five-whys-drilling
---

# Mechanism-Gap Hunting

Hunt the specific link where scientific progress is blocked, not where literature is empty.

## Design Philosophy

This campaign is a strategy book — CC reads, internalizes, and autonomously constructs an approach. The SKILL.md files are textbooks, not scripts. CC decides execution order, depth, and iteration based on research context.

This campaign is the deliberate inverse of gap-analysis. Where gap-analysis asks "what is missing in the literature", mechanism-gap-hunting asks "what specific mechanism is blocking progress right now". The unit of output is a blocker, not a gap. Use this skill when the user wants truth-seeking over publishable white-space discovery.

## Core Definition

A **mechanism gap** is the specific link blocking a target scientific problem from moving forward.

**Three admission criteria — all required:**

1. **Blocking** — removing it materially advances the problem. The test: "if this were resolved, would the field meaningfully move?" NOT "would filling it add a paper?"
2. **Layer-attributable** — lands in exactly one of the three layers:
   - **theory** — a mechanistic or mathematical relationship that is unknown or uncharacterized
   - **identifiability** — a quantity that cannot be measured or inferred from available data
   - **container** — a system boundary or experimental context that prevents the underlying mechanism from being isolated
3. **Traceable evidence** — every blocker has an E→S→W chain:
   - **E (Evidence)** — a verbatim quote + citation from the literature showing the concession
   - **S (Symptom)** — what visible failure or workaround the concession produces
   - **W (Weakness)** — the root-cause mechanism explaining why progress is stuck

The three layers are **parameterizable**: swap the layer set to reuse this campaign on problems outside the default domain.

## 4-Stage Routing

| Stage | Reused skill | Layer | Injected directive |
| --- | --- | --- | --- |
| ① Blocker-symptom extraction | `assumption-audit` → `deep-insight-assumption-surfacing` | strategy → sop | Collect NOT "future work / remains to be studied" (white-space) but the authors' load-bearing concessions: `we (must) assume`, `cannot be measured (in vitro)`, `as a first step`, `the relationship … is unknown`, `for simplicity / we approximate`. Each concession = one candidate symptom; record verbatim quote + citation (= **E**). |
| ② Three-layer localization | `dialectical-reformulation` + `abstraction-laddering` | strategy + sop | Pin each symptom to exactly one layer and state what is stuck there (theory / identifiability / container as parameterized in Core Definition). Symptoms fitting no layer → tag "suspected out-of-scope", keep in a side list, do NOT discard. |
| ③ Root-cause drilling | `five-whys-drilling` + `current-reality-tree` | sop + sop | For each localized symptom, drill "why does this block progress" with TOC sufficient-cause logic (current-reality-tree), chaining symptom→mechanism root cause. Stop only when the root cause satisfies the **Blocking** criterion. Output the S→W segment per blocker. |
| ④ Block-verification (truth filter) | `failure-mode-analysis` → `failure-clustering` | strategy → sop | Verification standard = "does this mechanism truly impede progress", NOT "is it confirmed empty across databases". Filter the disguise: things that look like blockers but are **publishable points wearing novelty packaging** — if filling a "gap" only increases publishability without advancing characterization or recovery, mark pseudo-blocker, remove from the set (keep archived for audit). |

## Exhaustive-Not-Selective Rule

This campaign produces a **complete blocker set**. Every candidate symptom extracted in Stage ① is tracked through all four stages. There is no scoring, no ranking, and no elimination except Stage ④'s pseudo-blocker filter.

`gap-prioritization` and `multi-criteria-scoring` MUST NOT appear in this campaign. This is the deliberate inverse of gap-analysis, whose prioritization is central. If the user later wants a ranked subset, they route to gap-analysis after this campaign finishes.

## Output Format

Each confirmed blocker is locked to this block:

```
[layer: theory/identifiability/container] <blocker name>
  | E: verbatim quote + citation
  | S: symptom
  | W: root-cause mechanism
  | verify: how the Blocking criterion is satisfied
```

Pseudo-blockers are archived separately with a one-line note: why they were disqualified (publishability packaging vs. genuine blocking).

## SOP Reuse Checklist

| Stage | SOP (real flat-body name) | Role in this campaign |
| --- | --- | --- |
| ① | `assumption-audit` | Entry strategy: surface load-bearing concessions from the literature |
| ① | `deep-insight-assumption-surfacing` | Sop: extract and record each concession as a candidate E with verbatim quote + citation |
| ② | `dialectical-reformulation` | Strategy: challenge each symptom's layer attribution — stress-test the localization |
| ② | `abstraction-laddering` | Sop: move up/down abstraction levels to pin the symptom to exactly one layer |
| ③ | `five-whys-drilling` | Sop: iterative causal drilling — why does this symptom exist? |
| ③ | `current-reality-tree` | Sop: TOC sufficient-cause logic — chain symptom → root cause until Blocking criterion is met |
| ④ | `failure-mode-analysis` | Strategy: evaluate whether each root cause is a true failure mode for the field |
| ④ | `failure-clustering` | Sop: cluster candidate blockers, detect publishability-packaging disguise, output final set |

## Context Management

`context-init` is called once at campaign start to initialize the context file for this run.

`context-checkpoint` is called after each stage completes. Each checkpoint captures:
- the candidate list at that stage's exit (E only after ①; E+layer after ②; E+S+W after ③; final set after ④)
- any out-of-scope tags and pseudo-blocker archive entries
- the injected directive that was active for that stage

Accumulated state persists across stages within a campaign run.

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| assumption-audit | Surface all assumptions, classify by vulnerability (load-bearing × likely-false), validate causal logic. Focus on dangerous assumptions — high load-bearing + non-explicit. |
| dialectical-reformulation | Surface Argyris governing variables and test whether the problem dissolves under alternative governing variables (double-loop learning). |
| failure-mode-analysis | Systematically catalog failure modes — generate edge cases, observe failures, cluster by mechanism, identify triggers and frequency. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| abstraction-laddering | Move between concrete and abstract framings — 3 levels up (Why?) and 3 levels down (How?) to find the most productive research level. |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| current-reality-tree | Build TOC Current Reality Trees — connect Undesirable Effects via sufficient-cause logic to identify 1-3 root causes. |
| deep-insight-assumption-surfacing | Systematically extract implicit assumptions from methods, frameworks, or arguments. Identifies what is taken for granted without explicit justification. |
| failure-clustering | Group observed failures by mechanism (not symptom), identify common triggers per cluster, estimate frequency and severity. |
| five-whys-drilling | Iterative "Why?" questioning (5+ levels) to drill from surface phenomenon to actionable root cause. Each level verified against evidence. |

<!-- END available-tables (generated) -->
