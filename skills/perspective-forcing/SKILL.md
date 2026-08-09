---
name: perspective-forcing
description: Perspective Forcing Campaign — discover hidden solutions by systematically
  switching viewpoints via roles, six hats, temporal projection, and constraint injection
execution: campaign
dependencies:
  sops:
  - competitor-simulation
  - constraint-injection
  - constraint-response
  - context-checkpoint
  - context-init
  - creative-ideation-assumption-surfacing
  - creative-ideation-novelty-scoring
  - creative-ideation-saturation-detection
  - idea-synthesis
  - novice-perspective
  - perspective-synthesis
  - po-provocation
  - practitioner-hat
  - reviewer2-hat
  - theorist-hat
  - time-machine
  strategies:
  - constraint-driven-ideation
  - role-based-ideation
  - six-hats-rotation
  - stakeholder-simulation
  - temporal-projection
  tactics:
  - constraint-protocol
  - creative-ideation-perspective-rotation
  - creative-ideation-provocation-generation
  - evaluation-filtering
---

# Perspective Forcing

Discover hidden solutions by systematically switching viewpoints via roles, six hats, temporal projection, and constraint injection.

## Strategy Routing

| Strategy | Signal Keywords |
|----------|----------------|
| role-based-ideation | role-play, reviewer, practitioner, theorist, novice, competitor, persona |
| six-hats-rotation | six hats, de Bono, white hat, red hat, black hat, yellow hat, green hat, blue hat |
| temporal-projection | future, past, 5 years, 50 years, backcast, time horizon, temporal |
| stakeholder-simulation | stakeholder, user, engineer, investor, regulator, society, multi-perspective |
| constraint-driven-ideation | constraint, extreme limitation, force innovation, impossible, restriction |

## Manifest

### Strategies

| Strategy | Description |
|----------|-------------|
| role-based-ideation | Role-play as reviewer/practitioner/theorist/novice/competitor |
| six-hats-rotation | Complete Six Hats rotation (White→Red→Black→Yellow→Green→Blue) |
| temporal-projection | View problem from 5yr/50yr/500yr future, backcast |
| stakeholder-simulation | Simulate user/engineer/investor/regulator/society perspectives |
| constraint-driven-ideation | Inject extreme constraints to force innovation |

### Tactics

| Tactic | Description |
|--------|-------------|
| evaluation-filtering | Filter and rank ideas by novelty and feasibility (shared) |
| constraint-protocol | Inject constraints → force response → extract transferable principles |
| perspective-rotation | Rotate through reviewer/practitioner/theorist/time-machine/novice perspectives |

### SOPs

| SOP | Description |
|-----|-------------|
| reviewer2-hat | Hostile reviewer perspective: find fatal flaws |
| practitioner-hat | Engineer perspective: assess buildability |
| theorist-hat | Theorist perspective: assess theoretical foundations |
| time-machine | Temporal projection: view from future/past |
| novice-perspective | Novice perspective: question the 'obvious' |
| competitor-simulation | Competitor perspective: how to defeat this solution |
| constraint-response | Generate creative solutions under extreme constraints |
| perspective-synthesis | Synthesize all perspective outputs |

## Budget Table

| Strategy | web-search | web-research | paper-overview | paper-search | paper-research |
|----------|-----------|-------------|---------------|-------------|---------------|
| role-based-ideation | 20 | 5 | 20 | 12 | 5 |
| six-hats-rotation | 15 | 5 | 15 | 10 | 3 |
| temporal-projection | 20 | 8 | 20 | 12 | 5 |
| stakeholder-simulation | 25 | 10 | 20 | 12 | 5 |
| constraint-driven-ideation | 20 | 8 | 20 | 12 | 5 |

## MCP Tools

| Tool | Server | Purpose |
|------|--------|---------|
| brave_web_search | brave-search | General web search for perspective methods |
| brave_llm_context | brave-search | Deep content extraction from web pages |
| apify/rag-web-browser | apify | Full page scraping for detailed content |
| get_paper_content | alphaxiv | Read academic paper content |
| discover_papers | alphaxiv | Find relevant research papers |
| relevanceSearch | semantic-scholar | Search academic literature |
| paper | semantic-scholar | Get paper details |
| citations | semantic-scholar | Trace citation networks |

## Context Management

