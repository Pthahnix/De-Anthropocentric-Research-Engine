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
