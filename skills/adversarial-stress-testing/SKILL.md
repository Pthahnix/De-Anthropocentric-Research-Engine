---
name: adversarial-stress-testing
description: 'Campaign: Logical extreme and boundary testing via reductio ad absurdum
  and edge-case analysis. Core question: Does this artifact collapse under logical
  limits and boundary conditions? Methods: Lakatos 1976, Dutilh Novaes 2016, BVA,
  Flyvbjerg Critical Case, Popper.'
type: campaign
produces: AdversarialStressReport
artifact-types:
- gap
- hypothesis
- research-question
- idea
- approach
- experiment-design
- claim
dependencies:
  strategies:
  - assumption-negation
  - boundary-enumeration
  - critical-case-design
  - lakatos-heuristics
  - stress-test-validity-envelope-mapping
  tactics:
  - boundary-probing
  - contradiction-derivation
  - counterexample-heuristics
  sops:
  - context-checkpoint
  - context-init
  - mitigation-proposal
  - stress-test-saturation-detection
  - verdict-synthesis
  - weakness-classification
---

# Adversarial Stress Testing

**Core Question:** Does this artifact collapse under logical limits and boundary conditions?

## Methodology Sources

- Lakatos (1976) — Proofs and Refutations: counterexample-driven refinement
- Dutilh Novaes (2016) — Adversarial argumentation as dialogical practice
- Clarke BVA — Boundary Value Analysis for systematic edge testing
- Flyvbjerg (2006) — Critical case methodology: most-likely/least-likely selection
- Popper (1959) — Falsificationism: seek conditions where claims break

## Strategy Routing

| Artifact Type | Primary Strategy | Rationale |
|---|---|---|
| claim, hypothesis | assumption-negation | Direct logical attack |
| gap, research-question | lakatos-heuristics | Counterexample refinement |
| idea, approach | boundary-enumeration | Parameter space testing |
| experiment-design | critical-case-design | Decisive test selection |
| any (synthesis) | validity-envelope-mapping | Comprehensive envelope |

## Budget Table

| Resource | S | M | L |
|---|---|---|---|
| Negation derivation chains | 3 | 6 | 10 |
| Counterexamples/boundary cases | 5 | 12 | 25 |
| Parameter dimensions | 3 | 6 | 10 |
| Validity envelope dimensions | 2 | 4 | 6 |

## Tactics

- contradiction-derivation — Negate, derive, detect contradiction
- boundary-probing — Map parameter space, test extremes, find breakpoints
- counterexample-heuristics — Generate monsters, bar or incorporate

## Context Management

- Persist derivation chains and counterexamples across rounds
- Track which negations produced genuine contradictions vs. benign outcomes
- Accumulate validity envelope boundaries incrementally

## Output

Produces `AdversarialStressReport` containing: identified breakpoints, validity envelope, surviving refined claims, and confidence assessment.

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| assumption-negation | Classic reductio ad absurdum: negate the core claim, derive logical consequences, seek contradiction or absurdity. |
| boundary-enumeration | Systematic Boundary Value Analysis: identify parameter boundaries, test at and beyond limits, detect breakpoints. |
| critical-case-design | Flyvbjerg critical case methodology: select most-likely and least-likely cases to maximize inferential power. |
| lakatos-heuristics | Proofs and Refutations method: generate counterexamples, attempt monster-barring, incorporate surviving counterexamples as lemma refinements. |
| stress-test-validity-envelope-mapping | Map the complete validity envelope of a claim across all relevant dimensions, synthesizing breakpoints into a bounded region. |

## Available Tactics

Optional, no fixed order; the final leaf is always a sop.

| Tactic | When to use |
| --- | --- |
| boundary-probing | Map parameter space, generate extreme values, test at boundaries, detect breakpoints, synthesize validity envelope. |
| contradiction-derivation | Negate a claim, derive logical consequences step by step, detect whether a genuine contradiction or absurdity emerges. |
| counterexample-heuristics | Generate counterexamples (monsters), attempt monster-barring, incorporate surviving counterexamples as lemma refinements (Lakatos method). |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| mitigation-proposal | Proposes concrete mitigation strategies for identified weaknesses. Generates prevention, detection, and response measures with feasibility assessment. |
| stress-test-saturation-detection | Determines whether validation has reached saturation — no new weaknesses or failure modes being discovered. Used by all 5 campaigns as termination signal. |
| verdict-synthesis | Synthesizes findings from a completed campaign into typed verdict reports. Produces DebateVerdict, RedTeamReport, FailureAnticipationReport, CounterfactualMap, or AdversarialStressReport depending on campaign. Also supports cross-campaign StressTestSummary. |
| weakness-classification | Classifies discovered weaknesses into severity tiers (fatal/major/minor/cosmetic) with structured justification and exploitability assessment. |

<!-- END available-tables (generated) -->
