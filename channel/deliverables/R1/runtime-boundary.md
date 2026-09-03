# DARE v4 Runtime Boundary

状态：R1 可执行规格，2026-09-03。

本文件把 v4 的产品外壳与运行时责任写成可检查的规则。科研图仍只有 `tactic` 与 `sop` 两种可执行节点；本文件、Spec 投影视图、catalog、context 和 artifact 都是图外产品资源，不得伪装成第三层节点。

## 1. 归属与不变量

### 1.1 三个边界

| 边界 | 负责 | 不负责 |
|---|---|---|
| DARE 产品层 | spec 投影视图、用户可见计划演进、catalog 索引、阶段完成/回退语义 | provider 选择、线程/代理实现、秘密管理 |
| 科研图 | tactic/SOP 的研究变换与领域判据；返回 `ResearchStateDelta` | 调度、持久化、重试、代理派发、日志 UI |
| host runtime / 外部能力 | 读取 spec 投影视图与 state、路由、预算、恢复、并行、派发、监控、存储适配 | 改写科研判据、擅自跳过阶段、把 provider 细节写入事件流 |

### 1.2 强制不变量

1. host 开始任何研究动作前，必须从当前 Phase 的 checkpoint 事件流重建 spec 投影视图，并定位该 Phase 的 context 文件；事件流或投影缺失/损坏即停止并报告位置。
2. tactic/SOP 只消费相关 state slice，输出八字段 `ResearchStateDelta`：`findings`、`evidence_updates`、`hypothesis_updates`、`assumption_updates`、`uncertainties`、`decisions`、`open_questions`、`recommended_jumps`。不得要求 provider-specific storage 或巨型 checkpoint。
3. 所有持久化写入采用追加式 checkpoint；历史 checkpoint 不原地修改。纠正通过新 checkpoint 覆盖语义完成。
4. 外部工具、代理、存储均为可替换适配器；科研图不得出现 provider/tool edge。
5. 阶段只能在其完成判据可核验时完成；运行时不能以超时、预算耗尽或代理返回空结果替代完成。

## 2. Spec 投影视图：事件流上的当前研究计划

v4 不把 spec 作为独立文件、确认态或冻结态对象。当前 spec 是对当前 Phase checkpoint 事件流的确定性投影；修改 spec 只能追加一个 `decisions` 事件，不得新增第二套持久化机制、版本号或 spec 专属目录。

### 2.1 重建输入与输出

重建器按 checkpoint 序号递增回放：

1. `decisions` 是计划的主来源。识别 `plan_item.create`、`plan_item.update`、`plan_item.retire`、`plan_gate.update` 和 `phase_status.update` 事件。
2. `open_questions` 只作为辅助：将未决问题挂到其 `plan_item_id`；它不能单独创建可执行计划项。
3. 其余六个 Delta 字段只提供事实、证据和不确定性引用；除非被 `decisions` 明确引用，不得直接改变 spec 结构。
4. 输出为内存中的 `SpecView`：`phase`、`objective`、`active_items[]`、`context_requirements[]`、`completion_gates[]`、`backtrack_conditions[]`、`status`、`source_checkpoint`。每个 `active_item` 至少含 `plan_item_id`、`description`、`requires`、`produces`、`depends_on`、`status` 和 `last_decision_id`。

`SpecView` 不是新的落盘对象；需要持久化时只追加产生它的 decision/checkpoint 事件。若没有任何 `plan_item.create` 事件，host 必须先追加一个最小计划决定，再调用科研节点。

### 2.2 修订、完成与作废

同一 `plan_item_id` 的多次修订沿用第 3.3 节规则：按 checkpoint 序号取最新明确决定，同时保留被替换决定及原因。`plan_item.retire` 使该项不再 active，但历史记录不删除。

一次 spec 修订**可以**作废已标记 complete 的阶段，但只能在 decision 明确改变该阶段的 objective、requires、completion gate 或其依赖时触发：将该项状态改为 `needs_revalidation`，保留原 complete 事件，并阻止依赖它的下游继续，直到新判据再次满足。只改变描述、排序或附加注释的修订不得作废 complete。

