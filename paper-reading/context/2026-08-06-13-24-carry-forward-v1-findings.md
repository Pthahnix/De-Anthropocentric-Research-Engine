# Carry-Forward — v1 smoke test 挖出的真缺陷

> Created: 2026-08-06
> Topic: v1 公众号管线暂存时，把 smoke test 买来的教训单独提出来，作为 v2 单篇阅读法设计的硬输入
> Source: `staged/wechat-article-v1/tests/smoke-test-run1-log.md`（arXiv 2607.24653 Kimi K3，2026-07-31 跑）

## 为什么单独立一份

v1 整体暂存了，但 smoke test 挖到的东西不能跟着一起封存。那次跑出来的四条结论——三条缺陷、一条有效设计——是花了一次完整管线执行才换到的，而且每一条都直接约束 v2 的设计选项。封进 `staged/` 就等于下次重新踩一遍。

## 缺陷一：alphaxiv 工具的返回形态与「廉价第一遍」前提不符

`first-pass-skim` 的 prompt 要求「引用摘要里的主要结论」「记下图表标题」，前提是第一遍用 `get_paper_content`（不带 `fullText`）就能拿到可引用的原文。

实际返回的是 **AI 生成的结构化改写报告**，不是原文摘要、不是原文图表标题。只有换用 `answer_pdf_queries`（原设计里第二遍才用的工具）才拿到了逐字引文。

**对 v2 的约束**：任何要求「带原文锚点」的阅读法，其锚点获取步骤必须走 `answer_pdf_queries` 或 `get_paper_content(fullText=true)`。设计「先廉价扫一遍、再精读」的分层时，不能假设廉价那一层能产出可引用的原文——它只能产出方向判断（这篇是什么类型、值不值得深读、可能的切入点）。这条直接影响 Keshav 三遍法这类分层阅读法的第一遍能承诺什么。

## 缺陷二：为下游形状设计的 schema，抓不住论文自己的结构

四字段 bundle（problem / method / key_result / limitation）漏掉了三块内容：infrastructure、cost efficiency、competitive positioning。前两块在论文里各占一个独立结果子节（§6.4 是 Cost Efficiency 自己的小节），第一块是论文四条 headline contribution 之一。

根因是两层：

1. **schema 层**：四个字段是按「一篇解读文的四个段落」切的，不是按「论文自己怎么组织结果」切的。一篇评测章节跨 §6.1 公开 benchmark / §6.2 内部 benchmark / §6.3 第三方评测 / §6.4 成本效率四个子节的论文，第三、四块无处安放。
2. **指令层**：`second-pass-grasp` 说读 Intro / Method / Results，但没说对这种论文「Results 到哪儿为止」。不够仔细的第二遍会停在 §6.1，永远走不到 §6.4。

**对 v2 的约束**：这是 v2 存在的理由本身。固定 schema 的适配范围由「论文内部结构的复杂度」决定，不由字段数决定。v2 要测的正是：预设 facet 的固定 schema 与从论文自身结构涌现的 schema，各自在什么样的论文上失手。

## 缺陷三：recall 门回环后，supplement 可能无一手引文可锚

failure-routing 表把 `recall_fail` 路由到 `retry_deep_read_supplement`，措辞是「补充抽取，别从头重来」，读起来像只是补记账。

这次侥幸成立——那两块内容第二遍其实读到了，只是没进 bundle，页级引文还在手上。但如果第二遍当初根本没碰那块内容，就没有一手引文可锚，必须重新定向读一次。表的措辞低估了这个代价。

**对 v2 的约束**：任何带独立 recall 校验的阅读法，回环成本取决于「漏掉的内容第一次读时碰过没有」。这意味着 recall 门的价值与前置阅读的覆盖广度耦合——门本身不能补救一次覆盖过窄的阅读。

## 有效设计一条：先回摘、后重读参照物

`post-write-drift-check` 要求先把成稿回摘一遍、**然后**才去重读 bundle 做 diff。这个顺序抓到了一处真实丢失：起草时把 2.5x 训练效率这个 headline 数字整段丢了，而那段文字单独读毫无破绽——「看着对不对」式的检查必然放过它。

同理，`pre-write-recall-check` 要求**先**独立抽 nugget、**后**打开 bundle。这次三条漏项就是这么抓到的；锚定 bundle 再去核对的写法会跟原始起草犯同一个错。

**对 v2 的带入**：「独立提取先于对照」这个顺序，是校验步骤有效性的来源，不是流程洁癖。v2 里凡有校验，都保持这个顺序。这条与 `docs/temp/pipeline-preview.md` Stage 1 的双人独立提取 + 交叉核对是同一个道理。

## 与 v2 立足点的关系

v1 的四字段 schema 服务单一终点（出文章）。v2 的下游多一类——跨篇提取管线（`docs/temp/pipeline-preview.md`），它对单篇产出的要求是**跨篇可对齐**：字段语义不能因论文而异，且 Stage 1 明确禁止用目的性词汇（「为了解决 X」）当标签。

缺陷二说明：一个能服务「写文章」的 schema，未必能服务「跨篇对齐」，反之亦然。这两个下游对形状的要求可能根本冲突。v2 用一批不同阅读法横向测同一篇论文，就是为了把这个冲突测出来，而不是先赌一个形状。
