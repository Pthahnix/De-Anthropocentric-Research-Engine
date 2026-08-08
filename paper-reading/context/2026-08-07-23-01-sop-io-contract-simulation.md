# SOP I/O 契约 —— 双 tactic 仿真

Phase: v2 架构 · I/O 契约重定
日期: 2026-08-07 23:01
目的: 取消预设 input，改由 SOP 在 tactic 管线中的位置自行承接上文。先仿真两条代表性 tactic，看流水实际长什么样，再定契约。
论文: Kimi K3 (arXiv 2607.24653)

注: 本文只仿真**形状与流向**。未取全文，文中出现的论文内容均为形状示意，非真实读出的结论。

---

## 0. 现状盘点

30 个 SOP，全部 `execution: subagent`。29 个下游节点的 `input:` 声明分四类，混在同一行里：

| 类别 | 数量 | 例 |
|---|---|---|
| 论文全文（按值） | 19 | `full_text (string)` |
| 上游产出 | 10 | `classified_units`, `star_results`, `signalling_answers` |
| tactic 级配置（不是数据） | 9 个 SOP / 16 个旋钮 | `label_set`, `stage_count`, `hierarchy_toggle`, `scope`, `item_set` |
| 论文外部输入 | 3 | `citance`, `target_text`, `question` |

三处声明已经写成 `OR`，是固定契约自己坏掉的证据：

- `quality-appraisal-checklist.input`: `(mode a) full_text + dispatched_tool` **OR** `(mode b) classified_units + entry_mode`
- `worst-case-lookup.input`: `domain_judgments`(RoB2/ROBINS-I 来) **OR** `checklist_result`(AMSTAR-2 来) —— 二选一
- `atomic-unit-recall-aggregate.output`: `recall_score` **OR** `{v_strict, a_strict, run_rank}` ——「取决于收到哪个方法的判断」

三处都在说同一件事：入口和出口的形状由**它在哪条 tactic 上**决定，不由它自己决定。声明层没有位置概念，只能塞进散文里。

另有 `dispatched_tool` 在 5 个 SOP 的 input 里重复出现——这不是数据，是 `study-design-tool-gate` 的产出在往下透传，透传本身被当成了参数。

## 1. Tactic A：精读（Keshav 三遍）

四节点线性链，形状最简，问题最典型。

### A-0 `paper-fetch`

- 承接：`paper_ref = "arxiv.org/pdf/2607.24653"`（tactic 唯一外部入参）
- 干的事：alphaxiv → Semantic Scholar 定频道 → bioRxiv/medRxiv，首个命中即停
- 吐出：`{status: found, full_text: <约 6–8 万 token markdown>, source_channel: alphaxiv, source_url, identifier}`
- 注：carry-forward 已记录 alphaxiv 返回的是 AI 改写稿而非原文。凡下游要原文锚点（本 tactic 三遍全要），此处必须走 `answer_pdf_queries` 或 `get_paper_content(fullText=true)`。这条约束现在写在 context 里，没写进 `paper-fetch/prompt.md`。**漏了。**

### A-1 `first-pass-skim`

- 承接：上文里此刻只有 paper-fetch 的返回
- 自取：title / abstract / 各级标题 / 图表标题 / conclusion。**正文体不看**——这是本 SOP 的定义性约束
- 吐出：`skim_notes`（约 15–25 行：一句话核心主张 + abstract 原文引用的主结果 + 承重图表名）、`read_deeper: true`
- 现声明 `input: full_text (string)`。但它真实需要的是全文的一个**投影**（约 5–8% 体积）。按值传全文，等于把它明确不该看的东西塞进它的窗口，再靠 prompt 里一句「do not read section bodies」自律。**契约与约束反向。**

### A-2 `second-pass-grasp`

