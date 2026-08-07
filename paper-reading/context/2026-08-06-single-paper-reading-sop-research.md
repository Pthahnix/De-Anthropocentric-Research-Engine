# 单篇论文阅读法调研 — 轴线矩阵 + 候选 SOP 菜单

> Created: 2026-08-06
> Topic: 调研可做成 skill 的单篇论文阅读/结构化抽取方法论，产出轴线矩阵与候选 SOP 菜单
> Phase: v1 暂存后的 v2 前置调研。**停在菜单 + 矩阵**，不排序、不写 SKILL.md（排序属下一轮，用 `convergence:multi-criteria-scoring`）

## Plan Context

v1 公众号管线已暂存（见 `2026-08-06-carry-forward-v1-findings.md`）。v2 立足点：一批彼此不同的单篇阅读法，各自产出不同形状的结构化物，同篇横向测。

本轮调研范围，用户已明确划定：

- **A 线 · 人类学界的成文阅读法** — Keshav 三遍法、QALMRI、Teufel argumentative zoning、CoreSC、Swales move analysis、CASP / JBI / RoB2 等批判性评估工具、ML Reproducibility Checklist、PRISMA 抽取表。**全部纳入，都做成 skill**，后续逐个测、逐个优化。
- **B 线 · NLP 的单篇结构化抽取** — CSFCube facet、SciERC / SciREX、TDMS、QASPER、SciFact、ACU / 原子事实分解、nugget 评估、CODA-19。**同样纳入这批 SOP**。
- **C 线 · LLM/agent 读论文系统** — 本轮**不做**。用户判断它与 `wiki-vault` / `knowledge-structuring` 是同类东西，等更新那些 pkg 时再说。

已有 context（`2026-07-29-18-19-paper-reading-pkg-scoping.md`）已覆盖 Keshav 原文定位、InsightGUIDE、Paper2Blog / ResearchStudio-Reel、Paper Espresso、GitHub repo 快照。本轮**不重做这块**，只在需要时引用。

## 方法选择（来自 `/research-catalog`）

| 阶段 | 用什么 | 为什么 |
|---|---|---|
| 铺面 | `knowledge-acquisition:scoping-survey` | A/B 两线的地形没系统测过，先要广度 |
| 打深 | `knowledge-acquisition:deep-survey` | 铺面筛出的关键文献读全文，抽方法细节到可实现粒度 |
| 出轴 | `knowledge-structuring:dimension-discovery` + `axis-extraction` + `axis-validation` | 真正回答「可以做怎么样的多批 SOP」 |
| 排列 | `matrix-generation` + `combination-enumeration` + `novelty-scoring` | 轴一交叉，空格子即候选 SOP |

出轴那步是重点。「可以做哪些 SOP」的答案不该是拍脑袋列清单，而该是：先找出这些阅读法**在哪几条轴上分化**，再交叉枚举。这与 `docs/temp/pipeline-preview.md` 自己的方法论同源——让轴从证据里涌现，不预设几条。

执行分工：A/B 两线铺面用 haiku 子 agent 并行扫（成本规则：explore→haiku）；出轴、验轴、写矩阵由主 agent 做。

---

## Process Log

### A2 线回报 — 批判性评估工具与结构化抽取表

> 子 agent 铺面结果。**标 ⚠ 的数字是子 agent 自报但我未独立核实的**，写 SKILL.md 前必须回原始出处核一遍。有一处它自己就矛盾了（Datasheets 声称 11 组却只列出 7 组），说明这类条目数是它的薄弱环节。

#### 偏倚风险工具（有机械判定算法的那批）

| 工具 | 适用设计 | Domain 清单 | 判定档 |
|---|---|---|---|
| **RoB 2** | 平行分组 RCT（聚类/交叉有扩展版） | ①随机化程序 ②预期干预偏差 ③缺失结果数据 ④结果测量 ⑤报告结果选择 | Low / Some concerns / High，整体 = 最严重 domain |
| **ROBINS-I** | 非随机干预研究（队列/病例对照/ITS/受控前后） | ①混杂 ②参与者选择 ③干预分类 ④干预偏差 ⑤缺失数据 ⑥结果测量 ⑦报告结果选择 | Low / Moderate / Serious / Critical / No information |
| **QUADAS-2** | 诊断准确性 | ①患者选择 ②指标试验 ③参考标准 ④流程与时间 | Low / High / Unclear（无中间档）；D1–3 同时评「风险」与「适用性关注」，D4 只评风险 |
| **NOS** | 队列 / 病例对照（两个版本） | ①选择(4星) ②可比性(2星) ③结果或暴露(3星) | 9 星制，≥7 好 / 4–6 中 / 0–3 差 |
| **AMSTAR-2** | 已发表的系统综述（伞状综述必用） | 16 域，其中 **7 个关键域**：综述问题与 PICO、纳入标准预先性、选择重复、全文评估、风险工具适当性、GRADE、异质性处理 | High / Moderate / Low / Critically Low（≥1 关键缺陷 → Critically Low） |

RoB 2 有两点值得单独记：

1. **应用粒度是「每个结果 × 每个时间点」，不是整篇试验。** 一篇论文可能产出多行判定。这对「跨篇对齐」是好事（行的语义固定），但意味着 SOP 的输出不是一个对象而是一张表。
2. **判定不靠自由裁量，靠 signalling questions → domain 算法。** 每 domain 2–7 个信号问题，答 Yes / Probably yes / Probably no / No / No information，再套查表算出 domain 等级。这是这批工具里**最接近可机械执行**的部分。D2 还分两个分支（意向治疗 vs 依从性），选哪支取决于要估的效应类型。

**GRADE**：起点 RCT = High，观察性 = Low。五个降级因素（偏倚风险、不一致、间接性、不精确、发表偏倚）＋三个升级因素（仅观察性研究：效应量大、量效梯度、混杂方向削弱效应）。严重关切 −1，非常严重 −2 ⚠（叠加上限子 agent 报 −3，待核）。产出是 Summary of Findings 表，每 outcome 一行，含相对＋绝对效应、参与者数、确定性等级＋理由脚注。

#### 教学型清单（无汇总算法）

- **CASP**：8 套（RCT / SR / 队列 / 病例对照 / 诊断 / 定性 / 经济评估 / 临床预测规则）。RCT 版 ⚠11 条，三段式结构：A 段筛选与有效性、B 段方法学质量、C 段本地适用性。判定 Yes / No / Can't tell，**刻意不给分数**——CASP 自己定位为教学工具，官方立场是正式系统综述应改用 RoB 2 一类工具。
- **JBI**：按设计分套，条目数 ⚠定性 10 / 队列 13 / 病例对照 10 / 横断面 8 / 个案报告 8 / 经济评估 15。判定 Yes / No / Unclear / N/A。与 CASP 的区别是它**把方法学质量与报告清晰度混在一起评**；定性那套强调可信度与可转移性。

#### ML/AI 侧的清单

