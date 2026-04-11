---
name: Method Evolve Strategy
description: >
  Evolutionary improvement of DARE's own methods. Mutation + crossover on successful
  tactics and SOPs, Elo-style ranking. Inspired by Google's AlphaEvolve.
  Future expansion (v3.2+).
type: strategy
layer: strategy
agent: CC main (orchestrator) + dare-agents tools
status: future
tactics:
  - review
sops:
  - self-review-quick
tools:
  - method_evolve_mutate
  - method_evolve_crossover
  - method_evolve_evaluate
input: |
  methodPool: object[] (current tactics/SOPs with their track records)
  evaluationCriteria: string[] (what makes a method "good" — novelty, feasibility, diversity of ideas produced)
  context: string (current research domain)
  maxGenerations: number (optional, default 5)
output: |
  evolvedMethods: object[] (improved method variants)
  eloRankings: object (Elo scores for all methods — original and evolved)
  evolutionLog: string (mutation/crossover/evaluation trace)
---

# Method Evolve Strategy

> **Status: Future expansion (v3.2+).** Inspired by Google's AlphaEvolve. This SKILL.md defines the interface and protocol. dare-agents tools (`method_evolve_mutate`, `method_evolve_crossover`, `method_evolve_evaluate`) are implemented in P3 Task 2.

Apply evolutionary algorithms to DARE's own methodology — mutation, crossover, and selection on the SOPs and tactics themselves.

## Research Budget — Method-Evolve

| Metric | Target |
|--------|--------|
| Generations (mutation cycles) | 5+ |
| Evaluations per generation | 3+ |
| Crossover attempts | 2+ |
| Method types represented in population | 3+ |

These targets ensure the evolutionary process has enough diversity and iterations
to produce meaningful improvements.

## When to Use

- After multiple research sessions have been completed (need track record data)
- When some methods consistently produce better ideas than others
- As a meta-optimization loop run periodically (not during active research)

## Concept

DARE v3 provides ~31 SOPs and ~16 tactics. Over time, some prove more effective than others for specific research domains. Method-evolve treats these methods as "organisms" and applies evolutionary pressure:

1. **Fitness**: Measured by the quality of ideas each method produces (from debate verdicts, QD scores, and eventual experiment success)
2. **Mutation**: Small changes to a method's protocol via `method_evolve_mutate` dare-agents tool
3. **Crossover**: Combine successful aspects of two methods via `method_evolve_crossover` dare-agents tool
4. **Selection**: Elo-style ranking via `method_evolve_evaluate` dare-agents tool — methods that produce better ideas rise, others fall

## Protocol (Planned)

### Phase 1: Build Track Records

1. Analyze past research sessions (from `context/` outputs and generationLog)
2. For each method (SOP/tactic): how many ideas did it generate? How many survived debate? How many led to successful experiments?
3. Compute initial Elo scores based on track record

### Phase 2: Evolutionary Loop (per generation)

1. **Select parents**: Choose methods with high Elo scores
2. **Mutation** (via dare-agents `method_evolve_mutate`):
   - For each selected method, produce 1-2 mutated variants
   - Mutation targets the method's weakest aspect (based on track record)
3. **Crossover** (via dare-agents `method_evolve_crossover`):
   - Pair high-Elo methods, produce hybrids
4. **Evaluation** (via dare-agents `method_evolve_evaluate`):
   - Run original and mutated/hybrid methods on the same test problem
   - Compare outputs, update Elo rankings
5. **Selection**: Keep methods above Elo threshold. Retire persistently low-ranking methods.

### Phase 3: Integration

1. Successful evolved methods are saved as new SKILL.md files (e.g., `scamper-substitute-v2`)
2. Original methods preserved (evolution adds, doesn't delete)
3. Future research sessions have access to both original and evolved methods

## Elo Ranking System

```
Initial Elo: 1500 for all methods
K-factor: 32 (standard chess K)
Update: after each head-to-head evaluation via method_evolve_evaluate
Ranking: sorted by Elo score
Retirement threshold: Elo < 1200 after 10+ evaluations
```

## dare-agents Tools Used

| Tool | Purpose | Implemented |
|------|---------|-------------|
| `method_evolve_mutate` | Produce mutated method variants | P3 Task 2 |
| `method_evolve_crossover` | Combine two methods into hybrid | P3 Task 2 |
| `method_evolve_evaluate` | Head-to-head comparison + Elo update | P3 Task 2 |

## Completeness Probe — Method-Evolve

<HARD-GATE>
Before accepting the evolved method population:

**Method type coverage:**
- [ ] Does the population include methods from at least 3 different creative categories?
  (e.g., SCAMPER-family, surgery-family, cross-domain, assumption-based, systematic)
- [ ] Did crossover combine methods from different categories (not just within-category)?

**Evolution depth:**
- [ ] Were at least 5 generations of mutation applied?
- [ ] Did any method show measurable improvement across generations?
- [ ] Were dead-end mutations properly pruned?

**Evaluation rigor:**
- [ ] Was each method evaluated on at least 1 test problem?
- [ ] Did evaluation use consistent criteria across all methods?

If ANY checkbox fails → run 1-2 more generations targeting the weakness.
</HARD-GATE>

## Open Questions (to resolve during v3.2 implementation)

- How to fairly evaluate methods that produce different TYPES of ideas?
- How to handle methods that are domain-specific (great in NLP, bad in vision)?
- Should evolved methods be stored in `skills/sop/evolved/` or alongside originals?
- How to prevent overfitting to a specific research domain?
- Human approval gate before retiring a method?

## Dependencies

- Requires: multiple completed research sessions with generationLog data
- Requires: all P0/P1/P2 methods to be operational (need track records)
- New: Elo ranking system (could be a simple JSON file in `context/elo-rankings.json`)
