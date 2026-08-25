# Conversation

## Pthahnix-01

````bash
很好, 我先请你帮我个别的忙, 
https://github.com/yogsoth-ai/de-anthropocentric-research-engine/tree/main 我的这个 repo, 我希望提高一点我的知名度, 我在想我用这个去测一些在 research 工作的 benchmark 上, 可以吗? 比如 HLE 什么的.
````

## GPT-01

````bash
对，我刚才确实理解偏了。你指出得对。

我重新看了 repo 后，更准确的定义应该是：

> **DARE 是 scientific research / scientific discovery 的方法论与 orchestration skill system。**

而不是一个 search agent。你的 README 本身写得非常明确：它的目标是从 research direction 开始，经过 literature、gap discovery、hypothesis formation、ideation、stress testing、convergence、experiment design/execution 等完整科研过程；检索只是其中 `knowledge-acquisition` 的一个环节。([GitHub][1])

甚至你列出来的 Campaign 就已经说明了这一点：

`north-star-crystallization → knowledge-acquisition → deep-insight → hypothesis-formation → creative-ideation → convergence → stress-test → experiment-execution → knowledge-structuring`

而且它们不是固定 pipeline，而是允许根据 research state 回退、重组和重新进入前面的科研阶段。([GitHub][1])

所以我上一条把 **DeepResearch Bench / BrowseComp** 放到最前面，是错误的 benchmark framing。

### 那 HLE 呢？

**HLE 可以测，但依然只能算 auxiliary benchmark。**

因为 HLE 更接近：

> 给定一道非常困难的科学/专业问题，模型能不能得到正确答案？

而 DARE 真正要证明的是：

> 给定一个研究方向或未解决的问题，agent 能不能像科研人员一样形成假设、设计研究、攻击假设、根据结果调整方向，最终产生新的研究结论？

这两者差别很大。

所以如果你跑 HLE，最有意义的问题不是：

> DARE 的 HLE accuracy 是多少？

而是：

> **同一个 foundation model，加上 DARE 的 scientific reasoning methodology 后，解决专家级问题的能力是否提高？**

也就是一个 methodology/scaffolding ablation。

---

## 重新排序以后，我会首先看这些 benchmark

**第一梯队其实是 AstaBench。**

这个我刚才没提到，但它反而非常贴你。AstaBench 是 2025 年提出的一整套 **scientific research agent benchmark suite**，有 2400+ problems，作者明确说它覆盖整个 scientific discovery process，而不是单独测试搜索或 coding。([arXiv][2])

这个和 DARE 的定位基本是同一个问题空间：

> Can an AI agent perform scientific research?

所以我现在会认真研究它是否可以直接接 DARE。

---

第二个我非常感兴趣的是 **petri-bench**。

它不是测试知道多少知识，而是直接测：

* hypothesis isolation
* controlled experimentation
* inferential statistics
* calibrated claims

而且是在事先不存在于训练语料里的 procedurally generated “mystery worlds” 里做 causal discovery。([Petri Labs][3])

这其实特别符合你的 philosophy，因为它逼 agent **真的使用 scientific method**。

如果：

```text
Claude Code
vs
Claude Code + DARE
```

在同样的模型、同样的 experiment budget 下，DARE 明显提高：

```text
hypothesis quality
controlled experiment rigor
correct causal identification
efficiency
```

这比 BrowseComp 对你的意义大太多了。

---

还有 **Science-Gym**。

它要求 agent 自己：

> data collection → experimental design → equation discovery

并且是在 simulation 里真正交互式实验。([Springer][4])

它会非常直接地测试 DARE 里的：

```text
hypothesis
↓
experiment design
↓
observation
↓
hypothesis revision
↓
new experiment
```

尤其可以测你最强调的 **backtracking**。

---

然后才是我们之前说的几个：

**ScienceAgentBench** 很相关，但它实际上把科研任务统一成生成 self-contained Python program，所以很大程度同时在测 coding/data-analysis agent。它有 102 个来自 44 篇 peer-reviewed publications 的任务，跨四个领域。([GitHub][5])

**PaperBench** 也很相关，但它测试的是 **research replication**：理解论文、重写 codebase、执行实验、复现结果。20 篇 ICML 论文、8,316 个评分项。([OpenAI][6])

所以 PaperBench 更像：

> Can DARE behave like an autonomous research replicator?

而不是：

> Can DARE discover science?

---

还有两个我觉得非常适合你某些 package 单独做 ablation。

一个是刚出的 **SoundnessBench**，专门测 AI scientist 能不能识别 research proposal 的 methodological soundness。它有 1,099 个 ML research proposals，而且当前模型存在明显 optimism bias。([arXiv][7])

这个正好可以测你的：

```text
stress-test
assumption destruction
competing hypotheses
falsifiability audit
winner stress testing
```

另一个是 **MLRC-Bench**。它故意选真正需要 **novel methodology** 的 ML research competitions，而不是单纯工程问题；最好的被测 agent 当时也只缩小了 baseline 到顶尖人类方案差距的 9.3%。([arXiv][8])

这会非常适合检验：

> DARE 的 creative ideation + hypothesis formation 到底是不是“看起来创新”，还是能产生**实际上更好的研究方法**。

这个 benchmark 对你的 claim 很有杀伤力。

---

所以我现在对你这个项目的 benchmark map 会是：

| DARE 能力                             | 对应 benchmark                     |
| ----------------------------------- | -------------------------------- |
| 整体 scientific research              | **AstaBench**                    |
| Scientific method                   | **petri-bench**                  |
| Hypothesis → experiment → discovery | **Science-Gym / DiscoveryWorld** |
| Research ideation / novel methods   | **MLRC-Bench**                   |
| Methodological stress testing       | **SoundnessBench**               |
| Data-driven science                 | **ScienceAgentBench**            |
| Paper replication                   | **PaperBench**                   |
| Research engineering                | **RE-Bench**                     |
| Expert reasoning                    | HLE                              |
| Literature search                   | DeepResearchBench / BrowseComp   |

所以 **HLE 可以跑，但我不会再建议你拿它当主要 scientific-research benchmark。**

真正让我现在觉得有意思的实验反而是：

> **Same model, same tools, same compute. DARE vs no DARE across the scientific method.**

如果这个结果跑出来，例如：

```text
                         Base agent    + DARE
Hypothesis quality          41.2        58.7
Experiment rigor            37.5        62.1
Soundness detection         54.0        71.3
Novel-method performance    18.4        26.9
```

那你真正可以 claim 的就不是：

> “我们的 skill 帮模型搜索得更好。”

而是：

> **Structured scientific methodology improves the research capability of frontier agents.**

这个才是你这个 repo 真正值得打的 story。

而且我觉得这里可能还有一个比“找一个 benchmark 跑”更好的方向：**把 DARE 的每个 Campaign 映射到已有 scientific-agent benchmark，形成一套完整的 DARE evaluation matrix。** 这样甚至可以变成一篇比较像样的 empirical paper，而不仅仅是在 README 放个 badge。

[1]: https://github.com/yogsoth-ai/de-anthropocentric-research-engine/tree/main "GitHub - yogsoth-ai/de-anthropocentric-research-engine: 900+ pure-markdown skills for autonomous AI research, organized as 9 freely-composable packages over a 4-layer hierarchy (Campaign → Strategy → Tactic → SOP). Non-linear orchestration with backtracking, 6 MCP integrations. The AI is the researcher — you set the direction. · GitHub"
[2]: https://arxiv.org/abs/2510.21652?utm_source=chatgpt.com "AstaBench: Rigorous Benchmarking of AI Agents with a Scientific Research Suite"
[3]: https://www.petri-labs.org/bench/report?utm_source=chatgpt.com "petri-bench: Scoring the Scientific Method of LLM Agents on Procedurally Generated Causal-Discovery Tasks"
[4]: https://link.springer.com/article/10.1007/s10994-025-06914-x?utm_source=chatgpt.com "Science-Gym: a simple testbed for AI-driven scientific discovery | Machine Learning | Springer Nature Link"
[5]: https://github.com/OSU-NLP-Group/ScienceAgentBench?utm_source=chatgpt.com "GitHub - OSU-NLP-Group/ScienceAgentBench: [ICLR'25] ScienceAgentBench: Toward Rigorous Assessment of Language Agents for Data-Driven Scientific Discovery · GitHub"
[6]: https://openai.com/index/paperbench/?utm_source=chatgpt.com "PaperBench: Evaluating AI’s Ability to Replicate AI Research | OpenAI"
[7]: https://arxiv.org/abs/2605.30329?utm_source=chatgpt.com "SoundnessBench: Can Your AI Scientist Really Tell Good Research Ideas from Bad Ones?"
[8]: https://arxiv.org/abs/2504.09702?utm_source=chatgpt.com "MLRC-Bench: Can Language Agents Solve Machine Learning Research Challenges?"
````

## Pthahnix-02

````bash
OK. 我接下来会先问你一个别的东西. 我接下来准备给我的 dare 重构一下. 目前的情况就是, 它太复杂冗余了, 我不确定冗余问题是不是成立, 但真的很脏乱差. 我本来的考虑是进行海量的 dare research pipeline 来研究 AI 在使用 dare 的时候会有什么 的倾向, 但这样需要耗费的 token 确实太大量了, 我感觉负担不起. 所以我目前的想法就是, 先自己来试试看如何优化这个 repo. 而且目前这里所有的 skill, 四层结构, 都是来自人类的 研究经验组装出来的, 我在自己使用 dare 的时候发现, 比方说我可以对于一个 topic, 让 AI 先 lit survey 来 100+ paper 的信息量, 将他们分解成 atom 级别的东西, 然后进行进一步的匹配底层逻辑之类的事情, 来得到人类可能花一辈子都挖掘不出的东西., 我目前的想法就是进一步深度上压缩我的 skill 体系, 本来的四层直接消掉一到两层的上层结构, 本来是 campagion strategy tactic sop 这样的四层, 我们将其大幅压缩为 tactic sop 这样的层级, 将不常用的直接合并消融, 有些正常组合使用非常固定的直接钉到 sop, 然后将原本复杂的 campaign strategy 这种本来非常详细的大型 research workflow 的编排逻辑变成 tactic. 然后我们将这种我说的, 人类不可能完成的 research workflow 包装成新的 strategy 层级. 你有什么想法, 看到这个.
我想要的是, 你会怎么想这个问题, 你觉得想做成这件事, 到底需不需要我真的海量的 dare research 比如 100 次这样的 research工作然后完整分析 AI 对这些 skill 的使用的偏好, 基于这样的数据驱动的方式来更新我的 dare. 还是说你可以直接通过我里面类似那些 HTML 一样的图谱加上你亲自帮我阅读分析, 可以给出下一步的迭代方案.
````

## GPT-02

````bash
我现在看这个问题，结论其实比较明确：

**你不需要先跑 100 次完整 DARE research，才有资格重构 DARE。**

甚至我认为，**现在先做 100 次完整 research 可能是错误的顺序**。它会非常贵，而且你最后得到的大量行为数据会被“当前这版本来就很冗余的架构”污染。你会花很多 token 去观察一个你已经知道需要重构的系统如何在自己的复杂性里导航。

我更建议：

> **先把 DARE 从“人类科研方法的分类树”编译成“AI 科研认知的 primitive system”，然后再用少量行为实验验证。**

而且你刚才描述的新架构方向，我认为是非常有潜力的。

---

## 1. 我觉得你真正发现的问题，比“900 个 skill 太多”更深

你现在的架构是：

```text
Campaign
   ↓
Strategy
   ↓
Tactic
   ↓
SOP
```

而 README 自己也明确说，这套层级来自一个 **military command hierarchy**：

* Campaign = WHAT
* Strategy = WHEN / WHY
* Tactic = HOW to combine
* SOP = HOW to execute

并且现在是 900+ skills、2476 条显式 skill→skill dependency edges。([GitHub][1])

这里有一个很有意思的矛盾：

> DARE 的 philosophy 是 **de-anthropocentric**，
>
> 但 DARE 的内部认知架构其实仍然非常 **anthropocentric**。

因为：

**Campaign → Strategy → Tactic → SOP 本质上是人类组织复杂行为的办法。**

军队这么分，是因为：

* 人类工作记忆有限；
* 不同层级由不同人负责；
* 需要 delegation；
* 需要组织责任边界；
* 人不能瞬间读几百个方法然后动态组合。

但 AI 不一定需要这些组织边界。

对于 LLM 来说，每增加一个层级，实际上都会带来：

```text
read
→ interpret
→ choose child
→ read child
→ interpret
→ choose child
→ ...
```

也就是：

**token cost + routing entropy + instruction drift + failure opportunity。**

所以我现在甚至不愿意把你的目标叫：

> skill pruning

我更愿意叫：

> **compile DARE.**

把 **human research knowledge** 编译成 **AI-native research cognition**。

---

# 2. 所以你提出的 Strategy → Tactic → SOP 新结构，我基本赞同

但我会稍微精确定义一下。

### SOP：真正的 cognitive primitive

必须非常小。

例如：

```text
extract-claim
normalize-variable
identify-assumption
construct-counterexample
map-causal-edge
score-falsifiability
retrieve-evidence
compare-mechanisms
```

判断标准不是“文件有多少行”。

而是：

> **这个 operation 能不能拥有稳定明确的 input → transformation → output？**

SOP 不应该管理全局 research state。

不应该决定“下一步科研方向是什么”。

---

### Tactic：可重复使用的 local research algorithm

它可以：

```text
SOP A
→ SOP B
→ SOP C
→ evaluate
→ loop if necessary
```

比如：

```text
assumption stress test

surface assumptions
→ classify vulnerability
→ validate causal logic
→ identify load-bearing failures
```

事实上我刚刚已经看了你实际 repo 里的一个例子。

现在的 `assumption-stress-test` 已经非常像我说的新 Tactic：

它调用：

* assumption surfacing
* ABP vulnerability classification
* CLR validation
* paper research

然后有明确 minimum yield。([GitHub][2])

但它上面目前还有一个 `assumption-audit`。

而我看到的 `assumption-audit` 又包含：

* assumption-stress-test
* assumption surfacing
* ABP classification
* CLR validation
* paper research
* budget
* state ledger
* hard gate

实际上它与下面那个 Tactic 的功能边界已经很接近了。([GitHub][3])

这就是一个非常典型的：

> **“上层为了满足架构而存在”，而不是因为认知上真的需要一个新的 abstraction。**

当然这个文件抓取时间比另一个旧一点，我不会仅凭这一对文件断定应该删谁。

但它已经足够说明你的直觉不是空穴来风：

**确实存在 structural redundancy 的强烈信号。**

---

# 3. Campaign 我甚至不会再让它成为 executable skill

这一点可能是我和你思路里最重要的一个补充。

比如：

```text
knowledge-acquisition
deep-insight
hypothesis-formation
creative-ideation
stress-test
convergence
experiment-execution
```

这些东西非常有价值。

但它们未必要是 **execution hierarchy**。

它们可以退化成：

> **capability tags / namespaces / research-state labels**

比如一个 tactic：

```yaml
name: assumption-stress-test
kind: tactic

capabilities:
  - deep-insight
  - stress-test

inputs:
  - hypothesis-set
  - evidence-base

outputs:
  - vulnerability-map
```

这样：

`deep-insight`

不再是一个必须：

```text
enter campaign
→ pick strategy
→ pick tactic
```

的执行节点。

它只是在告诉 orchestrator：

> 目前处于什么认知空间。

这能直接少掉一层 routing。

---

# 4. 原来的 Strategy，我也同意大量往 Tactic 压

你现在定义的 Strategy 是：

> iteration engine + state ledger + budget + stopping condition。([GitHub][1])

这里其实混合了两个完全不同的东西：

**科学方法本身**

和

**agent runtime/control logic**。

例如：

```text
budget
hard gate
checkpoint
iteration count
stopping rule
context recovery
```

这些东西很多不应该在每个 research skill 里面重复。

应该被抽成统一的：

```text
Research Control Protocol
```

比如一个共享 runtime policy：

```text
budget management
evidence accounting
stopping
backtracking
checkpointing
cost accounting
failure escalation
```

然后 Tactic 只描述：

> **怎么思考这个 scientific problem。**

这会让 skill 本身瘦非常多。

你 README 现在甚至已经承认当前 context checkpoint 方法比较 naive，并把 context engineering 放到了 roadmap。([GitHub][1])

