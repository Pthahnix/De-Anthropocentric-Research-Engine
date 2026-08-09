---
name: patent-mining
description: Systematic Patent Analysis Campaign — 5 strategies for patent landscape
  analysis, prior art search, white space identification, competitive intelligence,
  and claim analysis. Produces structured patent intelligence reports.
execution: campaign
dependencies:
  strategies:
  - claim-analysis
  - competitive-intelligence
  - landscape-survey
  - prior-art-search
  - white-space-analysis
  sops:
  - context-checkpoint
  - context-init
---

# Patent Mining

Systematic patent intelligence campaign. Analyzes patent landscapes, traces prior art, identifies white spaces, profiles competitor portfolios, and decomposes claim scope.

## Strategy Routing

| Signal | Strategy |
|--------|----------|
| "map the patent landscape for X" / "who are the key players in X" / "filing trends" | landscape-survey |
| "is X novel" / "find prior art for X" / "freedom to operate" | prior-art-search |
| "where are the gaps" / "uncovered areas" / "opportunity mapping" | white-space-analysis |
| "what is competitor Y doing" / "portfolio comparison" / "IP strategy" | competitive-intelligence |
| "analyze these claims" / "claim scope" / "protection breadth" | claim-analysis |

## Manifest

### Strategies (5)

| Strategy | Budget Summary |
|----------|---------------|
| landscape-survey | 200 families, 0 claim parses, 80 web searches |
| prior-art-search | 80 families, 20 claim parses, 50 web searches |
| white-space-analysis | 150 families, 10 claim parses, 60 web searches |
| competitive-intelligence | 120 families, 15 claim parses, 40 web searches |
| claim-analysis | 30 families, 30 claim parses, 20 web searches |

### Tactics (3)

| Tactic | Purpose |
|--------|---------|
| patent-family-tracing | Forward/backward citation and priority chain tracing |
| classification-navigation | IPC/CPC hierarchy drill-down and lateral expansion |
| claim-decomposition | Independent/dependent claim parsing and feature mapping |

### Subagent SOPs (11)

| SOP | Purpose |
|-----|---------|
| patent-query-formulation | Construct multi-faceted patent search strategies |
| patent-categorization | Classify patents by subdomain and value chain |
| assignee-normalization | Standardize assignee names and corporate groups |
| citation-network-analysis | Build citation graphs, compute main path and PageRank |
| trend-analysis | Filing volume time-series and S-curve lifecycle |
| white-space-mapping | Feature cross-matrix and blank area identification |
| claim-parsing | Claim syntax parsing and element extraction |
| legal-status-assessment | Determine patent legal status (active/expired/pending) |
| quality-scoring | Multi-dimensional patent quality assessment |
| patent-synthesis | Produce final structured intelligence report |
| saturation-detection | (shared) Determine when search expansion has saturated |

## Budget Table

| Strategy | Patent Families | Claim Parses | Web Searches |
|----------|----------------|--------------|--------------|
| landscape-survey | 200 | 0 | 80 |
| prior-art-search | 80 | 20 | 50 |
| white-space-analysis | 150 | 10 | 60 |
| competitive-intelligence | 120 | 15 | 40 |
| claim-analysis | 30 | 30 | 20 |

## MCP Tools

| Server | Tools Used | Purpose |
|--------|-----------|---------|
| brave-search | brave_web_search, brave_llm_context | Patent database web search, patent office queries |
| apify | google_scholar_scraper | Academic patent literature discovery |
| alphaxiv | full_text_papers_search, get_paper_content | Patent-related academic papers |
| semantic-scholar | ss_relevance_search, ss_citations, ss_references | Citation network for patent-adjacent literature |

## Context Management

- **State file**: Each strategy maintains a state ledger tracking progress against budget
- **Deduplication**: Patent families are deduplicated by priority number across strategies
- **Saturation**: Uses shared `saturation-detection` SOP to determine when citation/classification expansion has converged
- **Output**: Final deliverable is a structured patent intelligence report produced by `patent-synthesis` SOP

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| claim-analysis | Deep claim scope analysis — decompose independent/dependent claims and assess protection scope breadth. Budget: 30 patent families, 30 claim parses, 20 web searches. |
| competitive-intelligence | Analyze competitor IP portfolios — comparative patent portfolio reports with strategy inference. Budget: 120 patent families, 15 claim parses, 40 web searches. |
| landscape-survey | Patent landscape full-scan — maps technology domain via assignee ranking, IPC/CPC classification, filing trends. Budget: 200 patent families, 0 claim parses, 80 web searches. |
| prior-art-search | Evaluate novelty of specific invention — find relevant prior art across patents, publications, and products. Budget: 80 patent families, 20 claim parses, 50 web searches. |
| white-space-analysis | Identify patent coverage gaps — feature cross-matrix blank areas revealing unprotected technology combinations. Budget: 150 patent families, 10 claim parses, 60 web searches. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |

<!-- END available-tables (generated) -->
