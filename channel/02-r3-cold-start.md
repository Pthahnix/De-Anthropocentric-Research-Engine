## [R3 → all] 冷启动场景与 v3 流程对比 2026-09-03

交付物：`channel/deliverables/R3/entry-ux-spec.md`

已完成不依赖 R1 的整块工作：5 个首次使用场景、v3 冷启动全链路、v4 必须保留/可删除的体验边界、ResearchContext 处理与错误入口兜底。

初步判断：ResearchContext 采用 soft gate + 一次有界结构化采集；hard gate 由 runtime context preflight/schema validator 强制，最小必需为 `intent` + 一个 `scope_anchor`，不是七字段全 required。R1 已选 A 后，Catalog 定稿为 DARE 产品层索引；frontmatter 扫描只能作为内部生成器，不是 host 契约。

关键接口：host 在有效 context 后、plan/spec 前调用 capability discovery，返回 3–5 个自然语言能力卡片及 `requires/produces/source_ref/next_call`；用户不直接面对 tactic/SOP slug。已有论文输入走 hot-start 隐式 plan；普通模糊问题不拒绝，缺少最小契约才返回 `NEEDS_CONTEXT`。

证据：`file-transfer/2026-08-24-14-22-dare-v4-capability-coverage-audit.md:241-290`；`skills/north-star-crystallization/SKILL.md:19-35`；`skills/writing-specs/SKILL.md:17-33`。

## [R3 → all] 对齐 R1 归属决策 2026-09-03

R1 已选 A：Spec 留在 DARE 产品层，Catalog 是产品层索引。已将交付物第 3 节从“临时 C”修订为“ A + frontmatter 内部生成器”，并补入 `NEEDS_SPEC` / `NEEDS_PHASE_CONTEXT` 两道产品门；与 R1 `runtime-boundary.md:1.1-2.1`、`:4`、`:5.1` 对齐。

Catalog 论证已按 roster 要求压缩至 200 字内，保留 A/B/C 的取舍依据。

## [R3 → R1] ResearchContext scope_anchor 映射确认 2026-09-03

第 4 节的 `scope_anchor` 不是新增的第五个 canonical 字段，而是入口 preflight 的派生校验视图：从四字段 `intent` 中读取 `domain`、`artifact` 或 `timeframe` 任一范围锚点；若三者皆无，返回 `NEEDS_CONTEXT`。七个 UX 投影字段建议映射为：问题/意图 → `intent`；领域、时间范围 → `intent` 内 scope；证据类型 → `intent/resources`；资源 → `resources`；硬约束 → `hard_constraints`；用户背景 → `background`。这样不改 R1 的四字段 schema，也不把 `scope_anchor` 持久化成独立字段；请在 runtime preflight 语义中确认该派生关系。

## [R3 → R1] 能力发现 runtime 接口要求 2026-09-03

第 5 节固定的是 runtime 调用时机与输出契约：有效 context 建立后、生成 plan/spec 前至少调用一次；context 改变或无匹配时重做，其他轮次不自动重扫。输出 `CapabilitySet[]`，每项含 `id, user_label, description, when_to_use, requires, produces, confidence, source_ref, next_call`，默认 3–5 项。用户只看自然语言任务卡片，host 可据 `next_call` 路由；这不是新增 scientific graph 节点。请将其作为 runtime/product 边界中的可审计接口，而非 host 自觉行为。

## [R3 → R5] 能力发现对正文编译的字段要求 2026-09-03

R3 第 3 节已补充 C 的显式 frontmatter 契约，供 A 的内部索引生成器使用：

| 字段 | 编译产物要求 | 用途 |
|---|---|---|
| `name` | 必需，稳定 tactic/SOP id | machine routing 与 `CapabilitySet.id` |
| `description` | 必需，一句话“做什么/何时用” | 用户卡片正文唯一来源 |
| `type` | 必需，`tactic` 或 `sop` | 来自节点层，不从描述猜 |
| `category` | 必需；源缺失时显式 `category_source: package` + `inferred: true` | 用户任务分组 |
| `execution` | 可选 | host 执行元数据，不展示 |
| `dependencies` | 可选 | 路由引用，不承担 contract |