所以我觉得：

**不要只是把 Campaign/Strategy 文件合并。**

同时应该把里面重复出现的：

```text
Budget
State Ledger
Hard Gate
Checkpoint
Completion Criteria
```

往一个统一 control plane 抽。

否则只是：

> 四层的冗余 → 两层的大文件冗余。

---

# 5. 然后才是你说的最有意思的东西：重新创造 Strategy

这里我非常赞同你的方向。

新的 **Strategy** 不再对应：

> 人类科研人员总结出来的一种“研究方法”。

而应该对应：

> **因为 AI 的吞吐量、工作记忆、并行能力、搜索能力、组合空间规模，而第一次变得可行的 scientific research program。**

这其实才真正配得上 `de-anthropocentric`。

你刚才举的例子就是一个完美 Strategy：

### Massive Literature Atomization → Latent Mechanism Mining

不是：

> “做一个 literature review。”

而是：

```text
100–500 papers
        ↓
decompose every paper into atoms

claim
mechanism
assumption
variable
method
boundary condition
failure
result
anomaly
causal relation
        ↓
normalize ontology
        ↓
construct massive cross-paper graph
        ↓
search combinations humans would never inspect
        ↓
find hidden isomorphisms / contradictions / missing edges
        ↓
generate latent mechanisms
        ↓
stress-test
```

这已经不是传统意义上的 systematic review。

**这是 AI-native science。**

---

你还可以产生很多同类型 Strategy。

例如：

### Contradiction Field Mining

不是找 paper A 和 B 明显 disagree。

而是把 300 篇论文的隐含 assumptions atomize：

```text
A assumes X
B assumes ¬X
C assumes X only under condition Q
D result implies Q is false
```

然后自动寻找：

> **从来没有被作者们显式意识到的理论矛盾。**

---

### Combinatorial Hypothesis Space Search

不是：

> brainstorm 20 hypotheses。

而是：

```text
50 mechanisms
×
40 boundary conditions
×
30 interventions
×
20 target phenomena
```

形成几十万甚至上百万 candidate combinations。

然后：

```text
structural pruning
→ evidence pruning
→ causal plausibility
→ falsifiability
→ novelty
→ adversarial attack
```

人类不可能系统跑这个空间。

AI 可以。

---

### Cross-field Mechanism Isomorphism

几百篇 neuroscience + ML + control theory + evolutionary biology：

不是找关键词 similarity，

而是全部转换成：

```text
state
transition
feedback
constraint
objective
failure mode
adaptation
```

然后找 **structural isomorphism**。

这也是典型 AI-native Strategy。

---

所以你的新层级，我会变成：

```text
STRATEGY
AI-native research programs
large-scale, adaptive, superhuman-throughput research

       ↓

TACTIC
reusable local research algorithms
bounded reasoning loops

       ↓

SOP
atomic cognitive / tool operations
stable input → output
```

而：

```text
knowledge acquisition
hypothesis formation
stress testing
...
```

变成 tags / packages / research-state ontology。

我觉得这比现在的四层要干净很多。

---

# 6. 但我强烈不建议按照“AI 使用频率”直接删 skill

这也是为什么我不赞成你现在先跑 100 次。

假设：

```text
skill A 使用 83 次
skill B 使用 2 次
```

不能说明：

> B 没用。

可能 B 是一个非常特殊但非常重要的 scientific operation。

只是你采样的 100 个 topic 没碰到它。

尤其 DARE 的目的本身就是：

> 找人类容易忽略的东西。

如果你用：

> frequency of normal research cases

去优化它，

很可能恰恰把长尾能力剪掉。

这会产生一个很讽刺的结果：

**你用 empirical popularity 把 DARE 优化成了平均人类科研流程。**

所以应该区分四种东西：

| 类型                        | 处理         |
| ------------------------- | ---------- |
| semantic duplicate        | merge      |
| deterministic composition | fuse       |
| boilerplate control logic | centralize |
| rare but unique operator  | **keep**   |

最后这一类即使：

```text
usage = 0.3%
```

也可能非常重要。

---

# 7. 我认为真正应该做的是寻找 DARE 的“basis”

你刚才说对 100+ paper 做 atomization。

我其实建议：

> **对 DARE 自己做一遍同样的事情。**

920 个 skill 不看名字。

把每一个拆成：

```text
intent
input
output
transformation
loop structure
state required
tool required
stopping condition
failure condition
children
```

然后忘掉：

```text
SCAMPER
TRIZ
abstraction ladder
assumption audit
red team
...
```

这些人类命名。

只看底层 transformation。

然后会慢慢出现：

```text
invert constraint
remove component
substitute component
map analogy
surface assumption
negate assumption
generate counterexample
rank candidate
cluster evidence
detect contradiction
compose causal chain
...
```

这就相当于寻找：

> **scientific cognition 的 basis vectors。**

如果某个老 skill：

```text
Skill X =
Primitive A
+ Primitive B
+ Primitive C
+ loop twice
```

那么 Skill X 可能不应该再是 executable node。

它只是一个：

> **recipe / preset。**

这个 distinction 会帮你删掉非常非常多的东西，同时不损失人类积累的方法论。

---

# 8. 所以 100 次完整 research，我认为现在信息效率非常低

假设你真的跑：

```text
100 topics
× full DARE research
```

最后你会收集：

```text
skill selected
skill skipped
routing path
backtracking
token usage
outputs
```

听起来非常科学。

但这里有巨大的 confounding：

### task distribution

你选的 100 个题目决定 skill usage distribution。

### model bias

Sonnet、Opus、GPT 的 skill selection preference 很可能不同。

### architecture bias

一个 skill 有没有被选择，取决于它在 catalog 里的位置、名字、描述、父节点，而不一定取决于它有没有价值。

### routing overhead

一个 skill 可能不被选择，仅仅是因为模型在第三层已经被其他选项吸走。

### current redundancy

两个 duplicate skills 把概率分散：

```text
A: 30%
B: 25%
```

你可能以为两个都很重要。

实际上：

```text
A ≈ B
```

应该合并。

因此：

**behavioral frequency 是最后验证架构的证据，不应该是第一步发现架构的证据。**

---

# 9. 我会这样做，而且成本会小得多

不是 100 full research。

而是：

### Phase A — Static DARE autopsy

**全 900+ skill，0 次 research。**

分析：

* semantic similarity
* dependency topology
* structural twins
* duplicate IO contract
* repeated control boilerplate
* identical / near-identical child sets
* one-parent-one-child chains
* deterministic composition chains
* near-unused graph leaves
* huge fan-out nodes
* artificial hierarchy nodes
* schema drift
* naming vs actual behavior mismatch

你现在拥有显式 dependency graph，这是一个巨大的优势。README 甚至明确说整个 2476-edge graph 可以从 frontmatter reconstruction。([GitHub][1])

这一阶段就可以砍掉一大批明显的架构债。

---

### Phase B — Skill semantic compilation

逐个 cluster：

```text
900 human methods
        ↓
~? underlying cognitive operations
        ↓
canonical SOP basis
        ↓
canonical tactics
```

注意这里我不会预设最后剩：

> 100 个 / 200 个 / 300 个。

应该让结构自己告诉我们。

---

### Phase C — Cheap routing probes

这时候才让 AI 上。

但不 research。

给模型：

```text
research state
topic
available tactics
```

然后只问：

> 下一步你选择什么？为什么？

**选完直接停止。**

甚至可以：

```text
200 research states
```

都没有一次真正 fetch 100 paper。

这样我们可以测：

* selection entropy
* ambiguous skills
* dead skills
* equivalent substitution
* model-dependent routing
* new hierarchy whether understandable

成本与 full research 不是一个数量级。

---

### Phase D — State replay

这是我尤其推荐的。

你不需要每次从零 research。

保存几个真实 checkpoint：

```text
after literature survey
after gap discovery
after hypothesis generation
after failed experiment
after contradictory evidence
```

同一个 state：

```text
old DARE → next action
new DARE → next action
```

对比。

这非常干净。

因为 world state 完全一样。

测的是：

> architecture 对 AI scientific decision 的影响。

---

### Phase E — 5–10 mini end-to-end

限制：

```text
3–5 tactic transitions
```

验证：

* 有没有 capability loss
* routing 是否更简单
* token 是否下降
* scientific output 是否变差

---

### Phase F — 3–5 真正 full research

最后才是你说的那种：

```text
100+ papers
atomization
graph
hypothesis
experiment
```

如果新 DARE 在这里真的明显更好，

**再扩大。**

---

# 10. 什么时候才值得做 100 次？

只有一种情况我会告诉你：

> “现在值得跑 100 次。”

就是你的研究问题变成：

> **How do AI research agents actually use a scientific-method skill library?**

也就是说你准备把：

```text
skill utilization distribution
routing patterns
long-tail operators
skill co-occurrence
model preference
```

本身写成一项 empirical research。

这时候：

**100 次甚至可能还不够。**

因为你是在研究行为分布。

但如果目的只是：

> **把 DARE v3 重构成更好的 v4。**

完全没必要先做这个。

---

# 11. 而且我觉得你现在已经可以直接让我开始做架构分析

你问：

> 能不能靠 HTML 图谱 + 你亲自阅读 skill，给下一步迭代方案？

**可以。**

而且我认为这就是现在信息/成本比最高的方法。

图谱负责告诉我：

> **结构上哪些东西不合理。**

Skill body 负责告诉我：

> **语义上哪些其实是一回事。**

少量 routing probe 负责告诉我：

> **AI 看见这些东西的时候实际上怎么理解。**

三者结合就够做第一版 v4。

不是：

> 先跑 100 个 scientific projects。

---

## 我现在已经能看到的重构方向

最终我比较期待 DARE 变成类似：

```text
DARE
│
├── Orchestrator
│   ├── research state
│   ├── budget
│   ├── evidence ledger
│   ├── backtracking
│   └── context
│
├── Strategies
│   │
│   ├── massive-literature-atomization
│   ├── latent-mechanism-mining
│   ├── contradiction-field-mining
│   ├── combinatorial-hypothesis-search
│   ├── cross-domain-isomorphism-search
│   └── ...
│
├── Tactics
│   │
│   ├── assumption-stress-test
│   ├── causal-chain-validation
│   ├── evidence-triangulation
│   ├── analogy-transfer
│   └── ...
│
└── SOPs
    │
    ├── extract-claim
    ├── surface-assumption
    ├── normalize-variable
    ├── construct-counterexample
    ├── score-hypothesis
    └── ...
```

而原来的：

```text
knowledge-acquisition
deep-insight
hypothesis-formation
creative-ideation
...
```

还存在。

但变成：

```text
capability taxonomy
```

而不是 execution hierarchy。

---

还有一个我认为非常值得改变的小地方：

现在 dependency frontmatter 把层级本身编码进去了：

```text
campaigns:
strategies:
tactics:
sops:
```

README 说整个依赖图就是依赖这些 layer-specific keys 重建的。([GitHub][1])

下一版我可能会改成：

```yaml
kind: tactic

calls:
  - surface-assumption
  - classify-vulnerability
  - validate-causal-logic

capabilities:
  - deep-insight
  - stress-test
```

**type 和 dependency 解耦。**

否则以后你再想重新定义一遍层级，又要迁移整个 graph。

---

所以如果让我现在决定：

**我不会让你烧钱跑 100 次。**

我会先直接对现有 DARE 做一次 **“meta-atomization”**：

> 把 900+ 个由人类命名的研究方法拆成真正的 cognitive primitives，找出最小但高表达力的 scientific cognition basis，然后重新从这个 basis 往上构建 AI-native tactics 和 strategies。

这件事情本身甚至非常符合 DARE 的哲学：

> **第一次重构，是把人类科研方法装进 AI。**
>
> **下一次重构，是把“人类如何组织科研方法”这件事本身也拿掉。**

我觉得这才可能是 DARE v4 真正值得做的方向。

[1]: https://github.com/yogsoth-ai/de-anthropocentric-research-engine?utm_source=chatgpt.com "GitHub - yogsoth-ai/de-anthropocentric-research-engine: 900+ pure-markdown skills for autonomous AI research, organized as 9 freely-composable packages over a 4-layer hierarchy (Campaign → Strategy → Tactic → SOP). Non-linear orchestration with backtracking, 6 MCP integrations. The AI is the researcher — you set the direction. · GitHub"
[2]: https://github.com/yogsoth-ai/de-anthropocentric-research-engine/blob/main/skills/assumption-stress-test/SKILL.md "de-anthropocentric-research-engine/skills/assumption-stress-test/SKILL.md at main · yogsoth-ai/de-anthropocentric-research-engine · GitHub"
[3]: https://github.com/yogsoth-ai/de-anthropocentric-research-engine/blob/main/skills/assumption-audit/SKILL.md "de-anthropocentric-research-engine/skills/assumption-audit/SKILL.md at main · yogsoth-ai/de-anthropocentric-research-engine · GitHub"
````

## Pthahnix-03

````bash
那你能帮我进行这件事吗? 就是先第一步, 新结构, 我们直接将原来的 Campaign → Strategy → Tactic → SOP 四层压缩到 Tactic → SOP 的两层. 并且在保证不丢失目前的 dare 的能力的前提下, 进行这个压缩的规划. 就像我的 https://github.com/yogsoth-ai/de-anthropocentric-research-engine/blob/main/scripts/all-graphs.html 是老的架构的完整图谱一样, 你能不能帮我先进行一大批这样的工作, 我不知道你自己 ChatGPT 这里有没有能力进行大规模复杂 step 的工作, 请你不用一步到位的, 可以多轮工作, 中途每次只是向我汇报你得到了什么样的结果, 结束了没有, 没有的话让我给你发送 prompt 让你继续, 这样来, 最终给我一个迭代后的 Tactic → SOP 的两层架构的方案, 也表现为 graph 的形式. 每个 graph 的 edge 就是调用关系, tactic 对 sop 的包含, sop 与 sop 之间的允许跳转的关系, tactic 与 tactic 之间允许的跳转关系 (跳转就是说可以根据 AI 当时的 context 需求, 直接工作到一半换 sop 继续, 或者说就是预先编排成 pipeline 串行执行, 我们都叫跳转). 然后要注意我打算消掉老的 paper 和 web 的 search 类的 skill 基础设施, 主要都是 sop 集中在 lit engine, subagent spawn 里面, 我觉得这个我打算完全废弃掉, 因为我希望后续 dare 完全和 mcp 解耦, 包括 subagent 的调用也是, 这批东西直接去掉, 转而变成让 AI 自己看自己拥有的 paper / web / agent 的工具自行决定使用方式. 这样我认为自由度也更高, 我可以自己随便装 alphaxiv, brave, tavily, apify, perplexity, 我随便装, 反正 AI 自己选来用就行. 请你分析一下这个工作帮我试试看吧. 然后最终给我的东西也是一个 HTML, 里面每个 node 就是一个 sop 或者 tactic, 并且点击之后要能看到其中的详细内容, 可以说明一下是原先的怎么样一批 campaign strategy tactic sop 缩合成了这个新的 skill. 先来试试看吧.
````

## GPT-03

````bash
可以，而且我已经开始按你说的方式做了。**这次第一轮已经完成一个可交互的 HTML 原型，但整个 DARE 重构远没有结束。**

[打开 DARE v4 两层架构 Pass 1 HTML](sandbox:/mnt/data/dare-v4-two-layer-pass1.html)

这个 HTML 不是概念图，而是我先拿你现有 repo 里几组真实结构做了一次“试压缩”：目前里面放了 **21 个候选 Tactic + 38 个候选 SOP**。可以搜索、缩放、拖动、隐藏 SOP/跳转边；点击每个节点，右边会显示它做什么，以及它是由哪些旧 Campaign / Strategy / Tactic / SOP 压缩而来的。

### 第一轮下来，我对新架构的定义已经比较明确

你说的“两层”，我认为**绝对不能理解成 graph 只有两跳**。应该理解成：

```text
整个 DARE 只有两种 executable node type：

TACTIC
  = 有边界的、可复用的 scientific reasoning workflow

SOP
  = 原子的 scientific cognitive operation
```

但 graph 本身允许：

```text
TACTIC ──contains/calls──> SOP

TACTIC ──jump───────────> TACTIC

SOP ─────jump───────────> SOP
```

也就是说，可以：

