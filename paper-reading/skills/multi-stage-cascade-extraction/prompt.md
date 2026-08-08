# Multi-Stage Cascade Extraction — Subagent Prompt

Run a multi-stage extraction cascade over the FULL paper text (not
pre-segmented units — you discover your own spans): mention detection,
then document-level coreference clustering, then (optionally) saliency
judgment, then N-ary relation/triple extraction over the clustered
mentions. Each stage consumes the FULL output of the stage before it.

## Input
- **source_path**: path to the landed paper (`source.md`)
- **meta_path**: path to its section index (`source.meta.json`)
- **stage_count**: how many stages this run uses (2 for a mention+relation-only cascade, 3 to add coreference, 4 to add saliency)
- **per_stage_label_set**: the entity/relation label vocabulary for each stage
- **saliency_layer_toggle**: whether to include a saliency-judgment stage (only some methods, e.g. SciREX, require this; SciERC's cascade doesn't)

Read `../_conventions/reading-the-source.md` before you start.

Read the whole paper. Coreference resolution requires every mention;
skipping a section silently corrupts clusters and downstream relations.

## Stages (run in this exact order — do not skip or reorder)

1. **Mention detection**: find every candidate entity mention in the full text (spans, with entity-type label per per_stage_label_set).
2. **Coreference clustering**: group mentions across the ENTIRE document that refer to the same underlying entity (this is document-level — a mention in the Introduction and one in Results can cluster together).
3. **[If saliency_layer_toggle] Saliency judgment**: for each cluster, judge whether it is salient enough to be a candidate for the paper's key claims (SciREX's own finding: this saliency filtering step, done wrong, is where a large share of end-to-end error compounds — over half of NCG's reported accuracy loss traces to compounding errors introduced stage-over-stage, not to any single stage alone).
4. **Relation/triple extraction**: extract N-ary relations or triples (e.g. SciREX's 4-slot Task-Dataset-Metric-Score tuples) over the clustered (and, if applicable, saliency-filtered) mentions — note that SciREX's own tuples are 99% cross-sentence and 55% cross-section, meaning this stage genuinely needs the document-level clustering from stage 2, not per-sentence reasoning.

## Output
- **extraction_graph**: {mentions: [...], clusters: [...], [saliency_labels: [...]], relations: [...]} — include every stage's intermediate output, not just the final relations, since each stage's output is independently useful and errors compound across stages (a caller debugging a bad final relation needs to see which earlier stage introduced the error).

## Instructions
1. Do not collapse stages — even if you could "just see" the final relations directly, produce the intermediate mention/cluster output too, since this cascade's whole point (per the source methodologies) is that later stages depend on and can be debugged against earlier ones.
2. Confidence should generally decrease stage-over-stage — if your saliency or relation-extraction stage produces results you're just as confident about as your mention-detection stage, treat that as a signal to double-check rather than a sign of unusually clean data.
