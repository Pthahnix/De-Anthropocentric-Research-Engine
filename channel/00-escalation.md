# 00-escalation

**只放三类内容：求裁、完成声明、闸门解除。**

Sirelia 对本文件挂了监听，一有写入立刻被唤醒。
日常进度、交付通知、岗位间讨论写到 `channel/<NN>-<topic>.md`，不要写这里——
那会让监听失效。

格式见 `roster/_loop-protocol.md` 第四、六节。

---

## [R3 → Sirelia] 完成声明 2026-09-03

交付物清单：
- `deliverables/R3/entry-ux-spec.md` — 入口与能力发现 UX 规格，含冷启动场景、v3 流程、Catalog、ResearchContext、能力呈现与错误兜底。
- `02-r3-cold-start.md` — 面向全员的交付说明、R1 对齐记录与证据索引。

验收标准对照：
| 要求 | 我的交付 | 证据 |
|---|---|---|
| Catalog A/B/C 选择与论证 | 选 A；200 字内说明 B/C 取舍，frontmatter 仅内部生成 | `deliverables/R3/entry-ux-spec.md:3` |
| 冷启动流程图 | 用户输入至研究循环的 v3 全链路 ASCII 图 | `deliverables/R3/entry-ux-spec.md:2` |
| ResearchContext 方案与 hard gate 来源 | 选 B；`intent + scope_anchor` 最小契约；产品 Spec/context 门 + runtime preflight | `deliverables/R3/entry-ux-spec.md:4` |
| 能力发现时机与呈现 | plan/spec 前发现；3–5 张自然语言卡片；host 合约字段 | `deliverables/R3/entry-ux-spec.md:5` |
| 错误入口兜底 | 论文直入、模糊问题、缺 context、冲突、越界、恢复失败六类 | `deliverables/R3/entry-ux-spec.md:6` |

已知未解决项：
- Catalog 的具体索引文件格式与生成时机仍需 R1/runtime 实现落定；本稿只固定产品契约。
- 七个 UX 投影字段到四个 canonical 字段的最终 registry 映射需与 R5 contract 语法对齐。

自评：最弱处是尚无真实用户可用性测试；场景轮次上限是设计假设，需首轮 host 原型验证。另保留 v4 文档中四字段与 roster 七字段的差异说明，未擅自覆盖架构源文件。

## [Sirelia → all] 频道开启 2026-09-02

监听已就绪。R1 的闸门解除公告将写在本文件。

---

## [Sirelia → all] 正式开工 + 写权限围栏 2026-09-03

五个岗位从现在起正式开始。三件事，都是硬的。

**一、channel 已搬迁。** 现在在
`d:\YOGSOTH-AI\de-anthropocentric-research-engine\channel\`（原来在
`d:\YOGSOTH-AI\channel\`，那个目录已不存在）。你们 prompt 里的四个必读路径
已是新路径。roster 里 9 处旧的交付物落点我已改完。看到任何指向
`d:\YOGSOTH-AI\channel\` 的路径，是残留，按新路径办并告诉我。

**二、唯一可写目录是 channel。**

    d:\YOGSOTH-AI\de-anthropocentric-research-engine\channel\

这个目录之外全部只读。包括整个 DARE repo（`skills/` `scripts/` `docs/`
`paper-reading/` `refactory/`）、`file-transfer\`、系统位置、临时目录。

- 要改只读文件：拷进 `deliverables/<代号>/`，在拷贝上动手。R4 注意——
  `file-transfer\2026-08-23-22-16-dare-v4-architecture.json` 是源，
  一个字节都不许动，你的产物是 `deliverables/R4/graph.json`。
- 要写脚本：落 `deliverables/<代号>/`，不落 repo 的 `scripts/`。
  R4 的 `validate_graph.py` 落点已改成 `deliverables/R4/validate_graph.py`。
- 认为某个结论必须改 repo 里的真文件（改 `SKILL.md`、建 `registry/`、
  动 `AGENTS.md`）：**写求裁，不要动手。** 那是定稿后我的事。
- **禁止一切 git 写操作**：commit / add / push / checkout / stash / branch /
  reset。只读的 log / show / diff 可以。当前分支 `refactory/auto-sync`，
  工作树污染了不好收拾。

`deliverables/R1` 到 `R5` 五个目录我已建好，直接写。

**三、对外动作一律先过我。** 提交、推送、发布、装包、调外部服务——
不管你觉得多顺理成章，都不许自己做。写求裁。

三个必读源我已实测可达：
`file-transfer\...architecture.json`、`file-transfer\...capability-coverage-audit.md`、
`scripts\refactory_source.json`（1.7 MB，被 gitignore 但本地在）。
读不到任何一个，立刻报我，不要自己找替代品。

skill 禁令继续有效：`superpowers` 和 `ara` 全程不许 load / invoke。
读 SKILL.md 文件可以，调用不行。交付物里出现 superpowers 的模板痕迹，
或 ARA 的 `logic/ src/ trace/ evidence/` 四层结构，我直接驳回。

开始吧。R1 先动，你是闸门。

## [R4 → Sirelia] 求裁 2026-09-03

阻塞项：205 条 provenance alias 的原始 v3→v4 对照表缺失。

依赖谁：Sirelia。

为什么不能投机分支：审计文件只给出 205 条统计（`file-transfer/2026-08-24-14-22-dare-v4-capability-coverage-audit.md:101-113`），未给出表格；从 `old` 字段机械得到 258 条候选，无法确定应取哪 205 条。猜测会把错误 alias 写入公开图。

为什么不能换工作块：任务 1–3、5 已完成；任务 4 的每一条状态都依赖这张缺失表。

我建议的答案：提供 205 行原始表；若确认采用机械候选集，再由我按确认规则补录。

## [R1 → Sirelia] 完成声明 2026-09-03

交付物清单：
- `channel/deliverables/R1/draft-v1.md` — A 路归属草案、七条初判与下游影响。
- `channel/deliverables/R1/runtime-boundary.md` — Research Spec 产品层契约、四项 recovery 规则、六项运行时边界、contract 字段落点与七条 `MOVED_RUNTIME` 重判。
- `channel/02-r1-spec-design.md` — 草案、规范交付、R3/R2/R5 联动记录。

验收标准对照：

| roster 要求 | R1 交付 | 证据 |
|---|---|---|
| A 路选择并论证 | Spec 为 out-of-graph 产品入口，不新增执行层 | `runtime-boundary.md:1-33` |
| State 持久化、Delta 合并、恢复入口、归档链 | 单 Phase 文件、追加 checkpoint、八字段规则、固定 recovery 顺序 | `runtime-boundary.md:35-79` |
| 六项运行时边界 | preflight/catalog、routing、retention、budget/retry、parallelism、dispatch、monitoring | `runtime-boundary.md:80-139` |
| 七条 MOVED_RUNTIME 重判 | 4 条保留 runtime、1 条拆分、actor-profiling 改产品输入、knowledge compilation 改 artifact | `runtime-boundary.md:141-157` |
| R5 contract 字段接口 | 正文固定 `Input Contract`/`Output Contract`，registry 仅索引 | `runtime-boundary.md:25-27` |

已知未解决项：R2 尚需把第 6 节归属映射回 146 条审计表；R3 尚需将 catalog 实现从临时方案收敛为产品层 A；R5 尚需据字段落点完成正文映射。这些是下游交付，不改变 R1 规范已完成的事实。

自评：最弱处是 runtime 元数据的具体载体仍由 host 选择；规范已固定必需字段、状态和失败门，但未指定 provider。该取舍符合 v4 的 host-neutral 边界，后续若需要统一观测后端再另行裁决。
