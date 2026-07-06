<h1 align="center">BlockPlan</h1>

<p align="center">
  <b>任务块排程工具：先把事情做成可复用的块，再拖进日历形成计划。</b>
</p>

<p align="center">
  <a href="https://github.com/WanderLandWalker/blockplan/releases/latest">
    <img src="https://img.shields.io/badge/Release-v0.2.0-blue?style=for-the-badge" alt="Release">
  </a>
  <img src="https://img.shields.io/badge/Windows-支持-2563eb?style=for-the-badge" alt="Windows">
  <img src="https://img.shields.io/badge/Android-支持-16a34a?style=for-the-badge" alt="Android">
  <img src="https://img.shields.io/badge/Web-支持-f59e0b?style=for-the-badge" alt="Web">
  <img src="https://img.shields.io/badge/Local_First-本地优先-64748b?style=for-the-badge" alt="Local First">
</p>

---

## 为什么需要它

很多计划工具都能创建任务、写待办、添加日历事件，但真正做计划时常常会卡在几个地方：

| 痛点 | BlockPlan 的做法 |
|------|------------------|
| **待办只告诉你要做什么，不告诉你什么时候做** | 把任务直接拖到时间表上，任务天然拥有开始时间和时长 |
| **日历适合固定事件，不适合反复组合学习、项目、生活任务** | 先创建任务块模板，再反复拖入不同日期 |
| **每次创建相似任务都要重新填名称、分类、颜色、时长** | 模板库保存这些信息，下一次直接复用 |
| **颜色很多以后日历会变乱，看不清投入结构** | class/tag 不只是颜色，还用于聚焦、分类视图和统计 |
| **自动排程工具很强，但有时太重、太黑箱** | 先提供可解释、可手动控制的拖拽排程，再逐步加入自动化 |

BlockPlan 解决的不是“记录一个事件”，而是“把一堆要做的事情变成可以移动、复用、统计和复盘的块”。

## 核心差异

市场上已经有不少优秀工具：

