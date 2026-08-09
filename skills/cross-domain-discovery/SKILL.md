---
name: cross-domain-discovery
description: Cross-Domain Discovery Campaign — find transferable mechanisms from unrelated
  fields via bisociation, analogical transfer, random stimulus, and forced bridging
execution: campaign
dependencies:
  sops:
  - abstraction-extraction
  - analogy-quality-assessment
  - bisociation-network-construction
  - context-checkpoint
  - context-init
  - creative-ideation-novelty-scoring
  - creative-ideation-saturation-detection
  - cross-domain-synthesis
  - domain-scanning
  - forced-connection
  - idea-synthesis
  - random-paper-entry
  - random-word-stimulus
  - structural-mapping
  - transfer-adaptation
  strategies:
  - analogical-transfer
  - design-by-analogy
  - facet-bisociation
  - forced-bridge-construction
  - random-stimulus-entry
  tactics:
  - analogy-extraction
  - bridge-validation
  - creative-ideation-provocation-generation
  - domain-divergence
  - evaluation-filtering
---

# Cross-Domain Discovery

Find transferable mechanisms from unrelated fields via bisociation, analogical transfer, random stimulus, and forced bridging.

## Strategy Routing

| Strategy | Signal Keywords |
|----------|----------------|
| facet-bisociation | bisociation, two matrices, Koestler, collision, unrelated frames |
| analogical-transfer | analogy, structure-mapping, Gentner, source domain, relational similarity |
| random-stimulus-entry | random, stimulus, serendipity, unexpected entry, lateral input |
| forced-bridge-construction | force connection, bridge, unrelated technologies, deliberate link |
| design-by-analogy | DBA, problem reframe, analogical design, bio-inspired, nature-inspired |

## Manifest

### Strategies

| Strategy | Description |
|----------|-------------|
| facet-bisociation | Bridge two unrelated thinking matrices via Koestler bisociation |
| analogical-transfer | Systematic structure-mapping from source to target domain (Gentner) |
| random-stimulus-entry | Random word/paper/concept as thinking entry point |
| forced-bridge-construction | Force connections between unrelated technologies |
| design-by-analogy | Complete DBA process: problem reframe → source search → map → transfer → adapt |

### Tactics

| Tactic | Description |
|--------|-------------|
| analogy-extraction | Extract transferable structural principles from source domains (shared) |
| domain-divergence | Scan and select maximally diverse source domains |
| bridge-validation | Validate analogy depth and transfer viability |

### SOPs

| SOP | Description |
|-----|-------------|
| abstraction-extraction | Extract abstract principles from concrete domain cases |
| structural-mapping | Map source→target structural correspondences |
| random-paper-entry | Select random paper facet as creative stimulus |
| forced-connection | Force connection between two unrelated concepts |
| transfer-adaptation | Adapt transferred principle to target problem constraints |
| analogy-quality-assessment | Assess analogy depth (surface/structural/systemic) |
| bisociation-network-construction | Build multi-domain bridging concept network |
| cross-domain-synthesis | Synthesize all cross-domain findings |

## Budget Table

| Strategy | web-search | web-research | paper-overview | paper-search | paper-research |
|----------|-----------|-------------|---------------|-------------|---------------|
| facet-bisociation | 30 | 10 | 25 | 15 | 5 |
| analogical-transfer | 25 | 10 | 30 | 20 | 8 |
| random-stimulus-entry | 20 | 5 | 15 | 10 | 3 |
| forced-bridge-construction | 25 | 8 | 20 | 12 | 5 |
| design-by-analogy | 30 | 10 | 30 | 20 | 10 |

## MCP Tools

| Tool | Server | Purpose |
|------|--------|---------|
| brave_web_search | brave-search | General web search for cross-domain solutions |
| brave_llm_context | brave-search | Deep content extraction from web pages |
| apify/rag-web-browser | apify | Full page scraping for detailed content |
| get_paper_content | alphaxiv | Read academic paper content |
| discover_papers | alphaxiv | Find research papers in distant domains |
| relevanceSearch | semantic-scholar | Search academic literature across fields |
| paper | semantic-scholar | Get paper details |
| citations | semantic-scholar | Trace citation networks across domains |

## Context Management

- Each strategy tracks its own budget via State Ledger
- Strategies MUST NOT exceed allocated budget
- Campaign monitors cumulative spend across all strategies
- If a strategy exhausts budget before meeting yield, escalate to campaign level for reallocation
- Prefer paper-overview over paper-research for initial exploration (lower cost)
- Domain diversity is a campaign-level constraint: strategies should not overlap source domains

