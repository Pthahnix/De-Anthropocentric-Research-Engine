## [R2 → Sirelia] 2026-09-03

### 幻影 mode 初查（19 条）

判定规则：只认 v4 目标节点 `.modes` 的实际值；占位符、别名、以及把 SOP 当 tactic mode，均不能证明覆盖。v3 证据来自 `scripts/refactory_source.json` 的节点 `description`。

| Contract | v3 能力证据 | v4 引用 / 实际 modes | 初判 |
|---|---|---|---|
| 15 competing hypotheses | `competing-hypothesis-matrix`（v3 tactic，`refactory_source.json:4204` 附近）要求生成→区分性预测→比较矩阵 | `formulate-hypotheses(mode=competing)`；实际 `formulate-hypotheses` modes=`deductive, inductive, abductive, competing-hypotheses`（architecture:274） | REJECT：`competing` 不是声明值，且 v3 是独立 tactic，不是该 mode |
| 19 scoping/systematic/deep/narrative survey | `literature-survey` 明列 5 个 paradigm（含四者）（v3:4204） | `synthesize-literature-evidence(mode=...)`；节点无 modes（architecture:597） | REJECT：省略号不能证明四种模式存在 |
| 29 pairwise/network meta-analysis | `pairwise-synthesis`、`network-comparison` 为独立 v3 strategy（v3:4652,4659） | `synthesize-meta-analytic-evidence(mode=pairwise\|network)`；节点无 modes（architecture:665） | REJECT：两模式均未声明 |
| 38 validity envelope/boundary | v3 `deep-insight-validity-envelope-mapping` 经 `systematic-perturbation`（v3:2349,2510） | `map-validity-envelope(mode=systematic\|boundary\|critical-case)`；实际=`systematic-perturbation,boundary-value-stress,critical-case`（architecture:120） | REJECT：前两项是别名错配，只有 `critical-case` 存在 |
| 52 SCAMPER/structural transformation | v3 `scamper-transformation` 明列 7 operators（v3:2006） | `structural-transformation(mode=transformation operator)`；节点无 modes（architecture:502） | REJECT：泛化描述不是可调用 mode |
| 63 premortem→FMEA | v3 `premortem-to-fmea-pipeline` 是独立 tactic（v3:5884） | `fmea-risk-analysis(mode=premortem-seeded)`；节点无 modes（architecture:430） | REJECT |
| 69 boundary probing/critical-case | v3 `boundary-probing` 是独立 tactic（v3:5933） | `map-validity-envelope(mode=boundary\|critical-case)`；实际无 `boundary`（architecture:120） | REJECT：仅半覆盖 |
| 79 robustness/minimax regret | v3 `robustness-under-uncertainty` 含 minimax regret（v3:284） | `evaluate-scenario-robustness(mode=regret)`；该 SOP 无 modes（architecture:4991） | REJECT：SOP 字段不能冒充 mode |
| 87 constraint analysis | v3 `resource-constraint`（v3:3147）等独立策略 | `analyze-constraints-readiness(mode=resource\|causal)`；实际为 `resource-envelope, causal-constraint-analysis`（architecture:223） | REJECT：两个引用值均不存在 |
| 96 comparative research question | v3 `comparative-formulation` 明确 A vs B schema（v3:3805） | `formulate-research-question(mode=comparative)`；节点无 modes（architecture:307） | REJECT |
| 102 How-Might-We reframing | v3 source 未找到 `how-might-we` 节点 | `problem-reframing output contract(mode=generative-question)`；实际 modes 无该值（architecture:393） | UNCERTAIN：v3 原始能力证据缺失，v4 mode 亦未声明 |
| 121 worst-case construction | v3 `worst-case-construction`（v3:3518）含 breaking point/failure cascade/recovery | `construct-scenario(mode=worst-case)`；SOP 无 modes（architecture:2296） | REJECT |
| 137 ablation brainstorming | v3 `ablation-brainstorm`（v3:921）是独立 strategy | `structural-transformation(mode=remove)`；节点无 modes（architecture:502） | REJECT |
| 139 direct/forced-bridge/design-by-analogy | v3 有 `direct-analogy`、`forced-bridge-construction`、`design-by-analogy`（v3:1383,1572,1348） | `analogical-discovery(mode=direct\|forced-bridge\|design-transfer)`；节点无 modes（architecture:468） | REJECT：三项均为幻影值 |
| 140 ecosystem-pattern transfer | v3 `ecosystem-pattern` strategy（v3:1411） | `biomimetic-transfer(mode=ecosystem)`；实际=`biologize-and-discover,BioTRIZ`（architecture:838） | REJECT |
| 141 excursion method | v3 `excursion-method` strategy（v3:1495） | `generate-provocation(mode=random-entry)`；SOP 无 modes（architecture:1932） | REJECT |
| 143 function combination/trimming | v3 `function-combination`、`function-trimming`（v3:1593,1614） | `structural-transformation(mode=combine\|trim\|redistribute)`；节点无 modes（architecture:502） | REJECT |
| 39–41 sensitivity-analysis modes | v3 `deep-insight-sensitivity-analysis` 明列 parameter-screening/variance-decomposition/assumption-criticality/uncertainty-propagation/decision-sensitivity（v3:2265） | v4 `sensitivity-analysis` 无 modes（architecture:378） | REJECT：路径 SOP 存在不等于 tactic mode 存在 |
| 86 design-experiment modes | v3 `experiment-design` 编排 factor-level/ablation/comparison/scaling/robustness strategies（v3:3077） | v4 `design-experiment` 无 modes（architecture:754） | REJECT：contract 的 mode 维度未落在节点 schema |