- **ML Reproducibility Checklist**（Pineau，v2.0 / 2020-04-07）——子 agent 报「三类 19 条」，**错**。我抽了 PDF 原文核实（`cs.mcgill.ca/~jpineau/ReproducibilityChecklist.pdf`），实为 **5 节 21 条**，逐条如下（这是原文措辞，可直接写进 SKILL.md）：

  | 节 | 条目 |
  |---|---|
  | For all **models and algorithms** presented (3) | 数学设定/算法/模型的清晰描述；任何假设的清晰说明；算法复杂度分析（时间、空间、样本量） |
  | For any **theoretical claim** (2) | 主张的清晰陈述；主张的完整证明 |
  | For all **datasets** used (5) | 相关统计量（如样本数）；train/validation/test 划分细节；被排除数据的解释＋全部预处理步骤；数据集或仿真环境的可下载链接；若为新采集数据，完整采集流程（含标注者指令与质控方法） |
  | For all shared **code** (5) | 依赖说明；训练代码；评测代码；（预）训练模型；README 含结果表＋产生该结果的精确命令 |
  | For all reported **experimental results** (6) | 超参搜索范围＋选优方法＋最终全部超参；训练与评测的确切运行次数；所报统计量的明确定义；含中心趋势（如均值）与波动（如误差棒）的结果描述；每个结果的平均运行时长或估算能耗；所用算力基础设施描述 |

  v2.0 有两条设计细节直接可用：①它改名为「Paper Reproducibility Checklist」，明确论文与代码是两个独立产物，各有各的清单；②建议每条设**两个作答栏**——一个分类栏 {Yes, No, Not applicable}，一个自由文本栏，用于「不是清晰是非」或「为何不适用」的情形。这个「分类＋理由」的双栏格式是把清单变成可执行 SOP 的现成答案格式。

- **REFORMS**（Kapoor et al., arXiv 2308.07832，2024 发于 Science Advances）——**子 agent 挖出的新条目，原计划里没有**。19 位跨计算机科学/数据科学/数学/社会科学/生物医学的研究者共识产出，官方站 `reforms.cs.princeton.edu`。已核到原文全 32 条，per-section 计数与子 agent 所报一致（3+5+7+3+6+3+3+2=32）：

  | 节 | 条目 |
  |---|---|
  | **1 Study goals** (3) | 1a 科学主张所针对的总体或分布；1b 选该总体/分布的动机；1c 本研究采用 ML 方法的动机 |
  | **2 Computational reproducibility** (5) | 2a 训练与评测所用数据集＋唯一标识它的链接或 DOI；2b 训练/评测/复现论文结果的代码＋钉住确切版本的链接或 DOI；2c 算力基础设施描述；2d README 含用所给数据与代码生成结果的指令；2e 复现脚本，产出论文报告的全部结果 |
  | **3 Data quality** (7) | 3a 数据来源（训练与评测分别说明）＋采集时间＋ground-truth 标注的来源与流程＋其它数据文档；3b 数据集抽样所来自的分布或集合（即抽样框）；3c 为何该数据集对当前建模任务有用；3d 模型的结果变量＋描述统计（分类变量按类分列）＋变量定义；3e 样本量与结果频次；3f 缺失数据比例（分类结果按类分列）；3g 论证 3b 的抽样框对 1a 所述总体具代表性 |
  | **4 Data preprocessing** (3) | 4a 是否排除样本＋排除理由；4b 不可能值或损坏样本如何处理；4c 从 3a 的原始形态到入模形态的全部变换（缺失处理、归一化等，建议画流程图） |
  | **5 Modeling** (6)（表 1 作 Modeling decisions） | 5a 所有训练过的模型的详细描述；5b 选这些模型类型的理由；5c 论文所报模型的评测方法，含 train-test 划分或交叉验证折的细节；5d 论文所报模型的**选择**方法；5e 超参调优细节；5f 论证模型对比是against 恰当的 baseline |
  | **6 Data leakage** (3) | 6a 论证第 4 节预处理与第 5 节建模步骤只用了训练集信息、未用测试集；6b 处理训练/测试集之间依赖或重复的方法（例：同一病人的全部样本须落在同一划分内）；6c 论证每个特征/输入对当前任务是正当的、不导致泄漏 |
  | **7 Metrics & uncertainty** (3) | 7a 评估与比较模型性能所用的全部指标（accuracy、AUROC 等）＋论证用于选定最终模型的那个指标适合该任务；7b 不确定性估计（置信区间、标准差等）＋其计算方式；7c 统计检验的选择理由＋对检验前提假设的核查 |
  | **8 Generalizability** (2) | 8a 外部效度的证据与局限；8b 作者**不**预期本研究结论成立的语境 |

  两点保真度说明：论文自称表 2 的部分条目「shortened for brevity」，完整模板在 Appendix A（真要写 SKILL.md 时应取 Appendix A）；上表若干长条目是部分直引＋余下转述。

  **数据泄漏单独立一节，是它与 Pineau 版最大的差异**——Pineau 版完全没有对应条目。另外 8b 那条（明说哪些语境下结论不成立）在整个 A2 批里也很少见：多数清单查「报了没报」，8b 查的是「作者有没有主动划出自己的失效边界」。

---

### B1 线回报 — facet 与结构化抽取

> 子 agent 交了报告，ORKG 那块明确写「未查全」而没有编造——按指令行事，可取。ORKG 部分由我自己补齐（见下）。

#### 各方案 schema

**CSFCube**（Mysore et al., NeurIPS 2021 Datasets Track, arXiv 2103.12906）——3 个 facet，句子级标注：

| Facet | 定义 |
|---|---|
| Background / Objective | 设置研究动机、阐述与先前工作的关系、陈述问题或研究问题 |
| Method | 所提出或所用方法的描述（可粗可细）：方法分析、模型描述、数据处理、实验流程的程序化描述 |
| Result | 分析或实验的详细发现、结果陈述、或依论文类型的结论性陈述 |

规模 50 个查询摘要 / 34 个唯一摘要；相关度 0–3 四级（Unrelated / Related / Similar / Near-Identical），判据是 **structural / relational 相似而非 attribute 相似**；裁决后一致性 Spearman ρ 均值 0.70（background 0.73 / method 0.63 / result 0.70）；TREC depth-k pooling。**无 span offset**。

**⚠ 一处重要的范畴修正（我的判断，不是子 agent 的）**：CSFCube 是**faceted paper retrieval 的测试集**，它的产出是「给定 facet，两篇摘要之间的相关度等级」——是一个**相似度排序**，不是一张填好的结构化记录。我们把它列在「facet 抽取」这条线上，严格说是错位的。可复用的是它那 3 个 facet 的**句子级标签定义**；不可复用的是它的任务形态。这一点直接影响我们能从它身上拿走什么。

**SciERC**（Luan et al., EMNLP 2018, arXiv 1808.09602）——span 级，**强锚点**（字符 offset + coreference 链）：
- 实体 6 类：Task, Method, Metric, Material, Other-ScientificTerm, Generic
- 关系 7 类：对称的 Compare / Conjunction；非对称的 Part-of / Evaluate-for / Feature-of / Used-for / Hyponym-of
- 500 篇摘要；允许嵌套 span；文档级 coref cluster 可跨句
- 一致性 Cohen's κ：实体 0.769 / 关系 0.678 / coref 0.638

