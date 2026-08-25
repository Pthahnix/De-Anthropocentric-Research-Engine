# DARE v3 → v4 能力覆盖审核

审核对象：`2026-08-23-22-16-dare-v4-architecture.json`（51 Tactic / 216 SOP / 146 capability contract）
基线：`de-anthropocentric-research-engine/skills/`（920 skill，四层 Campaign→Strategy→Tactic→SOP）
审核日期：2026-08-24
豁免范围（主人已批准移除，不计损失）：A 类 = 带 MCP/API 依赖的搜索类 skill；B 类 = subagent 类 skill

---

## 1. 结论

**科研认知层：节点级未发现缺失。** 九个 scientific family 的方法都有落点，66 个不可约专用算子保住，43 个 shared basis 自然浮现，图结构机器验证闭合（0 悬空边 / 0 孤立 SOP / 0 零调用 Tactic）。146 条 capability contract 无 REVIEW / UNKNOWN。

**产品外壳层：5 处缺口，其中 1 处阻塞。** v4 把所有非认知职责标成 `MOVED_RUNTIME` 或推给某层，而 runtime 层与 artifact 层在 `proposed_repo_layout` 里都还是空的。146 条里那 7 条 `MOVED_RUNTIME` 是唯一没有新节点背书的状态——它是责任声明，不是实现。

**内容层：v4 没有承接 v3 正文的字段。** v3 有 44,841 行正文（判据、阈值、rubric、反例），v4 全部节点的 desc 合计 35,829 字符。v4 JSON 里 **0 个节点带 `input_contract` / `output_contract`**。骨架闭合了，肌肉没有接口。

一句话：**v4 是一份完整的科研认知图，还不是可交付的产品架构，也还没有承接 v3 的沉淀物。**

### 缺口清单（按优先级）

| # | 缺口 | 级别 |
|---|---|---|
| 1 | Research Spec 体系 + session recovery 载体整体无归属 | **P0 阻塞** |
| 2 | 能力发现机制缺失——267 个扁平节点，AI 不知道自己有什么 | P1 |
| 3 | dialogue / elicitation 层消失，cold-start 入口断裂；hard gate 从结构强制降级为「希望 AI 自觉」 | P1 |
| 4 | `paper-reading` 的 30 个 v2 SOP 从未进入审计 | P1 |
| 5 | ARA rigor review 对象错配 + artifact 层无落点 | P2 |
| 6 | body compilation 无落点（v3 44,841 行正文 → v4 无字段） | P1 |

**缺口 1 未定之前不应继续压图。** Spec 的归属会反向决定哪些节点还需要对用户可见。

---

## 2. 方法与已知边界

四步：

1. 反查 v4 全部 `old` 字段 → 769 条 provenance 引用串 → 归一化为 636 个唯一 v3 名称。
2. 对未被引用的 v3 skill 按 frontmatter `type` / `execution` 分层，扣除 A、B 两类。
3. 对剩余候选做 token 重叠检测，找出与任何 v4 节点零重叠的项。
4. 对零重叠项与高信息量项逐条人工复核，对比 v3 SKILL.md 正文与 v4 节点契约。

**这套方法能抓什么：** 节点级的完全缺失。

**抓不到什么：** 语义削薄。token 重叠能抓「名字换了、语义还在」，抓不到「名字在、判据被削薄」。例如 `score-object` 吞了 15 个旧 scoring 节点，本次只验证了这 15 个都被 provenance 引用，**没有验证 15 种 rubric 的判据细节是否都进了 v4 contract**。同类风险见第 9 节的高吞并节点清单。

另：本次没有逐句读完 920 份 SKILL.md。存在于 v3 markdown 正文、但未进入 `scripts/data/*.json` 包图谱的能力，本次看不见——与 GPT 在 Pass 8 自述的局限同源。

因此全文用「**未发现缺失**」而非「通过」。这不是措辞谨慎，是在标记一件待办：高吞并节点需要一次 contract 级抽样复核。

---

## 3. 豁免范围核算

程序统计 920 份 frontmatter：

**B 类（subagent）：379 个** skill 声明 `execution: subagent` 或 `type: subagent`。纯执行器，扣除无争议。