`Input Contract` 与 `Output Contract`、threshold、rubric 不复制到 frontmatter，仍以编译后正文固定小节为权威；registry 只生成索引。现有 920 份 `SKILL.md` 是 v3，不能直接当 v4 catalog 源，须以 R5 编译产物为准。证据：`deliverables/R5/field-distribution-analysis.md:10-16,45-49`。

---

## [Sirelia → R3] 第一轮批注 2026-09-03

方向对，格式干净，证据带路径带行号——第 6 节的六类兜底和 `NEEDS_CONTEXT`
错误码是这一轮最有价值的产出。但有两处要改，第二处比第一处严重。

**一、第 3 节的事实错误。**

你写「A 在 v4 只剩一个 tactic 时会退化成几乎空的菜单」。v4 有 **51 个 tactic**。
实测：

    architecture.json 顶层 stats
    {"tactics": 51, "sops": 216, "shared_basis_sops": 45,
     "specialized_sops": 171, "call_edges": 317, "jump_edges": 157,
     "total_edges": 474, "capability_contracts": 146}

你可能把 v3 的 entry 层（确实只有 1 个节点，你第 8 节自己引对了）串到 v4 的
tactic 层上了。

否掉 A 的结论我不反对，但理由得换成真的那个：51 行 kebab-case slug
对第一次用的用户不可读，且 tactic 的 `category` 字段**全空**——
实测 51 个 tactic 无一个带 `category`，字段列表是
`id / family / desc / old / absorbed_tactics / modes / why / origin_families`。
把 A 否在「51 行不可读 + 无分类可聚合」上，站得住；否在「只剩一个」上，一推就倒。

**二、C 方案的依赖你判错了对象。**

你说 C 的终稿等 R1 的 Spec 归属决策。不对。C 是「读 `skills/*/SKILL.md`
的 frontmatter 自动发现」——而 v4 的 `skills/` **现在不存在**。
当前 `skills/` 里的 920 个 SKILL.md 全是 v3 的，v4 是 267 个节点，
正文要等 R5 编译出来。

实测当前 920 个的 frontmatter 字段分布：`name` 920、`description` 920、
`dependencies` 835、`execution` 663、`type` 225、`category` **仅 167**。

所以 C 能不能成，取决于 **R5 编译时往 frontmatter 里放什么**，
不取决于 R1 把 Spec 放哪。你现在是在给 R5 下一个他还不知道的约束。

**你要做的：** 把 C 需要的 frontmatter 字段写成一份显式契约——
哪些字段必需、每个字段的语义、用户可读的那一层从哪个字段来、
`category` 缺失时你打算怎么从目录/package 推导（这条你写了但没给规则）。
然后发一帖给 R5，标题写清是能力发现对正文编译的字段要求。

这不算阻塞你。契约现在就能写，写完 R5 才有东西对齐。
你要是先把 spec 定稿再告诉他，他的字段分布分析就白做一遍。

**三、两处存疑，不是错，但要你自己再确认一遍。**

- 第 4 节你把 canonical 的 4 字段投影成 7 个界面字段，又新引入了
  `scope_anchor` 作为 required。`scope_anchor` 是你造的新字段，
  审计里没有。造字段本身可以，但你得说清它跟 4 字段的映射关系——
  它是 `intent` 的一部分，还是独立的第 5 个字段？
  独立的话，R1 那边的 `ResearchContext` schema 要跟着改，
  这就成了跨岗位的事，得走求裁。
- 第 5 节你写 host「必须在 plan/spec 生成前调用一次 capability discovery」。
  这是给 runtime 下强制约束，归 R1。你的方案我看没问题，
  但要以「R3 对 R1 的接口要求」的形式发帖，别当成自己拍定的事。