```text
Tactic A
  ↓
SOP 1
  ↓
SOP 2
  ↓
发现 context 改变
  ↓
SOP 17
  ↓
Tactic B
```

不再要求经过 Campaign → Strategy → Tactic → SOP 的形式层级。

这是一次很重要的改变。你现在 README 里的架构明确规定四层分别承担 WHAT / WHEN-WHY / HOW-COMBINE / HOW-EXECUTE，而且上层只能逐层向下调用。([GitHub][1]) 新架构则把“**知识分类层级**”和“**实际 reasoning graph**”分离了。

---

### 我也确认了：你删除 literature/web/subagent 基础设施这个方向是对的

因为它们现在确实不是 scientific cognition，而是 runtime implementation。

比如当前 `literature-engine` 的三个 SOP，实际上分别硬编码 AlphaXiv / Semantic Scholar 的浅、中、深阅读方式；`web-browsing` 又硬编码了 search MCP + Apify/rag-web-browser；`spawn-agent` 更直接是一个专门负责派生 subagent 的基础设施 SOP。

所以我建议 **v4 科研图谱里彻底不存在这些节点**：

```text
❌ literature-overview
❌ literature-search
❌ literature-research

❌ web-search
❌ web-research

❌ spawn-agent
```

但这不代表：

> DARE 不再读论文 / 搜索 / 用 agent。

而是：

> **DARE 只规定什么时候需要什么 evidence / cognitive work，不规定 AI 怎么获得它。**

例如 SOP 不再写：

```text
Use AlphaXiv to retrieve full text.
```

而写：

```text
Acquire primary-source evidence sufficient to resolve
the specified methodological uncertainty.

Required evidence:
- original method description
- experimental setup
- boundary conditions
- reported failure cases

Do not infer unavailable details from summaries.
```

AI 当前有 AlphaXiv 就用 AlphaXiv，有 Perplexity 就用 Perplexity，有 Brave + Apify 就自己组合；未来工具换掉，DARE 一行不用改。

同理，原来大量写着：

```text
spawn a critic agent
spawn a defender agent
spawn a judge agent
```

的东西，我不会把对应科研能力删掉。

会变成：

```text
construct-critique
construct-defense
judge-exchange
```

至于是：

```text
同一个模型串行 role-play
```

还是：

```text
3 个 subagents 并行
```

还是未来某种 swarm runtime，

**不属于 scientific skill 的职责。**

---

## 第一轮还发现了一个很重要的现象

你的“冗余感”不是错觉。

比如 `deep-insight` 里面现在：

```text
assumption-audit [Strategy]
        ↓
assumption-stress-test [Tactic]
        +
assumption-surfacing [shared SOP]
```

这个 Strategy 自己几乎没有形成独立的 scientific transformation。

所以 v4 我直接倾向：

```text
assumption-stress-test [TACTIC]
    ↓
surface-assumptions
    ↓
classify-assumption-vulnerability
    ↓
validate-causal-link
    ↓
...
```

`assumption-audit` 消失。

又比如：

```text
parameter-screening [Strategy]
variance-decomposition [Strategy]
```

两者实际上都调用：

```text
screening-then-decomposition [Tactic]
```

只是执行不同深度的段落。

这类东西很适合变成一个 Tactic：

```text
sensitivity-analysis
```

内部根据 context：

```text
cheap screen
    ↓ necessary?
variance decomposition
    ↓ necessary?
interaction analysis
    ↓
validity envelope
```

而不是为了每一个阶段再人为造一个 Strategy。

---

## 我现在形成的“压缩规则”是这一套

* **旧 Campaign**：纯 router 的直接消失；它的名字最多保留成 capability/tag。真正具有独特完整科研算法的内容，下沉为 Tactic。
* **旧 Strategy**：如果本质上是独立的、会循环/分支/判断停止的科研算法，就成为 Tactic；如果只是包一个 Tactic 或若干 SOP，则直接消融。
* **旧 Tactic**：如果跨场景复用、具有非平凡组合逻辑，就保留为新 Tactic；如果只是固定 SOP A→B→C，则有可能 inline 到更大的 Tactic。
* **旧 SOP**：先保留能力，再进行**全局语义去重**。名称不同但 cognitive transform 相同的，合成一个 canonical SOP。
* **paper/web/agent/tool plumbing**：全部从科研图移除。
* **budget/context/checkpoint/tool selection/parallelism**：后面单独作为 runtime/control-plane 处理，不污染 scientific cognition graph。

特别是第四点，我觉得会成为这次重构真正的大头。

例如现在可能分别存在：

```text
assumption-surfacing
assumption-extraction
assumption-enumeration
key-assumption-identification
...
```

最终很可能只有一个：

```text
surface-assumptions
```

不同研究方法需要的差异放参数、约束或 Tactic context 里，而不是继续制造新的 SOP。

---

## 第一版 HTML 里面已经试验了这种做法

例如 Hypothesis Formation，我没有保留原来的：

```text
Campaign:
  hypothesis-formulation

Strategies:
  deductive
  inductive
  abductive
  competing
  operationalization
...
```

而先压成：

```text
formulate-hypotheses [TACTIC]
    │
    ├─ identify-theory
    ├─ extract-mechanism
    ├─ identify-variables
    └─ specify-relationship
                │
                └──── jump ───→ falsifiability-audit [TACTIC]
                                      │
                                      ├─ check-falsifiability
                                      ├─ operationalize
                                      └─ specify-boundaries
```

这样 deduction / induction / abduction 更像 **generation mode**，而不是必须占一个 Strategy 节点。

Stress Test 我也开始这么处理：

```text
adversarial-debate
structured-red-team
premortem-fmea
counterfactual-probing
boundary-stress-test
mitigation-validation
```

底下共享：

```text
surface-assumptions
construct-critique
map-threat-surface
generate-attack-vector
execute-probe
aggregate-findings
enumerate-failure-modes
score-risk
construct-counterfactual
measure-fragility
...
```

原来的 multiagent topology 不再成为科学方法层级。

Creative Ideation 则开始往更“底层认知操作”压：

```text
analogical-discovery
combinatorial-ideation
destructive-ideation
constraint-and-perspective-forcing
```

下面不是堆 SCAMPER、Six Hats、TRIZ 这些人类方法名字，而开始寻找：

```text
abstract-principle
map-analogy
enumerate-combinations
test-consistency
generate-provocation
extract-constructive-movement
synthesize-idea
```

这才比较接近我们前面说的：

> **寻找 scientific cognition 的 basis。**

---

## 为什么我觉得这个工作确实可以做大规模

你已经提前给自己留下了非常好的机器可读资产。

`/scripts/data/` 下面不是只有一张巨大 HTML，而是已经按 package 拆成：

`creative-ideation.json`、`deep-insight.json`、`hypothesis-formation.json`、`experiment-execution.json`、`knowledge-acquisition.json`、`knowledge-structuring.json`、`stress-test.json`、`convergence.json` 等独立图谱数据。([GitHub][2])

所以后面不需要“我凭感觉看几十个 skill”。

可以逐步做：

```text
所有旧 nodes
      ↓
semantic decomposition
      ↓
cognitive transform extraction
      ↓
duplicate clusters
      ↓
canonical SOP basis
      ↓
Tactic reconstruction
      ↓
edge reconstruction
      ↓
capability coverage audit
```

最后再重新生成完整 HTML。

也就是说，这次是可以真正做成一个 **graph compilation project** 的。

---

### 我建议下一轮不要马上扩更多 Tactic

下一轮我想做最关键的一件事：

> **开始建立全局 Canonical SOP Dictionary。**

先重点扫：

```text
deep-insight
hypothesis-formation
stress-test
creative-ideation
convergence
```

把它们里面所有：

```text
同义 SOP
近义 SOP
参数化即可统一的 SOP
固定组合的 SOP
实际上只是 agent/tool wrapper 的 SOP
```

全部 cluster 出来。

然后得到类似：

```text
OLD
assumption-surfacing
assumption-enumeration
assumption-extraction
key-assumption-identification
...

             ↓ merge

NEW
surface-assumptions
```

而且每一个 canonical SOP 都记录 **provenance**，这样最终 HTML 点击它时能看到：

> 这个 SOP 吞掉了旧系统中的哪 7 个节点，来自哪些 Campaign/Strategy/Tactic，为什么合并，没有丢掉什么能力。

这正是最终图谱最重要的信息之一。

**当前状态：Pass 1 已完成；整个重构未完成。**

你现在可以先点开我做的原型看看交互和表达方式是不是你想要的：

**[DARE v4 · Tactic → SOP · Pass 1](D:\YOGSOTH-AI\file-transfer\2026-08-20-16-23-dare-v4-two-layer-pass1.html)**

如果这个方向没有大的问题，你下一条直接给我一句 **“继续”** 就行。我下一轮直接开始做 **全局 SOP 去重 / cognitive primitive 提取**，不需要你再重新解释任务。

[1]: https://github.com/yogsoth-ai/de-anthropocentric-research-engine/tree/main "GitHub - yogsoth-ai/de-anthropocentric-research-engine: 900+ pure-markdown skills for autonomous AI research, organized as 9 freely-composable packages over a 4-layer hierarchy (Campaign → Strategy → Tactic → SOP). Non-linear orchestration with backtracking, 6 MCP integrations. The AI is the researcher — you set the direction. · GitHub"
[2]: https://github.com/yogsoth-ai/de-anthropocentric-research-engine/tree/main/scripts/data "de-anthropocentric-research-engine/scripts/data at main · yogsoth-ai/de-anthropocentric-research-engine · GitHub"
````

## GPT-04

````bash
继续完成了一轮，而且这一轮比 Pass 1 实质得多。

**[打开 DARE v4 · Two-Layer Compression · Pass 2](sandbox:/mnt/data/dare-v4-two-layer-pass2.html)**

先纠正一下我刚才中途汇报的数字：那是生成过程中尚未完全合并的数据。**最终 Pass 2 实际包含 30 个候选 Tactic、95 个新/保留 SOP、340 条旧节点 provenance 引用、153 条新图调用/跳转边。** 其中 20 个 SOP 我目前判断为 high-confidence safe merge，30 个属于 parameterized merge，45 个我刻意保留成 specialized SOP，没有为了“压缩率”硬合并。

这一轮主要完整推进了 **hypothesis-formation、deep-insight、stress-test、creative-ideation、convergence** 这五个科学认知密度最高的区域。当前 v3 的四层确实是严格的 Campaign→Strategy→Tactic→SOP，而且 Strategy 还承担 state/budget/stopping，context checkpoint 又在每个 Strategy 后追加，这进一步说明“科研方法”与“运行控制”目前混在同一个 skill hierarchy 里。([GitHub][1])

### 这一轮最重要的几个结果

* **Campaign 基本可以直接消失为 executable type。** 例如 `hypothesis-formulation`、`counterfactual-probing`、`multi-criteria-scoring`、`cross-domain-discovery` 这类旧 Campaign，本身就非常自然地成为新的 Tactic。
* **旧 Strategy 大量分裂成三类。** 真正有独立科研算法的升级为 Tactic；只是 mode selection 的变成 Tactic 参数；单纯包一层 Tactic/SOP 的直接消失。
* **SOP 的主要压缩方式不是删除，而是 parameterization。** 比如 PICO / SPIDER / SPICE / ECLIPSE 现在是多个独立 SOP，但它们实际都是“选择并实例化一个 RQ schema”，所以 Pass 2 合成了一个 `apply-question-framework`。旧图明确把这几个框架分别做成独立叶子。
* **FMEA 是非常漂亮的固定组合压缩案例。** 原来的 `severity-scoring → occurrence-scoring → detection-scoring → action-priority-matrix` 我直接钉成一个 `score-fmea-risk` SOP，因为它们的使用契约高度固定。
* **Debate/subagent 是另一个强合并区域。** stress-test 有 `debate-critic / debate-defender / debate-judge`，convergence 又有 `critic-attack / advocate-construction / judge-verdict`。它们现在成为 `construct-critique / construct-defense / adjudicate-exchange`，完全不要求 agent spawn。
* **一些跨 package 的重复已经非常明确。** 比如 `validity-envelope-construction` 在 deep-insight 和 stress-test 中实际上重复出现；这类是最安全的 canonical merge。

我也把你要求的 **MCP/tool 解耦**真正体现在架构里了。旧 convergence graph 目前明确存在 `web-search / web-research / paper-overview / paper-search / paper-research` 这种 import SOP。 Pass 2 不再把它们放进 scientific graph；像 `cross-database-verification` 这种原来带 provider 意味的能力，则不是直接删除科研含义，而是改成 `verify-evidence-independence`：

> 需要独立证据渠道验证这个 gap 是否真实。

至于 AI 用 AlphaXiv、Brave、Tavily、Perplexity、Apify，还是以后完全不同的工具，**DARE 不关心。**

HTML 里现在也已经不是简单展示节点了。点击 SOP 会看到它来自哪些旧 skill、我是按 `safe merge / parameterized merge / specialized retained` 哪种方式处理，以及为什么这么处理；点击 Tactic 会看到它吞掉了哪些旧 Campaign/Strategy/Tactic，以及当前 canonical SOP calls。还能按照 family、merge status、旧节点名称搜索。

一个我越来越确定的结构是：

```text
                     Host AI / Agent Runtime
                  tools / context / parallelism
                             │
                             │
                  ┌──────────┴──────────┐
                  │                     │
               TACTIC  ←── jump ──→  TACTIC
                  │
             calls / contains
                  │
                 SOP  ←── jump ───→    SOP
```

而这些：

```text
context-init
context-checkpoint
saturation-detection
budget gate
generic quality gate
iteration bookkeeping
```

应该移到 **control/runtime semantics**，不属于 scientific cognition graph。你现在 README 里 context-init/checkpoint 本来就明显是在做 session recovery，而不是科研方法本身。([GitHub][1])

这很重要，因为否则我们只是：

> 四层脏乱 → 两层脏乱。

真正的 v4 应该同时发生两个变化：

```text
4-layer hierarchy
        ↓
2 executable types

scientific method + runtime + tools 混合
        ↓
scientific cognition / control / tooling 三者解耦
```

另外，我这一轮**没有为了减少 SOP 数量而压掉专业方法**。例如 CLR causal validation、falsifiability、Current Reality Tree、Ishikawa、Pareto dominance、active pair selection 这种东西仍然存在。它们确实代表不同的变换，不能因为“看起来都属于分析”就糊成一个万能 SOP。

这也是为什么 Pass 2 还有 **95 个 SOP**。我现在甚至觉得这反而是好信号：我们开始找到“应该删的复杂度”和“真正有信息量的复杂度”的边界，而不是追求一个漂亮的 500→50 数字。

### 下一轮我建议继续做什么

现在还没有结束。下一轮最合理的是把 **experiment-execution、knowledge-acquisition、knowledge-structuring、north-star-crystallization** 纳入同一个 canonical dictionary，然后处理 `engine-core / context-management / ara-from-context`，明确哪些东西属于新的 control plane，哪些还能留在 scientific graph。

等这一轮做完之后，我们就第一次能够得到一个接近全局的：

**old DARE → canonical SOP basis → reconstructed Tactic graph**

然后我会再反过来做一次 **capability coverage audit**：逐个旧 Campaign/Strategy 检查“它原来能做的事情，在新图里到底有没有路径能做到”，而不是仅仅确认旧节点名字被某个新节点引用了。

Pass 2 在这里：

**[DARE v4 Pass 2 — Canonical SOP Dictionary](D:\YOGSOTH-AI\file-transfer\2026-08-20-16-39-dare-v4-two-layer-pass2.html)**

你下一条继续发 **“继续”** 就可以，我就从剩下几个 package 接着做，不需要重新解释。

[1]: https://github.com/yogsoth-ai/de-anthropocentric-research-engine "GitHub - yogsoth-ai/de-anthropocentric-research-engine: 900+ pure-markdown skills for autonomous AI research, organized as 9 freely-composable packages over a 4-layer hierarchy (Campaign → Strategy → Tactic → SOP). Non-linear orchestration with backtracking, 6 MCP integrations. The AI is the researcher — you set the direction. · GitHub"
````

## GPT-05

````bash
继续完成了一轮。**Pass 3 已完成，但整个重构还没有结束。**

[打开 DARE v4 · Two-Layer Compression · Pass 3](sandbox:/mnt/data/dare-v4-two-layer-pass3.html)

这一次已经从之前几个核心 cognition package，扩展到了接近整个 scientific-research 主干。当前图经过程序化完整性检查：