- [Sunsama](https://www.sunsama.com/) 和 [Akiflow](https://akiflow.com/) 偏向任务聚合、日计划和 time blocking。
- [Motion](https://www.usemotion.com/) 和 [Reclaim](https://reclaim.ai/) 偏向 AI 自动安排任务、会议、习惯和空档。
- 普通日历和待办应用适合记录固定事件、简单提醒和清单。

BlockPlan 的定位更窄，也更直接：

| 对比方向 | 常见工具 | BlockPlan |
|----------|----------|-----------|
| **入口** | 从日历事件或待办事项开始 | 从可复用任务块开始 |
| **排程方式** | 创建事件、填写表单、自动安排 | 从模板库拖到时间格 |
| **复用方式** | 复制任务、重复规则、模板入口 | 模板就是主界面的一等公民 |
| **分类视角** | 多数以列表、项目、日历颜色为主 | class/tag 同时参与过滤、统计和分类视图 |
| **控制感** | 自动化更强，但规则更复杂 | 手动拖拽更直观，计划怎么变一眼可见 |
| **使用门槛** | 常需要账号、集成或订阅 | 当前版本本地可用，不需要账号 |

它不可替代的点在于：你不是在“填日历”，而是在操作一套属于自己的任务积木。复习、项目、习惯、复盘这些事情可以先沉淀成模板，再被反复组合成每天的安排。

## 功能

| 功能 | 说明 |
|------|------|
| **任务块模板** | 创建可复用任务，设置分类、标签、颜色、默认时长 |
| **拖拽排程** | 把任务块拖进日历，快速安排到某天某个时间段 |
| **周 / 日 / 分类视图** | 从时间、当天清单和分类投入多个角度查看计划 |
| **当前日清单** | 自动整理选中日期的任务，方便按顺序执行 |
| **冲突提示** | 时间重叠时会提示，避免安排互相打架 |
| **本地保存** | 数据保存在本机，支持 JSON 导入、导出和恢复默认示例 |
| **多端使用** | 支持 Windows、Android 和浏览器 HTML 版 |

## 安装

到 [Releases](https://github.com/WanderLandWalker/blockplan/releases/latest) 下载最新版。

| 文件 | 适合谁 | 说明 |
|------|--------|------|
| `BlockPlan-0.2.0-windows-setup.exe` | Windows 常用用户 | 安装到系统里，后续从开始菜单或桌面启动 |
| `BlockPlan-0.2.0-windows-portable.exe` | 想免安装使用的人 | 双击即用，不写入安装目录 |
| `BlockPlan-0.2.0-android-debug.apk` | Android 手机用户 | 下载到手机后安装使用 |
| `BlockPlan-0.2.0-web.zip` | 只想用浏览器打开的人 | 解压后打开 `index.html` |

不知道选哪个：

- Windows 电脑：优先下载 `windows-setup.exe`。
- 临时试用：下载 `windows-portable.exe`。
- Android 手机：下载 `android-debug.apk`。
- 不想安装任何东西：下载 `web.zip`。

## 使用

### 1. 创建任务块

在左侧模板库里点击新建任务块，填写：

| 字段 | 怎么填 |
|------|--------|
| 名称 | 例如“高数复习”“英语阅读”“运动”“项目推进” |
| 分类 | 用来区分大方向，例如“考研”“生活”“项目” |
| 标签 | 用来细分内容，例如“数学”“阅读”“复盘” |
| 默认时长 | 这个任务通常需要多久，例如 30 / 60 / 90 分钟 |
| 颜色 | 用来在日历里快速识别 |
| 备注 | 可写目标、材料、注意事项 |

### 2. 拖进日历

把左侧任务块拖到中间日历画布的某一天、某个时间段。松手后，它会变成一个已经安排好的任务实例。

例如：

```text
模板：高数复习，默认 90 分钟
拖到：周一 09:00
结果：周一 09:00-10:30 有一个高数复习任务
```

### 3. 调整任务

点击日历里的任务，可以在右侧操作：

| 操作 | 作用 |
|------|------|
| 完成 | 标记这件事已经做完 |
| 提前 / 延后 | 调整开始时间 |
| 缩短 / 延长 | 调整任务时长 |
| 拆分 | 把较长任务拆成两段 |
| 删除 | 删除这一次安排，不影响原模板 |

### 4. 切换视图

| 视图 | 适合看什么 |
|------|------------|
| 周视图 | 这一周每天排了什么 |
| 日视图 | 今天每个时间段具体做什么 |
| 分类视图 | 哪类任务占用了多少时间 |

### 5. 备份数据

工具栏里有导入、导出和重置：

- **导出**：把当前数据保存成 JSON 文件。
- **导入**：从 JSON 文件恢复任务块和排程。
- **重置**：恢复默认示例数据。

清浏览器缓存、换浏览器、卸载应用或换设备前，请先导出 JSON。

## 适合场景

| 场景 | 用法 |
|------|------|
| **复习计划** | 把数学、英语、政治、专业课拆成不同任务块 |
| **项目推进** | 把调研、开发、测试、复盘拖到具体时间段 |
| **生活习惯** | 把运动、吃饭、休息、整理做成可复用模板 |
| **时间复盘** | 通过分类视图看一周时间主要花在哪里 |

## 常见问题

### Windows 提示未知发布者怎么办？

当前版本还没有做代码签名，所以 Windows 可能会提示未知发布者。确认安装包来自本仓库 Release 后，可以选择继续运行。

### Android 提示禁止安装怎么办？

这是 Android 对 APK 安装来源的限制。需要在系统设置里临时允许当前浏览器或文件管理器安装未知来源应用。

### 数据保存在哪里？

数据默认保存在本机浏览器或应用环境里。清浏览器缓存、换浏览器、卸载应用前，请先用“导出”备份 JSON。

### 会上传我的计划数据吗？

不会。当前版本不需要账号，没有云端同步，也没有后端服务。

## 当前限制

- 移动端可以使用，但拖拽交互还没有专门为触控深度优化。
- 目前只有冲突提示，还不会自动帮你重排。
- AI 创建任务块还是原型能力，没有接入真实在线模型。
- Windows 和 Android 包还没有正式代码签名。

## 版本历史

| 版本 | 变化 |
|:----:|------|
| v0.2.0 | 首个公开预览版，支持 Web、Windows、Android，包含任务块模板、拖拽排程、导入导出和冲突提示 |

各版本可在 [Releases](https://github.com/WanderLandWalker/blockplan/releases) 下载。

---

## Star History

<p align="center">
  <a href="https://www.star-history.com/#WanderLandWalker/blockplan&Date">
    <img src="https://api.star-history.com/svg?repos=WanderLandWalker/blockplan&type=Date" alt="Star History Chart">
  </a>
</p>

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