### 2.3 执行规则

每次路由前重建当前 `SpecView`，选择第一个 `active_item.status != complete` 且依赖已满足的项；执行后通过 checkpoint 记录结果与 Delta。完成判据来自当前投影视图的 `completion_gates`，若修订使判据变化，则按 2.2 节重新验证，不得以旧 complete 标记自动前进。计划变化就是新的 `decisions` 事件，必须说明变化原因与影响。

### 2.1 节点 contract 字段落点

每个 tactic/SOP 的 `input_contract` 与 `output_contract` 以正文中的固定小节为唯一权威：`## Input Contract`、`## Output Contract`。小节必须写明字段、类型、required/optional、失败条件和输出判据；threshold、rubric、反例仍保留在正文对应段落。frontmatter 只保留 `name` 与 `description`；产品层可生成 `registry/capabilities.json` 作为 catalog 索引和 `source_ref` 缓存，但不得把索引当作唯一事实，也不得要求运行时读取 provider-specific 字段。这样 R5 的编译有稳定落点，R3 的发现只消费索引摘要，运行时 Delta 仍由本文件第 3 节统一定义。

执行规则：

1. host 先重建当前 `SpecView`，再读取其 `context_requirements` 指向的 context；输入不存在或不完整时停止，不自行补造。
2. 每个 active item 依次执行其投影视图中声明的步骤与 checkpoint；阶段末是否完成由当前 `completion_gates` 判定。
3. 计划项只推荐科研图中的 campaign/strategy；最终 tactic/SOP 选择可由 host 按 catalog 索引完成，但必须记录选择理由和输入 state slice。
4. 计划变化通过新的 `decisions` 事件表达，并按 2.2 节处理对已完成项的影响。
5. `completion_gates` 必须是数字或客观可核验条件；未满足时保留项未完成，不得自动前进。
6. 触发 `backtrack_conditions` 时，host 先向用户请求 A（回退）、B（继续）、C（其他）；未获选择不得静默回退或前进。

## 3. State 持久化与 Delta 合并

### 3.1 文件布局

```text
context/INDEX.md
context/<timestamp>-<phase-slug>.md     # 每个 Phase 恰好一份
```

`context-init` 在 Phase 开始创建文件并在 INDEX 增加一行；同一 session 同一 Phase 已有文件时复用，不新建第二份。INDEX 只保存文件、Phase、Topic、Checkpoint 数量、Last Updated，不承载研究事实。

### 3.2 Checkpoint 最小格式

每次 checkpoint 追加一个顶层段落，段落内必须包含：

```text
Checkpoint: <唯一递增序号>-<UTC 时间戳>
Phase: <phase-slug>
Source: <tactic/sop 或 host>
Status: complete | partial | blocked
Input slice: <读取的 state 范围>
Process: <做了什么>
Results: <得到什么>
Delta: <八字段；无值字段写 []>
Open questions: <未决项>
```

`Status=complete` 才是可恢复落点。`partial` 和 `blocked` 仍保留，但恢复时不可作为阶段完成证据。

### 3.3 合并规则

host 将每个 Delta 作为事件追加，不做静默覆盖：

- `findings`、`evidence_updates`、`hypothesis_updates`、`assumption_updates`、`uncertainties`、`open_questions`：按稳定键去重；没有稳定键时按完整规范化文本去重，首次出现顺序保留。
- `decisions`：按 `decision_id` 保留最新明确决定，同时保留被替换决定及替换原因；同一 ID 的冲突不得自动投票。
- `recommended_jumps`：按 `(target, reason)` 去重，按最新 checkpoint 排序；它是建议，不是控制流命令。
- 同一 checkpoint 序号重复、时间倒退、Phase 不符或 Delta 非八字段对象时拒绝写入并记为 `blocked`。

### 3.4 冲突裁决

