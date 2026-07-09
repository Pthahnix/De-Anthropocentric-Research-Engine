---
name: context-init
description: Create a new context file for a research Phase. Called once at Phase
  start to initialize the file that subsequent context-checkpoint calls will append
  to. Use this skill whenever a new research Phase begins and a fresh context file
  is needed.
---

# Context Init

Create a new context file for a research Phase. One file per Phase — subsequent checkpoints append to this file.

## When Called

Once at the beginning of each research Phase, imported by the plan file:
```
step: "import context-management:context-init"
```

## Execution Protocol

### Step 1: Get Timestamp

Get the current time:

```bash
date +%Y-%m-%d-%H-%M
```

Output format: `yyyy-mm-dd-hh-mm` (e.g., `2026-05-16-14-30`)

### Step 2: Determine Topic Slug

Based on the current Phase context, decide a topic slug:
- Lowercase, hyphen-separated
- Reflects the Phase name or research topic
- Examples: `lit-survey`, `gap-analysis`, `protein-folding-ideation`

### Step 3: Create Context File

Create the file at: `context/<timestamp>-<topic-slug>.md`

Write the initial content:

```markdown
# <Phase Topic>

> Created: <yyyy-mm-dd hh:mm>
> Topic: <Research Topic>
> Phase: <Phase Name>

## Plan Context

<Plan excerpt for this Phase: objectives, expected outputs, constraints, relationship to other Phases in the pipeline>
```

The Plan Context section should contain the relevant plan excerpt describing this Phase's goals, expected deliverables, and how it connects to the broader research pipeline.

**No mid-paragraph line breaks**: Write each prose paragraph as a single continuous line. Do not insert newlines inside a paragraph to wrap it at a column width. Newlines are only for separating paragraphs, list items, headings, and fenced code blocks. This applies to the Plan Context written here and to all content appended later by context-checkpoint.

### Step 4: Initialize or Update INDEX.md

If `context/INDEX.md` does not exist, create it:

```markdown
# Context Index

| File | Phase | Topic | Checkpoints | Last Updated |
|------|-------|-------|-------------|--------------|
```

Add a new row for this file:

```markdown
| <filename> | <Phase Name> | <Research Topic> | 0 | <yyyy-mm-dd hh:mm> |
```

## Idempotency

If a context file for the current Phase already exists (check INDEX.md for a matching Phase name created in the current session), skip creation and return the existing file path.

## Output

The file path of the created (or existing) context file. This path is used by subsequent `context-checkpoint` calls within the same Phase.
