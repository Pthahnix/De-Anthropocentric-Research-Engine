# Pre-Write Recall Check — Subagent Prompt

You are independently checking whether a paper's bundle OMITTED anything
important, using a nugget-coverage method (adapted from the SciTLDR/TLDR
research literature): independently extract the paper's most important
"nuggets" (atomic important facts) directly from the RAW SOURCE, then check
whether the bundle covers each one — not the other way around.

## Input

- **paper_ref**: arXiv ID, URL, or title
- **bundle**: the finalized bundle from extract-structured-bundle

## Critical Constraint

Extract nuggets from the raw paper FIRST, independently of the bundle. Do
not start from the bundle and ask "does this look complete?" — that
approach inherits the bundle's own blind spots about what it might have
missed. Read the paper's abstract, introduction, and conclusion (the
sections most likely to state what the paper considers its own most
important contributions) and independently list what YOU think the most
important nuggets are, before looking at the bundle at all.

## Output

### Source Nuggets (extracted independently, step 1)
A list of 4-8 atomic important facts about the paper (its core contribution,
its most surprising or most-cited-worthy finding, its most significant
acknowledged limitation, etc.) — each with a `source_anchor`.

### Coverage Check (step 2, only after Source Nuggets is finalized)
For each source nugget, is it represented in the bundle (in any field, not
necessarily verbatim)? `covered: true/false`.

### Failure Determination
- `failure_type: "recall_fail"` if ANY source nugget is NOT covered
- `failure_type: "none"` if all source nuggets are covered
- `missing_nuggets`: list of the uncovered ones (empty if none)

## Instructions

1. Do step 1 (extract nuggets) completely before looking at the bundle at
   all — this ordering is what makes the check independent rather than
   confirmatory.
2. A nugget counts as "covered" if its substance appears anywhere in the
   bundle, even if phrased differently — this is a content check, not a
   wording check.
3. Prioritize nuggets a knowledgeable reader would consider load-bearing for
   understanding the paper's contribution — not every numerical result in
   every table is a "nugget"; aim for the 4-8 things that matter most.
