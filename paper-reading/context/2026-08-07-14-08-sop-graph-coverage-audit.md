# 22-SOP Pipeline 图 对 46 方法论的覆盖度审核

> Created: 2026-08-07 14:08
> 审核对象：`2026-08-07-13-42-sop-pipeline-graph.html` 的 v1 初版（22 节点 / 7 边）。**该文件已按本报告修补为 v2（31 节点 / 22 边），报告结论描述的是修补前状态。**
> 基准：`2026-08-07-10-26-sop-menu-final.md`（46 方法 + 7 轴 tag 表）、`2026-08-06-16-35-single-paper-reading-sop-research.md`（原始核实细节）
> 结论：**点名覆盖 46/46，可执行覆盖约 30/46（65%）。图是一张正确的分类图，但还不是一张可执行的 pipeline 图。**

## 1. 审核方法论

### 1.1 "完整覆盖"的判定标准

我不采用"每个方法名是否在图里出现过"作为覆盖标准——那只是点名（roll call），不是覆盖。我用四级标准，逐级递进，**只有过了 L4 才算被覆盖**：

| 级别 | 判据 | 检查方式 |
|---|---|---|
| **L1 点名** | 方法名出现在某节点的 `methods[]` 或某边的 `methods[]` 里 | 对 46 个名字做集合差 |
| **L2 路径完整** | 从入口节点沿边可走到终点，且路径上节点的并集覆盖该方法的**全部动作类型**（读取→判定→聚合→产出） | 对每个方法在原始文件里列出其动作序列，逐个动作找归属节点 |
| **L3 顺序与依赖正确** | 路径上的节点顺序符合原方法的因果/数据依赖；前置条件（选工具、定范围、切分单元）有节点或有明示 | 检查边方向；检查是否存在"无入边但实际有前置动作"的节点 |
| **L4 产出等价** | 沿该路径执行完，产出物与 tag 表"产出锚点强度"列声明的形状一致 | 拿 tag 表的产出列逐条比对路径终点的 `desc` |

**同构性判据（用于评合并粒度）**：两个方法可共享一个 SOP 节点，当且仅当把差异**参数化后**，执行者的动作序列、每步的输入输出类型、值域结构（几值、是否有分支）全都相同。仅"看起来都是清单"不够——值域数目不同（3 值 vs 4 值）可参数化；**动作序列长度不同（单步 vs 级联）不可参数化**，这是我判"过粗"的硬线。

### 1.2 核查流程

1. 从 HTML 源码的 `nodes` / `edges` 两个数组抽出结构化数据（22 节点、7 边、方法名共 51 处出现——含 2 个提案各出现 2 次的正常重复）。
2. 与 menu 的 46 项做集合差 → L1 全通（见 2.1）。
3. 对 46 个方法逐个回原始调研文件，写出它的**原始动作序列**（例：RoB2 = 选定结果×时间点 → 选效应类型分支 → 答 signalling questions → domain 查表 → 取最严重 domain），再把每个动作映射到图上节点 → 得 L2/L3/L4 判定。
4. 对每个多方法节点做**内部同构性检验**：把节点内各方法的动作序列并排比，看差异能否被 `desc` 里声明的参数化开关吸收。
5. 反向检查：图上每条边是否必要、每个节点是否可执行、有无本可合并却拆开的。

---

## 2. 总体结论

### 2.1 L1 点名：46/46 全通，无遗漏

逐一比对无缺失、无幻造。节点方法数分布：A2=9、B=12、A3=6、A1=6、question-framing=4、C1=2，其余 16 节点各 1。（`rhetorical-completeness-check` 与 `rhetorical-structure-quality` 各在 2 处出现，是"经过多节点"的正常表示，不是重复计数错误；但 51 ≠ 46，**节点 `methods[]` 长度求和不能当覆盖数用**，做统计时需去重。）

### 2.2 L2–L4：约 16 个方法不达标

