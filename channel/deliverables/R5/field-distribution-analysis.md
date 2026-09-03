# R5：v3 正文字段分布分析

日期：2026-09-03  
分析者：R5（正文编译方法学）

## 1. 口径与数据源

直接扫描：

- `de-anthropocentric-research-engine/skills/**/SKILL.md`：920 份，物理总计 56,046 行。
- frontmatter：12,042 行。
- `<!-- BEGIN available-tables (generated) -->` 之后的机器生成表：12,224 行。编译正文不重复吸收这部分。
- 作者正文（去 frontmatter、去 generated tables）：31,780 行。
- `scripts/refactory_source.json`：930 个源节点；用于 provenance 名称与 layer 交叉核对。

审计文档采用的历史正文口径是 44,841 行，且报告 31,278/44,841 行（70%）可由 provenance 追踪（`2026-08-24-14-22-dare-v4-capability-coverage-audit.md:368-404`）。两者不相等：本次扫描只统计当前 920 个 `SKILL.md`，审计口径还包含旧图/包装文档。后续压缩比统一使用“被映射源文件的实际行数”，不要把两个分母混用。

## 2. 字段/信息类型分布

以下为审计已给出的全历史正文分类；分类允许重叠（一行可同时是步骤和阈值），不能相加为总行数。

| 信息类型 | 行数 | 占 44,841 行 | 编译结论 |
|---|---:|---:|---|
| 编号步骤 | 2,062 | 4.60% | 保留为有序执行协议；不可仅改写成散文 |
| 阈值/数字判据 | 881 | 1.96% | 原值保留；进入 body 的 gate/contract 对应段 |
| 显式 rubric | 750 | 1.67% | 原分档、评分方向、缺省处理保留 |
| 失败条件/反例 | 560 | 1.25% | 与触发条件绑定，不能从正文删掉 |
| 代码/schema 块 | 550 | 1.23% | 保留可解析结构；文本解释可压缩 |
| 具名方法引用 | 202 | 0.45% | 作为方法锚点与 provenance 标签保留 |

本地 920 文件的结构性计数（只计作者正文）：

| 结构信号 | 文件/行计数 | 说明 |
|---|---:|---|
| `## Execution` 标题 | 334 个文件 | 高频主流程模板 |
| `## Hard-Gate` | 201 个文件 | 硬门槛集中位置 |
| `## Budget` | 188 个文件 | 预算/规模档位，常与 gate 共现 |
| `## Output` / `## Output Format` | 107 / 108 个文件 | 输出约束分散为两种标题 |
| `## Input` / `## Input Schema` | 71 / 10 个文件 | 输入约束明显少于输出约束，且命名不统一 |
| `## State Ledger` | 133 个文件 | 状态累积型 SOP 的主要承接点 |
| `## Context Management` | 40 个文件 | 与 checkpoint/recovery 相关 |
| `## Context-Checkpoint` | 15 个文件 | 适合直接映射为 state delta 说明 |
| `## Examples` / `## Example` | 15 / 1 个文件 | 标题稀疏，例子常埋在流程或 provider 段落 |

frontmatter 侧也不稳定：`input` 出现 421 次，`output` 98 次，`prompt` 379 次，`execution` 663 次。故不能假设 v3 frontmatter 完整表达 contract；正文仍是权威来源。

## 3. 高频正文模板

按标题是否出现 execution、output、gate、state、routing、input、example 归一后，最常见组合如下（920 文件）：

| 模板 | 文件数 | 编译策略 |
|---|---:|---|
| execution + output + gate | 142 | 直接形成 body 的主流程、输出、质量门三段 |
| execution + routing | 115 | 把 routing 保留为调用条件，不把它误写成科学步骤 |
| execution + gate | 96 | 典型 tactic/SOP；阈值必须逐条迁移 |
| execution + gate + state | 73 | 追加 state delta/checkpoint 映射 |
| execution + gate + routing | 68 | 先路由再执行；顺序不能被 N-to-1 合并打乱 |
| execution + output + gate + state | 65 | 完整可执行节点的优先模板 |
| 无作者标题 | 208 | 多为短 SOP；需按段落/列表语义解析，不能依赖标题定位字段 |

生成的 `available-tables` 不进入上述统计；它们共出现 `Available SOPs` 1,007 次、`Available Tactics` 366 次，属于索引，不是正文。

## 4. 特殊案例清单

### 4.1 长正文

按物理行数排序，最长的是：

| v3 节点 | 行数 | 风险 |
|---|---:|---|
| `literature-research` | 225 | provider、全文读取、引用扩展与两个示例混在一起 |
| `web-search` | 187 | 多 provider 分支，输出结构在 provider 段落重复 |
| `literature-search` | 184 | 搜索、筛选、citation graph 三种流程叠加 |
| `web-research` | 160 | discover/select/fetch/analyze/follow 五段式 |
| `literature-overview` | 140 | provider 说明与示例占比高 |

这些不是普通 1-to-1 样本；应按 provider/步骤边界切块，避免 N-to-1 合并时重复复制工具说明。

### 4.2 短正文与格式异常

有 20 个节点作者正文仅 5 行（例如 `breakpoint-detection`、`claim-negation`、`counterexample-generation`、`parameter-space-mapping`、`trend-analysis`）。其中部分只保留一句操作说明，真正约束在 prompt、依赖或 generated table 中。编译时必须标注“源正文不足”，不得自行补写阈值。

208 个文件没有可识别的作者标题；另有 import/wrapper 节点把实际流程放在 `Import Source` 或 provider 段落。解析器应同时支持标题驱动与段落标记驱动。

### 4.3 ARA 与 paper-reading

当前仓库未找到 roster 指定的 `skills/systematic-literature-review/SKILL.md`，因此不能把它当作可核验模板。`ara-from-context` 相关 7 个 v3 节点仍存在，但审计已将 ARA 对象错配列为缺口 5；试点只保留 provenance 与正文事实，不替 R1/R3 决定 artifact 层归属。

## 5. 对 v4 body 编译的直接约束

1. `threshold`、`rubric`、失败/反例属于不可重建信息。按 R1 终稿，contract 固定落 body；这些判据必须在 body 保留可读副本。
2. v4 当前架构 JSON 的 tactic/SOP 节点均没有 `input_contract` / `output_contract`（审计 `:395`）。R1 未落锤前只写三种落点分支，不假定语法。
3. `mode` 是正文切块主键：同一旧节点的多个 mode 共用前置输入与质量门，mode 专属步骤、阈值、反例分开保存。
4. 1-to-1 可压缩叙述，但不能压缩数值判据；N-to-1 按“共同前置 → mode 分支 → 共同输出/质量门”顺序合并。
5. `score-object` 的 15 条 rubric 在试点中先复制进各 body，并标注待重构；在共享库方案落锤前，不以引用替代内容。

## 6. 可复核命令

扫描口径可由以下规则复现：对每个 `SKILL.md` 去掉首尾 frontmatter；截断于 `BEGIN available-tables`；统计剩余正文行与标题/关键词命中。历史 44,841 行分类数字直接引自能力审计第 9 节（`...capability-coverage-audit.md:382-389`）。
