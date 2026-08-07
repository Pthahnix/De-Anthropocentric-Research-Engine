# 📰 paper-reading

**paper-reading** 是 [yogsoth-ai](https://github.com/yogsoth-ai) 生态下的 skill 仓库，专做一件事：**把一篇指定论文读成结构化的东西**。

> 🧭 **属于 [De-Anthropocentric Research Engine](https://github.com/yogsoth-ai/de-anthropocentric-research-engine)。** 与 `literature-engine`、`deep-insight`、`knowledge-acquisition` 同为独立 package——单独构建、单独测试，稳定后再注册进 DARE 主仓。

## 当前状态：v2 — 30 个 SOP 已建成

`skills/` 下全部 30 个可构建 SOP（`context/2026-08-07-13-42-sop-pipeline-graph.html` 的 32 个图节点减去 `grade-out-of-scope`、`csfcube-facet` 两个无对应 skill 的节点）已按 `docs/superpowers/plans/2026-08-07-paper-reading-v2-implementation.md` 逐组写出、经 `scripts/validate_skill.py` 校验、逐组 commit。每个 SOP 都是 `execution: subagent`，经 `spawn-agent` 调度；`paper-fetch` 是唯一入口，也是唯一直接调用 alphaxiv/Semantic Scholar/bioRxiv/medRxiv 检索工具的 SOP，其余 29 个只消费它返回的 `full_text`。

尚未做的：跨 SOP 组合成「策略/战术」层（spec §3 明确推迟）；skill-creator 的 with-skill/baseline 评测循环与 description-triggering 优化循环（按实现时的决定推迟到需要时再单独跑，避免一次性派生 60+ 个 subagent）。

v1（单篇论文 → 微信公众号文章的固定三段式管线，18 个 skill）已整体暂存至 `staged/wechat-article-v1/`，见该目录下的 `STAGED.md`。分支 `v1-wechat-pipeline` 是它的恢复锚点。

v2 换了立足点。v1 只服务一个终点（出一篇文章），schema 是为「写文章好用」设计的；v2 要做的是**一批彼此不同的单篇阅读法**，各自产出不同形状的结构化物，用同一篇论文横向测——测出哪种形状真的扛得住下游需求，再谈优化。

下游有两类，形状要求不同：

- **单篇终点** — 出一篇解读、一份精读笔记、一次质量审计
- **跨篇起点** — 喂给跨篇提取管线（见 `docs/temp/pipeline-preview.md`），此时单篇产出必须**跨篇可对齐**，字段语义不能因论文而异

v2 的 skill 来源分两条线，都是成文、可引的方法论，不自造：

| 线 | 内容 |
|---|---|
| **人类学界的成文阅读法** | Keshav 三遍法、QALMRI、Teufel argumentative zoning、CoreSC、Swales move analysis、CASP / JBI / RoB2 等批判性评估工具、ML Reproducibility Checklist、PRISMA 抽取表 |
| **NLP 的单篇结构化抽取** | CSFCube facet、SciERC / SciREX、TDMS 抽取、QASPER 证据定位、SciFact、ACU / 原子事实分解、nugget 评估、CODA-19 |

每条方法论先做成**初始形态的 skill**，先能跑，再逐个测、逐个优化。不预先套四层架构——层级由实际用法归纳，不由设计预判（这条的论证见 `context/2026-07-29-18-19-paper-reading-pkg-scoping.md` 的红队 checkpoint）。

## 目录

```
skills/         v2 全部 30 个 SOP（已建成）
staged/         暂存的 v1 全套
context/        调研与设计记录（过程线 + 报告线）
docs/           v2 设计 spec 与实现 plan（含 v1 历史，文件名带日期）
docs/temp/      跨篇管线预览
scripts/        validate_skill.py — 通用 SKILL.md 校验器
tests/          test_validate_skill.py
```

## v2 SOP 清单

| 分组 | SOP |
|---|---|
| 入口 | `paper-fetch` |
| Keshav 三遍法 | `first-pass-skim` → `second-pass-grasp` → `third-pass-deep-read` |
| 独立单步 | `qalmri`、`qasper-evidence-qa`、`template-slot-filling`、`question-framing`、`research-question-appraisal`、`dual-column-self-check` |
| 单元分类族 | `unit-segmentation` → `unit-classification` → `rhetorical-structure-quality`（提案）；`multi-stage-cascade-extraction`（SciERC/SciREX/NCG，直连 paper-fetch） |
| 原子单元族 | `atomic-unit-writing` → `atomic-unit-matching` → `atomic-unit-recall-aggregate` |
| SciFact 族 | `claim-writing` → `rationale-selection` → `claim-label-prediction` |
| 门控+偏倚风险族 | `study-design-tool-gate` → `signalling-question-answering` → `domain-level-judgment` → `worst-case-lookup`；`star-awarding` → `sum-threshold-scoring` |
| 清单族 | `quality-appraisal-checklist`（含提案 entry_mode="completeness_check"）、`reporting-standard-checklist`、`engineering-config-grading`（提案）、`reproducibility-third-party-verification`（提案） |

## 调研记录

| 文件 | 内容 |
|---|---|
| `context/2026-07-29-18-19-paper-reading-pkg-scoping.md` | v1 前置调研：DARE 内部谱系盘点、外部方法论横评、「涌现式建 skill」方案的红队审查 |
| `context/2026-08-06-13-24-carry-forward-v1-findings.md` | v1 smoke test 挖出的真缺陷，v2 的设计输入 |
| `context/2026-08-06-16-35-single-paper-reading-sop-research.md` | v2 前置调研：A1/A2/B1/B2 四线铺面 + 7条独立轴线 + 评估取向×关注层次矩阵 |
| `context/2026-08-07-10-26-sop-menu-final.md` | 46 个候选 SOP 完整清单 + 全量 7 轴 tag 表 |
| `context/2026-08-07-13-42-sop-pipeline-graph.html` | SOP 依赖图：46 方法论 → 31 个 SOP 节点，边标注 pipeline 调用序 |
| `context/2026-08-07-14-08-sop-graph-coverage-audit.md` | 依赖图覆盖度审核（Opus 独立核查），修补建议已落实进图 |
