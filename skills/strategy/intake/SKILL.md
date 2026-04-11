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

## Research Budget — Intake

Intake is a fixed-budget reconnaissance phase. It does NOT scale with topic size.

| Metric | Target |
|--------|--------|
| Web pages fetched | 10 |
| Search queries | 20 |
| Key terms identified | 15+ |

These are HARD FLOORS. Do not exit intake until all targets are met.

## Layer Rules
- **Layer**: strategy — orchestrates tactics, NEVER calls SOPs or tools directly
- **Called by**: /dare meta-strategy only
- **Calls**: web-research tactic (for initial landscape scan)

## State Ledger

<HARD-GATE>
Print this table BEFORE every step of the intake workflow. Update counts after each action.
Skipping the ledger print is a protocol violation.

| Metric | Current | Target | Remaining | Status |
|--------|---------|--------|-----------|--------|
| Web pages fetched | ?? | 10 | ?? | ... |
| Queries issued | ?? | 20 | ?? | ... |
| Key terms found | ?? | 15 | ?? | ... |
| Sub-directions mapped | ?? | 5 | ?? | ... |
</HARD-GATE>

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

## Completeness Probe — Intake

<HARD-GATE>
Before producing the ResearchBrief, answer honestly:

**Terminology coverage:**
- [ ] Have I identified terms from at least 3 distinct sub-areas of this topic?
- [ ] Have I found both the canonical terms AND common synonyms/abbreviations?
- [ ] Are there research communities using different terminology for the same concept?
- [ ] Did I check for terms in adjacent fields that might be relevant?

**Sub-direction coverage:**
- [ ] Have I mapped at least 5 potential research sub-directions?
- [ ] Do the sub-directions span different methodological approaches (not just applications)?
- [ ] Is there a sub-direction I initially dismissed that deserves a second look?

If ANY checkbox fails → add 2-3 targeted queries and repeat the search step.
Maximum 2 extra completeness iterations allowed.
</HARD-GATE>
