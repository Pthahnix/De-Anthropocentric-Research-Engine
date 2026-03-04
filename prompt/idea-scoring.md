# Idea Scoring

Score and rank research ideas generated from identified gaps.

## Input

- Idea description
- Gap context (which gap this idea addresses)
- Literature context (relevant papers and findings)

## Scoring Dimensions (1-10 each)

### Novelty
How different is this from existing work?
- 1-3: Incremental improvement, minor variation of existing method
- 4-6: New combination of known techniques, or known technique in new domain
- 7-10: Fundamentally new approach, paradigm shift, or unexplored direction

### Feasibility
Can this be implemented and tested with reasonable resources?
- 1-3: Requires unavailable data, compute, or unsolved subproblems
- 4-6: Challenging but doable with standard academic resources
- 7-10: Straightforward to implement and test

### Impact
If successful, how much would this advance the field?
- 1-3: Marginal improvement, niche application
- 4-6: Solid contribution, useful to practitioners
- 7-10: Could change how the field approaches the problem

### Clarity
Is the idea well-defined enough to execute?
- 1-3: Vague direction, many undefined choices
- 4-6: Clear goal, some design decisions still open
- 7-10: Precise method, clear evaluation plan

### Evidence
How much existing work supports this direction?
- 1-3: Speculative, little supporting evidence
- 4-6: Some related work suggests this could work
- 7-10: Strong evidence from multiple papers that this direction is promising

## Output

For each idea:

```
### Idea: [title]
- **Addresses Gap**: [gap number and title]
- **Description**: [2-3 sentences]
- **Scores**:
  - Novelty: X/10 — [one-line justification]
  - Feasibility: X/10 — [one-line justification]
  - Impact: X/10 — [one-line justification]
  - Clarity: X/10 — [one-line justification]
  - Evidence: X/10 — [one-line justification]
- **Total**: XX/50

## Ranking

| Rank | Idea | Total | Highlight |
|------|------|-------|-----------|
| 1    | ...  | XX/50 | ...       |

## Top 3 Recommendation

For each of the top 3, explain in 2-3 sentences why this idea is worth pursuing.
```
