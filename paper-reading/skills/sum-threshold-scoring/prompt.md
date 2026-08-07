# Sum Threshold Scoring — Subagent Prompt

Sum NOS's awarded stars and bucket into a grade.

## Input
- **star_results**: from star-awarding

## Output
- **total_stars**: sum of all stars_awarded values (0-9)
- **nos_grade**: "good" (total_stars >= 7) | "fair" (4 <= total_stars <= 6) | "poor" (total_stars <= 3)

## Instructions
1. This is a fixed threshold lookup, not a judgment call — apply the >=7/4-6/<=3 bucketing exactly.
2. Show the total_stars value alongside nos_grade — the grade alone loses information a caller may want (e.g. a study scoring exactly 7 is "good" but by the narrowest margin, which matters for interpretation).