- 承接：`full_text` + `skim_notes`
- 自取：全文正文（Intro/Method/Results/Discussion）+ 图表；跳过证明与推导；skim_notes 用来定位承重处
- 吐出：`grasp_summary`（一段能向同行转述主贡献+支撑证据的散文，含「待第三遍细查」标记项）
- 这一遍是真的要全文。19 个要 `full_text` 的 SOP 里，只有这类是名副其实。

### A-3 `third-pass-deep-read`

- 承接：`full_text` + `grasp_summary`（含 flag 列表）
- 自取：全文逐句，含证明推导；grasp_summary 的每个 flag 必须消解
- 吐出：`deep_read_notes` = (a) 隐含假设 (b) 虚拟复现对照 (c) 具体改进点
- prompt 里已明写「不得空转，『第二遍之外无可补』应被怀疑」。coverage audit 里 S2 记的就是这个节点在 v1 图上被抹平。

### Tactic A 终态产物

```
readings/kimi-k3/keshav/
  skim_notes.md         ~20 行,  read_deeper=true
  grasp_summary.md      ~1 段 + flag 列表
  deep_read_notes.md    三段式, 最重
```

三份散文，逐层加厚，无固定 schema。跨论文对不齐——菜单里 keshav 的 alignability 就标着 weak。

### 上下文流型：**累积型**

`full_text` 在 A-1/A-2/A-3 三次出现。若按值传，同一份 6–8 万 token 付三遍。加上 A-2、A-3 各自还要带上游散文，实付约 20–25 万 token 输入。

## 2. Tactic B：论断抽取与核验（SciFact）

四节点，含循环，含论文外输入，含一条**反向禁令**。形状与 A 完全不同。

### B-0 `paper-fetch`

同 A-0。吐 `full_text`。

### B-0.5 取 citance（**当前无对应 SOP**）

- `claim-writing` 的 input 是 `citance`：**别的论文引用本篇时写的那句话**
- 它不在 `full_text` 里。paper-fetch 也不产它。要拿到，得查引文（Semantic Scholar `citations` 带 citation context）
- 但 README 定死「`paper-fetch` 是唯一调检索工具的 SOP」。于是这一步无处安放。
- **这是缺口，不是待办。** 整条 SciFact tactic 现在起不来。coverage audit 的 S7 记了「SciFact rationale 丢失」，没记这条更前面的断点。

### B-1 `claim-writing` ×N（每个 citance 一次）

- 承接：一个 `citance`
- **必须不承接 `full_text`** —— prompt 原文：blind 指「改写时不看被引论文自身的 abstract/内容」，为的是不让改写被论文实际说法带偏。SciFact 的标注协议就是这么设计的。
- 自取：只有 citance 本身
- 吐出：`atomic_claim`（复合句则拆成多条，各自返回）

这一节点直接推翻「无脑承接上文」：**若 context 从 paper-fetch 一路继承下来，blind 协议按构造就破了**。契约不只要能说「要什么」，还必须能说「禁看什么」。

### B-2 `rationale-selection` ×N

- 承接：`atomic_claim` + `full_text`
- 自取：全文里找最小充分句集（1–3 句），逐字引用，不改写
- 吐出：`rationale_sentences`（可为空列表，空是合法结果）
- 这里全文才第一次合法入场。B-1 和 B-2 对同一份 `full_text` 的**可见性要求相反**。

### B-3 `claim-label-prediction` ×N

- 承接：`atomic_claim` + `rationale_sentences`
- **不承接 `full_text`**，也不承接自身背景知识 —— prompt：标签必须可溯到选中的那几句
- 吐出：`label ∈ {SUPPORTS, REFUTES, NOINFO}`；空 rationale 恒为 NOINFO

第二次反向禁令。而且这次是**收窄**：上游明明有全文，这一节点必须只看那 1–3 句。

### Tactic B 终态产物

```
readings/kimi-k3/scifact/
  claims.jsonl    每行 {citance, atomic_claim, rationale_sentences, label}
```

一张表，N 行（N = citance 数）。跨论文强对齐——三元标签是固定值域。与 A 的散文完全不同物种。

