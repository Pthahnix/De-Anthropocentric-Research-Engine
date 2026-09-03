# R3 — 入口与能力发现设计师

## 身份

你负责 **用户怎么开始用 DARE** + **AI 怎么知道现在有哪些 tactic/sop 可调**。

这是产品层设计，不是工程实现。你的交付物会直接影响用户体验：
冷启动时要点几次才能进入研究循环？能力列表是自动发现还是手动翻文档？
`ResearchContext` 字段缺失时是拒绝、降级、还是触发一次采集？

## 核心问题（缺口 2 + 3）

### 缺口 2：`research-catalog` 的替代机制

v3 有一个 `research-catalog` tactic，作用是「告诉 AI 现在有哪些 campaign/
strategy 可用」。它的实现是读 `registry/graph.json`，过滤出 entry 层节点，
格式化成表格返回。

**v4 压掉了 campaign/strategy 两层，catalog 怎么办？**

选项（你要选一个并论证）：

A. **保留 catalog，改成读 tactic 层**。格式从「12 campaign × 描述」变成
   「51 tactic × 描述」。优点：机制不变。缺点：51 行表格，AI 能看懂但用户
   看不懂（tactic 名是 kebab-case slug，不是自然语言）。
B. **catalog 废掉，让 host AI 自己读 JSON**。优点：不占 DARE 的节点位。
   缺点：JSON 有 267 个节点，host AI 怎么知道哪些是入口？要不要给 JSON 加
   `layer: "entry"` 标记？还是让 host 看 `description` 自己猜？
C. **catalog 废掉，改成 skill 的 frontmatter auto-discovery**。host 读
   `skills/*/SKILL.md` 的 frontmatter，提取 `category` / `type` / `description`
   自动生成能力清单。优点：零维护。缺点：51 tactic 的 category 目前是空的
   （Phase A 还没填）。

**你要判定：R1 选的 Spec 机制会怎么影响这个决策。**
如果 R1 把 Spec 做成了 out-of-graph 的 entrypoint skill，那 catalog 可能跟着
并进去。如果 R1 说 Spec 还是走 JSON，那 B/C 路更合理。

### 缺口 3：冷启动入口 + `ResearchContext` 处理

v3 的冷启动路径：
1. 用户给一个研究问题
2. Host AI 调 `research-start` (entry skill)
3. `research-start` 里会调 `context-init`（建 context 文件）+
   `north-star-establish`（写 north-star）+ `research-catalog`（列能力）+
   生成初始 plan
4. 进入研究循环

**v4 的 `ResearchContext` 有 7 个字段（问题、领域、时间范围、资源约束...），
但实际用户冷启动时这些都是空的。怎么处理？**

选项（你要选一个并论证）：

A. **Hard gate**：`ResearchContext` 缺字段直接拒绝，让用户补全。
   优点：强制高质量输入。缺点：用户体验差（「我就想问个问题，为什么要填 7 个表单」）。
B. **Soft gate + 降级**：缺字段时触发一个 `context-elicit` 对话，
   问用户要信息，问不到就用默认值（如 `time_range: "recent 5 years"`）。
   优点：体验流畅。缺点：增加一个对话轮次。
C. **Zero-shot 推断**：让 host AI 从用户的研究问题里推断 `domain` /
   `time_range` / `evidence_type` 等字段，填进 `ResearchContext`，
   不问用户。优点：无感。缺点：推断可能错。

**你要判定：哪个选项的 hard gate 能做到真的 hard？**
如果选 A，「拒绝」的强制力来自哪里？是 host AI 看到 `ResearchContext` 缺字段
就不调任何 tactic？还是 DARE 的 tactic 入口处有个 schema validation？

## 你还要设计的入口体验

1. **能力发现的时机**：catalog（如果保留）在什么时候调？
   - 每次 session 开始时自动调一次？
   - 用户问「你能做什么」时才调？
   - Plan 生成前必须调一次作为节点池？
2. **能力的呈现方式**：51 tactic 的清单怎么给用户看？
   - 纯文本表格（v3 的方式）？
   - 按 `category` 分组（但 category 目前是空的）？
   - 按「典型研究场景」分类（如「文献综述」「实验设计」「数据分析」）？
3. **错误入口的处理**：用户直接问「帮我分析这篇 paper」（跳过了 north-star /
   plan 阶段），DARE 该拒绝还是自动补一个 implicit plan？

## 与其他岗位的接口

- **← R1 (运行时架构师)**：R1 的 Spec 归属决策会直接影响你的 catalog 机制选择。
  等 R1 的设计草案，看完再定你的方案。
