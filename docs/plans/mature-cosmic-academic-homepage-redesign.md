---
type: consequential_design_plan
title: "Quiet Orbit: mature cosmic academic homepage redesign"
status: implemented_locally_waiting_for_human_acceptance
sensitivity: public_homepage_ui
current_consumer: Shiyu Hu
next_action: inspect_local_preview_and_accept_or_request_revision
does_not_authorize: implementation_commit_push_release
reasoning_policy: phase_specific_low_medium_high; xhigh_requires_explicit_authorization
---

# Quiet Orbit：成熟、克制的宇宙科技感学术主页

## Agent Summary

本计划建议停止继续叠加局部 CSS 补丁，把主页收敛为 **Quiet Orbit（静默轨道）**：以成熟学术主页的可信、直接为骨架，以 Apple 式的清晰层级和工艺感为方法，以 NTU 深蓝和克制的轨道线索表达宇宙与科技气质。页面仍以白色为主，不使用星空底图、霓虹、发光边框、全页渐变或 AI 生成插画。

需要 Shiyu 裁决：是否接受 Quiet Orbit 作为实现基线。接受后才进入实现；本计划不授权 commit、push 或 release。

## 第一性原理：真实用户问题与成功标准

主页的 Job To Be Done 不是“看起来像一个设计作品”，而是让第一次访问的人在 10–20 秒内确认四件事：Shiyu 是谁、研究什么、近期有什么可信成果、如何继续了解或联系。设计感的作用是帮助理解和记忆，而不是抢占注意力。

当前不适感来自一个系统性问题：字体、字号、颜色、边线、卡片和装饰分别经过多轮局部调整，但缺少同一套比例和语义。成功标准是：100% 缩放下正文轻松阅读；首屏身份与研究方向一眼可见；蓝色有明确角色；论文图仍是视觉主角；宇宙感可被感知但不会被描述为“炫酷模板”。

## 当前现场：事实、推断与未知

### 已确认事实

- 当前分支为 `codex/ntu-editorial-ui`，HEAD 为 `8146f891d083d74c8348b719d621a66e36609220`。
- 工作区已有多项未提交主页改动；`_sass/_homepage-editorial.scss` 是未跟踪的大型覆盖层，当前继续叠加选择器会提高漂移风险。
- 当前实测桌面字号约为：姓名 43.5px、章节标题 25.2px、简介正文 15px、侧栏简介 12.3px。正文和辅助文本偏小是竞争性解释之一。
- 主页共有 51 个论文条目，默认显示 14 个，其中 preprints 默认显示 3 个；这些内容与交互约束需要保留。
- 同页锚点导航、论文展开、访客信息折叠、顶部/底部快捷按钮和 390px 移动端已在当前本地版本验证过。
- `Gemfile.lock` 当前存在由本地构建造成的非目标漂移，实施前需要隔离处理。
- `remote_fetch: not_run`；CI 未检查；远端状态未知。因此本计划只依据本地现场，不声称与 GitHub 远端一致。

### 推断

- 用户感到“字体字号仍有问题”，更可能由正文尺寸、阅读宽度、字重和上下留白的组合造成，而不是换一个装饰字体即可解决。
- “喜欢宇宙和科技，但不要炫酷”适合通过颜色深度、细线轨道、编号和空间节奏表达，不适合星空照片、粒子动画、玻璃拟态或霓虹蓝。
- 真实论文图已经提供足够丰富的视觉变化，因此页面框架应更安静。

### 未知

- Quiet Orbit 首屏在 Shiyu 自己的显示器、常用浏览器与观看距离下是否达到主观舒适；必须通过人类理解门确认。
- 当前本地修改与远端最新提交是否存在差异；交付前才需要 fetch 和远端核验。

## 历史失败怎样改变本次 Gate

前几轮依次出现了“黑色太重”“有底色不清爽”“字体奇怪”“头像黑边奇怪”“整体仍不协调”。这说明单点替换颜色或字号不能关闭问题。因此本次新增三个 failure gate：

