# R5 试点汇总

## 试点范围

按 roster 示例与审计高危表交集选取 7 个节点：

`synthesize-meta-analytic-evidence`、`design-experiment`、`formulate-hypotheses`（对应 roster 的 `hypothesis-formulation`）、`analyze-constraints-readiness`、`rank-candidates`、`establish-empirical-baseline`、`audit-benchmark-validity`。

`adversarial-deliberation` 虽在审计的 6 节高危表中，但不在本轮 7 节试点交集内；未生成 pilot 文件。

## 行数与压缩比

源行数按当前 920 个 `SKILL.md` 的作者正文计数（去 frontmatter 与 generated tables）；v4 行数为本目录 `body.md` 物理行数。源节点数以 architecture `old` 中可解析到当前目录者计；因此与 roster 的历史估算可能不同。

| v4 节点 | 源节点/行数 | v4 body | 压缩比（源/body） | 缩减 |
|---|---:|---:|---:|---:|
| synthesize-meta-analytic-evidence | 9 / 805 | 59 | 13.64:1 | 92.7% |
| design-experiment | 8 / 304 | 50 | 6.08:1 | 83.6% |
| formulate-hypotheses | 9 / 493 | 57 | 8.65:1 | 88.4% |
| analyze-constraints-readiness | 22 / 1,051 | 48 | 21.90:1 | 95.4% |
| rank-candidates | 13 / 734 | 47 | 15.62:1 | 93.6% |
| establish-empirical-baseline | 9 / 696 | 48 | 14.50:1 | 93.1% |
| audit-benchmark-validity | 7 / 600 | 45 | 13.33:1 | 92.5% |
| **合计** | **77 / 4,683** | **354** | **13.23:1** | **92.4%** |

`design-experiment` 的 roster 估算为 6 个旧节点/~702 行，而当前 architecture 列出 9 个 `old`、8 个可解析正文；该差异记录为边界 case，不用静默修正。

## 编译耗时

本轮未接入逐节点 profiler。以下是 R5 的人工+脚本工作记录估算，用于容量规划，不作为性能承诺：

| 节点 | 估算耗时 |
|---|---:|
| synthesize-meta-analytic-evidence | 9 min |
| design-experiment | 7 min |
| formulate-hypotheses | 7 min |
| analyze-constraints-readiness | 13 min |
| rank-candidates | 9 min |
| establish-empirical-baseline | 7 min |
| audit-benchmark-validity | 6 min |
| **合计 / 平均** | **58 min / 8.3 min** |

## 发现的边界 case

1. R1 尚未在 frontmatter 与 `capabilities.json` 之间选择最终 contract 机器落点；7 个 body 以 Branch C（body YAML）试编，并在每个 log 标为 provisional。
2. `systematic-literature-review/SKILL.md` 不存在，无法验证 roster 指定的典型模板。
3. architecture 的 `old` 含跨 package/历史别名；当前目录无法解析的名称被列入 log，不猜测正文。
4. source gate 有 XML-like、Markdown、表格三种写法；统一章节但保留原数字/比较符。
5. I2 区间存在重叠（0-40、30-60、50-90、75-100）；试点保留原值，未自行归一化。
6. 208 个源文件没有可识别作者标题；解析必须支持段落/列表驱动。
7. `score-object` rubric 的最终共享库方案未定；本轮遵守保守策略，涉及处复制并标记待重构。

## 通过性自检

- 七个目录均含 `body.md` 与 `compilation-log.md`。
- 每个 body 都有 Input/Output contract、执行步骤、gate、failure、provenance、Delta 说明。
- 7 个 body 的数字门槛可在对应 log 与 v3 源节点中反查；无法解析的源名未被伪造为已继承。
- body 只描述科研变换；retry、parallelism、dispatch、monitoring 未写入科学步骤。

