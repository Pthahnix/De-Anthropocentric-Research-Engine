---
name: red-team-truthseeking
description: 'Strategy: Systematic adversarial probing retuned for truth-seeking.
  Threat surface = the set of load-bearing claims. Output is NOT a resilience score
  and NOT a hardening list — it is, per claim, the specific observation/computation
  that would refute it, plus which attacks succeeded. Methods: UFMCS Key Assumptions
  Check (repurposed), CIA Devil''s Advocacy, Platt strong inference.'
type: strategy
produces: RefutationSurfaceMap
dependencies:
  sops:
  - devils-advocacy
  - key-assumptions-check
  - probe-execution
  - threat-surface-mapping
---

# Red Team (Truth-Seeking Variant)

A retuning of systematic red-teaming. Classic red-teaming enumerates a threat surface, fires attack vectors, and outputs a resilience score (0.0-1.0) plus a list of hardening actions. Two things make that wrong for research: (1) "resilience score" is a defense metric — it rewards un-attackability, the signature of an unfalsifiable claim; (2) "hardening" means patching the artifact to deflect future attacks — exactly the patchwork anti-pattern we reject. This variant keeps the systematic-probing machinery (it is genuinely good at enumeration and coverage) but changes what we enumerate and what we output.

## What changed from the original (red-teaming)

| Element | Original (publication/defense) | This variant (truth-seeking) |
|---|---|---|
| Threat surface | Attackable weaknesses | The set of load-bearing CLAIMS (a claim, not a weakness, is the unit) |
| Per-vector goal | Show the artifact can be attacked | Produce the concrete observation/computation that would refute THIS claim |
| Primary output | Resilience score 0.0-1.0 | Refutation-condition per claim (falsifiable? what would break it?) |
| Secondary output | Hardening / mitigation actions | NONE. Findings route to revise/demote/residue, never to patch-to-survive |
| A claim no attack touches | High resilience (good) | UNFALSIFIABLE (RED — worst outcome) |

## Core move: assumption → refutation-condition

For each load-bearing claim, the red team does NOT ask "how can I make this look bad?" It asks Platt's strong-inference question: **"What is the experiment/observation/computation whose result would force me to abandon this claim?"** If a clean such condition exists, the claim is falsifiable and we record it (this is itself the most valuable product — it tells the next round / the sandbox exactly what to measure). If NO such condition can be constructed, the claim is UNFALSIFIABLE and flagged RED.

## Execution

### 1. Threat-surface = load-bearing claim enumeration (threat-surface-mapping, import & repurpose)
Enumerate every claim the artifact LEANS ON — not decorative restatements, the ones that, if false, collapse a downstream conclusion. Sort by load: how many downstream conclusions depend on each. Priority targets are the claims that carry the most weight and the claims stated most confidently relative to their evidence.

### 2. Key-Assumptions-Check (import key-assumptions-check SOP, repurposed)
For each claim, surface the hidden assumptions it rides on. Classify each assumption: SUPPORTED (we have evidence) / ASSERTED (we just believe it) / CONVENIENT (it makes the story prettier — high suspicion, ties to elegance-trap). ASSERTED and CONVENIENT assumptions are the priority attack targets.

### 3. Refutation-condition construction (the truth-seeking core)
For each claim, attempt to construct its refutation-condition (the strong-inference test). Three results:
- **Clean condition found** → record it. Claim is falsifiable. This feeds circular-validation-audit (can the sandbox actually run this test non-circularly?) and the next-round sandbox spec.
- **Condition exists but requires an external oracle** (real wet-lab, ground truth we cannot synthesize) → record as falsifiable-but-not-by-compute; goes to honest residue with cost noted.
- **No condition constructible** → UNFALSIFIABLE, RED flag, demote.

### 4. Attack execution (probe-execution, import)
Where a refutation-condition is constructible by reasoning/compute NOW, actually attempt the refutation (counterexample search, derivation check, limiting-case evaluation). Record success/failure honestly. A successful refutation = BROKEN. A failed severe refutation = CORROBORATED.

### 5. Devil's-advocacy pass (import devils-advocacy SOP)
One dedicated subagent argues the strongest case that the WHOLE artifact is a seductive product of our own framing — not to be balanced, but to make sure the prettiest claims got the hardest look.

## What this strategy does NOT produce

- No `resilience score`. We do not summarize truth as a number between 0 and 1.
- No `hardening actions`. If a claim is weak, we revise/demote/shelve it; we never armor it against scrutiny.
- No verdict that the artifact "passed." Individual claims get buckets; the artifact as a whole gets a ledger.

## Output

`RefutationSurfaceMap`: per load-bearing claim → {load rank | hidden assumptions classified SUPPORTED/ASSERTED/CONVENIENT | refutation-condition (clean / oracle-only / none) | if attacked: refutation attempted + outcome bucket}. Plus the devil's-advocate brief on the artifact-as-framing-artifact risk.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| devils-advocacy | Construct the strongest possible counter-argument against a position, steelmanning the opposition before attacking. |
| key-assumptions-check | Military ACT: systematically enumerate all assumptions, classify by type, and evaluate evidence strength supporting each. |
| probe-execution | Execute a single attack probe against an artifact, record the result with evidence and severity classification. |
| threat-surface-mapping | Enumerate all attackable surfaces of an artifact — logical, empirical, methodological, social, and practical dimensions. |

<!-- END available-tables (generated) -->
