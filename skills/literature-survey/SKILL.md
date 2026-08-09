---
name: literature-survey
description: Autonomous Literature Survey Campaign — 5 research paradigms (scoping,
  systematic, deep, narrative, snowball) with quantitative budget enforcement. Selects
  and executes the right survey paradigm based on research intent.
execution: campaign
dependencies:
  strategies:
  - deep-survey
  - narrative-review
  - scoping-survey
  - snowball
  - systematic-survey
  sops:
  - context-checkpoint
  - context-init
---

# Literature Survey

Autonomous literature survey engine. Five research paradigms, each a self-contained playbook with quantitative budget enforcement. You provide a research question — it searches, screens, reads, categorizes, identifies gaps, and produces a structured survey output.

## Strategy Routing

| Signal | Strategy |
|--------|----------|
| panoramic mapping of a new field, broad overview, field mapping | → scoping-survey |
| exhaustive coverage, PRISMA, systematic review | → systematic-survey |
| precise sub-question, specific mechanism, deep dive | → deep-survey |
| theory-driven, argument building, narrative | → narrative-review |
| seed papers, citation chain, lineage tracing | → snowball |

## Manifest

### Strategies (5)
- scoping-survey
- systematic-survey
- deep-survey
- narrative-review
- snowball

### Tactics (3)
- prisma-screening
- citation-chaining (shared: patent-mining, baseline-establishment)
- narrative-framing

### Subagent SOPs (11)
- survey-synthesis
- define-search-protocol
- categorize-papers (shared: meta-analysis, baseline-establishment)
- extract-data
- quality-assessment
- seed-selection
- saturation-detection (shared: patent-mining, benchmark-archaeology)
- taxonomy-mapping
- prisma-flowchart
- thematic-coding
- gap-identification (shared: benchmark-archaeology, baseline-establishment)

### Import SOPs (5, shared across all campaigns)
- web-search
- web-research
- paper-overview
- paper-search
- paper-research

## Budget Table

| Strategy | web-search | web-research | paper-overview | paper-search | paper-research |
|----------|-----------|-------------|---------------|-------------|---------------|
| scoping-survey | 100 | 10 | 100 | 20 | 0 |
| systematic-survey | 50 | 5 | 60 | 40 | 30 |
| deep-survey | 30 | 5 | 40 | 40 | 20 |
| narrative-review | 80 | 15 | 50 | 40 | 20 |
| snowball | 20 | 3 | 30 | 30 | 20 |

All values ±10% flexibility. Deviations require explicit reasoning.

## MCP Tools

| MCP Server | Tools |
|------------|-------|
| brave-search | brave_web_search, brave_news_search, brave_llm_context |
| apify | rag-web-browser, google-scholar-scraper |
| alphaxiv | discover_papers, get_paper_content, answer_pdf_queries, read_files_from_github_repository |
| semantic-scholar | ss_paper, ss_paper_batch, ss_references, ss_citations, ss_recommendations, ss_relevance_search, ss_author, ss_author_papers |

## Context Management

- Campaign start: context-init
- After each strategy completes: context-checkpoint (append to literature-survey context file)

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| deep-survey | Precise, targeted investigation of a specific sub-problem — few papers, all read in full depth. High paper-research ratio (50% deep-read rate). Use when the user knows exactly what they need to understand and requires detailed technical analysis with equations, hyperparameters, and specific claims extracted. |
| narrative-review | Theory-driven literature review for building arguments and frameworks. Flexible, subjective, and narrative-focused — selects evidence strategically to support a thesis. High web-research budget for blogs, opinion pieces, and industry perspectives. Use when the user is writing a position paper, survey introduction, or constructing a coherent narrative around a research theme. |
| scoping-survey | Broad landscape mapping strategy — quickly understand what exists in a field. Prioritizes breadth over depth with high paper-overview volume and minimal deep reading. Use when entering a new field or needing orientation before committing to deeper investigation. |
| snowball | Citation-chain-driven literature survey starting from seed papers. Traces research lineage in both forward (who cited this) and backward (what this cited) directions until saturation. High deep-read ratio (67%). Use when the user already has key papers and wants to find everything connected to them — ancestors, descendants, and branch points. |
| systematic-survey | Exhaustive PRISMA-style literature survey — comprehensive coverage of all related work on a specific question. Multi-stage screening, citation chaining, quality assessment, and structured data extraction. Use when the user needs to demonstrate complete literature coverage or conduct rigorous gap analysis. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |

<!-- END available-tables (generated) -->
