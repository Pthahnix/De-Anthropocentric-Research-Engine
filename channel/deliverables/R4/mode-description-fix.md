# description-mode 一致性修复

依据：v4 节点 description 与 `scripts/refactory_source.json`。v3 对应内容是独立 strategy，而不是可继承的 `.modes` 数组，因此删除 description 中把它们宣称为 mode 的句子。

| 节点 ID | description 原宣称 | v3 实际 mode | 操作 |
|---|---|---|---|
| `synthesize-literature-evidence` | scoping / systematic / deep / narrative / snowball 是 execution modes | 未发现 `.modes`；v3 为五个独立 survey strategy | 改 description，保留 reproducible literature evidence base 主语义 |
| `synthesize-meta-analytic-evidence` | pairwise / network / cumulative / heterogeneity / bias modes | 未发现 `.modes`；v3 为独立 synthesis strategy | 改 description，删除 mode 列举 |
| `sensitivity-analysis` | Morris / Sobol / perturbation / Monte-Carlo as modes | 未发现 `.modes`；v3 为独立 parameter-screening / variance-decomposition 等 strategy | 改 description，删除 mode 列举 |
| `design-experiment` | factorial / ablation / comparison / scaling / robustness are modes | 未发现 `.modes`；v3 为五个独立 design strategy | 改 description，删除 mode 列举 |

仅修改上述四个节点的 `desc`；未新增节点，未修改 `provenance_notes`。
