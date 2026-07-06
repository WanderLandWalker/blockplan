<h1 align="center">BlockPlan</h1>

<p align="center">
  <b>把计划变成可拖动的任务块。先建模板，再拖进日历，形成当天和本周安排。</b>
</p>

<p align="center">
  <a href="https://github.com/WanderLandWalker/blockplan/releases/latest">
    <img src="https://img.shields.io/badge/Download-Releases-blue?style=for-the-badge" alt="Download">
  </a>
  <img src="https://img.shields.io/badge/Windows-可用-2563eb?style=for-the-badge" alt="Windows">
  <img src="https://img.shields.io/badge/Android-可用-16a34a?style=for-the-badge" alt="Android">
  <img src="https://img.shields.io/badge/Web-可用-f59e0b?style=for-the-badge" alt="Web">
</p>

---

## 这是什么

BlockPlan 是一个任务块排程工具。

普通日历通常是先选日期、再填事件；BlockPlan 反过来：先把你经常要做的事情做成“任务块”，再把这些块拖进日历里。它更适合复习计划、项目推进、日常习惯、复盘安排这类需要反复组合的计划。

## 主要功能

| 功能 | 说明 |
|------|------|
| **任务块模板** | 创建可复用的任务块，设置分类、标签、颜色和默认时长 |
| **拖拽安排** | 把任务块拖进日历，快速安排到某天某个时间段 |
| **周 / 日 / 分类视图** | 从时间、当天清单和分类投入多个角度看计划 |
| **当前日清单** | 自动整理选中日期的任务，方便按顺序执行 |
| **冲突提示** | 时间重叠时会提示，避免安排打架 |
| **本地保存** | 数据保存在本机，可导出 / 导入 JSON 备份 |
| **多端形态** | 支持 Web、Windows 桌面版和 Android 安装包 |

## 下载和使用

### Windows

到 [Releases](https://github.com/WanderLandWalker/blockplan/releases/latest) 下载 Windows 版，双击运行即可。

如果系统提示“未知发布者”，这是因为当前版本还没有做代码签名。确认来源是本仓库后，可以选择继续运行。

### Android

到 [Releases](https://github.com/WanderLandWalker/blockplan/releases/latest) 下载 APK，在手机上安装。

如果手机提示“禁止安装未知来源应用”，需要在系统设置里临时允许当前浏览器或文件管理器安装 APK。

### Web

下载源码后，也可以直接用浏览器打开：

```text
index.html
```

Web 版不需要服务器，也不需要注册账号。

## 怎么用

1. 在左侧创建任务块，例如“高数复习”“英语阅读”“运动”“项目推进”。
2. 设置任务块的分类、标签、颜色和默认时长。
3. 把任务块拖到中间的日历画布里。
4. 点击已经安排好的任务，可以完成、提前、延后、拆分或删除。
5. 用顶部按钮切换周视图、日视图和分类视图。
6. 定期用“导出”保存 JSON 备份，换设备时再用“导入”恢复。

## 适合谁

- 想把复习计划拆成一块一块安排的人。
- 想看清每天、每周时间投入比例的人。
- 不想每次都从零创建日程，想复用任务模板的人。
- 想先用一个本地工具整理计划，不想注册账号和同步云端的人。

## 数据和隐私

- 当前版本不需要账号。
- 没有云端同步，也不会上传你的计划数据。
- 数据默认保存在本机浏览器或应用环境里。
- 导入 / 导出的 JSON 文件只在本机处理。
- 清浏览器缓存、换浏览器、卸载应用前，请先导出备份。

## 当前限制

- 移动端可以使用，但拖拽交互还没有专门为触控深度优化。
- 目前只有冲突提示，还不会自动帮你重排。
- AI 创建任务块还是原型能力，没有接入真实在线模型。
- Windows 和 Android 包还没有正式代码签名。

## Star History

<p align="center">
  <a href="https://www.star-history.com/#WanderLandWalker/blockplan&Date">
    <img src="https://api.star-history.com/svg?repos=WanderLandWalker/blockplan&type=Date" alt="Star History Chart">
  </a>
</p>

## 支持一下

如果 BlockPlan 对你有帮助，欢迎给这个项目一个 Star。

<p>
  <a href="https://github.com/WanderLandWalker/blockplan">
    <img src="https://img.shields.io/github/stars/WanderLandWalker/blockplan?style=social" alt="GitHub Stars">
  </a>
</p>
