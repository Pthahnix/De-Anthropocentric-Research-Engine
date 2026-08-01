# Paper-Reading Pkg Scoping — DARE 现有方法论盘点 + 外部方法论调研

> Created: 2026-07-29 18:19
> Topic: 新建 paper-reading 专用 pkg（单篇论文精读 → 公众号内容生产）的前置调研
> Phase: North-star 前的方法论盘点（非正式 crystallization，用户直接给了具体方向 = hot-start 味道，但本轮只做调研落盘，未走完整 spec）

## Plan Context

用户想做一个专门的 skill pkg：对**指定的单篇论文**做精读，产出用于**微信公众号定期投稿**的论文解读内容。计划分三步：(1) 先盘点 DARE 现有的 paper-reading 相关 skill/方法论，(2) 把它们分别整理成独立 skill，通过某种 "skill-ops" 机制迭代优化形成方法论，(3) 配合写作技巧类 skill repo 产出公众号内容。本次调研用 alphaxiv + /research-catalog + web search，覆盖 DARE 内部盘点 + 外部论文/repo 方法论调研两块，为后续 pkg 目录搭建和 north-star crystallization 打底。

## 一、DARE 内部现存 paper-reading 谱系（子agent盘点，已核实）

### 单篇精读主线
| skill | pkg | 层 | 作用 | 依赖 |
|---|---|---|---|---|
| `literature-research` | literature-engine | sop | 全文深读 + 定向 PDF 问答，直接调 MCP 工具 | 无（叶子） |
| `deep-insight-paper-research` | deep-insight | sop（import） | Keshav 三遍法 wrapper，论文内容主张的权威来源 | literature-research |
| `deep-insight-paper-overview` | deep-insight | sop（import） | 仅摘要/元数据概览，明确不能用于实质性主张 | literature-overview |
| `deep-insight-paper-search` | deep-insight | sop（import） | 论文发现 | literature-search |

### 跨论文综述/提取主线（knowledge-acquisition）
- `literature-survey`（campaign）按研究意图挑选 5 种综述策略：`deep-survey` / `systematic-survey` / `narrative-review` / `scoping-survey` / `landscape-survey` / `snowball`
- 提取类 sop：`extract-data`、`quality-assessment`、`thematic-coding`、`effect-size-extraction`、`risk-of-bias-assessment`、`protocol-element-extraction`、`score-extraction`、`condition-cataloging`、`reproducibility-checklist-audit`
- **`survey-synthesis`（sop）——已存在的写作收尾步骤**：把提取数据+精读笔记编织成一篇连贯文档，5 种综述策略最后都走它。但它是学术综述腔、跨论文综合，不是单篇聚焦、不是公众号调性。

### 其他相关但非核心
- `citation-chaining`（tactic）双向引文网络扩展
- `reviewer2-hat`（sop）敌对评审视角，可映射为"批判性解读"角度
- `synthesis-report`（sop）另一个不同的合成机制，跑在 wiki-vault 图上，非论文专用
- v0.1–v0.2 废弃项（scholar-read/digest-extraction/facet-extraction/paper-rating/academic-research）确认真的删除，非改名

### skill-ops / 写作技巧现状
- `ara-skills` CLI 只是包管理器（install/list/update），无质量迭代机制；`rigor-reviewer` 评的是研究产出物不是 skill 定义本身
- workspace 内 `.claude/skills/` 及各 repo 中**零命中**写作/公众号/文案/rhetoric 类 skill 包
- `docs/skill-list/skill-index.md`（CLAUDE.md 提到的路径）在本机不存在，已过期

## 二、外部方法论调研（alphaxiv + web search）

### 2.1 经典基线：Keshav 三遍阅读法
S. Keshav, "How to Read a Paper," ACM SIGCOMM CCR 2007（原文 http://ccr.sigcomm.org/online/files/p83-keshavA.pdf ，各高校课程广泛转载）。核心：拒绝从头读到尾，三遍递进——第一遍抓 gist（问题/贡献/结论），第二遍抓内容但不深究细节，第三遍深度理解（可复现级别）。DARE 的 `deep-insight-paper-research` 正是这个方法的 wrapper——**证实我们现有主线的方法论根基是对的、是业界标准**，不是自造的。

### 2.2 InsightGUIDE（alphaxiv 2509.20493）—— 关键参考，直接可抄的结构化 prompt 设计
论文：InsightGUIDE: An Opinionated AI Assistant for Guided Critical Reading of Scientific Literature（2025-09-24）。把 Keshav + Andrew Ng（Stanford CS230 读论文讲座）的专家阅读法**操作化成结构化 system prompt**，三个核心组件：
1. **Sectional Analysis & Synthesis** —— 按 Abstract/Introduction/Methods/Results 逐节分析，每节抽取指定要素（问题/创新点/关键发现）
2. **Critical Evaluation & Attention Signals** —— 主动提问式批判（"结论是否被数据支撑？"），用图标标记创新点/方法局限/高影响图表（"Priority Signals"）
3. **Reader Guidance** —— 非线性阅读路径建议（按读者目标：技术复现 vs 快速概览走不同顺序）

对比实验（同一模型，仅换 prompt）显示：结构化版本产出"逐节拆解+关键贡献+方法局限+批判性问题+图表引用+可操作导航"，通用摘要版本只产出一段连贯但无分析深度的文字。**这直接证明：把阅读方法论"操作化成结构化步骤+输出模板"这件事本身就能显著提升质量**，是我们做"从方法论到 skill"这一步的直接证据。局限：prompt 目前是 one-size-fits-all，作者计划做"阅读画像"（实证研究/文献综述/理论论文分不同模板）——这点对我们有参考价值（不同论文类型可能需要不同精读模板）。

### 2.3 ResearchStudio-Reel / Paper2Blog（alphaxiv 2607.04438）—— 最直接对口的公众号生产参考
Microsoft Research 等，2026-07。5 个 Claude Code / Codex skill 组成的"论文→多渠道产出"流水线：`Paper2Assets`（共享抽取层）→ `Paper2Poster` / `Paper2Video` / `Paper2Blog`（三个产出生成器）→ `Paper2Reel`（交互汇聚层）。**`Paper2Blog` 明确产出"中文公众号 + 英文研究博客"双语文章**，与我们的目标场景几乎重合，值得细读：

- **架构关键**：`Paper2Assets` 一次性抽取（正文/图表/元数据/九段式摘要：Problem/Motivation/Contribution/Method/Dataset/Key Result/Ablation/Headline Numbers/Takeaway），下游生成器都读这份共享 bundle，不重复解析原文——**这对应我们"精读提炼"和"写作收尾"该分层的直觉：精读产出一份结构化 bundle，公众号写作是消费这份 bundle 的下游之一，不是每次重新读论文**。
- **Paper2Blog 五条设计要求（C1–C5）**，直接可借鉴为我们的验收标准骨架：
  - C1 一个证据库支撑两种语言（"证据地图"= hook/problem/method/claims/quant results/limitations/source links/figure roles，先建证据地图，中英文分别只从这份地图起草，不做逐句翻译）
  - C2 文风必须在**生成前**用 style guide 控制（中文限制在"克制的公众号调性"，不能事后靠脚本检查文风）
  - C3 图表需要"文章级选择+摆放"，不是照搬所有抽取到的图（选 3–7 张证据性图，放在解释它的段落旁）
  - C4 交付物是可编辑 Word 文档，不是纯文本
  - C5 版式要当作"渲染后的视觉产物"来检查（孤儿行、近空白页、图片缩水）