| 判定 | 数量 | 方法 |
|---|---|---|
| **L4 通过（真覆盖）** | ~30 | A2 的 8 个报告/评估清单、A3 的 5 个自查清单、B 的 6 个句子级分类（AZ/CoreSC/CODA-19/PubMed200k/PIBOSO/CSAbstruct）、TDMS、qalmri、question-framing 的 PICO/PECO/SPIDER、rob2/robins-i、nos（部分）、qasper、nlp-contribution-graph、claim-verification（部分）、reproducibility-third-party（提案）、rhetorical-structure-quality（提案） |
| **L3 失败（路径/依赖错）** | 6 | grade、quadas-2、amstar-2、keshav-three-pass、scifact-claim-verification、rhetorical-completeness-check |
| **L2 失败（缺动作节点）** | 6 | acu-atomic-content-unit、nugget-evaluation、scierc、scirex、swales-move-analysis、coda-19（缺切分步） |
| **仅 L1（节点自认不可执行）** | 2 | csfcube-facet、orkg-comparison-template |
| **合并后语义丢失** | 2 | engineering-config-grading（提案）、finer |

一句话总结：**"独立单步"那批（清单类、句子分类类）覆盖得很干净；"级联多步"那批（GRADE、SciREX、ACU/Nugget、SciFact、Keshav）几乎全部被压扁成单节点，压扁处就是覆盖漏洞。**

---

## 3. 逐条问题清单

### 严重（S）——沿图执行会产出错误结果或根本跑不出来

**S1. GRADE 挂在节点 A1 下游，是范畴错误，且复活了调研文件明确否决的 Cochrane 流水线。**
- 方法：`grade`；节点/边：`bias-risk-domain-scoring → grade-aggregate`
- GRADE 的评估对象是**跨研究的证据体（body of evidence per outcome）**，不是单篇论文。它的 5 个降级因素里，不一致性（inconsistency）需要多研究间的异质性、不精确性需要合并效应的 CI 宽度、发表偏倚需要漏斗图——**这三样在单篇论文里不存在输入**。A1 产出的是单篇的 domain 级信号答案，喂不出 GRADE。
- 更严重的是：调研文件第 190 行明确写"子 agent 最后给的 SOP 化建议我不采纳——它把三类工具直接串成一条医学系统综述的流水线（选工具 → 逐 domain → GRADE → ...），这是照搬 Cochrane 工作流，不是我们要的东西"。图上这条边正是那条被否决的串联。
- 且 GRADE 的产出按 tag 表是 **Summary of Findings 表**（每 outcome 一行，含相对+绝对效应、参与者数、确定性等级+理由脚注）；`grade-aggregate` 的 desc 只写了加减算术，没有任何节点产出 SoF 表 → L4 也不通。

**S2. Keshav 三遍法被改写成了本项目自己的 pipeline，第三遍被降级为可空转的 no-op，原方法无法执行。**
- 方法：`keshav-three-pass`；节点：`second-pass-grasp`、`third-pass-verify`
- 原方法（研究文件第 200 行）：第二遍约 1 小时，抓图表与实验结果、能向同行总结主要贡献；**第三遍 4–5 小时以上，逐句重读含证明、virtual re-implementation、标出隐含假设与可改进点，达到"能重现"的掌握程度**。第三遍是三遍里最重的一遍。
- 图上：`second-pass-grasp` 声称产出"结构化 bundle 草稿 + uncertain_fields"，`third-pass-verify` 是"针对 uncertain_fields 做定向复核；若无标记字段则空转过（no-op）"。
- 两处失真：①Keshav 是 46 项里**唯一不产出任何持久化结构化物**的方法（研究文件原话），"结构化 bundle"是本项目 v1 的产物，不是 Keshav 的；②把 4–5 小时的重现级精读换成"复核不确定字段，没有就跳过"，等于删掉了第三遍。按图执行 keshav-three-pass，产出的不是叠进式深度理解。
- 这是全图唯一一处**把项目自身设计倒灌进方法定义**的地方，比单纯缺节点更危险，因为它看起来是完整的三节点级联。

**S3. QUADAS-2 的"双评"结构（偏倚风险 + 适用性关注）在图上完全不存在。**
- 方法：`quadas-2`；节点：`bias-risk-domain-scoring`（无出边）
- 原结构：4 个 domain，D1–D3 **同时评「偏倚风险」与「适用性关注」两个独立判定**，D4 只评风险 → 一次评估产出 7 个 domain 级判定。A1 的 desc 只描述了信号问题作答，没有双轴，也没有"哪些 domain 走双轴"的参数位。
- 图注解释"QUADAS-2 无汇总步骤，domain 级即终点，故不入节点 D"——终点判断对，但**terminal 的那个 domain 级判定本身没有节点生成它**（见 S4）。