- Each strategy tracks its own budget via State Ledger
- Strategies MUST NOT exceed allocated budget
- Campaign monitors cumulative spend across all strategies
- If a strategy exhausts budget before meeting yield, escalate to campaign level for reallocation
- Prefer paper-overview over paper-research for initial exploration (lower cost)
- Perspective diversity is a campaign-level constraint: strategies should not overlap viewpoints

## Available Tactics

| Tactic | Role |
|--------|------|
| evaluation-filtering | Filter and rank ideas by novelty and feasibility (shared) |
| constraint-protocol | Inject constraints → force response → extract transferable principles |
| perspective-rotation | Rotate through multiple expert/temporal/novice perspectives |

## Available SOPs

| SOP | Role |
|-----|------|
| reviewer2-hat | Hostile reviewer: find fatal flaws |
| practitioner-hat | Engineer: assess buildability |
| theorist-hat | Theorist: assess theoretical foundations |
| time-machine | Temporal projection from future/past |
| novice-perspective | Novice: question the obvious |
| competitor-simulation | Competitor: how to defeat this solution |
| constraint-response | Generate solutions under extreme constraints |
| perspective-synthesis | Synthesize all perspective outputs into report |

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| constraint-driven-ideation | Inject extreme constraints to force innovation — impossibility breeds creativity. |
| role-based-ideation | Role-play as reviewer/practitioner/theorist/novice/competitor to generate diverse perspectives on a solution. |
| six-hats-rotation | Complete Six Hats rotation (White→Red→Black→Yellow→Green→Blue) to force systematic perspective diversity. |
| stakeholder-simulation | Simulate user/engineer/investor/regulator/society perspectives to surface hidden requirements and opportunities. |
| temporal-projection | View problem from 5yr/50yr/500yr future, backcast to generate temporally-informed creative solutions. |

## Available Tactics

Optional, no fixed order; the final leaf is always a sop.

| Tactic | When to use |
| --- | --- |
| constraint-protocol | Inject constraints → force creative response → extract transferable principles. Orchestrates constraint injection, response generation, and principle extraction. |
| creative-ideation-perspective-rotation | Rotate through reviewer/practitioner/theorist/time-machine/novice perspectives systematically. Ensures comprehensive viewpoint coverage. |
| creative-ideation-provocation-generation | Generate PO provocations and extract constructive movement. Orchestrates assumption surfacing → provocation creation → movement extraction → idea formation. |
| evaluation-filtering | Multi-dimensional evaluation and tiered filtering of generated ideas. Orchestrates novelty assessment → feasibility check → ranking → selection. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| competitor-simulation | Competitor perspective — design strategies to defeat this solution, then use attack vectors to improve it. |
| constraint-injection | Inject artificial constraints to force creative divergence. Generates and applies constraints (resource, time, material, audience, scale) to existing ideas to produce variants. |
| constraint-response | Generate creative solutions under extreme constraints — no "impossible" allowed, find a way. |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| creative-ideation-assumption-surfacing | Enumerate implicit assumptions in a problem statement or existing solution. Produces categorized assumption inventory (physical, social, temporal, economic, technical). |
| creative-ideation-novelty-scoring | Score ideas on novelty dimensions — structural distance from known solutions, conceptual surprise, domain-crossing depth. Produces ranked novelty assessment. |
| creative-ideation-saturation-detection | Determine when additional ideation yields diminishing returns. Analyzes latest idea batch against existing corpus to judge continue/near-saturation/saturated. |
| idea-synthesis | Synthesize diverse ideas into coherent solution concepts. Combines fragments from multiple ideation passes into structured, actionable ideas with clear mechanism descriptions. |
| novice-perspective | Novice perspective — question the 'obvious' by adopting deliberate ignorance to reveal hidden complexity. |
| perspective-synthesis | Synthesize all perspective outputs into a structured multi-perspective idea report. |
| po-provocation | Generate PO (Provocative Operation) statements per de Bono's lateral thinking. Creates deliberately illogical provocations to escape dominant thinking patterns. |
| practitioner-hat | Engineer perspective — assess buildability, cost, timeline, and integration challenges. |
| reviewer2-hat | Hostile reviewer perspective — find fatal flaws, logical gaps, and missing evidence in a solution. |
| theorist-hat | Theorist perspective — assess theoretical foundations, formal rigor, and formalization opportunities. |
| time-machine | Temporal projection — view a solution from future/past time horizons to generate temporally-informed insights. |

<!-- END available-tables (generated) -->