- **质量门（Quality Gates）**：事实核对（数字/术语/claim 中英一致）、图文契合（是否放在读者理解它之前的位置）、版式检查（分页/孤行）——三层门禁，**且明确说"文风本身不能靠事后确定性脚本检查，必须在起草前用 style guide 控制"**，这条对我们的"skill-ops 迭代优化"思路是个重要提醒：文风质量的检查点应该前置在生成阶段，而不是后置成一个裁判 skill。
- 定位对比表（论文 Table 3）显示：Semantic Scholar TLDR / NotebookLM / Scholarcy 等现有工具都不做"图文并茂+可编辑+版式检查"的公众号级产出，这块目前市场上也是空的。

### 2.4 Paper Espresso（alphaxiv 2604.04562）—— 节奏/选题参考，非精读方法论
NUS 团队，35 个月持续运行的 arXiv 趋势监测系统，非单篇深读工具（只做 2-4 句摘要+topic 标签），但对我们"定期投稿"这个节奏问题有参考：它用 HuggingFace Daily Papers 的社区投票作为选题信号（只处理 arXiv 的 2-3%），日度/月度/生命周期三个粒度出报告。**如果我们的公众号也要"定期"，选题环节可以借鉴"用外部热度信号筛选值得精读的论文"这个思路**，但这是选题而非精读本身，不是本次盘点重点。

### 2.5 GitHub repo 快照
- `jxtse/scientific-research-skills`：有 `paper-reading` skill（三级阅读：skim→read→deep analysis，结构化 digest 输出），`related-work-survey`、`literature-search` 辅助。**无写作/公众号产出环节**，最接近的是 `academic-figure-generation`（从方法文本生成图，非文字内容）。
- `oldlybaby/paper-reading-guide`：苏格拉底式对话引导阅读（先摸底读者背景，再"预测后揭示"式带读），哲学是"阅读=构建心智模型"而非"信息传递"。**明确不产出任何书面分析/报告/摘要**，止步于读者自己的理解，对我们没有直接可抄的产出结构，但"因材施教式提问"这个思路可能对公众号"读者友好度"有启发。
- 其余搜到的 repo（`c-narcissus/agent-paper-grounded-reading`、`Richard-ZSR/academic-paper-professor`、`drpwchen/paper-review-and-digest` 等）未逐一深挖，标题暗示同类（grounded reading / digest），后续如需要可再补查。

## 三、初步结论（供下一步 crystallization 参考，非最终决策）

1. **DARE 现有精读主线（Keshav 三遍法 wrapper）方法论根基没问题，与业界标准一致**，不需要从零发明"怎么读论文"。
2. **真正的空白在"精读结果 → 公众号成稿"这一段**，DARE 内部（`survey-synthesis` 学术综述腔）和外部工具（Semantic Scholar TLDR / NotebookLM 等）都没有覆盖这个组合（图文并茂 + 可编辑 + 双语/公众号文风 + 版式检查）。
3. **Paper2Blog 的分层设计值得借鉴**：先建"证据地图"（结构化提炼层，不含文风）→ 再分语言/受众起草（文风层）→ 再走质量门（事实/图文/版式三层检查）。这与用户设想的"精读 skill + skill-ops 迭代 + 写作技巧 skill"三段式基本吻合，可以作为 pkg 内部分层的参考骨架。
4. **文风质量应该前置在生成阶段（style guide 驱动起草），而非做成一个事后裁判 skill**——这点如果用户坚持要"skill-ops 迭代优化"机制，需要想清楚迭代的是"起草前的 style guide/模板"还是"事后打分"，二者对应不同的技术路径。
5. 选题节奏（Paper Espresso 式）是精读之外的独立问题，不在本次盘点范围内，但若公众号要"定期投稿"，后续可能需要单独考虑。

---

## Checkpoint: 涌现式建 skill 方案的假设审查 + 红队攻击 + benchmark 可行性判断

### Objective

用户在上一轮调研（DARE 内部 + 外部方法论盘点）之后，提出了这个 paper-reading pkg 的**第一步实验方案**：(1) 从网上搜集各种"如何读论文"的方法论（论文/GitHub repo），把每一个都做成一批"init 状态"的原始 skill——不套 DARE 四层架构（campaign→strategy→tactic→sop），或者只做最简单的初始形态；(2) 不预先设计四层架构，而是让 CC/Codex 实际使用这些 skill 时的行为习惯，自发地"涌现"出四层架构来；(3) 用户明确知道这类自组织/训练实验要有意义，必须是**可验证的**（verifiable）——需要一个 benchmark，能评估"给定一批 skill/harness，AI 读一篇论文读得怎么样"。用户要求用 `/research-catalog` 对这个方案做认真分析，并指定用其中的 skill 来 pipeline 这次分析，最后要求结果长话短说、口语化（`/humanizer` 风格）。本 checkpoint 记录完整分析过程和结论，供后续设计决策回溯。

### Process Summary

**Step 1 — 选定分析 pipeline（来自 `/research-catalog` 的三个 package）。** 没有走完整的四大 campaign 走查，而是先读了三个候选 package 的 skill 表（`references/deep-insight.md`、`references/stress-test.md`、`references/convergence.md`，各自 112/103/120 个 skill），从中挑出三个最匹配任务性质的分析步骤，理由如下：
- 用户的方案里藏着若干"没有验证过就当真"的假设（尤其是"四层架构能自发涌现"这一条），这正是 `deep-insight` campaign 下 `assumption-audit` strategy 的适用场景——"Surface all assumptions, classify by vulnerability (load-bearing × likely-false), validate causal logic. Focus on dangerous assumptions — high load-bearing + non-explicit."
- 找出最危险的假设之后，需要真刀真枪去攻击它、给出明确的可行/不可行判断，这对应 `stress-test` campaign 下 `red-teaming` / `key-assumptions-check` 的方法："Military ACT: systematically enumerate all assumptions, classify by type, and evaluate evidence strength supporting each."
- 用户提出的 benchmark 需求，本质是一个"这件事现在做到什么程度算可行"的判断，对应 `convergence` campaign 下 `feasibility-assessment`（轻量借用，不走完整 TRL/NASSS 流程，只借用其"评估候选方案可实现性"的框架精神）。
- 没有选用 `hypothesis-formation`、`knowledge-structuring`、`creative-ideation` 等其他 7 个 package，因为本轮任务不是生成新假设/新点子，也不是往 wiki-vault 建结构化知识图谱，是纯粹的"审查一个已经提出的方案是否站得住脚"，三段分析（审假设→攻假设→判可行）已经覆盖任务需求。

