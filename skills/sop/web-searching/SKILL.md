---
name: Web Searching
description: Execute the web search pipeline — Brave search → fetch → extract content
type: sop
layer: sop
agent: orchestration
tools: [brave_web_search, web_fetching, web_content]
input: query (search string), maxResults (number)
output: WebMeta[] with content
---

# Web Searching SOP

## Layer Rules
- **Agent**: CC orchestration (calls multiple MCP tools in sequence)
- **Called by**: web-research tactic only
- **Tool sequence**: brave_web_search → web_fetching (per result) → web_content (per result)

## Procedure
1. Receive `query` and `maxResults` from calling tactic
2. **DISCOVER**: Call `brave_web_search` with `{ query, count: maxResults }`
3. **FETCH**: For each result URL, call `web_fetching` to download and cache as markdown
4. **READ**: For each fetched page, call `web_content` to get cached markdown content
5. Return WebMeta[] with markdown content

## Error Handling
- Brave returns no results → return empty array
- web_fetching fails for a URL → skip it, continue with others
- Prefer URLs from reputable sources (arxiv.org, github.com, official docs)
