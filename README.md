<h1 align="center">BlockPlan</h1>

<p align="center">
  <b>任务块排程工具：先把事情做成可复用的块，再拖进日历形成计划。</b>
</p>

<p align="center">
  简体中文 · <a href="README.en.md">English</a> · <a href="docs/USAGE_GUIDE.md">图解指南</a>
</p>

<p align="center">
  <a href="https://github.com/WanderLandWalker/blockplan/releases/latest">
    <img src="https://img.shields.io/badge/Release-v0.2.11-blue?style=for-the-badge" alt="Release">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
  </a>
  <img src="https://img.shields.io/badge/Windows-ready-2563eb?style=for-the-badge" alt="Windows">
  <img src="https://img.shields.io/badge/Android-ready-16a34a?style=for-the-badge" alt="Android">
  <img src="https://img.shields.io/badge/Web-ready-f59e0b?style=for-the-badge" alt="Web">
  <img src="https://img.shields.io/badge/Local_First-local-64748b?style=for-the-badge" alt="Local First">
</p>

<p align="center">
  <img src="docs/images/guide-overview-light.png" alt="BlockPlan 主界面图解" width="900">
</p>

## 为什么需要它

很多计划工具都能创建待办、日历事件和提醒，但真正做计划时常常会卡在几个地方：

| 痛点 | BlockPlan 的做法 |
|------|------------------|
| 待办只告诉你要做什么，不告诉你什么时候做 | 把任务直接拖到时间表上，任务天然拥有开始时间和时长 |
| 日历适合固定事件，不适合反复组合学习、项目、生活任务 | 先创建任务块模板，再反复拖入不同日期 |
| 相似任务每次都要重新填名称、分类、颜色、时长 | 模板库保存这些信息，下一次直接复用 |
| 颜色多了以后日历会变乱，看不清投入结构 | class/tag 同时参与过滤、统计和分类视图 |
| 自动排程工具很强，但有时太重、太黑箱 | 先提供可解释、可手动控制的拖拽排程，再逐步加入自动化 |

BlockPlan 解决的不是“记录一个事件”，而是“把一堆要做的事情变成可以移动、复用、统计和复盘的块”。

## 核心差异

Sunsama、Akiflow 偏向任务聚合和日计划；Motion、Reclaim 偏向自动安排任务、会议和习惯；普通日历和待办应用适合固定事件、提醒和清单。

BlockPlan 的定位更窄，也更直接：

| 对比方向 | 常见工具 | BlockPlan |
|----------|----------|-----------|
| 入口 | 从日历事件或待办事项开始 | 从可复用任务块开始 |
| 排程方式 | 创建事件、填写表单、自动安排 | 从模板库拖到时间格 |
| 复用方式 | 复制任务、重复规则、隐藏模板入口 | 模板就是主界面的一等公民 |
| 分类视角 | 多数以列表、项目、日历颜色为主 | class/tag 同时参与过滤、统计和分类视图 |
| 控制感 | 自动化更强，但规则更复杂 | 手动拖拽更直观，计划怎么变一眼可见 |
| 使用门槛 | 常需要账号、集成或订阅 | 当前版本本地可用，不需要账号 |

你不是在“填日历”，而是在操作一套属于自己的任务积木。复习、项目、习惯、复盘这些事情可以先沉淀成模板，再被反复组合成每天的安排。

## 功能