**Step 2 — 委托子 agent 执行三段分析。** 用一次 `Agent` 调用（非后台，同步等待结果），把完整背景喂给子 agent：包括用户当前方案的三个步骤原文、以及必须视为既定事实的 DARE 项目背景（ladder-foundry 三层 CC 嵌套架构、三个"可训练权重"、spec#1→spec#2 的谱系、eval-anchor probe 的 GO 信号及其"不能迁移到新领域"的明确警告）。之所以要求子 agent 把这些背景当作"已确立的事实，不要重新推导"，是因为这些内容已经在项目 CLAUDE.md 和既有 memory 里反复确认过，重新推导只会浪费 token 且可能引入偏差。子 agent 被要求严格按三段输出，且总字数控制在 700 词以内，因为这份报告是要喂给我（父 agent）再压缩一遍讲给用户听，不是终稿。

**Step 3 — 压缩子 agent 结果为口语化短回复。** 按用户 `/humanizer` 的要求，从子 agent 的结构化三段报告中，只挑最锋利的 3 条结论，用直接、不绕弯子的口语讲给用户，省略了大量子 agent 报告里的中间论证细节（例如 A1/A3/A5 三条次要假设、Pass1 里每条假设的完整 load-bearing 打分）。这些被省略的细节现在在下面的 Key Findings 里补全记录，供未来需要时回溯。

### Key Findings — Pass 1：假设审查（deep-insight/assumption-audit 风格）全量记录

子 agent 从用户三步方案里挖出了 5 条 load-bearing 假设，完整列表如下（口语回复里只提了 A2 和 A4，A1/A3/A5 是补充记录）：

**A1 —— "内容现在写、结构以后补"是可分离的两步。** 假设：现在把方法论写成松散/无结构的 skill，以后套上四层架构时，只需要重新归档（挪文件、改 frontmatter），不需要重写内容本身。危险程度：中等 load-bearing——如果这个假设错了（也就是说套上架构之后，为了让 skill 在 campaign/strategy/tactic/sop 各自的抽象层级上说得通，内容本身也要大改），那"先收集再分层"这个顺序省下来的工作量就是假的，等于白做一遍。这条假设目前既没被验证也没被推翻，是本次分析里唯一一条"存疑但暂无定论"的假设。

**A2 —— 四层架构能从"使用行为"里被动涌现（不需要显式的优化器/重写循环）。** 这是整个方案的核心断言，也是 Pass 2 红队重点攻击的对象，完整论证见下一节。危险程度：完全 load-bearing——如果这条假设是假的，"让它自发涌现"这一步产出的结构变化是零，方案的第二步直接落空。

**A3 —— 使用频率/共现关系可以映射到抽象层级。** 隐含在 A2 里的一条更精细的假设：就算你真的去看"这些 skill 被调用的频率、共现模式"，这个信号本身跟 campaign→strategy→tactic→sop 这个抽象层级的划分，到底有没有对应关系？子 agent 指出：**四层架构是"目标抽象程度"的层级，不是"调用频率"的层级**。举个例子，一个 campaign 级别的"读这篇论文"目标和一个 sop 级别的"解析这个 PDF"动作，在几乎每一次实际运行里都会同时出现（共现频率极高），但它们显然不该被划到同一层。也就是说，哪怕你真去做了"观察使用模式"这件事，用频率/共现作为唯一信号来划分层级，本身的信号-目标映射关系也是存疑的，容易把该分开的东西合并、把该合并的东西分开。

**A4 —— 研究质量 no-ground-truth 探针的方法能直接搬到论文精读领域。** 这条已经被用户自己项目里的记录明确否定过——`project-dare-phase-map-reframe.md`（对应 memory）写得很清楚："Phase-1 GO 不能迁移到新领域，需要重跑自己的 feasibility probe"。子 agent 特别强调：这不是一个还悬而未决、需要讨论的问题，是已经有明确记录、已经知道答案的问题——**不需要重新论证"能不能迁移"，答案已经是"不能，需要重新做"**。

**A5 —— benchmark 可以在"收集方法论 skill"这个实验做完之后再补上。** 危险程度取决于：如果不先想清楚"验证什么、怎么验证"，你在收集阶段根本不知道该埋什么遥测点、该记录什么日志。等收集做完了才想起来要建 benchmark，很可能发现当时没留下需要的数据，等于收集阶段要重做一遍。这条呼应了 DARE 自己在 spec#2 里的经验——32-check 探针能跑起来，前提是先有 eval-anchor probe 验证过"硬事实锚点"这个更窄的机制可行，不是先把探针设计写完再回头看数据够不够。

### Key Findings — Pass 2：红队攻击（stress-test/key-assumptions-check 风格）完整论证

**攻击目标：A2（四层架构能被动涌现）。**

子 agent 的核心论证链条：CC/Codex 的 skill 调用机制是**无状态**的——每次调用一个 skill，读取的是一份静态的 markdown 文件，调用本身不会往任何地方"写回"什么东西。skill 文件不会因为被读取的次数多了、被组合调用的方式多了，就自动地改变自己的位置、自己的内容、或者自己与其他 skill 之间的层级关系。这不是"目前技术水平做不到"的问题，是这套机制的架构性质决定的——**读操作和写操作是完全分离的**，除非有一个独立的进程专门去读"使用记录"、做出判断、然后主动去改写 skill 文件，否则调用行为本身产生的唯一后果是产生了"这次调用发生了"这个事实（可能被日志记录下来），不会有任何自动的结构性后果。

子 agent 特别指出，用户自己的 ladder-foundry 项目就是这个论点的现成反例证据：三个"可训练权重"（①档位话术、②插值器、③组装逻辑）从来不是"被 sim-cc/exec-cc 使用了几次之后自己就变了"，而是有一个专门的、长驻运行的 optimizer-cc，读取两个 codex 裁判（loss-1 injection-fidelity、loss-2 ladder-quality-order）产出的 loss 信号，然后**主动地、有意识地**去改写权重文件。跑 sim/exec session 这件事本身只产出"数据"（trace、transcript），从数据到架构变化之间，隔着一个专门设计、专门执行的 backprop 步骤。用户自己的项目里已经把这个道理讲得非常清楚（"§backprop = 先归因再动手"），只是这次提新方案的时候，可能没意识到这个道理同样适用于"skill 该怎么分层"这个问题。

子 agent 给出了一个"善意理解"的替代版本：**用户实际想做的，可能不是字面意义上的"自发涌现"，而是"人来观察使用遥测（频率、共现、调用序列），用这些数据作为启发式证据，人工或半脚本化地去决定层级边界该怎么画"。** 这是一个完全合理、也确实是很多真实系统设计中会用的"自底向上架构发现"方法——但它的本质是**人在回路里的归纳式重构（human-in-the-loop inductive refactoring）**，跟"涌现"（emergence，意味着没人管、它自己就发生了）是两个完全不同的东西。用"涌现"这个词来描述前者，风险在于：设计出来的实验会变成"先运行，然后等着看会发生什么"，而没有人真正去设计和执行那个"观察→判断→改写"的步骤——因为大家（包括设计者自己）以为这一步是自动发生的。

