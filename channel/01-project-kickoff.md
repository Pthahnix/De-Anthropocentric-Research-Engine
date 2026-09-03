## [Sirelia → all] 2026-09-02

DARE v4 设计协作正式开工。名册确认，五个岗位，三个立即开工，两个部分/全程阻塞。

---

## P0 闸门

**Research Spec 体系 + session recovery 的归属未定之前，不得继续压图，不得开始正文编译。**

缺口 1（Spec 归属）是整个项目的分水岭。它的答案会反向决定：
- 哪些节点还需要对用户可见（→ R3）
- 正文往哪个字段落（→ R5）
- 146 条 contract 里哪些 MOVED_RUNTIME 有真实接收方（→ R2）

**R1 你的设计草案是第一优先级。** 其他三个岗位的终稿都等你。

---

## 立即开工（三个岗位，互不阻塞）

### R1 — 运行时与状态架构师

**任务：** 在 A 路（Spec 留在 DARE 产品层）下，设计：
1. Spec 作为 skill 的形式（out-of-graph entrypoint？新加一层？）
2. 四项 recovery 规格（state 持久化、delta 累积、恢复入口、归档链）
3. 六项运行时边界（routing / context retention / budget & retry / parallelism /
   agent dispatch / monitoring）
4. 重新判定 7 条 `MOVED_RUNTIME` contract 的归属

**交付物：** `deliverables/R1/runtime-boundary.md`（可执行规格，不是边界声明）

**关键接口：**
- 你的 Spec 机制设计 → R3 的 catalog 选型
- 你的 contract 字段归属 → R5 的 body 编译规格
- 你的 MOVED_RUNTIME 重判 → R2 的审计更新

**下一步：** 读完必读文件后，先发一个设计草案（200 字论证 + 影响清单）到 channel，
让 R3/R5/R2 看到依赖关系。草案通过后再写完整规格。

---

### R2 — 回归审计官

**任务：** 对 146 条 capability contract 逐条审判，重点：
1. 19 条幻影 mode contract（引用了不存在的 mode）
2. Object mismatch（名字像但对象不同，如缺口 5 的 ARA 案例）
3. 时序/粒度/输入输出/主体/强度 五类错配
4. 等 R1 的 MOVED_RUNTIME 重判结果，更新那 7 条的 status

**交付物：** `deliverables/R2/audit-report.md`
- 总表（146 行，逐条判定 + 证伪路径 / PASS 理由）
- 幻影 mode 专项（19 条详细分析）
- Object mismatch 专项（至少 5 类，每类 ≥ 1 实例）
- MOVED_RUNTIME 更新表
- 推翻统计（REJECT / UNCERTAIN / PASS 各多少条）

**审计标准：** 发现问题的价值远高于确认没问题。不确定打 UNCERTAIN，不要因为
「也许设计者有深意」就打 PASS。

**下一步：** 先对 19 条幻影 mode 做一轮快速扫描（每条 5 分钟，判定 v3 有没有那个 mode），
发一个「幻影 mode 初查」到 channel，让我看你的判定标准是否合理。

---

### R4 — 图外科医生

**任务：** 修复三个机器可定位的缺陷 + 两个补录任务：
1. 19 条幻影 mode（补录缺失的 mode，或标记「v3 无此 mode」）
2. Tactic 层 jump 图裂成两个连通分量（补上 3 个孤岛节点的 jump 边）
3. 4 个 description 宣称有 mode 但字段为空（从 description 提取 mode 补录）
4. 205 条 provenance alias 补录
5. Paper-reading 35 个 SOP 的图内/图外裁定

**交付物：**
- 五份修复报告（每个任务一份）
- 修复后的 `graph.json`（落 `deliverables/R4/`）
- 验证脚本 `deliverables/R4/validate_graph.py`

**约束：** 只修补已有压缩的缺陷，不新增节点，不继续压图。所有修复必须从 v3 refactory 源
推导，不许猜测。

**下一步：** 先做任务 1（19 条幻影 mode），跟 R2 的初查对齐。然后做任务 2（jump 图修复），
因为它影响 tactic 层的连通性验证。

---

## 部分开工（R3，catalog 机制等 R1）

### R3 — 入口与能力发现设计师

**任务：** 设计用户冷启动流程 + AI 能力发现机制。包含：
1. Catalog 机制选型（A/B/C 路）——**等 R1 的 Spec 设计**
2. 冷启动流程图（用户输入 → 进入研究循环）
3. `ResearchContext` 处理方案（Hard gate / Soft gate / Zero-shot 推断）
4. 能力发现的时机 + 呈现方式
5. 错误入口的兜底策略

**当前可做的工作：** 用户侧调研不依赖 R1。你现在可以：
1. 收集 3-5 个真实的研究冷启动场景
2. 画出 v3 的冷启动流程（对比找冗余）
3. 列出 v4 必须保留的体验 + 可砍的部分

**下一步：** 发一个「冷启动场景收集」到 channel（格式见你的 roster prompt），
让我看你对用户体验的理解是否对齐产品定位。

Catalog 机制的终稿等 R1 的设计草案出来后再定。

---

## 全程阻塞（R5，等 R1 闸门）

### R5 — 正文编译方法学家

**任务：** 设计 v3 正文 → v4 body 的映射规格，在 7 个高吞并节点上试点。

**当前可做的工作：** R1 的 contract 字段归属未定之前，不能写映射规格，
但可以做 Step 1 准备工作：
1. 统计 v3 正文的字段分布（44,841 行里各字段占比）
2. 识别高频模板（paper-reading / evidence-synthesis 等家族的正文模式）
3. 找到特殊案例（过长/过短/格式异常的 skill）

**下一步：** 发一个「v3 正文字段分布分析」到 channel（格式见你的 roster prompt）。
这个统计会帮 R1 判断 contract 字段的复杂度。

映射规格的编写等 R1 闸门通过后开始。

---

## 第一轮检查点：2026-09-05

三天后我会检查三个立即开工岗位的进度：

- **R1**：设计草案发到 channel，等其他岗位反馈
- **R2**：19 条幻影 mode 初查完成
- **R4**：19 条幻影 mode 修复完成 + jump 图修复完成

R3 和 R5 的准备工作也应该在这个检查点完成（场景收集 + 字段分布分析）。

---

## 硬规矩提醒

1. **不许附和。** R2 尤其注意：发现问题的价值远高于确认没问题。
2. **不许扩张边界。** 越界的判断写成给对应岗位的发言，不要自己动手改。
3. **判断要带证据。** 引用文件路径 + 行号，或节点 ID + 字段值。「我觉得」不是交付物。
4. **不确定就说不确定。** 用「未发现缺失」而不是「通过」。

---

各岗位的详细职责见 `roster/<代号>.md`。有问题发到 channel，点名对应岗位。

开工。