1. 不再保留多套互相覆盖的视觉系统；实现时要合并并删除失效规则。
2. 宇宙感必须在关闭装饰后页面仍然成立，避免内容依赖特效。
3. 主观验收必须包含首屏与论文区的 100% 缩放截图，不以构建通过代替视觉合适。

## Authority / Owner / Identity

- 内容事实与论文顺序的唯一 owner：最新 CV 与 Shiyu 已确认的主页内容；本次不改研究事实。
- 视觉 token 与组件样式 owner：`_sass/_homepage-editorial.scss`，实现时应成为单一主页视觉层，而非新增第二个覆盖文件。
- 页面结构 owner：现有 `_includes/home/` 与 `_layouts/default.html`；只有 CSS 无法表达必要语义时才做最小 HTML 调整。
- 用户身份映射、论文链接、作者名、会议名和图片均冻结，不因视觉重构重写。

## 范围与冻结不变量

### 本次范围

- 统一字体、字号、字重、行高、阅读宽度和 8px 间距节奏。
- 统一颜色语义、边线、链接、按钮、论文卡片、侧栏和移动端层级。
- 加入克制、静态、低对比的轨道视觉语言，优先使用 CSS 或轻量内联 SVG。
- 清理叠加式 CSS，减少冲突与例外。

### 冻结范围与明确不做

- 不改个人经历、news 文案、论文顺序、论文链接和图片。
- 保留 51 篇论文、默认 14 篇、preprints 默认 3 篇。
- 保留同页导航、论文展开、访客折叠、顶部/底部快捷操作。
- 不引入外部字体、前端框架、动画库或 AI 生成宇宙图。
- 不使用全页底色、全暗色、星空背景、霓虹、玻璃拟态、持续动画和大面积渐变。
- 本阶段不 commit、不 push、不发布。

## 竞争方案与裁决

### A. 保留当前 Harmony 版本

优点是零迁移成本；缺点是用户已经多次明确感到不协调，且继续小修会加重 CSS 叠层。结论：不采用。

### B. 最强简单基线：成熟学术极简

纯白、近黑、单一蓝色链接、系统字体、无任何宇宙装饰。它具有很强的可信度、阅读性和低维护成本，也是 Quiet Orbit 必须至少达到的底线。缺点是个人识别度较弱。

### C. 推荐：Quiet Orbit

在 B 的信息架构和可读性上，只加入少量、语义一致的空间线索：首屏极淡轨道弧、章节编号/定位点、细蓝线与更有空气感的节奏。它能表达宇宙与科技偏好，同时仍像研究者主页而非产品落地页。

### D. 不采用的路线：深色赛博宇宙

星空、粒子、霓虹、发光按钮或大面积深色会提高视觉疲劳、削弱论文图与文本可信度，并与用户明确的“不炫酷、不要底色”冲突。

## Quiet Orbit 设计契约

### 字体与尺度

- 字体：系统 sans-serif 单一字体栈；英文优先 SF/系统 UI，中文回退 PingFang SC，避免 serif 与多字体混排。
- 姓名：42px / 1.08，700；移动端 34px。
- 章节标题：26px / 1.2，650；移动端 22px。
- 正文：17px / 1.62；移动端 16px；正文阅读宽度约 66–70ch。
- 导航与元信息：13–14px，但不得承载关键正文；最小可读文本不低于 13px。
- 字重只使用 400、500、650/700，避免轻字重和无规律的全大写。

### 配色 token

- `ink`: `#1D1D1F`，正文与主要标题。
- `secondary`: `#6E6E73`，日期与辅助信息。
- `canvas`: `#FFFFFF`，页面唯一主画布。
- `rule`: `#E5E5E7`，分隔与边界。
- `ntu-navy`: `#181C62`，主品牌色、标题重点和主要链接。
- `orbit-blue`: `#3157A4`，交互、定位点和轨道细线。
- `ntu-red`: `#D71440`，仅保留作者本人或极少语义强调，不作大面积装饰。

颜色使用规则：蓝色只承担品牌、链接和定位三类角色；正文不用蓝色；每个视口不同时出现多个高饱和蓝色区块。

