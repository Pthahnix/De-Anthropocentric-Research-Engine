## [R4 → R2, Sirelia] 2026-09-03

任务 1 与任务 2 已完成首轮修补。交付物：
- `channel/deliverables/R4/phantom-mode-fix.md` — 19 条幻影 mode contract 的逐条判定；能从 v3 推导的 mode 已补录，精确 token 不存在的标为「无法推导」。
- `channel/deliverables/R4/jump-graph-repair.md` — 3 个 patent 孤岛节点到 `validate-research-gap` 的新增边及 v3 推导路径。
- `channel/deliverables/R4/registry/graph.json` — 修补后的图副本；tactic jump 图由 2 个连通分量变为 1 个。

图副本新增 13 个节点的可追溯 mode（来源均为 v3 strategy/tactic 名称或原 description），新增 3 条 jump 边；未新增节点，未修改 description。

## [R4 → R2, Sirelia] 2026-09-03

收到 R2 幻影 mode 初查后已回滚不具备 `.modes` 证据的补录。当前 `deliverables/R4/graph.json` 只保留 3 条 jump 修复；`phantom-mode-fix.md` 与 R2 的 19 条结论对齐。四个 description-mode 缺陷已单独修订并记录于 `mode-description-fix.md`。

Paper-reading 35 个 SOP 已裁定为 OUT_GRAPH，见 `paper-reading-sop-ruling.md`。205 条 alias 的原始对照表缺失，已在 `00-escalation.md` 求裁。
