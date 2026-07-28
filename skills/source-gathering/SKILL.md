---
name: source-gathering
description: SOP for gathering source material relevant to the ontology domain — fetch
  papers and web pages into source pages.
execution: sop
tools:
  apify:
  - xquik/x-tweet-scraper
  - xquik/x-follower-scraper
dependencies:
  sops:
  - wiki-ingest-source
---

# Source Gathering

Gather source material (papers, web pages) relevant to the ontology domain and ingest as source pages.

## Tool

`wiki-ingest-source` (SOP) + web/paper search tools

For public X sources, read `references/xquik-apify-x-research.md` before choosing an Actor.

## Protocol

1. Search for relevant sources using brave-search, apify, semantic-scholar.
2. Use the X Actor route only when public X evidence supports the question.
3. For each relevant source, call wiki-ingest-source SOP to create a source page.
4. Return the list of ingested source paths.

## HARD-GATE

<HARD-GATE>
Must ingest ≥2 source pages per invocation.
</HARD-GATE>

## Yield

Returns: `{ sources_ingested: number, paths: string[] }`

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| wiki-ingest-source | SOP for source page creation — write immutable source page capturing raw material, then update search index. |

<!-- END available-tables (generated) -->
