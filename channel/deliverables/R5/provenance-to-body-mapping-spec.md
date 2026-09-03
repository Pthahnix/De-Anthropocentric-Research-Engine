# Provenance → body 映射规格（R5）

状态：R1 归属草案已发布；contract 语法保留三分支，待 R1 最终落锤后删除两支。  
适用范围：v3 `SKILL.md` 正文 → v4 tactic/SOP `body.md`。本规格不生成 267 个节点的正文。

## 1. 目标与不变量

编译结果必须同时满足：

1. v3 每个被吸收节点可由 `source_ref` 追溯到文件和段落。
2. 阈值、数字判据、rubric、失败/反例、硬门槛一条不丢；文字解释允许压缩。
3. v4 body 是可执行说明，不是 provenance 清单；旧层级名只作为来源注记。
4. tactic body 描述研究变换与判据；调度、重试、持久化、监控仍由 runtime 负责。
5. 同一事实只保留一个规范副本；跨 mode 的共享事实放在共同段，mode 差异放分支段。

## 2. 输入抽取

对每个源 `SKILL.md`：

1. 保留文件路径、frontmatter、正文行号，去除 generated `available-tables` 索引。
2. 识别标题与列表边界；无标题短 SOP 以段落、编号、表格和 fenced block 识别。
3. 抽取五类不可重建单元：`gate`、`rubric`、`failure`、`protocol`、`schema`。
4. 每个单元保存 `source_ref = {file, start_line, end_line, heading, hash}`。
5. 同名文件若来自不同 package，按 architecture JSON 的 `old` 完整串匹配，不按裸名猜测。

## 3. 共同 body 结构

所有试点 body 使用下列最小结构；章节可合并，但语义顺序不变：

```markdown
# <v4 node id>
## Purpose
## When to use / not applicable
## Input contract
## Execution protocol
## Mode branches (if any)
## Output contract
## Thresholds and quality gates
## Failure and counterexamples
## Provenance map
## Context checkpoint / Delta notes
```

`Purpose` 可由 v4 `desc` 重写；其余章节必须由 v3 单元或 R1 contract 规则支撑。没有源证据的新增句子标记为 `v4-design`。

## 4. 1-to-1 映射

### 4.1 适用条件

当一个 v3 节点只映射到一个 v4 节点，且没有 mode 分裂时使用。v4 body 采用“保留判据、压缩解释、补 provenance”的重写，不直接复制 frontmatter。

### 4.2 规则

1. `When to use` 与 `not applicable` 原意保留。
2. 编号步骤保留顺序；可把重复说明合并为一句，但不得改变条件边。
3. 所有 gate/rubric/failure 原值迁入对应章节；数字、比较符、范围和缺省值不可四舍五入。
4. v3 输出字段迁入 Output contract；若仅有自然语言输出，保留 `v3_text_output`。
5. 例子仅在能证明边界或字段含义时保留；装饰性例子可删，但在 compilation-log 记录。
6. Provenance map 至少列出源文件、行区间、迁入章节和处理动作（keep/merge/compress/drop）。

## 5. N-to-1 映射

### 5.1 适用条件

architecture JSON 的一个 v4 tactic 吸收多个 v3 节点（`old` 数组）时使用。`old` 顺序不是执行顺序；执行顺序由下列固定算法产生。

### 5.2 固定合并顺序

1. **共同前置**：汇总所有源的输入、适用条件、对象定义；同义项按首次出现顺序去重。
2. **核心变换**：先放高层 strategy/campaign 的主流程，再放 tactic/SOP 的细化步骤。
3. **mode 分支**：按 v4 `modes` 顺序；每个 mode 只放专属步骤、字段、阈值和失败条件。
4. **共同输出**：合并输出字段，冲突字段保留来源并进入 `uncertainties`，不静默覆盖。
5. **共同质量门**：所有源 gate/rubric 先按 source_ref 分组，再按对象/模式分配；不可因“重复”删除数值判据。
6. **例子与反例**：优先保留能区分 mode 或触发失败的例子；同构例子合并为一例并列出全部来源。
7. **Provenance map**：逐源列出保留、合并、压缩、未落点项。