### 视觉语言

- 首屏可有一组 2–3 条低对比、静态轨道弧，透明度约 4%–8%，不得穿过正文。
- 章节使用小型轨道点或两位编号建立连续感，不给每个区块加卡片底。
- 论文图片保留真实比例和点击行为；卡片主要靠留白与细线区分，不使用厚阴影。
- 头像不使用黑色外圈；采用白底、1px 中性边线或无边线。
- 动效仅允许短促 hover/focus 反馈，并遵守 `prefers-reduced-motion`。

## 分阶段任务清单与关键路径

### Phase 0：Ready 与可恢复基线

- 记录当前工作区 digest、允许修改路径和浏览器基线截图。
- 隔离 `Gemfile.lock` 的非目标漂移，不覆盖用户其他改动。
- 确认本地 Jekyll 构建命令与 4173 预览可复现。
- 推理强度：low；这是机械证据整理。

### Phase 1：视觉系统收敛

- 在 `_sass/_homepage-editorial.scss` 定义字体、颜色、尺寸、间距和响应式 token。
- 移除同文件中被新系统取代的层叠覆盖，禁止通过文件末尾继续追加补丁。
- 将页面恢复到最强简单基线 B，再验证信息层级。
- 推理强度：medium；主要是系统化映射与回归控制。

### Phase 2：Quiet Orbit 身份层

- 在首屏加入唯一一处轨道母题，并将章节点、细线和交互反馈映射到同一语言。
- 优先 CSS 伪元素；确需结构时只做一个无障碍隐藏的装饰节点。
- 验证关掉装饰后仍能保持成熟学术基线。
- 推理强度：high；这是审美裁决与多组件一致性的 bounded slice，停止条件是桌面和移动端首屏都不遮挡、不溢出、层级清楚。

### Phase 3：论文区与长页节奏

- 统一 51 个论文条目的标题、作者、venue、链接、图像与留白，不改变顺序或内容。
- 检查 preprints 默认 3 个可见、展开按钮和锚点行为。
- 推理强度：medium。

### Phase 4：验证与人类验收

- 构建、静态验证、桌面/移动浏览器交互和截图对比。
- 请 Shiyu 在 100% 缩放下只判断两个画面：首屏与论文区；若仍“费眼”或“像模板”，退回 Phase 1，而不是增加装饰。
- 推理强度：low 用于机械检查，medium 用于归因；xhigh 不自动使用，只有出现跨层难解冲突且得到明确授权才可启用。

注：运行时覆盖未验证；这里的 low / medium / high 是阶段执行与验证预算，不是底层模型设置的切换声明。

## 验证矩阵与对抗性失败路径

| 目标 | 检查 | 通过条件 | 失败动作 |
|---|---|---|---|
| 可读性 | 1280px、100% 缩放截图与计算样式 | 正文 17px 左右、行宽 66–70ch、无密集小字 | 回到字体 token，不改装饰 |
| 移动端 | 390px 浏览器检查 | 无横向溢出；导航、头像、论文图不挤压 | 回到响应式栅格 |
| 内容完整 | `ruby scripts/validate_site.rb --site _site` | 51 篇、默认 14 篇、preprints 3 篇及全部锚点通过 | 停止视觉交付并修复回归 |
| 构建 | Jekyll build + `git diff --check` | 构建成功，无空白错误和意外 lockfile 漂移 | 隔离构建环境后重试 |
| 交互 | 同页导航、展开、访客折叠、顶部/底部按钮 | 均在当前页工作，键盘 focus 可见 | 回滚对应组件样式/JS |
| 克制宇宙感 | 关闭装饰层的 A/B 截图 | 无装饰仍成熟；开启后只增加识别度 | 删除轨道装饰，不补更多特效 |
| 对抗性路径 | 长论文标题、无图片条目、窄屏、reduced motion | 不溢出、不塌陷、无强制动画 | 以内容极值修正组件约束 |

## 五类 Gate Ledger

