# 幻影 mode 修复

依据 R2 初查：v3 `refactory_source.json` 没有可供这些 contract 直接继承的 `.modes` 字段；独立 v3 strategy/tactic 名称不能冒充 v4 mode。故本块不擅自补 mode，只记录应退回的 contract。

| Contract | 节点 ID | 引用 mode | v4 实际 modes | v3 证据 | 操作 |
|---|---|---|---|---|---|
| C015 | `formulate-hypotheses` | `competing` | `deductive, inductive, abductive, competing-hypotheses` | `competing-hypothesis-construction` 是独立 strategy/tactic 路径 | 无法推导，退回 R2 |
| C019 | `synthesize-literature-evidence` | `…` | 空 | v3 为 5 个独立 survey strategy | 无法从省略号补录，退回 R2 |
| C029 | `synthesize-meta-analytic-evidence` | `pairwise, network` | 空 | v3 `pairwise-synthesis` / `network-comparison` 是独立 strategy | 无法推导，退回 R2 |
| C038 | `map-validity-envelope` | `systematic, boundary` | `systematic-perturbation, boundary-value-stress, critical-case` | v3 使用 `systematic-perturbation` / `boundary-probing` | 精确 token 不存在，不改 |
| C052 | `structural-transformation` | `transformation operator` | 空 | v3 `scamper-transformation` 是 7 操作 strategy | 泛化描述不是 mode，不改 |
| C063 | `fmea-risk-analysis` | `premortem-seeded` | 空 | v3 `premortem-to-fmea-pipeline` 是独立 tactic | 无法推导，不改 |
| C069 | `map-validity-envelope` | `boundary` | `systematic-perturbation, boundary-value-stress, critical-case` | v3 `boundary-probing` 独立 tactic | 精确 token 不存在，不改 |
| C079 | `evaluate-scenario-robustness` | `regret` | 空 | v3 `robustness-under-uncertainty` strategy 含 minimax regret | strategy 名称不能冒充 mode，不改 |
| C087 | `analyze-constraints-readiness` | `resource, causal` | `resource-envelope, causal-constraint-analysis` | v3 `resource-constraint` 等为独立 strategy | 精确 token 不存在，不改 |
| C096 | `formulate-research-question` | `comparative` | 空 | v3 `comparative-formulation` 是独立 strategy | 无法推导，不改 |
| C102 | `problem-reframing` | `generative-question` | 无 | v3 未发现 How-Might-We 节点 | 不确定，交 R2 |
| C121 | `construct-scenario` | `worst-case` | 空 | v3 `worst-case-construction` 是独立 SOP | 无法推导，不改 |
| C137 | `structural-transformation` | `remove` | 空 | v3 `function-trimming` / SCAMPER strategy | 独立 strategy 不是 mode，不改 |
| C139 | `analogical-discovery` | `direct, forced-bridge, design-transfer` | 空 | v3 三个独立 analogy strategy | 无法推导，不改 |
| C140 | `biomimetic-transfer` | `ecosystem` | `biologize-and-discover, BioTRIZ` | v3 `ecosystem-pattern` 是独立 strategy | 无法推导，不改 |
| C141 | `generate-provocation` | `random-entry` | 空 | v3 `random-entry` 是独立 strategy | 无法推导，不改 |
| C143 | `structural-transformation` | `combine, trim, redistribute` | 空 | v3 `function-combination`, `function-trimming` 等独立 strategy | 无法推导，不改 |
| C039–C041 | `sensitivity-analysis` | v3 mode 组 | 空 | v3 `parameter-screening` 等为独立 strategy | 无法推导，不改 |
| C086 | `design-experiment` | factorial/ablation/comparison/scaling/robustness | 空 | v3 五个 design strategy | 无法推导，不改 |

结论：19 条审计项中 18 条应 REJECT，C102 保持 UNCERTAIN；本修复块未新增 mode。