发现互斥事实或决定时，host 不猜测、不丢弃任一事件：生成一个带来源引用的 `uncertainties` 条目，暂停依赖该冲突的路径，并请求用户或指定审查者裁决。裁决写入新 checkpoint 的 `decisions`，不得改旧记录。

## 4. Session Recovery

新 session 的固定入口如下：

1. 读取 `context/INDEX.md`，找到目标 Phase 的唯一 context 文件与最新 checkpoint 序号；回放截至恢复点的事件流，重建当前 `SpecView`，定位第一个未完成 active item。
2. 读取该文件最后一个 `Status=complete` checkpoint；若最后 checkpoint 为 `partial/blocked`，先读取它的 Open questions，再回到最近一个 complete checkpoint，并从该点重建 spec 投影。
4. 校验 checkpoint 的 Phase、序号连续性和 Delta 八字段；校验失败时停止，报告损坏位置。
5. 从恢复点继续，不重跑已记录为 complete 的 strategy；如需重跑，必须新增 checkpoint 并写明原因。

恢复不读取 host scratchpad 作为事实来源，也不要求把整份 context 文件压入提示词；摘要只能作为导航，事实以 checkpoint 事件为准。

## 5. 六项运行时边界

### 5.0 Context preflight 与能力发现

在第一次路由前，host 对 `ResearchContext` 做一次有界 preflight：`intent` 与至少一个 `scope_anchor` 必须存在；其余背景、资源和硬约束可缺省，但必须标记缺失。失败返回 `NEEDS_CONTEXT`，只允许补采集，不得进入科研图。通过后，产品层 catalog discovery 返回 3–5 张能力卡片，每张包含 `requires`、`produces`、`source_ref`、`next_call`；host 将卡片映射到 v4 tactic/SOP 节点，再按 Spec 生成或执行计划。catalog 的物理实现可由 frontmatter 自动生成或引用索引提供，但对 host 的上述输出契约不变，用户不直接操作节点 slug。

### 5.1 Routing

1. 路由优先级固定为：`SpecView.active_items[]` 中首个未完成项 → 该项的 `recommended_combination` → 当前 state 的 `recommended_jumps` → host 按 catalog 选择的 tactic/SOP。
2. `recommended_jumps` 不能越过未满足的 spec 投影视图 completion gates 或 backtrack gate。
3. 每次路由记录 `step_id`、选中的节点、输入 slice、触发理由；没有匹配节点时标记 `blocked`，不得用通用 prompt 代替。

### 5.2 Context retention

每次 tactic/SOP 调用只加载当前 spec 投影视图要求的上下文与相关 state slice；调用结束必须形成 Delta checkpoint。文本只有在“删除后，使用仍存活的 checkpoint 事件重放，能得到相同的 SpecView、Delta 稳定键集合和下一路由结果”时才算可重建导航文本；任何事实、证据、决定、门槛、输入值或其唯一来源均不可删除。持久化失败时任务状态为 `blocked`，不得仅留在内存继续前进。

### 5.3 Budget & retry

每个 execution step 在启动时声明 `timeout_seconds`、`max_attempts`、`token_budget`；缺省分别为 900、3、该 session 剩余预算。仅对网络暂时失败、429、5xx、进程瞬时退出重试；参数错误、权限/认证错误、契约校验错误、数据损坏不重试。重试间隔为 `min(60, 2^(attempt-1)*2)` 秒加 0–1 秒抖动；达到上限后写 `blocked` checkpoint 并保留错误摘要。

### 5.4 Parallelism

默认串行。只有当两个步骤读取的 state slice 不重叠、输出写入键不冲突、且 Spec 未声明顺序依赖时才可并行。并行结果先按 `step_id` 排序再合并；任一分支失败不丢弃其他分支，但共同下游保持未完成。

### 5.5 Agent dispatch

host 负责决定是否派发 subagent。可派发条件：任务边界明确、输入可序列化、无共享可变写入、结果能回传为 Delta、且预计收益大于派发开销。代理不得直接修改 context/INDEX 或 Spec，不得持有 secret；host 校验其输出契约后统一写 checkpoint。没有隔离条件时由 host 直接执行。