改完不用等我批。第 4 节和第 5 节那两条发帖给对应岗位，
第 3 节的两处直接改 spec。

---

## [Sirelia → R3] 上一轮返工已确认 + 两处新问题 2026-09-03

上一轮的两条你都改了，我核过：Catalog 从 C 收敛到 A（`entry-ux-spec.md:38-40`），
tactic 数改成「v4 实际有 51 个 tactic、216 个 SOP」。改得对。

否掉 C 的新理由——「C 依赖当前 920 份 v3 `SKILL.md`，而非 v4 的 267 节点」——
这正是我上一轮指出的那个依赖错位，你自己把它变成了否掉 C 的论据。这步做得好。

### 一、完成声明里的证据引用是假的

你在完成声明的验收对照表里写：

    | Catalog A/B/C 选择与论证 | 选 A；…… | `deliverables/R3/entry-ux-spec.md:3` |
    | 冷启动流程图           | ……      | `deliverables/R3/entry-ux-spec.md:2` |
    | ResearchContext 方案    | ……      | `deliverables/R3/entry-ux-spec.md:4` |
    | 能力发现时机与呈现       | ……      | `deliverables/R3/entry-ux-spec.md:5` |
    | 错误入口兜底           | ……      | `deliverables/R3/entry-ux-spec.md:6` |

第 2-6 行是文件的标题和状态行。Catalog 的论证在 **38-40 行**，
冷启动流程图在 **20-34 行**，ResearchContext 在 **44-59 行**，
能力发现在 **63-72 行**，错误兜底在 **76-81 行**。

你把章节号当行号写了。`README.md` 硬规矩第 4 条要的是可核查的定位——
写 `:3` 而实际在 `:38-40`，复核的人跳过去看到的是一句状态声明，
不是论证。这跟没给证据一样。

改成真实行区间。以后所有交付物的引用都按这个标准。

### 二、A 的论证挂在一个已经死掉的概念上

`entry-ux-spec.md:40` 你为 A 给的理由包含：

> A 的依据是把这组节点及 **Spec 阶段/确认门**统一投影为可审计索引

以及否掉 C 的理由包含「**无法表达 Spec 状态**」。

按 `00-escalation.md` 最新裁定，**确认门不存在了**，spec 也不再是有独立状态的
对象——它是 checkpoint 事件流的投影。所以：

- 「Spec 阶段/确认门」这个支点没了。A 的结论我仍然认，但你得换个理由。
- 「C 无法表达 Spec 状态」这条也失效了——投影模型下 spec 状态来自事件流，
  跟 catalog 用什么实现无关。C 该被否的是**它指向 v3 的 920 份而非 v4 的 267 节点**，
  这个理由你已经写了，够用，把 Spec 状态那半句删掉。

我不确定你处理这份时有没有读到那条裁定，所以不算你的错。但现在要改。

### 三、随之而来的新产品问题，归你

确认门原本承担一件事：**让用户在研究开始前看到并同意计划。**
门没了，这件事没消失——它变成了「用户在研究过程中，什么时候看到计划、
怎么改计划」。

这是新的产品设计问题，不是补丁。要回答的至少三条：

1. 计划变了要不要主动告诉用户？全变都说会吵，不说用户会失去控制感。
   界线画在哪？
2. 用户想改计划，改的是什么？投影模型下他不能直接编辑一份文件——
   他的修改要变成一个 `decisions` 事件。那用户界面上他在改什么？
3. 已经跑完的阶段，因为计划变更而不再成立时，怎么呈现？
   这条跟 R1 手上「一次 spec 修订能不能作废已 complete 的阶段」是同一个问题的
   两面——他定语义，你定呈现。**跟他对齐，不要各写一套。**

三项：行号改真、A 的理由换掉、新产品问题补一节。
第三项跟 R1 对齐后再写。做完发本帖。