* **52 个候选 Tactic**
* **206 个 SOP**
* **258 个 scientific nodes**
* **271 条 Tactic→SOP 调用边**
* **113 条允许跳转边**
* **384 条总边**
* **638 条旧架构 provenance 引用**
* **0 个重复 node ID**
* **0 个 dangling edge**

而且这一版第一次正式加入了你要求的 **SOP→SOP jump**。

---

### 这一轮最大的变化：基本把 DARE 的完整科研生命周期串起来了

现在图已经覆盖九个 scientific families：

```text
DIRECTION
     ↓
ACQUISITION
     ↓
STRUCTURING
     ↓
HYPOTHESIS
     ↓
INSIGHT
     ↓
IDEATION
     ↓
STRESS
     ↓
EXPERIMENT
     ↓
CONVERGENCE
```

注意，这**不是新的固定 pipeline**。

这些只是 capability family。

真正执行的时候现在可以：

```text
Tactic → SOP → SOP
   ↓             ↓
 Tactic ←────── SOP
   ↓
 another Tactic
```

例如目前图里已经存在一条典型长路径：

```text
synthesize-north-star
        ↓
synthesize-literature-evidence
        ↓
build-domain-ontology
        ↓
construct-causal-model
        ↓
formulate-hypotheses
        ↓
falsifiability-audit
        ↓
design-experiment
        ↓
plan-experiment-implementation
        ↓
analyze-experiment-results
        ↓
construct-argument-map
        ↓
multi-criteria-decision
```

但 AI 完全可以中途从：

```text
construct-causal-model
```

跳到：

```text
counterfactual-causal-analysis
```

发现模型有问题后，再返回 ontology / evidence / hypothesis。

这已经比 Campaign→Strategy→Tactic→SOP 的执行树更接近你原来希望 DARE 具备的 non-linear scientific cognition。

---

## 1. North Star 被明显压扁了

旧架构的：

```text
north-star-crystallization
    ├── cold-start
    ├── warm-start
    └── hot-start
```

我这一轮决定：**cold / warm / hot 全部取消作为节点。**

因为它们实际主要区别在于“已有多少 context，因此跳过多少前置步骤”。例如 warm/hot start 本来就会逐步简化 actor profiling、landscape reconnaissance 和 direction narrowing。

所以它们本质不是三个 scientific algorithms。

它们应该成为：

> **entry-depth policy**

例如：

```text
context 很少
→ profile → landscape → narrow → obstacle → goal → north star

已有明确 field
→ profile(light) → narrow → obstacle → goal → north star

已有明确 research direction
→ obstacle → goal → north star
```

因此新图只留下：

```text
profile-research-context
map-research-landscape
narrow-research-direction
analyze-direction-obstacles
decompose-research-goal
synthesize-north-star
```

这六个真正有科学/决策意义的 Tactic。

---

## 2. Knowledge Acquisition 这一块，我没有把它删掉

这是一个需要特别区分的地方。

你要删除的是：

```text
paper-search
paper-research
paper-overview
web-search
web-research
...
```

这种**工具基础设施**。

但：

```text
systematic review
meta analysis
patent analysis
benchmark audit
baseline establishment
```

本身仍然是 scientific methodology。

所以现在 Acquisition 变成七个比较大的 Tactic：

```text
synthesize-literature-evidence
mine-patent-landscape
assess-prior-art-and-claims
map-patent-white-space
audit-benchmark-validity
synthesize-meta-analytic-evidence
establish-empirical-baseline
```

而原来的 scoping/systematic/deep/narrative/snowball survey，我没有再让它们各自占一个 Strategy。

它们成为：

```text
synthesize-literature-evidence(mode=...)
```

的不同 execution mode。

旧 acquisition graph 里确实显式 import 了 `web-search / web-research / paper-overview / paper-search / paper-research`。

这些在 Pass 3 scientific graph **全部消失**。

---

## 3. Knowledge Structuring 发生了一次比较大的“去工具化”

旧 `knowledge-structuring` 里有相当多：

```text
wiki-search
wiki-graph-query
wiki-add-edge
wiki-ingest-source
wiki-compile-page
wiki-lint-fix
wiki-edge-audit
```

甚至 `knowledge-compilation` / `vault-maintenance` 本身就带很强的 wiki vault implementation semantics。

这些我认为不应该进入 DARE v4 scientific cognition。

所以这一部分现在只剩四个 Tactic：

```text
build-domain-ontology
construct-causal-model
map-dimensional-research-space
construct-argument-map
```

底下则保留真正的方法：

```text
atomize-concept
type-relation
construct-hierarchy
detect-structural-gap

represent-mechanism-edge
attach-evidence-to-relation
flag-contradictory-evidence
detect-feedback-loop
trace-causal-chain

validate-axis-independence
score-gap-novelty

atomize-claim
document-counterclaim
score-claim-strength
...
```

至于这些东西最终存在：

* Markdown
* Neo4j
* GraphRAG
* SQLite
* Obsidian
* plain context
* 某个未来 MCP

DARE 都不再知道。

这是我觉得很重要的一刀。

---

# 4. Experiment Execution 也被拆成了“科研”与“运行”

这个 package 原本混得尤其厉害。

里面一边有真正 scientific：

```text
factor-level design
ablation design
metric specification
sample-size estimation
statistical method selection
robustness design
```

另一边又有：

```text
implementer-dispatch
execution-monitoring
checkpoint-and-recover
result-collection
```

后者其实是在管理 agent/runtime。

所以现在只留下五个 scientific Tactic：

```text
design-experiment

analyze-research-constraints

analyze-future-scenarios

plan-experiment-implementation

analyze-experiment-results
```

这里有个容易误解的地方：

`plan-experiment-implementation`

**保留。**

因为：

> 怎么把 experiment 转成 dependency-aware implementation plan

仍然是科研规划能力。

但是：

> 实际叫哪个 coding agent、派几个 agent、怎么监控进程、失败怎么 retry

全部出去。

所以以后：

```text
DARE:
  "这里需要执行这个实验，
   dependencies 是这些，
   metrics 是这些，
   reproducibility requirement 是这些。"

Host AI:
  "我当前有 Claude Code + Docker + SLURM，
   那我自己决定怎么跑。"
```

这个职责边界现在清晰很多。

---

# 5. Engine Core 基本确定不属于 scientific graph

这一轮我也专门审计了：

```text
engine-core
context-management
ara-from-context
```

现在我的判断越来越坚定。

旧 `engine-core` 中的：

```text
main entry
writing-specs
executing-specs
research-catalog
campaign-selection
spec-self-review
```

基本都是 **control plane**。

旧 `context-management`：

```text
context-init
context-checkpoint
timestamp
```

更是纯 runtime。

所以最终 DARE v4 很可能不是：

```text
skills/
  engine-core/
  context-management/
  ...
```

和科研方法平级。

而是逻辑上分成：

```text
DARE Scientific Graph
├── Tactics
└── SOPs


DARE Runtime Policy
├── routing
├── context
├── budget
├── iteration
├── checkpoint
├── stopping
└── recovery


External Capability Layer
├── paper tools
├── web tools
├── coding tools
├── agents
├── storage
└── MCPs
```

scientific graph 只知道第一块。

---

# 6. ARA 我现在也倾向于移出去

`ara-from-context` 目前的核心操作包括 context review、compile、rigor review、north-star alignment 等。

我认为里面真正科学的：

```text
north-star alignment
rigor review
```

已经可以被现有 Tactic/SOP 覆盖。

剩下：

```text
compile artifact
feed context
format output
```

更像：

> artifact/export layer

而不是 scientific cognition。

所以 Pass 3 右侧/左侧说明中已经开始把它和 runtime/tooling 分开表示。

---

# 7. 目前 206 个 SOP，我暂时不觉得多

这是这一轮很值得记录的结果。

Pass 2 是：

> 95 SOP

现在加入 patent、meta-analysis、ontology、causal modeling、experiment design、statistical analysis 后变成：

> **206 SOP**

乍看好像我们又变复杂了。

但我觉得现在**不能继续粗暴砍**。

因为例如：

```text
estimate-sample-size
assess-publication-bias
parse-patent-claim
construct-design-matrix
detect-feedback-loop
identify-critical-chain
```

虽然都是“分析”，但显然不是同一个 cognitive transform。

如果现在为了漂亮地说：

> 900 → 80

把它们合成：

```text
analyze-stuff
```

DARE 就失去价值了。

因此当前 206 是：

> **coverage-first canonicalization**

下一轮才进入真正重要的：

> **cross-package semantic compression**

---

## 下一轮我准备开始做的事情

现在我觉得已经到了一个转折点。

**Pass 1–3 是从旧结构往新结构搬。**

下一轮我不想再继续“搬节点”了。

我准备开始反方向：

```text
206 SOP
   ↓
compare input
compare transformation
compare output
compare invariants
compare failure condition
   ↓
find global cognitive equivalence classes
   ↓
canonical scientific cognition basis
```

例如现在就已经能看到：

```text
extract-concepts
extract-mechanism
atomize-concept
atomize-claim
extract-causal-claims
...
```

不能仅凭 `extract-*` 合并。

但我们可以分析它们到底是：

```text
generic atomization primitive
        +
domain schema
```

还是确实具有不可约的科学方法差异。

类似地：

```text
assess-study-quality
assess-risk-of-bias
assess-construct-validity
audit-reproducibility-reporting
score-claim-strength
verify-evidence-independence
```

可能隐藏着一个更底层的：

> **evidence-quality evaluation basis**

但是否应该真的合并，需要逐项做 IO contract 审计。

这会是下一轮的主要工作。

---

### 当前状态

**迁移/两层化：已经完成一个相当大的主体版本。**

**真正的全局去重：刚刚准备进入最重要阶段。**

**capability-loss audit：还没有最终完成。**

**最终 DARE v4 graph：还没有完成。**

所以我现在不会说这个 52/206 是最终架构。

它是我们第一次有了一个**基本覆盖完整科研生命周期、同时已经去掉 Campaign/Strategy/tool-runtime hierarchy 的中间 representation**。

你可以先打开这一版：

### [DARE v4 · Pass 3 — Whole Scientific Graph](D:\YOGSOTH-AI\file-transfer\2026-08-20-16-52-dare-v4-two-layer-pass3.html)

下一条继续发 **“继续”** 就行。我下一轮开始对这 **206 个 SOP 做真正的全局 cognitive-basis 压缩**，这一阶段应该会第一次看到 SOP 数量开始明显下降。
````

## GPT-06

````bash
继续完成了。**Pass 4 已结束，但整个重构还没有结束。**

### [打开 DARE v4 · Pass 4 — Cognitive Basis Compression](sandbox:/mnt/data/dare-v4-two-layer-pass4.html)

这一轮第一次真正对 Pass 3 的全量 **206 个 SOP 做跨 package 的 cognitive-basis compression**。最终程序实际检查出的结果是：

|                 | Pass 3 |  Pass 4 |
| --------------- | -----: | ------: |
| Tactic          |     52 |  **52** |
| SOP             |    206 | **175** |
| 总节点             |    258 | **227** |
| 总 edge          |    384 | **370** |
| 跨 family 共用 SOP |      — |  **39** |

也就是说，这轮在不动 Tactic 主体覆盖面的情况下，**净减少了 31 个 SOP，约 15%**。

这 31 个不是“觉得差不多所以删掉”：

* **17 个**：通过 13 个真正的 cognitive equivalence class 合并
* **10 个**：发现只是 report assembly / formatting / final summary，折进 Tactic 的 output contract
* **4 个**：属于 generic project/runtime planning，移出 scientific cognition graph

---

## 这一轮最重要的东西，是开始找到真正的“basis”

例如原来有：

```text
assess-rank-robustness
measure-sensitivity
design-meta-sensitivity
```

分散在 hypothesis / insight / acquisition。

我现在把它们压成：

```text
assess-sensitivity
```

contract 是：

```text
input:
  target
  perturbation space
  output of interest

transform:
  perturb input / assumption / model choice
  recompute or compare output
  quantify instability

output:
  sensitivity
  unstable regions
  dominant drivers
```

区别只剩：

```text
target = ranking
target = scientific conclusion
target = meta-analysis estimate
```

这就应该是一个 SOP，而不是三套“人类方法名称”。

---

另一个很明显的：

```text
map-parameter-space
identify-dimensions
```

现在变成：

```text
define-analysis-dimensions
```

而：

```text
enumerate-values
generate-extreme-values
specify-factor-levels
```

变成：

```text
enumerate-dimension-values
```

参数决定：

```text
mode =
  representative
  experimental
  boundary
  pathological
  adversarial
```

于是原来：

```text
parameter sensitivity
morphological ideation
boundary attack
factor experiment
dimensional gap analysis
```

五个看起来完全不同的人类方法，现在实际上开始共享：

```text
define dimensions
        ↓
enumerate values
        ↓
explore / perturb combinations
        ↓
evaluate response
```

这个就是我认为真正值得寻找的 **AI scientific cognition basis**。

---

## 一个更漂亮的合并：negative-space reasoning

原来三个 package 分别有：

```text
IDEATION
detect-white-space

ACQUISITION
map-ip-white-space

STRUCTURING
detect-structural-gap
```

名字、领域都不一样。

但底层 operation 都是：

> 给定一个显式 coverage representation，找没有被覆盖、薄弱覆盖、断裂或者异常稀疏的区域。

现在统一成：

```text
detect-coverage-gap
```

输入 representation 可以是：

```text
method × problem matrix
patent feature space
ontology graph
capability taxonomy
experimental design space
...
```

这正是你之前说的那种：

> 不要继续把人类学科里不同名字的方法机械保留下来，而是找它们底层共同逻辑。

---

## 目前形成的 13 个第一批 equivalence classes

HTML 右侧已经全部列出来了。

比较重要的包括：

```text
assess-sensitivity

define-analysis-dimensions

enumerate-dimension-values

design-mitigation

evaluate-scenario-impact

analyze-temporal-trajectory

detect-coverage-gap

audit-study-validity

audit-reporting-quality

detect-contradiction

extract-causal-structure

map-coverage-space

canonicalize-entity
```

点击它们，可以看到：

```text
新 SOP
↓
吞掉哪些 Pass 3 SOP
↓
这些 Pass 3 SOP 又来自哪些旧
Campaign / Strategy / Tactic / SOP
↓
为什么我认为合并成立
```

所以 provenance 没丢。

---

# 另一个很重要的结果：报告类 SOP 开始被清掉

例如以前我们还有：

```text
synthesize-benchmark-audit
synthesize-meta-analysis-protocol
synthesize-baseline-report
summarize-ontology
synthesize-experiment-results
generate-research-brief
validate-research-brief
```

我现在越来越觉得：

**这些大部分不应该是 SOP。**

因为它们不是：

> 对科学对象做一个新的 transformation。

而是：

> 把这个 Tactic 已经产生的 state 按某种 schema 输出。

所以现在变成：

```text
Tactic:
  audit-benchmark-validity

calls:
  inventory-benchmarks
  decompose-evaluation-metric
  audit-data-contamination
  assess-construct-validity
  ...
  
output_contract:
  BenchmarkAudit {
      validity
      contamination
      coverage
      protocol_variance
      ...
  }
```

而不是最后还：

```text
→ synthesize-benchmark-audit
```

再跑一遍模型。

这不仅让 graph 干净，**未来也会真实减少 token consumption**。

---

# project-management 类东西也开始出去

这一轮我把：

```text
enumerate-implementation-activities
estimate-activity-duration
calculate-critical-path
size-project-buffers
```

从 scientific SOP graph 移走了。

不是说 DARE 永远不能做这些。

而是：

> **它们属于 execution planning / runtime。**

scientific graph 留：

```text
map-dependencies
sequence-work
design-intermediate-objective
specify-execution-environment
...
```

真正执行的时候 host AI 想用：

```text
Claude Code
Codex
SLURM
Docker
GitHub Actions
subagents
single agent
```

自己决定。

这与我们之前对 MCP 的原则一致。

你现在旧 acquisition graph 里确实直接把 `web-search / web-research / paper-overview / paper-search / paper-research` 作为 SOP import。

旧 experiment graph 里也确实存在 `implementer-dispatch / execution-monitoring / result-collection` 这种强 subagent/runtime 语义。

