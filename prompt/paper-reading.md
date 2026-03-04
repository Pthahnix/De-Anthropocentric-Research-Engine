# Paper Reading — Three-Pass Method

Based on Keshav (2007) "How to Read a Paper", adapted for AI-assisted research.

## Input

- Paper full text (markdown)
- Research topic for context

## Pass 1: Bird's Eye (~1 minute)

Read ONLY: title, abstract, introduction (first paragraph), section headings, conclusion, scan figures/tables.

Output the following structure:

```
### Pass 1 Summary
- **Category**: [type of paper: empirical study / theoretical framework / system design / survey / benchmark]
- **Context**: [what problem does it address, what field]
- **Contributions**: [claimed contributions, usually 3-5 bullet points from intro]
- **Quality signals**: [venue, citation count, writing clarity — quick impression]
- **Verdict**: [relevant / maybe relevant / not relevant] to the research topic
```

If verdict is "not relevant", STOP here. Do not proceed to Pass 2.

## Pass 2: Detailed Reading

Read the full paper, but focus on understanding rather than memorizing details. Ignore proofs and complex derivations on first read.

Output the following structure:

```
### Pass 2 Summary
- **Problem**: [precise problem statement]
- **Method**: [core approach in 3-5 sentences — what's the key idea]
- **Key assumptions**: [what does the method assume or require]
- **Datasets**: [what data, how much, any preprocessing]
- **Baselines**: [what they compare against]
- **Main results**: [key numbers, improvements, ablation highlights]
- **Limitations**: [stated or observed limitations]
- **Key references**: [most important cited works to follow up on]
- **Unknowns**: [things I didn't fully understand]
```

## Pass 3: Reconstruction (High-rated papers only)

Attempt to mentally reconstruct the paper: given the problem, how would you solve it? Compare your approach with the authors'.

Output the following structure:

```
### Pass 3 Deep Analysis
- **Core insight**: [the one key idea that makes this work]
- **Hidden assumptions**: [unstated assumptions that could break the method]
- **Experimental gaps**: [missing experiments, unfair comparisons, cherry-picked results]
- **Potential improvements**: [concrete ideas for extending or fixing this work]
- **Connections**: [links to other papers/methods not mentioned by authors]
```
