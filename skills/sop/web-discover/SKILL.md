---
name: Web Discover
description: Search the web via Brave Search API
type: sop
layer: sop
agent: brave-search
tools: [brave_web_search]
input: query (search string), count (number of results, default 10)
output: WebResult[] — array of results with title, url, description
---

# Web Discover SOP

## Layer Rules
- **Agent**: brave-search MCP tool `brave_web_search`
- **Called by**: academic-research or web-research tactic
- **Never calls**: other SOPs (leaf node — direct MCP tool wrapper)

## Procedure
1. Receive `query` and `count` from calling tactic
2. Call `brave_web_search({ query, count })` via brave-search
3. Return result array to calling tactic