**SciREX**（Jain et al., ACL 2020, arXiv 2005.00512）——文档级，**最强锚点**（span + coref + saliency 二值标记）：
- 实体 4 类：Dataset, Task, Method, Metric
- 核心是 **4 元组**（Task, Dataset, Method, Metric），同时标注二元与三元关系（均值 9.4 关系/文档）
- **salient entity 的定义是「参与论文结果 4 元组的实体」**——不是词频高的实体，是进了结果的实体。这个定义方式值得记：它把「重要」操作化成了「进没进结果」，不靠主观判断
- 跨度统计：二元关系 57% 跨句、20% 跨节；**4 元组 99% 跨句、55% 跨节**
- 438 文档；SciERC 模型 + PapersWithCode 远监督自动标注后专家修正，平均 5737 词 / 22 节

**NLPContributionGraph**（D'Souza et al., SemEval-2021 Task 11, arXiv 2106.07385）——三层：贡献句（均值 17 句/篇）→ 术语与谓词短语（自由抽取，不预定义词表）→ (subject, predicate, object) 三元组，按 information unit 容器组织。
- ⚠ 子 agent 说 12 个 IU 容器但只列出 11 个（必选 3：RESEARCHPROBLEM / APPROACH-MODEL / RESULTS；可选 8：CODE / DATASET / EXPERIMENTALSETUP / HYPERPARAMETERS / BASELINES / TASKS / EXPERIMENTS / ABLATIONANALYSIS）。数目待核。
- 287 训练 / 155 测试；单标注人（计算语言学 postdoc）+ 50 篇试标 + 二阶裁决
- **试标一致性逐层崩塌：句子 F1 67.92% → 短语 41.82% → 三元组 22.31%**。端到端系统 F1 22.28%，给定 gold 实体则 61.29%。这组数字是本轮最有信息量的发现之一——**层级越深、结构越细，连人类专家都对不齐**。

**句子级修辞角色数据集**——子 agent 只给了标签名，定义与协议未查全：CODA-19（5 类：Background / Purpose / Methods / Results / Other）、PubMed 200k RCT（5 类：Background / Objective / Method / Result / Conclusion）、NICTA-PIBOSO（6 类：Population / Intervention / Background / Outcome / Study-design / Other）、CSAbstruct（未查）。**待补**。

#### ORKG comparison templates（子 agent 未查全，以下为我自己补的）

机制搞清楚了，而且它正对着我们「跨篇可对齐」这个需求：

- **Template 是什么**：基于 **SHACL**（Shapes Constraint Language）的形状约束——「templates allows to specify the structure of content types, and they can be used when describing research contributions」（`orkg.org/templates`，站上还有 Import SHACL 功能）。实现上是带类型占位符的图模式，用来定义并强制数据结构、格式与约束。
- **谁定模板**：**领域专家众包**。「Data models are crowdsourced by domain experts, which are materialized in ORKG Templates.」任何用户都可以为自己的领域或某个具体研究问题新建模板。另有 Observatories 机制，由该领域活跃的研究机构负责策管。**没有中央权威**——这是它与 SciREX 那种论文里钉死 schema 的根本差别。
- **Comparison 怎么出来**：论文的贡献用 (subject, predicate, object) 三元组描述，predicate 就是「salient properties」。Comparison 把多篇论文并排成表——**属性作行、论文作列**，「Comparisons are generated semi-automatically by matching similar properties」。可导出 SPARQL / RDF / CSV / LaTeX / PDF。
- **已有的 leaderboard 模板正是 Task–Dataset–Metric–Value**（Kabongo et al., 2023）——**与 SciREX 的 4 元组同构**。两条独立路线收敛到同一个四槽结构，这不是巧合，说明这个形状在「跨篇可对齐」上确实是个吸引子。

**关键的实证约束（这条最要紧）**：ORKG 自己的团队在 *Evaluating Large Language Models for Structured Science Summarization in the ORKG*（Info 2024, 15(6):328）里明说，手工策管属性「labor-intensive and **inconsistent among human domain-expert curators**」。另有 *Quality Assessment of Research Comparisons in the ORKG: A Case Study*（2024）指出，平台有 1000+ 用户、但策管数据此前从未做过深度质量评估。

也就是说：**「预定义 facet 模板」不是免费的午餐。** 让一批领域专家去填同一张模板，他们填出来的东西彼此不一致——这是文档化了的实证事实，不是我的推测。这与上面 NCG 的一致性逐层崩塌（67.92% → 41.82% → 22.31%）是同一个现象的两次独立观测。

#### 跨篇可对齐性 — 逐项判断

子 agent 的结论我基本认可，但要换一个更准的解释。它说 CSFCube 对不齐是因为「method facet 在 NER 论文与图生成论文里含义完全不同」——方向对，但没说到根子上。

**真正的分界线是：槽里填的是自由散文，还是共享词表里的名字。**

| 方案 | 能否横排成跨篇比较表 | 根本原因 |
|---|---|---|
| **SciREX 4 元组** | **强** | 槽里填的是 CoNLL03、BERT、F1 这类**跨论文反复出现的名字**。名字共享，才对得齐。paperswithcode 的 leaderboard 就是这么来的 |
| **ORKG comparison template** | **强（但有代价）** | 靠人**事先**约定一张属性表，再逼所有论文填同一张。对齐性是人为强加的，代价是策管者之间不一致 |
| **句子级修辞角色** | **强** | 标签集固定且语义与论文内容无关（「这句是 Method」与论文讲什么无关）。可用于「把所有论文的 Methods 段落抽出来对比」 |
| **NCG 三元组** | **弱–中** | IU 容器固定可按容器聚合，但谓词自由抽取（propose / use / evaluate 的变体无穷），要后处理规范化谓词才能半结构化对齐 |
| **CSFCube facet** | **弱** | 产出本身是相关度排序不是结构化记录（见上文范畴修正）。3 个 facet 标签可复用，但 facet 里的内容是论文特异的散文 |
| **SciERC 关系实例** | **弱** | 关系类型固定 7 类，但实体来自论文内容、无共享实体库。「Method A Used-for Task B」与「Method C Used-for Task D」关系同、实体不同，排不成表 |

**这条判断对 `pipeline-preview.md` 的直接后果**：Stage 2 要把所有论文的原子单元混在一起分团、让轴线自己浮出来。按上表，能支撑这件事的只有两条路——①填共享词表的名字（SciREX 路线），②人事先约定属性表（ORKG 路线）。而 Stage 1 的方法论明确要求**自下而上、不预设**，这就排除了 ②。剩下 ① 的话，问题变成：`pipeline-preview` 要抽的「动了什么量、往哪个方向动、听谁的信号动」——这三样有没有一个共享词表？没有的话，它就落回自由散文，混起来对不齐。**这是整条 pipeline 目前最脆的一环，B2 的 decontextualization 是唯一可能的解法，等它回报。**
- **Model Cards**（Mitchell et al. 2019）9 节：Model Details / Intended Use / Factors / Metrics / Evaluation Data / Training Data / Quantitative Analyses / Ethical Considerations / Caveats & Recommendations。
- **Datasheets for Datasets**（Gebru et al. 2018）7 组 ⚠（子 agent 写「11 个问题分组」但只列出 7 个，取其列出的）：Motivation / Composition / Collection / Preprocessing / Uses / Distribution / Maintenance。
- **NeurIPS Paper Checklist**：Pineau 版的扩展，加了伦理与社会影响声明。

