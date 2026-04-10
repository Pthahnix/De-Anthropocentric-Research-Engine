---
name: Intake
description: Transform a user's research topic into a structured research brief with initial queries
type: strategy
layer: strategy
calls: [web-research]
input: userTopic (free-text description of research interest)
output: ResearchBrief — structured topic, initial queries, scope constraints
---

# Intake Strategy

## Layer Rules
- **Layer**: strategy — orchestrates tactics, NEVER calls SOPs or tools directly
- **Called by**: /dare meta-strategy only
- **Calls**: web-research tactic (for initial landscape scan)

## Procedure
1. Parse user's free-text topic into structured components:
   - **domain**: primary research area (e.g., "protein folding", "multimodal learning")
   - **focus**: specific angle or sub-problem
   - **constraints**: time frame, methodology preferences, scope limits
2. Call **web-research tactic** with 3 broad queries to scan the landscape:
   - `"<domain> survey 2025 2026"`
   - `"<domain> <focus> recent advances"`
   - `"<domain> open problems challenges"`
3. From web results, identify:
   - Key terminology and jargon for the field
   - Major conferences and venues
   - Leading research groups
4. Generate initial academic search queries (6-10 queries)
5. Output ResearchBrief:

```json
{
  "domain": "...",
  "focus": "...",
  "constraints": {...},
  "initialQueries": ["query1", "query2", ...],
  "fieldContext": "Brief summary of current landscape",
  "keyTerms": ["term1", "term2", ...]
}
```
