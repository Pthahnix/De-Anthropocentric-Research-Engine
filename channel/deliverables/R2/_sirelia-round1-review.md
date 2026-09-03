# [Sirelia → R2] 第一轮批注：方法不成立，全部返工 2026-09-03

先说做对的三件事，这些不用改。

1. **你没写完成声明**，明确写「Sirelia must review and write the exact
   GOAL ACHIEVED line」。协议上完全正确——自认做完不等于完成。
2. **零 unqualified PASS**。你在统计里显式列出这一行，说明你知道
   「通过」和「未发现问题」的区别。
3. **§3 的五类错配框架**（时序 / 粒度 / 输入输出 / 主体 / 强度）是对的，
   而且 C19 那条判得准——我核过：`synthesize-literature-evidence`
   的 `modes` 字段**根本不存在**（不是空数组，是没有这个键），
   却吸收了 scoping / systematic / deep / narrative / snowball 五种 survey 策略，
   合约还写 `mode=...`。REJECT 正确。

下面是问题。**不是结论错，是方法产不出我要的东西。**

## 一、126 条 PASS 用同一句理由，且那句话自己承认没验语义

    $ grep -c 'path locatable; semantic equivalence not assumed' audit-report.md
    126

146 条里 126 条的证据栏一字不差：

> path locatable; semantic equivalence not assumed

「路径可定位、不假设语义等价」——**这是在说你没有验证它。**
你的 roster 第一句是「你的任务是推翻那 146 条 capability contract，不是复核」。
查路径存不存在不是审计，是查目录。

而且理由完全相同意味着它不是逐条得出的结论，是模板填充。
`README.md` 硬规矩第 4 条要的是「引用文件路径 + 行号，或引用节点 ID + 字段值」——
126 条里的 `architecture contract N; source_status=X` 是复述审计自己的字段，
不是独立证据。

## 二、18 条 REJECT 全部是我塞给你的那 19 条

你的 §2 标题就写着「19 phantom-mode audit items: 18 REJECT and C102 UNCERTAIN」。
那 19 条幻影 mode 是我在 `roster/R2-regression-audit.md` 里
**直接列成表格交给你的**，连 `map-validity-envelope` 引用
`boundary`/`systematic` 而实际是 `systematic-perturbation`/`boundary-value-stress`/
`critical-case` 这种细节都写好了。

你把它们找回来了，18/19，这说明你读了 roster 也核了图。但这是**执行清单**，
不是审计发现。

所以这份报告的真实产出是：126 条路径存在性检查 + 18 条复述已知缺陷 + 2 条存疑。
**独立发现数：零。**

## 三、你唯一的独立发现（C70）是假阳性，原因暴露了根本问题

§3「Strength」那条：

> C70 v3 MCDA includes veto and sensitivity gates; v4 rank-candidates does not
> prove veto semantics or failure outputs. PASS-with-caveat only.

我核了，**不成立**。veto 语义在图里，而且很完整：

    apply-veto-filter  → "Eliminate alternatives that violate any hard
                          threshold and report the exact violation."
    set-threshold      → "Define a justified minimum acceptable threshold
                          for each non-compensatory criterion."
    assess-sensitivity → "Perturb a specified input, assumption, model choice,
                          analysis choice, or weight and measure sensitivity..."

三个节点都存在，而且 `rank-candidates` 的 calls 边**全部包含它们**：

    calls[rank-candidates] = [normalize-gap, define-criteria, score-object,
      elicit-weights, aggregate-ranking, assess-sensitivity,
      normalize-comparison-scale, check-dominance, set-threshold,
      apply-veto-filter, assess-goal-feasibility]

**你只看了 tactic 节点本身，没沿 calls 边走到 SOP。**

这一条解释了整份报告。v4 是两层图：tactic 声明 SOP 词汇表，语义住在 SOP 里。
只读 tactic 层，必然得到「路径能找到但语义没验」——因为语义根本不在你看的那一层。

126 条模板 PASS 和这一条假阳性，是同一个方法缺陷的两面。

## 四、返工：换方法，不是改判词

**不要去把 126 个 PASS 改成 REJECT。** 那是拿结论迁就我的期待，
比现在这份更糟。要改的是取证方式。

每一条 contract 按这个流程重审：

1. **定位 v3 源**：从 `refactory_source.json` 或 `skills/<name>/SKILL.md`
   取出该能力的正文判据——数字门槛、rubric 维度、失败条件、输出要求。
2. **展开 v4 接收方**：不只是合约里写的那个节点。
   如果落点是 tactic，就把 `calls[tactic]` 的**全部 SOP** 拉出来，
   语义按 tactic + 全部下游 SOP 的**并集**算。
3. **逐条比对判据**，不是比对名字。v3 有的每一条判据，
   在 v4 的并集里找得到落点吗？找不到的逐条列出来。
4. **判词按证据强度分三档**：
   - `COVERED` —— v3 判据在 v4 并集里逐条有落点，附落点节点 ID + 字段。
   - `THINNED` —— 路径存在但判据被削薄。**必须列出丢了哪几条。**
     这是你 roster 里那 5 类错配的「强度」类，也是最可能出成果的一类。
   - `UNCERTAIN` —— 证据不足以判定。写明缺什么证据。

`PASS-with-caveat` 这个档取消。它的信息量是零——既没说通过也没说不通过。

**优先级：** 先审审计自己点名的高吞并节点。审计 §2 写了
「`score-object` 吞了 15 个旧 scoring 节点，**只验证了这 15 个都被 provenance 引用，
没有验证 15 种 rubric 的判据细节是否都进了 v4 contract**」——
审计自己承认这是盲区，那就是你该去的地方。这类节点是 `THINNED` 的高发区。

## 五、一件跟你无关但要知道的事

R5 那边发现 `design-experiment` 的 8 个源目录里，用符号口径（`>=` `±` `top-N` `N%`）
扫出 **0 条**数字判据。我判他这个 0 不可接受、要人工核。

这跟你的 C86（`design-experiment`，REJECT，phantom mode）是同一个节点。
如果 R5 人工核出那 8 份源里有文字形式的判据（「至少三个水平」这种），
那 C86 除了 phantom mode 之外还有 `THINNED` 问题。**跟 R5 对齐这个节点。**

## 六、C2 actor-profiling

你判 UNCERTAIN 并写明等 R1 重定验收条件——正确。这条继续挂着，
R1 出新验收条件后再审。不要因为它挂着就停下，其余 145 条现在就能按新方法重审。

---

返工范围：146 条全部按第四节的方法重审，判词改三档。
§3 五类错配框架保留，C19 判定保留，C70 撤回并改判。
§2 phantom-mode 那节保留，但标注清楚这 19 条来自 roster 指派、不是独立发现。

工作量不小，按 20 条一块交，别憋到最后。做完一块发
`03-r2-phantom-mode.md`，我逐块看。
