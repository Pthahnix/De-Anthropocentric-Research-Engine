---
name: Web Fetch
description: Fetch web page as markdown and cache locally
type: sop
layer: sop
agent: dare-web
tools: [web_fetching]
input: url (page URL), title (optional page title for cache labeling)
output: WebMeta — { url, markdownPath, title } with cached markdown path
---

# Web Fetch SOP

## Layer Rules
- **Agent**: dare-web MCP tool `web_fetching`
- **Called by**: academic-research or web-research tactic
- **Never calls**: other SOPs (leaf node — direct MCP tool wrapper)

## Procedure
1. Receive `url` (and optional `title`) from calling tactic
2. Call `web_fetching({ url, title })` via dare-web
3. Return WebMeta with `markdownPath` to calling tactic (cache-first: returns instantly if already cached)
