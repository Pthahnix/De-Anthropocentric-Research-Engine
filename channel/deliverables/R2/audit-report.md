# R2 Regression Audit Report (DARE v4)

Scope: 146 capability contracts in architecture JSON, cross-checked with refactory_source.json.

| Contract ID | v3 capability | v4 path | Verdict | Evidence / reason |
|---|---|---|---|---|
| 1 | cold-start / warm-start / hot-start | entry-depth policy ? profile / landscape / rank / obstacles / goal | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 1; source_status=COVERED_MODE |
| 2 | actor-profiling | research-context input contract | UNCERTAIN | R1/Sirelia裁定要求重定验收条件；旧的 runtime-boundary.md:2.1 不再作为最终证据 |
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
| 41 | decision sensitivity / value of information | sensitivity-analysis ? quantify-information-value | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 41; source_status=RESTORED |
| 42 | scaling frontier / regime analysis | robustness-analysis / map-validity-envelope ? analyze-scaling-regime | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 42; source_status=RESTORED |
| 43 | multi-perspective reframing | problem-reframing ? problem-reframing(mode=perspective-shift) | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 43; source_status=RESTORED |
| 44 | wickedness assessment | problem-reframing ? assess-problem-wickedness | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 44; source_status=RESTORED |
| 45 | appreciative reframing | problem-reframing ? appreciative-reframe | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 45; source_status=RESTORED |
| 46 | dialectical escalation | problem-reframing ? adversarial-deliberation | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 46; source_status=COVERED_MULTI_PATH |
| 47 | cross-domain analogy | analogical-discovery | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 47; source_status=FULLY_COVERED |
| 48 | biomimicry / BioTRIZ | biomimetic-transfer | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 48; source_status=RESTORED |
| 49 | conceptual blending / emergent properties | conceptual-blending | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 49; source_status=RESTORED |
| 50 | morphological exploration | explore-dimensional-space(mode=morphological-generation) | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 50; source_status=COVERED_MODE |
| 51 | TRIZ contradiction/separation | resolve-inventive-contradiction | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 51; source_status=RESTORED |
| 52 | SCAMPER / structural transformation | structural-transformation(mode=transformation operator) | REJECT | phantom mode; architecture contract 52; source_status=COVERED_MODE |
| 53 | Six Hats / role forcing / personal analogy | problem-reframing(mode=perspective-shift) | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 53; source_status=RESTORED |
| 54 | random entry / concept fan / stepping-stone constraints | destructive-ideation + restored lateral SOPs | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 54; source_status=RESTORED |
| 55 | assumption destruction / provocation | destructive-ideation | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 55; source_status=FULLY_COVERED |
| 56 | evolution strategy / variation-selection | evolve-solution-population | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 56; source_status=RESTORED |
| 57 | white-space search / systematic enumeration | coverage-white-space-search ? explore-dimensional-space | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 57; source_status=COVERED_MULTI_PATH |
| 58 | Synectics direct/symbolic/personal/fantasy excursions | analogical-discovery + conceptual-blending + problem-reframing(mode=perspective-shift) | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 58; source_status=COVERED_MULTI_PATH |
| 59 | critic-defender-judge / courtroom debate | adversarial-deliberation | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 59; source_status=COVERED_MODE |
| 60 | confidence escalation/calibration across debate rounds | adversarial-deliberation ? calibrate-adversarial-confidence | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 60; source_status=RESTORED |
| 61 | structured red-team attack campaign | structured-red-team | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 61; source_status=FULLY_COVERED |
| 62 | assumption cascade | structured-red-team ? trace-assumption-cascade | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 62; source_status=RESTORED |
| 63 | premortem ? FMEA | fmea-risk-analysis(mode=premortem-seeded) | REJECT | phantom mode; architecture contract 63; source_status=COVERED_MODE |
| 64 | mitigation validation | fmea-risk-analysis ? validate-mitigation-effect | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 64; source_status=RESTORED |
| 65 | factor removal / counterfactual probing | counterfactual-causal-analysis | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 65; source_status=FULLY_COVERED |
| 66 | minimal-change search | counterfactual-causal-analysis ? search-minimal-flip | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 66; source_status=RESTORED |
| 67 | causal necessity/sufficiency testing | counterfactual-causal-analysis ? evaluate-necessity-sufficiency | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 67; source_status=RESTORED |
| 68 | reductio / contradiction / counterexample | reductio-counterexample-analysis | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 68; source_status=FULLY_COVERED |
| 69 | boundary probing / critical-case design | map-validity-envelope(mode=boundary/critical-case) | REJECT | phantom mode; architecture contract 69; source_status=COVERED_MODE |
| 70 | MCDA best/full/category/veto/weighted | rank-candidates(mode=...) | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 70; source_status=COVERED_MODE |
| 71 | pairwise active ranking | pairwise-ranking | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 71; source_status=FULLY_COVERED |
| 72 | Delphi / consensus rounds | structured-consensus | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 72; source_status=FULLY_COVERED |
| 73 | probabilistic futures calibration | structured-consensus ? calibrate-probability-forecast | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 73; source_status=FULLY_COVERED |
| 74 | readiness / feasibility | analyze-constraints-readiness | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 74; source_status=COVERED_MODE |
| 75 | Stage-Gate GO/KILL/RECYCLE | analyze-constraints-readiness ? apply-stage-gate | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 75; source_status=RESTORED |
| 76 | portfolio Pareto/value selection | portfolio-optimization | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 76; source_status=FULLY_COVERED |
| 77 | portfolio diversity / niche coverage | portfolio-optimization ? measure-portfolio-diversity | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 77; source_status=FULLY_COVERED |
| 78 | Real Options / temporal sequencing | portfolio-optimization ? evaluate-optionality | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 78; source_status=FULLY_COVERED |
| 79 | robustness under uncertainty / minimax regret | portfolio-optimization ? evaluate-scenario-robustness(mode=regret) | REJECT | phantom mode; architecture contract 79; source_status=RESTORED |
| 80 | steelman / resurrection / winner stress | adversarial-deliberation(mode=...) | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 80; source_status=COVERED_MODE |
| 81 | ontology concept decomposition / hierarchy / consistency | build-domain-ontology | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 81; source_status=FULLY_COVERED |
| 82 | causal evidence / feedback / intervention / counterfactual | construct-causal-model | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 82; source_status=FULLY_COVERED |
| 83 | dimensional analysis | explore-dimensional-space(mode=research-space-mapping) | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 83; source_status=COVERED_MODE |
| 84 | argument mapping / counterclaims / evidence | construct-argument-map | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 84; source_status=FULLY_COVERED |
| 85 | knowledge compilation / vault maintenance | artifact/storage layer | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 85; source_status=MOVED_RUNTIME |
| 86 | factorial / ablation / metric / sample-size / statistics design | design-experiment | REJECT | phantom mode; architecture contract 86; source_status=FULLY_COVERED |
| 87 | constraint analysis | analyze-constraints-readiness(mode=resource/causal) | REJECT | phantom mode; architecture contract 87; source_status=COVERED_MODE |
| 88 | scenario planning | analyze-future-scenarios | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 88; source_status=FULLY_COVERED |
| 89 | implementation dependency planning | host execution planner | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 89; source_status=MOVED_RUNTIME |
| 90 | critical-path duration / buffering / dispatch / monitoring | host execution planner/runtime | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 90; source_status=MOVED_RUNTIME |
| 91 | statistical result analysis / reproducibility | analyze-experiment-results | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 91; source_status=FULLY_COVERED |
| 92 | deductive hypothesis generation | formulate-hypotheses(mode=deductive) ? falsifiability-audit | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 92; source_status=FULLY_COVERED |
| 93 | inductive hypothesis generation | formulate-hypotheses(mode=inductive): extract-empirical-regularity ? identify-variables ? specify-relationship ? falsifiability-audit | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 93; source_status=RESTORED |
| 94 | abductive hypothesis generation / anomaly-driven-abduction | formulate-hypotheses(mode=abductive): characterize-anomaly ? generate-competing-hypotheses ? score-object(plausibility) ? falsifiability-audit | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 94; source_status=RESTORED |
| 95 | research-question scope calibration | formulate-research-question ? adjust-abstraction-scope ? assess-question-quality | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 95; source_status=RESTORED |
| 96 | comparative research question | formulate-research-question(mode=comparative) ? apply-question-framework ? define-criteria | REJECT | phantom mode; architecture contract 96; source_status=COVERED_MODE |
| 97 | feasibility-constrained research question | formulate-research-question ? analyze-constraints-readiness ? adjust-abstraction-scope | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 97; source_status=COVERED_MULTI_PATH |
| 98 | tension-mining / polarity mapping | problem-reframing ? map-productive-polarity | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 98; source_status=RESTORED |
| 99 | question-reformulation / abstraction laddering | problem-reframing ? adjust-abstraction-scope ? formulate-research-question | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 99; source_status=RESTORED |
| 100 | evaporating-cloud conflict dissolution | problem-reframing ? extract-core-conflict ? surface-assumptions ? design-mitigation | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 100; source_status=COVERED_MULTI_PATH |
| 101 | Socratic probing | problem-reframing ? surface-assumptions ? challenge-assumption ? construct-critique | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 101; source_status=COVERED_MULTI_PATH |
| 102 | How-Might-We reframing | problem-reframing output contract(mode=generative-question) | UNCERTAIN | phantom mode; architecture contract 102; source_status=COVERED_INLINE |
| 103 | boundary critique / CSH inclusion-exclusion | map-stakeholder-system ? assess-system-boundary | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 103; source_status=FULLY_COVERED |
| 104 | uncertainty propagation / Monte Carlo | sensitivity-analysis ? propagate-uncertainty | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 104; source_status=FULLY_COVERED |
| 105 | decision sensitivity / value of information | sensitivity-analysis ? quantify-information-value | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 105; source_status=FULLY_COVERED |
| 106 | falsification-first-stress-test campaign | falsification-first-audit | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 106; source_status=RESTORED |
| 107 | adversarial-debate-truthseeking | falsification-first-audit(mode=truthseeking-debate) ? adversarial-deliberation as needed | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 107; source_status=COVERED_MODE |
| 108 | red-team-truthseeking | falsification-first-audit(mode=truthseeking-red-team) ? structured-red-team as needed | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 108; source_status=COVERED_MODE |
| 109 | isomorphism-falsification | audit-structural-equivalence | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 109; source_status=RESTORED |
| 110 | circular-validation-audit | audit-validator-independence | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 110; source_status=RESTORED |
| 111 | independent-convergence-audit | audit-convergence-independence | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 111; source_status=RESTORED |
| 112 | elegance-trap-probe | audit-explanatory-compression | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 112; source_status=RESTORED |
| 113 | BROKEN / CORROBORATED / UNFALSIFIABLE truth-seeking verdict | classify-falsification-verdict | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 113; source_status=RESTORED |
| 114 | patent claim breadth / vulnerability analysis | assess-prior-art-and-claims ? assess-patent-claim-scope | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 114; source_status=RESTORED |
| 115 | benchmark saturation / ceiling analysis | audit-benchmark-validity ? analyze-leaderboard-dynamics | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 115; source_status=FULLY_COVERED |
| 116 | patent competitive-intelligence portfolio profile | mine-patent-landscape ? categorize-evidence ? analyze-patent-citation-network ? analyze-temporal-trajectory | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 116; source_status=COVERED_MULTI_PATH |
| 117 | snowball seed selection | synthesize-literature-evidence ? select-seed-evidence ? trace-citation-neighborhood | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 117; source_status=COVERED_MODE |
| 118 | taxonomy mapping of literature | synthesize-literature-evidence ? categorize-evidence ? build-domain-ontology | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 118; source_status=COVERED_MULTI_PATH |
| 119 | thematic coding | synthesize-literature-evidence ? categorize-evidence | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 119; source_status=FULLY_COVERED |
| 120 | negative-space gap identification from literature | synthesize-literature-evidence ? detect-coverage-gap | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 120; source_status=FULLY_COVERED |
| 121 | stress-scenario / worst-case construction | analyze-future-scenarios ? construct-scenario(mode=worst-case) | REJECT | phantom mode; architecture contract 121; source_status=COVERED_MODE |
| 122 | morphological scenario planning | analyze-future-scenarios ? define-analysis-dimensions ? enumerate-dimension-values ? evaluate-compatibility | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 122; source_status=COVERED_MULTI_PATH |
| 123 | competitive scenario | analyze-future-scenarios ? predict-competitive-move | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 123; source_status=FULLY_COVERED |
| 124 | temporal scenario | analyze-future-scenarios ? analyze-temporal-trajectory | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 124; source_status=FULLY_COVERED |
| 125 | narrative scenario consistency | analyze-future-scenarios ? construct-scenario ? evaluate-compatibility | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 125; source_status=COVERED_MULTI_PATH |
| 126 | experiment-running agent dispatch / monitoring | host runtime / coding agent / scheduler | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 126; source_status=MOVED_RUNTIME |
| 127 | collective adjudication / independent judge ballots | pairwise-ranking ? collect-independent-judgments ? aggregate-ranking | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 127; source_status=RESTORED |
| 128 | social-choice aggregation (Condorcet/Schulze/Borda/Kemeny/Copeland) | aggregate-ranking(rule=...) | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 128; source_status=COVERED_MODE |
| 129 | disagreement mapping | structured-consensus ? map-disagreement | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 129; source_status=FULLY_COVERED |
| 130 | argument crystallization | structured-consensus ? construct-argument-map | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 130; source_status=COVERED_MULTI_PATH |
| 131 | appropriateness bounding / stop criteria | structured-consensus ? set-threshold + runtime stopping policy | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 131; source_status=COVERED_MULTI_PATH |
| 132 | evidence hierarchy / evidence weighing | construct-argument-map ? attach-evidence-to-relation ? score-object(object=evidence) ? update-confidence-from-evidence | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 132; source_status=COVERED_MULTI_PATH |
| 133 | ontology alias/merge | build-domain-ontology ? canonicalize-entity | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 133; source_status=FULLY_COVERED |
| 134 | causal feedback loops | construct-causal-model ? detect-feedback-loop | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 134; source_status=FULLY_COVERED |
| 135 | causal intervention reasoning | construct-causal-model ? analyze-intervention | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 135; source_status=FULLY_COVERED |
| 136 | argument counterclaim / defeater mapping | construct-argument-map ? document-counterclaim ? attach-defeater | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 136; source_status=FULLY_COVERED |
| 137 | ablation brainstorming | structural-transformation(mode=remove) ? evaluate-compatibility | REJECT | phantom mode; architecture contract 137; source_status=COVERED_MODE |
| 138 | anti-benchmark / benchmark inversion | audit-benchmark-validity ? destructive-ideation ? coverage-white-space-search | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 138; source_status=COVERED_MULTI_PATH |
| 139 | forced bridge / direct analogy / design-by-analogy | analogical-discovery(mode=direct/forced-bridge/design-transfer) | REJECT | phantom mode; architecture contract 139; source_status=COVERED_MODE |
| 140 | ecosystem-pattern transfer | biomimetic-transfer(mode=ecosystem) | REJECT | phantom mode; architecture contract 140; source_status=COVERED_MODE |
| 141 | excursion method | generate-provocation(mode=random-entry) ? problem-reframing(mode=perspective-shift) ? analogical-discovery | REJECT | phantom mode; architecture contract 141; source_status=COVERED_MULTI_PATH |
| 142 | failure-taxonomy ideation | enumerate-failure-modes ? coverage-white-space-search ? fmea-risk-analysis | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 142; source_status=COVERED_MULTI_PATH |
| 143 | function combination / trimming | structural-transformation(mode=combine/trim/redistribute) | REJECT | phantom mode; architecture contract 143; source_status=COVERED_MODE |
| 144 | factorial/design-space ideation | explore-dimensional-space | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 144; source_status=FULLY_COVERED |
| 145 | reverse brainstorming / sacred-cow challenge | destructive-ideation(mode=reverse/sacred-cow) | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 145; source_status=COVERED_MODE |
| 146 | symbolic analogy / compressed-conflict ideation | conceptual-blending ? resolve-inventive-contradiction | PASS-with-caveat | path locatable; semantic equivalence not assumed; architecture contract 146; source_status=COVERED_MULTI_PATH |

