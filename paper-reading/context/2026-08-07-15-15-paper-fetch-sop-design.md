# paper-fetch SOP 设计

> Created: 2026-08-07 15:15
> Topic: paper-reading pipeline 的取原文起点 SOP 设计
> Phase: v2 实现前架构（承接 SOP pipeline 图 v2 修补，2026-08-07-13-42-sop-pipeline-graph.html / 2026-08-07-14-08-sop-graph-coverage-audit.md）

## Plan Context

SOP pipeline 图 v2（31节点/22边）修补完成后，用户指出图里缺一个更前置的节点：31个节点全部假设"已经拿到论文全文"，但没有任何节点负责"怎么拿到全文"这件事本身。用户的原始链路设想：先查 alphaxiv（arXiv 情形）→ alphaxiv 没有的走 Semantic Scholar 看渠道 → 如果判断是 bio 领域就再查 bioRxiv/medRxiv → 都没有则返回"无法获取原文"，不进行后续工作。

讨论中用户明确了一个关键架构决定：**这个 SOP 要与已有的 `literature-engine` 里的 `literature-research`（及其兄弟 `literature-overview`/`literature-search`）解耦**——不是让 `paper-fetch` 委托 `literature-research` 去读，而是 `paper-fetch` 自己直接调用 alphaxiv/Semantic Scholar/bioRxiv/medRxiv 的 MCP 工具，自成一个独立、自包含的起点节点。要么在这个 SOP 内部就拿到原文，要么它自己发现拿不到、直接停下。

本设计文档记录该 SOP 的完整设计，并同步更新进 SOP pipeline 图（`2026-08-07-13-42-sop-pipeline-graph.html`），把它接到所有下游节点的最前面。

## 设计决策记录（brainstorming 过程中逐条确认）

1. **产出形式**：不是"定位到哪里能读"的元信息，是全文本身（或明确的失败信号）。这是解耦决定的直接后果——如果只返回定位信息，下游节点还要再调用检索工具，那就没有真正解耦。
2. **输出内容**：全文 + 来源元数据（渠道、URL、DOI/arXiv ID），供后续 SOP 或审计引用。不是纯文本——多一层可追溯性，下游需要时能标注"这段来自 bioRxiv DOI:xxx"。
3. **领域判断时机**：先判断论文是不是 bio 领域，再决定跑哪条分支、跳过不相关步骤。不是不预判领域、固定顺序走完四步——那样会让明显非 bio 领域的论文无意义地多走 bioRxiv/medRxiv 两步。
4. **领域判断机制**：不用关键词/词根启发式（会误判交叉领域论文，如生信息 ML）。用 alphaxiv 的搜索结果本身当领域信号——alphaxiv 自己声明覆盖 CS/数学/物理/统计/EE/量子生物金融，不覆盖 biomedical/clinical/life science；alphaxiv 找到了就是非 bio 信号，找不到就视为可能是 bio 领域，往 bio 分支走。
5. **Semantic Scholar 的角色**：alphaxiv 找不到时，SS 不是直接被跳过、也不是直接判定为 bio 论文，而是查该论文的 `venue`/`externalIds`，用于精确定位下一步该查哪个源——如果 venue 显示是 arXiv 但 alphaxiv 未收录（比如太新），带着 SS 给的 arXiv ID 重试 alphaxiv；如果 venue 是 bioRxiv/medRxiv/PubMed 类，带着 SS 给的 DOI 进 bio 分支查；SS 也查不到或 venue 不可辨认，同样兜底进 bio 分支做最后尝试。
6. **输出格式**：不同渠道（alphaxiv/bioRxiv/medRxiv）原始返回格式不一致，强制统一输出字段，下游不需要关心来源差异。

## SOP 设计

### 基本信息

- **名称**：`paper-fetch`
- **定位**：pipeline 最左端的入口节点，所有其他节点的唯一上游依赖。与 `literature-research`/`literature-search`/`literature-overview` 三个 literature-engine SOP 解耦，不委托、不 import，直接持有 alphaxiv/Semantic Scholar/bioRxiv/medRxiv 的 MCP 工具调用逻辑。
- **执行方式**：subagent（沿用 `first-pass-skim`/`second-pass-grasp` 已有模式），走 `spawn-agent` 生成独立上下文，避免多步检索/降级判断污染主上下文。