- `engineering_local`: 本地构建、静态脚本、diff check、桌面与移动交互全部通过。
- `engineering_integrated`: 与远端基线核验并确认 CI；当前未运行，不能视为通过。
- `human_comprehension`: Shiyu 能在首屏快速识别身份、研究主题与主要入口，并确认字体舒适。
- `natural_task_value`: 页面让真实访问者更快理解研究与成果，而不只是截图更“酷”。
- `delivery`: 只有 Shiyu 另行授权后才能 commit、push 或 release；本计划不关闭该门。

## 风险、回滚与停止规则

### 主要风险

- CSS 清理误伤旧页面或隐藏状态；通过限定主页选择器与 51 条内容计数防护。
- 轨道装饰在小屏遮挡文字；移动端可完全关闭装饰。
- 系统字体在不同平台字宽不同；通过 reading measure 和最坏标题测试控制。
- 当前 dirty worktree 混入非目标改动；实施前建立允许路径清单和 patch digest。

### 回滚

- 实现前保存当前允许路径的只读 diff 与截图作为恢复证据。
- 每个 Phase 形成独立可审查 patch；失败时只反向应用该 Phase patch，不使用 `git reset --hard` 或覆盖整个工作区。
- 若 Quiet Orbit 身份层失败，回滚到已验证的方案 B，而不是回到更早的黑底版本。

### 停止规则

- 发现内容事实、论文顺序或链接发生非预期变化时立即停止视觉工作。
- 同一视觉问题连续两次仅靠末尾覆盖修补才能解决时停止，回到 token/结构根因。
- 构建或移动端回归未关闭，不进入 human/delivery gate。
- Shiyu 表示“仍费眼”或“过于模板化”时，不继续加装饰，先重新审视字号、行宽和留白。

## Definition of Ready

- Shiyu 接受或修订 Quiet Orbit 方向。
- 当前 dirty worktree 的目标/非目标修改已分类，`Gemfile.lock` 漂移已隔离。
- 已保存桌面与移动基线截图、当前 diff digest 和允许修改路径。
- 构建与验证命令可在本地复现。
- 冻结内容、不变量和 delivery 边界已确认。

## Definition of Done

- 字体、颜色、间距和组件只由一套主页视觉 token 控制，无新的末尾补丁堆叠。
- 1280px 与 390px 均通过可读性、无溢出、锚点和交互验证。
- 51 篇论文、默认 14 篇、preprints 默认 3 篇及全部事实/链接保持不变。
- Quiet Orbit 装饰静态、克制、可关闭，并通过 reduced-motion 与对比检查。
- `engineering_local`、`human_comprehension`、`natural_task_value` 关闭；其余 Gate 明确保持开放或另行验证。

## Delivery Ledger 与交付边界

- Plan candidate：已于 2026-08-24 获 Shiyu 接受。
- Implementation：已在本地完成；Quiet Orbit token、字体尺度、轨道母题和响应式样式已进入 `_sass/_homepage-editorial.scss`。
- Commit：未授权。
- Push：未授权。
- Release / GitHub Pages：未授权。
- 远端 fetch 与 CI：未检查。

### 本地实施回执（2026-08-24）

- Jekyll 完整构建通过。
- `ruby scripts/validate_homepage_structure.rb` 与 `ruby scripts/validate_site.rb --site _site` 通过。
- `git diff --check` 通过。
- 浏览器验证：无横向溢出；51 篇论文中默认 14 篇可见；11 个 preprints 中默认 3 个可见，展开后 11 个可见。
- 同页导航仍为主页锚点；顶部/底部快捷按钮完成长页往返。
- 人类理解 Gate 仍待 Shiyu 查看当前本地预览后关闭。

## 计划生命周期

- `closure_condition`: Quiet Orbit 实现完成，Definition of Done 关闭，并得到 Shiyu 的首屏/论文区人类验收。
- 完成后本计划由 `candidate_waiting_for_user_acceptance` 更新为 `completed`，并记录最终验证证据；若选择方案 B 或新路线，则标为 `superseded` 并链接继任方案。
- 本计划退场不代表 delivery gate 自动关闭；commit、push、release 继续需要单独授权。