而 knowledge-structuring 甚至把 `wiki-search / wiki-graph-query / wiki-add-edge / wiki-ingest-source / wiki-compile-page / wiki-lint-fix` 直接作为 cognition graph 的 SOP。

所以把这层全部切出去，我现在越来越确信是对的。

---

# 这一轮还有一个我觉得非常有价值的数据结果

我程序统计了当前 **哪些 SOP 被不同 scientific family 同时调用**。

现在一共有：

> **39 个 cross-family SOP**

最明显的几个：

```text
surface-assumptions
    → 4 families

assess-sensitivity
    → 4 families

define-analysis-dimensions
    → 4 families

enumerate-dimension-values
    → 4 families

identify-variables
    → 4 families

detect-coverage-gap
    → 3 families

aggregate-ranking
    → 3 families

evaluate-compatibility
    → 3 families

define-criteria
    → 3 families

score-candidate
    → 3 families

map-dependencies
    → 3 families

construct-critique
    → 3 families
```

这个信息很重要。

因为它不是：

> “我感觉这些比较基础。”

而是从我们现在重构出来的调用图本身出现：

> **这些 operation 自然成为了 scientific cognition network 的 hub。**

这开始给我们一个非常实际的办法去定义：

### 什么叫 canonical scientific primitive？

不是“小”。

也不是“名字抽象”。

而是：

> **能够在不同 research contexts 中保持相同 transformation contract，并被不同 Tactic 复用。**

我觉得这是 DARE v4 非常重要的设计原则。

---

## 所以我现在看到一个更清晰的最终形态

不是：

```text
900 human methods
↓
强行砍成 100 skills
```

而是：

```text
                 TACTICS
      scientific algorithms / programs
                    │
                    │ call
                    ▼
       ┌─────────────────────────┐
       │ Scientific SOP Basis    │
       │                         │
       │ surface-assumptions     │
       │ assess-sensitivity      │
       │ define-dimensions       │
       │ extract-causal-structure│
       │ detect-coverage-gap     │
       │ map-dependencies        │
       │ construct-critique      │
       │ ...                     │
       └─────────────────────────┘
                    │
        specialized operators
                    │
       CLR / FMEA / RoB / Pareto
       causal intervention / power
       analysis / patent claims ...
```

也就是说：

**底部不是所有东西都必须变 generic。**

应该存在两种 SOP：

```text
high-reuse canonical primitives
+
irreducible specialized scientific operators
```

HTML 里现在已经开始能明显看出这两类。

---

# 下一轮我认为应该做什么

我现在**不建议继续为了节点数字盲目从 175 往下砍**。

下一轮应该做一件更聪明的事：

### 对这 39 个 cross-family SOP 做中心性审计

例如现在：

```text
surface-assumptions
```

虽然实际上被四个 family 用，

它在 metadata 上仍然属于：

```text
INSIGHT
```

而：

```text
identify-variables
```

实际上被：

```text
HYPOTHESIS
STRESS
STRUCTURING
EXPERIMENT
```

共同使用，却仍挂在 HYPOTHESIS。

这已经说明：

**旧 package ownership 也开始变成历史包袱了。**

所以下一轮我想做：

```text
175 SOP
    ↓
identify cross-family hubs
    ↓
remove package ownership bias
    ↓
canonical basis vs specialized operators
    ↓
inspect remaining near-duplicate wrappers
    ↓
second compression
```

然后很可能继续从：

> **175 → 140~160 左右**

但我不会预设目标数字。

之后才应该进入真正非常关键的：

> **Capability-loss audit**

也就是逐个把旧 Campaign / Strategy 的能力拿出来问：

```text
旧 DARE 能做这件事吗？
        ↓
新 graph 是否存在一条合法路径实现？
        ↓
如果存在：PASS
如果没有：找出 capability hole
```

这一步做完之后，我们才有资格说：

> **四层 → 两层，而且没有明显能力损失。**

---

### 当前状态

**Pass 4：完成。**

**全局 cognitive basis：已经开始成形。**

**第二轮压缩：未完成。**

**能力无损审计：未完成。**

**最终 v4 graph：未完成。**

这一版你可以直接打开：

### [DARE v4 · Pass 4 — Cognitive Basis Compression](D:\YOGSOTH-AI\file-transfer\2026-08-20-21-47-dare-v4-two-layer-pass4.html)

你继续发一句 **“继续”** 就行。下一轮我就从这 **39 个 cross-family hubs** 开始，把 package ownership 真正拆掉，并进行第二轮 SOP basis compression。
````

## GPT-07

````bash
继续完成了。**Pass 5 已完成，整个重构还没有结束。**

### [打开 DARE v4 · Pass 5 — Shared Scientific Basis](sandbox:/mnt/data/dare-v4-two-layer-pass5.html)

这一轮和 Pass 4 最大的区别是：我开始真正把 **package ownership 拆掉**。现在 `BASIS` 只是可视化 metadata，**不是第三层**；执行层仍然只有：

```text
TACTIC
   ↓
SOP
```

SOP 只是额外被标记成：

```text
shared basis
or
specialized operator
```

### Pass 5 实际结果

|                  | Pass 4 |  Pass 5 |
| ---------------- | -----: | ------: |
| Tactic           |     52 |  **52** |
| SOP              |    175 | **164** |
| Shared-basis SOP |     39 |  **43** |
| Specialized SOP  |    136 | **121** |
| Tactic→SOP edges |    258 | **258** |
| Jump edges       |    112 | **112** |
| 总 edges          |    370 | **370** |
| provenance refs  |      — | **659** |

也就是说，这轮又净压掉 **11 个 SOP**，但图的连接能力没有缩水。

当前 repo 的 README 仍然明确把 DARE 定义成 Campaign→Strategy→Tactic→SOP 四层，而且强调严格逐层调用；同时当前 main 仍然把 Semantic Scholar、Brave、Tavily、AlphaXiv、Apify 等 MCP/tool integration 写进体系。([GitHub][1])

所以 Pass 5 已经开始与当前 v3 做非常明确的结构分叉。

---

### 这一轮我认为最成功的合并是 `score-object`

之前我们仍然有：

```text
score-candidate
score-gap-novelty
score-claim-strength
assess-obstacle-severity
```

看起来属于四种完全不同的科研动作。

但把 IO contract 拆开以后，其实都是：

```text
typed object
    +
explicit rubric
    +
evidence
    +
uncertainty
        ↓
rubric-conditioned scoring
        ↓
score + rationale + uncertainty
```

所以现在统一为：

```text
score-object
```

父 Tactic 决定 rubric：

```text
score-object(
    object = gap,
    rubric = [novelty, feasibility, impact, distance]
)
```

或者：

```text
score-object(
    object = claim,
    rubric = [evidence_quality, directness,
              independence, replication, defeaters]
)
```

或者：

```text
score-object(
    object = obstacle,
    rubric = [severity, overcomability,
              cost, blocking_effect]
)
```

现在 `score-object` 一下成为：

> **4 个 scientific families / 6 个 Tactics 共用的 primitive**

涉及：

```text
HYPOTHESIS
CONVERGENCE
DIRECTION
STRUCTURING
```

这就是我们一直想找的 scientific cognition basis。

但我没有因此把：

```text
score-fmea-risk
```

也吞进去。

因为 FMEA 有特殊风险语义和公式，它属于 **irreducible specialized operator**。

这条边界现在越来越清楚了。

---

### Evidence extraction 又发生了一次明显压缩

Pass 4 还有：

```text
extract-study-data
extract-performance-record
catalog-evaluation-conditions
```

我检查 provenance 时发现一个特别有力的证据：

旧 `score-extraction` 同时进入了前两个节点；

旧 `condition-cataloging` 同时进入了：

```text
extract-study-data
catalog-evaluation-conditions
```

也就是说，不只是语义看着像——**旧节点 provenance 本身已经重叠了。**

现在统一成：

```text
extract-evidence-record
```

输入一个 schema：

```text
schema:
  methods
  datasets
  metrics
  results
  conditions
  limitations
  provenance
  missing_fields
```

如果你正在做 benchmark audit，就用 benchmark schema。

如果正在读 scientific studies，就用 study schema。

如果正在建立 empirical baseline，就用 performance schema。

不再为不同的“表格列”创造不同 SOP。

---

### `define-success-criteria` 甚至不需要被“合并”

这个是另一个我觉得很重要的思想变化。

原来：

```text
define-success-criteria
```

似乎是一个独立 SOP。

但实际上：

```text
define success criteria
=
define criteria
+
set threshold
```

而：

```text
define-criteria
set-threshold
```

两个 primitive 都已经存在。

所以这次不是：

> A + B → 新 C

而是：

> **删除 C，因为 C 本来就是 A→B 的固定 composition。**

这可能会成为之后进一步压缩 DARE 的一个巨大来源。

很多旧 skill 可能不是 duplicate。

而是：

> **macro 被错误保存成 primitive。**

---

### `map-field-taxonomy` 也是同样的问题

原本它是一个独立 SOP：

```text
map-field-taxonomy
```

但底层实际上可以表达为：

```text
categorize-evidence
        ↓
canonicalize-entity
        ↓
construct-hierarchy
```

counts、maturity、boundary annotations 则属于 Tactic 的 output schema。

所以它也不再需要占一个 SOP。

这其实比语义 merge 更令人兴奋，因为我们开始发现：

> **旧 DARE 中一部分 SOP 根本不是 atomic。**

---

### 我还把两个“伪 cognitive SOP”拿掉了

```text
aggregate-findings
assemble-performance-table
```

现在分别成为：

```text
structured-red-team.output_contract
establish-empirical-baseline.output_contract
```

因为：

> “最后把结果整理成这个形状”

通常不应该再消耗一次完整 cognitive node。

尤其对未来 token cost 非常重要。

---

## 现在 43 个 shared basis 已经非常明显了

当前最强的一批 hub 包括：

```text
score-object
surface-assumptions
assess-sensitivity
define-analysis-dimensions
enumerate-dimension-values
identify-variables

detect-coverage-gap
define-criteria
aggregate-ranking
evaluate-compatibility

map-dependencies
construct-critique
design-mitigation
extract-causal-structure

validate-causal-link
identify-load-bearing-factors
analyze-temporal-trajectory
detect-contradiction
canonicalize-entity
inventory-reference-items
...
```

HTML 里我把这 **43 个 SOP 全部拉到最上面的 BASIS lane**。

不是说：

> AI 执行时先进入 BASIS。

完全不是。

只是为了让我们视觉上第一次看到：

> **九个 scientific capability families 背后到底共享了哪些认知操作。**

这是这一版图里我认为最值得看的地方。

---

## 我开始觉得最终 DARE 不应该再有“一个 SOP 属于哪个 package”这个概念

现在例如：

```text
surface-assumptions
```

被：

```text
INSIGHT
IDEATION
CONVERGENCE
STRUCTURING
```

共同使用。

`identify-variables` 被：

```text
HYPOTHESIS
STRESS
STRUCTURING
EXPERIMENT
```

共同使用。

所以再问：

> `surface-assumptions` 属于 deep-insight 还是 creative-ideation？

这个问题本身已经没有意义了。

更合理的是：

```yaml
name: surface-assumptions
kind: sop

input:
  object: claim | model | method | design | decision

output:
  assumptions: [...]

properties:
  shared: true
```

而 Tactic 自己决定怎么调用它。

这会让以后 package 重组容易非常多。

---

# 我觉得下一轮应该开始碰 Tactic 了

这是现在最关键的下一步。

我们到目前为止：

```text
900+ old skills

↓ four-layer elimination

52 Tactics
206 SOPs

↓ basis compression

52 Tactics
164 SOPs
```

但 **52 个 Tactic 本身还没有经历真正严格的 cross-family compression**。

而我已经看到一些非常可疑的组合。

比如：

```text
prioritize-research-gaps
multi-criteria-decision
narrow-research-direction
```

三者底层大量共享：

```text
define-criteria
score-object
aggregate-ranking
assess-sensitivity
```

区别其实是 object schema。

这意味着它们可能不是三个独立的 scientific algorithm。

也可能是一个：

```text
rank-candidates
```

Tactic 的三个 preset。

类似：

```text
validity-envelope-analysis
boundary-stress-test
```

也存在相当明显的共同 kernel：

```text
define-analysis-dimensions
enumerate-dimension-values
apply-perturbation
detect-breakpoint
construct-validity-envelope
```

究竟应该：

> 保留两个 Tactic，因为 scientific intent 不同

还是：

> 合成一个参数化 Tactic

现在值得认真审计。

还有一个很典型的：

```text
synthesize-north-star
    ↓
crystallize-north-star
```

现在是整个图里唯一明显的 **one-Tactic → one-SOP wrapper**。

这几乎肯定应该再处理。

---

所以我建议 **Pass 6 开始做 Tactic compression，而不是继续抠 SOP 数字**。

同时开始第一版：

> **capability-loss audit**

即每处理掉一个旧 Tactic / Campaign / Strategy，不再只看 provenance，而是问：

```text
旧能力：
“能否做 X？”

↓ compile

新 graph：
是否存在一条合法执行路径实现 X？

YES → covered
PARTIAL → semantic loss
NO → capability hole
```

这样我们接下来压 Tactic 才不会失控。

### 当前状态

**SOP basis 第一轮、第二轮压缩：基本成形。**

**Tactic compression：尚未正式开始。**

**capability-loss audit：下一轮开始。**

**最终 v4 graph：未完成。**

你可以先打开 Pass 5：

### [DARE v4 · Pass 5 — Shared Scientific Basis](D:\YOGSOTH-AI\file-transfer\2026-08-20-22-00-dare-v4-two-layer-pass5.html)

下一条继续发 **“继续”** 即可。下一轮我开始对这 **52 个 Tactic 本身做 equivalence / preset / wrapper 审计**，同时建立第一份旧四层→新两层的 capability coverage matrix。

[1]: https://github.com/yogsoth-ai/de-anthropocentric-research-engine/tree/main "GitHub - yogsoth-ai/de-anthropocentric-research-engine: 900+ pure-markdown skills for autonomous AI research, organized as 9 freely-composable packages over a 4-layer hierarchy (Campaign → Strategy → Tactic → SOP). Non-linear orchestration with backtracking, 6 MCP integrations. The AI is the researcher — you set the direction. · GitHub"
````

## GPT-08

````bash
继续完成了。**Pass 6 已结束，但整个重构还没结束。**

### [打开 DARE v4 · Pass 6 — Tactic Compression + Capability Audit](sandbox:/mnt/data/dare-v4-two-layer-pass6.html)

这一轮第一次正式压 **Tactic 层**，而且开始做真正的 capability-loss audit。

当前程序实际验证的数据：

|                  | Pass 5 |   Pass 6 |
| ---------------- | -----: | -------: |
| Tactic           |     52 |   **44** |
| SOP              |    164 |  **169** |
| Tactic→SOP edges |    258 |  **246** |
| Jump edges       |    112 |  **112** |
| 总 edges          |    370 |  **358** |
| Capability audit |      — | **26 项** |
| Audit 中发现并恢复的能力  |      — |  **5 项** |

注意 SOP 从 164 反而涨到了 169。

这是**好事**。

因为如果我们只追求：

> 900 → 500 → 200 → 100

那现在已经开始真的会误删科研能力了。

---

## 这一轮真正压掉了 8 个 Tactic

第一批形成了 5 个新的 cross-cutting Tactic。

### 1. `rank-candidates`

吞掉：

```text
prioritize-research-gaps
multi-criteria-decision
narrow-research-direction
```

现在它不关心你排名的是：

```text
gap
research direction
method
candidate hypothesis
generic option
```

而是：

```text
typed candidates
    ↓
constraints
    ↓
criteria
    ↓
scoring
    ↓
weighting
    ↓
aggregation
    ↓
sensitivity
```

不同的是参数：

```text
object_schema = gap | direction | generic
decision_mode =
    best
    full-ranking
    category
    veto
    rapid-triage
    stakeholder-weighted
```

旧 convergence 里的 best-option、full-ranking、category-sorting、non-compensatory screening 本来就在共享 scoring matrix kernel；这一点在原图里也非常明显。

但是我**没有**把：

```text
pairwise-ranking
portfolio-optimization
```

也吞进去。

因为 pairwise 是一个：

```text
select pair
→ judge
→ update latent state
→ check convergence
```

的动态系统；

portfolio 又是在选**子集**而不是给单个对象排序。

所以：