### 上下文流型：**变换型 + 收窄型**

`full_text` 只在 B-2 需要。B-1、B-3 若拿到，是污染。链上流的是被逐级压缩的结构化物：句 → 论断 → 论断+证据 → 标签。

## 3. 两条一对，看出七件事

**① 流型至少两种，固定 input 一种都表达不了。**
A 累积（后一节点要前面全部 + 全文），B 变换并收窄（后一节点只要前一节点吐的，全文反而是污染）。同一个字段名 `full_text (string)` 在两条 tactic 上语义不同。

**② 缺的不是「要什么」，是「禁看什么」。**
`claim-writing` 不得见全文，`claim-label-prediction` 不得见 rationale 之外任何东西。这两条现在只活在 prompt 散文里，靠子代理自律。而它们是方法论的**定义性条件**——破了就不是 SciFact 了。声明层必须有一个负字段。

**③ 「承接上文」与 `execution: subagent` 直接冲突。**
子代理是**新窗口**。它继承不到父窗口的任何东西，父必须显式交接。所以现在这 30 个 `execution: subagent` 之下，「自行承接上文」在机械上不成立——只能是父按声明挑好了喂进去。

由此得出真正的分工，而且是被 ①② 逼出来的：

| 流型 | 该怎么跑 | 为什么 |
|---|---|---|
| 累积型（A 三遍） | **同一窗口内联**，全文读一次 | 上文自然在，无需交接；token 从 3× 降到 1× |
| 收窄/禁看型（B-1, B-3） | **必须新起干净子代理** | 同窗口里看过的东西无法「取消看见」，blind 协议只能靠窗口隔离保证 |

**`execution:` 不该 30 个一律 subagent，它应当由契约推导出来。** 哪里有负约束，哪里就是子代理边界；其余内联。

**④ 9 个 SOP 的 input 里混着 16 个 tactic 级旋钮。**
`label_set` / `stage_count` / `hierarchy_toggle` / `scope` / `item_set` / `output_type` / `judgment_value_domain` / `unit_source` / `importance_tagging_toggle` / `saliency_layer_toggle` / `slot_definitions` / `template_attribute_schema` / `entry_mode` …

这些不是上游给的数据，是「本次按哪个方法论跑」。它们属于 tactic 的 params，混进 input 之后，就是上一轮我说的「参数型还原」表达不出来的根因。

**⑤ `dispatched_tool` 在 5 处 input 里，是透传被误记成参数。**
它是 `study-design-tool-gate` 的产出，沿链往下走。契约里该有「继承自上游」这一类，而非每个节点重新声明一遍。

**⑥ 三处 `OR` 声明，一改就自动消失。**
`worst-case-lookup` 收 `domain_judgments` 还是 `checklist_result`，取决于它挂在 RoB2 还是 AMSTAR-2 上。`atomic-unit-recall-aggregate` 吐 `recall_score` 还是 `{v_strict, a_strict, run_rank}`，同理。位置定形状，则 `OR` 无需存在——是 tactic 声明的两条不同链，各自确定。

**⑦ SciFact 整条现在起不来。**
citance 无处取：不在全文里，paper-fetch 不产，而 README 定死只有 paper-fetch 能调检索工具。要么加一个取 citance 的 SOP（破唯一入口的规矩），要么把 citance 列为 tactic 外部入参、由调用者给。**得选一个。**

---

## 4. 契约改成什么

现在两键（`input` / `output`）不够，需要五键：

```yaml
# 举例: rationale-selection
consumes:
  from_upstream: [atomic_claim]      # 前一节点的产出
  from_source:   [full_text]         # 论文本体, 按引用不按值
withholds: []                        # 无禁令
produces:      [rationale_sentences]
params: {}
external: []
```

```yaml
# 举例: claim-writing —— 负约束在此
consumes:
  from_upstream: []
  from_source:   []                  # 明确不取全文
withholds:      [full_text]          # 破则不成立: SciFact blind 协议
produces:       [atomic_claim]
params: {}
external:       [citance]            # 论文外, 需 tactic 供给
```