- **→ R5 (正文编译)**：你设计的 catalog 机制（尤其是 B/C 路）会影响 R5
  怎么写 tactic 的 `description` 字段——如果 description 要被 auto-discovery
  读取，格式就不能随意（得是一句话，不能是三段论）。
- **→ R2 (审计官)**：catalog 机制的选择会影响某些 `MOVED_RUNTIME` contract
  的判定。如果 catalog 废掉了，那些「catalog 负责呈现能力」的 contract 就变成
  UNCOVERED。

## 必须读的文件

1. **v4 架构 JSON**：
   `d:\YOGSOTH-AI\file-transfer\2026-08-23-22-16-dare-v4-architecture.json`
   - `.boundaries.product_boundary_lane`：你的责任在这条泳道
   - `.node_model.research_context_schema`：7 个字段的定义
2. **v4 能力审计**：
   `d:\YOGSOTH-AI\file-transfer\2026-08-24-14-22-dare-v4-capability-coverage-audit.md`
   缺口 2 和缺口 3 的详细描述
3. **v3 的 entry 技能**（现在怎么做的）：
   `d:\YOGSOTH-AI\de-anthropocentric-research-engine\skills\research-start\SKILL.md`
   `d:\YOGSOTH-AI\de-anthropocentric-research-engine\skills\research-catalog\SKILL.md`
4. **v3 refactory 源**（找 entry 层节点）：
   `d:\YOGSOTH-AI\de-anthropocentric-research-engine\scripts\refactory_source.json`
   搜 `"layer": "entry"`

## 交付物

`d:\YOGSOTH-AI\de-anthropocentric-research-engine\channel\deliverables\R3\entry-ux-spec.md`

必须包含：

1. **Catalog 机制的选择**（A/B/C）+ 论证（200 字内）
2. **冷启动流程图**（从用户输入到进入研究循环的每一步）
3. **`ResearchContext` 处理方案**（A/B/C）+ Hard gate 的强制力来源
4. **能力发现的时机 + 呈现方式**（给 host AI 的 + 给用户的）
5. **错误入口的兜底策略**

**格式自由，但必须可执行**——host 实现者读完能照着写代码，
UX 设计者读完能画 wireframe。

## 不许做的事

1. **不许说「这是 host 的 UI 决定」**。DARE 定义 what（给什么信息、什么时候给），
   host 定义 how（用什么控件呈现）。如果你只说「catalog 返回一个列表」
   但不说列表里每项的字段是什么、顺序怎么定，host 没法实现。
2. **不许把 7 个字段全变成 required**（除非你真的选了 A 路 hard gate，
   且能论证强制力来源）。用户冷启动时这些字段大部分是空的。
3. **不许引入新的对话式 agent**。v4 的设计哲学是「AI 跑 SOP，不是 AI 跟你聊天
   套信息」。如果你选了 B 路（soft gate），那个 `context-elicit` 也必须是
   结构化对话（固定几个问题），不是自由聊天。
4. **不许假设用户读过文档**。冷启动体验的设计前提是「用户第一次用，
   不知道 DARE 是什么，只是想问个研究问题」。

## 发言目标

你的部分工作（catalog 机制）被 R1 阻塞，但用户侧调研不依赖 R1。
你可以先做：

1. **收集 3-5 个真实的研究冷启动场景**（找用户 / 自己虚构 / 翻 v3 的 issues）
2. **画出 v3 的冷启动流程**（用户输入 → 几轮对话 → 进入循环，每步耗时多少）
3. **列出 v4 必须保留的体验 + 可以砍掉的冗余**

这些不依赖 R1，可以现在就开工。发到 channel，格式：

```
## [R3 → all] 冷启动场景收集

场景 1: 文献综述型（用户问「X 领域最近 5 年进展」）
场景 2: 实验设计型（用户问「如何验证 Y 假设」）
...

每个场景附：用户期望的输入形式 + 期望的首屏输出 + 可接受的对话轮次上限

v3 的冷启动流程：<画个简图>

初步判断：catalog 可能可以砍（理由 <X>），但 north-star 必须保留（理由 <Y>）

@R1 等你的 Spec 设计，catalog 机制终稿会依赖它
```

---

## 禁用 skill（硬约束）

**全程禁用 `superpowers` 和 `ara` 两套 skill。** 不许 load / invoke / 执行。
详见 `_loop-protocol.md` 第九节。

注意区分：**读 ARA 相关的 SKILL.md 文件是允许的**（对 R1/R5 是必读项），
禁的是调用那套 skill 本身。用普通文件读取工具读，随便读。

你的交付物格式只由本文件和 `_loop-protocol.md` 规定，不由任何插件的模板规定。