**S4. A1 → D 之间缺失"domain 级判定"这一层，RoB2/ROBINS-I/QUADAS-2 的核心算法悬空。**
- 方法：`rob2`、`robins-i`、`quadas-2`；节点/边：`bias-risk-domain-scoring` → 各 D 节点
- 这三个工具的算法是**两级**：①signalling answers → 查表得 **domain 级**等级；②domain 级等级 → 整体等级。图上 A1 = 作答，D = 整体，**第①级的查表算法没有归属**。它既不在 A1 的 desc（只写作答与分支），也不在 D 的 desc（rob2-aggregate 写的是"取最严重 domain 作为整体等级"，前提是 domain 等级已存在）。
- 后果：QUADAS-2 因为没有第②级而完全无出边，它需要的恰恰是缺失的第①级——所以它在图上停在"答完了问题"，永远拿不到 domain 判定。

**S5. ACU 与 Nugget 评估缺聚合/评分节点，C1 是死胡同。**
- 方法：`acu-atomic-content-unit`、`nugget-evaluation`；节点：`atomic-unit-writing-matching`（C1，无出边）
- ACU 是 **recall-based 协议**：匹配完所有 ACU 后要算归一化 ACU recall（摘要级分数）。Nugget 评估要算 nugget recall（vital/okay 加权），再**做 run-level 排名**——tag 表给的聚合跨度就是"跨 reference-set 聚合"，论文的可信结论恰恰只在 run level（τ=0.887）成立，per-topic 不可信（τ=0.297–0.438）。
- C1 停在"逐单元二元/三元匹配"，没有任何节点做求和/归一/排名。这与 A1→D 的处理方式自相矛盾：那边把聚合算法单独立了 5 个节点，这边同样需要聚合却一个都没有。按图执行 nugget-evaluation，拿不到它唯一可信的那个产出。

**S6. SciREX 与 SciERC 被塞进单层分类节点 B，与图自己的拆分标准冲突。**
- 方法：`scirex`、`scierc`；节点：`unit-classification`
- SciREX 是四阶段级联：mention identification → coreference clustering（文档级）→ salient entity 分类（"是否进了结果四元组"）→ N 元关系抽取。四元组 **99% 跨句、55% 跨节**。SciERC 是嵌套 span 识别 → coref 链 → 成对关系分类。
- B 的 desc 是"逐句/逐 span 读取 → 按固定标签集分类"，参数化开关只有"标签集 / 层级开关 / 关系元组抽取开关"。一个布尔开关吸收不掉 coreference 聚类和 saliency 判定——这两步的输入是**全文已有的所有 mention**，不是当前句。
- 自相矛盾之处：图把 `nlp-contribution-graph` 单独拆出来，理由写的是"三层级联，非节点 B 单层分类，结构在 44 条里唯一"。SciREX 的级联层数比 NCG 还多，却留在 B 里。**同一条判据在两处给出相反结论。**

**S7. SciFact 缺"证据句选取"节点，产出不完整。**
- 方法：`scifact-claim-verification`；节点：`claim-verification`（C2）
- 原结构是三段：abstract retrieval → **rationale（证据句）selection** → label prediction，产出是 Claim-Abstract-Label 三元组**加 rationale 句**（rationale 一致性单独报 κ=0.71）。tag 表的产出锚点也写明"三元组+证据句"。
- C2 的 desc 只有"citance 盲改写成原子声明 → 三分类判定"，证据句选取无节点 → L4 不通。
- 附带：claim 源自**引用句（citance）**，即需要"引用了该论文的另一篇论文"作为第二输入。图作为单篇阅读 SOP 没有表达这个输入前提。

### 中等（M）——合并粒度或依赖关系有问题，执行会失真

