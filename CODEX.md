# Codex Delegation Rules

When running inside Claude Code, you have access to Codex CLI (`codex exec`) as an execution engine.
Use it to offload implementation-heavy tasks while you focus on planning, review, and orchestration.

## When to Delegate

Delegate to Codex when the task matches ANY of these criteria:

- **Multi-file implementation**: 3+ files need creation or modification
- **Test-driven loops**: writing tests, running them, fixing until green
- **Boilerplate-heavy work**: scaffolding, repetitive refactoring, migration scripts
- **Security audit**: static analysis or OWASP vulnerability scanning
- **Second opinion**: you want cross-model verification of your own plan or code

Do NOT delegate:

- Brainstorming, architecture design, or research planning
- DARE skill orchestration (meta-strategy, strategy, tactic, SOP)
- Tasks requiring MCP tool calls (dare-agents, dare-scholar, dare-web)
- Short edits (single file, under 50 lines)

## How to Delegate

### Standard Implementation

```bash
codex exec "<task description>" --full-auto -s workspace-write -m gpt-5.4
```

### Read-Only Review or Audit

```bash
codex exec "<review prompt>" --full-auto -s read-only -m gpt-5.4
```

### With File Context

```bash
codex exec "Implement the plan described in docs/plan.md for the src/auth/ module" --full-auto -s workspace-write
```

## Post-Delegation Workflow

After every Codex delegation, you MUST:

1. **Read the output** -- check stdout/stderr for errors or warnings
2. **Review changed files** -- read each modified file and verify correctness
3. **Run tests** -- ensure all existing tests still pass
4. **Fix issues yourself** -- do not re-delegate minor fixes back to Codex

## Prompt Guidelines

When writing the task description for `codex exec`:

- Be specific: include file paths, function names, expected behavior
- Reference existing docs: point to plan files or spec files by path
- State constraints: "do not modify files outside src/auth/", "preserve existing tests"
- Keep it self-contained: Codex starts with no conversation context

## Cross-Review Pattern

For high-stakes changes, use Codex as a reviewer after your own implementation:

```bash
codex exec "Review the changes in src/ for bugs, security issues, and edge cases. Report findings only, do not modify files." --full-auto -s read-only
```

Conversely, after Codex implements something, review it yourself before committing.
