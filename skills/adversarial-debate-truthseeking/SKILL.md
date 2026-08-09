---
name: adversarial-debate-truthseeking
description: 'Strategy: Dialectic engine retuned for truth-seeking, not survival.
  A defender steelmans a claim into its MOST falsifiable form, a critic attacks to
  refute it, a judge classifies the exchange into BROKEN/CORROBORATED/UNFALSIFIABLE
  — the judge does NOT pick a winner or score persuasiveness. Methods: Irving debate
  (repurposed), Toulmin argumentation, Mayo severe testing.'
type: strategy
produces: DebateBucketing
dependencies:
  sops:
  - cross-examination
  - debate-architect
---

# Adversarial Debate (Truth-Seeking Variant)

A retuning of classic critic-defender-judge debate. The classic version asks "which side argued better?" and outputs a survival/resilience verdict — a persuasiveness metric. That is wrong for research: a claim can win a debate by being slippery (un-pin-down-able) while being scientifically empty. This variant changes the roles and the judge's job so the debate produces a falsifiability classification, not a winner.

## What changed from the original (multiagent-debate)

| Element | Original (publication) | This variant (truth-seeking) |
|---|---|---|
| Defender's job | Make the claim look strong / survive | State the claim in its MOST falsifiable form — maximize what it forbids |
| Critic's job | Find weaknesses to score against | Find one concrete observation/computation that would refute it |
| Judge's verdict | Winner + resilience score | Bucket: BROKEN / CORROBORATED / UNFALSIFIABLE |
| Success | Artifact survives | We learn whether the claim is even testable, and if so whether it holds |
| Slippery claim | Wins (un-attackable) | Flagged UNFALSIFIABLE (worst outcome) |

## Roles

### Defender (steelman-to-falsifiable)
The defender does NOT defend the claim as comfortable or vague. The defender's sole job is to restate the claim in the sharpest, most-forbidding form that is still faithful to what we actually meant. A claim of the form "the unification is elegant" is not a defendable form — it forbids nothing. "Under intervention X the law collapses to form A and NOT form B" is — it stakes out something an observation could contradict. If the defender cannot produce a forbidding form, that itself is the verdict (UNFALSIFIABLE) — the defender must report this honestly rather than retreat to vagueness.

### Critic (refuter)
The critic does NOT accumulate debating points. The critic tries to produce ONE of: (a) a counterexample (a case the claim forbids but that occurs / could occur), (b) a derivation error (the claim does not follow from its stated premises), (c) a demonstration that the claim's "forbidden" set is empty (it forbids nothing → UNFALSIFIABLE). The critic must commit to a specific refuter before arguing, to prevent goalpost-shifting.

### Judge (classifier, not picker)
The judge reads the exchange and assigns a bucket. The judge explicitly does NOT decide who argued better. The judge asks three questions in order:
1. Did the defender produce a falsifiable form? If NO → **UNFALSIFIABLE**.
2. Did the critic produce a valid refuter against that form? If YES → **BROKEN** (record the refutation).
3. If the form was falsifiable and survived a *severe* critic attack (one that would likely have succeeded if the claim were false) → **CORROBORATED** (record what was forbidden-and-held). A survival against a weak/lazy attack is NOT corroboration — the judge sends it back for a more severe round.

## Execution (per claim)

1. **debate-architect** (import) — set rounds (budget), pick the single claim, brief the three roles on the truth-seeking variant explicitly.
2. **Defender turn** — produce the most-falsifiable form. Record it verbatim.
3. **Critic turn** — commit to a refuter type, then attack.
4. **Cross-examination** (import cross-examination SOP) — judge probes the critic's refuter for validity and the defender's form for hidden escape hatches (the moves a slippery claim uses to dodge: redefining terms mid-debate, retreating to a weaker claim, "it's just a model").
5. **Severity check** — judge asks: if the claim were false, would this attack have caught it? If not, escalate (more severe critic) before any CORROBORATED verdict.
6. **Bucketing** — assign and record.

## Severity rubric (Mayo)

A test/attack is severe to the degree that the claim would probably have FAILED it if the claim were false. Cheap severity wins: prefer the attack that, had the claim been wrong, would most obviously have broken it. A claim that passes only weak tests stays at "untested," never "corroborated."

## Anti-patterns the judge must catch

- **Definitional retreat** — defender redefines a term to escape the counterexample. → counts as BROKEN of the original claim; the redefined claim is a NEW claim needing its own debate.
- **Persuasiveness creep** — either side scoring rhetorical points. → judge ignores; only refuters and forbidding-content count.
- **Model-shield** — "it's only a model, of course it's idealized" used to deflect a refuter that targets a load-bearing idealization. → does not save the claim; the idealization is the claim under test.

## Output

`DebateBucketing`: per claim → {most-falsifiable form produced (or "none — UNFALSIFIABLE") | critic's committed refuter | cross-exam findings | severity of attack | bucket | recorded refutation-or-forbidden-content}.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| cross-examination | Probes defender responses for inconsistencies, logical gaps, and unsupported claims. Acts as follow-up interrogation after initial defense. |
| debate-architect | Designs debate structure based on artifact type — selects attack vectors, assigns perspectives, determines escalation ladder, and configures round parameters. |

<!-- END available-tables (generated) -->
