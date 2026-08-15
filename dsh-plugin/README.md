# @yogsoth-ai/dare-dsh

DeepSeek Harness plugin for the [De-Anthropocentric Research Engine](https://github.com/yogsoth-ai/de-anthropocentric-research-engine) — 920 research skills on `ctx.skills`, with an opt-in MCP server fleet.

## Install

dsh is in developer preview and its `latest` npm tag lags behind `next`. Install the peers explicitly:

```sh
npm i @yogsoth-ai/dare-dsh \
      @deepseek-ai/dsh-skill@next \
      @deepseek-ai/dsh-skill-filesystem@next
```

The MCP fleet is optional. Add it only if you want the research servers:

```sh
npm i @deepseek-ai/dsh-mcp-client@next
```

## Use

Copy [`cordis.example.yml`](./cordis.example.yml) and run:

```sh
npx @deepseek-ai/dsh web --patch ./cordis.example.yml
```

The skill row needs no credentials. Drop the `dare-mcp` row to run skills-only.

## What you get

**Skills.** 920 research skills registered as one provider named `dare`, at bundled rank (600) — a project or user skill of the same name always wins, so this library never shadows your own. Discovery, `SKILL.md` parsing, and relative-resource resolution are delegated to `@deepseek-ai/dsh-skill-filesystem`; 385 skills reference a sibling `prompt.md` through the provider's directory resource base.

**MCP fleet.** Seven research servers, one `dsh-mcp-client` instance each. Tools arrive as `mcp__<serverName>__<rawName>`, matching the names four skills reference literally (`mcp__semantic-scholar__relevanceSearch`, `mcp__wiki-vault__vault_search`, and two more), so those skills work unmodified.

| Server | Credential | Notes |
|---|---|---|
| `alphaxiv` | — | HTTP |
| `keenable` | — | HTTP |
| `semantic-scholar` | `SS_API_KEY` | |
| `brave-search` | `BRAVE_API_KEY` | |
| `tavily-search` | `TAVILY_API_KEY` | |
| `wiki-vault` | `VAULT_ROOT` | path to your vault |
| `apify` | `APIFY_TOKEN` | |

A server missing its credential is **skipped with a warning at load**, not started empty. dsh's own default (`failOnStartupError: false`) would activate it with zero tools, leaving dependent skills silently inert with no visible cause.

Restrict the fleet with `only` or `exclude`:

```yaml
- id: dare-mcp
  name: '@yogsoth-ai/dare-dsh/mcp'
  config:
    only: ['alphaxiv', 'semantic-scholar']
```

## Catalog weight

`dsh-tool-skill` injects every model-invocable skill's name and description into a durable session catalog. All 920 are exposed, costing **~135 KB** per request while registered. Budget for it, or mount a narrower skill root of your own.

One description exceeds the consumer's 500-character cap and loses its tail in the catalog (`mechanism-gap-hunting`); its body is unaffected.

## Verification status

`npm test` runs the skill library against the real `ctx.skills` registry, the real filesystem provider, and a real Cordis context — no mocks. It asserts all 920 skills are discovered, the snapshot is complete, every skill is attributed to this provider at bundled rank, every body loads non-empty, and `prompt.md` resolves through `resourceBase`.

**Not verified:** behavior inside a live harness driving a model. That needs a DeepSeek API key, which this package's tests do not use. The registry contract is proven; the end-to-end model experience is not.

## License

Apache-2.0