#### 报告规范（反用为阅读清单）

| 规范 | 适用 | ⚠条目数 |
|---|---|---|
| CONSORT | RCT | 25 |
| STROBE | 观察性（队列/病例对照/横断面） | 22 |
| ARRIVE 2.0 | 动物体内研究 | 20（待核：官方分 Essential 10 + Recommended 11） |
| SPIRIT | 试验方案 | 33 |
| TRIPOD | 预测模型开发/验证 | 22 |
| PRISMA 2020 | 系统综述 | 27（分 Title&Abstract / Introduction / Methods / Results / Discussion / Other 六块） |

反用思路很直接：报告规范原本是给作者用的「你该写什么」，倒过来当读者的「他写了没有」。**这是一条与其它方法论都不同的阅读路径**——不查结论对不对，只查该报的报没报。

问题框架：PICO（Population / Intervention / Comparator / Outcome）、PECO（暴露替换干预）、SPIDER（Sample / Phenomenon of interest / Design / Evaluation / Research type，用于定性综述）、FINER（Feasible / Interesting / Novel / Ethical / Relevant，评研究问题本身而非论文）。

#### 子 agent 给出的交叉观察（我保留其中站得住的四条）

1. **产出形状的跨篇可对齐性分两类。** RoB 2 / ROBINS-I / QUADAS-2 / GRADE 的字段与等级不随论文变，天然能横排成表（traffic light 图、SoF 表就是这么来的）。CASP / JBI 虽也是固定条目，但判定是三元/四元且无汇总算法，排得出表但列之间不可比。PRISMA / CONSORT / STROBE 是清单型，条目之间语义各异，本身不构成可比维度。
2. **「做得好不好」与「报了没报」是两种不同的阅读取向。** 偏倚风险工具查前者，报告规范查后者，CASP / JBI 混在一起（它们的「Can't tell」实际上意味着报告不足导致无法判断——这一档把两件事糊在了一起）。
3. **领域绑定度差异极大。** RoB 2 / ROBINS-I / QUADAS-2 / PRISMA / CONSORT / STROBE / ARRIVE / SPIRIT / JBI / AMSTAR-2 / GRADE 全是医学生物医学血统；ML Repro / NeurIPS checklist / REFORMS / Datasheets / Model Cards 是 ML 侧；PICO 与 TRIPOD 可跨领域改编。**这条对我们是硬约束**——我们要读的论文以 CS/ML 为主，医学血统那批的多数 domain（分配隐蔽、盲法、意向治疗分析）在一篇 LLM 论文上无从下手。
4. **有无判定算法，决定 SOP 能不能被机械执行。** 有：RoB 2、ROBINS-I、GRADE。无：CASP、JBI、CONSORT/STROBE/PRISMA。部分：QUADAS-2（domain 内有规则，无合成整体的规则）、AMSTAR-2（关键缺陷检测式，非数学化）。

#### 我对这批的判断（不是子 agent 的话）

子 agent 最后给的「SOP 化建议」（样式 A/B/C）我不采纳——它把三类工具直接串成一条医学系统综述的流水线（选工具 → 逐 domain → GRADE → 报告规范核对 → 综合报告），这是照搬 Cochrane 工作流，不是我们要的东西。我们要的是**一批彼此独立、可横向比较的单篇阅读法**，不是一条把它们串起来的管线。

真正有用的是它无意间暴露的那条张力：**这批工具里，算法最严密的（RoB 2、GRADE）领域绑定也最深；领域上适配我们的（REFORMS、Model Cards、Datasheets）恰恰没有判定算法。** 「严密性」与「适用性」在这批证据里是负相关的。这条要带进轴线分析。

---

### A1 线回报 — 成文阅读法本身

五种方法，核心结构均已对原始或权威二次来源核实。

**Keshav 三遍法**（S. Keshav, *How to Read a Paper*, ACM SIGCOMM CCR 37(3), 2007，247引用/4高影响力引用）——三遍：①第一遍 5–10 分钟，读题目/摘要/引言/section标题/结论，判定是否值得深读及粗略分类；②第二遍约1小时，抓图表与实验结果、忽略证明细节，能向同行总结主要贡献；③第三遍4–5小时以上，逐句重读含证明，标出隐含假设与可改进点，达到"能重现"的掌握程度。纯定性指导，无判定算法。产出是叠进式理解，**六项里唯一不产出任何持久化结构化物的方法**，只留在读者脑中。

**QALMRI**（心理学/认知科学教学框架，如Portland State方法课；Brosowsky & Parshina 2017教学应用章节）——六步：Question（研究问题）→Alternatives（未被采纳的竞争假设，通常要求列2–3个）→Logic（研究设计如何在假设间做区分）→Method（程序细节）→Results（关键发现）→Inference（结论与局限，含对初始问题的回应程度）。纯定性，无算法。产出是结构化工作表（六类问答对），比Keshav多一层持久化，但仍是自由文本。

**Teufel argumentative zoning**——原始版（Teufel 1999博士论文，297引用/42高影响力引用）7类：AIM/OWN/BACKGROUND/CONTRAST/BASIS/OTHER/TEXTUAL，句子级单标签。扩展版AZ-II（Teufel, Siddharthan & Batchelor, EMNLP 2009，168引用/15高影响力引用）扩展到**15类**——这个数字铺面阶段一直标"未列出完整清单"，现已从二次来源核实（"extended the original 7 categories to 15 and annotated 39 articles from two domains"，ResearchGate摘录）。跨域一致性：计算语言学 Fleiss' κ = 0.71，化学 κ = 0.65（同样是本轮新核实的数字）。判定方式混合——类别定义清晰到可训练分类器（Merity et al. 2009 用最大熵分类器+Viterbi序列标注，比Teufel 1999基线提升F1 23%），但标注本身仍靠人工定性判断。产出是句子级单标签序列。

**CoreSC**（Liakata, Teufel, Siddharthan & Batchelor, LREC 2010——与AZ-II同一篇论文、同一批39篇化学论文并行标注两套方案）。原始论文站点403无法直接抓取，以下类别表核实自二次来源（Duma et al., LREC 2016, Table 1，同作者团队后续应用CoreSC做引文推荐）：

| Category | 定义 |
|---|---|
| Hypothesis | 尚未确认的陈述，非事实陈述 |
| Motivation | 研究动机 |
| Background | 公认背景知识与先前工作 |
| Goal | 研究打算达到的目标状态 |
| Object-New | 研究的产物或主题实体 |
| Method-New | 作者为达成目标所用的方法 |
| Method-Old | 属先前工作的方法 |
| Experiment | 实验方法 |
| Model | 理论模型或框架陈述 |
| Observation | 记录到的数据/现象 |
| Result | 关于研究产出的事实陈述 |
| Conclusion | 从观察与结果推得、关联研究假设的陈述 |

