---
name: steel-manning
description: Steel-Manning Campaign — adversarial verification of convergence decisions
  through resurrection advocacy, winner stress-testing, criteria interrogation, and
  multi-perspective attack using Devil's Advocacy, Pre-mortem, Red Teaming, Dialectical
  Inquiry methods.
execution: campaign
dependencies:
  strategies:
  - counter-thesis-construction
  - criteria-interrogation
  - resurrection-advocacy
  - stakeholder-objection-simulation
  - winner-stress-testing
  sops:
  - context-checkpoint
  - context-init
  - convergence-multi-stakeholder-simulation
  - convergence-saturation-detection
  - convergence-sensitivity-analysis
---

# Steel-Manning

Adversarial verification of convergence decisions. This campaign subjects winners, criteria, and rejected alternatives to rigorous challenge — ensuring that final decisions survive the strongest possible counter-arguments rather than merely the weakest objections.

The campaign deploys four complementary attack vectors: resurrecting rejected candidates to test whether elimination was justified, stress-testing winners to find hidden weaknesses, interrogating the criteria framework itself, and simulating stakeholder objections for political feasibility.

## Strategy Routing

| Signal | Strategy |
|--------|----------|
| resurrect rejected candidates / give losers a fair hearing | resurrection-advocacy |
| stress-test the winner / find weaknesses in top pick | winner-stress-testing |
| challenge the criteria themselves / meta-level questioning | criteria-interrogation |
| simulate stakeholder objections / political feasibility | stakeholder-objection-simulation |
| construct strongest counter-argument / dialectical challenge | counter-thesis-construction |

## Manifest

### Strategies

| Strategy | Method Lineage |
|----------|---------------|
| resurrection-advocacy | Devil's Advocacy, Dialectical Inquiry, Adversarial Collaboration (Kahneman) |
| winner-stress-testing | Pre-mortem (Klein), Red Teaming, Failure Mode Analysis |
| criteria-interrogation | Assumption-based Planning, Critical Systems Heuristics, Boundary Critique |
| stakeholder-objection-simulation | Role-play, Stakeholder Analysis, Political Feasibility |
| counter-thesis-construction | Dialectical Inquiry, Thesis-Antithesis-Synthesis, Adversarial Debate |

### Tactics

| Tactic | SOPs Used |
|--------|-----------|
| adversarial-debate-protocol | advocate-construction, critic-attack, judge-verdict |
| assumption-excavation | assumption-extraction, assumption-challenge, conclusion-sensitivity |
| multi-perspective-attack | perspective-assignment, perspective-attack, steel-manning-synthesis |

### SOPs

| SOP | Input | Output | Shareable |
|-----|-------|--------|-----------|
| advocate-construction | rejected_candidate, context | strongest_case_for_resurrection | validation |
| critic-attack | winner, advocate_case | attack_arguments[], severity_ratings | validation |
| judge-verdict | advocate_case, critic_attacks | verdict, reasoning, conditions | validation |
| assumption-extraction | decision, evidence | assumptions[], confidence_levels | — |
| assumption-challenge | assumption | challenge_argument, alternative, impact_if_wrong | — |
| conclusion-sensitivity | assumptions[], challenges[] | sensitivity_map, critical_assumptions[] | — |
| perspective-assignment | decision, stakeholders | perspective_briefs[] | — |
| perspective-attack | decision, perspective_brief | attacks[], constructive_alternatives[] | — |
| steel-manning-synthesis | all_attacks, all_verdicts | final_verdict, surviving_concerns, modifications | — |

## Budget Table (M Tier)

| Metric | Minimum |
|--------|---------|
| Attack perspectives | >= 3 distinct angles |
| Debate rounds | >= 2 per contested decision |
| Assumptions challenged | >= 5 per winner |
| Final verdict | Explicit ACCEPT / REJECT / REVISE with evidence |

## MCP Tools

- `mcp__wiki-vault__vault_search` — retrieve prior decisions and context
- `mcp__wiki-vault__vault_query_graph` — trace dependency chains for impact analysis
- `mcp__wiki-vault__vault_add_edge` — record challenge relationships

## Context Management

The campaign maintains a **Challenge Ledger** tracking:
- Which decisions have been challenged
- Attack vectors applied to each
- Verdicts rendered and their conditions
- Surviving concerns requiring monitoring

State is passed between strategies via the ledger. Each strategy updates it upon completion.

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| counter-thesis-construction | Construct the strongest possible counter-argument to the convergence decision using Dialectical Inquiry and Thesis-Antithesis-Synthesis methods. |
| criteria-interrogation | Challenge the evaluation criteria themselves using Assumption-based Planning, Critical Systems Heuristics, and Boundary Critique to ensure the framework is sound. |
| resurrection-advocacy | Argue for rejected candidates using Devil's Advocacy, Dialectical Inquiry, and Adversarial Collaboration to ensure elimination was justified. |
| stakeholder-objection-simulation | Simulate stakeholder objections through role-play and political feasibility analysis to test whether the decision survives real-world opposition. |
| winner-stress-testing | Stress-test the winning candidate using Pre-mortem, Red Teaming, and Failure Mode Analysis to expose hidden weaknesses before commitment. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| convergence-multi-stakeholder-simulation | Simulates diverse stakeholder perspectives and their strongest objections/support arguments. Shared across steel-manning and consensus campaigns. |
| convergence-saturation-detection | Determines when to stop iterating — coverage threshold met or marginal returns diminishing. Shared across all campaigns. |
| convergence-sensitivity-analysis | Tests conclusion robustness by perturbing parameters and observing rank changes. Shared across scoring, portfolio, and steel-manning campaigns. |

<!-- END available-tables (generated) -->