### 输入

`paper_ref`（string）——论文标题、arXiv ID、DOI，或 URL，任意一种均可。

### 输出（强制统一结构，不因来源渠道而异）

```
{
  status: "found" | "not_found",
  full_text: string | null,       // markdown 全文，仅 found 时非空
  source_channel: "alphaxiv" | "biorxiv" | "medrxiv" | null,
  source_url: string | null,
  identifier: string | null,      // DOI 或 arXiv ID
}
```

`status: "not_found"` 时其余字段全部为 null，下游任何节点不得基于此继续执行。

### 决策流程

1. **alphaxiv 检索**——用 `paper_ref` 直接查（`alphaxiv.discover_papers` 或直接定位）。找到 → `alphaxiv.get_paper_content(fullText: true)` → 返回 `status: found, source_channel: alphaxiv`。alphaxiv 本身的覆盖范围（CS/数学/物理/统计/EE/量子生物金融）即是本步"是否非 bio 领域"的信号来源。

2. **未找到 → Semantic Scholar 查渠道**——用 `ss.relevanceSearch` 或 `ss.paper` 按标题/DOI 查，取其 `venue` 与 `externalIds`：
   - 若 `externalIds` 含 alphaxiv 未收录的 arXiv ID（如论文过新）→ 带该 ID 重试 alphaxiv → 命中则按步骤1返回。
   - 若 `venue` 指向 bioRxiv/medRxiv/PubMed 类，或 SS 本身查无结果/venue 不可辨认 → 无论哪种，均带着 SS 给出的 DOI（或原始标题，若 SS 未给出 DOI）进入步骤3。

3. **bioRxiv/medRxiv 检查**——用 `mcp__biorxiv__search_preprints` / `mcp__medrxiv__search_preprints` 按标题查（这两个工具是关键词检索，非 ID 直查）。找到高置信度匹配 → `fetch_fulltext(doi)` → 返回 `status: found, source_channel: biorxiv` 或 `medrxiv`。

4. **全部尝试失败**——返回 `status: not_found`。不编造内容，不允许任何下游抽取节点基于此继续执行。

### 在 pipeline 图中的位置

`paper-fetch` 是全图唯一的真正入口，无入边，出边指向所有 31 个既有节点里"第一步就要读论文文本"的那些起点节点——具体是：`first-pass-skim`（Keshav链首）、`unit-segmentation`（B0，句子切分链首）、`study-design-tool-gate`（门控G，A1/A2/A3链首）、`atomic-unit-writing`（C1a，原子单元链首）、`claim-writing`（C2a，SciFact链首）、`multi-stage-cascade-extraction`（B2，级联抽取链首）、以及若干无前置依赖的独立终点节点（`qalmri`、`qasper-evidence-qa`、`template-slot-filling`、`question-framing`、`research-question-appraisal`）。

`unit-classification`（B）不直接连 `paper-fetch`，因为它总是先经过 `unit-segmentation`（B0）；`domain-level-judgment`/`worst-case-lookup` 等下游节点同理，只连它们各自链条的链首。

## 与现有 literature-engine 的关系（明确记录，避免后续误解耦或误合并）

`literature-overview`/`literature-search`/`literature-research` 三个 SOP 内部已经有"alphaxiv 优先、SS 补充"的两级检索逻辑，且都声明"覆盖 biomedical/clinical 用 ss.relevanceSearch 间接摸"——但三者均没有 bioRxiv/medRxiv 直连分支，也没有"读不到原文就终止、不进行后续工作"这个显式失败退出约定。`paper-fetch` 不是这三者的第四个变体，也不修改这三者——它是 `paper-reading` pkg 专属、独立维护的入口 SOP，理由是用户明确要求 `paper-reading` 与 `literature-research` 解耦，不共享检索委托关系。若未来 `literature-engine` 也需要 bioRxiv/medRxiv 分支，那是它自己的演进路径，与本 SOP 无耦合。