⚠**这里有个数字矛盾，与B1线发现的NCG"12容器却只列11个"是同一类问题**：上表列出12类，但同一篇论文正文另一处说其自动分类器"51.9% accuracy over all eleven classes"——11类。可能是某个分类器实现把Object/Method各自的New/Old合并计数，但二次来源没说明具体哪一类被并掉。真正完整定义仍应查原始LREC 2010论文或标注指南（Liakata et al. 2016提到"following a set of 45 page guidelines"），本轮未能拿到原文。判定方式：定性定义+机械可训练类别（同AZ-II，Sapienta分类器独立测试51.9% vs 训练语料9折交叉验证50.4%），产出是句子级单标签。

**Swales move analysis / CARS**（Swales 1990《Genre Analysis》；自动化验证见Yu et al. 2024 GPT-4实验）——3个Move、共约9–10个Step：Move 1 Establishing a territory（1a声称重要性/1b学科概括/1c回顾先前研究）；Move 2 Establishing a niche（2a指出缺口/2b质疑现有主张/2c提议新方法）；Move 3 Occupying the niche（3a概述目的/3b呈现研究问题/3c宣布主要发现/3d表明论文结构）。判定方式：定性功能性判断为主——move是功能单位而非形式单位，同样句式可能实现不同move；但Yu et al. 2024用8-shot GPT-4 prompt在应用语言学摘要上达句级准确度93.33%，两位人工编码者分歧仅1.8%（678句中12句），说明定义清晰到可高一致性执行。产出是跨度/句子级标记，按move/step分组。

**四线横向定位**：Keshav/QALMRI两条最靠定性一端，且不产出结构化物；Teufel AZ / CoreSC / Swales三条产出句子级或跨度级标签、可训练分类器执行，与A2线里QUADAS-2/AMSTAR-2这类"domain内有规则、无合成整体规则"的中间地带类似——但与A2线RoB2/GRADE这种"signalling questions→算法"式机械判定相比仍差一截，A1三者的产出终点就是标签本身，不再往上合成一个综合等级。与B1线对比：AZ/CoreSC的句子级单标签比SciERC的span级强锚点更粗，但比CSFCube的"相关度排序"更接近"结构化记录"。

### B2 线回报 — 原子单元与证据

六项逐一核实，重点回应B1留下的"整条pipeline最脆环节"：自由散文能否被系统性改写成跨篇可对齐的形式。

**TDMS 抽取**（Hou et al., ACL 2019 提出任务；TDMSci语料库 Hou et al., EACL 2021, arXiv 2101.10273）——三类实体Task/Dataset/Metric，句子级span标注，2000句/2937个提及。标注规范明确排除匿名指代（"this task"），只标"factual, content-bearing"且"whose meanings usually are consistent across different papers"的实体——这句原文措辞直接说明它为什么天然可跨篇对齐。最小跨度原则：只标最小必要span，如"the text8 test set"只标"test8"；缩写与全称合并标注如"20-newsgroup (20NG)"。4名专家100句试标（均已核实）：Task F1(EM)=0.720/Fleiss'κ(token)=0.797，Dataset F1=0.752/κ=0.829，Metric F1=0.757/κ=0.896，整体F1=0.743/κ=0.842。Flair-TDM微平均F1=62.05%（数据增强后），partial match下76.47%。

**QASPER**（Dasigi et al., NAACL 2021, arXiv 2105.03011）——5049问题/1585篇NLP论文，问题写作者只见标题摘要、答案标注者见全文。可回答性一致性90%（已核实）；抽取式答案平均14.4词，摘要式15.6词（后者是本轮新核实补充的数字）；55.5%可回答问题需多段落证据（已核实）。答案与证据都是原文span或自由改写，无任何规范化步骤——六项里唯一"目标就不是结构化槛填充"的一项，去语境化问题对它不适用。

**SciFact**（Wadden et al., EMNLP 2020, arXiv 2004.14974）——1409条声明/5183篇摘要证据库，Claim-Abstract-Label三元组。标签一致性Cohen's κ=0.75，理由句子一致性κ=0.71（均已核实；论文给出的参照基准：FEVER的Fleiss'κ=0.68、UKP Snopes的Cohen's κ=0.70，SciFact的0.75略高）。Claim改写机制：源自citance（引用句），标注者在**看不到被引摘要内容**的情况下改写成"atomic verifiable statement"——这个盲改写设计本身是为了防止改写抄近路，不是为了跨篇对齐。改写规则：只能来自单一来源、不能是主观意见、复合声明要拆成多条原子声明。但Claim集合仍是数据集特异的，不同论文对同一发现可能写出完全不同措辞的Claim，没有共享Claim词表。

**ACU**（Liu, Fabbri et al., *Revisiting the Gold Standard*, arXiv 2212.07981——⚠此前铺面阶段误判"未查全"，其实原始出处非Bhandari/Nenkova而是这篇，已核实到位）——协议改自Pyramid（Nenkova & Passonneau 2004）与LitePyramid（Shapira et al. 2019），核心动作是"ACU Writing"（论文作者本人从参考摘要抽取atomic facts，非众包）+"ACU Matching"（MTurk众包判断系统摘要是否包含该ACU，二元判断）。RoSE基准：3个数据集/28个系统/22000条摘要级标注，Krippendorff's α：摘要级0.7571、ACU级0.7528——均高于对照的RealSumm(0.66)和SummEval(0.49)，直接实证了"简化标注单元换高一致性"这个设计动机。是recall-based协议，不加权（原始多参考Pyramid要加权，单参考简化掉了）。ACU文本由作者统一撰写，客观上带"多参考规范化"效果，但ACU集合仍是每个reference summary特异的，不跨数据集共享。

**Nugget评估**（AutoNuggetizer, Pradeep et al. 2025, arXiv 2504.15068, TREC 2024 RAG Track；方法论追溯至TREC QA Track 2003）——三种nugget创建条件（人工/半人工post-edit/全自动）×两种assignment条件（人工/AutoAssign）交叉实验。run-level Kendall's τ（均已核实）：AutoNuggets+Edits对照下V_strict=0.887/A_strict=0.901；ManualNuggets对照下降到0.727/0.758（20-topic样本量小，同样取20-topic子集重跑AutoNuggets+Edits得0.826/0.838，说明部分下降是样本量效应非质量效应）。但per-topic层面骤降：全topic/run组合τ仅0.297–0.438，per-topic平均τ 0.360–0.539——run-level排名可信、单题诊断不可信，论文原话"our evaluation framework is inadequate for fine-grained debugging of individual answers"。vital标注比例：人工条件59–61%，全自动AutoNuggets条件66–72%（LLM更倾向标vital）。人工nugget耗时2.5小时/主题，混合条件约1小时/主题。Nugget文本是标注者/LLM原创自然语言表述（非原文摘录），平均7–8 token，遵循"通用可理解"撰写要求——结构上类似ACU的"作者统一撰写"，但nugget集合同样是每个query/topic特异的。

**CODA-19**（Huang et al., ACL Workshop 2020, arXiv 2005.02367）——5类句子/子句级修辞角色（Background/Purpose/Method/Finding/Other），10966篇COVID摘要/103978句/168286个片段，MTurk众包（248名工作者/每摘要9人重复标注/多数投票聚合）。众包-专家一致性Cohen's κ=0.741，专家-专家κ=0.788，众包准确率82.2% vs 专家间85.0%（均已核实）。纯分类任务，不涉及内容改写或抽取，去语境化问题对它不适用——但证明了"句子级修辞角色分类"这条路径可以做到接近专家水平且成本低（$3.2/摘要）。