**M8. 节点 A1 把 6 个非同构工具合并了，其中 3 个不该在这里。**
- 方法：A1 的 6 个；节点：`bias-risk-domain-scoring`
- 真正同构的只有 **RoB2 + ROBINS-I**：都是 domain × signalling questions，5 值域（Yes/PY/PN/No/NI），域数与标签可参数化。
- 不同构的：**NOS** 不答信号问题，它是**逐条目授星**（选择 4 星 / 可比性 2 星 / 结果 3 星），值域是"给不给星"而非 5 值信号答案——A1 的 desc 里没有"授星"这个动作，`nos-aggregate` 却直接开始求和，**星是谁给的没有节点**。**AMSTAR-2** 是 16 条清单项，答 Yes/Partial Yes/No，它的"域"就是清单条目，结构上属 A2 家族而非 A1（研究文件把它与 QUADAS-2 并列为"domain 内有规则、无综合算法"，但那是说判定机制，不是说它有信号问题）。**GRADE** 见 S1。
- 判定：A1 **过粗**，应为 RoB2/ROBINS-I/QUADAS-2 一组（signalling-question 家族），NOS 与 AMSTAR-2 各自另置或归 A2。

**M9. 节点 A2 跨了两种评估取向、两种条目结构，是全图最粗的一次合并。**
- 方法：casp、jbi、prisma、consort、strobe、arrive、spirit、tripod、rhetorical-completeness-check（提案）；节点：`checklist-yes-no-scoring`
- 三个问题：
  1. **评估取向不同**。tag 表里 casp/jbi = 混合（质量评判为主），consort/strobe/arrive/spirit/tripod/prisma = 报告核查。前者问"做得好不好"，后者问"报没报、报在哪页"。同一个 Yes 在两类里语义不同（"方法正确"vs"该项已披露"）。
  2. **CASP/JBI 的整体评估无节点**。CASP 三段式（A 筛选 → B 方法学质量 → C 本地适用性），A 段是**门控**（筛选不过就不继续）；JBI 每套末尾有 include/exclude/seek-further-info 的整体裁定。A2 的 desc 明写"判定即终点，无汇总算法"——对报告规范成立，对 CASP/JBI 不成立。对比 AMSTAR-2 给了专门的 aggregate 节点，这里的处理不一致。
  3. **报告规范是作者向清单，反用需要条目改写**。CONSORT 25 条 / PRISMA 27 条含 a/b 子条目，是层级结构；A2 的值域是扁平 2–4 值。层级可参数化，但"报告在第几页"这个 CONSORT 原生栏位在 2–4 值域里放不下。
- 判定：A2 **过粗**，至少应按评估取向拆为"质量评估清单（含整体裁定出边）"与"报告规范核查清单"两族。

**M10. 节点 D 拆得过细，5 个聚合节点里 3 个是同一算法。**
- 方法：rob2、robins-i、amstar-2；节点：`rob2-aggregate`、`robins-i-aggregate`、`amstar2-aggregate`
- rob2-aggregate = 取最严重 domain（3 值）；robins-i-aggregate = 取最严重 domain（5 值）。**同一个算法，值域不同**——正是图在 A1/A2/A3/B 里用参数化吸收掉的那种差异。amstar2-aggregate 的"≥1 个关键域缺陷 → Critically Low"也是 worst-case 规则，只是先按"是否关键域"过滤一遍，属同族的加权变体。
- 真正结构不同的只有 nos-aggregate（求和分档）与 grade-aggregate（起点±因子）。
- 判定：D **过细**，可收为 2–3 个（worst-case-lookup / sum-threshold / start-plus-delta）。与 A2 把 9 个方法压成 1 个节点相比，这里的粒度标准明显不一致——**同一张图内部两套粒度尺**。

**M11. 全图缺"工具选择 / 适用性门控"节点，而它是 A1/A2 多数方法的硬前置。**
- 方法：casp（8 套）、jbi（约 6 套）、nos（2 版本）、rob2（平行/聚类/交叉扩展版）、grade（起点取决于设计）、robins-i、quadas-2
- 这些工具全是**设计条件式**的：先判研究设计，再选对应条目集/域集，选错则整套判定无效。CASP 8 套之间条目数与分段都不同，不是同一个参数化实例的不同取值，而是先有一个分派决策。
- 图上无此节点，所有 A1/A2 节点都是"无入边直接开始"。对本项目（CS/ML 论文为主）这个缺口尤其致命——研究文件第 185 行明确写"医学血统那批的多数 domain（分配隐蔽、盲法、意向治疗分析）在一篇 LLM 论文上无从下手"，图上没有任何位置能表达"该工具对本文不适用"。

