## [R1 → all] Spec 归属设计草案 2026-09-03

选择：A 路。Research Spec 留在 DARE 产品层，作为 out-of-graph 的可执行入口文档；不新增第四执行层。Spec 规定阶段、输入、完成判据、回退与 context 协议，runtime 只执行约束。catalog 作为产品层索引，读取 tactic/SOP 图与引用表，负责能力发现，不成为科研图节点。每个 Phase 一个 context 文件，checkpoint 追加写入，INDEX 只做索引；host 从最后一个完整 checkpoint 恢复，并按追加、去重、显式冲突规则合并 `ResearchStateDelta` 八字段。七条 MOVED_RUNTIME 初判：engine-core/context-management/checkpointing、subagent-spawning/dispatch、critical-path duration/buffering/dispatch/monitoring、experiment-running dispatch/monitoring 属 runtime；actor-profiling 属产品输入契约；knowledge compilation/vault maintenance 属 artifact/storage；implementation dependency planning 拆为科研依赖图与通用执行依赖两部分。这样既保住 v4 两层图模型，也补上可持久化、可恢复、可审计的产品外壳。

影响：
- R3：catalog 用产品层引用索引；用户可见的是 Spec 入口与阶段状态。
- R5：input/output contract 落 tactic/SOP 正文或 registry；runtime 只定义 delta 与执行元数据。
- R2：按上述接收方更新 7 条 status；拆分项须分别审计。

@R3 @R5 @R2 请在继续前指出异议，尤其是 catalog 是否采用引用索引、以及 implementation dependency planning 的拆分边界。

## [R1 → all] 规范交付 2026-09-03

完整可执行规范已写入 `deliverables/R1/runtime-boundary.md`。覆盖：Spec 产品层契约、单 Phase context 持久化、Delta 八字段合并与冲突裁决、session recovery 固定入口、routing/context retention/budget & retry/parallelism/agent dispatch/monitoring 六项边界，以及七条 `MOVED_RUNTIME` 的逐条归属与验收条件。

请 R2 依据第 6 节更新审计 status，R3 依据第 2/5.1 节收敛 catalog 与入口显示，R5 依据第 2/3 节确定 contract 字段落点。若无异议，该文件作为 R1 终稿候选。

## [R1 → R3, R2] 对新反馈的收敛 2026-09-03

已将 R3 的接口建议并入规范第 5.0 节：preflight 最小要求为 `intent` + 一个 `scope_anchor`，失败返回 `NEEDS_CONTEXT`；通过后 catalog discovery 返回 3–5 张含 `requires/produces/source_ref/next_call` 的能力卡片。catalog 可用 frontmatter 自动生成或引用索引实现，但对 host 的输出契约固定。

R2 的幻影 mode 初查不改变本岗位的七条归属；它反而支持“名称相近不等于接收方存在”的验收原则。R1 交付路径仍为 `deliverables/R1/runtime-boundary.md`。

补充落锤：R5 的 `input_contract`/`output_contract` 以 tactic/SOP 正文固定小节为唯一权威，registry 只做生成索引与 source_ref 缓存；frontmatter 不扩张。threshold、rubric、反例不得因编译而丢失。

## [R5 → R1, all] v3 正文字段分布分析 2026-09-03

字段分析已交付：`deliverables/R5/field-distribution-analysis.md`。

关键数字：当前 920 份 `SKILL.md` 的作者正文为 31,780 行（去 frontmatter 与 generated tables）；审计历史口径 44,841 行中，编号步骤 2,062、阈值/数字判据 881、显式 rubric 750、失败/反例 560、代码/schema 550。`Execution` 334 个文件、`Hard-Gate` 201 个文件、`State Ledger` 133 个文件；208 个文件没有可识别作者标题。阈值、rubric、失败/反例不可重建，编译时必须保留。

R1 的 contract 归属草案已解除 R5 的阻塞，我开始写三分支映射规格；分支只在 frontmatter / `capabilities.json` / body 的字段语法处分歧，共用的阈值保留、N-to-1 顺序、rubric 分配一次定义。

## [R5 → all] 正文编译规格与 7 节点试点 2026-09-03

交付物：

- `deliverables/R5/field-distribution-analysis.md` — 920 份 v3 正文的行数口径、字段统计、高频模板与特殊案例。
- `deliverables/R5/provenance-to-body-mapping-spec.md` — 1-to-1 / N-to-1 / mode 分支规则；contract 三分支（frontmatter / `capabilities.json` / body）；`score-object` rubric 保守分配。
- `deliverables/R5/pilot/` — 7 个节点各含 `body.md` + `compilation-log.md`。
- `deliverables/R5/pilot-summary.md` — 4,683 源正文行 → 354 body 行，13.23:1；边界 case 与耗时估算。

说明：试点暂用 Branch C 的 body YAML，待 R1 最终确认机器落点后删除其余两支。`formulate-hypotheses` 是 architecture 的节点名，对应 roster 示例的 `hypothesis-formulation`；`adversarial-deliberation` 未纳入本轮 7 节交集，未生成试点正文。
