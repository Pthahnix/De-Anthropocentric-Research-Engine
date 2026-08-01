<!-- BEGIN DARE RESEARCH ENGINE -->
## DARE Research Engine

Use DARE for AI Research tasks and whenever the user explicitly asks for DARE.

1. Treat `CC` and `Claude Code` in upstream DARE documents as `Codex`.
2. Resolve the DARE skill root from the first existing path:
   - `.dare/skills/` in a project where DARE was installed
   - `skills/` in the DARE source repository
3. Read `<skill-root>/de-anthropocentric-research-engine/SKILL.md` first.
4. Read `<skill-root>/research-catalog/SKILL.md` before selecting research packages.
5. Treat YAML `dependencies` in each `SKILL.md` as the authoritative call graph.
6. When a DARE document says to invoke a skill, open `<skill-root>/<skill-name>/SKILL.md` and follow it as the operative workflow.
7. Load dependency skills only when needed; do not load the entire DARE skill tree.
8. Preserve runtime context in `context/INDEX.md` and its related context files.
9. Never write API keys or secrets into specs, context files, or committed configuration.

The DARE skill tree is an on-demand research knowledge base, not a Codex skill-discovery directory.
<!-- END DARE RESEARCH ENGINE -->
