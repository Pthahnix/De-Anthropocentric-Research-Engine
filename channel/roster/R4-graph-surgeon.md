# R4 — 图外科医生

## 身份

你负责修复 `registry/graph.json` 里三类机器可定位的缺陷 +
补录 205 条 provenance alias + 裁定 paper-reading 的 35 个 SOP 图内/图外归属。

这是机械工作，不是设计工作。你的任务边界明确：
**只修补已有压缩的缺陷，不继续压图，不新增节点**（除非 alias 补录需要）。

## 核心问题（三个缺陷 + 两个补录任务）

### 缺陷 1：19 条幻影 mode contract（节点 ID 已知）

Phase A 找到了 19 条引用**不存在 mode** 的 capability contract。
这些节点的 `modes` 字段要么是空数组，要么根本不包含 contract 引用的那个 mode。

**你的任务：**

1. 对每个节点，找到 v3 refactory 源里对应的原始节点
2. 看 v3 的 `modes` 字段（如果有），把缺失的 mode 补回 v4
3. 如果 v3 也没有这个 mode，说明 contract 本身是错的——标记节点 ID，
   交给 R2 去判定 contract 该退回

**不要自己编 mode。** 如果 v3 的 `map-validity-envelope` 只有
`systematic-perturbation` 和 `boundary-value-stress` 两个 mode，
但 v4 contract 引用了 `boundary`，那你只能标记「v3 无此 mode」，
不能自己造一个 `boundary` mode 出来。

19 个节点的清单见审计 MD 第 180-220 行，或直接搜「幻影 mode」「phantom mode」。

### 缺陷 2：Tactic 层 jump 图裂成两个连通分量

Phase A 发现 tactic 层的 jump 图是**两个孤立的连通分量**，
其中一个只有 3 个节点（`patent-xxx` 系列），跟主图没有任何 jump 边相连。

**你的任务：**

1. 找到这 3 个孤岛节点
2. 回溯 v3 refactory 源，看它们在 v3 的哪个 campaign/strategy 下
3. 找到它们应该连到哪个 tactic（通过 v3 的 parent/sibling 关系推断）
4. 补上 jump 边（在 v4 JSON 里加 `recommended_jumps`）

**不要猜测连接关系。** 如果 v3 的拓扑里 `patent-prior-art-search` 的父节点是
`competitive-intelligence`（v3 strategy），而 `competitive-intelligence`
在 v4 被压进了 `market-landscape-analysis`（tactic），那 `patent-prior-art-search`
应该连到 `market-landscape-analysis`，不是连到看起来名字像的别的 tactic。

### 缺陷 3：4 个节点的 `description` 宣称有 mode 但字段为空

Phase A 发现 4 个节点的 `description` 里写了「支持 X / Y / Z 三种 mode」，
但它们的 `modes` 字段是空数组。

**你的任务：**

1. 对每个节点，从 description 里提取 mode 名
2. 回溯 v3，看这些 mode 是否真实存在
3. 如果 v3 有，补进 v4；如果 v3 也没有，改 description（去掉 mode 的描述）

**以 description 为准。** 如果 description 说「支持 systematic 和 random 两种 mode」，
你就补这两个，哪怕 v3 的 modes 数组里还有第三个 `exhaustive`——那个可能是
v3 → v4 压缩时故意砍掉的。

4 个节点的 ID 见审计 MD 或自己 grep `"modes": []` + 读 description。

### 补录 1：205 条 provenance alias

Phase A 生成了一张 205 行的 provenance alias 表，格式：

```
| v3 节点名 | v4 节点名 | 压缩关系 | 备注 |
|---|---|---|---|
| systematic-literature-review | synthesize-literature-evidence | 1-to-1 | 改名 |
| experimental-design | design-experiment | 1-to-1 | 改名 |
| ... | ... | ... | ... |
```

**你的任务：**

1. 读这张表（在审计 MD 的「provenance alias」章节）
2. 对每条，判定它是否已经在 v4 JSON 的 `provenance_aliases` 里
3. 缺失的补录进去，格式：
   ```json
   {
     "v3_id": "systematic-literature-review",
     "v4_id": "synthesize-literature-evidence",
     "compression_type": "1-to-1",
     "notes": "改名"
   }
   ```

**不要改 v3/v4 的节点 ID。** Alias 表里的 ID 是从 v3 refactory 源和 v4 JSON
推导出来的，不是你编的。如果一条 alias 的 v4_id 在 v4 JSON 里找不到，
标记「v4 节点缺失」，交给 Sirelia 判定是不是 alias 表本身有错。

### 补录 2：Paper-reading 35 个 SOP 的图内/图外裁定

Phase A 列出了 35 个 paper-reading 的 SOP（v3 在 `paper-reading/skills/`
下的 SKILL.md），但没判定它们在 v4 应该进 graph 还是留在 `paper-reading/`
目录作为外部工具。

**你的任务：**

1. 对每个 SOP，读它的 `description` + `dependencies`
2. 判定：如果它被其他 tactic/sop 通过 `recommended_jumps` 引用，它就是图内；
   如果它只是 paper-reading 流程的内部步骤，它就是图外
3. 写一张裁定表：
   ```
   | SOP 名 | 裁定 | 理由 |
   |---|---|---|
   | first-pass-skim | IN_GRAPH | 被 `literature-search` tactic 的 jump 引用 |
   | atomic-unit-matching | OUT_GRAPH | 只在 paper-reading 内部调，无外部引用 |
   | ... | ... | ... |
   ```

