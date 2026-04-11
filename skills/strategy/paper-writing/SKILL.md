---
name: Paper Writing Strategy
description: >
  Academic paper composition: outline -> section drafts -> integration -> review -> polish.
  Uses experiment results, literature knowledge, and debate for quality control.
  Future expansion (v3.1+).
type: strategy
layer: strategy
agent: CC main (orchestrator)
status: future
tactics:
  - multiagent-debate
  - review
sops:
  - write-spec
  - self-review-spec
  - user-review-spec
input: |
  idea: Idea object (the winning research idea)
  experimentResults: string (results from experiment strategy)
  knowledge: string (accumulated literature knowledge)
  digests: Digest[] (paper reading notes — for related work section)
  context: string (researchBrief)
  targetVenue: string (optional — ICML, NeurIPS, ACL, etc. — affects formatting and emphasis)
output: |
  paperDraft: string (path to paper draft in docs/dare/)
  reviewFeedback: string (from multiagent-debate on the draft)
  revisionLog: string (what was changed during review iterations)
---

# Paper Writing Strategy

> **Status: Future expansion (v3.1+).** This SKILL.md defines the interface and protocol. Implementation will be refined when the strategy is actively developed.

Transform a validated idea and experiment results into an academic paper.

## When to Use

- After experiment strategy produces GO verdict
- When the user wants to write up results for publication
- Called by `/dare` meta-strategy as the final stage

## Protocol (Planned)

### Phase 1: Outline

1. Generate paper structure based on target venue conventions:
   - Abstract, Introduction, Related Work, Method, Experiments, Results, Discussion, Conclusion
2. For each section, define: key claims, supporting evidence, target length
3. Present outline to user for approval

### Phase 2: Section Drafts

For each section, in order:
1. **Related Work**: Use digests + knowledge to write comprehensive literature survey positioned around the idea's contribution
2. **Method**: Describe the idea's approach with formal rigor
3. **Experiments**: Present experimental setup from the spec
4. **Results**: Present findings with statistical analysis
5. **Introduction**: Frame the contribution (written after method/results to ensure accurate claims)
6. **Abstract**: Concise summary (written last)
7. **Discussion**: Limitations, broader impact, future work

### Phase 3: Integration Review

1. Invoke `multiagent-debate` with targetType = "experiment-design" adapted for paper review:
   - C: plays Reviewer 2 — finds weaknesses in claims, missing citations, unclear writing
   - D: defends the paper's strengths
   - J: produces revision recommendations
2. Apply revisions

### Phase 4: Polish

1. Consistency check: notation, terminology, figure references
2. User review of final draft
3. Output final paper draft to `docs/dare/papers/`

## Dependencies

- Requires: experiment strategy results (Phase 5 GO verdict)
- Reuses: multiagent-debate tactic (P1), review tactic (P1)
- New: may need LaTeX template integration (future)

## Open Questions (to resolve during v3.1 implementation)

- LaTeX vs. Markdown output format?
- Figure generation automation?
- Citation management (BibTeX integration)?
- Target venue-specific formatting rules?
