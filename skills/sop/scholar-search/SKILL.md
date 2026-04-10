---
name: Scholar Search
description: Search Google Scholar for academic papers via Apify scraper
type: sop
layer: sop
agent: apify
tools: [google-scholar-scraper]
input: keyword (search string), maxItems (number)
output: RawScholarResult[] — raw Scholar results with title, authors, year, link, snippet
---

# Scholar Search SOP

## Layer Rules
- **Agent**: apify MCP tool `google-scholar-scraper`
- **Called by**: academic-research or web-research tactic
- **Never calls**: other SOPs (leaf node — direct MCP tool wrapper)

## Procedure
1. Receive `keyword` and `maxItems` from calling tactic
2. Call `google-scholar-scraper({ keyword, maxItems, proxyOptions: { useApifyProxy: true } })` via apify
3. Return raw Scholar result array to calling tactic
