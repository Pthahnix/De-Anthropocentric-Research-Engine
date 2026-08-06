# 📰 paper-reading

**paper-reading** 专做一件事：**把一篇指定论文读成结构化的东西**。

> 本目录是 [paper-reading 独立仓库](https://github.com/yogsoth-ai/paper-reading) 在 DARE 主仓的镜像。与 `literature-engine`、`deep-insight`、`knowledge-acquisition` 同为独立 package——单独构建、单独测试，稳定后注册进 DARE。

## 当前状态：v2 重构中

v1（单篇论文 → 微信公众号文章的固定三段式管线，18 个 skill）已在独立仓库整体暂存，恢复锚点为分支 `v1-wechat-pipeline`。本镜像不再收录 v1 skills 与其架构图——避免与 v2 立足点并存造成误读，需要时从独立仓库取。

v2 换了立足点。v1 只服务一个终点（出一篇文章），schema 是为「写文章好用」设计的；v2 要做的是**一批彼此不同的单篇阅读法**，各自产出不同形状的结构化物，用同一篇论文横向测——测出哪种形状真的扛得住下游需求，再谈优化。

下游有两类，形状要求不同：

- **单篇终点** — 出一篇解读、一份精读笔记、一次质量审计
- **跨篇起点** — 喂给跨篇提取管线，此时单篇产出必须**跨篇可对齐**，字段语义不能因论文而异

v1 的 smoke test 已经证明这两类要求可能冲突：一个能服务「写文章」的四字段 schema，漏掉了论文自己用独立子节讲的 infra 与 cost efficiency（详见 `context/2026-08-06-carry-forward-v1-findings.md`）。v2 不先赌一个形状，先把冲突测出来。

## v2 的 skill 来源

两条线，都是成文、可引的方法论，不自造：

| 线 | 内容 |
|---|---|
| **人类学界的成文阅读法** | Keshav 三遍法、QALMRI、Teufel argumentative zoning、CoreSC、Swales move analysis、CASP / JBI / RoB2 等批判性评估工具、ML Reproducibility Checklist、PRISMA 抽取表 |
| **NLP 的单篇结构化抽取** | CSFCube facet、SciERC / SciREX、TDMS 抽取、QASPER 证据定位、SciFact、ACU / 原子事实分解、nugget 评估、CODA-19 |

每条方法论先做成**初始形态的 skill**，先能跑，再逐个测、逐个优化。不预先套四层架构——层级由实际用法归纳，不由设计预判（论证见 `context/2026-07-29-18-19-paper-reading-pkg-scoping.md` 的红队 checkpoint）。

## 调研记录

| 文件 | 内容 |
|---|---|
| `context/2026-07-29-18-19-paper-reading-pkg-scoping.md` | v1 前置调研：DARE 内部谱系盘点、外部方法论横评、「涌现式建 skill」方案的红队审查 |
| `context/2026-08-06-carry-forward-v1-findings.md` | v1 smoke test 挖出的真缺陷，v2 的设计输入 |