**明确判决：字面意义上的"让四层架构自发涌现"不可行。它悄悄地要求一个人（或者一个类似 optimizer 的自动化进程）去做决策，只是把这个决策过程用"涌现"这个词伪装成了被动现象。** 在动手做实验之前，必须先把这个词换掉，换成对应到具体机制的说法（比如"从 day 1 开始记录使用遥测，然后跑一次显式的聚类/启发式分析，由人或脚本主动去画层级边界"）。

### Key Findings — Pass 3：benchmark 可行性判断（convergence/feasibility-assessment 风格，轻量借用）

子 agent 没有走完整的 TRL/NASSS 打分流程（那套是给"某个具体技术方案该不该投入资源"用的重型评估，本次任务不需要），只借用了"给候选方案打可行性标签"这个基本思路，对着用户"要不要现在就造一个 paper-reading benchmark"这个问题，给出了三个候选的**可验证代理指标**（verifiable proxy），并逐一评估"现在就能建 vs 需要新基建"：

**候选 1 —— 事实召回准确率（fact-recall accuracy）。** 做法：把精读产出的内容，跟论文自己陈述的数字/结论做比对，检查有没有对得上。这跟 DARE 自己 spec#2 里验证过的"硬事实锚点"探针（eval-anchor probe，Krippendorff α=1.00，GO 信号）是同一个机制，只是把锚点从"research graph/result"换成了"论文"。可行度：**高**——只是抽取+比对，没有新基建，直接复用一个已经验证过的方案模式。

**候选 2 —— 注入错误检测（injected-error detection）。** 做法：故意在一篇论文的改写版/摘要版里埋 N 个错误（换个数字、反转一个结论、把方法归错人），然后看精读流程能不能把这些错揪出来、标记出来。这跟 ladder-foundry 已经建好、已经跑通的 loss-1（injection-fidelity）判断逻辑几乎是同一件事，只是要重新写一个"论文专用的错误注入生成器"。可行度：**高到中高**——裁判逻辑可以直接改造复用，唯一的新增工作是造一个能往论文里塞错的生成器。

**候选 3 —— 跟人写的解读文对比（比较基准法）。** 做法：找一批人类作者写的论文解读文章，把 AI 精读产出的东西跟它们做相似度/质量对比。子 agent 明确不推荐这一条：可行度**低到中低**——不是算法问题，是数据问题（需要一个精心筛选、跟你的目标论文集匹配的人类解读文语料库），而且这条路子本质上是在**从后门重新引入"像不像高质量文章"这种主观判断标准**——正是 DARE 自己在 spec#2 里明确列为禁用判据的那类"学术标准/novelty/rigor 式"评判，只是换了个"像不像人写的"的说法。子 agent 的判断是：这条路即使做成了，也违背了项目一路坚持的"用可验证代理指标绕开无 ground-truth 问题"这个基本原则。

**子 agent 给出的顺序建议：** benchmark 不应该放在"收集方法论 skill"实验之后，至少应该跟它并行，理想情况下应该先行。理由：候选 1 和候选 2 都是"已验证机制换个领域重放一次"，成本很低，可以先在一小批论文上跑一个迷你版 GO/NO-GO（跟 DARE 自己做 eval-anchor probe 时的路数一样），确认"这条评估路子在论文精读这个新领域里也真的能跑起来"，再决定要不要大批量投入去收集方法论 skill——否则收集阶段完全不知道该往日志里记什么信息，等做完了才想起来要评估，可能发现当时该留的数据没留，等于收集工作要重做一遍。

### Decisions Made（本次 checkpoint 记录的决策，供后续设计参考——非最终拍板，用户尚未正式确认）

1. **"自发涌现"这个说法本身被判定为不成立，需要重新命名/重新设计**。下一步如果要继续沿着"从使用模式反推架构"这条思路走，需要用户明确选择：要不要接受"这其实是人工归纳式重构，用遥测数据当启发信号"这个更诚实的版本？如果接受，下一步该讨论的是"记什么遥测、用什么启发式规则去画层级边界"，而不是"怎么让它自己发生"。
2. **benchmark 的建设顺序建议提前**，不放在"收集方法论 skill"之后，至少并行、理想是先行——用候选 1（事实召回）和候选 2（注入错误检测）先跑一个小样本迷你可行性探针。
3. **候选 3（跟人类解读文比较）被建议排除**，因为违背项目"只用可验证代理指标、不引入主观质量判据"的既定原则。
4. 以上三条均为**分析结论，不是已拍板的执行计划**——用户目前只是要求把分析记录下来，还没有对"是否采纳"表态，spec/plan 阶段仍未开始。

### Open Questions（留给下一轮讨论）

1. 如果放弃"自发涌现"，改成"人工/半脚本化归纳重构"，具体要记录哪些遥测字段（调用序列？共现矩阵？还是别的）？谁来做"观察→画边界"这一步——用户手动做，还是写一个类似 ladder-foundry optimizer-cc 的轻量脚本来做？
2. A1（内容和结构能否分离）目前仍是存疑未决的假设，还没有被验证或推翻——是否需要专门设计一个小实验来验证这条，还是先假定它成立、走下去发现问题再回头调整？
3. 候选 1/候选 2 的"迷你可行性探针"具体要跑几篇论文、怎么选样本（随机抽 / 覆盖不同学科 / 覆盖不同论文类型如实证研究 vs 理论论文 vs 综述）？跟 2.2 节里 InsightGUIDE 提到的"不同论文类型需要不同阅读模板"这个发现有没有关联——如果精读模板本身就该按论文类型分化，benchmark 的样本选取是不是也该按类型分层？
4. 用户提到的"skill-ops 迭代优化机制"和这次分析出来的"人工归纳式重构"是不是同一件事，还是两个独立的机制（一个管"内容/文风怎么迭代"，一个管"结构怎么划分"）？上一轮调研结论 4 已经提出"文风迭代该前置在生成阶段，不是后置裁判"，这次的 A2/Pass2 结论进一步说明"结构划分也不能是被动涌现，得有人主动做"——这两条是否该合并成一条更大的设计原则："凡是想要的架构性质，都得有一个明确执行的步骤去产生它，不能指望被动积累"？
5. 候选 1/2 复用的是 ladder-foundry 现成的判断逻辑（loss-1 机制、eval-anchor probe 模式），但 ladder-foundry 目前停在 STAGE 4（本地可验证阶段），STAGE 5 起需要真实 CC 嵌套 + cloud codex——本次 paper-reading 的迷你探针要不要依赖同一套三层 CC 基建，还是可以用更轻量的方式（比如直接用当前会话跑，不需要 sim/exec/optimizer 三层嵌套）先做通？

### 参考来源清单（本次分析实际引用/挑选的具体 skill，非全表复制）

