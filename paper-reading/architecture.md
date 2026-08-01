# Architecture

```bash
# ============================================================================
# INPUT
# ============================================================================
paper_ref="arXiv:24xx.xxxxx"   # 用户给的论文引用(arXiv ID / URL / 标题任一)

# ============================================================================
# STRATEGY 1/3 — deep-read  (tactic: progressive-passes, 4 sop 顺序执行)
# context-init 在这里落一个 context 文件
# ============================================================================

┌─[sop] first-pass-skim ─────────────────────────────[subagent]─┐
│ in:  paper_ref                                                │
│ MCP: literature-overview (摘要级扫描,不读全文)                  │
│ out: paper_type="empirical"                                   │
│      candidate_angles=["省钱角度","效果角度","适用范围角度"]      │
│      skim_notes="..."                                         │
└─────────────────────────────────────────────────────────────┬─┘
                                                                ▼
┌─[sop] second-pass-grasp ───────────────────────────[subagent]─┐
│ in:  paper_ref, paper_type, skim_notes                        │
│ MCP: literature-research (读 Intro/Method/Results 全文)          │
│ out: draft_bundle={problem,method,key_result,limitation}       │
│      uncertain_fields=["key_result 的具体数字待核"]              │
└─────────────────────────────────────────────────────────────┬─┘
                                                                ▼
              uncertain_fields 非空? ──否──▶ 直接跳到 extract-structured-bundle
                       │是
                       ▼
┌─[sop] third-pass-verify ───────────────────────────[subagent]─┐
│ in:  paper_ref, draft_bundle, uncertain_fields                │
│ MCP: alphaxiv.answer_pdf_queries (直接查,不走 literature-research)│
│ out: verified_bundle  (只补齐被标记的字段)                       │
└─────────────────────────────────────────────────────────────┬─┘

┌─[sop] extract-structured-bundle ───────────────────[subagent]─┐
│ in:  verified_bundle                                          │
│ out: bundle = {
│        problem:     {text, source_anchor},                    │
│        method:      {text, source_anchor},                    │
│        key_result:  {text, source_anchor, hedge_level},       │
│        limitation:  {text, source_anchor}                     │
│      }
└─────────────────────────────────────────────────────────────┬─┘

                          << context-checkpoint 落盘 >>          │

# ============================================================================
# STRATEGY 2/3 — quality-assurance  (tactic: dual-gate-verification)
# 关键约束:precision/recall 都是【全新 subagent】
#          绝不允许拿 bundle 自己核对自己
# ============================================================================

        ┌──────────────── bundle, paper_ref ────────────────┐
        ▼                                                    ▼
┌─[sop] pre-write-precision-check ──┐   ┌─[sop] pr
│ [subagent, 全新上下文]              │   │ [subagent, 全新上下文]              │
│ MCP: literature-research(重新查原文) │   │ MCP: literature-research(先不看bundle,│
│ 逐条拆 bundle claim → 逐条核对原文     │   │    覆盖) │
│ out: precision_result={            │   │ out: recall_result={               │
│   failure_type, flagged_claims}    │   │   failure_type, missing_nuggets}   │
└──────────────────┬─────────────────┘   └────────
                    └───────────────┬───────────────────────┘
                                     ▼
                   ┌─[sop] failure-routing ──[impo
                   │ in:  failure_type                       │
                   │ out: next_action, justification         │
                   └──────────────────┬───────────
                                       │
        ┌──────────────────┬──────────┴──────────┬──────────────────┐
        ▼                  ▼                     ▼
   precision_fail      recall_fail             drift_fail          none
        │                  │                  (此处还不会触发)         │
        ▼                  ▼
  retry_deep_read   retry_deep_read_supplement                   proceed
        │                  │
        └──────┐    ┌──────┘                                        │
               回到 STRATEGY 1(不是重跑整条 pipeli
                                                                     ▼
                                   << context-checkpoint 落盘 >>       │

# ============================================================================
# STRATEGY 3/3 — audience-first-writing  (tactic: marketing-led, 5 sop)
# ============================================================================

┌─[sop] angle-selection ─────────────────────────────[subagent]─┐
│ in:  bundle, candidate_angles
│ 用【已核实的 bundle】倒过来筛 candidate_angles,不是先定角度再核实  │
│ out: chosen_angle, rationale
└─────────────────────────────────────────────────────────────┬─┘

┌─[sop] hook-crafting ───────────────────────────────[subagent]─┐
│ in:  chosen_angle, bundle                                     │
│ 参考 references/hook-formulas.md (curiosity/stor
│ out: hook_text, formula_used                                  │
└─────────────────────────────────────────────────────────────┬─┘

┌─[sop] section-drafting-with-style ─────────────────[subagent]─┐
│ in:  bundle, chosen_angle, hook_text                          │
│ 风格是【生成前约束】写进 prompt,不是写完再改风格
│ out: article_draft                                            │
└─────────────────────────────────────────────────────────────┬─┘

┌─[sop] seven-sweeps-revision ───────────────────────[subagent]─┐
│ in:  article_draft, bundle                                    │
│ 3 个 sweep 顺序跑: Clarity → Prove It → Specific
│ out: revised_article, sweep_notes                             │
└─────────────────────────────────────────────────────────────┬─┘

┌─[sop] post-write-drift-check ───────────────────
│ in:  bundle, article_draft(=revised_article)                  │
│ [全新上下文重新读一遍成稿] vs bundle 做 diff                       │
│ (只查 稿子↔bundle 是否漂移,不重查原文——那是 prec
│ out: drift_result={failure_type, drift_issues}                │
└─────────────────────────────────────────────────────────────┬─┘

                   ┌─[sop] failure-routing (复用同一张表)──────┐
                   └──────────────────┬───────────────────────┘
                          ┌───────────┴───────────
                          ▼                        ▼
                    drift_fail                    none
                          │                        │
                          ▼                        ▼
               redraft_section              << con
             (只回 section-drafting-with-style           │
              /seven-sweeps 重写受影响段落,
              不回 deep-read,不回 angle-selection)   article (最终成品)
```