| 功能 | 说明 |
|------|------|
| 任务块模板 | 创建可复用任务，设置分类、标签、颜色、默认时长 |
| 拖拽排程 | 把任务块拖进日历，快速安排到某天某个时间段 |
| 周 / 日 / 分类视图 | 从时间、当天清单和分类投入多个角度查看计划 |
| 当前日清单 | 自动整理选中日期的任务，方便按顺序执行 |
| 冲突提示 | 时间重叠时会提示，避免安排互相打架 |
| 任务详情卡 | 点击日历或清单里的任务，可查看完整状态、时间、分类和备注 |
| 内置使用演示 | 第一次打开会显示三步引导，也可点击顶部 `?` 在软件内查看完整演示 |
| 双语界面 | 支持中文 / English 一键切换，语言偏好保存在本机 |
| 深色模式 | 支持浅色 / 深色主题切换，并会记住你的偏好 |
| 本地保存 | 数据保存在本机，支持 JSON 导入、导出和恢复默认示例 |
| 多端使用 | 支持 Windows、Android 和浏览器 HTML 版 |

## 下载

到 [Releases](https://github.com/WanderLandWalker/blockplan/releases/latest) 下载最新版。

| 文件 | 适合谁 | 说明 |
|------|--------|------|
| `BlockPlan-0.2.11-windows-setup.exe` | Windows 常用用户 | 安装到系统里，后续从开始菜单或桌面启动 |
| `BlockPlan-0.2.11-windows-portable.exe` | 想免安装使用的人 | 双击即用，不写入安装目录 |
| `BlockPlan-0.2.11-android-debug.apk` | Android 手机用户 | 下载到手机后安装使用 |
| `BlockPlan-0.2.11-web.zip` | 只想用浏览器打开的人 | 解压后打开 `index.html` |

不知道选哪个：

- Windows 电脑：优先下载 `windows-setup.exe`。
- 临时试用：下载 `windows-portable.exe`。
- Android 手机：下载 `android-debug.apk`。
- 不想安装任何东西：下载 `web.zip`。

## 图解指南

想按图操作，可以直接打开 [BlockPlan 图解指南](docs/USAGE_GUIDE.md)。

常用操作入口：

- [安装和选择版本](docs/USAGE_GUIDE.md#安装和选择版本)
- [第一次打开](docs/USAGE_GUIDE.md#第一次打开)
- [创建任务块](docs/USAGE_GUIDE.md#创建任务块)
- [拖拽排程](docs/USAGE_GUIDE.md#拖拽排程)
- [查看任务详情](docs/USAGE_GUIDE.md#查看任务详情)
- [调整和复盘任务](docs/USAGE_GUIDE.md#调整和复盘任务)
- [切换语言和主题](docs/USAGE_GUIDE.md#切换语言和主题)
- [导入导出备份](docs/USAGE_GUIDE.md#导入导出备份)
- [AI 生成草稿](docs/USAGE_GUIDE.md#ai-生成草稿)

## 快速使用

### 1. 创建任务块

点击顶部 `新建块`，填写名称、分类、标签、默认时长、颜色和备注。任务块可以理解成“以后还会重复用的计划模板”。

### 2. 拖进日历

把左侧模板库里的任务块拖到中间日历画布的某一天、某个时间段。松手后，它会变成一个已经安排好的任务实例。

```text
模板：高数复习，默认 90 分钟
拖到：周一 09:00
结果：周一 09:00-10:30 有一个高数复习任务
```

### 3. 调整任务

点击日历里的任务，可以在右侧详情面板里完成、拆分、提前、延后、缩短、延长、推迟或删除。点击任务块本身也会弹出详情卡，方便查看短任务显示不全的内容。

### 4. 切换视图

| 视图 | 适合看什么 |
|------|------------|
| 周视图 | 这一周每天排了什么 |
| 日视图 | 今天每个时间段具体做什么 |
| 分类视图 | 哪类任务占用了多少时间 |

### 5. 备份数据

工具栏里有导入、导出和重置。清浏览器缓存、换浏览器、卸载应用或换设备前，请先导出 JSON。

## 常见问题

### Windows 提示未知发布者怎么办？

当前版本还没有做代码签名，所以 Windows 可能会提示未知发布者。确认安装包来自本仓库 Release 后，可以选择继续运行。

### Android 提示禁止安装怎么办？

这是 Android 对 APK 安装来源的限制。需要在系统设置里临时允许当前浏览器或文件管理器安装未知来源应用。

### 数据保存在哪里？

数据默认保存在本机浏览器或应用环境里。当前版本不需要账号，没有云端同步，也没有后端服务。

### AI 生成是什么？依靠什么实现？

当前的 AI 生成是本地规则解析原型，不会调用在线大模型。它会从你的描述里识别“数学、英语、政治、复盘、吃饭、运动、项目”等关键词，以及“明天、上午、下午、晚上、90 分钟”等时间信息，然后自动生成任务块和排程草稿。

## 当前限制

- 移动端可以使用，但拖拽交互还没有专门为触控深度优化。
- 目前只有冲突提示，还不会自动帮你重排。
- AI 创建任务块还是原型能力，没有接入真实在线模型。
- Windows 和 Android 包还没有正式代码签名。

## 版本历史

| 版本 | 变化 |
|:----:|------|
| v0.2.11 | 桌面端支持拖拽调整模板库和详情区宽度，并自动记住用户调整；手机端保持底部导航布局 |
| v0.2.10 | 整理手机端详情操作区，默认显示 4 个常用操作，低频调整收进“更多调整”，避免按钮被遮挡或数量看起来混乱 |
| v0.2.9 | 手机端改为顶部精简排程栏、底部导航和更多操作抽屉，减少遮挡并提升移动端可用性 |
| v0.2.8 | 优化 Android 手机端布局，修正顶部遮挡和移动端版本号显示 |
| v0.2.7 | 优化按钮响应速度，使用演示内容改为按需渲染，避免隐藏动画影响主界面 |
| v0.2.6 | 应用内使用演示增加视觉示意和轻动画，移除 README 中容易失效的 Star History 破图 |
| v0.2.5 | 使用演示改为软件内展开，不再通过外链打断使用流程 |
| v0.2.4 | README 中英文拆分，新增图解指南、MIT 开源协议和软件内首次使用引导 |
| v0.2.3 | 增加浅色 / 深色主题切换和完整深色模式适配，新增点击任务查看详情卡 |
| v0.2.2 | 修复日历滚动时任务块遮住日期表头的问题，增加 sticky 表头层级和顶部渐隐遮罩 |
| v0.2.1 | 增加中文 / English 双语界面、英文 README、英文 AI 草稿解析和更完整的用户使用说明 |
| v0.2.0 | 首个公开预览版，支持 Web、Windows、Android，包含任务块模板、拖拽排程、导入导出和冲突提示 |

各版本可在 [Releases](https://github.com/WanderLandWalker/blockplan/releases) 下载。

## 如果觉得有用

如果这个工具帮你把计划从“脑子里的一团”变成能拖动、能执行、能复盘的块，欢迎给个 Star 支持一下。

<p>
  <a href="https://github.com/WanderLandWalker/blockplan">
    <img src="https://img.shields.io/github/stars/WanderLandWalker/blockplan?style=social" alt="GitHub Stars">
  </a>
</p>

也欢迎请作者喝杯咖啡：

<p>
  <img src="images/donate.jpg" alt="赞赏码" width="250">
</p>

## 项目热度

<p align="center">
  <a href="https://github.com/WanderLandWalker/blockplan/stargazers">
    <img src="https://img.shields.io/github/stars/WanderLandWalker/blockplan?style=for-the-badge&logo=github" alt="GitHub Stars">
  </a>
  <a href="https://github.com/WanderLandWalker/blockplan/forks">
    <img src="https://img.shields.io/github/forks/WanderLandWalker/blockplan?style=for-the-badge&logo=github" alt="GitHub Forks">
  </a>
</p>

Star 趋势图可在 [Star History](https://www.star-history.com/#WanderLandWalker/blockplan&Date) 查看；README 里不再直接嵌入外部趋势图，避免第三方 SVG 服务异常时显示破图。

## 开源协议

本项目采用 [MIT License](LICENSE)。
