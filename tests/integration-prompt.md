# Integration Test Prompt

> Copy this prompt into a Claude Code session with this repo as the working directory.
> All checks should pass. If any fail, investigate and fix before shipping.

---

## Pre-flight

You are verifying the de-anthropocentric-research-engine v3.0.0 distribution. Run each check below and report PASS/FAIL with details.

---

## Check 1: Directory Structure

Verify these paths exist:

```
skills/de-anthropocentric-research-engine/SKILL.md
skills/writing-specs/SKILL.md
skills/executing-specs/SKILL.md
skills/spec-self-review/SKILL.md
skills/scope-clarification/SKILL.md
skills/campaign-selection/SKILL.md
skills/constraint-elicitation/SKILL.md
skills/research-catalog/SKILL.md
skills/research-catalog/skill-index.md
AGENTS.md
context/INDEX.md
mcp.example.json
package.json
package-lock.json
```

Expected: All present.

Also verify that `AGENTS.md`:
- Contains exactly one `BEGIN DARE RESEARCH ENGINE` managed block
- Directs Codex to use `.dare/skills/` first and `skills/` in the source repository
- Directs Codex to read the DARE orchestrator and research catalog before routing
- Does not depend on a `.agents/skills` adapter or `$dare-research-engine` invocation

---

## Check 2: Skill Count

Count directories under `skills/`. Expected: ≥ 770 (762 copied + 8 orchestrator).

---

## Check 3: Orchestrator Skill Frontmatter

For each of these 8 skills, verify SKILL.md contains valid YAML frontmatter with `name:` and `description:` fields:

- de-anthropocentric-research-engine
- writing-specs
- executing-specs
- spec-self-review
- scope-clarification
- campaign-selection
- constraint-elicitation
- research-catalog

Expected: All 8 have valid frontmatter.

---

## Check 4: Research Catalog Content

Read `skills/research-catalog/SKILL.md` and verify:
- Contains "## Campaign:" sections for all 8 campaigns (north-star-crystallization through experiment-execution)
- Contains "## Infrastructure Skills" section
- Each campaign section has non-empty content (not placeholder text)

Expected: 8 campaign sections + infrastructure section, all with real content.

---

## Check 5: Skill Index

Read `skills/research-catalog/skill-index.md` and verify:
- Has a total count ≥ 762
- Lists all 12 source repos as sections
- Each section has a table with Skill and Description columns

Expected: Complete index with all repos represented.

---

## Check 6: MCP Configuration

Verify `mcp.example.json`:
- Contains 5 MCP server entries (alphaxiv, semantic-scholar, brave-search, wiki-vault, apify)
- All API keys are placeholders (no real keys)
- alphaxiv uses `"type": "http"`
- Other 4 use `npx` command

Verify `package.json`:
- Has dependencies for: @yogsoth-ai/semantic-scholar-mcp, @yogsoth-ai/wiki-vault, @brave/brave-search-mcp-server, @apify/actors-mcp-server
- Version is 3.0.0

Expected: All MCP config correct, no leaked secrets.

---

## Check 7: No Old DARE Content

Search recursively for files containing "DARE" or "De-Anthropocentric-Research-Engine" (old casing) in filenames or content. Exclude `.git/` directory.

Expected: No old DARE artifacts remain (repo URL references in package.json are acceptable if they redirect).

---

## Check 8: Cross-Reference Consistency

Verify that skill names referenced in orchestrator skills actually exist:
- `writing-specs/SKILL.md` references: scope-clarification, campaign-selection, constraint-elicitation, spec-self-review, research-catalog
- `executing-specs/SKILL.md` references: context-init, context-checkpoint
- `de-anthropocentric-research-engine/SKILL.md` references: cold-start, warm-start, hot-start, context-init, context-checkpoint, writing-specs, executing-specs

For each referenced skill, verify a directory exists under `skills/` with that name.

Expected: All cross-references resolve to existing skill directories.

---

## Summary

Report results as:

```
Check 1 (Structure):     PASS/FAIL
Check 2 (Skill Count):   PASS/FAIL — count: N
Check 3 (Frontmatter):   PASS/FAIL
Check 4 (Catalog):       PASS/FAIL
Check 5 (Skill Index):   PASS/FAIL — total: N
Check 6 (MCP Config):    PASS/FAIL
Check 7 (No DARE):       PASS/FAIL
Check 8 (Cross-Refs):    PASS/FAIL
```

If all PASS: "Integration verification complete. Ready to push."
If any FAIL: List failures with details for investigation.