```yaml
# 举例: unit-classification —— 旋钮归位
consumes:
  from_upstream: [units, unit_offsets]
  from_source:   []
withholds:      []
produces:       [classified_units]
params:                              # 由 tactic 绑定, 非上游数据
  label_set:      <az | coresc | piboso | csabstruct>
  hierarchy:      <bool>
  output_type:    <single_label | span_level | tuple>
```

`from_source` 一律按引用（`full_text_path`）。全文由 tactic 落盘一次，节点自取所需切片。这同时解掉上轮那条 token 重复计费。

## 5. 两条 tactic 声明后长这样

```yaml
name: keshav-three-pass
type: tactic
source_input: paper_ref
execution: inline          # 累积型, 同窗口, 全文读一次
chain:
  - paper-fetch
  - first-pass-skim
  - second-pass-grasp
  - third-pass-deep-read
output_dir: readings/<slug>/keshav/
```

```yaml
name: scifact-claim-verification
type: tactic
source_input: [paper_ref, citances]   # citances 由调用者给, 见 ⑦
execution: mixed
chain:
  - paper-fetch
  - { sop: claim-writing,          execution: subagent, per: citance }  # 窗口隔离保 blind
  - { sop: rationale-selection,    execution: inline,   per: claim }
  - { sop: claim-label-prediction, execution: subagent, per: claim }    # 窗口隔离保收窄
output_dir: readings/<slug>/scifact/
```

## 6. 下一步

按依赖排序，前两条不做则后面无从落地：

1. **定 citance 归属**（⑦）——加 SOP 破唯一入口，或列为 tactic 外部入参。二选一，需拍板。
2. **`execution:` 由契约推导**（③）——30 个一律 subagent 现在是错的。先把有负约束的挑出来（已知：`claim-writing`, `claim-label-prediction`；`first-pass-skim` 的「不读正文体」也是同类，待定是否升格为硬禁令）。
3. **30 个 frontmatter 换五键**，`from_source` 改按引用。
4. **16 个旋钮从 input 迁进 params**（④）。
5. **`dispatched_tool` 改标继承**（⑤），5 处。
6. 之后三处 `OR` 自然消解（⑥），不必单独处理。
7. `paper-fetch/prompt.md` 补 carry-forward 那条 alphaxiv 原文锚点约束（A-0）。
8. `validate_skill.py` 现在只查 name/description/500 行，加查五键完整性与 `withholds` 值域。

## 7. 未决

- `first-pass-skim` 的「不读正文体」算硬禁令（→ 独立子代理）还是软约束（→ 内联靠自律）？若算硬的，Keshav 链就不是纯内联，A 的 1× token 优势打折。
- 节点名 drift 未修：图上 `third-pass-verify`，目录是 `third-pass-deep-read`。tactic 声明按目录名写。

---

## Checkpoint: path contract and tactic layer landed

- Adopted `source.md` plus `source.meta.json` with line-indexed sections;
  slicing remains a consumer concern rather than a `paper-fetch` concern.
- Cache lookup uses `identifier` or `title_slug`, not timestamped directory names.
- Nineteen reading prompts now take `source_path` and `meta_path`; narrow
  readers name their exact ranges, while full-paper readers state why.
- Added five tactics: `keshav-three-pass`, `qalmri-worksheet`,
  `argumentative-zoning`, `acu-nugget-recall`, and `reforms-grading`.
- `target_summary` remains external for ACU/Nugget recall; generating it in
  the same tactic would contaminate the coverage check.
- SciFact remains without a tactic because its citance is external to the
  paper and the sole-fetch-entry rule remains intact.
- Validation now requires DARE frontmatter keys and checks tactic-to-SOP
  dependency closure. Runtime usefulness remains untested until a real paper
  is run through the tactics.
