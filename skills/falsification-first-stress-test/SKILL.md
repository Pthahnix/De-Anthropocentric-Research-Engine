---
name: falsification-first-stress-test
description: 'Campaign: Truth-seeking adversarial validation for scientific research
  artifacts (NOT publication defense). Core question: Where have we fooled ourselves,
  and is each load-bearing claim even falsifiable? Win-condition is INVERTED from
  survival/resilience to active refutation. Methods: Popper falsificationism, Lakatos
  Proofs and Refutations, Mayo severe testing, Platt strong inference.'
type: campaign
produces: FalsificationLedger
artifact-types:
- theory-map
- claim
- isomorphism-claim
- convergence-claim
- validation-design
- proposition
dependencies:
  strategies:
  - adversarial-debate-truthseeking
  - circular-validation-audit
  - elegance-trap-probe
  - independent-convergence-audit
  - isomorphism-falsification
  - red-team-truthseeking
  sops:
  - context-checkpoint
  - context-init
  - stress-test-saturation-detection
  - verdict-synthesis
  - weakness-classification
---

# Falsification-First Stress Test

Core question: **Where have we fooled ourselves — and is each load-bearing claim even falsifiable?**

This campaign is a deliberate inversion of publication-oriented stress testing. In a publication frame, the artifact is a thing to be *defended*; success = it *survives* debate and gets *hardened*. That frame optimizes for persuasiveness and is actively dangerous for truth-seeking research: it rewards a claim for being un-attackable, which is exactly the failure mode of an unfalsifiable theory. Here the artifact is a *suspect*. We WANT to break it, because breaking it teaches us something true and cheap (compute/thought) before we spend expensive effort (sandbox, wet-lab) on a false premise. Confidence is not assumed and defended down; it is EARNED up, only by surviving honest assault.

## Stance (operator-set, non-negotiable)

- **证伪优先, 不摁死 (falsification-first, not execution).** The goal is diagnostic: surface flaws WE overlooked, not manufacture a verdict that kills the work for sport. A successful attack revises the map or demotes a claim; it does not "win." A failed attack (the claim survives) is also a real result — corroboration — provided the attack was severe (Mayo: a claim is corroborated only to the degree it passed a test it would probably have failed if false).
- **No hardening.** Finding a weakness NEVER triggers "patch it to look stronger." It triggers exactly one of: (a) revise the claim, (b) demote the claim's status, (c) record it as honest residue. Patching-to-survive is the patchwork anti-pattern this whole project rejects.
- **Unfalsifiability is the worst outcome, not the best.** A claim no attack can touch is not strong — it is empty. Flag it RED and demote to conjecture/analogy.

## Three outcome buckets (the only verdicts)

Every load-bearing claim exits in exactly one bucket:

| Bucket | Meaning | Action |
|---|---|---|
| **BROKEN** | A concrete refutation (counterexample / disagreeing case / failed derivation) was found. | Revise the claim or demote it. Record what the refutation taught. |
| **CORROBORATED** | The claim was stated falsifiably, attacked severely, and held. | Raise confidence. Record WHAT was forbidden-and-held (the more it forbids, the stronger). |
| **UNFALSIFIABLE** | No statement of the claim could be found that some observation/computation could refute. | RED FLAG. Demote to conjecture or relabel (e.g. "isomorphism"→"analogy"). |

## Methodology Sources

- Popper (1959) — Falsificationism: a theory's content = what it forbids; seek the forbidden.
- Lakatos (1976) — Proofs and Refutations: counterexamples force claim refinement, not abandonment; monster-barring vs. concept-stretching.
- Mayo (1996, 2018) — Severe testing / error statistics: a passed test corroborates only if it was severe (would likely have failed if the claim were false).
- Platt (1964) — Strong inference: for each claim, design the experiment whose alternative outcomes exclude hypotheses.
- Meehl (1990) — Risky predictions; the difference between a theory that predicts and one that merely accommodates.

## Strategy Routing (by artifact type)

| Claim/artifact type | Primary strategy | Secondary |
|---|---|---|
| a beautiful unification / elegant backbone | elegance-trap-probe | adversarial-debate-truthseeking |
| an isomorphism claim (A ≅ B ≅ …) | isomorphism-falsification | adversarial-stress-testing (sibling campaign) |
| load-bearing propositions | counterfactual-probing (sibling campaign) | adversarial-stress-testing (sibling campaign) |
| an "N paths independently converged" claim | independent-convergence-audit | red-team-truthseeking |
| a validator / sandbox design | circular-validation-audit | red-team-truthseeking |
| any sharp claim | red-team-truthseeking | adversarial-debate-truthseeking |

## Strategies in this campaign

- **adversarial-debate-truthseeking** — dialectic engine; defender steelmans into the MOST falsifiable form, critic attacks to refute, judge classifies into the three buckets (does NOT pick a winner).
- **red-team-truthseeking** — systematic-probing engine; threat surface = load-bearing claims; output = the specific observation/computation that would refute each claim + which attacks succeeded. NO resilience score, NO hardening list.
- **isomorphism-falsification** — for an isomorphism claim; demand an explicit structure-preserving map or downgrade to analogy.
- **circular-validation-audit** — run BEFORE building any validator; non-circularity matrix of theory-claim × sandbox-assumption.
- **independent-convergence-audit** — for a convergence claim; measure path dependence, correct the confidence weight.
- **elegance-trap-probe** — for the unification; is the simplicity EARNED (forbids/predicts) or DECORATIVE (re-describes)?

