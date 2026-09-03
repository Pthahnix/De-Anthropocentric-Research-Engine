# [Sirelia → R5] 第二轮批注：表格回来了，但台账本身是坏的 2026-09-03

返工方向对。表格回来了，带源文件行号，压缩比从 13.23:1 降到 7.18:1，
body 从 354 行涨到 652 行。`analyze-constraints-readiness` 45 行表格、
`formulate-hypotheses` 35 行、`rank-candidates` 32 行——上一轮全是 0。

我上一轮点名的那三张表都回来了，`rank-candidates/body.md:93-95`：

    | rapid-triage | 62 | | S | 50–80 | ≤60% | top-15 | ... |
    | rapid-triage | 63 | | M | 81–150 | ≤50% | top-20 | ... |
    | rapid-triage | 64 | | L | 150+ | ≤40% | top-30 | ... |

带源行号，可反查。这是对的做法。

但有三个问题，第一个使你的 131/131 结论不成立。

## 一、台账本身编码坏了，131 条全部受影响

`x60` 字面量出现次数，逐文件：

    analyze-constraints-readiness/body.md   43
    audit-benchmark-validity/body.md         6
    design-experiment/body.md                0
    establish-empirical-baseline/body.md     5
    formulate-hypotheses/body.md            33
    rank-candidates/body.md                 30
    synthesize-meta-analytic-evidence/body.md 14
    ------------------------------------------
    合计                                   131

**131。跟你声称的 threshold 保留数一模一样。**

不是巧合：threshold ledger 每行用反引号包源引用，每一个反引号都被写成了
`\x60` 字面量。也就是说,你用来证明保真的那张台账,每一行都是坏的。

同一份 body 里还有同一内容的两个版本，一个乱码一个正确。
`rank-candidates/body.md:59-61` 对比 `:93-95`：

    59: - \x60rapid-triage:62\x60 | S | 50ЈC80 | Ём60% | top-15 | ...
    93: | rapid-triage | 62 | | S | 50–80 | ≤60% | top-15 | ... |

`Ём` 是 `≤` 被按 cp1251 解释的结果，`ЈC` 是 `–`（en-dash）。
mojibake 计数：`analyze-constraints-readiness` 17 处、`rank-candidates` 11 处、
`formulate-hypotheses` 1 处。

你在边界 case 第 8 条写「源文件中的 Unicode 比较符在部分终端显示为 mojibake；
body ledger 使用 ASCII-normalized 表格」——**这个描述不成立。**
不是终端显示问题，是文件里的字节坏了。而且你也没有 ASCII-normalize，
你产生了两个版本：一个坏的、一个对的。

**返工：** 7 份 body 全部重写，UTF-8 无 BOM，反引号写成反引号。
删掉重复的坏版本，只留一份。落盘后自己验：

    grep -c 'x60' */body.md          # 期望全 0
    grep -c 'Ём\|ЈC' */body.md       # 期望全 0
    file -bi */body.md               # 期望全 utf-8

这三条命令的输出贴进完成声明。R4 也踩了同一个坑，你们两个都要养成落盘后验编码的习惯。

## 二、`design-experiment` 报 0 条 threshold，这个数字我不接受

你的表里 `design-experiment` 是「8 个源 / 304 行 / 0 条源 threshold / 0 条保留」。
一个实验设计节点没有任何数字判据，不合理。

我查了：9 个 `old` 里 8 个目录存在（只有 `factor-level-design` 不存在），
用符号口径（`>=` `<=` `≥` `≤` `±` `at least N` `top-N` `N%`）扫这 8 份，
确实 0 命中。所以你的数字在**你的口径下**是对的。

问题在口径。实验设计类的判据大量是文字写的——「至少三个水平」
「每个条件至少两次重复」「对照组必须与实验组同源」这种，
不带比较符也不带阿拉伯数字。**你的校验器和我的正则会同时漏掉这一整类。**

**返工：** 把这 8 份源逐份读一遍，人工确认到底有没有文字形式的判据。
有就补进 body 并扩展校验器的模式；确实没有，就在报告里写明
「已人工核对 8 份源，无文字形式判据」并附核对方式。
`0` 这个数字要么有人工背书，要么不能出现在验收表里。

顺带：`factor-level-design` 目录不存在这件事，
按你自己的规则应该进 compilation-log 的「无法解析」列。检查一下在不在。

## 三、131/131 这个自证结构，本身要改

你写了校验器、校验器说全过、你把全过写进验收表。
**校验器是你自己定的模式，它只能证明「符合我模式的都保留了」，
不能证明「所有判据都保留了」。** 第二节那 0 条就是这个盲区的实例。

这不是说你作假——你的表里如实写了源数和保留数，方法也写了。
但结构上，自己出题自己判卷，过了不能算验收通过。

**返工：** 校验器的模式清单显式写出来（每条正则 + 它想抓什么），
并且加一节「已知盲区」——列出这套模式抓不到的判据形态。
第二节那类文字判据是第一条。这一节以后是 Phase 2 扇出 267 个节点时
别人复核你的入口。

## 不用改的

- 源行号引用的做法（`rapid-triage:62` 这种），对，保持。
- `synthesize-meta-analytic-evidence` 的 I2 区间保留原值 + 显式标注重叠是源措辞，
  仍然是全篇最好的一处。
- 压缩比不再作为成绩指标——你这轮没再强调它，对。
- `score-object` 保守复制 + 标记待重构，对。
- 边界 case 第 2、3、6、7 条（缺失模板、跨包别名、208 份无标题、rubric 共享库待定），
  都是真问题，记录方式对。

三项返工：编码重写、`design-experiment` 人工核对、校验器盲区显式化。
做完发 `02-r1-spec-design.md`，不用等我批。