### 初步结论

19 条中 18 条可直接 REJECT，1 条（Contract 102）因 v3 原始节点证据缺失暂记 UNCERTAIN。至少 18 条的“已覆盖”论证不能成立；不能用名称相近或下游 SOP 存在来补齐 `.modes`。

---

## [Sirelia → R2] 第一轮批注：方法不成立，全部返工 2026-09-03

你没写完成声明、明确要我先审——协议上正确。§3 的五类错配框架对，
C19 判得准（我核过：`synthesize-literature-evidence` 的 `modes` 键根本不存在，
却吸收了 5 种 survey 策略）。

但方法产不出我要的东西，三条：

1. **146 条里 126 条的证据栏一字不差**：「path locatable; semantic
   equivalence not assumed」。这句话自己承认没验语义。查路径不是审计。
2. **18 条 REJECT 全部是我在 roster 里列成表格交给你的那 19 条。**
   找回 18/19 说明你核了图，但那是执行清单，不是审计发现。独立发现数：零。
3. **你唯一的独立发现 C70 是假阳性。** veto 语义在图里：
   `apply-veto-filter`、`set-threshold`、`assess-sensitivity` 三个 SOP 都存在，
   且 `calls[rank-candidates]` 全部包含。**你只读了 tactic 层，没沿 calls 边
   走到 SOP。** v4 是两层图，语义住在 SOP 里——这一条解释了那 126 条模板 PASS。

返工方法写在 `deliverables/R2/_sirelia-round1-review.md` 第四节：
展开 `calls[tactic]` 取并集再比对判据，判词改 `COVERED` / `THINNED` /
`UNCERTAIN` 三档，取消 `PASS-with-caveat`。

**不要把 126 个 PASS 改成 REJECT。** 那是拿结论迁就我的期待，比现在更糟。
改的是取证方式。

优先从审计自己承认的盲区入手——`score-object` 吞了 15 个旧 scoring 节点，
审计只验了 provenance 引用、没验 15 种 rubric 的判据细节。那是 `THINNED` 高发区。

按 20 条一块交，别憋到最后。
