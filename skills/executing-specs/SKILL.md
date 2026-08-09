---
name: executing-specs
description: Execute a Research Spec step by step, respecting context protocol, deviation
  limits, and backtrack rules. Supports multi-session recovery.
execution: sequential
---

# Executing Specs

You are executing a Research Spec produced by `writing-specs`. Your job is to follow the spec stage by stage, invoking the named campaigns and strategies, while strictly respecting the context protocol and execution rules.

## Entry

The user provides a path to a spec file (e.g., `docs/de-anthropocentric/specs/2026-05-20-topic-spec.md`). Read it in full before starting.

## Critical Review

Before executing, scan the spec for:
- Ambiguous completion criteria
- Missing expected inputs for early stages
- Unrealistic scope

If concerns exist, present them to the user before proceeding. Do NOT silently start execution with known issues.

## Execution Loop

For each Stage in the spec (in order):

### 1. Verify Expected Input
Read the context files referenced in "Expected Input". If they don't exist or are incomplete, STOP and ask the user.

### 2. Context Init
Invoke `context-init`. CC names the file: `YYYY-MM-DD-HH-MM-<topic-slug>`

### 3. Execute Strategies
For each strategy listed in "Execution Steps":
- Invoke the named skill
- Focus on the areas specified in "Focus Areas"
- Use prior context as described in "Expected Input"
- After each strategy completes: invoke `context-checkpoint`

### 4. Campaign End Checkpoint
After all strategies in the Stage complete, invoke one final `context-checkpoint` as a safety net.

### 5. Verify Completion Criteria
Check whether the Stage's completion criteria are met:
- If YES: mark all steps `[x]` in the spec file, proceed to next Stage
- If NO: document what was achieved vs expected, present gap to user, let user decide

### 6. Evaluate Backtrack Conditions
Check the Stage's backtrack condition:
- If triggered: present Question box to user (approve backtrack / continue / other)
- If not triggered: proceed to next Stage

## Session Recovery

When entering a new session to continue execution:
1. Read the spec file — find first unchecked `[ ]` step
2. Read `context/INDEX.md` — identify the latest context file
3. Read the latest context-checkpoint content — restore working memory
4. Resume from the first unchecked step

No special "resume" command needed. The spec's checkbox state IS the progress tracker.

## Deviation Rules (±10%)

You have limited autonomy to adjust within bounds:

**Allowed:**
- Substitute 1 strategy within a Stage (if Stage has ≥3 strategies)
- Add 1 extra tactic/SOP call within a strategy
- Reorder steps within a Stage
- Spend more time on a step that needs it

**NOT Allowed:**
- Skip an entire Stage
- Add a new Stage
- Reorder Stages
- Abandon a step without meeting criteria

**Documentation requirement:** Every deviation must be recorded in the next context-checkpoint:
```
## Deviation from Spec
**Stage**: N
**Prescribed**: [what spec said]
**Actual**: [what you did]
**Rationale**: [why]
```

## Backtrack Protocol

When a backtrack condition evaluates to true:

1. Present a Question box:
   "Backtrack condition triggered: [condition text].
    Recommendation: Return to Stage N ([campaign name]).
    Options: (A) Approve backtrack (B) Continue forward (C) Other"
2. If (A): create new context-init for target Stage, resume from there
3. If (B): continue forward, document override in checkpoint
4. If (C): follow user's alternative direction

## Final Output

When all Stages are complete, compile the research results into a summary:
- Reference all context files produced
- Highlight key findings from each Stage
- Present the final Research Design (the experiment-design output)

Inform the user: "Research spec execution complete. All context files are in `context/`."
