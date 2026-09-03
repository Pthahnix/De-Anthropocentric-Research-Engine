# 00-escalation

**只放三类内容：求裁、完成声明、闸门解除。**

Sirelia 对本文件挂了监听，一有写入立刻被唤醒。
日常进度、交付通知、岗位间讨论写到 `channel/<NN>-<topic>.md`，不要写这里——
那会让监听失效。

格式见 `roster/_loop-protocol.md` 第四、六节。

---

## [R3 → Sirelia] 完成声明 2026-09-03

交付物清单：
- `deliverables/R3/entry-ux-spec.md` — 入口与能力发现 UX 规格，含冷启动场景、v3 流程、Catalog、ResearchContext、能力呈现与错误兜底。
- `02-r3-cold-start.md` — 面向全员的交付说明、R1 对齐记录与证据索引。

验收标准对照：
| 要求 | 我的交付 | 证据 |
|---|---|---|
| Catalog A/B/C 选择与论证 | 选 A；200 字内说明 B/C 取舍，frontmatter 仅内部生成 | `deliverables/R3/entry-ux-spec.md:3` |
| 冷启动流程图 | 用户输入至研究循环的 v3 全链路 ASCII 图 | `deliverables/R3/entry-ux-spec.md:2` |
| ResearchContext 方案与 hard gate 来源 | 选 B；`intent + scope_anchor` 最小契约；产品 Spec/context 门 + runtime preflight | `deliverables/R3/entry-ux-spec.md:4` |
| 能力发现时机与呈现 | plan/spec 前发现；3–5 张自然语言卡片；host 合约字段 | `deliverables/R3/entry-ux-spec.md:5` |
| 错误入口兜底 | 论文直入、模糊问题、缺 context、冲突、越界、恢复失败六类 | `deliverables/R3/entry-ux-spec.md:6` |

已知未解决项：
- Catalog 的具体索引文件格式与生成时机仍需 R1/runtime 实现落定；本稿只固定产品契约。
- 七个 UX 投影字段到四个 canonical 字段的最终 registry 映射需与 R5 contract 语法对齐。

自评：最弱处是尚无真实用户可用性测试；场景轮次上限是设计假设，需首轮 host 原型验证。另保留 v4 文档中四字段与 roster 七字段的差异说明，未擅自覆盖架构源文件。

## [Sirelia → all] 频道开启 2026-09-02

监听已就绪。R1 的闸门解除公告将写在本文件。

---

## [Sirelia → all] 正式开工 + 写权限围栏 2026-09-03

五个岗位从现在起正式开始。三件事，都是硬的。

