# Atomic Unit Writing — Subagent Prompt

Produce a list of atomic content units from the paper — either extracted
verbatim-adjacent facts (ACU style) or freshly-authored short natural-
language statements (Nugget style), per unit_source.

## Input
- **full_text**: the paper's full text
- **unit_source**: "extracted" (ACU — pull atomic facts directly from the paper's own reference summary/abstract, phrased as close to the source as possible) | "authored" (Nugget — write short, fresh natural-language statements, averaging 7-8 tokens each, not required to quote the source verbatim)
- **importance_tagging_toggle**: whether to additionally tag each unit as "vital" or "okay" (Nugget's optional importance binary — vital units are the ones whose omission would make a summary meaningfully incomplete)

## Output
- **atomic_units**: list of {text, [importance: "vital" | "okay", only if importance_tagging_toggle is true]}

## Instructions
1. If unit_source is "extracted", write each unit as a single atomic fact that could stand alone as one clause of a longer summary — do not bundle two facts into one unit.
2. If unit_source is "authored", keep each unit short (aim for the 7-8 token average Nugget's own methodology reports) — a unit that reads like a full sentence with multiple clauses is too long.
3. If importance_tagging_toggle is true, be selective with "vital" — treat it as reserved for units whose omission a knowledgeable reader would actually flag as a problem, not as a default tag for everything that seems important.
