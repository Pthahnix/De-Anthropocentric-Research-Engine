# Research Loop

Outer orchestration skill for Neocortica's Stage 1-3 research pipeline with review-driven iterative refinement.

Encapsulates: literature-survey → gap-analysis → idea-generation → review → selective redo loop.

## User Input

$ARGUMENTS — research topic or question

## Parameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| MAX_ROUNDS | 7 | Hard upper limit, quality > speed |
| SCORE_THRESHOLD | 8 | High bar — top-venue quality target |
| NO_PROGRESS_ROUNDS | 2 | Warn (not stop) if no score improvement |
| COLD_SURVEY_ITERS | 10 | Full survey on cold start (existing default) |
| COLD_GAP_ITERS | 6 | Full gap analysis on cold start (existing default) |
| COLD_IDEA_ITERS | 5 | Full idea generation on cold start (existing default) |
| HOT_SURVEY_ITERS | 3 | Reduced — targeted supplement only |
| HOT_GAP_ITERS | 2 | Reduced — targeted supplement only |
| HOT_IDEA_ITERS | 2 | Reduced — targeted supplement only |

## Loop State

Track across rounds:
- `round`: current macro round (0 = cold start)
- `phase`: "cold" or "hot"
- `reviewHistory`: array of all review results (JSON objects)
- `knowledge`: accumulated findings from all stages
- `papersRead`: set of paper titles already read (dedup)
- `urlsVisited`: set of URLs already visited (dedup)
- `knownLimitations`: issues accepted as unfixable after 3+ rounds

## Output Directory

Create `{PROJECT_ROOT}/output/` at startup. All stage outputs and review results go here:

```
output/
  survey.md              # Latest survey (overwritten each round)
  gaps.md                # Latest gaps
  ideas.md               # Latest ideas
  review-round-0.md      # Round 0 review
  review-round-1.md      # Round 1 review
  ...
  research-loop-log.md   # Orchestration log
```

## Phase 1: Cold Start (Round 0)

Execute each stage fully with default iteration limits. State flows forward: survey → gap → idea.

### Step 1: Literature Survey

Execute `skill/literature-survey.md` with topic = $ARGUMENTS.
- MAX_ITERATIONS = COLD_SURVEY_ITERS (10)
- Initialize: knowledge=[], papersRead=Set(), urlsVisited=Set()
- After completion: write output to `{PROJECT_ROOT}/output/survey.md`
- Retain state: knowledge, papersRead, urlsVisited

### Step 2: Gap Analysis

Execute `skill/gap-analysis.md`.
- MAX_ITERATIONS = COLD_GAP_ITERS (6)
- Inherit: knowledge, papersRead, urlsVisited from Step 1
- After completion: write output to `{PROJECT_ROOT}/output/gaps.md`
- Retain updated state

### Step 3: Idea Generation

Execute `skill/idea-generation.md`.
- MAX_ITERATIONS = COLD_IDEA_ITERS (5)
- Inherit: all state from Steps 1-2
- After completion: write output to `{PROJECT_ROOT}/output/ideas.md`
- Retain updated state

### Step 4: First Review

Execute `skill/research-review.md` (see that skill for full procedure).
- Write review to `{PROJECT_ROOT}/output/review-round-0.md`
- Append to reviewHistory

### Step 5: Check Stop Condition

IF review.overall_score >= SCORE_THRESHOLD AND !review.has_critical:
  → STOP. Log: "Review passed on first attempt (score: {score})"
  → Write final orchestration log
  → Present results to user

ELSE:
  → Enter Phase 2 (Hot Loop)

## Phase 2: Hot Loop (Round 1 — MAX_ROUNDS-1)

Iteratively improve based on review feedback. Each round: selective redo → review → check stop.

### State Injection Mechanism

Stage skills are self-contained SOPs that initialize their own state. In hot loop rounds, prepend a **preamble** to override initialization:

```markdown
## Continuation Context (injected by research-loop.md)

This is a HOT LOOP iteration (Round {N}). Do NOT start from scratch.

### Inherited State
- knowledge: {serialized knowledge array}
- papersRead: {serialized set as JSON array}
- urlsVisited: {serialized set as JSON array}

### Review Feedback (from Round {N-1})
Score: {previous_score}/10
Issues to address:
{list of relevant issues from previous review, formatted as bullet points}

### Focus Directions
{focus_directions relevant to this stage, from review's next_actions}

### Known Limitations (do not attempt to fix)
{knownLimitations list, if any}

### Iteration Limit
MAX_ITERATIONS = {hot or cold limit, depending on stage score}

### Instructions
- Start with the inherited state above — do NOT reinitialize
- Use the focus directions as your initial gaps/questions
- Address the review issues listed above as priority tasks
- Respect the reduced iteration limit
- Skip known limitations — they have been accepted

---
[Original skill content follows]
```

