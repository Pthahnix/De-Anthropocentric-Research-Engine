---
name: Web Read
description: Read cached web page markdown
type: sop
layer: sop
agent: dare-web
tools: [web_content]
input: url (original URL) or normalizedUrl (cache key)
output: string — full markdown content of the cached page
---

# Web Read SOP

## Layer Rules
- **Agent**: dare-web MCP tool `web_content`
- **Called by**: academic-research or web-research tactic
- **Never calls**: other SOPs (leaf node — direct MCP tool wrapper)

## Procedure
1. Receive `url` or `normalizedUrl` from calling tactic
2. Call `web_content({ url })` via dare-web
3. Return markdown string to calling tactic (local only, no network — must web_fetch first)
