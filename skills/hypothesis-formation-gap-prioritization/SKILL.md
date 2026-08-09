---
name: hypothesis-formation-gap-prioritization
description: 'Campaign: Systematically assess and rank research gaps, determining
  the targets most worth attacking'
version: 1.0.0
category: hypothesis-formation
type: campaign
input: 'Gaps produced by upstream repos (any format: knowledge-acquisition, deep-insight,
  or manually provided by the user)'
output: Ranked gap priority list + suggested attack paths for the top N gaps
strategies:
- multi-criteria-ranking
- evidence-based-prioritization
- stakeholder-weighted-ranking
- portfolio-optimization
- rapid-triage
tactics:
- scoring-matrix-construction
- pairwise-comparison
- priority-sensitivity-testing
dependencies:
  campaigns:
  - hypothesis-formulation
  strategies:
  - evidence-based-prioritization
  - hypothesis-formation-portfolio-optimization
  - multi-criteria-ranking
  - rapid-triage
  - stakeholder-weighted-ranking
  tactics:
  - pairwise-comparison
  sops:
  - context-checkpoint
  - context-init
  - hypothesis-formation-quality-gate-check
  - hypothesis-formation-saturation-detection
---

# Gap Prioritization

Systematically assess and rank research gaps — answering "which gaps are most worth attacking?"

## HARD-GATE

<HARD-GATE>
Preconditions (all must hold before starting):
1. At least 3 clearly identified research gaps already exist (from an upstream repo or provided by the user)
2. Each gap has sufficient description (at least: what the gap is, why it exists, in which domain)
3. The research intent is clear (north-star-crystallization completed or explicitly stated by the user)

Not met → stop, and inform the user that upstream work must be completed first.
</HARD-GATE>

## Campaign Goal

Turn a batch of unranked research gaps into a prioritized attack list. The output is not "discovering new gaps" but "making decisions about existing gaps."

## Strategy Selection

| Strategy | When to use | Default |
|----------|---------|------|
| multi-criteria-ranking | Moderate number of gaps (5-20), systematic assessment needed | ✓ |
| evidence-based-prioritization | Gaps from rigorous literature review, with ample supporting evidence | |
| stakeholder-weighted-ranking | Research involves multiple stakeholders | |
| portfolio-optimization | Large number of gaps (20+), portfolio-level decisions needed | |
| rapid-triage | Very large number of gaps (50+), rapid coarse screening needed first | |

CC autonomously selects a strategy based on gap count, evidence sufficiency, and stakeholder complexity. Strategies can be combined (e.g., rapid-triage to screen first → multi-criteria-ranking for fine ranking).

## Budget Gate

| Tier | Number of gaps | Assessment dimensions | Scoring rounds | Final output |
|------|---------|---------|---------|---------|
| S | 3-5 | ≥3 | 1 | Ranking + top 2 attack suggestions |
| M | 6-20 | ≥4 | ≥2 (incl. sensitivity testing) | Ranking + top 3-5 attack suggestions |
| L | 20+ | ≥5 | ≥3 (incl. portfolio optimization) | Ranking + top 5-8 attack suggestions + portfolio analysis |

## Context Management

- Call context-init at the start of the campaign
- Call context-checkpoint after each strategy completes (hard constraint)
- All outputs accumulate in a single campaign-scoped context file

## Minimum Yield

Each campaign execution must produce:
1. A standardized gap list (unified format)
2. A multi-dimensional scoring matrix (or an equivalent ranking basis)
3. A final priority ranking
4. Suggested attack paths for the top N gaps (incl. method direction, expected difficulty, required resources)

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| evidence-based-prioritization | Strategy: evidence-strength-based AHRQ PiCMe assessment — drive gap prioritization with the quality of literature evidence |
| hypothesis-formation-portfolio-optimization | Strategy: Treat the gap set as an investment portfolio — use risk/return/diversity optimization to select the optimal gap portfolio |
| multi-criteria-ranking | Strategy: multi-dimensional weighted scoring and ranking — decompose a gap into independent sub-questions, then recombine into a priority list |
| rapid-triage | Strategy: rapid coarse screening — two filtering rounds compress a large set of gaps into a fine-rankable candidate set |
| stakeholder-weighted-ranking | Strategy: Weight by stakeholder perspective — the same gap carries different weight under different perspectives; take the consensus ranking at the end |

## Available Tactics

Optional, no fixed order; the final leaf is always a sop.

| Tactic | When to use |
| --- | --- |
| pairwise-comparison | Tactic: rank gaps through relative comparison rather than absolute scoring, suited to hard-to-quantify situations |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| hypothesis-formation-quality-gate-check | Shared SOP: General quality-gate check (format completeness, logical consistency) |
| hypothesis-formation-saturation-detection | Shared SOP: judge whether the current activity has reached information saturation |

## Available Campaigns

Optional, no fixed order; the final leaf is always a sop.

| Campaign | When to use |
| --- | --- |
| hypothesis-formulation | Campaign: transform insights and gaps into structured testable hypotheses |

<!-- END available-tables (generated) -->