## Sibling campaigns (routed to, not owned)

These are existing campaigns this campaign routes claims TO; they are referenced, not declared as dependencies (4-layer rule: a campaign lists only its own strategies and sops).

- **adversarial-stress-testing** (Lakatos/Popper/BVA) — monster-barring and boundary probing on load-bearing propositions; route isomorphism-claim and proposition residue here.
- **counterfactual-probing** (Pearl SCM / Lewis / PNS-PS) — load-bearing factor identification on propositions and the unification; route "what actually carries this conclusion?" questions here.

## Discarded (do not invoke this round)

- **failure-anticipation (FMEA/RPN/IEC-60812)** — category mismatch. RPN scores manufacturing/process failure likelihoods; it does not test whether a theory is TRUE. If forward failure analysis is wanted, reframe as "if the theory is false, what observation exposes it?" — which is just Popperian falsification, covered above.

## Budget Table

| Parameter | S (Quick) | M (Standard) | L (Deep) |
|---|---|---|---|
| Load-bearing claims attacked | 4 | 8 | 14 |
| Refutation attempts per claim | 2 | 4 | 7 |
| Severe tests designed per claim | 1 | 2 | 4 |
| External evidence searches | 3 | 6 | 12 |

## Context Management

Each attack subagent runs in isolated context to prevent the defender's framing from contaminating the critic. The Falsification Ledger is the single accumulating artifact; every checkpoint appends, never overwrites. Saturation: stop attacking a claim when 2 consecutive rounds find no new refutation vector AND no new severe test.

## Output

Produces `FalsificationLedger`: a table of every load-bearing claim → {falsifiable? (Y/N) | what observation/computation would refute it | attacks attempted | outcome bucket | if BROKEN: the refutation + revision/demotion | if CORROBORATED: what was forbidden-and-held + severity of the test passed}. Plus a top-level honest-residue list: claims that are irreducibly unfalsifiable by compute and require an external oracle.

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| adversarial-debate-truthseeking | Strategy: Dialectic engine retuned for truth-seeking, not survival. A defender steelmans a claim into its MOST falsifiable form, a critic attacks to refute it, a judge classifies the exchange into BROKEN/CORROBORATED/UNFALSIFIABLE — the judge does NOT pick a winner or score persuasiveness. Methods: Irving debate (repurposed), Toulmin argumentation, Mayo severe testing. |
| circular-validation-audit | Strategy: Run BEFORE building any validator (sandbox/simulation/benchmark). Builds a non-circularity matrix of theory-claim × validator-assumption to detect when a validator would 'confirm' a theory only because it was built on the theory's own premises. A circular validator's PASS carries zero evidential weight. Methods: Cartwright nomological machines, Winsberg sanctioning-of-simulations, tautology detection. |
| elegance-trap-probe | Strategy: Attack a beautiful unified result on the suspicion that its beauty is the bug. Distinguishes EARNED simplicity (forbids/predicts/subsumes) from DECORATIVE simplicity (re-describes/relabels/accommodates). Directly serves the Occam aesthetic by making it a falsifiable bar, not a vibe. Methods: Sober parsimony-as-evidence, MDL, Meehl risky prediction, accommodation-vs-prediction. |
| independent-convergence-audit | Strategy: Attack the evidential weight of an 'independent convergence' claim. When N reasoning paths all reach the same conclusion, the confidence boost is real only if the paths were actually independent. Measures shared-prior / shared-blindspot contamination and corrects the over-counted confidence. Methods: Bayesian agreement-as-evidence, correlated-error analysis, jury theorem assumptions. |
| isomorphism-falsification | Strategy: Attack an isomorphism claim by demanding an explicit structure-preserving map and trying to break it. Targets any multi-language claim of the form 'X ≅ Y ≅ … across N mathematical languages'. Forces the claim to either earn the word 'isomorphism' or be demoted to 'analogy'. Methods: category theory (functor/natural-iso criteria), model theory, Lakatos monster-barring. |
| red-team-truthseeking | Strategy: Systematic adversarial probing retuned for truth-seeking. Threat surface = the set of load-bearing claims. Output is NOT a resilience score and NOT a hardening list — it is, per claim, the specific observation/computation that would refute it, plus which attacks succeeded. Methods: UFMCS Key Assumptions Check (repurposed), CIA Devil's Advocacy, Platt strong inference. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| stress-test-saturation-detection | Determines whether validation has reached saturation — no new weaknesses or failure modes being discovered. Used by all 5 campaigns as termination signal. |
| verdict-synthesis | Synthesizes findings from a completed campaign into typed verdict reports. Produces DebateVerdict, RedTeamReport, FailureAnticipationReport, CounterfactualMap, or AdversarialStressReport depending on campaign. Also supports cross-campaign StressTestSummary. |
| weakness-classification | Classifies discovered weaknesses into severity tiers (fatal/major/minor/cosmetic) with structured justification and exploitability assessment. |

<!-- END available-tables (generated) -->