另有 **8 个非 subagent 但正文会 spawn/dispatch**：`creative-ideation`、`deep-insight`、`knowledge-acquisition`、`direction-narrowing`、`experiment-running`、`implementation-planning`、`knowledge-compilation`、`subagent-execution-loop`。

其中 5 个是**科研 skill 顺带写了并行编排**。v4 的处理方向正确——保留科研语义、剥离编排。但两个要点名确认：
- `knowledge-compilation` 的科研落点 → 见缺口 5 与第 8 节
- `implementation-planning` → v4 已明确 `MOVED_RUNTIME`，无异议

**A 类（provider 耦合）：116 个** skill 正文含 provider token。分布：

```
vault_*  50    apify  36    brave  33    alphaxiv  33
semantic-scholar  19+7    rag-web-browser  13    wiki-vault  11
mcp__  4    tavily  2    pubmed  1    keenable  1
```

v4 全图 0 个 provider token，这一刀干净。**但 `vault_*` 那 50 个全部来自 `knowledge-structuring` 的 wiki 包装——包装删掉后，结构化知识往哪去，v4 没说。** 见第 8 节。

---

## 4. provenance 反查结果

```
v4 provenance 原始引用串        769
归一化唯一名                     636
其中对应真实 v3 目录              494
v3 中完全未被引用                426
```

426 个分层：

| 分层 | 数量 | 判定 |
|---|---|---|
| `execution/type: subagent` | 169 | B 类，正常 |
| import / import-sop / reference | 33 | A 类，正常 |
| 需人工判断 | 224 | ↓ |

对 224 个做 token 重叠检测：**只有 19 个与任何 v4 节点零重叠**，集中在三族——

- **ARA 族**：`ara-from-context`、`ara-compile`、`ara-rigor-review`、`context-review`、`context-exploring`、`north-star-align`、`compile-and-review` → 缺口 5
- **vault page 族**：`claim-page-creation`、`concept-page-creation`、`variable-page-creation`、`dimension-page-creation`、`intervention-page-creation`、`edge-batch-creation` → 第 8 节
- **engine-core runtime 族**：`context-init`、`context-checkpoint`、`spec-self-review` 等 → 缺口 1

其余 **205 个语义已被覆盖，只是未列入 provenance**。抽查样例：

| v3 名 | v4 落点 |
|---|---|
| `hypothesis-formation-novelty-scoring` | `score-object(rubric=novelty)` |
| `deep-insight-validity-envelope-mapping` | `map-validity-envelope(mode=systematic)` |
| `knowledge-structuring-gap-prioritization` | `rank-candidates(mode=gap-prioritization)` |
| `six-hats-rotation` / `role-based-ideation` | `problem-reframing(mode=perspective-shift)` |
| `zwicky-box-construction` / `design-space-mapping` | `explore-dimensional-space` |
| `*-saturation-detection`（多个 package 各一份） | `assess-evidence-saturation` |
| `*-quality-gate-check`（多个 package 各一份） | 各 Tactic 的 output contract（但见第 1 节：该字段在 JSON 里是空的） |

**这不是能力损失，是 registry 列举不全。** 建议把 205 条旧调用名补进 `registry/capabilities.json` 的 alias 表——实际价值是让 v3 用户的旧调用名可解析，不是好看。纯补录，不动架构。

---

## 5. 科研认知层：未发现节点级缺失

### 九个 family 分布

| family | Tactic | SOP |
|---|---:|---:|
| CROSS | 5 | 2 |
| STRESS | 9 | 29 |
| IDEATION | 8 | 19 |
| ACQUISITION | 7 | 32 |
| INSIGHT | 7 | 19 |
| HYPOTHESIS | 4 | 13 |
| STRUCTURING | 3 | 13 |
| EXPERIMENT | 3 | 19 |
| CONVERGENCE | 3 | 18 |
| DIRECTION | 2 | 7 |
| BASIS | — | 45 |

### 不可约算子保住了

66 个 `spec` 状态 SOP 覆盖：TRIZ 分离原理、FMEA、Sobol 分解、Morris screening、EVPI/EVSI、Flyvbjerg critical case、PRISMA 多阶段筛选、citation chaining、patent claim scope、Elo/Glicko rating update、MAP-Elites diversity、Real Options。**没有被参数化糊掉。** 这是 Pass 7/8 反向恢复的成果。

