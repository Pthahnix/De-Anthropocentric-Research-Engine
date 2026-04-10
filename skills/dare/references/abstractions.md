# DARE Layer Abstractions

## Four-Layer Hierarchy

```
/dare (meta-strategy)
  └── intake, lit-survey, round (strategies)
       └── academic-research, web-research (tactics)
            └── 18 SOPs (leaf operations)
                 └── MCP tools (dare-agents, dare-scholar, dare-web, apify, brave-search)
```

## Layer Definitions

| Layer | Responsibility | Calls | Example |
|-------|---------------|-------|---------|
| **Meta-Strategy** | Pipeline orchestration, user interaction, phase management | Strategies only | /dare |
| **Strategy** | Multi-iteration loops, state management, stopping conditions | Tactics + other strategies | lit-survey, round |
| **Tactic** | Single-iteration orchestration, SOP sequencing | SOPs only | academic-research |
| **SOP** | Atomic operation wrapper, single MCP tool or fixed tool sequence | MCP tools directly | facet-extraction, acd-searching |

## Strict Rules

1. **No layer skipping**: A strategy MUST NOT call an SOP or MCP tool directly. It calls tactics.
2. **No upward calls**: An SOP never calls a tactic or strategy.
3. **Tactics are stateless per-call**: They receive state, process, return results. No persistent state.
4. **Strategies own iteration**: Loops, gap tracking, stopping conditions live in strategies.
5. **SOPs are deterministic**: Given the same input, an SOP should produce the same tool call sequence.

## P0 Inventory

### SOPs (18)
| Category | SOPs |
|----------|------|
| Paper Processing | facet-extraction, digest-extraction, paper-rating |
| Search Pipelines | acd-searching, web-searching |
| Debate | self-review-quick, debate-gap, debate-idea, debate-experiment-design, debate-experiment-result |
| Scholar Wrappers | scholar-search, scholar-enrich, scholar-fetch, scholar-read, scholar-reference |
| Web Wrappers | web-discover, web-fetch, web-read |

### Tactics (2)
- academic-research: search → read → extract → rate
- web-research: search → fetch → summarize

### Strategies (3)
- intake: topic → research brief
- lit-survey: iterative search loop (10/3 iterations)
- round: survey + gap-analysis(stub) + idea-gen(stub) + review(stub)

### Meta-Strategy (1)
- /dare: brainstorming → intake → research loop → experiment(stub)