**去语境化机制总评**：六项按"槛里填的内容能否跨篇共享"排序，TDMS明显领先——它是唯一一项标注规范本身写明"目标是构建跨论文一致的实体库"的方案，且已有可训练的高一致性tagger。SciFact/ACU/Nugget三项都有"改写"动作，但目的不同：SciFact的盲改写是为了防作弊、不是为了对齐；ACU/Nugget的"统一撰写"是为了在**单个评估任务内部**（同一组参考摘要/同一个query的多个系统答案）取得标注一致性，作用范围天然止于"一个reference set"或"一个topic"，出了这个范围就退化成自由散文。QASPER和CODA-19两项设计目标上就没有对齐需求。

**对B1"最脆环节"判断的回应**：B2没有推翻B1的结论，反而加固了它——目前找到的所有"跨篇可对齐"方案（SciREX四元组、TDMS三元组、ORKG模板）无一例外都走"槛里填共享词表名字"这条路线，没有一个反例证明"自由散文可以被系统性改写成跨篇对齐"。SciFact/ACU/Nugget三项虽都有改写步骤，但改写后的产物仍绑定在各自的评估范围（一条claim绑定一次引用判断、一个ACU绑定一份参考摘要、一个nugget绑定一个query）内，没有一项把改写目标定义为"让不同论文的同类内容变得可比"。`pipeline-preview.md`若要走decontextualization这条路，目前六个样本里找不到现成模板可抄——"改写后自动获得跨篇共享词表"这个效果，是六项里没有一项做到过的新东西，只能自己设计。

---

## 出轴 — 四线证据的分化轴线

> 四线铺面已完成（A1/A2/B1/B2，约40个方法/工具已核实到可实现粒度）。本节从这批证据里抽出方法论彼此分化的独立轴线，为下一步「排列」（轴交叉生成候选SOP空格子）打底。方法：`axis-extraction`（系统抽取）+ `matrix-generation`（测独立性，非枚举SOP候选——枚举是排列阶段的事）。出轴、验轴由主 agent 做，未再拆子 agent，因为原始证据已经在本文件里核实完毕，不需要新的检索。

**State Ledger**

| Metric | Target (M) | Current | Status |
|---|---|---|---|
| Candidate dimensions | 10 | 10 | ✅ |
| Validated dimensions | 6 | 7 | ✅ |
| Sources analyzed | 20 | ~40（A1五项+A2约22项+B1约9项+B2六项，去重） | ✅ |

三项均超 80% 门槛，可退出。

### 候选轴线（10）与淘汰

抽取时先列了10条候选，3条在验证阶段发现与其他轴高度重叠，合并淘汰：

- **自动化成熟度**（全人工/半自动LLM辅助/全自动可训练执行器）——与「判定机制」轴基本同义（机械算法⇄可自动化），合并进判定机制轴，作为该轴的现状注脚，不单列。
- **标注基数**（单标签/多标签并行）——证据里绝大多数方法是单标签，多标签只是少数变体（Multi-CoreSC CRA、ML Repro Checklist的"分类栏+自由文本栏"双栏设计），并入「产出锚点强度」轴的次要维度，不单列。
- **原始设计意图/生命周期阶段**（作者自查工具反用为读者工具 vs 天生读者审查工具）——与「评估取向」轴里的"报告核查"取向高度重合（Model Cards/Datasheets/ML Repro checklist正是"反用"才落进报告核查这一格），并入评估取向轴。

剩下7条通过验证，独立成轴。

### 验证后的7条轴线

**轴1・判定机制（Determinism）**
两端：机械算法可执行 ⇄ 纯定性自由裁量。中间态：domain内有规则、无综合整体规则。
代表案例：RoB2/ROBINS-I/GRADE（signalling questions→查表算等级，最接近可机械执行）；QUADAS-2/AMSTAR-2（domain内有规则但不合成数学化整体分数）；CASP/JBI/PRISMA/CONSORT/STROBE（Yes/No/Can't tell，无汇总算法）；Keshav/QALMRI（纯定性，无判定规则可言）。A1线的AZ/CoreSC/Swales落在中间偏algorithmic——类别定义清晰到可训练分类器执行（AZ最大熵分类器F1+23%、Swales GPT-4句级准确度93.33%、TDM tagger F1 62–76%），但标注动作本身仍是人工判断。

**轴2・产出锚点强度 / 结构化产出粒度（Anchor Strength）**
一条连续谱：无持久产出（Keshav）→ 自由文本工作表（QALMRI）→ 句子级单标签（AZ/CoreSC/CODA-19/PubMed200k RCT）→ span级强锚点+关系（SciERC、TDMS）→ 文档级多元组+coref+saliency二值标记（SciREX）→ 表格/等级判定（RoB2的"每结果×每时间点一行"、GRADE的SoF表）。
这条轴衡量的是"产出物离机器可读结构化记录有多远"，与轴1不完全绑定：AZ的判定机制偏algorithmic但产出只是句子级标签（谱中段），RoB2判定机制也algorithmic但产出是等级表（谱后段）——同样"有算法"，锚点强度可以完全不同，证明两轴独立。

**轴3・跨篇可对齐性（Cross-paper Alignability）**
两端：强（可横排成跨篇比较表）⇄ 弱（论文特异，排不成表）。
B1线已给出决定因素：**槛里填的是共享词表里的名字/固定等级，还是论文特异的自由散文**。强端案例：SciREX四元组（CoNLL03/BERT/F1这类跨论文复用的名字）、TDMS（标注规范明文写"whose meanings usually are consistent across different papers"）、ORKG模板（人事先约定属性表，代价是策管者间不一致）、RoB2/GRADE（字段与等级不随论文变）、句子级修辞角色如CODA-19（标签集固定且语义与论文内容无关，"这句是Method"这件事本身可跨篇聚合，即使Method里的散文内容不能）。弱端案例：CSFCube facet（产出是相关度排序不是记录）、SciERC关系实例（关系类型固定但实体无共享库）、NCG三元组（谓词自由抽取，需后处理规范化）、SciFact/ACU/Nugget（有改写步骤，但改写目标只是评估内部一致性，范围止步于单个claim/摘要/topic，出了这个范围仍是散文）。
与轴1的关系：不必然绑定，AZ有一定machinability但对齐性中等（聚合后内容仍是散文片段），说明真正决定对齐性的是槛的填充物类型，不是有没有判定算法——这是B1/B2两轮回报反复验证过的结论，此处确认为独立轴。

**轴4・领域绑定度（Domain Specificity）**
三态：医学生物医学专属 / ML·CS侧 / 跨领域通用可改编。
医学专属：RoB2/ROBINS-I/QUADAS-2/NOS/AMSTAR-2/GRADE/PRISMA/CONSORT/STROBE/ARRIVE/SPIRIT/JBI。ML/CS侧：ML Repro Checklist/NeurIPS checklist/REFORMS/Datasheets/Model Cards/TDMS/SciERC/SciREX/QASPER/SciFact。跨领域：PICO/TRIPOD（问题框架，可改编）、Keshav/QALMRI/Swales（阅读法本身学科无关）。
**与轴1呈系统性负相关，这是本轮四线调研里最重要的一条张力**：判定机制越严密（RoB2、GRADE），领域绑定越深；领域上适配我们（CS/ML论文为主）的那批（REFORMS、Model Cards、Datasheets）恰恰没有判定算法。这条负相关不是偶然噪音——A2线回报已用四条医学工具+三条ML清单的对比明确指出。但也有例外打破纯粹负相关（说明二者仍是可分的两条轴而非同一条轴的两个说法）：TDMS是ML侧且有较强algorithmic性（可训练tagger），AZ/Swales跨领域且部分algorithmic。