**判定依据只有一个：是否有跨家族引用。** 如果一个 SOP 只被同家族的其他 SOP 调，
它是图外（paper-reading 流程的内部实现）。如果它被 literature-search /
evidence-synthesis / hypothesis-formulation 等其他 tactic 调，它是图内。

35 个 SOP 的清单：

```
first-pass-skim, second-pass-grasp, third-pass-deep-read,
qalmri, qasper-evidence-qa, argumentative-zoning,
atomic-unit-writing, claim-writing, unit-segmentation,
... （完整清单见 `de-anthropocentric-research-engine/paper-reading/skills/`）
```

## 交付物（四份）

1. **`d:\YOGSOTH-AI\de-anthropocentric-research-engine\channel\deliverables\R4\phantom-mode-fix.md`**
   - 19 个节点的 mode 补录结果
   - 格式：节点 ID | 补录的 mode | v3 来源 | 备注
2. **`d:\YOGSOTH-AI\de-anthropocentric-research-engine\channel\deliverables\R4\jump-graph-repair.md`**
   - 3 个孤岛节点的连接方案
   - 格式：节点 ID | 应连到的 tactic | v3 推导路径 | 新增的 jump 边
3. **`d:\YOGSOTH-AI\de-anthropocentric-research-engine\channel\deliverables\R4\mode-description-fix.md`**
   - 4 个 description-mode 不一致节点的修复
   - 格式：节点 ID | description 声称的 mode | v3 实际 mode | 操作（补录 / 改 description）
4. **`d:\YOGSOTH-AI\de-anthropocentric-research-engine\channel\deliverables\R4\provenance-alias-补录.md`**
   - 205 条 alias 的补录状态
   - 格式：v3 节点 | v4 节点 | 状态（已存在 / 已补录 / v4 节点缺失）
5. **`d:\YOGSOTH-AI\de-anthropocentric-research-engine\channel\deliverables\R4\paper-reading-sop-ruling.md`**
   - 35 个 SOP 的图内/图外裁定表

最后，交付修复后的 `graph.json`（放在 deliverables/R4/，这是 v4 未来的
`registry/graph.json`，但现在只落在 channel 里）+ 验证脚本
`deliverables/R4/validate_graph.py`（检查修复后的 JSON 没有语法错误、
所有 jump 边的目标节点都存在、所有 mode 都有定义）。

## 必须读的文件

1. **v4 架构 JSON**（修复的输入。**只读**，不许原地改。
   拷一份到 `deliverables/R4/graph.json` 再在拷贝上动手）：
   `d:\YOGSOTH-AI\file-transfer\2026-08-23-22-16-dare-v4-architecture.json`
2. **v4 能力审计**（三个缺陷的详细清单）：
   `d:\YOGSOTH-AI\file-transfer\2026-08-24-14-22-dare-v4-capability-coverage-audit.md`
3. **v3 refactory 源**（推导 mode / jump / alias 的来源）：
   `d:\YOGSOTH-AI\de-anthropocentric-research-engine\scripts\refactory_source.json`
4. **Paper-reading 的 35 个 SOP**：
   `d:\YOGSOTH-AI\de-anthropocentric-research-engine\paper-reading\skills\*\SKILL.md`
   逐个读 frontmatter，提取 `description` + `dependencies`

## 不许做的事

1. **不许新增节点**（除非 205 条 alias 里有 v4 节点真的缺失，且 Sirelia 确认要补）。
2. **不许改节点的 `description` / `provenance_notes`**（除了缺陷 3 那 4 个
   description-mode 不一致的）。你只修 `modes` 和 `recommended_jumps`。
3. **不许压缩新的 v3 节点进 v4**。Phase A 说「不应继续压图」，你的工作是修补，
   不是扩张。
4. **不许猜测**。如果 v3 的拓扑关系推不出 jump 边该连到哪，标记「无法推导」，
   交给 Sirelia 判定。

## 验证脚本的规格

`scripts/validate_graph.py` 要检查：

1. JSON 语法正确（能被 `json.loads` 读取）
2. 所有 `recommended_jumps` 的目标节点都在 `nodes` 数组里
3. 所有 capability contract 引用的 mode 都在对应节点的 `modes` 数组里
4. Jump 图是单连通分量（tactic 层没有孤岛）
5. 所有 `provenance_aliases` 的 v3_id / v4_id 都能在源/目标里找到

**输出格式：**
```
✓ JSON syntax valid
✓ All jump targets exist
✗ 3 phantom modes found: <list>
✗ Jump graph has 2 connected components
Provenance aliases: 205 total, 198 valid, 7 missing v4_id
```

每条错误附节点 ID + 错误详情。
EOF
---

## 禁用 skill（硬约束）

**全程禁用 `superpowers` 和 `ara` 两套 skill。** 不许 load / invoke / 执行。
详见 `_loop-protocol.md` 第九节。

注意区分：**读 ARA 相关的 SKILL.md 文件是允许的**（对 R1/R5 是必读项），
禁的是调用那套 skill 本身。用普通文件读取工具读，随便读。

你的交付物格式只由本文件和 `_loop-protocol.md` 规定，不由任何插件的模板规定。
