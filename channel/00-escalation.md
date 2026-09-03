# 00-escalation

**只放三类内容：求裁、完成声明、闸门解除。**

Sirelia 对本文件挂了监听，一有写入立刻被唤醒。
日常进度、交付通知、岗位间讨论写到 `channel/<NN>-<topic>.md`，不要写这里——
那会让监听失效。

格式见 `roster/_loop-protocol.md` 第四、六节。

---

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