**轴5・评估取向（Evaluative Stance）**
四分类，非二元：
- 质量评判「做得好不好」——RoB2/ROBINS-I/QUADAS-2/NOS/GRADE偏倚风险工具。
- 报告核查「报没报」——PRISMA/CONSORT/STROBE/SPIRIT/ARRIVE/TRIPOD报告规范反用作阅读清单；ML Repro Checklist/REFORMS/Model Cards/Datasheets本是作者自查工具，反用后落进这一格。
- 内容摘述「讲了什么」——Keshav/QALMRI/AZ/CoreSC/Swales/CSFCube facet/SciERC/SciREX/TDMS，不评判好坏，只摘述论文说了什么。
- 证据验证「支持不支持某个声明」——SciFact/nugget/ACU，面向验证或评估任务的原子证据方法。
CASP/JBI混合了前两格——它们的"Can't tell"档实际上把"报告不足导致无法判断质量"这两件事糊在一起，A2线回报已指出这点。

**轴6・关注层次（Content Layer）**
三态：科学内容实体 / 论证修辞角色 / 工程元数据·可复现配置。
科学内容实体：CoreSC（Hypothesis/Method/Result等实体化的科学陈述）、SciERC/SciREX/TDMS（Task/Dataset/Metric/Method这类论文谈的对象本身）。论证修辞角色：Teufel AZ（AIM/BACKGROUND/CONTRAST这类"这句话在论证里起什么作用"而非"讲了什么事实"）、Swales move（Establishing territory/niche，纯功能性单位）、CODA-19/PubMed200k RCT（句子级修辞角色分类）。工程元数据：ML Repro Checklist/REFORMS/Datasheets/Model Cards（问数据集/代码/超参这些工程细节，不是论文的科学论证内容本身）。
这条轴解释了为什么轴3（跨篇可对齐性）里"句子级修辞角色"能排到强端——修辞角色本质上是关注层次3（论证功能）的产物，与论文谈的具体科学内容（层次1）解耦，所以天然不受"论文内容各异"的影响。

**轴7・聚合跨度（Aggregation Span）**
两端：单句独立标注（每个标注单位互不依赖）⇄ 跨句/跨段聚合成关系、元组或多行判定表（标注单位之间存在结构性依赖）。
单句独立：AZ/CoreSC/CODA-19，每句一个标签，句间无强制关联。跨句聚合：SciERC关系实例（两个跨句实体的Used-for关系）、SciREX四元组（99%跨句、55%跨节才能凑成一个Task-Dataset-Method-Metric记录）、NCG三元组（贡献句→短语→三元组，三层聚合，且NCG的一致性逐层崩塌67.92%→41.82%→22.31%正是"聚合跨度越大、人类专家越对不齐"的实证）、RoB2（"每结果×每时间点"一行，同样需要跨越试验报告的多处才能拼出一行判定）。
这条轴与轴2（产出锚点强度）相关但不同一：轴2问"产出物是什么形状"，轴7问"生成这个产物需不需要把分散信息粘合起来"——NCG的一致性崩塌数据直接说明聚合跨度是一个独立的难度来源，值得单列。

### 轴间张力小结（供排列阶段参考）

- 轴1×轴4 系统性负相关（严密性↔适用性），这是设计候选SOP时绕不开的取舍：想要CS/ML领域适配，多半要放弃"有判定算法"这个卖点，除非走TDMS/AZ/Swales这类"定义清晰到可训练但仍需人工标注"的中间路线。
- 轴3的真正决定因素来自轴6（关注层次3=修辞功能）与"槛填共享词表"（本身不是一条独立轴，是轴3的判据），排列阶段若要造出「强跨篇对齐」的候选SOP，抓手是轴6（往修辞角色或固定字段方向设计），而不是简单地"加更多机械判定规则"（轴1）。
- 轴7（聚合跨度）与NCG的实证数据绑在一起，是排列阶段判断"候选SOP会不会重蹈一致性崩塌"的现成检验标准——凡跨度覆盖轴7后段（多层聚合）的候选，都该在设计阶段就预期一致性会显著低于单句独立标注的候选。

七条轴线互相独立、各有实证支撑，出轴阶段到此完成。

---

## 排列 — 轴交叉矩阵

> 7轴全量交叉会爆炸（4×3×2×2×3×3×2 远超可读规模），按 `matrix-generation` 的"Start 2D"原则，先排主矩阵（评估取向×关注层次，两条最决定"SOP是什么"的轴），再排一张验证性副矩阵（跨篇可对齐性×关注层次，直接检验B1/B2那条"真正决定因素是关注层次不是判定机制"的结论）。其余5轴（判定机制/产出锚点强度/领域绑定度/聚合跨度）作为每格内的修饰标签列出，不参与交叉——这5轴更像是"同一个格子里的方法还能怎么分化"，硬拉平成8维矩阵反而稀释信号。

### 主矩阵：评估取向 × 关注层次（4×3=12格，占位/淘汰/空 全部分类完毕，无逻辑不可能格）

| | 科学内容实体 | 论证修辞角色 | 工程元数据/可复现配置 |
|---|---|---|---|
| **质量评判**（做得好不好） | 🟩占位：RoB2 / ROBINS-I / QUADAS-2 / NOS / AMSTAR-2 / GRADE；CASP・JBI（8/5套，混合格，主体在此） | ⬜**空**——候选：论证结构本身的质量判断（如"AIM是否被BACKGROUND充分证成"），证据里无方法做这件事 | ⬜**空**——候选：工程配置的"做得好不好"而非"报没报"（现有清单全是Yes/No/NA，没有质量分级） |
| **报告核查**（报没报） | 🟩占位：PRISMA / CONSORT / STROBE / SPIRIT / TRIPOD / ARRIVE；CASP・JBI（混合格，次体在此） | ⬜**空**——候选：修辞结构完整性核查（如"Intro是否三个Move都出现"），Swales本身是摘述工具不是核查清单 | 🟩🟩占位（本轮最密集的格）：ML Reproducibility Checklist(Pineau) / NeurIPS Paper Checklist / REFORMS / Datasheets for Datasets / Model Cards |
| **内容摘述**（讲了什么） | 🟩🟩占位：CoreSC / SciERC / SciREX / TDMS(TDMSci) / NCG三元组；CSFCube facet（★范畴修正：产出实为相关度排序非记录，标签定义可复用但任务形态错位） | 🟩🟩占位：Teufel AZ（7类/AZ-II 15类） / Swales move-CARS / CODA-19 / PubMed 200k RCT / NICTA-PIBOSO / CSAbstruct（标签名已知协议未查全） | ⬜**空**——候选：工程元数据的纯描述性摘要（如实抽取compute infra/模型规模/训练时长为事实陈述，不做Yes/No判定）；现有TDMS抽取的是Task/Dataset/Metric这类科学内容而非算力配置类字段 |
| **证据验证**（支持不支持某声明） | 🟩占位：SciFact / Nugget评估(AutoNuggetizer) / ACU(AutoACU) / ORKG comparison template（可对齐性强，兼具摘述与验证两用，主归此格） | 🟨**弱占位/边缘**：QASPER——证据选取跨段落无视修辞分区，判断"是否支持某问答"但不按修辞角色组织，勉强算部分覆盖，未见专门方法 | ⬜**空**——候选：可复现性的**验证**而非自查清单（如"README给的命令实际能否复现论文结果"，REFORMS/ML Repro Checklist都是作者自报Yes/No，没有第三方验证机制） |