### 5.3 冲突处理

- 相同字段、不同数值：两者都保留，标注适用 mode/source；不能自行平均。
- 相同 gate、不同命名：统一为规范名，原名进入 aliases。
- 一个源步骤无 v4 mode：放入 `shared protocol`，或在 log 标记 `unmapped—R1 review`。
- 源节点只提供工具/provider 细节：保留能力要求与结果字段，provider 选择移出 body。

## 6. Mode 分支

1. mode 不是独立节点；共享输入、共同前置和共同输出只写一次。
2. mode 章节必须声明：触发条件、专属输入增量、专属步骤、专属 gate/rubric、失败出口。
3. 没有源证据的 mode 只可由 v4 `modes` 元数据命名，不得虚构新阈值。
4. 一个旧节点同时服务多个 mode 时，拆出最小语义单元并在 provenance map 多重引用，不复制正文。
5. mode 之间若写入相同 state key，按 R1 Delta 合并规则处理，不在 body 内规定调度顺序。

## 7. Contract 落点投机分支

R1 已确定 runtime 只接收八字段 `ResearchStateDelta`，catalog 可由 frontmatter 或引用索引生成；以下三支共用本规格其余规则。

### Branch A：frontmatter 字段

```yaml
input_contract:
  required: [<field>]
  optional: [<field>]
  constraints: [<verbatim threshold>]
output_contract:
  produces: [<field>]
  delta_fields: [findings, evidence_updates, ...]
```

解析器在 frontmatter 后读取 body。body 仍保留人可读 Input/Output contract；机器字段为规范副本，冲突以编译失败处理。

### Branch B：`registry/capabilities.json`

```json
{
  "node": "<id>",
  "input_contract": {"required": [], "optional": [], "constraints": []},
  "output_contract": {"produces": [], "delta_fields": []},
  "source_refs": []
}
```

body 不重复完整 schema，只写 `Contract ref: capabilities.json#<node>` 加自然语言约束；threshold/rubric 仍必须在 body 可见。

### Branch C：body 结构化块

````markdown
## Input contract
```yaml
required: []
optional: []
constraints: []
```
## Output contract
```yaml
produces: []
delta_fields: []
```
````

解析器以标题和 fenced YAML/JSON 为唯一机器入口。frontmatter 与 registry 不新增 contract 字段；catalog 通过扫描 body 或单独索引生成。

### Branch 收敛规则

R1 落锤后只保留一支。无论选哪一支，以下不变：八字段 Delta 名称、threshold/rubric 原值、source_ref、mode 顺序、冲突处理和验收测试。删除其余支时不得删除对应示例与 log。

## 8. Rubric 分配（含 `score-object`）

试点阶段采用保守策略：涉及 `score-object` 的 rubric 复制到每个实际消费它的 tactic body，并在段末加 `Rubric source: score-object#<n>` 与 `可能需要重构` 标记。

分配算法：

1. 先按 rubric 的对象类型和触发动作定位消费节点。
2. 一个 rubric 同时约束多个 mode 时，复制到各 mode 的质量门，不改写分值。
3. 仅用于解释评分背景的文字可放 provenance note，不复制到所有 body。
4. rubric 编号、分档、权重、阈值和缺省分必须逐字核对；缺一项即 `UNCERTAIN`。
5. Phase 2 决定共享 `rubric-library.md` 后，再把复制段替换为稳定引用；试点不提前做此重构。

## 9. 三个映射示例

### 示例 A：1-to-1

