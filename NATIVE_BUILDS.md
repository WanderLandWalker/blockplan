# BlockPlan Windows / Android 构建说明

最后更新：2026-07-06

## 项目结构

```text
blockplan-prototype/
  index.html / styles.css / app.js    共享 Web 核心
  electron/                           Windows 桌面壳
  android/                            Android 原生工程
  scripts/prepare-web-dist.mjs        复制 Web 资源到 dist/web
  capacitor.config.json               Android 打包配置
  package.json                        桌面和安卓构建脚本
```

Windows 和 Android 都复用同一份 Web 核心。修改 `index.html`、`styles.css` 或 `app.js` 后，先执行：

```text
pnpm run prepare:web
```

## Windows 版

开发预览：

```text
pnpm run desktop
```

构建便携版：

```text
pnpm run build:windows
```

当前已生成：

```text
release\windows\BlockPlan 0.2.0.exe
```

如需安装包：

```text
pnpm run build:windows:nsis
```

## Android 版

同步 Web 资源到 Android 工程：

```text
pnpm run android:sync
```

用 Android Studio 打开：

```text
pnpm run android:open
```

命令行构建 debug APK：

```text
pnpm run android:build:debug
```

成功后 APK 路径为：

```text
android\app\build\outputs\apk\debug\app-debug.apk
```

当前已生成并复制到：

```text
release\android\BlockPlan-0.2.0-debug.apk
```

## Android 本机环境要求

当前工程使用：

```text
compileSdkVersion 36
targetSdkVersion 36
Android Gradle Plugin 8.13.0
Gradle 8.14.3
```

开发机可按以下方式配置：

- JDK 21。
- Android SDK。
- Android Command line tools。
- Android SDK Platform 36。
- Android SDK Build-Tools 36.0.0 和 35.0.0。
- Android Platform Tools 37.0.0。

已写入用户级全局环境变量：

```text
JAVA_HOME=C:\Program Files\Microsoft\jdk-21
ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
ANDROID_SDK_ROOT=%LOCALAPPDATA%\Android\Sdk
```

用户级 `Path` 已加入：

```text
%JAVA_HOME%\bin
%ANDROID_HOME%\cmdline-tools\latest\bin
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
```

如果已经打开的终端仍提示找不到 `java`、`javac` 或 `adb`，关闭后重新打开终端即可读取新的全局环境变量。

Android 命令行工具下载来源为官方 Android Developers 页面：

```text
https://developer.android.com/studio
```

## 验证记录

2026-07-06 已执行：

```text
pnpm run check
pnpm run prepare:web
pnpm run android:sync
pnpm run build:windows
pnpm run android:build:debug
```

结果：

- `check` 通过。
- `prepare:web` 通过。
- `android:sync` 通过。
- Windows 便携版已生成。
- Android debug APK 已生成到 `release\android\BlockPlan-0.2.0-debug.apk`。