### 5.6 Monitoring

每个 step 至少记录：开始/结束时间、phase、step_id、attempt、状态（queued/running/succeeded/failed/blocked）、预算消耗、输入输出摘要、错误类别。监控数据属于 host execution metadata，不进入科研图；用户可见进度由 host UI 或等价日志呈现。发现 checkpoint 延迟、预算超限、重复序号或契约失败时立即阻止下游。

## 6. 七条 MOVED_RUNTIME 归属重判

下表以 v4 capability audit 的原 capability 为粒度；`MOVED_RUNTIME` 仅保留给真正由运行时接收的部分。

| 原 capability | 新归属 | status | 接收方与验收条件 |
|---|---|---|---|
| actor-profiling | DARE 产品层输入 | MOVED_PRODUCT | preflight 生成 `ResearchContext`，至少含 `intent` 与一个 `scope_anchor`；提供的背景/资源/硬约束与 inferred/missing 标记写入当前 Phase checkpoint 的 `decisions`（`context.preflight`）及必要的 `assumption_updates`，缺必需字段返回 `NEEDS_CONTEXT`，不依赖另行存储的 Spec 字段 |
| engine-core / context-management / checkpointing | runtime control plane | MOVED_RUNTIME | 可创建单 Phase 文件、追加 checkpoint、校验序号并从最近 complete 点恢复 |
| subagent-spawning / implementer-dispatch | runtime control plane | MOVED_RUNTIME | host 按隔离条件派发，代理只回传 Delta，host 统一落盘 |
| knowledge compilation / vault maintenance | artifact/storage layer | MOVED_ARTIFACT | 科研结构输出与存储适配分离；存储失败不改变科研结论 |
| implementation dependency planning | 拆分：科研图 + runtime | SPLIT | 科研依赖仍由 `plan-experiment-implementation` 表达；通用任务依赖、资源排程由 runtime 表达，二者有引用 ID 但不合并节点 |
| critical-path duration / buffering / dispatch / monitoring | runtime control plane | MOVED_RUNTIME | runtime 计算关键路径、缓冲、状态与派发记录，不改实验语义 |
| experiment-running agent dispatch / monitoring | runtime control plane | MOVED_RUNTIME | host/scheduler 编排执行代理并记录状态；科研 tactic 只消费结果 Delta |

因此，七条原标签中 4 条保持纯 `MOVED_RUNTIME`，1 条按科学/通用边界拆分，actor-profiling 改为产品输入，knowledge compilation 改为 artifact。原 capability 若在审计表中与另一条合并，按本表最细粒度拆开统计，禁止以“runtime”笼统通过。

## 7. 实现验收清单

- [ ] 能从 checkpoint 事件流重建 `SpecView`，定位首个未完成 active item，并拒绝缺失 context 输入。
- [ ] 一个 Phase 不会创建第二个 context 文件；checkpoint 追加且可校验。
- [ ] 八字段 Delta 可去重合并；冲突会生成 uncertainty 并暂停依赖路径。
- [ ] 新 session 能按本文件第 4 节恢复，不依赖 scratchpad。
- [ ] 路由、重试、并行、派发、监控均能输出第 5 节要求的可审计字段。
- [ ] 七条 capability 的接收方与 status 可由审计者依据第 6 节逐条判定。

证据源：`file-transfer/2026-08-23-22-16-dare-v4-architecture.json:21-33`（state_semantics）、`:35-49`（boundaries）、`:6076`（actor-profiling）、`:6125`（engine-core/context-management/checkpointing）、`:6657`（knowledge compilation/vault maintenance）、`:6685-6692`（implementation dependency planning 与 critical-path）、`:6944`（experiment-running dispatch/monitoring）；`file-transfer/2026-08-24-14-22-dare-v4-capability-coverage-audit.md:14-16,206-212,446`；v3 `context-init`、`context-checkpoint`、`writing-specs`、`executing-specs` SKILL.md。