- `deep-insight`（campaign 层，112 skills 表）——挑中 `assumption-audit`（strategy）
- `stress-test`（campaign 层，103 skills 表）——挑中 `red-teaming` campaign 下的 `key-assumptions-check`（sop，"Military ACT: systematically enumerate all assumptions, classify by type, and evaluate evidence strength supporting each"）
- `convergence`（campaign 层，120 skills 表）——挑中 `feasibility-assessment` campaign 的框架精神（轻量借用，未走完整 TRL/NASSS/Stage-Gate 流程）
- 未选用但读过表的三个 package：`hypothesis-formation`、`knowledge-structuring`、`creative-ideation`（各自 reach-for 场景与本次"审查既有方案"的任务性质不匹配，故未纳入 pipeline）

---

## Checkpoint: 现成论文精读产品的处理链路调研（alphaXiv 自身 + 同类产品横评）

### Objective

用户要求深入调研 alphaXiv（我们自己在用它的 MCP）以及市面上其他同类"论文解读 AI 产品"，具体查它们各自**怎么处理"读一篇论文"这件事**——用什么步骤、什么结构化方法、有没有质量校验环节。用户要求先用 tree 形式说明打算用 `/research-catalog` 里的哪套 skill 体系来做这次调研（不写完整 research spec），经用户确认后直接执行，结果同样 checkpoint 进本文件。本 checkpoint 记录完整过程：pipeline 选择理由、每个产品的处理链路细节、以及横向对照表和结论。

### Process Summary — Pipeline 选择

选用单一 campaign `knowledge-acquisition`，走以下路径（未走完整 research spec，用户明确说"不用 research specs，直接用 tree 形式"）：

```
knowledge-acquisition (campaign)
└── scoping-survey (strategy)   —— 广度优先、深读比例低，适合"扫一批同类产品"而非深读单篇论文
    ├── knowledge-acquisition-web-search   (sop)  —— 先扫一遍补全产品名单
    ├── knowledge-acquisition-web-research (sop)  —— 对入选产品做全页面精读
    ├── categorize-papers (sop，借用于"按产品分类")
    ├── taxonomy-mapping (sop)  —— 建跨产品特征对照表
    └── survey-synthesis (sop)  —— 收尾成文
```

选择理由：调研对象是"产品"不是"学术论文"，所以不用 `literature-survey` 那五个学术综述策略，而是借 `scoping-survey` 的"广度优先、扫一批同类东西"的方法论骨架，把"论文"换成"产品"去扫。没有走 `deep-survey`（因为不需要对某一个产品做 Keshav 三遍法式深读，只需要摸清处理链路）、没有走 `systematic-survey`（PRISMA 式穷尽筛选对调研几个知名产品来说是过度设计）。

实际执行时，因为对象是产品官网/博客/GitHub/论文而非纯学术文献库，工具组合上做了灵活调整：`knowledge-acquisition-web-search`/`knowledge-acquisition-web-research` 对应的是通用 `WebSearch`/`WebFetch` 工具（不是这两个 sop 严格要求的 alphaxiv MCP 全文抓取，因为大部分产品信息在官网/博客而非论文库），另外额外直接调用了 alphaxiv 自己的 MCP 工具（`answer_pdf_queries`、`read_files_from_github_repository`）去查证 alphaXiv 团队和 Elicit 团队各自发表的技术论文与开源代码——这是本次调研里信息密度最高的两个信息源，超出了单纯网页搜索能拿到的深度。

### Process Summary — 具体搜索/调研动作记录

1. **alphaXiv 自身产品调研**：
   - `WebSearch`："alphaxiv paper reading AI summarization features how it works"、"alphaxiv.org blog how we built OR methodology OR architecture"
   - `WebFetch` 抓取：alphasignalai substack 关于 alphaxiv skill 的文章、Medium 上一篇详细描述 alphaxiv 使用体验的文章（rehoyt.medium.com）、alphaXiv 官方 About 页面
   - `mcp__alphaxiv__read_files_from_github_repository`：直接读取 `github.com/alphaXiv/agents`（alphaXiv 官方开源的 TypeScript agent 框架）的完整仓库结构和源码文件列表
   - `mcp__alphaxiv__answer_pdf_queries`：未对 alphaXiv 团队本身查到专门发表的"论文精读产品"技术论文（他们的论文更多是 AI 模型训练类，如首页展示的"新模型 2.5x scaling efficiency"，这属于他们自己训练模型的产品线，不是精读工具的技术细节）
   - `WebFetch` 尝试抓取 alphaxiv MCP 官方文档页 `www.alphaxiv.org/docs/mcp`，成功拿到 `get_paper_content` 工具的文档描述

2. **同类产品横评调研**：
   - `WebSearch`："best AI tools to read and summarize academic papers 2026 comparison SciSpace Elicit Consensus NotebookLM Scholarcy" —— 拿到 10 篇 2026 年横评文章标题列表
   - `WebFetch` 抓取 `ponder.ing/blog/best-ai-tools-for-literature-review`（一篇横评文章，覆盖 Elicit/Consensus/SciSpace/NotebookLM 四家，未提及 Scholarcy）
   - `WebSearch` + `WebFetch` 分别深挖 Consensus（help.consensus.app 官方帮助页，被 403 拒绝，改用 WebSearch 摘要拼出信息）、Elicit（elicit.com 官方博客"How we evaluated Elicit Systematic Review"，成功抓取）、Scholarcy（scholarcy.com 官方博客"How does Scholarcy work its magic"，被 403 拒绝，改用 WebSearch 摘要）
   - `WebSearch`："Semantic Scholar TLDR generation model methodology how it works research paper" —— 定位到 TLDR 功能背后的原始学术论文
   - `mcp__alphaxiv__answer_pdf_queries` 直接读取该论文全文（arXiv 2004.15011，"TLDR: Extreme Summarization of Scientific Documents"，Allen Institute for AI）——这是本次调研里唯一一个"产品功能背后有公开发表的技术论文，且能被完整读到方法细节"的案例
   - `WebSearch` 追加查 Elicit 提取准确率的独立验证研究（Cambridge Core 上一篇 2026 年的可行性研究论文），`WebFetch` 成功抓取摘要级细节
   - `WebSearch` 追加查"alphaxiv 幻觉/事实核查/质量投诉"，未找到关于 alphaXiv 产品本身的直接讨论，但顺带定位到一篇**极其相关**的论文——`Factored Verification`（Elicit 团队自己发表，arXiv 2310.10627），用 `mcp__alphaxiv__answer_pdf_queries` 完整读取全文

3. **额外尝试但未获实质信息的路径**（记录以避免未来重复徒劳）：
   - `mcp__apify__apify__rag_web_browser` 调用失败（工具名不存在于本次会话的工具列表里，报错"No such tool available"）——本次会话没有配置这个 MCP 工具，改用标准 `WebFetch`/`WebSearch` 完成
   - 多次 `WebFetch` 遭遇 403（Scholarcy 官方博客、Consensus 官方帮助页两次）——这两家官网可能有反爬虫机制，最终改用 `WebSearch` 返回的摘要片段拼出可用信息，信息完整度低于能直接 WebFetch 的来源
   - alphaXiv 官方 About 页面查无实质技术信息，只有团队/招聘/投资方介绍，没有任何产品技术细节——确认 alphaXiv 没有像 Elicit 一样公开发表关于自己精读功能的技术论文或详细技术博客

