# Gap Discovery

Analyze a collection of paper reading notes to identify research gaps.

## Input

- Collection of reading notes (Pass 1-2-3 summaries) from literature survey
- Research topic for context

## Analysis Tasks

Perform ALL of the following:

### 1. Method Comparison Matrix

Build a table comparing methods across papers:

| Paper | Method | Dataset(s) | Key Metric | Result | Limitations |
|-------|--------|-----------|------------|--------|-------------|
| ...   | ...    | ...       | ...        | ...    | ...         |

### 2. Contradiction Detection

Find cases where papers disagree:
- Conflicting results on the same benchmark
- Contradictory claims about what works/doesn't work
- Different conclusions from similar experiments

For each contradiction, cite both papers and the specific claims.

### 3. Blank Identification

Identify unexplored areas:
- Directions mentioned in "future work" sections but not yet pursued
- Dataset/domain gaps (method tested on X but not Y)
- Missing combinations (method A + technique B never tried)
- Scale gaps (only tested small-scale, or only large-scale)
- Assumption gaps (what if assumption X doesn't hold?)

### 4. Trend Analysis

Identify trajectory of the field:
- What approaches are gaining traction (last 1-2 years)?
- What approaches are being abandoned?
- What new problems are emerging?
- Where is the field heading?

## Output

Produce a numbered gap list, ranked by research potential:

```
## Research Gaps

### Gap 1: [short title]
- **Type**: [contradiction / blank / limitation / trend]
- **Description**: [2-3 sentences]
- **Evidence**: [cite specific papers and findings]
- **Potential**: [why this gap is worth pursuing]

### Gap 2: ...
```

Rank gaps by: feasibility × potential impact × novelty.