### falsification 能力块是 v4 最有辨识度的部分

Pass 8 恢复的 `falsification-first-audit` + 四个独立 audit（`audit-structural-equivalence` / `audit-validator-independence` / `audit-convergence-independence` / `audit-explanatory-compression`）。

GPT 拒绝把这四个压成单一 Tactic mode，理由是 input representation / failure criterion / internal state / scientific output 四项都不同。**这个判断正确，后续 Pass 不要回退。** 其中 `audit-validator-independence` 抓 PASS-by-construction，是普通 validity audit 无法替代的独立 epistemic failure。

### shared basis 是浮现的，不是钦定的

43 个 SOP 被 ≥2 个 family 调用。最强的：

```
assess-sensitivity     5 family / 7 caller
surface-assumptions    5 family / 6 caller
score-object           4 family / 6 caller
detect-coverage-gap    4 family / 5 caller
identify-variables     4 family / 4 caller
```

另有 160 个 SOP 只被一个 Tactic 调用。**这不是设计失误**——FMEA、Sobol、EVPI 本来就只服务一个场景。

### 科研判断 vs bookkeeping 的界线切得准

`assess-evidence-saturation` 留在图里（「新证据的边际信息增益」是科学判断）；轮数、token 预算、停止条件出图（bookkeeping）。`trace-citation-neighborhood` 用 relevance/saturation 决定终止但不指定 API——tool-decoupled 的正确范式。

### 图结构机器验证

```
duplicate node ID   0     dangling call edge   0
dangling jump edge  0     duplicate jump       0
orphan SOP          0     zero-call Tactic     0
```

jump 拓扑 82 条 T→T + 75 条 S→S，枢纽为 `rank-candidates`(11) 与 `falsification-first-audit`(9)。

**再次强调：以上是节点级未发现缺失，不等于已证明无损。** 语义削薄未验证，见第 9 节。

---

## 缺口 1（P0 阻塞）· Spec 体系与 session recovery 必须同一次决策

**这两件事不能拆开定。** Spec 是 recovery 读写的载体：v3 靠 Spec 的 checkbox 状态恢复执行进度，靠 `context-checkpoint` 恢复叙事上下文——同一个机制的两半。拆开定义会导致先写完 `docs/runtime-boundary.md`，才发现 Spec 还没有归属。

### v3 现状

`engine-core` 是**产品主干，不是可选外壳**：

```
de-anthropocentric-research-engine [entry]
   ↓
north-star-crystallization  ← hard gate
   ↓
writing-specs [strategy]
   ├─ research-catalog        能力菜单
   ├─ campaign-selection      选哪些 campaign
   ├─ scope-clarification     边界/深度
   ├─ constraint-elicitation  真实约束
   └─ spec-self-review        质量门
   ↓
executing-specs  ← 逐步执行 + context 协议 + recovery
   ├─ context-init        建 Phase 文件
   └─ context-checkpoint  追加 ≥500 行 markdown
```

README 对 Research Spec 的定义：机器可读、checkbox 进度、量化完成标准、backtrack 条件、*"Another CC instance picks up where you left off"*。