## Available Tactics

| Tactic | Role |
|--------|------|
| analogy-extraction | Extract transferable structural principles (shared, from campaign 2) |
| domain-divergence | Ensure source domain diversity and maximize transfer potential |
| bridge-validation | Validate analogy depth before committing to transfer |

## Available SOPs

| SOP | Role |
|-----|------|
| abstraction-extraction | Extract abstract principles from concrete cases |
| structural-mapping | Map source→target structural correspondences |
| random-paper-entry | Random paper facet as creative stimulus |
| forced-connection | Force connection between unrelated concepts |
| transfer-adaptation | Adapt transferred principle to target constraints |
| analogy-quality-assessment | Assess analogy depth and transfer risk |
| bisociation-network-construction | Build multi-domain bridging network |
| cross-domain-synthesis | Synthesize all cross-domain findings into report |

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| analogical-transfer | Systematic structure-mapping from source to target domain (Gentner). Identify relational correspondences and transfer higher-order constraints. |
| design-by-analogy | Complete DBA process: problem reframe → source search → map → transfer → adapt. Full Design-by-Analogy methodology for systematic analogical design. |
| facet-bisociation | Bridge two unrelated thinking matrices via Koestler bisociation. Identify independent frames of reference and force collision to produce creative insight. |
| forced-bridge-construction | Force connections between unrelated technologies. Deliberately construct bridges where none naturally exist to discover novel integration possibilities. |
| random-stimulus-entry | Random word/paper/concept as thinking entry point. Use genuine randomness to escape fixation and open unexpected solution paths. |

## Available Tactics

Optional, no fixed order; the final leaf is always a sop.

| Tactic | When to use |
| --- | --- |
| analogy-extraction | Extract transferable structural principles from source domains. Orchestrates source identification → abstraction → structural mapping → transfer validation. |
| bridge-validation | Validate analogy depth and transfer viability. Ensures only deep structural analogies (not surface-level similarities) proceed to transfer. |
| creative-ideation-provocation-generation | Generate PO provocations and extract constructive movement. Orchestrates assumption surfacing → provocation creation → movement extraction → idea formation. |
| domain-divergence | Scan and select maximally diverse source domains. Ensures creative search covers genuinely unrelated fields with high transfer potential. |
| evaluation-filtering | Multi-dimensional evaluation and tiered filtering of generated ideas. Orchestrates novelty assessment → feasibility check → ranking → selection. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| abstraction-extraction | Extract abstract principles from concrete domain cases. Strips domain-specific details to reveal transferable mechanisms. |
| analogy-quality-assessment | Assess analogy depth (surface/structural/systemic). Determines whether an analogy warrants transfer investment. |
| bisociation-network-construction | Build multi-domain bridging concept network. Creates a network of collision points between multiple thinking matrices. |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| creative-ideation-novelty-scoring | Score ideas on novelty dimensions — structural distance from known solutions, conceptual surprise, domain-crossing depth. Produces ranked novelty assessment. |
| creative-ideation-saturation-detection | Determine when additional ideation yields diminishing returns. Analyzes latest idea batch against existing corpus to judge continue/near-saturation/saturated. |
| cross-domain-synthesis | Synthesize all cross-domain findings into a structured idea report. Integrates outputs from all strategies and SOPs. |
| domain-scanning | Scan distant domains for transferable principles. Uses web-search and paper-overview to identify analogous solutions in unrelated fields. |
| forced-connection | Force connection between two unrelated concepts. Deliberately construct bridging paths where no natural connection exists. |
| idea-synthesis | Synthesize diverse ideas into coherent solution concepts. Combines fragments from multiple ideation passes into structured, actionable ideas with clear mechanism descriptions. |
| random-paper-entry | Select random paper facet as creative stimulus. Uses genuine randomness in paper selection to break domain fixation. |
| random-word-stimulus | Use random word/concept injection as creative stimulus. Selects random concepts and forces connection to the problem space, generating unexpected solution paths. |
| structural-mapping | Map source→target structural correspondences. Identifies corresponding, missing, and extra elements between domains. |
| transfer-adaptation | Adapt transferred principle to target problem constraints. Produces concrete adapted solutions from abstract principles. |

<!-- END available-tables (generated) -->
