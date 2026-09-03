# R2 Regression Audit Report (DARE v4)

Scope: 146 capability contracts in architecture JSON, cross-checked with refactory_source.json.

| Contract ID | v3 capability | v4 path | Verdict | Evidence / reason |
|---|---|---|---|---|
| 1 | cold-start / warm-start / hot-start | entry-depth policy ? profile / landscape / rank / obstacles / goal | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 1; source_status=COVERED_MODE |
| 2 | actor-profiling | research-context input contract | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 2; source_status=MOVED_RUNTIME |
| 3 | landscape-reconnaissance | map-research-landscape | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 3; source_status=FULLY_COVERED |
| 4 | direction-narrowing | rank-candidates(object=research-direction) | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 4; source_status=COVERED_MODE |
| 5 | obstacle-analysis | analyze-constraints-readiness(mode=obstacle-triage) | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 5; source_status=COVERED_MODE |
| 6 | goal-decomposition | decompose-research-goal | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 6; source_status=FULLY_COVERED |
| 7 | north-star-synthesis | decompose-research-goal ? crystallize-north-star | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 7; source_status=COVERED_INLINE |
| 8 | broad-web / deep-web / paper search nodes | host AI tool choice | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 8; source_status=REMOVED_TOOLING |
| 9 | engine-core / context-management / checkpointing | runtime/control plane | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 9; source_status=MOVED_RUNTIME |
| 10 | subagent-spawning / implementer-dispatch | host agent runtime | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 10; source_status=MOVED_RUNTIME |
| 11 | wiki-* vault/storage operations | external storage / knowledge tool | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 11; source_status=REMOVED_TOOLING |
| 12 | gap-prioritization | rank-candidates(object=gap) | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 12; source_status=COVERED_MODE |
| 13 | gap portfolio optimization | rank-candidates ? portfolio-optimization | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 13; source_status=COVERED_MULTI_PATH |
| 14 | gap pairwise comparison | rank-candidates ? pairwise-ranking | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 14; source_status=COVERED_MULTI_PATH |
| 15 | competing hypotheses | formulate-hypotheses(mode=competing) ? design-discriminating-prediction ? compare-hypotheses | REJECT | phantom mode; architecture contract 15; source_status=COVERED_MODE |
| 16 | operationalization / falsifiability | falsifiability-audit | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 16; source_status=FULLY_COVERED |
| 17 | RQ frameworks PICO/SPIDER/SPICE/ECLIPSE | formulate-research-question ? apply-question-framework(schema=...) | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 17; source_status=COVERED_MODE |
| 18 | question decomposition | decompose-research-question | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 18; source_status=FULLY_COVERED |
| 19 | scoping / systematic / deep / narrative survey | synthesize-literature-evidence(mode=...) | REJECT | phantom mode; architecture contract 19; source_status=COVERED_MODE |
| 20 | snowball survey / citation chaining | synthesize-literature-evidence ? trace-citation-neighborhood | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 20; source_status=RESTORED |
| 21 | PRISMA-style multistage screening | synthesize-literature-evidence ? screen-evidence-multistage | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 21; source_status=RESTORED |
| 22 | narrative framing | synthesize-literature-evidence ? construct-argument-map | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 22; source_status=COVERED_MULTI_PATH |
| 23 | patent landscape / family / classification | mine-patent-landscape | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 23; source_status=FULLY_COVERED |
| 24 | patent citation network | mine-patent-landscape ? analyze-patent-citation-network | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 24; source_status=RESTORED |
| 25 | prior art / claim analysis | assess-prior-art-and-claims | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 25; source_status=FULLY_COVERED |
| 26 | patent white-space | map-patent-white-space | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 26; source_status=FULLY_COVERED |
| 27 | benchmark artifact detection | audit-benchmark-validity ? probe-benchmark-artifact | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 27; source_status=RESTORED |
| 28 | benchmark contamination / construct validity / protocol variance | audit-benchmark-validity | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 28; source_status=FULLY_COVERED |
| 29 | pairwise/network meta-analysis | synthesize-meta-analytic-evidence(mode=pairwise/network) | REJECT | phantom mode; architecture contract 29; source_status=COVERED_MODE |
| 30 | cumulative meta-analysis | synthesize-meta-analytic-evidence ? update-cumulative-evidence | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 30; source_status=RESTORED |
| 31 | baseline establishment / discrepancy / headroom | establish-empirical-baseline | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 31; source_status=FULLY_COVERED |
| 32 | gap identification / validation | validate-research-gap | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 32; source_status=FULLY_COVERED |
| 33 | gap classification | validate-research-gap ? classify-research-gap | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 33; source_status=RESTORED |
| 34 | root-cause analysis: 5 Whys / Ishikawa / CRT | drill-root-causes | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 34; source_status=FULLY_COVERED |
| 35 | stakeholder mapping / CSH / JTBD / salience | map-stakeholder-system | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 35; source_status=RESTORED |
| 36 | assumption audit | assumption-stress-test | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 36; source_status=FULLY_COVERED |
| 37 | robustness / alternative models | robustness-analysis | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 37; source_status=FULLY_COVERED |
| 38 | validity envelope / boundary analysis | map-validity-envelope(mode=systematic/boundary/critical-case) | REJECT | phantom mode; architecture contract 38; source_status=COVERED_MODE |
| 39 | Morris screening ? Sobol variance decomposition | sensitivity-analysis ? decompose-global-sensitivity | REJECT | phantom mode; architecture contract 39; source_status=RESTORED |
| 40 | Monte-Carlo uncertainty cascade | sensitivity-analysis ? propagate-uncertainty | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 40; source_status=RESTORED |

