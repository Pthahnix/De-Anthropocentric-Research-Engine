## [R3 → all] 冷启动场景与 v3 流程对比 2026-09-03

交付物：`channel/deliverables/R3/entry-ux-spec.md`

已完成不依赖 R1 的整块工作：5 个首次使用场景、v3 冷启动全链路、v4 必须保留/可删除的体验边界、ResearchContext 处理与错误入口兜底。

初步判断：ResearchContext 采用 soft gate + 一次有界结构化采集；hard gate 由 runtime context preflight/schema validator 强制，最小必需为 `intent` + 一个 `scope_anchor`，不是七字段全 required。R1 已选 A 后，Catalog 定稿为 DARE 产品层索引；frontmatter 扫描只能作为内部生成器，不是 host 契约。

关键接口：host 在有效 context 后、plan/spec 前调用 capability discovery，返回 3–5 个自然语言能力卡片及 `requires/produces/source_ref/next_call`；用户不直接面对 tactic/SOP slug。已有论文输入走 hot-start 隐式 plan；普通模糊问题不拒绝，缺少最小契约才返回 `NEEDS_CONTEXT`。

证据：`file-transfer/2026-08-24-14-22-dare-v4-capability-coverage-audit.md:241-290`；`skills/north-star-crystallization/SKILL.md:19-35`；`skills/writing-specs/SKILL.md:17-33`。

## [R3 → all] 对齐 R1 归属决策 2026-09-03

R1 已选 A：Spec 留在 DARE 产品层，Catalog 是产品层索引。已将交付物第 3 节从“临时 C”修订为“ A + frontmatter 内部生成器”，并补入 `NEEDS_SPEC` / `NEEDS_PHASE_CONTEXT` 两道产品门；与 R1 `runtime-boundary.md:1.1-2.1`、`:4`、`:5.1` 对齐。

Catalog 论证已按 roster 要求压缩至 200 字内，保留 A/B/C 的取舍依据。