**未落入本矩阵的方法**：PICO / PECO / SPIDER / FINER 四个问题框架不读论文内容，是定义"要问什么问题"的元层工具，不落入关注层次轴（它们既不摘述科学内容、也不判定修辞角色或工程配置，是生成研究问题本身的框架）——排除在矩阵外，作为脚注保留。

**密度与空格模式**：12格里8格占位（3格密集占位、5格单/双方法或混合格），4格空。空格呈明显集群：**质量评判列的后两格全空**（现有质量判断工具只会评判"科学内容/研究设计做得好不好"，没人去评判"论证修辞结构好不好"或"工程配置好不好"）；**论证修辞角色列的报告核查格空**（修辞分析类方法目前全部停留在"摘述"，没人把它反用成核查清单）；**证据验证列的工程元数据格空**（可复现性目前全靠自查，没有第三方验证方法）。三个空格模式共同指向同一件事：**当前方法论集中在"摘述"与"质量评判/报告核查×科学内容实体"这两块，验证类方法（证据验证列）与修辞角色的深度应用（质量评判/报告核查×修辞角色）都是欠开发区**。

### 副矩阵：跨篇可对齐性 × 关注层次（3×3，验证"关注层次是对齐性真正驱动因子"这条结论）

| | 科学内容实体 | 论证修辞角色 | 工程元数据 |
|---|---|---|---|
| **强对齐** | SciREX四元组 / TDMS三元组 / ORKG模板（人工约定，强但有代价） | CODA-19 / PubMed200k RCT / AZ / CoreSC / Swales（标签集固定、语义与论文内容无关，天然可跨篇聚合"这句是Method"这件事本身） | Model Cards / Datasheets / ML Repro Checklist（字段名固定，"是否报告了超参搜索范围"这件事跨论文可比，即使内容本身各异） |
| **中/弱对齐** | CSFCube facet（弱，产出是排序非记录） / SciERC关系实例（弱，实体无共享库） / NCG三元组（弱–中，谓词自由抽取需规范化） | （无实证案例——本轮40项证据里未见"弱对齐"的修辞角色方法，与"强对齐"格形成鲜明对比） | REFORMS的部分开放式条目（如3c"为何该数据集对当前任务有用"，本质是自由文本论证，字段名固定但内容不可比） |
| **强对齐但代价高/需人工** | RoB2 / GRADE / AMSTAR-2（字段与等级机械不随论文变，但需要专家执行signalling questions） | （无） | （无——工程元数据类目前没有"需要专家判断才能强对齐"的中间态，多是纯自查清单，判定门槛本身就低） |

**副矩阵证实的模式**：论证修辞角色这一列，本轮证据里**只出现在强对齐格**，中/弱对齐格完全空白——直接证实了A1/B1/B2反复得出的结论：修辞角色因为"语义与论文内容无关"而天然免疫"论文各异导致排不成表"这个弱对齐的根因。科学内容实体列则强/中弱都有案例，说明这条内容层面本身不能保证对齐，要看槛里填的是不是共享词表（SciREX/TDMS强，CSFCube/SciERC弱）——对齐性由"填充物类型"决定，而"填充物类型"这件事本身高度依赖关注层次（修辞角色的填充物永远是固定标签，科学内容实体的填充物可能是固定词表也可能是自由散文）。这就是主矩阵结论的独立复核：**关注层次是跨篇对齐性的上游因子，不是同一件事的另一种说法**。

### 修饰标签（附于主矩阵每个占位格，不单独交叉）

| 方法簇 | 判定机制 | 产出锚点强度 | 领域绑定度 | 聚合跨度 |
|---|---|---|---|---|
| RoB2/ROBINS-I/GRADE | 机械算法 | 表格/等级判定 | 医学专属 | 跨句聚合（每结果×每时间点一行） |
| QUADAS-2/AMSTAR-2 | domain内有规则、无综合算法 | 表格/等级判定 | 医学专属 | 跨句聚合 |
| CASP/JBI | 无算法 | Yes/No/Can't tell清单 | 医学专属 | 单条目独立 |
| PRISMA/CONSORT/STROBE/SPIRIT/TRIPOD/ARRIVE | 无算法 | 清单条目 | 医学专属（TRIPOD可改编） | 单条目独立 |
| ML Repro/NeurIPS/REFORMS/Datasheets/Model Cards | 无算法 | 分类栏+自由文本双栏 | ML/CS侧 | 单条目独立 |
| CoreSC/SciERC/SciREX/TDMS | 定义清晰、可训练分类器（部分机械） | 句子级单标签→span级强锚点→文档级多元组 | ML/CS侧 | 单句独立（CoreSC/AZ）→跨句/跨节聚合（SciERC/SciREX） |
| Teufel AZ/Swales/CODA-19 | 定义清晰可训练（AZ/Swales）、纯人工众包（CODA-19） | 句子/跨度级单标签 | 跨领域（Swales）/ML侧（AZ）/医学（CODA-19） | 单句独立 |
| SciFact/ACU/Nugget | 人工判断为主，部分LLM辅助 | 三元组+证据句/原子事实单元 | ML/CS侧（SciFact/ACU/Nugget均为NLP领域产物） | 单条目独立，但ACU/Nugget的"改写"步骤跨越reference set聚合 |
| Keshav/QALMRI | 无算法 | 无持久产出/自由文本工作表 | 跨领域 | 全文聚合（无中间粒度） |

### 排列阶段小结

矩阵产出：1张主矩阵（12格，8占位/4空，0逻辑不可能）+1张副矩阵（9格，用于交叉验证而非扩展候选空间）。4个空格是下一步`novelty-scoring`+`question-generation`的输入——它们不是随机空缺，而是集中在两类欠开发方向：①**把"摘述型"方法（AZ/Swales/CoreSC这类关注修辞角色或科学内容的描述工具）反用成"质量评判"或"报告核查"工具**（仿照Model Cards/Datasheets"自查清单反用为读者清单"的既有套路，但换到修辞/内容维度）；②**给"证据验证"补一条工程元数据分支**（可复现性的第三方验证，而非作者自查）。此外CSFCube的范畴修正、QASPER的边缘归属，提示矩阵边界本身也有几处需要在候选SOP设计阶段单独处理的"缝隙案例"，不能简单套用某个格子的现成模板。

排列阶段到此停止，未做排序、未写SKILL.md（按计划留给下一轮`convergence:multi-criteria-scoring`）。