**M12. RoB2 的"每结果×每时间点一行"迭代范围无节点表达。**
- 方法：`rob2`（`grade` 同理，每 outcome 一行）；节点：A1 与 rob2-aggregate
- RoB2 的应用粒度不是整篇论文，而是**每个结果 × 每个时间点**，一篇论文产出一张多行表；且 D2 有两个分支（意向治疗 vs 依从性），选哪支**取决于要估哪种效应**——这是一个必须在作答前完成的前置决策。
- 图把整条链画成单次线性执行，没有循环/扇出，也没有"选定结果与效应类型"的前置节点。A1 的 desc 只把 D2 分支当成"节点内含分支逻辑"提了一句，但那个分支的**决策依据在节点外**。
- 后果：按图执行，rob2 产出一个判定，而 tag 表要求的是一张表 → L4 不通。

**M13. `rhetorical-completeness-check` 走 B → A2 这条边，落进了一个判定机制不兼容的节点。**
- 方法：`rhetorical-completeness-check`（提案）；边：`unit-classification → checklist-yes-no-scoring`
- 该提案的清单条目**由上游标签集反推生成**（"Swales 三个 Move 都出现了吗"），即条目集是上一步产出的函数，不是固定外部清单。而 A2 的参数化位是"清单条目集"，预期是给定常量。
- 更关键的是判定机制：这一步实质是**标签集合的差集运算**（期望角色集 − 实际出现角色集），tag 表标它"部分规则"；A2 里其余 8 个方法全是"定性无算法"。把机械集合运算和人工定性判断放同一节点，节点语义不成立。
- 判定：这条边方向对（依赖 B 的产出），但终点节点选错了。

**M14. `engineering-config-grading` 合进 A3 后，它要填的那个矩阵空格就没了。**
- 方法：`engineering-config-grading`（提案）；节点：`dual-column-self-check`（A3）
- 该提案的存在理由是填"**质量评判 × 工程元数据**"这一格——现有清单全是"报没报"的 Yes/No，它要的是"报得完整/部分/无"的分级。A3 是报告核查节点，desc 用"分类栏值域（二元或分级）"这个参数位把它吸收了。
- 但**值域从二元变分级，不等于评估取向从报告核查变质量评判**。"超参搜索范围报告完整度=部分"这个判定需要评估者先建立"完整应该是什么样"的标准，这是 A3 其余 5 个方法都不做的动作。参数化只吸收了产出形状，没吸收判定动作。
- 判定：合并过粗，导致 menu 里 4 个补齐提案中只有 2 个（rhetorical-structure-quality、reproducibility-third-party）在图上保住了独立结构。

**M15. FINER 与 PICO/PECO/SPIDER 不同构。**
- 方法：`finer`；节点：`question-framing`
- PICO/PECO/SPIDER 是**槽位填充**（填 Population/Intervention/... 各槽）。FINER（Feasible/Interesting/Novel/Ethical/Relevant）是**对一个已有研究问题的五项评判**——每项是判定不是填空，研究文件也标它"评研究问题本身而非论文"。
- 节点 desc 写"四者结构一致，合为一个参数化 SOP"，这一句对前三个成立，对 FINER 不成立。FINER 结构上更接近 A2 的清单判定。

### 轻微（L）

**L16. `csfcube-facet` 与 `orkg-comparison-template` 两个节点在自己的 desc 里就宣告了不可执行**，等于占位而非覆盖。csfcube 是**多文档成对相关度排序**（单篇场景里没有对比对象），可复用的只有 3 个 facet 的句子级标签定义——那部分应该作为 B 的一个标签集参数，而不是留一个跑不动的独立节点（这是**过细**：不可执行的空壳节点占了 2/22 的节点预算）。ORKG 实际含两个动作：建模板（众包，不可执行）+ **往已有模板填论文（可执行的槽位抽取）**；图只保留了不可执行的那半，把可执行的那半丢了。

**L17. CODA-19 缺"子句切分"前置步。** CODA-19 是**句/子句级**标注（103,978 句 → 168,286 个片段），切分是标注前的独立步骤；B 的 desc 只有"逐句/逐 span 读取"，没有切分开关。另外 CODA-19 的众包协议是每摘要 9 人重复标注 + 多数投票聚合，这个聚合步在图上也无位置（若把众包视为实现细节可忽略，但它是该方法达到 κ=0.741 的机制本身）。