## 2. Phantom-mode audit

19 phantom-mode audit items: 18 REJECT and C102 UNCERTAIN. `map-validity-envelope` declares only systematic-perturbation, boundary-value-stress, critical-case (architecture:120); `analogical-discovery`, `sensitivity-analysis`, `synthesize-literature-evidence`, `synthesize-meta-analytic-evidence`, `design-experiment`, `structural-transformation`, and `fmea-risk-analysis` have empty modes arrays (architecture:378,430,468,502,597,665,754).

## 3. Object-mismatch findings

Sequence: C2 moves actor-profiling from v3 startup elicitation to a product input contract. Sirelia裁定已废止 R1 §2 的旧 Spec 形态描述；actor-profiling 验收条件待 R1 重定，当前 UNCERTAIN。

Granularity: C19 collapses v3 literature-survey paradigms into one v4 node with no modes (architecture:6195,597). REJECT.

Input/output: C39 Morris-to-Sobol requires numeric parameter/distribution inputs and interaction attribution; v4 only names an SOP path and no tactic modes (architecture:6335,378). REJECT.

Subject: C10 subagent spawning and implementer dispatch are runtime responsibilities after R1; this is ownership transfer, not scientific coverage (runtime-boundary.md:5.5).

Strength: C70 v3 MCDA includes veto and sensitivity gates; v4 rank-candidates does not prove veto semantics or failure outputs. PASS-with-caveat only.

## 4. MOVED_RUNTIME update

| Contract | R1 result | R2 verdict | Evidence |
|---|---|---|---|
| 2 | PENDING_R1_REJUDGMENT | UNCERTAIN | Sirelia裁定：actor-profiling 验收条件待重定 |
| 9 | MOVED_RUNTIME | PASS-with-caveat | runtime-boundary.md:3-4 |
| 10 | MOVED_RUNTIME | PASS-with-caveat | runtime-boundary.md:5.5-6 |
| 85 | MOVED_ARTIFACT | PASS-with-caveat | runtime-boundary.md:6 |
| 89 | SPLIT | PASS-with-caveat | runtime-boundary.md:6 |
| 90 | MOVED_RUNTIME | PASS-with-caveat | runtime-boundary.md:5.3-5.6 |
| 126 | MOVED_RUNTIME | PASS-with-caveat | runtime-boundary.md:5.5-5.6 |

## 5. Reversal statistics

- REJECT: 18
- UNCERTAIN: 2
- PASS-with-caveat: 126
- Unqualified PASS: 0

No completion declaration written. Sirelia must review and write the exact GOAL ACHIEVED line in 00-escalation.md.
