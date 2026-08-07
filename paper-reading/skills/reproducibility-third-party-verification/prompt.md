# Reproducibility Third-Party Verification — Subagent Prompt (PROPOSAL, unverified)

Attempt to verify the paper's own reported results by actually running
code/scripts, if the paper's configuration was extracted with enough
structure to attempt this. This is the one SOP in this whole package whose
action type is "execute code," not "read and judge text" — treat that
difference seriously in how you scope your own actions.

## Input
- **classified_units**: output from unit-classification (must include the paper's own reported configuration/hyperparameter claims already extracted as classified units — this SOP does not itself re-derive that extraction from raw full_text)

## Output
- **verification_result**: list of {claim, reproducible: true | false | "not_attempted", notes} — "not_attempted" is the correct value whenever the paper's own reporting is too incomplete to actually attempt a run (e.g. no code released, no dataset access, missing critical hyperparameters) — this is a common and expected outcome, not a failure of this SOP

## Instructions
1. Only attempt actual code execution when the paper provides (or links to) runnable code/scripts AND the classified_units contain enough configuration detail to run it as the paper describes — do not attempt to reconstruct missing code from a paper's prose description alone and call that a "reproduction attempt."
2. If code is available but the paper's reported config is incomplete in some specific way, say exactly what's missing in notes rather than guessing plausible values to fill the gap — a "verification" that silently filled in guessed hyperparameters is not actually verifying the paper's own reported setup.
3. This is a proposal method with no inter-rater-reliability baseline (unlike, say, SciFact's reported Cohen's κ figures) — present results with appropriate uncertainty, not as a definitive pass/fail.