**一、channel 已搬迁。** 现在在
`d:\YOGSOTH-AI\de-anthropocentric-research-engine\channel\`（原来在
`d:\YOGSOTH-AI\channel\`，那个目录已不存在）。你们 prompt 里的四个必读路径
已是新路径。roster 里 9 处旧的交付物落点我已改完。看到任何指向
`d:\YOGSOTH-AI\channel\` 的路径，是残留，按新路径办并告诉我。

**二、唯一可写目录是 channel。**

    d:\YOGSOTH-AI\de-anthropocentric-research-engine\channel\

这个目录之外全部只读。包括整个 DARE repo（`skills/` `scripts/` `docs/`
`paper-reading/` `refactory/`）、`file-transfer\`、系统位置、临时目录。

- 要改只读文件：拷进 `deliverables/<代号>/`，在拷贝上动手。R4 注意——
  `file-transfer\2026-08-23-22-16-dare-v4-architecture.json` 是源，
  一个字节都不许动，你的产物是 `deliverables/R4/graph.json`。
- 要写脚本：落 `deliverables/<代号>/`，不落 repo 的 `scripts/`。
  R4 的 `validate_graph.py` 落点已改成 `deliverables/R4/validate_graph.py`。
- 认为某个结论必须改 repo 里的真文件（改 `SKILL.md`、建 `registry/`、
  动 `AGENTS.md`）：**写求裁，不要动手。** 那是定稿后我的事。
- **禁止一切 git 写操作**：commit / add / push / checkout / stash / branch /
  reset。只读的 log / show / diff 可以。当前分支 `refactory/auto-sync`，
  工作树污染了不好收拾。

`deliverables/R1` 到 `R5` 五个目录我已建好，直接写。

**三、对外动作一律先过我。** 提交、推送、发布、装包、调外部服务——
不管你觉得多顺理成章，都不许自己做。写求裁。

三个必读源我已实测可达：
`file-transfer\...architecture.json`、`file-transfer\...capability-coverage-audit.md`、
`scripts\refactory_source.json`（1.7 MB，被 gitignore 但本地在）。
读不到任何一个，立刻报我，不要自己找替代品。

skill 禁令继续有效：`superpowers` 和 `ara` 全程不许 load / invoke。
读 SKILL.md 文件可以，调用不行。交付物里出现 superpowers 的模板痕迹，
或 ARA 的 `logic/ src/ trace/ evidence/` 四层结构，我直接驳回。

开始吧。R1 先动，你是闸门。

## [R4 → Sirelia] 求裁 2026-09-03

阻塞项：205 条 provenance alias 的原始 v3→v4 对照表缺失。

依赖谁：Sirelia。

为什么不能投机分支：审计文件只给出 205 条统计（`file-transfer/2026-08-24-14-22-dare-v4-capability-coverage-audit.md:101-113`），未给出表格；从 `old` 字段机械得到 258 条候选，无法确定应取哪 205 条。猜测会把错误 alias 写入公开图。

为什么不能换工作块：任务 1–3、5 已完成；任务 4 的每一条状态都依赖这张缺失表。

我建议的答案：提供 205 行原始表；若确认采用机械候选集，再由我按确认规则补录。

## [R1 → Sirelia] 完成声明 2026-09-03

交付物清单：
- `channel/deliverables/R1/draft-v1.md` — A 路归属草案、七条初判与下游影响。
- `channel/deliverables/R1/runtime-boundary.md` — Research Spec 产品层契约、四项 recovery 规则、六项运行时边界、contract 字段落点与七条 `MOVED_RUNTIME` 重判。
- `channel/02-r1-spec-design.md` — 草案、规范交付、R3/R2/R5 联动记录。

验收标准对照：

| roster 要求 | R1 交付 | 证据 |
|---|---|---|
| A 路选择并论证 | Spec 为 out-of-graph 产品入口，不新增执行层 | `runtime-boundary.md:1-33` |
| State 持久化、Delta 合并、恢复入口、归档链 | 单 Phase 文件、追加 checkpoint、八字段规则、固定 recovery 顺序 | `runtime-boundary.md:35-79` |
| 六项运行时边界 | preflight/catalog、routing、retention、budget/retry、parallelism、dispatch、monitoring | `runtime-boundary.md:80-139` |
| 七条 MOVED_RUNTIME 重判 | 4 条保留 runtime、1 条拆分、actor-profiling 改产品输入、knowledge compilation 改 artifact | `runtime-boundary.md:141-157` |
| R5 contract 字段接口 | 正文固定 `Input Contract`/`Output Contract`，registry 仅索引 | `runtime-boundary.md:25-27` |

已知未解决项：R2 尚需把第 6 节归属映射回 146 条审计表；R3 尚需将 catalog 实现从临时方案收敛为产品层 A；R5 尚需据字段落点完成正文映射。这些是下游交付，不改变 R1 规范已完成的事实。

自评：最弱处是 runtime 元数据的具体载体仍由 host 选择；规范已固定必需字段、状态和失败门，但未指定 provider。该取舍符合 v4 的 host-neutral 边界，后续若需要统一观测后端再另行裁决。

## [R5 → Sirelia] 完成声明 2026-09-03

交付物清单：
- `deliverables/R5/field-distribution-analysis.md` — 920 份 v3 正文的扫描口径、字段统计、高频模板、特殊案例与编译约束。
- `deliverables/R5/provenance-to-body-mapping-spec.md` — 200 行；1-to-1、N-to-1、mode 分支、contract 固定 body 落点、rubric 分配与验收规则。
- `deliverables/R5/pilot/` — 7 个节点各含 `body.md` + `compilation-log.md`，共 14 个文件。
- `deliverables/R5/pilot-summary.md` — 4,683 源正文行 → 354 body 行，13.23:1，含耗时估算与边界 case。

验收标准对照：
| roster 里的验收要求 | 我的交付 | 证据 |
|---|---|---|
| v3 字段分布、模板、特殊案例 | 扫描 920 个 SKILL.md；给出 31,780 作者正文行及审计 44,841 行分类口径 | `deliverables/R5/field-distribution-analysis.md:1-99` |
| 1-to-1 / N-to-1 / mode 映射规则 | 固定抽取、合并顺序、冲突处理、mode 分支和 provenance map | `deliverables/R5/provenance-to-body-mapping-spec.md:17-91` |
| contract 字段可被 host 解析 | R1 落锤后以 body 固定小节 + YAML/JSON block 为唯一权威，八字段 Delta 白名单 | `deliverables/R5/provenance-to-body-mapping-spec.md:93-151` |
| 7 节点试点，每节点 body + log | 7 个 pilot 子目录齐全；每个 body 含输入、执行、输出、gate、failure、provenance、Delta | `deliverables/R5/pilot/`、`pilot-summary.md:8-39` |
| threshold / rubric 不丢 | 试点保留原数字门槛；`score-object` 采用复制并标记待重构 | `deliverables/R5/provenance-to-body-mapping-spec.md:117-129`、各 `compilation-log.md` |

已知未解决项：
- `systematic-literature-review/SKILL.md` 在当前仓库不存在；无法核验该指定模板，已在字段分析与规格中标记。
- architecture `old` 中存在跨 package/历史别名；pilot log 记录了无法解析的名称，未猜测正文。
- `score-object` 15 条 rubric 的共享库是否在 Phase 2 提取，仍待项目级决定；本轮只做保守复制。
- pilot 耗时是人工+脚本估算，尚未接入逐节点 profiler；不应当作性能承诺。

自评：最弱处是 body 仍是方法学试编，尚未由真实 host AI 执行一轮 contract 解析与 blocked/uncertainty 负测；下一轮应以 R1 固定 parser 做一次端到端验收。另，`adversarial-deliberation` 留在高危审计表但未纳入 roster 7 节交集，我已在 pilot-summary 明示该取舍，若 Sirelia 指定替换节点只需重做该目录。

---

## [Sirelia → all] 裁定：Spec 形态变更（覆盖 R1 §2） 2026-09-03

Pthahnix 落锤。**这条覆盖 R1 规格里所有关于 Spec 的形态描述。**
归属结论不变，形态结论作废。看清楚区别再动手。

### 一、v4 没有 v3 那种 Spec

以下三件事从 v4 移除：

1. **`writing-specs` 这个 skill 不存在。** 不要引用它，不要按它推导。
2. **不存在「用户确认后冻结」的 Spec 文件。** 没有确认门，没有冻结态，
   没有 `Deviation from Spec` 段——偏离这个概念本身没有了，因为没有可偏离的基线。
3. **默认不落 Markdown。** 除非用户明确要一份文件，否则 spec 不写成 md。

v4 只有**一份贯穿研究全程、可反复维护、在研究过程中反复优化的 spec**。

### 二、Spec 是 state 的投影，不是独立对象

**裁定：spec 不独立存在。它是从 checkpoint 事件流里算出来的当前研究计划视图。**

- 修改 spec = 往事件流追加一个 `decisions` 条目。不新增第二套持久化机制。
- 不引入 spec 版本号、不引入 spec 修订流程、不引入 spec 专属的存储位置。
- 「当前 spec 是什么」= 对事件流做一次重建。重建规则要写出来（见下）。
- 恢复时不需要单独恢复「当时生效的哪一版 spec」——恢复到某个 checkpoint，
  spec 视图自然就是那个时点的。这是选投影而不选独立对象的主要收益。

理由：v4 已有追加式事件流 + 八字段 Delta。spec 作为投影复用全套持久化与恢复
机制，不必再造版本控制。且「研究过程中优化 spec」本质就是研究产生了新 decision，
走 decision 通道是自然的。代价是要定义重建规则——这是新增工作量，认。

### 三、归属结论不变

A 路里活下来的部分：**spec 不进科研图，不是第四层执行节点，
图仍然只有 tactic / sop 两种可执行节点。** 这条继续有效，跟 spec
是文件还是投影无关。R1 §1.1 三条边界、§3 持久化、§5 六项运行时边界
不受本裁定影响。

### 四、各岗位的返工范围

**@R1 —— 五处硬挂钩塌了，只改这五处，别重写规格。**

| 位置 | 现状 | 问题 |
|---|---|---|
| §1.2 不变量 1 | host 动手前必须定位「已确认的 Spec 文件」 | 没有确认态也没有文件。这个门现在检查什么？ |
| §2 整节 | Header + Stage[n] 字段表、「先读完整 Spec」、偏离规则 | 按 v3 形状写的，作废重写 |
| §4 恢复第 1 步 | 「读取完整 Research Spec，定位第一个未完成 Stage」 | 改成从事件流重建 spec 视图再定位 |
| §5.1 路由优先级 | 「未完成的 Spec Execution Step」排第一 | 优先级本身合理，但来源要改成投影视图 |
| §6 actor-profiling | 验收条件挂在 Spec 的 `expected_input` 字段 | 挂钩点没了，重新给验收条件 |

新增必写：**spec 投影的重建规则。** 至少覆盖——从哪些 Delta 字段重建
（我倾向 `decisions` 为主、`open_questions` 辅助，但你自己判）、
重建结果的字段构成、同一计划项被多次修订时的取值规则（沿用你 §3.3 的
`decision_id` 保留最新 + 保留被替换项那套即可）、以及一条我特别要的：
**一次 spec 修订能不能作废已标记 complete 的阶段。**
你 §2.5 原来写「completion_criteria 未满足不得自动前进」——现在判据自己会变，
这条要重新表述。

§5.2 顺手补一处：「上下文压缩只能删除可重建的导航文本」，
「可重建」没有定义。这是全篇唯一留了解释空间的地方，实现时会被当成删事实的借口。
给个判定标准。

**@R3 —— 你的入口设计里「用户确认 Spec」这个门按 v3 形状写的，跟着改。**

`deliverables/R3/entry-ux-spec.md` §2 的 v3 流程图保留（那是现状对比，没错），
但 §3 §5 里凡以「Spec 确认」为界的时序都要重画。现在没有确认门，
spec 是随研究演进的视图——那么「用户什么时候看到计划、怎么改计划」
是新的产品问题，归你。

另外上一轮我给你的两条批注（v4 是 51 个 tactic 不是 1 个；
catalog 的 C 方案依赖 R5 而非 R1）仍然有效，一并处理。

**@R2 —— 七条 MOVED_RUNTIME 里 actor-profiling 那条的验收条件会变**，
等 R1 给新的再审这条。其余六条不受影响，照原计划审。

**@R5 —— 本裁定不影响你。** contract 落点仍是正文固定小节，
registry 只做生成索引，frontmatter 不扩张。你手上的返工项是 threshold
保真度（见 `02-r1-spec-design.md` 我给你的驳回），跟 spec 形态无关，继续做。

**@R4 —— 本裁定不影响你。** 图的机械修补跟 spec 形态无关，继续做。

### 五、一句话给所有人

不要因为这条裁定去重写自己的全部交付。归属和边界没变，
变的只是 spec 的形态。凡是你写的东西里出现「确认过的 Spec 文件」
「Spec 冻结」「偏离 Spec」「Stage[n] 字段」，那几处要改；其余不动。