**L18. Swales move analysis 在 B 里丢了两个特征。** ①适用范围仅**引言**（CARS 模型），不是全文逐句——B 无范围参数；②move 是**功能单位**，可跨句、且 move/step 是层级关系，B 的"层级开关(move/step)"提到了这点，但产出是"跨度级标记"而非句子级单标签，与同节点其余方法的产出类型不同（tag 表已把它单列为"跨度/句子级标记"）。

**L19. 反用型清单的条目取向反转未声明。** model-cards、datasheets、consort、strobe、arrive、spirit、tripod、prisma 原本都是**作者向撰写规范**，menu 明确说是"反用作读者核查工具"。A2/A3 直接把条目当作可判定的疑问句，没有"条目反转"这个参数或步骤说明。可以在条目集定义里预先做掉，但应写明，否则实现时会直接把撰写指令当问题问。

**L20. `reproducibility-third-party-verification` 缺前置依赖声明。** 该提案要"核对复现结果与论文所报数值是否一致"，前提是先有一份论文所报数值的结构化抽取（TDMS/SciREX 那类）。图上它是孤立节点、无入边。它的判定机制标"机械算法"也依赖这个输入存在。

**L21. 元数据数字不自洽。** HTML 头部写"44 个已核实方法 + 4 个补齐候选（共 46 个方法论）"——44+4=48≠46；menu 的实际构成是 42+4=46。`nlp-contribution-graph` 的 desc 里"结构在 44 条里唯一"沿用了同一个错数。另 `INDEX.md` 记录该图为"19 个 SOP 节点"，实际是 22（A 拆成 3 个后未回改索引）。

**L22. 节点覆盖数不可直接求和。** 22 个节点的 `methods[]` 长度合计 51，含 2 个提案各自的 2 次出现（B→提案、B→A2）。表示法本身正确（经过几个节点就出现几次），但 UI 上"覆盖方法（N）"这个计数容易被当成去重后的方法数使用。

---

## 4. 合并粒度总评

**过粗（5 处）**：A2（9 方法跨 2 种评估取向 + 缺 CASP/JBI 整体裁定，M9）> A1（6 方法混 3 种判定结构，M8）> B（12 方法混单层分类与多阶段级联，S6）> A3 吸收 engineering-config-grading（丢矩阵格，M14）> question-framing 吸收 FINER（判定当填空，M15）。

**过细（3 处）**：D 的 5 个聚合节点里 3 个同算法（M10）；csfcube-facet 与 orkg-comparison-template 两个自认不可执行的空壳节点（L16）。

**根因**：图的合并判据在两个地方被不一致地使用。①"结构唯一就拆"这条：NCG 因三层级联被拆出，SciREX/SciERC 同样级联却留在 B。②"差异可参数化就合"这条：A2 用它吞下 9 个方法（含评估取向差异），D 却不用它合并两个同算法节点。**建议把判据固化为"动作序列长度相同 → 可合并；不同 → 必拆"，然后全图重跑一遍**，A1/A2/B 会往下拆，D 会往上合。

---

## 5. 修补优先级

1. **S2 Keshav**：先改，因为它是"看起来完整、实际是别的东西"，最容易被后续实现直接采信。
2. **S1 GRADE**：要么移出单篇 SOP 范围（标记为需跨篇输入），要么明确降级为"读论文里已有的 GRADE 评级"。
3. **S4 domain-judgment 节点**：补一个 A1→（domain 级判定）→D 的中间节点，QUADAS-2 的终点、NOS 的授星步、RoB2/ROBINS-I 的查表全落在这里。
4. **S5 / S7**：C1 补聚合节点（recall 计算 + run-level 排名），C2 补 rationale 选取。
5. **S6**：SciREX/SciERC 从 B 拆出，与 NCG 一起归入"多阶段级联抽取"族。
6. **M11 工具选择门控**：补一个全局前置节点，同时承载"本文是否适用该工具"的判定——对 CS/ML 语料是刚需。
7. M9/M8 拆分、M10 合并、M14/M15 复原：结构性重整，可在上述修补后一并做。
