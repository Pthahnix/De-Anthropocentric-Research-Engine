# Paper-Reading Pkg — Context Index

> paper-reading skill pkg 的调研与设计记录。
> 单独归档，与 context/history/ 历史轮次隔离。
>
> **v1**（单篇论文 → 公众号文章，固定三段式）已暂存至 `staged/wechat-article-v1/`，恢复锚点为分支 `v1-wechat-pipeline`。
> **v2** 立足点：一批彼此不同的单篇阅读法，各自产出不同形状的结构化物，同篇横向测。

| File | Phase | Topic | Checkpoints | Last Updated |
|------|-------|-------|-------------|--------------|
| 2026-07-29-18-19-paper-reading-pkg-scoping.md | 方法论盘点 + 假设审查 + 现成产品处理链路横评（alphaXiv/Elicit/Consensus等） | paper-reading pkg 前置调研 | 3 | 2026-07-30 14:13 |
| 2026-08-06-13-24-carry-forward-v1-findings.md | v1 暂存交接 | smoke test 挖出的 3 条真缺陷 + 1 条有效设计，v2 的硬输入 | 0 | 2026-08-06 |
| 2026-08-06-16-35-single-paper-reading-sop-research.md | v2 前置调研（四线铺面→出轴→排列 全部完成，停在菜单+矩阵） | 单篇阅读法轴线矩阵 + 候选 SOP 菜单；A1/A2/B1/B2 四线铺面 + 7条独立轴线 + 评估取向×关注层次主矩阵 | 6 | 2026-08-07 |
| 2026-08-07-10-26-sop-menu-final.md | v2 前置调研收尾（交付） | 完整候选 SOP 清单：42个已核实方法 + 4个补齐矩阵空格的新候选方案 + 全量7轴tag表 | 2 | 2026-08-07 10:26 |
| 2026-08-07-13-42-sop-pipeline-graph.html | v2 实现前架构会话（原子化/去重） | 46个方法论拆分/合并为 SOP 节点的 HTML 依赖图，节点=SOP、有向边=pipeline调用序、边标注覆盖方法。v1 初版22节点 → v2 按覆盖度审核修补为31节点/22边 | - | 2026-08-07 14:5x |
| 2026-08-07-14-08-sop-graph-coverage-audit.md | v2 架构审核（Opus 独立核查） | 22节点图对46方法论的覆盖度审核：点名46/46、可执行30/46，7条严重问题 + 8条粒度问题；根因是同图内两套合并判据。修补建议已全部落实进 v2 图 | - | 2026-08-07 14:08 |
| 2026-08-07-23-01-sop-io-contract-simulation.md | v2 架构 · I/O 契约重定 | 取消预设 input：双 tactic（Keshav 精读 / SciFact 论断核验）在 Kimi K3 上仿真流水，得 7 条结论。核心=流型有累积/变换两种且需负字段 withholds，`execution: subagent` 一律化与「承接上文」机械冲突；契约由两键改五键；SciFact 因 citance 无处取而当前起不来 | 1 | 2026-08-07 23:01 |
