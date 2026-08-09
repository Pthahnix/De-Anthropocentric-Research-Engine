---
name: context-checkpoint
description: Append research process and results to the current Phase's context file.
  Covers both process and results with genuine substance. Use this skill at
  plan-designated checkpoint points — typically after each strategy completes or
  at key decision nodes within a research Phase.
dependencies:
  sops:
  - context-init
---

# Context Checkpoint

Append research process and results to the current Phase's context file.

## When Called

Multiple times within a Phase, at plan-designated checkpoint points:
```
step: "import context-management:context-checkpoint"
```

Typically triggered after each strategy completes or at key decision nodes.

## Hard Constraints

1. **Content scope**: Must record both PROCESS (what was done, searched, considered) and RESULTS (what was found, decided, what remains open).
2. **No mid-paragraph line breaks**: Write each prose paragraph as a single continuous line. Do not insert newlines inside a paragraph to wrap it at a column width. Newlines are only for separating paragraphs, list items, headings, and fenced code blocks.
3. **Genuine substance**: Write real content, not padding or repetition inflated to look thorough. The purpose is information density for future reference, not length.

## Execution Protocol

### Step 1: Ensure Context File Exists

Import `context-init`. This is idempotent — if the context file for the current Phase already exists, it skips creation and returns the existing file path.

### Step 2: Locate Current Context File

Determine the current Phase's context file path by:
- Using the path returned by context-init, OR
- Checking `context/INDEX.md` for the most recent entry matching the current Phase

### Step 3: Append Checkpoint Content

Append a new section to the context file:

```markdown

---

## Checkpoint: <Descriptive Name>

<CC writes substantive content here covering process + results>
```

**Content format**: CC has full autonomy. A default semi-structured template is available as guidance but not mandatory:

```markdown

---

## Checkpoint: <Descriptive Name>

### Objective
What this stage aimed to accomplish.

### Process Summary
What was done — searches performed, papers read, methods applied, decisions made along the way.

### Key Findings
The substantive results — discoveries, patterns, important papers, technical details.

### Decisions Made
Choices made during this stage and their rationale.

### Open Questions
What remains unresolved, what needs further investigation.
```

CC may use this template, modify it, combine sections, add new sections, or write in completely free-form style. The only requirement is coverage of both process and results.

### Step 4: Update INDEX.md

Update the row for the current context file:
- Increment the Checkpoints count
- Update the Last Updated timestamp (run `date +%Y-%m-%d-%H-%M` for current time)

## Content Guidance

The checkpoint is a detailed record for future reference. Write as if the reader has zero context about what happened during this research stage. Include:

- Specific searches performed (queries, databases, filters)
- Papers found and their relevance
- Methods applied and their outcomes
- Decisions made and their rationale
- Surprises, dead ends, pivots
- Quantitative results where applicable
- Open threads for future investigation

Sparse checkpoints are useless for recovery. Write generously where the content warrants it — this is a research log, not a summary.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |

<!-- END available-tables (generated) -->