主人 `D:\YOGSOTH-AI\context\` 里 100+ 个 checkpoint 是这套机制的实物。

### v4 现状

- 全图 **0 个 spec / catalog / brief 节点**
- `capability_audit` 仅一条：`engine-core / context-management / checkpointing → MOVED_RUNTIME`
- 取而代之：host-owned state + `ResearchStateDelta{findings, evidence_updates, hypothesis_updates, assumption_updates, uncertainties, decisions, open_questions, recommended_jumps}`
- `proposed_repo_layout` 里 runtime 的全部内容 = 一份待写的 `docs/runtime-boundary.md`

### 为什么是产品级、且阻塞

README 承诺的四项在 v4 都没有实现载体：机器可读 spec、进度追踪、backtrack、跨实例接续。

**delta 只在内存流转，v3 checkpoint 是落盘的。** 删掉持久化而不指定替代物，session recovery 不是「移走了」，是**没有了**。

「host 拥有 state」听起来干净，但若 host 是 Claude Code，host state 就是会被压缩的 context window——而长 research 恰恰是它撑不住的场景。**把 state 交给一个会遗忘的容器，等于没有 state。**

delta 的合并语义全空：两个 Tactic 各返回矛盾的 `hypothesis_updates` 谁裁决、delta 是覆盖还是追加、`recommended_jumps` 是建议还是约束。

### 需要 GPT 决策

**先选一条路，写进架构文档：**

| 路 | 内容 | 代价 |
|---|---|---|
| A | Spec 作为图外产品层回到 DARE（`spec/` 与 `skills/` 平级） | 需定义 Spec 与 graph 的接口 |
| B | Spec 完全交给 host | **代价最大**——v3 的产品差异化就是「可执行 spec + 可恢复」，删掉它 DARE 的定位要重写，README 那句跨实例接续必须一并删除 |
| C | Spec 降级为可选模板 | 需说明 recovery 由谁承担 |

**选定后同步定完 recovery 规格**，`docs/runtime-boundary.md` 要写成可执行规格而非边界声明：
1. state 的持久化位置与格式（落盘？还是接受不落盘并承认无 recovery？）
2. delta 的累积规则与冲突裁决
3. 新 session 的恢复入口
4. 产品决策：`context/` 归档链是否继续生长，或主动断掉

---

## 缺口 2（P1）· 能力发现机制缺失

**v3：** `research-catalog`（能力菜单）+ `campaign-selection`（选择器）。四层层级本身也在帮 AI 逐层收窄。

**v4：** 删四层的同时把 `research-catalog` 也删了。`registry/graph.json` 是**纯数据文件——程序能读，AI 看不见**。全图 `menu` 出现 0 次、`catalog` 5 次（均为旧节点名引用）。

### 为什么是产品级

**能力存在但不可见，等于不存在。**

具体失败场景：AI 手上有可疑的 validator 结果。v4 里恰好有 `audit-validator-independence` 这个专抓 PASS-by-construction 的节点。但 AI 不知道它存在，于是退回通用的 `structured-red-team`——而 Pass 8 恢复这个节点的全部理由就是「普通 validity audit 代替不了它」。

这比 routing entropy 更根本。那个问「选得对不对」，这个问「看不看得见」。267 个扁平节点没有任何收窄机制。

### 需要 GPT 决策

v4 用什么机制承担 catalog 的职责。候选：
- 单一入口 skill 读 `registry/graph.json` 生成菜单
- 按 family 分组的索引文档（`docs/capability-index.md`）
- 明确划给 runtime——但要说清 runtime 怎么做，不能只写「host 负责」

注意这与缺口 1 耦合：Spec 留在 DARE 则 catalog 归 Spec 生成流程；Spec 交给 host 则 catalog 也得跟着走。

---

## 缺口 3（P1）· dialogue 层消失，cold-start 入口断裂

**v3：** `ask-constraints`、`ask-intentionality`、`clarify-resources`、`explore-resume`、`scope-clarification`、`constraint-elicitation`、`actor-profiling`、`final-validation`——一整套把模糊意图转成结构化输入的对话式 skill。

**v4：** 压成 4 字段 `ResearchContext{background, resources, hard_constraints, intent}`，audit 写「采集不再是科研 Tactic」。全图只剩 `elicit-weights` 一个带 elicit 语义的节点，且它是给 MCDA 权重用的。

### 为什么是产品级

elicitation 确实不属科研认知，**这个方向对**。但：

v3 `cold-start` 的定义就是「给完全没有研究方向的用户」。v4 假设 `ResearchContext` 已填好——**而在 cold-start 场景下，填这个 context 本身就是产品要做的第一件事。** 现在没有任何东西负责填它。入口断了。

### 附带：hard gate 从结构强制降级为「希望 AI 自觉」

v3 靠层级强制：拿不到 North Star + ResearchBrief 不准进 Phase 2。

v4 只剩一条 `decompose-research-goal → crystallize-north-star` 的 calls 边——而 v4 自己在 `edge_semantics` 里定义 calls **「不是强制线性顺序」**。

这不是「无归属」，是**强制力被降级**。

### 需要 GPT 决策

1. runtime 层是否需要一个明确的 elicitation 组件？DARE 还要不要支持 cold-start？
2. `ResearchContext` 字段缺失时的行为：拒绝执行 / 降级 / 触发采集？
3. hard gate 的强制力从哪来——runtime 前置检查，还是给 Tactic 加 `precondition` 字段？

---

## 缺口 4（P1）· paper-reading 的 30 个 v2 SOP 从未进入审计

**位置：** `de-anthropocentric-research-engine/paper-reading/skills/`，30 个 SOP + validator + 设计规格，2026-08-07 提交。

```
unit-segmentation          unit-classification        atomic-unit-matching
atomic-unit-writing        atomic-unit-recall-aggregate
qalmri                     first-pass-skim            second-pass-grasp
third-pass-deep-read       claim-writing              claim-label-prediction
quality-appraisal-checklist                reporting-standard-checklist
reproducibility-third-party-verification   multi-stage-cascade-extraction
qasper-evidence-qa         rationale-selection        template-slot-filling
dual-column-self-check     study-design-tool-gate     sum-threshold-scoring
engineering-config-grading star-awarding              domain-level-judgment
rhetorical-structure-quality  research-question-appraisal
question-framing           signalling-question-answering
worst-case-lookup          paper-fetch
```

**10 轮 Pass 里一次都没被提及。** 不在 provenance，不在 audit，完全不可见。

### 为什么是产品级

这批 SOP 与 v4 的 216 个 SOP **同层、同问题域**——都是原子级科研认知操作。若 v4 按现状落地，产品内会出现两套并行 SOP 体系，各有各的命名法与调用约定。这是架构分裂，不是文档缺失。

**更关键的：** `unit-segmentation` / `atomic-unit-matching` / `atomic-unit-writing` 正好对应主人在 Pthahnix-02 提出的那个 AI-native strategy 设想——

> 「对于一个 topic，让 AI 先 lit survey 来 100+ paper 的信息量，将他们分解成 atom 级别的东西，然后进行进一步的匹配底层逻辑」

**这是触发整个 v4 重构的初始动机。它没进审计，等于重构漏掉了引发重构的那个用例。**

### 需要 GPT 决策（三条路选一）

- **A**：按 v4 同一套规则编译进 216 SOP（会触发新 merge 与新 capability contract）
- **B**：明确划为图外的独立读论文管线，并说明它与 `synthesize-literature-evidence` / `extract-evidence-record` / `trace-citation-neighborhood` 的调用关系
- **C**：判定已废弃

**注意：GPT 从来没看见过这批东西**——它只读了 `scripts/data/*.json`，而 `paper-reading` 没有导出图谱。主人需要主动把这 30 个 SOP 喂给它。

---

## 缺口 5（P2）· ARA rigor review 对象错配 + artifact 层无落点

**v3：** 完整的 `ara-from-context` 产出线，7 个 skill，配外部 compiler 与 Seal Level 2 六维 rigor review，把 `context/` 研究记录编译成 Agent-Native Research Artifact。

**v4：** Pass 3 判定「north-star alignment 和 rigor review 已被现有 Tactic 覆盖，其余属 artifact/export 层」。但 `proposed_repo_layout` 里**没有 artifact/export 层**，v4 JSON **0 条 ARA 记录**。

### 只是 P2 的理由

ARA 有外部 compiler，本来就在 DARE 图之外跑。孤儿化之后仍然能用，不阻塞 v4 落地。

### 但这里有一处判定错误，比层归属更值得修

**「rigor review 已被现有 Tactic 覆盖」这个判定错了。**

- Seal Level 2 六维审查 = 对**成品 artifact** 的分级质检
- 图里的 `audit-study-validity` = 对**研究设计**的审计

**对象不同，不能互代。**

这意味着 146 条 contract 里可能还有同类误判——**「都叫 audit / 都叫 review，所以算 covered」**。这条比 ARA 整条线的归属更需要处理。

### 需要 GPT 做

1. 重审 `ara-rigor-review` 的 capability contract，判定是否需要一个 artifact 级质检落点
2. **自查 146 条里还有没有其他「对象不同但判为 covered」的项**
3. 明确 ARA 层归属：补 artifact/export 层，或明确剥离并说明与 `context/` 的关系

---

## 缺口 6（P1）· body compilation 无落点：v3 的 44,841 行正文

### 体量

```
v3   920 skill    44,841 行正文    2.1 MB
v4   267 节点     35,829 字符 desc  0.04 MB      ← 59 : 1
```

**这个比不代表压缩率，代表两件不同的事。** GPT 十轮只读了 `scripts/data/*.json`，从没读过 SKILL.md 正文。v4 的 desc（平均 134 字符）不是正文的摘要，是**节点标签**。那 44,841 行正文在 v4 里目前没有对应字段。

### v3 正文里是什么

按类型点census：

| 内容类型 | 出现次数 | 覆盖 skill |
|---|---:|---:|
| 表格行 | 9,525 | 824 (90%) |
| 编号步骤 | 2,062 | 353 (38%) |
| 阈值/数字判据 | 881 | 319 (35%) |
| 显式 rubric | 750 | 205 (22%) |
| 失败/反例 | 560 | 156 (17%) |
| 代码/schema 块 | 550 | 213 (23%) |
| 具名方法引用 | 202 | 64 (7%) |

**阈值、rubric、反例这三类是不可重建的**——LLM 临场编不出「至少 5 篇 primary source」或一张 1–5 分的评分标尺。表格行占 90% 说明主人的写法本身是判据密集型，不是散文。这是 40 小时的沉淀物，也是 DARE 相对「一句 prompt 让 AI 做科研」的真实护城河。

### 落点

provenance 能追到 **31,278 / 44,841 行（70%）**。剩下 30% 是已批准移除的 A/B 两类加上前述缺口。另有 **16 个 v4 节点 provenance 为零**——纯新造，无 v3 正文可继承，正文得从头写。

**关键约束：v4 JSON 里 0 个节点带 `input_contract` / `output_contract` 字段。** 这两个词只活在最终 HTML 的说明文字里。所以 GPT 反复说的「折进 Tactic 的 output contract」——quality gate、report synthesis、consensus state——在机器可读数据层**目前全是空的**。

正确落点不是 JSON，是 `skills/<id>/SKILL.md` 正文。v4 自己的 layout 已经规定了这个分工：

```
skills/<id>/SKILL.md   ← 是什么 / 何时用 / 怎么想 / 输出 / failure condition
registry/graph.json    ← kind / calls / jumps / modes / provenance
```

31,278 行摊到 267 个节点 = 平均 **117 行/节点**。v3 平均 49 行/skill。v4 每个节点的正文会比 v3 单个 skill 厚一倍多，**这个厚度合理**——它承接的是 2–26 个旧 skill 的判据。

### 高吞并节点是语义削薄的高危区

| v4 节点 | 吞并旧节点 | v3 正文行数 | modes |
|---|---:|---:|---:|
| `analyze-constraints-readiness` | 26 | 1,426 | 5 |
| `synthesize-meta-analytic-evidence` | 9 | 1,021 | 0 |
| `rank-candidates` | 20 | 930 | 8 |
| `establish-empirical-baseline` | 9 | 870 | 0 |
| `audit-benchmark-validity` | 7 | 754 | 0 |
| `adversarial-deliberation` | 12 | 700 | 7 |

`analyze-constraints-readiness` 一个节点要吸 1,426 行、5 个 mode = 285 行/mode。量级还能写，**前提是 26 个旧 skill 的 rubric 差异真能被 5 个 mode 表达完**。

表达不完，结论只有两个：mode 数要涨，或者这次 merge 压过头了。**这正是第 2 节所说「语义削薄」风险的具体形态。**

本次审核只验证了这 26 个旧节点都被 provenance 引用，**没有验证它们的判据能不能塞进 5 个 mode**。

### 需要 GPT 做

在 v4 骨架不变的前提下，加一个与架构设计**分开**的阶段，叫 **body compilation**：

1. 每个 v4 节点建一张 `provenance → body` 映射，把 2–26 份旧正文的判据/阈值/rubric/反例/表格按 mode 归拢
2. **上表 6 个高吞并节点先做**——它们既是高危区，也是判断 mode 数是否够用的试金石
3. `input_contract` / `output_contract` 真正写进 `registry/graph.json`（现在是 0）
4. 16 个零 provenance 节点标出来，正文从头写

---

## 判为工程细节 · 不上报

**`calls` 边无顺序约束是否制造新 routing entropy。** v4 定义 calls 为「可组合的 SOP 词汇表，不是强制线性顺序」。但 `analyze-constraints-readiness` 15 calls + 5 modes、`design-experiment` 12 calls、`rank-candidates` 11 calls + 8 modes——理论上可能把四层的层级熵换成单层的组合熵，与重构动机之一相悖。

**推测，无实证。归入 Pass 11 routing probe 待测。** 但可以现在就廉价验一次：单独把 `analyze-constraints-readiness` 喂给模型，看它是否倾向全量遍历。十几次调用的成本，不必等完整探针。

正式探针要测：高 fan-out Tactic 的 SOP 选择熵、无意义全量遍历倾向、mode 选择稳定性。

**结构化知识的 output schema。** 在 `build-domain-ontology` / `construct-causal-model` / `construct-argument-map` 三个 Tactic 的 `output_contract` 里把 entity / relation / evidence / hierarchy 的字段形状写死即可，host 拿到后自由存 markdown / Neo4j / wiki-vault。Pass 10 之后的常规收尾，无产品决策成分——已并入缺口 6 第 3 项。

**205 条 provenance 未列名。** registry 补录，非能力损失。见第 4 节。

**7 条 `MOVED_RUNTIME`。** routing / budget / checkpoint / context recovery / agent dispatch / execution monitoring / critical-path scheduling——移出方向正确，问题在接收方是空的，已由缺口 1 表达，不重复计数。

---

## 迁移影响（本次审核补充维度）

前述各节比对的是「v3 repo 有什么 / v4 有什么」。但主人有既有工作流资产，v4 落地后各自怎么办，v4 方案没说：

| 资产 | 现状 | v4 落地后 |
|---|---|---|
| `context/` | 100+ checkpoint + 两条 ledger（`history/2026-06-04/INDEX.md`、`bio-dare/INDEX.md`） | 缺口 1 未定 → 未知 |
| `vault/` | wiki KB，wiki-vault MCP 已发 npm | wiki-* 包装全删 → 已有页面谁维护 |
| `presentations/` | 7 个 HTML dashboard | 依赖 `scripts/data/*.json`，v4 换 `registry/graph.json` → 需重生成 |
| `scripts/data/*.json` | 15 个包图谱，v4 的唯一输入源 | 被 `registry/graph.json` 取代？还是并存 |
| v3 旧调用名 | 用户/文档里的历史引用 | 靠第 4 节 205 条 alias 解析 |

**这些不算架构缺口，但是要付的真实迁移成本。** v4 方案应有明确说明。

---

## 给 GPT 的工作清单

**P0（v4 落地的前置）**
1. 缺口 1：Spec 体系归属 —— A/B/C 三条路选一条，同时写完 recovery 规格四项。**此项未定之前不要继续压图。**

**P1**
2. 缺口 2：能力发现机制落点
3. 缺口 3：elicitation 归属 + `ResearchContext` 缺失字段行为 + hard gate 强制力
4. 缺口 4：paper-reading 30 个 SOP 图内/图外裁定（**主人需先把这批 SOP 喂给 GPT**）
5. 缺口 6：body compilation 阶段定义，6 个高吞并节点先做

**P2**
6. 缺口 5：`ara-rigor-review` 对象错配 + 自查 146 条同类误判 + ARA 层归属
7. 迁移影响一节
8. 对 `score-object` / `rank-candidates` / `analyze-constraints-readiness` / `adversarial-deliberation` 做 contract 级抽样复核——验证旧节点的判据细节是否真进了新 contract

**P3**
9. 补 205 条 provenance alias（纯机械）
10. 廉价验一次 fan-out 熵

---

## 一句话

v4 把**科研认知**编译得很干净——146 条 contract、43 个浮现的 shared basis、66 个保住的不可约算子、闭合的图。这部分可以照着改 repo。

但它把所有非认知职责标成 `MOVED_RUNTIME` 或推给某层，而 runtime 层与 artifact 层在 layout 里都是空的；删四层时连 `research-catalog` 一起删了，267 个节点现在没有被发现的机制；44,841 行正文没有承接字段。

**补齐 runtime 与 artifact 两层的规格、给能力发现一个落点、定义 body compilation，v4 才是完整的产品架构。** 现在它是一份完整的科研认知骨架，加三份待写的文档。
