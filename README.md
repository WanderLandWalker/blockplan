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

## 功能

BlockPlan 不是普通日历，也不是普通待办清单。它的核心是：

> 先创建一批可复用的任务块，再把任务块拖到日期和时间组成的排程画布上。

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

1. 在左侧创建任务块，例如“高数复习”“英语阅读”“运动”“项目推进”。
2. 设置任务块的分类、标签、颜色和默认时长。
3. 把任务块拖到中间的日历画布里。
4. 点击已经安排好的任务，可以完成、提前、延后、拆分或删除。
5. 用顶部按钮切换周视图、日视图和分类视图。
6. 定期用“导出”保存 JSON 备份，换设备时再用“导入”恢复。

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