### Key Findings — 逐产品处理链路详情

**1. alphaXiv（我们自己在用其 MCP 的产品）**

*产品层面（来自 Medium 文章 + alphasignalai substack + 官方文档拼出的图像）*：
- 论文导入三种方式：网页直接上传、Chrome 插件、把 URL 里的 "arxiv" 换成 "alphaxiv"；也支持非 arXiv 来源的 PDF
- 核心摘要功能叫"blog"（这个命名本身有意思——跟我们想做的公众号博客其实是同一个词），结构固定为：**summary / problem / method / results / takeaways / abstract** 六个字段，图表也会被摘要進來
- 有独立的"播客"输出选项（音频总结），文章描述"没什么可定制的"，细节不明
- 有"Assistant"交互功能：导入论文后可高亮文本提问，支持 `@` 命令拉入其他论文做跨论文对比讨论
- 有"My Notes"（个人笔记）、"Comments"（社区评论）、"Similar"（相关论文推荐）
- **文章明确没有回答**：blog/summary 功能到底是处理全文还是仅摘要；是否有任何准确性/幻觉的安全措施或说明

*工程层面（来自 `alphaXiv/agents` 开源仓库，MIT 协议，TypeScript）*：
- 这是一个通用 agent 框架，不是"论文精读专用"代码，但揭示了 alphaXiv 内部的基建风格：
  - 有专门的资源服务 `fetcher.alphaxiv.org`，可以把 PDF URL 直接喂给多模态模型（`content: "https://fetcher.alphaxiv.org/v2/pdf/2511.02824v1.pdf"`），说明 PDF 处理是"整篇喂给多模态模型"而不是先做文本抽取再喂
  - 用 Zod schema 强制模型输出符合结构（README 示例正好是"从原始文本抽取 title 和 abstract"——跟我们关心的"结构化提�煕"场景高度相关，但只是示例，不是真实生产 pipeline）
  - 支持多模型 fallback（OpenAI/Anthropic/Gemini/Vertex/OpenRouter 等），带重试策略（超时/限流自动切换模型）——这是可靠性工程，跟"读论文质量"本身无关，但说明他们的生产系统需要处理供应商不稳定的问题
  - 有内建的 tracing（多层 span：agent/model/tool/message），暗示真实生产 pipeline 应该是多步骤 agent 链式调用，但仓库里没有那条真实链路的代码（README 明说"你需要看 src/、examples/ 或另一个应用仓库才能确认真实架构"——也就是说这个开源仓库只是基础设施层，业务逻辑层没有开源）
- **结论：alphaXiv 没有公开发表任何关于自己"论文精读"功能内部工作原理的技术论文或详细工程博客**。跟 Elicit（下面会看到，Elicit 团队专门发过至少两篇关于自己产品准确率/幻觉率的论文）形成鲜明对比。这对我们有一个直接启示：**alphaXiv 作为我们每天在用的工具，它自己的质量保证方式对外部是不透明的**——我们不知道它的 blog/summary 功能有没有做类似 Elicit 那种"抽取claim→逐句核对源文→修订"的幻觉检测，MCP 文档里唯一提到的是"如果没有 report 会自动 fallback 到全文"这个降级机制，除此之外没有任何质量说明。

**2. Elicit —— 目前调研到的、质量工程做得最透明的产品**

- 产品定位：不是"读一篇论文"，而是"跨大量论文做结构化字段提取"——用户自定义提取字段（样本量、方法学、关键发现、效应量等），产出**表格视图**，不是叙事性摘要。官方博客明确说"不构建论点、不解决冲突性发现"，纯粹定位在筛选和提取，不做深度单篇解读。
- **准确率验证方法（这是本次调研信息量最大的部分）**：
  - 内部评测：128 道人工核实过的提取题（跨一批论文），让另一个 LLM 同时看着"标准答案+论文全文"去判断 Elicit 的抽取是否吻合，得到 94% 准确率；这个"LLM 当裁判"的评测法本身又被验证过——跟人工核验有 89% 的一致度
  - 外部独立验证：德国咨询公司 VDI/VDE 做过一次从 50 篇扩展到 550 篇论文的教育干预类综述，人工核对后给出 99.4% 准确率；CSIRO 一位研究员对比了 Elicit vs 单次调用 GPT-4-Turbo vs 多次调用 GPT-4-Turbo vs 人工基线，在渔业管理类综述上，Elicit 的假阴性率"可忽略"，甚至有一例人工提取员漏看了论文里提到的国家、被 Elicit 正确识别出来的案例
  - **一个更细致的独立可行性研究（剑桥 Cambridge Core 期刊）揭示了更复杂的真相**：这篇论文做了"重复抽取一致性测试"（RETEST：换一个 Elicit 账号、同样的提示词和源文件，重新跑一遍）——536 个抽取值里 476 个（约 90%）完全一致，**但**支撑这些答案的"引用原文片段"只有 46% 一致、"推理叙述"只有 30% 一致。也就是说：**最终答案的一致性掩盖了背后推理过程的不稳定性**——两次跑出同一个答案，但"为什么是这个答案"的解释经常是不同的。更值得警惕的是：切换到 Elicit 的"高精度模式"后，数值一致性反而从 90% 掉到 77%，引用片段一致性暴跌到 10%，推理叙述一致性直接掉到 **0%**。该研究还发现 Elicit 会"幻觉"出并不存在于源文本中的利益冲突声明、把"提到了伦理审批"过度解读成"证明有注册协议"、完全无法获取 DOI、且低阶付费方案完全看不到图表和补充材料里的信息。论文结论：**"数值层面的一致性会让工具看起来比实际更可靠"**，最终建议 Elicit 应该被当作人工提取的辅助校验工具，而不是替代品。
- **对我们的启示**：这是全场调研里唯一一家把"我们的产品到底准不准"这件事做成公开研究、并且允许第三方独立复现检验的公司。这个态度本身值得我们学习——不是说 Elicit 的产品没问题（上面那篇独立研究恰恰揪出了不少真实问题），而是"愿意把准确率量化、发表、接受第三方检验"这件事本身，是我们做 benchmark 时应该效仿的姿态，而不是像 alphaXiv 那样对外只字不提。

**3. Elicit 团队发表的 Factored Verification 论文（arXiv 2310.10627）—— 本次调研的最大收获**

这篇论文和我们上一轮 checkpoint 里提出的"候选 2：注入错误检测"几乎是同一个思路的**已发表、已验证的成熟实现**，细节如下：

