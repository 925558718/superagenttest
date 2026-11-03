# 微光待办

一个用 Vite + React 搭建的单页待办清单应用：写下要做的事，逐条勾选完成，清单会自动保存在当前浏览器里。

## 功能

- 添加任务（回车或点击「添加」，自动去除首尾空格，最多 120 字）
- 勾选完成 / 取消完成，已完成任务显示删除线
- 双击任务文字或使用编辑按钮，可原地修改内容（`Enter` 保存、`Esc` 取消）
- 删除单条任务，或一键「清除已完成」
- 全部 / 进行中 / 已完成 三种筛选，带实时数量统计
- 顶部进度条与「还剩 N 件」提示，空清单有对应的空状态文案
- 浅色 / 深色主题切换，选择会被记住；首次进入跟随系统偏好
- 数据保存在 `localStorage`，刷新或关闭页面后不会丢失
- 键盘可操作、焦点可见、`aria-live` 播报剩余数量，适配移动端与 `prefers-reduced-motion`

## 快速开始

```bash
npm install
npm run dev      # 本地开发，默认 http://localhost:5173
npm run build    # 生产构建，输出到 dist/
npm run preview  # 预览构建结果
npm run lint     # Oxlint 检查
```

## 代码结构

```
index.html                       # 首屏主题初始化，避免深浅色切换闪烁
src/main.jsx                     # React 入口
src/App.jsx                      # 页面结构、任务状态与 localStorage 持久化
src/components/TodoItem.jsx      # 单条任务的展示、勾选与内联编辑
src/index.css                    # 设计变量（含深色主题）与全局样式
src/App.css                      # 页面布局与组件样式
```

任务数据格式：`{ id, text, completed, createdAt }`，读写键名分别为 `weiguang-todos:v1` 与 `weiguang-theme`，解析时会过滤非法数据，损坏数据不会导致页面崩溃。

## 部署

`npm run build` 生成的 `dist/` 是纯静态文件，可直接托管到任意静态站点（Nginx、GitHub Pages、Vercel 等）。