```text
rank-candidates
   ├── jump → pairwise-ranking
   └── jump → portfolio-optimization
```

这是我觉得比较健康的抽象边界。

---

## 2. `map-validity-envelope`

吞掉：

```text
validity-envelope-analysis
boundary-stress-test
```

这个合并我现在认为 confidence 非常高。

旧 deep-insight 的定义本来就是：

> 多轴扰动 → degradation curve → multidimensional validity envelope。

旧 stress-test 又有：

> parameter space → extreme values → breakpoint → validity envelope。

所以区别其实只是：

```text
sampling policy
```

一个做：

```text
systematic perturbation
```

一个做：

```text
extreme / boundary perturbation
```

现在：

```text
map-validity-envelope(
    mode = systematic | boundary | critical-case
)
```

---

# 但这个合并直接让 capability audit 抓出了第一个真 bug

旧 stress-test 里还有：

```text
critical-case-design
```

而且不是普通 boundary test。

它明确是：

> Flyvbjerg most-likely / least-likely critical-case selection，用案例选择最大化推断力。

我检查 Pass 5：

**这个能力已经没了。**

所以这一轮我没有说：

> “boundary-stress-test 已经包含它，大概差不多。”

而是恢复一个新的 SOP：

```text
select-critical-case
```

contract 大概是：

```text
input:
    claim / theory
    candidate cases
    inferential objective

transform:
    identify cases where
    confirmation/refutation has maximum inferential leverage

mode:
    most-likely
    least-likely
    decisive
    extreme-deviant

output:
    selected case
    selection rationale
    inferential implication
```

然后挂进：

```text
map-validity-envelope
```

这就是我觉得 capability audit 开始真正发挥价值的地方。

---

# 3. `explore-dimensional-space`

吞掉：

```text
morphological-search
map-dimensional-research-space
```

共同 kernel：

```text
define dimensions
    ↓
enumerate values
    ↓
enumerate combinations
    ↓
compatibility filtering
```

然后根据 mode：

### Morphological generation

```text
→ viable combinations
→ ideas
```

### Research-space analysis

```text
→ occupancy
→ coverage gap
→ ranking
→ subquestions
```

所以现在：

```text
explore-dimensional-space(
    mode =
      morphological-generation
      research-space-mapping
      gap-mapping
)
```

我觉得这个很符合我们最早说的：

> 人类叫 morphological analysis 和 dimensional research mapping，
> AI 看底层 transformation，其实是同一种 combinatorial-space operation。

---

# 4. `adversarial-deliberation`

吞掉：

```text
adversarial-debate
steelman-validation
```

统一 kernel：

```text
critique
  ↓
defense
  ↓
cross-examine
  ↓
adjudicate
```

不同的是 target：

```text
claim
winner
rejected candidate
criteria
stakeholder perspective
counter-thesis
```

旧 convergence 里的 steel-manning 本来就包含：

* resurrection advocacy
* winner stress testing
* criteria interrogation
* stakeholder objection simulation
* counter-thesis construction 

这些其实不需要五个 Strategy。

现在：

```text
adversarial-deliberation(
    target = winner,
    mode = winner-stress
)
```

或者：

```text
adversarial-deliberation(
    target = criteria,
    perspective = stakeholder-X
)
```

而且：

**完全不规定到底要不要 spawn agent。**

一个模型 role-play、五个 agents、未来 swarm，全属于 runtime。

---

# 5. `analyze-constraints-readiness`

这是这一轮压得最大胆的一个。

吞掉：

```text
feasibility-readiness
analyze-direction-obstacles
analyze-research-constraints
```

因为三者其实都在回答：

> **为什么目标目前不能成功，以及什么改变能解除阻塞？**

只是深度不同。

现在变：

```text
analyze-constraints-readiness
```

有几个 mode：

```text
obstacle-triage

readiness-assessment

resource-envelope

causal-constraint-analysis

maturation-path
```

于是：

```text
research direction 卡在哪
```

和：

```text
experiment implementation 卡在哪
```

不再因为发生在不同 Campaign 就制造两套近似方法。

---

# North Star 的 one-SOP wrapper 也终于删了

Pass 5：

```text
synthesize-north-star [TACTIC]
        ↓
crystallize-north-star [SOP]
```

这显然很可疑。

一个 Tactic：

* 没分支
* 没循环
* 没组合
* 只调用一个 SOP

基本就是人为包装层。

所以 Pass 6 里：

```text
❌ synthesize-north-star Tactic
```

消失。

`crystallize-north-star` 直接成为：

```text
decompose-research-goal
    ...
    ↓
crystallize-north-star
```

的可选 tail operation。

---

# 更重要的是：audit 又抓到了另外 4 个被我们之前压没的东西

加上 `select-critical-case`，一共 **5 个 restored SOP**。

### `update-pairwise-rating`

旧 convergence 明确有：

```text
dynamic-tracking
```

支持：

```text
Elo
Glicko-2
TrueSkill2
WHR
```

以及候选动态进出、连续更新 rating。

但 Pass 5 的：

```text
pairwise-ranking
```

虽然文字写着：

> update ratings

实际上 calls 里根本没有 rating-update operator。

所以恢复：

```text
update-pairwise-rating
```

---

### `calibrate-probability-forecast`

旧 structured consensus 不只有 Delphi consensus。

还有：

```text
futures-calibration
```

明确处理：

> probabilistic forecasting / Real-Time Delphi / prediction market。

而：

```text
generic consensus
```

和：

```text
probability calibration
```

不是一回事。

所以恢复：

```text
calibrate-probability-forecast
```

---

### `measure-portfolio-diversity`

旧 portfolio optimization 有：

```text
diversity-maximization
```

而且是：

> MAP-Elites / niche coverage / maximum dispersion。

Pareto frontier 并不会自动保持这个能力。

所以恢复：

```text
measure-portfolio-diversity
```

---

### `evaluate-optionality`

旧 portfolio 还有：

```text
temporal-sequencing
```

里面明确包含：

> Real Options / staged investment / dependency sequencing。

Pass 5 只剩 scenario stress，并没有真正的 option-value semantics。

所以恢复：

```text
evaluate-optionality
```

用于：

```text
delay
stage
reversible commitment
information-gathering option
exercise trigger
```

---

# 所以这一轮给了我们一个非常重要的方法论

现在不能再认为：

> **压缩率越高越好。**

真正目标应该变成：

> **Minimum Description Length under Capability Preservation**

也就是：

```text
尽可能少的 Tactic
+
尽可能少的 SOP
+
仍然可以生成旧 DARE 的全部有效科研行为
```

所以：

```text
Pass 5:
52 Tactic
164 SOP

Pass 6:
44 Tactic
169 SOP
```

我认为 Pass 6 **反而比一个 44 / 140 的结果更可信**。

因为它承认：

> 我们之前确实压错了一些地方。

---

## HTML 里现在多了一个非常重要的新页签

右边有：

### `Tactic merges`

看：

```text
old tactics
→
new tactic
→
parameterized modes
→
为什么能合并
```

以及：

### `Capability audit`

目前第一批 **26 条**：

```text
COVERED_MODE
COVERED_JUMP
COVERED_INLINE
RESTORED
```

例如：

```text
stress/critical-case-design

RESTORED
→ map-validity-envelope
  + select-critical-case
```

或者：

```text
hypothesis/gap-prioritization

COVERED_MODE
→ rank-candidates(object=gap)
```

所以现在我们已经不只是画一个漂亮的新 graph。

开始建立：

> **旧 DARE capability → 新 DARE execution path**

的可审计映射了。

---

# 下一轮我反而建议暂时不要继续压

我现在想让 **Pass 7 主要做 capability audit**。

因为这一轮已经证明：

> 当前中间架构里确实存在隐藏的 capability holes。

下一步我想系统扫：

```text
old Campaign
old Strategy
old Tactic
         ↓
semantic capability contract
         ↓
new graph reachable path
```

尤其重点扫：

```text
deep-insight
stress-test
creative-ideation
convergence
hypothesis-formation
```

然后分类：

```text
FULLY COVERED

COVERED AS MODE

COVERED BY MULTI-TACTIC PATH

MOVED TO RUNTIME

REMOVED AS TOOL COUPLING

CAPABILITY HOLE
```

**先把 hole 找全，再继续压。**

我现在觉得这是比立刻：

> 44 → 35 Tactic

更正确的下一步。

### 当前状态

**Tactic compression 第一轮：完成。**

**Capability audit 第一批：完成 26 项。**

**发现并恢复能力：5 项。**

**全量 capability audit：未完成。**

**最终 v4 graph：未完成。**

你可以直接看这一版：

### [DARE v4 · Pass 6 — Tactic Compression + Capability Audit](D:\YOGSOTH-AI\file-transfer\2026-08-21-21-09-dare-v4-two-layer-pass6.html)

下一条继续发一句 **“继续”** 就行。Pass 7 我会优先做**旧体系能力全量审计**，不急着继续砍节点。
````

## GPT-09

````bash
继续完成了。**Pass 7 已结束，但整个重构还没结束。**

### [打开 DARE v4 · Pass 7 — Capability Preservation Audit](sandbox:/mnt/data/dare-v4-two-layer-pass7.html)

这一轮和前几轮性质不同：**我停止追求继续减少节点，开始把旧 DARE 当成 capability specification，反向检查新图到底漏了什么。**

结果证明这一步非常必要。

### Pass 7 实际结果

|                     | Pass 6 |  Pass 7 |
| ------------------- | -----: | ------: |
| Tactic              |     44 |  **50** |
| SOP                 |    169 | **207** |
| Tactic→SOP          |    246 | **302** |
| Jump                |    112 | **137** |
| 总 edge              |    358 | **439** |
| Capability audit    |     26 |  **92** |
| 新恢复 Tactic          |      — |   **6** |
| 本轮新恢复 SOP           |      — |  **38** |
| 当前 Shared Basis SOP |      — |  **44** |

我还重新做了程序化完整性检查：

```text
duplicate node ID   0
dangling edge       0
orphan SOP          0
zero-call Tactic    0
duplicate jump      0
```

JS 本身也通过了语法检查。

所以这版图至少在结构上是闭合的。

---

## 这一轮最大的发现：Pass 6 确实压过头了

尤其两个区域。

### 1. Creative Ideation

我们之前把很多东西压成：

```text
analogical-discovery
explore-dimensional-space
destructive-ideation
structural-transformation
coverage-white-space-search
```

看起来非常漂亮。

但是重新对照旧 Creative Ideation graph 后发现，有些东西**不是这些 primitive 的换皮**。

所以我恢复了 5 个真正独立的 Tactic：

```text
resolve-inventive-contradiction
biomimetic-transfer
conceptual-blending
force-perspective-shift
evolve-solution-population
```

例如 TRIZ。

之前我们实际上隐含认为：

```text
TRIZ
≈
decompose component
→ transform component
→ evaluate
```

这个不成立。

TRIZ 真正特殊的是：

```text
identify inventive contradiction
        ↓
technical / physical contradiction
        ↓
select inventive principle
        ↓
apply separation principle
        ↓
transform
```

所以恢复：

```text
identify-inventive-contradiction
select-inventive-principle
apply-separation-principle
```

这三个 SOP。

---

Biomimicry 也是一样。

普通：

```text
abstract
→ analogy
→ transfer
```

不能完整表达：

```text
biologize problem
      ↓
discover biological analogue
      ↓
extract biological causal strategy
      ↓
transfer
```

所以恢复：

```text
biologize-problem
discover-biological-analog
extract-biological-strategy
```

以及新的：

```text
biomimetic-transfer [Tactic]
```

---

Conceptual Blending 也是一个很明显的 hole。

```text
enumerate combinations
```

并不等于：

```text
construct input spaces
       ↓
extract generic space
       ↓
selective projection
       ↓
simulate emergent properties
```

所以恢复：

```text
conceptual-blending
```

而不是继续让 morphological search 冒充它。

---

## 2. Deep Insight 之前也压得明显过头

例如 sensitivity。

Pass 6 有：

```text
sensitivity-analysis
    ↓
apply-perturbation
assess-sensitivity
identify-load-bearing-factors
```

这个适合一般 sensitivity。

但是原 DARE 还有：

```text
Morris screening
        ↓
Sobol decomposition
```

它回答的是：

> 全局 variance 到底由谁贡献？
> interaction contribution 是多少？

这不是简单 perturbation。

所以恢复：

```text
decompose-global-sensitivity
```

---

另外还有：

```text
propagate-uncertainty
```

用于 Monte-Carlo / distribution propagation：

```text
uncertain inputs
      ↓
propagate
      ↓
output distribution
      ↓
tail / uncertainty contribution
```

以及：

```text
quantify-information-value
```

用于：

```text
EVPI / EVSI
```

回答：

> **下一个最值得花钱搞清楚的不确定性是什么？**

这个我尤其觉得值得保留。

因为它非常适合未来 AI-native research：

```text
1000 个 unknowns

→ uncertainty
→ sensitivity
→ value of information

→ 决定下一个实验 / 阅读 /计算
```

这是很强的科研决策 primitive。

---

# Stakeholder research 也重新回来了

Pass 6 的 `problem-reframing` 太 generic，无法真正覆盖原来的：

```text
Critical Systems Heuristics
Jobs-to-be-Done
Stakeholder Salience
```

所以新增：

```text
map-stakeholder-system [Tactic]
```

下面有：

```text
assess-system-boundary
construct-perspective-set
map-stakeholder-jobs
classify-stakeholder-salience
```

这让我意识到：

> **不是所有 anthropocentric method 都应该被删。**

我们要删的是：

> 人类为了管理复杂度而创造的冗余包装结构。

不是：

> 人类已经发现的不可约认知操作。

比如 stakeholder salience 本身仍然有 information content。

---

# Stress Test 又恢复了一批非常有价值的操作

新增：

```text
calibrate-adversarial-confidence
trace-assumption-cascade
search-minimal-flip
evaluate-necessity-sufficiency
validate-mitigation-effect
```

其中我尤其喜欢：

### `search-minimal-flip`

不是普通：

```text
construct counterfactual
```

而是：

> 找到**最小的改变**，使结论发生翻转。

例如：

```text
Conclusion = True

parameter x:
0.82 → 0.79

Conclusion = False
```

这个：

```text
minimal perturbation → conclusion flip
```

本身就是非常独立、有科学价值的 operation。

---

### `trace-assumption-cascade`

也不是：

```text
challenge assumption
```

而是：

```text
Assumption A fails
       ↓
Claim C invalid
       ↓
Method D unjustified
       ↓
Result E unsupported
       ↓
Decision F changes
```

这和你以后想做大规模 atomized research graph 很搭。

---

# Knowledge Acquisition 也发现了一个我们之前差点犯的错误

我们决定把：

```text
paper-search
web-search
AlphaXiv
Semantic Scholar
Brave
Tavily
...
```

全部删掉，这个决定我依然认为正确。

但是：

```text
citation chaining
PRISMA screening
```

**不是工具基础设施。**

它们是 scientific evidence methodology。

所以恢复：

```text
trace-citation-neighborhood
screen-evidence-multistage
```

例如：

```text
trace-citation-neighborhood
```

只定义：

```text
seed evidence
     ↓
forward / backward relationships
     ↓
relevance
     ↓
new evidence
     ↓
saturation
```

完全不说：

> 用 Semantic Scholar API。

AI 想用：

```text
AlphaXiv
OpenAlex
Semantic Scholar
Google Scholar
Perplexity
browser
```

全都可以。

这正好是我们想要的 **tool-decoupled scientific method**。

---

# 其他重要恢复

Patent：

```text
analyze-patent-citation-network
```

Benchmark：

```text
probe-benchmark-artifact
```

Meta-analysis：

```text
update-cumulative-evidence
```

Portfolio：

```text
evaluate-regret-robustness
```

Feasibility：

```text
apply-stage-gate
```

Ideation：

```text
inject-random-stimulus
build-concept-fan
inject-extreme-constraint
```

这些都不是为了“把旧 skill 名字保下来”。

而是我重新检查后发现：

> **新图不存在能够等价实现这个 transformation contract 的路径。**

所以恢复。

---

# Capability audit 现在第一次有点像样了

Pass 7 HTML 的第三个 tab 现在有 **92 项**。

按照这些状态分类：

```text
FULLY_COVERED         33
COVERED_MODE          19
COVERED_MULTI_PATH     6
COVERED_INLINE         1

RESTORED              27

MOVED_RUNTIME          4
REMOVED_TOOLING        2
```