- **核心方法**：把一段摘要拆解成一条条独立的"claim"（说法/主张），对每条 claim 单独用 LLM 判断"这条说法有没有被源文本支撑"，给出一个支撑概率；把所有 claim 的概率乘起来，得到整篇摘要的"正确性总概率"，超过某个阈值就判定为"存在幻觉"。这个拆解-核对-合并的三步法叫 **Factored Verification**。
- **验证过的效果**：在 HaluEval 幻觉检测基准上做到 76.2% 准确率，是当时的 SOTA，比之前最好的 chain-of-thought 方法高出 10 个百分点。
- **应用到真实场景的发现（这是最扎心的数据）**：让 ChatGPT / GPT-4 / Claude 2 / Claude Instant 去总结论文摘要（8篇摘要回答一个问题），**平均每篇总结含有 0.62～1.57 个幻觉**——即便是当时最强的模型，摘要论文这件事本身的幻觉率也高到"不能直接信"的程度。作者人工抽查后估计，真实幻觉率大约是自动检测报告出来的 2/3（因为检测方法本身准确率只有76%，会有假阳性）。
- **幻觉的具体形态（列出的例子对我们的公众号写作场景极有参考价值）**：说一个结论被两篇摘要支撑、但其实只有一篇真的支撑；轻微夸大论文的发现；把研究目的和研究结果混为一谈；暗示两个独立发现之间有关联但源文没这么说。**这些幻觉形态几乎都是"读起来完全正常、不细查根本看不出来"的那种微妙错误，不是那种一眼假的胡编乱造**——这条对我们做公众号内容尤其危险，因为公众号读者不会去查论文原文核对，恰恰是这类"看起来很像真的"的幻觉最容易被大规模传播出去。
- **自我修正的效果**：让模型自己看着"哪些claim被判定为不支撑"的反馈去修订摘要，可以把幻觸数从最高 1.55/篇降到 0.95/篇（Claude 2）——但即便修订后，幻觉仍然没有清零，作者原话："即便用了 factored critique 修订，仍然剩下 0.46 到 1.24 个幻觉每篇"。
- **这篇论文本身用的模型是 2023 年的（GPT-4/ChatGPT/Claude 2），已经是两年多前的技术水位**，我们如果要复现或借鉴这个方法，应该预期今天更强的模型幻觉率会更低，但"拆解claim→逐句核对源文"这个方法论骨架本身依然是当前最可靠的自动化事实核查手段之一（论文里提到 Dhuliawala et al. 2023 的 Chain-of-Verification 是同期独立发现的几乎同样的方法，说明这不是孤例，是当时业界收敛出的共识方案）。

**4. Consensus —— 定位在"跨论文证据聚合回答问题"，不是"精读单篇论文"**

- 产品逻辑：先从 2.2 亿篇同行评审论文里检索最相关的，再用 AI 生成"有引用支撑的综合性回答"，每条陈述都能追溯回具体论文，被称为"grounding layer"
- 帮助文档明确对比自己和通用 LLM 的区别："先真实检索论文，再基于检索结果生成回答"（inverse architecture，检索优先于生成），这跟 alphaXiv 的"整篇喂给多模态模型直接生成"是完全不同的架构哲学——**先搜索验证过的真实文献、再合成，比"直接让模型生成再附上引用"更能防止捏造引用**
- 官方帮助页面被 403 拒绝完整抓取，细节仅能从 WebSearch 摘要拼出，"levels of evidence"（证据等级）机制的具体细节没有查到

**5. SciSpace —— 定位在"与单篇论文实时对话"，不是"生成结构化报告"**

- 核心交互：高亮论文段落、要求用通俗语言解释、请求解读密集的方法学章节或图表数据、可在阅读界面内直接翻译成其他语言
- 差异化定位："这是对一篇文档的实时质询，更像文档内置了一个家教，而不是提前生成一份摘要"
- 没有查到关于 SciSpace 内部准确率验证的独立研究（不同于 Elicit）

**6. NotebookLM —— 定位在"只对用户上传的材料负责"**

- 只处理用户自己上传的文档，不会去外部网络验证或搜索；所有引用精确指向"上传文档内的具体片段"
- 有音频总结（podcast风格）生成功能——跟 alphaXiv 的播客功能是同类思路
- 核心局限：对任何没被上传的论文完全无感知，不能独立发现或核对外部文献

**7. Scholarcy —— 定位在"把论文转成结构化 Flashcard"**

- 官方博客自称方法是"以抽取式技术为主，辅以少量摘要式（abstractive）总结，确保所有摘要句子事实正确并可追溯回原文"——这个说法本身没有被独立第三方验证过（不同于 Elicit），是厂商自己的单方面陈述
- 产出形式是"Summary Flashcard"，包含关键发现、方法、图表、参考文献
- 会自动生成"背景阅读清单"，把论文引用的文献变成可点击列表

**8. Semantic Scholar TLDR —— 唯一一个有完整、可公开读到细节的学术论文支撑的功能**

来自 Allen Institute for AI 团队发表的论文（arXiv 2004.15011，"TLDR: Extreme Summarization of Scientific Documents"）：
- **任务定义**：TLDR 是比摘要更极端的压缩——单句总结，聚焦论文的核心贡献，不涉及背景或方法学细节
- **训练数据来源（SciTLDR 数据集）**：混合了两种标注来源——(a) OpenReview 上作者自己写的 TLDR（"TLDR-Auth"）(b) 训练本科生把同行评审意见改写成 TLDR（"TLDR-PR"，利用"审稿人通常会在评论开头做一段真实、忠实的论文总结"这个事实，去侧面获得高质量标注而不需要标注者读全文）——**这个"用审稿意见的开头段落间接获取忠实摘要"的标注技巧本身是个巧妙设计，值得我们参考**
- **模型方法（CATTS）**：用论文标题作为"辅助训练信号"——因为标题本身就包含了论文最核心的信息，训练模型同时学习"生成标题"和"生成TLDR"这两个任务，可以在标注数据稀缺的情况下提升模型定位关键信息的能力
- **输入范围的实验发现**：论文专门对比了"只用摘要"vs"用摘要+introduction+conclusion（AIC）"vs"全文"三种输入范围，结论是——AIC 范围（摘要+引言+结论）已经能拿到接近全文输入 97.9% 的效果（Rouge-1差距仅2.1分），但输入量只有全文的约1/5，**这对我们的精读pipeline设计有直接参考价值：不是所有产出都需要读全文，摘要+引言+结论这个"三段式輸入"性价比极高**
- **准确率评估方法（比一般产品评测严谨得多，因为这是学术论文而非产品营销）**：除了自动化 Rouge 指标，还专门找了论文原作者本人来打分"生成的TLDR是否正确"（1-3分：错误/部分正确/基本正确），最终平均分在2.5分左右（介于"部分正确"和"基本正确"之间）——**这提示即便是这个领域最早、最成熟的自动化摘要功能之一，请原作者本人核验的结果也不是接近满分的"完全正确"，而是"大体过得去但不完美"**

### Key Findings — 横向对照表

