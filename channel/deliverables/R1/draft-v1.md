# R1 设计草案：Spec 归属与运行时边界

## 选择

选择 A：Research Spec 留在 DARE 产品层，作为由 checkpoint 事件流重建的 out-of-graph 计划投影视图；不把 Spec、catalog 或 context 伪装成 tactic/SOP，也不新增第四执行层。Spec 规定阶段、输入、完成判据、回退与 context 协议；运行时只执行这些约束。

## 论证

Spec 是由 checkpoint 事件流重建的当前研究意图与执行契约投影视图，必须可审阅、可恢复、可验证，因此不能交给 host 的临时记忆。catalog 作为产品层索引，读取 v4 tactic/SOP 图的描述与引用表，负责能力发现，不成为科研图节点。每个 Phase 一个 context 文件，checkpoint 追加写入，INDEX 只做索引；host 以最后一个完整 checkpoint 恢复，并将 `ResearchStateDelta` 八字段按追加、去重、显式冲突规则合并。运行时拥有调度、预算、重试、并行、代理派发和监控；科研 tactic 只返回 delta，不决定 provider 或存储。

## 七条 MOVED_RUNTIME 初判

| 原 capability | 归属 | 判定 |
|---|---|---|
| actor-profiling | DARE 产品层：research-context 输入契约 | 移出 runtime；host 负责采集，Spec 定义字段与缺失处理 |
| engine-core / context-management / checkpointing | runtime control plane | 保留，负责持久化、恢复与 delta 合并 |
| subagent-spawning / implementer-dispatch | runtime control plane | 保留，代理数量与执行器由 host 决定 |
| knowledge compilation / vault maintenance | artifact/storage layer | 不属于 runtime；由 artifact 规范与外部存储接收 |
| implementation dependency planning | 分裂归属 | 科研依赖图留在 `plan-experiment-implementation`；通用执行依赖归 runtime |
| critical-path duration / buffering / dispatch / monitoring | runtime control plane | 保留，负责工期、缓冲、派发与观测 |
| experiment-running agent dispatch / monitoring | runtime control plane | 保留，实验执行编排不进入科研图 |

## 对下游影响

- R3：catalog 采用产品层引用索引；用户可见的是 Spec 入口与阶段状态，不新增图层。
- R5：`input_contract` / `output_contract` 属于各 tactic/SOP 正文或 registry；运行时字段只定义 delta 与执行元数据。
- R2：七条中 4 条纯 runtime，2 条明确移至产品/artifact，1 条按科学依赖与通用执行拆分，审计应按拆分后的接收方更新 status。