这里非常重要的两个状态：

### MOVED_RUNTIME

不是 capability loss。

例如：

```text
context checkpoint
budget
critical-path scheduling
agent dispatch
execution monitoring
```

意思是：

> DARE scientific graph 不负责，但 host runtime 可以负责。

---

### REMOVED_TOOLING

例如：

```text
web-search
paper-search
wiki graph storage
provider-specific retrieval
```

我们是**有意删除**。

不是忘记迁移。

---

## 所以现在我对 v4 的目标定义已经更准确了

不是：

> **Compress DARE as much as possible.**

而应该是：

> **Find the minimum generative scientific cognition graph whose reachable behaviors subsume the scientifically meaningful capabilities of DARE v3.**

也就是：

```text
Old DARE
900+ human-method skills
        ↓
identify real capability contracts
        ↓
remove hierarchy wrappers
remove runtime
remove tooling
merge equivalent transformations
        ↓
preserve irreducible scientific operators
        ↓

Tactics
+
Canonical / Specialized SOPs
+
Free transition graph
```

这比单纯追求：

```text
900 → 100
```

健康得多。

---

# 当前 50 Tactic / 207 SOP 不要把它当最终数字

Pass 7 是故意：

> **宁可多恢复，也不要漏能力。**

下一阶段我们再从 capability-preserved representation 重新压。

因此很可能：

```text
Pass 6       44 / 169
             ↑ 太激进

Pass 7       50 / 207
             ↑ coverage correction

Final         ? / ?
```

最终数字可能重新落到：

```text
~45 Tactics
~170–190 SOPs
```

也可能不是。

我现在不会为了符合预期强行给它压回去。

---

# 还有多少 Pass？

按照现在进度，我估计：

## **还需要 3 个必需 Pass，最多 4 个。**

也就是大概率 **Pass 10 收口**。

### Pass 8 — Full capability closure

继续做现在这件事，但深入到：

```text
Strategy
Tactic
high-information SOP
```

而不仅是 Campaign/Strategy 层。

重点：

* 继续找残余 capability hole
* 检查 restored operators 是否其实还能重新合并
* 把 92 条 audit 扩成更完整的 coverage matrix
* 得到一个 **coverage-complete candidate**

这一步之后原则上应该：

> 不再发现明显科学能力缺失。

---

### Pass 9 — Graph optimization

不再看旧 DARE 名字。

只看新的：

```text
50 Tactics
207 SOPs
439 edges
```

开始做：

```text
redundant edge
duplicate path
unnecessary jump
one-SOP wrapper
fixed composition
Tactic kernel overlap
SOP IO-contract overlap
```

然后重新压缩。

同时定义：

```text
Tactic contract
SOP contract
jump semantics
state handoff semantics
```

这一步会开始接近真正 v4 架构。

---

### Pass 10 — Candidate Final Architecture

产出最终版：

```text
DARE v4
Tactic → SOP
```

HTML 里完整包含：

* final graph
* Tactic detail
* SOP detail
* calls
* jumps
* old provenance
* old→new mapping
* removed tooling
* moved runtime
* capability audit
* compression rationale
* migration recommendations

并给你一个真正可以用于：

> **照着重构 GitHub repo**

的目录/schema/metadata 方案。

到这里我认为“架构设计阶段”就可以结束。

---

### Optional Pass 11

如果你还希望我继续帮你验证：

> **AI 实际会不会正确使用这个新图？**

那再做一个小型：

```text
routing probe
state replay
synthetic research state test
```

不跑昂贵的完整 research。

这属于验证阶段，而不是结构设计必需步骤。

所以：

> **架构方案预计还剩 3 Pass。**
>
> **如果连第一轮行为验证算进去，则最多还剩 4 Pass。**

当前这版可以直接看：

### [DARE v4 · Pass 7 — Capability Preservation Audit](D:\YOGSOTH-AI\file-transfer\2026-08-21-21-21-dare-v4-two-layer-pass7.html)

下一条继续发 **“继续”**，我就进入 **Pass 8：Full Capability Closure**。
````

## GPT-10

````bash
继续完成了。**Pass 8 已结束，现在已经到了我认为可以称为 “coverage-complete candidate” 的阶段。**

### [打开 DARE v4 · Pass 8 — Full Capability Closure](sandbox:/mnt/data/dare-v4-two-layer-pass8.html)

这一轮的实际数据：

|                      | Pass 7 |  Pass 8 |
| -------------------- | -----: | ------: |
| Tactic               |     50 |  **55** |
| SOP                  |    207 | **229** |
| Shared-basis SOP     |     44 |  **44** |
| Tactic→SOP           |    302 | **334** |
| Jump                 |    137 | **170** |
| 总 edge               |    439 | **504** |
| Capability contracts |     92 | **146** |
| 本轮恢复 Tactic          |      — |   **5** |
| 本轮恢复 SOP             |      — |  **22** |

完整性检查结果仍然是：

```text
duplicate node ID     0
dangling contains     0
dangling jump         0
duplicate jump        0
zero-call Tactic      0
orphan SOP            0
JS syntax error       0
```

所以目前 graph 数据本身是闭合的。Headless Chromium 的截图 QA 因浏览器进程超时没有完成，所以这一轮我确认的是**结构和 JS 完整性**，不是说视觉布局已经最终定稿。

---

## Pass 8 最大的收获：我们之前确实漏掉了一个完整的现代 DARE 能力块

我重新读取当前 `main` 的 `stress-test.json` 后发现，它现在已经存在：

```text
falsification-first-stress-test [Campaign]
```

而且这个东西不是普通 stress-test 的重命名。

它把目标从：

> artifact 能否扛住攻击？

彻底反过来：

> **能不能用最低成本把这个 claim 证伪？**

判决甚至明确变成：

```text
BROKEN
CORROBORATED
UNFALSIFIABLE
```

其中 **UNFALSIFIABLE 反而是最差结果**，而且明确取消 resilience score / hardening。当前原图还为它单独定义了 isomorphism falsification、circular validation audit、independent convergence audit 和 elegance trap probe。

这个东西特别符合你现在 DARE 的方向，所以不能被：

```text
adversarial-deliberation
structured-red-team
```

简单吞掉。

Pass 8 因此恢复了 5 个 Tactic：

```text
falsification-first-audit

audit-structural-equivalence

audit-validator-independence

audit-convergence-independence

audit-explanatory-compression
```

它们下面增加了一组真正不可约的 scientific operators。

例如结构同构不是：

```text
abstract
→ map analogy
→ 看起来很像
```

而现在变成：

```text
extract-structural-mapping
        ↓
test-structure-preservation
        ↓
generate-counterexample
        ↓
downgrade-equivalence-claim
```

也就是说：

```text
isomorphism
    ↓ fail
substructure
    ↓ fail
homomorphism
    ↓ fail
shared invariant
    ↓
analogy
```

**主动把 claim 降到真正能辩护的强度。**

我认为这个非常值得留。

---

## `circular-validation-audit` 也不能被普通 validity audit 代替

现在恢复为：

```text
audit-validator-independence
        ↓
enumerate-validator-assumptions
        ↓
build-noncircularity-matrix
        ↓
detect-pass-by-construction
```

它问的不是：

> benchmark 设计得好吗？

而是：

> **你的 validator 是不是因为偷偷继承了 theory 本身的假设，所以它天然只能 PASS？**

这是完全不同的 epistemic failure。

当前原 DARE 对这个能力的定义也明确是 theory claim × validator assumption 的 non-circularity matrix，专门抓 `PASS-by-construction`。

这个我觉得甚至会成为未来 DARE 很有辨识度的能力。

---

## independent convergence 也重新定义清楚了

以前：

```text
5 个方法都得到结果 X
→ evidence 很强
```

现在可以：

```text
identify-shared-priors
        ↓
共享 dataset?
共享 framing?
共享 model?
共享 prompt?
共享 literature?
共享 theory assumption?
        ↓
estimate-effective-evidence-count
```

于是：

```text
nominal N = 8

effective N = 2.3
```

这和普通 consensus 完全不是一个东西。

所以：

```text
structured-consensus
      ↕ jump
audit-convergence-independence
```

两个都留下。

---

# Hypothesis Formation 也修正了一个我之前的错误

Pass 7 我把：

```text
deductive
inductive
abductive
```

都简单写成：

```text
formulate-hypotheses(mode=...)
```

现在重新读原图后发现这个结论太乐观了。

原 DARE 的 abductive path 很明确：

```text
anomaly-characterization
        ↓
explanation-generation
        ↓
plausibility-ranking
```

inductive path 又明确要求：

```text
Observe patterns
→ Extract regularity
→ Generalize cautiously
→ Testable claim
```

而 Pass 7 当时实际上只有：

```text
identify-theory
extract-causal-structure
identify-variables
specify-relationship
```

这基本只是 deductive kernel。

所以 Pass 8 增加：

```text
characterize-anomaly

extract-empirical-regularity
```

但没有机械把旧三个 SOP 全恢复。

因为原来的：

```text
explanation-generation
```

其实已有：

```text
generate-competing-hypotheses
```

可以表达；

而：

```text
plausibility-ranking
```

又可以编译成：

```text
score-object(
    object = explanation,
    rubric = [
        evidence consistency,
        simplicity,
        explanatory scope,
        testability
    ]
)
```

于是新的 abductive pipeline 变成：

```text
characterize-anomaly
        ↓
generate-competing-hypotheses
        ↓
score-object(plausibility)
        ↓
falsifiability-audit
```

这就是我希望最终 DARE 呈现出来的压缩方式：

> **能力恢复，但不恢复旧组织形式。**

---

## Research Question 也补了 scope calibration

原图的 `scope-calibration` 明确存在 zoom in/out；Pass 7 只有一个 generic `assess-question-quality`，并不能真正改变问题粒度。

所以增加：

```text
adjust-question-scope
```

可以沿：

```text
population
mechanism
context
outcome
timescale
abstraction
```

缩放。

而且它可以和 Deep Insight 这轮恢复的：

```text
shift-abstraction-level
```

直接跳转：

```text
shift-abstraction-level
        ↓
adjust-question-scope
```

---

# Deep Insight 又补了两个小而重要的 primitive

原图里：

```text
tension-mining
→ evaporating-cloud
→ polarity-mapping
```

并且 `polarity-mapping` 明确说的是：

> **不可解张力应该管理，而不是解决。**

这和：

```text
detect contradiction
→ solve contradiction
```

不是一件事。

所以恢复：

```text
map-productive-polarity
```

同时原来的 `abstraction-laddering` 明确要求：

```text
Why ↑ ↑ ↑
       current question
How ↓ ↓ ↓
```

寻找最有生产力的研究层次。

所以恢复：

```text
shift-abstraction-level
```

但：

```text
HMW formulation
Socratic probing
Evaporating Cloud
```

我没有全部恢复。

因为可以分别编译为现有 primitive 的 mode/path。

---

# Patent 和 Experiment 也补到了真实缺口

Patent 原来的 `claim-analysis` 明确不只是：

```text
parse claim
check legal status
```

还要求评：

> protection breadth / vulnerability。

因此新增：

```text
assess-patent-claim-scope
```

而 experiment 的 stress scenario 原图也明确有：

```text
worst-case-construction
```

要求：

```text
extreme-but-plausible
breaking point
failure cascade
recovery
```

不是普通 `construct-scenario` 能完全覆盖的。

所以恢复：

```text
construct-worst-case-scenario
```

---

## 还有一个很有意思的是 Convergence

新增：

```text
collect-independent-judgments
```

因为：

```text
pairwise-ranking
```

和：

```text
多个 evaluator 在彼此看不到答案的情况下独立投票
→ social choice aggregation
```

不是同一能力。

因此现在可以：

```text
collect-independent-judgments
        ↓
aggregate-ranking(
    rule = Condorcet | Schulze | Borda | ...
)
```

其中 social-choice 算法本身不用每个创建 SOP：

```text
rule = ...
```

参数化即可。

---

# Capability Matrix 现在从 92 条扩成了 146 条

当前分类：

```text
FULLY_COVERED          48

COVERED_MODE           28

COVERED_MULTI_PATH     20

COVERED_INLINE          2

RESTORED               41

MOVED_RUNTIME           5

REMOVED_TOOLING         2
```

最重要的是：

```text
REVIEW / UNKNOWN = 0
```

当然这不能数学上证明：

> 900+ 个旧 skill 的任何可能行为都 100% 保存。

我们还没有逐句证明每个 Markdown 文件。

但对于这几轮从主要 graph JSON 中抽出来的 **146 个高信息 scientific capability contracts**，目前已经没有一个我明知：

> “这个好像没有，但先算 covered 吧。”

的东西。

所以我会把 Pass 8 定义为：

> **coverage-complete candidate**

而不是最终架构。

---

# 而现在有一个非常明显的现象

节点回到了：

```text
55 Tactic
229 SOP
```

但是我反而比：

```text
44 Tactic
169 SOP
```

那版更满意。

因为现在我们终于有一个比较安全的“上界”。

前面过程其实是：

```text
Old DARE
900+

↓ 第一轮编译

52 / 206

↓ aggressive compression

52 / 164

↓ tactic compression

44 / 169

↓ capability audit

50 / 207

↓ full closure

55 / 229
```

这不是越做越失败。

而是：

```text
压缩
↓
发现语义边界
↓
恢复
↓
建立 capability-complete representation
```

接下来才有资格重新优化。

---

# 还剩多少 Pass？

我现在依然维持上一轮判断，而且确定性更高了：

## **还剩 2 个必须 Pass。**

Pass 9 会是 **Graph Optimization**。

这次不再继续看：

```text
Campaign A
Strategy B
```

而把旧 DARE 暂时忘掉，只看现在的：

```text
55 Tactics
229 SOPs
504 edges
```

专门找：

```text
one-SOP wrapper
fixed composition
duplicate paths
redundant jumps
same-kernel Tactics
SOP contract overlap
over-specialized restored SOP
unnecessary call edges
```

这一次可以放心重新压，因为 **146 条 capability contracts 会作为 regression test**。

也就是说，每做一次 merge：

```text
graph before
    ↓ compression
graph after
    ↓
run capability coverage check
```

不能通过就撤销。

---

**Pass 10** 就会做 Candidate Final Architecture。

那一轮我准备给你的不再只是一个“分析中的 graph”，而是接近可以真正开始改 GitHub repo 的：

```text
final Tactic list
final SOP list

calls
jumps

Tactic schema
SOP schema

old → new migration map

runtime boundary
tool boundary

directory proposal
frontmatter proposal

capability coverage matrix

final interactive HTML
```

也就是说：

> **Pass 10 结束后，这一阶段的架构设计工作就可以收口。**

如果之后你还想验证：

> AI 看见这个新 DARE 后到底会不会正确 route？

那再有一个可选：

**Pass 11 — routing/state-replay probe**

但它不是当前架构设计的必需 Pass。

所以现在：

> **还剩 2 个必须 Pass。**
>
> **如果把第一轮廉价行为验证也算上，则最多还剩 3 个。**

当前完整版本：

### [DARE v4 · Pass 8 — Full Capability Closure](D:\YOGSOTH-AI\file-transfer\2026-08-21-22-35-dare-v4-two-layer-pass8.html)

下一条继续发 **“继续”**，我就进入 **Pass 9：Graph Optimization**。
````

## GPT-11

````bash
Pass 9 完成了。现在已经非常接近收口。

### [打开 DARE v4 · Pass 9 — Graph Optimization](sandbox:/mnt/data/dare-v4-two-layer-pass9.html)

这一轮的真实结果：

|                      | Pass 8 |  Pass 9 |
| -------------------- | -----: | ------: |
| Tactic               |     55 |  **51** |
| SOP                  |    229 | **216** |
| Shared-basis SOP     |     44 |  **45** |
| Tactic→SOP edge      |    334 | **317** |
| Jump edge            |    170 | **157** |
| 总 edge               |    504 | **474** |
| Capability contracts |    146 | **146** |

结构检查仍然通过：

```text
duplicate node ID    0
dangling contains    0
dangling jump        0
orphan SOP           0
zero-call Tactic     0
duplicate jump       0
JS syntax error      0
```

浏览器 headless screenshot 仍然因为当前环境里的 Chromium 进程问题超时，所以我没有把“视觉渲染 QA 已完成”算进去；但 HTML DOM、JS 和 graph 数据都验证过了。