### Hot Loop Procedure

```
round = 0  // already completed cold start

WHILE round < MAX_ROUNDS:
  round++

  // 1. Read previous review
  prevReview = reviewHistory[round - 1]
  actions = prevReview.next_actions
  directions = actions.focus_directions

  // 2. Selective Redo
  redoCount = 0

  IF actions.redo_survey:
    iters = (prevReview.stages.survey.score < 5) ? COLD_SURVEY_ITERS : HOT_SURVEY_ITERS
    Execute literature-survey.md WITH preamble
      - Inject: survey-related directions as initial gaps
      - Override: MAX_ITERATIONS = iters
    Write output to {PROJECT_ROOT}/output/survey.md
    redoCount++

  IF actions.redo_gap:
    iters = (prevReview.stages.gap.score < 5) ? COLD_GAP_ITERS : HOT_GAP_ITERS
    Execute gap-analysis.md WITH preamble
      - Inject: gap-related directions + CRITICAL gap issues as correction tasks
      - Override: MAX_ITERATIONS = iters
    Write output to {PROJECT_ROOT}/output/gaps.md
    redoCount++

  IF actions.redo_idea:
    iters = (prevReview.stages.idea.score < 5) ? COLD_IDEA_ITERS : HOT_IDEA_ITERS
    Execute idea-generation.md WITH preamble
      - Inject: idea-related directions
      - Override: MAX_ITERATIONS = iters
      - If gap was just redone, use new gap ranking
    Write output to {PROJECT_ROOT}/output/ideas.md
    redoCount++

  // 3. No-Redo Fallback
  IF redoCount == 0:
    // Reviewer said nothing needs redo but score < threshold
    lowestStage = stage with min(score) from prevReview
    LOG WARNING: "No redo flags but score < threshold. Forcing redo of {lowestStage}."
    Force redo of lowestStage using logic above
    redoCount = 1

  // 4. Review
  Execute skill/research-review.md
  reviewHistory.push(result)
  Write {PROJECT_ROOT}/output/review-round-{round}.md

  // 5. Feedback Deduplication
  IF round >= 2:
    For each issue in current review:
      Match against previous review issues by `claim` field
      IF same issue in 2+ consecutive reviews:
        Mark as PERSISTENT in orchestration log
        Escalate in next preamble: "PERSISTENT ISSUE (raised {N} times): {claim}"
      IF same issue in 3+ consecutive reviews:
        Add to knownLimitations
        LOG: "Accepted as known limitation: {claim}"

  // 6. Stop Conditions
  IF result.overall_score >= SCORE_THRESHOLD AND !result.has_critical:
    STOP: "Review passed (score: {score}, round: {round})"
    BREAK

  IF round >= MAX_ROUNDS:
    STOP: "Reached maximum round limit ({MAX_ROUNDS})"
    BREAK

  // 7. Progress Detection
  IF round >= 3:
    last2scores = [reviewHistory[round-1].overall_score, reviewHistory[round-2].overall_score]
    IF result.overall_score <= min(last2scores):
      LOG WARNING: "No progress for 2 consecutive rounds"

END WHILE
```

## Orchestration Log

Maintain `{PROJECT_ROOT}/output/research-loop-log.md` throughout execution. Append after each round:

```markdown
## Research Loop Log: {topic}

### Round {N} ({Cold Start | Hot})
- Phase: {cold | hot}
- Executed: {list of stages executed with iteration counts} — {list of stages skipped}
- Papers read: {total} (+{delta from previous round})
- URLs visited: {total} (+{delta})
- Review score: {score}/10 ({verdict})
- Critical issues: {count} ({brief description if any})
- Persistent issues: {count}
- Known limitations: {count}
- Next: {redo flags and focus summary}
```

## Final Output

When the loop terminates (pass or max rounds), present to the user:

1. **Final score**: {overall_score}/10 — {verdict}
2. **Rounds completed**: {round} (cold start + {round} hot iterations)
3. **Score progression**: Round 0: {score} → Round 1: {score} → ... → Round N: {score}
4. **Papers read**: {total count}
5. **Output files**: List all files in output/
6. **Known limitations**: List any accepted limitations
7. **Recommendation**: If PASS → proceed to Stage 4 (experiment-design). If not PASS → summarize remaining issues for human review.

## Notes

- Each stage's output file is overwritten each round — review-round-N.md files serve as the audit trail
- State (knowledge, papersRead, urlsVisited) is append-only — never loses data across rounds
- The orchestrator writes stage outputs to files after capturing from conversation, to manage context window
- If `claude -p` fails for review, see `skill/research-review.md` for error handling procedure
- This skill can be interrupted and resumed — the output/ directory preserves all state
