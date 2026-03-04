# Paper Rating

Rate a paper's priority for the current research topic.

## Input

- Paper metadata: title, abstract, year, citation count, venue (if available)
- Research topic for context

## Rating Criteria

Evaluate on these factors (use judgment, not a formula):

1. **Relevance**: How directly does this paper address the research topic?
2. **Impact**: Citation count relative to age (a 2025 paper with 50 citations > a 2018 paper with 50)
3. **Novelty**: Does it introduce a new method/perspective, or is it incremental?
4. **Venue**: Top venue (NeurIPS, ICML, ACL, CVPR, Nature, etc.) signals quality
5. **Recency**: More recent = more likely to reflect current state of the art

## Output

Rate as one of:

- **High**: Core paper. Directly relevant, high impact, or introduces key ideas. → Read with Pass 1-2-3.
- **Medium**: Useful context. Relevant technique, dataset, or result. → Read with Pass 1-2.
- **Low**: Tangential, redundant, or low quality. → Pass 1 only (or skip).

Format:

```
**Rating**: [High/Medium/Low]
**Reason**: [one sentence justification]
```
