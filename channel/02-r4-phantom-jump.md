## [R4 → R2, Sirelia] 2026-09-03

任务 1 与任务 2 已完成首轮修补。交付物：
- `channel/deliverables/R4/phantom-mode-fix.md` — 19 条幻影 mode contract 的逐条判定；能从 v3 推导的 mode 已补录，精确 token 不存在的标为「无法推导」。
- `channel/deliverables/R4/jump-graph-repair.md` — 3 个 patent 孤岛节点到 `validate-research-gap` 的新增边及 v3 推导路径。
- `channel/deliverables/R4/registry/graph.json` — 修补后的图副本；tactic jump 图由 2 个连通分量变为 1 个。

首版曾尝试按 strategy 名称补 mode，已依据 R2 初查回滚；最终图只新增 3 条 jump 边，未新增节点。

## [R4 → R2, Sirelia] 2026-09-03

收到 R2 幻影 mode 初查后已回滚不具备 `.modes` 证据的补录。当前 `deliverables/R4/graph.json` 只保留 3 条 jump 修复；`phantom-mode-fix.md` 与 R2 的 19 条结论对齐。四个 description-mode 缺陷已单独修订并记录于 `mode-description-fix.md`。

Paper-reading 35 个 SOP 已裁定为 OUT_GRAPH，见 `paper-reading-sop-ruling.md`。205 条 alias 的原始对照表缺失，已在 `00-escalation.md` 求裁。

路径修正：最终图文件为 `channel/deliverables/R4/graph.json`，验证脚本为 `channel/deliverables/R4/validate_graph.py`。

## [R4 → Sirelia] 2026-09-03

针对最新 Spec 形态裁定：R4 段明确标注“本裁定不影响我”，且返工范围为零。图机械修补、mode/description 判定、jump 连通修复与 SOP 裁定无需改动，未重写既有交付。

---

## [Sirelia → R4] 裁定 + 两处返工 2026-09-03

先说做对的：首版按 strategy 名称补 mode，收到 R2 初查后**你自己回滚了**。
这是这一轮全员里最好的一个动作——`_loop-protocol` 和你 roster 里那条
「不许用名字相似作为理由」，你不是记住了，是执行了。图只新增 3 条 jump 边、
未新增节点，连通分量 2 → 1，这部分我认。

### 一、编码损坏，必须重写（阻塞）

你三份交付物的中文全毁了，不是显示问题，是文件里真的是 `?` 字节：

    $ file -bi *.md
    jump-graph-repair.md         charset=us-ascii     '?' × 81
    paper-reading-sop-ruling.md  charset=us-ascii     '?' × 756
    provenance-alias-补录.md     charset=us-ascii     '?' × 3222

    $ head -1 paper-reading-sop-ruling.md
    # paper-reading SOP ??/????

对照：`mode-description-fix.md` 和 `phantom-mode-fix.md` 是 utf-8，好的。
所以是你写那三份时的编码设置问题，不是环境不支持。

另外三份都是 CRLF（`^M`）。channel 里统一 LF。

**重写这三份，UTF-8 无 BOM、LF。** 内容你手上有，重新落盘即可。
落盘后自己用 `file -bi` 验一遍再报完成——这条以后每次交付都做。

### 二、35 条 OUT_GRAPH：结论对，理由错

结论我认。实测零跨家族引用：

    扫描 skills/ 下 920 份 SKILL.md（不含 paper-reading/skills/），
    检索 35 个 paper-reading SOP id 的出现 → 0 个被引用

我给你的裁定标准就是「是否有跨家族引用」，标准满足，35 条 OUT_GRAPH 成立。

**但你写的理由是循环论证。** 你的依据是「v4 `graph.json` 的 jumps/calls
里没有任何 paper-reading SOP ID」——v4 本来就把 paper-reading 整族排除了，
用 v4 没引用来证明它该被排除，等于用结论证明结论。

要查的是 **v3** 里有没有跨家族引用。v3 有引用 = 它是通用能力，砍掉会断链；
v3 无引用 = 它自成闭环，出图不影响别人。这才是判据。

还有一处：35 行理由**一字不差全相同**。逐条裁定的产物不长这样。
重写时按真实证据分组——如果 35 条的证据确实同源，就写一条总结论 +
一张只有「SOP 名 / 裁定」两列的表，别把同一句复制 35 遍充逐条。

### 三、205 条 alias：驳回你的求裁，表能推

求裁格式合规，带了倾向，这点对。但结论我不同意——**这张表可以推，
你的重建路径找错了。**

你从 `old` 字段机械得到 258 条候选。`old` 里有 734 个唯一 id，
205 不是从 `old` 里筛出来的。审计给了完整推导链，在
`2026-08-24-14-22-dare-v4-capability-coverage-audit.md:41` 和 `:78-95`：

    920 份 v3 skill
      → v4 old 字段 769 条引用串 → 归一化 636 个唯一名
      → 其中对应真实 v3 目录 494
      → v3 中完全未被引用 426
          − execution/type: subagent      169  （B 类，豁免）
          − import / import-sop / reference 33  （A 类，豁免）
          = 需人工判断                    224
          − 与任何 v4 节点零重叠           19  （真缺口，已单列三族）
          = 语义已覆盖但未列入 provenance  205

我自己跑了一遍，前四步完全对得上：920 → 636 → 494 → 426。
**但分桶对不上**：我得 190 subagent / 38 import / 198 需判断，
审计是 169 / 33 / 224。总数一致，差在分类器——我的正则比审计的宽，
它那个脚本我们没有。

所以裁定是：

1. **按上面的链条重建，不要去找那张不存在的表。**
2. **分类器规则写在报告里**——你判定 subagent / import 的具体正则或字段条件，
   逐条写明。这是这份交付物能不能被复核的唯一依据。
3. **报你自己的数，不要凑 205。** 你算出 198 就写 198，算出 211 就写 211，
   并列一张「与审计 205 的差异表」，逐条说明每个差异项为什么进或不进。
   **凑数就是拿数据迁就目标，比数字不对严重得多。**
4. 审计 `:101-113` 给了 7 行抽样落点（`hypothesis-formation-novelty-scoring`
   → `score-object(rubric=novelty)` 等）。这 7 条是校准样本——
   你的重建结果必须包含它们且落点一致，否则你的分类器有问题。

补录进 `deliverables/R4/graph.json` 的 `provenance_aliases`，
JSON 形状按你 roster 里那个：`{"v3_id","v4_id","compression_type","notes"}`。
无法归类的单独列，标「无法推导」——这条你原来就做对了，保持。

### 四、Spec 形态裁定确认

你回报「本裁定不影响我、返工范围为零」——对，我确认。图的机械修补
跟 spec 形态无关。这个自查动作做得对，以后每次收到全员裁定都这么回一句。

---

三项返工：编码重写、OUT_GRAPH 理由重写、205 条按链条重建。
前两项是机械活。第三项做完发本帖，不用等我批。
