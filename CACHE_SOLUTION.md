# 博客缓存解决方案

## 问题描述

GitHub Pages 博客经常出现浏览器缓存导致访客看不到最新内容的问题。本项目实施了全面的缓存解决方案，确保访客总能看到最新版本的网站内容。

## 实施的解决方案

### 1. 无缓存 Meta 标签

在 `_includes/head.html` 中添加了以下 Meta 标签，强制浏览器检查页面更新：

```html
<!-- 添加无缓存Meta标签，强制浏览器检查页面更新 -->
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

### 2. 静态资源版本号

为所有本地静态资源添加了基于时间戳的版本号查询字符串：

#### CSS 文件
```html
<link rel="stylesheet" href="/assets/css/main.css?v={{ site.time | date: '%Y%m%d%H%M%S' }}">
<link rel="stylesheet" href="/assets/css/ie.css?v={{ site.time | date: '%Y%m%d%H%M%S' }}">
```

#### JavaScript 文件
```html
<script src="{{ site.url }}/assets/js/main.min.js?v={{ site.time | date: '%Y%m%d%H%M%S' }}"></script>
```

#### Favicon 和图标
```html
<link rel="shortcut icon" href="{{ site.url }}/images/fav.ico?v={{ site.time | date: '%Y%m%d%H%M%S' }}">
<link rel="shortcut icon" href="{{ site.url }}/images/fav.png?v={{ site.time | date: '%Y%m%d%H%M%S' }}">
```

#### 头像和社交媒体图标
```html
<img src="{{ site.url }}/images/{{ site.owner.avatar }}?v={{ site.time | date: '%Y%m%d%H%M%S' }}" class="bio-photo">
<img src="https://sowelswl.github.io/images/logo/icons8-wechat.png?v={{ site.time | date: '%Y%m%d%H%M%S' }}">
```

## 工作原理

### 版本号生成
使用 Jekyll 的内置变量 `{{ site.time | date: '%Y%m%d%H%M%S' }}` 生成时间戳，格式为：`20250531142530`

### 缓存破坏机制
当 GitHub Pages 重新构建网站时：
1. `site.time` 更新为当前构建时间
2. 所有静态资源的 URL 都会包含新的时间戳
3. 浏览器将这些视为新的资源，强制重新下载

## 效果

实施这个解决方案后：

- ✅ **页面内容**：每次访问都会检查最新版本
- ✅ **CSS 样式**：样式更新立即生效
- ✅ **JavaScript**：脚本修改立即可见
- ✅ **图片资源**：图标和头像更新立即显示
- ✅ **跨浏览器**：新老浏览器都能看到最新内容

## 注意事项

### 1. 构建时间
版本号基于 Jekyll 构建时间，只有在内容发生变化并重新构建时才会更新版本号。

### 2. CDN 缓存
GitHub Pages 使用 CDN，新版本可能需要几分钟才能全球生效。

### 3. 外部资源
来自 CDN 的外部资源（如 Google Fonts、jQuery 等）不受此解决方案影响，这些资源有自己的缓存策略。

## 开发者调试

在开发过程中，如果需要立即看到更改：

1. **强制刷新**：
   - Windows/Linux: `Ctrl + F5` 或 `Ctrl + Shift + R`
   - macOS: `⌘ + Shift + R`

2. **禁用缓存**：
   - 打开开发者工具 (F12)
   - 在 Network 面板勾选 "Disable cache"

## 文件修改清单

以下文件已被修改以实现缓存解决方案：

- `_includes/head.html` - 添加无缓存 Meta 标签和 CSS/favicon 版本号
- `_includes/scripts.html` - 为 JavaScript 文件添加版本号
- `_includes/author-bio.html` - 为本地图片资源添加版本号

## 维护

此解决方案是自动化的，不需要手动维护版本号。每次你推送更新到 GitHub，Jekyll 会自动生成新的时间戳版本号。

---

**实施日期**: 2025年1月
**技术支持**: 基于 Jekyll 静态站点生成器的缓存破坏方案 