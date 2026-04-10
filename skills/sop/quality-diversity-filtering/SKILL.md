---
name: Quality-Diversity Filtering
description: MAP-Elites style filter that retains the best idea per gap×method-type niche to maximize coverage
type: sop
layer: sop
agent: dare-agents
tools: [quality_diversity_filter]
input: ideas (Idea[] JSON), gaps (Gap[] JSON)
output: QdFilterResult — filteredIdeas[], removedCount, nicheMap, reasoning
---

# Quality-Diversity Filtering SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `quality_diversity_filter`
- **Called by**: review tactic (P1), idea-generation tactic (P2)
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive `ideas` (Idea[] JSON) and `gaps` (Gap[] JSON) from calling tactic
2. Call `quality_diversity_filter({ ideas, gaps })` via dare-agents
3. Parse response into QdFilterResult
4. Return filtered set to calling tactic; removed ideas are not passed forward

## Key Behavior
- **Niche definition**: each niche = one gap × one method-type (e.g., gap-3 × contrastive-learning)
- **Selection rule**: within each niche, keep only the highest-quality idea; discard the rest
- **Goal**: prevent a single approach from dominating; ensure coverage across both gaps and methods
- Mirrors MAP-Elites quality-diversity algorithm: quality = score, diversity = niche occupancy

## Output Schema
- `filteredIdeas[]` — surviving ideas after niche-best selection, one per occupied niche
- `removedCount` — number of ideas eliminated as niche duplicates
- `nicheMap` — mapping of niche key (gapId + methodType) to the winning idea ID in that niche
- `reasoning` — explanation of key selection decisions, especially contested niches