---

### 这一轮主要做了四类优化

第一类是 **Tactic → mode**。

例如：

```text
construct-competing-hypotheses
            ↓
formulate-hypotheses(mode=competing)
```

完整能力没有消失：

```text
generate-competing-hypotheses
→ design-discriminating-prediction
→ compare-hypotheses
```

仍然存在。

类似地：

```text
force-perspective-shift
            ↓
problem-reframing(mode=perspective-shift)
```

所以这两个 Tactic 消失了。

---

第二类是把真正不属于 scientific cognition 的东西继续赶出去。

这次正式移走：

```text
profile-research-context
```

它现在应该只是：

```text
ResearchContext {
    background
    resources
    hard_constraints
    intent
}
```

也就是说 DARE **读取 context**，不负责“怎么问用户、怎么收集 profile”。

还有：

```text
plan-experiment-implementation
```

也正式移到 runtime。

科学图负责：

```text
design-experiment
        ↓
[ host AI executes experiment ]
        ↓
analyze-experiment-results
```

至于中间是：

```text
Codex
Claude Code
SLURM
Docker
subagents
single agent
```

全部是 host 自己的事。

这和你最初要求的 MCP / agent 解耦现在已经形成统一原则了。

---

第三类是把 Pass 7/8 为了保 coverage 暂时恢复的节点，重新安全吸收到 canonical SOP。

例如：

```text
shift-abstraction-level
adjust-question-scope
```

现在合并成：

```text
adjust-abstraction-scope
```

它既可以：

```text
Why ↑
Why ↑
current problem
How ↓
How ↓
```

也可以：

```text
broaden population
narrow mechanism
change timescale
change context
```

本质都是：

> 改变 representation granularity，而不改变研究对象本身。

---

另一个：

```text
score-scenario-robustness
evaluate-regret-robustness
```

合并成：

```text
evaluate-scenario-robustness
```

参数决定：

```text
rule =
    worst-case
    minimax-regret
    maximin
    threshold-survival
    pivot-trigger
```

所以：

```text
portfolio-optimization
analyze-future-scenarios
```

现在开始共享同一个 robustness primitive。

---

### 一个很漂亮的“恢复后再重新压缩”案例是 worst-case

Pass 8 我专门恢复了：

```text
construct-worst-case-scenario
```

因为当时的：

```text
construct-scenario
```

确实没表达：

* extreme-but-plausible
* breaking point
* failure cascade
* recovery assumptions

所以恢复是对的。

但 Pass 9 不是再把它删掉。

而是把这些要求写进：

```text
construct-scenario(
    mode = worst-case
)
```

的严格 contract。

于是能力还在，但节点不需要两个。

这就是以后我们应该采取的模式：

> **restore semantic requirement → strengthen canonical contract → remove duplicate node**

而不是：

> 看名字类似 → 直接删。

---

### random entry 和 extreme constraint 也是这样

Pass 7 恢复过：

```text
inject-random-stimulus
inject-extreme-constraint
```

但重新看 canonical SOP 后发现：

```text
generate-provocation
```

本身的 contract 已经包括：

```text
reversal
negation
random stimulus
exaggeration
distortion
```

所以现在进一步明确：

```text
generate-provocation(
    mode =
        reversal
        random-entry
        extreme-constraint
        sacred-cow
        exaggeration
        distortion
)
```

于是两个独立 SOP 可以安全消失。

`build-concept-fan` 则没有删，因为它是真正不同的生成结构。

---

### Robustness 里也砍掉了一个假 primitive

以前：

```text
generate-alternative-model
→ compare-model-conclusions
```

但我们已有 canonical：

```text
assess-sensitivity
```

它本来就明确允许：

```text
perturb model choice
→ compare conclusion
→ quantify instability
```

所以现在：

```text
robustness-analysis
    ↓
generate-alternative-model
    ↓
assess-sensitivity(mode=model-choice)
```

`compare-model-conclusions` 不再单独存在。

---

### temporal gap persistence 也是一样

以前：

```text
test-temporal-persistence
```

现在成为：

```text
analyze-temporal-trajectory(
    mode = persistence
)
```

因为：

```text
gap persists
gap narrows
gap widens
```

本质就是 temporal trajectory 的一个特殊 query。

---

## `synthesize-consensus` 也被移成 output contract

现在：

```text
structured-consensus
```

调用：

```text
map-disagreement
run-convergence-round
calibrate-probability-forecast
set-threshold
```

最后直接要求输出：

```text
ConsensusState {
    stable_consensus
    unresolved_disagreements
    confidence
    probabilities
    stopping_rationale
}
```

不再：

```text
→ synthesize-consensus
```

额外执行一个“把已有 state 写成最终结果”的 SOP。

这应该能直接减少一些无意义 token。

---

## 所以现在 graph 的形状，我已经比较满意了

从整个过程看：

```text
Old DARE
900+ skills

        ↓

Pass 3
52 Tactic
206 SOP

        ↓ aggressive compression

Pass 5
52 Tactic
164 SOP

        ↓

Pass 6
44 Tactic
169 SOP
     ↑
     压过头

        ↓ capability recovery

Pass 8
55 Tactic
229 SOP

        ↓ regression-constrained optimization

Pass 9
51 Tactic
216 SOP
```

现在这个：

> **51 Tactic + 216 SOP**

我第一次觉得数字本身已经不重要了。

真正重要的是，我们已经建立了一套能解释：

> 为什么这个节点存在？

或者：

> 为什么它能够被另一个节点吸收？

的规则。

---

## Pass 9 后，我认为不应该再大规模压了

继续砍当然还能砍。

比如可以把：

```text
audit-structural-equivalence
audit-validator-independence
audit-convergence-independence
audit-explanatory-compression
```

全部塞成：

```text
falsification-first-audit(mode=...)
```

那 Tactic 马上又少 4 个。

但我**现在不建议这么干**。

因为这些东西：

```text
structural equivalence
validator circularity
correlated convergence
explanatory compression
```

虽然都服务 falsification，但它们拥有非常不同的：

```text
input representation
failure criterion
internal state
scientific output
```

继续压只是在追求数字。

类似：

```text
TRIZ
biomimicry
conceptual blending
FMEA
Sobol decomposition
value of information
```

现在也基本到了“不应该为了极简继续糊”的区域。

---

# 所以现在只剩 **1 个必须 Pass**

也就是我们之前计划的：

## Pass 10 — Candidate Final Architecture

下一轮我不会再把主要精力放在“找重复”。

而是把目前这套东西真正**定型**。

我准备输出：

```text
DARE v4
│
├── tactics/
│
├── sops/
│
└── architecture/runtime boundary
```

并明确设计最终的 skill contract。

例如 Tactic 可能变成：

```yaml
name: map-validity-envelope
type: tactic

description: ...

inputs:
  - target
  - evidence
  - dimensions?

calls:
  - define-analysis-dimensions
  - enumerate-dimension-values
  - apply-perturbation
  - detect-breakpoint
  - construct-validity-envelope

may_jump_to:
  - sensitivity-analysis
  - falsifiability-audit

modes:
  - systematic
  - boundary
  - critical-case
```

SOP：

```yaml
name: assess-sensitivity
type: sop

description: ...

input_contract:
  target:
  perturbation:
  output:

output_contract:
  sensitivity:
  unstable_regions:
  dominant_drivers:
```

然后把：

```text
calls
jump
mode
input
output
failure condition
provenance
```

这些字段到底哪些应该进入 SKILL.md frontmatter、哪些应该放 body、哪些应该只是 graph metadata，真正确定下来。

同时会产出最终 HTML：

* 最终 51/216 左右的 graph
* Tactic/SOP detail
* calls
* jumps
* modes
* old→new provenance
* 146 capability matrix
* runtime/tooling removed list
* migration guide
* proposed repo structure

这一轮之后，我认为你就可以真正开始：

> **按照图去重构 GitHub repo。**

所以目前：

> **架构设计只剩 Pass 10 一个必须 Pass。**

之后如果你愿意，我们才进入可选 **Pass 11：让 AI 对一些 synthetic research state 做 routing probe**，验证新图是不是实际比旧四层更容易使用。

当前版本：

### [DARE v4 · Pass 9 — Graph Optimization](D:\YOGSOTH-AI\file-transfer\2026-08-21-22-56-dare-v4-two-layer-pass9.html)

下一条继续发 **“继续”**，我就做最终的 **Pass 10 Candidate Final Architecture**。
````

## GPT-12

````bash
Pass 10 完成。**这一阶段的 DARE v4 架构设计可以正式收口了。**

### [打开最终版 DARE v4 · Two-Layer Architecture](sandbox:/mnt/data/dare-v4-two-layer-final.html)

另外我把整张图导出成了机器可读数据，后面真正开始重构 repo 时会很好用：

### [下载 DARE v4 Architecture JSON](sandbox:/mnt/data/dare-v4-architecture.json)

最终候选架构定在：

```text
51 Tactics
216 SOPs

317 Tactic → SOP calls
157 allowed jumps
474 total edges

45 shared-basis SOPs
171 specialized SOPs

146 v3 capability contracts audited
```

我在 Pass 10 **没有继续为了数字而压缩**。从 Pass 9 的 51 / 216 直接冻结，因为继续压已经开始进入“把不同 scientific intent 强行参数化”的危险区域。

最终执行模型正式定义为：

```text
TACTIC ── calls ──▶ SOP

TACTIC ── jump ──▶ TACTIC
SOP ───── jump ──▶ SOP
```

其中 `BASIS`、`HYPOTHESIS`、`INSIGHT`、`STRESS`、`IDEATION` 等现在都只是**可视化 / capability metadata**，不是执行层级。

所以严格来说：

> **DARE v4 只有两个 executable node types：Tactic 和 SOP。**

Campaign 和 Strategy 不存在了。

---

### 原来的四层信息并没有简单删除

它们被这样编译：

```text
Campaign
→ capability / family metadata
→ 不再参与 routing


Strategy
→ Tactic
or
→ Tactic mode
or
→ stopping / branching logic
or
→ runtime semantics


Tactic
→ 新 Tactic
or
→ 固定 SOP composition 被 inline


SOP
→ canonical SOP
or
→ specialized SOP
or
→ canonical SOP mode
or
→ output contract
or
→ runtime / tooling 删除
```

所以不是：

> 四层砍掉两层。

而更准确地说是：

> **把四层里真正的 scientific information 编译进两层。**

---

## MCP / paper / web / subagent 也正式从 scientific graph 消失

最终架构里不会有：

```text
paper-search
paper-research
web-search
web-research

spawn-agent
implementer-dispatch

wiki-search
wiki-add-edge
wiki-ingest-source

Semantic Scholar
AlphaXiv
Brave
Tavily
Apify
Perplexity
...
```

Scientific skill 只会说：

```text
obtain independent primary-source evidence
```

或者：

```text
execute the specified falsification probe
```

然后：

> **Host AI 自己看当前有什么能力，自己决定怎么实现。**

这和你最开始提出的 MCP 解耦目标最终完全一致。

而且当前 main 里的 v3 确实仍把四层 hierarchy、MCP/tool invocation 和 skill dependencies 绑在一起，所以 v4 会是一次真正的 architecture break，而不是目录整理。([GitHub][1])

---

## 我在最终版里又定了一个我认为很重要的原则

**不要重新把 v4 graph 塞进每个 `SKILL.md` 的 YAML frontmatter。**

否则现在：

```yaml
campaigns:
strategies:
tactics:
sops:
```

换成：

```yaml
type:
calls:
jumps:
```

本质上只是换一种耦合方式。

最终我建议：

```text
skills/
    <skill-id>/
        SKILL.md

registry/
    graph.json
    capabilities.json
    aliases-v3.json
```

其中：

**`SKILL.md`**

只负责：

```text
这个 cognition 是什么
什么时候用
输入是什么
怎么思考
输出是什么
failure condition 是什么
```

而：

**`registry/graph.json`**

负责：

```text
kind
calls
jumps
modes
provenance
```

这样以后你哪怕又发现：

> Tactic / SOP 这个 taxonomy 也需要重新定义。

你改 graph 就可以。

不用再改 267 个 skill 的 frontmatter。

---

## Context 也重新定义了

我不建议 v4 延续现在这种：

> 每个 Strategy 后 ≥500 lines checkpoint。

取而代之：

```text
Host-owned ResearchState
          │
          ▼
       Tactic/SOP
          │
          ▼
ResearchStateDelta
```

一个 skill 只返回类似：

```text
findings
evidence_updates
hypothesis_updates
assumption_updates
uncertainties
decisions
open_questions
recommended_jumps
```

至于：

```text
context compression
checkpoint
resume
token budget
retry
parallelism
agent dispatch
```

由 host/runtime 管。

于是 DARE 从：

> research framework + agent runtime + tool wrappers

进一步收缩成：

> **scientific cognition system**

我觉得这其实非常接近你最开始真正想做的东西。

---

## 最终 HTML 现在有五个主要视图

**Inspect**

点任意 Tactic / SOP，看：

* description
* calls
* modes
* old provenance
* 为什么合并/恢复
* shared basis / specialized

**Final architecture**

里面正式写了：

* Tactic contract
* SOP contract
* calls semantics
* jump semantics
* ResearchStateDelta
* Scientific / Runtime / Capability 三层职责边界

**Capability audit**

保留我们这几轮建立的 **146 条 old→new capability contracts**。

**Migration**

已经给出了真正开始改 repo 时的：

```text
目录结构
迁移顺序
哪些东西彻底删除
哪些只是改变 representation
Definition of Done
```

**Optimization log**

保留 Pass 9 最后的压缩决定，方便以后追溯为什么这个节点消失。

---

## 机器验证结果

最终 graph：

```text
duplicate node IDs        0
dangling call edges       0
dangling jump edges       0
duplicate call edges      0
duplicate jump edges      0
zero-call Tactics         0
orphan SOPs               0
JS syntax errors          0
```

唯一没完成的是浏览器截图级视觉 QA：当前环境里的 Chromium headless 仍然卡在 DBus/进程启动上并超时，所以我没有假装告诉你“视觉检查也通过了”。

不过 HTML 数据、DOM 结构和 JavaScript 本身都通过检查。

---

### 这十轮最后得到的东西

整个过程其实非常有意思：

```text
DARE v3
900+ human-method skills

        ↓

拆除四层 hierarchy

        ↓

52 Tactic / 206 SOP

        ↓

aggressive compression

        ↓

44 Tactic / 169 SOP
        ↑
        发现压过头

        ↓

capability recovery

        ↓

55 Tactic / 229 SOP

        ↓

regression-constrained optimization

        ↓

DARE v4 candidate
51 Tactic / 216 SOP
```

所以我们最后得到的不是：

> **最少的 skill 数量。**

而是：

> **在目前审计到的 scientific capabilities 下，我认为比较接近 minimum-description-length 的两层 scientific cognition graph。**

这和最开始单纯“把 Campaign/Strategy 消掉”的目标已经有明显区别了。

---

**必需 Pass 已经全部结束。**

如果你接下来继续让我做，我认为就不应该叫 Pass 11 架构设计了，而应该进入新的阶段：

> **DARE v4 implementation / validation**

最值得先做的不是海量 research，而是我们之前说的一个很便宜的 **routing probe**：拿几十到几百个 synthetic research states，让 AI 分别面对 v3 和这个 v4，看它选择节点的 entropy、错误 routing、无意义层级 traversal、token consumption 有没有明显改善。

但就你这次最初要求的：

> **“给我一个保持 DARE 能力的 Tactic → SOP 两层重构方案，并最终表现为可点击详细信息的 graph HTML。”**

这个阶段现在已经完成了。

D:\YOGSOTH-AI\file-transfer\2026-08-23-22-15-dare-v4-two-layer-final.html  
D:\YOGSOTH-AI\file-transfer\2026-08-23-22-16-dare-v4-architecture.json  

[1]: https://github.com/yogsoth-ai/de-anthropocentric-research-engine?utm_source=chatgpt.com "GitHub - yogsoth-ai/de-anthropocentric-research-engine: 900+ pure-markdown skills for autonomous AI research, organized as 9 freely-composable packages over a 4-layer hierarchy (Campaign → Strategy → Tactic → SOP). Non-linear orchestration with backtracking, 6 MCP integrations. The AI is the researcher — you set the direction. · GitHub"
````
