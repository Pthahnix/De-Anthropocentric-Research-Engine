# DARE v3 P0 — E2E Integration Tests

These tests verify the full tool chain works end-to-end with real MCP server connections.
They are run manually via CC (Claude Code) subagents, not via vitest.

## Prerequisites
- dare-agents MCP server running (configured in `.mcp.json`)
- dare-scholar MCP server running
- dare-web MCP server running
- apify MCP server running
- brave-search MCP server running

## Test 1: Paper Processing Pipeline

**Goal**: Verify facet_extract + digest_extract + paper_rate work end-to-end.

**Procedure**:
1. Fetch a real paper via dare-scholar `paper_fetching` (e.g., "Attention Is All You Need")
2. Call dare-agents `digest_extract` on the paper markdown
3. Call dare-agents `facet_extract` on the digest
4. Call dare-agents `paper_rate` on the digest vs topic "transformer architectures"

**Expected**:
- Digest has pass1 with category, mainContribution, relevance
- Facets are non-empty array with purpose, mechanism, evaluation fields
- Rating has relevance, quality, novelty scores (0-10)

## Test 2: Self-Review

**Goal**: Verify self_review works on a generated gap artifact.

**Procedure**:
1. Create a gap artifact from facet extraction output (e.g., "No evaluation on low-resource languages")
2. Call dare-agents `self_review` with the gap + artifactType='gap'

**Expected**:
- Verdict is one of: ACCEPT, REJECT, REVISE
- Reasoning is non-empty
- Confidence is between 0 and 1

## Test 3: Academic Research Tactic (1 iteration)

**Goal**: Verify the academic-research tactic flow with real tools.

**Procedure**:
1. Follow skills/tactic/academic-research/SKILL.md with 1 query: "efficient attention mechanisms"
2. Call acd-searching SOP (google-scholar → paper_searching → paper_fetching)
3. For top 2 papers: digest_extract → facet_extract → paper_rate

**Expected**:
- At least 1 paper found and fetched
- Digest generated with 3-pass structure
- Facets extracted with non-empty fields
- Rating assigned with scores

## Running Tests

These tests require live MCP server connections and cost API credits.
Run them manually in a CC session:

```bash
# Verify dare-agents server starts
npx --prefix D:/DARE/packages/agents tsx D:/DARE/packages/agents/src/server.ts
```

Then in CC, test each tool individually before running the full tactic flow.
