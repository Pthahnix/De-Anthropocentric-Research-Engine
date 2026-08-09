---
name: meta-analysis
description: Cross-Study Statistical Synthesis Campaign — 5 strategies for systematic
  collection and methodological planning of multi-study evidence synthesis. Covers
  pairwise, network, cumulative meta-analysis, heterogeneity investigation, and bias
  detection. Stops at protocol design (no computation).
execution: campaign
dependencies:
  strategies:
  - bias-detection
  - cumulative-tracking
  - heterogeneity-investigation
  - network-comparison
  - pairwise-synthesis
  sops:
  - context-checkpoint
  - context-init
---

# Meta-Analysis Campaign

Cross-study statistical synthesis — systematic collection and methodological planning for multi-study evidence synthesis. This campaign orchestrates the full meta-analysis planning pipeline from PICO formulation through protocol design, stopping before computation.

## Strategy Routing

| Trigger | Strategy | When |
|---------|----------|------|
| Two-arm comparison | pairwise-synthesis | Comparing method A vs B across studies |
| Multi-method comparison | network-comparison | Comparing N>=3 methods with indirect evidence |
| Temporal evidence tracking | cumulative-tracking | Tracking how evidence evolves over time |
| Inconsistent findings | heterogeneity-investigation | Studies disagree — explain why |
| Evidence reliability | bias-detection | Assess systematic biases in evidence body |

## Manifest

### Strategies (5)

| Strategy | Purpose |
|----------|---------|
| pairwise-synthesis | Paired meta-analysis protocol for two-method comparison |
| network-comparison | Network meta-analysis for N-method simultaneous comparison |
| cumulative-tracking | Cumulative meta-analysis tracking evidence over time |
| heterogeneity-investigation | Explain inter-study variation in findings |
| bias-detection | Systematic bias assessment of evidence body |

### Tactics (3)

| Tactic | Purpose |
|--------|---------|
| effect-size-extraction | Extract effect sizes and conditions from papers |
| quality-assessment-protocol | Methodological quality and bias risk assessment |
| evidence-synthesis-planning | Plan the statistical synthesis approach |

### Subagent SOPs (10)

| SOP | Purpose |
|-----|---------|
| pico-formulation | Construct PICO/PECO framework |
| inclusion-criteria-design | Define inclusion/exclusion criteria |
| effect-size-planning | Determine effect size types and calculation methods |
| data-extraction-form | Design structured data extraction form |
| risk-of-bias-assessment | Assess methodological bias (RoB2/PROBAST/QUADAS-2) |
| heterogeneity-source-analysis | Identify and classify heterogeneity sources |
| publication-bias-assessment | Plan funnel plots, Egger's test, trim-and-fill, p-curve |
| sensitivity-analysis-design | Design leave-one-out, influence diagnostics, subgroups |
| evidence-network-construction | Build evidence network graph for NMA |
| meta-analysis-synthesis | Produce final meta-analysis protocol document |

## Budget Table

| Strategy | Studies | Effect Sizes | Web Searches |
|----------|---------|--------------|--------------|
| pairwise-synthesis | 30 | 30 | 40 |
| network-comparison | 50 | 80 | 60 |
| cumulative-tracking | 40 | 40 | 30 |
| heterogeneity-investigation | 30 | 30 | 50 |
| bias-detection | 40 | 40 | 40 |

## MCP Tools

| MCP Server | Tools |
|------------|-------|
| brave-search | brave_web_search, brave_llm_context |
| apify | rag-web-browser, google-scholar-scraper |
| alphaxiv | get_paper_content, answer_pdf_queries |
| semantic-scholar | ss_relevance_search, ss_paper, ss_references, ss_citations |

## Context Management

- **Input**: Research question, domain, candidate studies (optional)
- **State**: Strategy state ledgers track studies found, effect sizes extracted, quality assessed
- **Output**: Complete meta-analysis protocol document (PRISMA-compliant)
- **Persistence**: All intermediate outputs stored in `context/meta-analysis/` subdirectories per strategy

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| bias-detection | Assess systematic biases in the evidence body — publication bias, reporting bias, and selective outcome reporting. Budget: 40 studies, 40 effect sizes, 40 web searches. |
| cumulative-tracking | Track evidence accumulation over time — cumulative meta-analysis protocol design. Budget: 40 studies, 40 effect sizes, 30 web searches. |
| heterogeneity-investigation | Explain why different studies reach different conclusions — heterogeneity investigation protocol. Budget: 30 studies, 30 effect sizes, 50 web searches. |
| network-comparison | Compare N methods simultaneously including indirect evidence — network meta-analysis protocol design. Budget: 50 studies, 80 effect sizes, 60 web searches. |
| pairwise-synthesis | Compare two methods across multiple studies — paired meta-analysis protocol design. Budget: 30 studies, 30 effect sizes, 40 web searches. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |

<!-- END available-tables (generated) -->