源：`hypothesis-formulation/SKILL.md` → v4 `formulate-hypotheses`。保留 hypothesis structure、operationalization、completion criteria；重复 campaign 叙述压为 Purpose；contract 按所选分支落点。任一 hypothesis 缺少变量、可检验预测或反例时，body gate 拒绝完成。

### 示例 B：N-to-1

源：9 个 meta-analysis 相关节点 → `synthesize-meta-analytic-evidence`。合并顺序为共同研究问题/研究集 → effect-size 与质量评估 → pairwise/network/cumulative/heterogeneity/bias mode → 共同 synthesis 输出 → 9 源 gate/rubric。不得复制九遍 provider 搜索，也不得丢掉异质性与偏倚阈值。

### 示例 C：mode 分支

源：`validity-envelope-mapping`、`systematic-perturbation` 等 → `map-validity-envelope`，modes=`systematic-perturbation | boundary-value-stress | critical-case`。共同段保存 variation axes、probe result、breakpoint、envelope；分支段保存采样策略与失败条件。`critical-case` 只有在源文件有选择标准时才写入。

## 10. 编译验收

- 每个 v4 body 都有 source_ref，且能定位到现存文件和行区间。
- 所有被吸收源的 gate/rubric/failure 单元都有 `keep` 或明确 `drop` 理由。
- N-to-1 的共同前置、mode 分支、共同输出顺序稳定可重放。
- contract 只有一个机器落点；三分支未收敛时标记 `speculative`。
- body 中每个数字判据都能反查源或标记 `v4-design`。
- `score-object` rubric 在试点阶段可见且带来源编号。
- 运行时字段只表达输入/输出与 Delta，不把 retry、parallelism、monitoring 写进科研步骤。

## 10.1 字段处置矩阵

| v3 信息 | v4 body 处置 | contract 分支处置 | 丢弃条件 |
|---|---|---|---|
| When to use | 保留为适用条件 | 可复制到 `requires` | 仅重复 v4 desc 时压缩 |
| Not applicable | 保留为拒绝/转路由条件 | 不得变成 optional | 无来源证据不得新增 |
| 编号步骤 | 按顺序保留 | 不放 runtime | 仅重复步骤标题可合并 |
| 阈值/数字 | 原值逐字保留 | 可镜像到 constraints | 不得四舍五入/平均 |
| Rubric 分档 | 保留维度、分值、方向 | 可镜像 quality metadata | 缺一项即 UNCERTAIN |
| 失败/反例 | 保留触发与出口 | 可镜像 failure predicates | 装饰性叙述可压缩 |
| Provider 名称 | 只保留能力要求 | 不写进科学 contract | 实现细节移 runtime |
| 例子 | 保留边界/字段例 | 可作为 examples 引用 | 纯展示例可删并记 log |
| Context checkpoint | 映射到 Delta notes | 八字段固定 | 不把事实放 INDEX |

## 10.2 重放与审计要求

编译器或人工复核应能从同一 source 集合重放同一章节顺序。重放键为 `(v4_node, mode, source_ref.start_line)`；相同键的文本只保留首次版本，后续版本进入冲突表。每个 drop 必须有原因代码：`duplicate-explanation`、`runtime-only`、`generated-index`、`unresolved-alias` 或 `decorative-example`。原因代码不是删除许可：若被删单元含 threshold/rubric/failure，操作必须失败并要求重新分配。

试点完成后，先运行静态检查，再由 host AI 读取 body 做一次字段解析演练。静态检查验证标题、YAML 可解析性、八字段名称、数字判据反查和 provenance 文件存在；解析演练验证缺失 required、违反 gate、mode 不匹配时是否产生 blocked/uncertainties，而不是生成自由文本补丁。

## 11. 已知边界

`systematic-literature-review/SKILL.md` 在当前仓库缺失，无法作为模板证据；paper-reading 30 个 v2 SOP 也尚未完成图内/图外裁定。两项不阻塞本规格，但进入 Phase 2 前必须补 provenance 或标记未决。