| 产品 | 处理对象 | 核心机制 | 结构化产出 | 公开的准确率验证 | 幻觉/事实核查机制 |
|---|---|---|---|---|---|
| alphaXiv | 单篇/多篇 | 整篇PDF直接喂多模态模型 | summary/problem/method/results/takeaways/abstract 六段式 | **无**（官方未公开发表任何准确率研究） | **无公开说明**，仅有"report生成失败自动fallback全文"的降级机制 |
| Elicit | 跨多篇 | 检索+自定义字段抽取 | 表格（非叙事） | **有，且允许第三方独立复现检验**（内部94%、外部99.4%、独立研究90%值一致但46%/30%推理不一致） | 团队自己发表 Factored Verification 论文，专门量化幻觉率并提出修订方法 |
| Consensus | 跨多篇 | 先检索真实文献再生成回答 | 引用支撑的综合回答 | 官网自称"每条陈述可追溯"，未查到独立第三方验证研究 | 检索优先于生成的架构本身是一种防幻觉设计 |
| SciSpace | 单篇 | 对话式实时质询 | 无固定结构，按需问答 | 未查到 | 未查到 |
| NotebookLM | 用户自建文档库 | 仅对上传材料负责 | 引用指向具体源片段 | 未查到 | 靠"只对已上传材料负责"这个范围限制本身来降低幻觉风险 |
| Scholarcy | 单篇 | 抽取式为主+少量摘要式 | Summary Flashcard | 厂商自称，未见独立验证 | 厂商自称"确保事实正确可追溯"，未见验证方法细节 |
| Semantic Scholar TLDR | 单篇 | 摘要+引言+结论(AIC)输入，标题作辅助训练信号 | 单句极限摘要 | **有，学术论文级严谨度**（原作者本人打分平均2.5/3） | 无专门幻觉检测机制，但训练数据本身来自审稿人"忠实摘要"的间接筛选 |

### Decisions Made（本轮结论，供后续 pkg 设计参考——仍非拍板）

1. **alphaXiv 作为我们每天在用的工具，其精读质量保证机制对我们是不透明的**——它没有公开发表任何技术细节，我们不应该假设它的输出天然可靠，用它的 `get_paper_content`/`answer_pdf_queries` 结果作为我们精读流程的输入时，仍然需要自己的事实核查层，不能把 alphaXiv 的输出当成已核验的地基。
2. **Factored Verification（拆claim→逐句核对源文→修订）应该被采纳为我们"注入错误检测/事实核查"环节的具体实现方法**，不需要重新发明，这是已经发表、已经被同行认可、有开源可参考实现思路的成熟技术——把上一轮 checkpoint 里的"候选2"从"抽象想法"升级为"有具体算法可抄"。
3. **AIC 输入范围（摘要+引言+结论）这个折中方案值得纳入我们的精读 skill 设计**——不是每次都要求全文深读（Keshav三遍法的第三遍），可以按论文类型/精读深度需求分层，用更便宜的AIC范围先过一遍，性价比数据有公开论文支撑（97.9%效果，1/5输入量）。
4. **"愿不愿意公开验证自己的准确率"这件事本身是一个值得对标的产品成熟度信号**——Elicit的姿态（公开发表、允许第三方复现检验、甚至暴露自己的弱点）比alphaXiv、Scholarcy等自说自话的姿态更值得我们的产品学习，即便我们自己的benchmark做出来后，也应该考虑走"公开、可复现"这条路，而不是关起门来自己说"我们测过是好的"。
5. **没有任何一家现成产品做到"单篇论文精读→结构化+事实核查→公众号成稿"这个完整链路**——alphaXiv最接近（有六段式blog结构），但没有事实核查环节；Elicit有最强的事实核查方法论，但产品定位在跨论文表格提取，不做单篇叙事性解读；Scholarcy的Flashcard结构化程度高但没有独立验证；没有一家做"文风/受众定制"（回顾第一轮checkpoint里 Paper2Blog 是唯一做双语文风定制的，但那不是本轮调研对象，是学术论文里的系统不是商业产品）。这进一步confirms第一轮checkpoint的结论：**空白确实存在，且比我们最初以为的更具体——空白不仅在"公众号文风"，也在"把精读质量的事实核查做透明、做到位"这件事本身**。

### Open Questions（留给下一轮）

1. Elicit 的 Factored Verification 方法论文用的是2023年的模型（GPT-4/Claude 2），今天用当前一代模型重新跑一遍这个"拆claim核对源文"流程，幻觉率具体能降到多少？要不要专门做一次小规模复现实验，作为我们自己 benchmark 候选2的起点？
2. alphaXiv 的"blog"六段式结构（summary/problem/method/results/takeaways/abstract）跟第一轮 checkpoint 里 Paper2Blog 的"证据地图"九段式（Problem/Motivation/Contribution/Method/Dataset/Key Result/Ablation/Headline Numbers/Takeaway）有相当程度的重叠——我们的精读 skill 输出结构，应该在这两者之间怎么取舍/融合？
3. Consensus的"先检索真实文献再生成"架构哲学，对我们的"单篇指定论文精读"场景是否适用？我们的场景通常论文已经指定，不需要检索环节，但"先定位到论文里的具体位置再生成claim，而不是读完整篇再自由发挥"这个防幻觉思路是否可以类比过来，变成"先定位到论文的具体段落/图表再写公众号段落，而不是读完全文再自由总结"？
4. Semantic Scholar TLDR 用"审稿人评论开头段落"来间接获取忠实摘要标注的技巧，对我们如果未来需要构建"高质量论文解读"训练/评测数据集时，有没有类似的、可以低成本获取"忠实且专业的论文解读"标注的间接来源（比如：论文作者自己在推特/知乎上的通俗介绍？期刊编辑写的推荐语？）——这条属于未来构建benchmark参考数据时可以借鉴的标注技巧，暂不深入。
5. 本次调研因为 403 和工具不可用，Scholarcy、Consensus 两家的细节完整度低于 Elicit、alphaXiv、Semantic Scholar 三家——如果后续需要更细节的产品对标，可能需要专门用其他渠道（比如查它们的专利、招聘JD里的技术栈描述、或第三方评测视频）来补全。

### 参考来源清单（本轮实际引用的具体链接/论文）

- alphaXiv 相关：`alphasignalai.substack.com` 关于 alphaxiv skill 的文章；`rehoyt.medium.com` 详细体验文章；`www.alphaxiv.org/docs/mcp` 官方MCP文档；`www.alphaxiv.org/about` 官方About页；`github.com/alphaXiv/agents`（MIT协议开源仓库，直接读取完整文件树+关键源码）
- Elicit 相关：`elicit.com/blog/how-we-evaluated-elicit-systematic-review` 官方评测博客；剑桥Cambridge Core期刊上的独立可行性研究（RETEST方法论文）；`arXiv:2310.10627`（Factored Verification论文，完整读取全文）
- Consensus 相关：`consensus.app/home/resources/how-consensus-works/`（WebSearch摘要，WebFetch被403拒绝）；`help.consensus.app`（同样被403）
- SciSpace/NotebookLM/Scholarcy 相关：`ponder.ing/blog/best-ai-tools-for-literature-review` 横评文章；Scholarcy官方博客（WebFetch被403，仅WebSearch摘要）
- Semantic Scholar TLDR 相关：`arXiv:2004.15011`（TLDR: Extreme Summarization of Scientific Documents，完整读取全文，Allen Institute for AI）
