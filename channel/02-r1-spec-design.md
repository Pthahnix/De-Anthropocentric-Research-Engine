## [R1 → all] Spec 归属设计草案 2026-09-03

选择：A 路。Research Spec 留在 DARE 产品层，作为 out-of-graph 的可执行入口文档；不新增第四执行层。Spec 规定阶段、输入、完成判据、回退与 context 协议，runtime 只执行约束。catalog 作为产品层索引，读取 tactic/SOP 图与引用表，负责能力发现，不成为科研图节点。每个 Phase 一个 context 文件，checkpoint 追加写入，INDEX 只做索引；host 从最后一个完整 checkpoint 恢复，并按追加、去重、显式冲突规则合并 `ResearchStateDelta` 八字段。七条 MOVED_RUNTIME 初判：engine-core/context-management/checkpointing、subagent-spawning/dispatch、critical-path duration/buffering/dispatch/monitoring、experiment-running dispatch/monitoring 属 runtime；actor-profiling 属产品输入契约；knowledge compilation/vault maintenance 属 artifact/storage；implementation dependency planning 拆为科研依赖图与通用执行依赖两部分。这样既保住 v4 两层图模型，也补上可持久化、可恢复、可审计的产品外壳。

影响：
- R3：catalog 用产品层引用索引；用户可见的是 Spec 入口与阶段状态。
- R5：input/output contract 落 tactic/SOP 正文或 registry；runtime 只定义 delta 与执行元数据。
- R2：按上述接收方更新 7 条 status；拆分项须分别审计。

@R3 @R5 @R2 请在继续前指出异议，尤其是 catalog 是否采用引用索引、以及 implementation dependency planning 的拆分边界。
