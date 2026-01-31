# Cursor 安装和使用指南

## 什么是 Cursor？

Cursor 是一个基于 VS Code 的 AI 代码编辑器，是**最接近 Claude Code 体验**的工具。

**主要功能：**
- ✅ AI 对话编程（类似 Claude Code）
- ✅ 直接编辑代码文件
- ✅ 理解整个代码库
- ✅ 代码补全和生成
- ✅ 支持多种 AI 模型（GPT-4, Claude, 自定义 API）

## 下载和安装

### 方法一：官网下载（推荐）

1. **访问官网下载页面：**
   - 国际版：https://cursor.com/downloads
   - 中文版：https://cursor.com/cn/download

2. **选择 Windows 版本：**
   - Windows (x64) - 适用于大多数电脑
   - Windows (ARM64) - 适用于 ARM 架构

3. **下载并安装：**
   - 下载完成后双击 `.exe` 文件
   - 按照安装向导完成安装

### 方法二：直接下载链接

如果官网访问慢，可以使用直接下载链接：

```
https://downloader.cursor.sh/windows/nsis/x64
```

复制到浏览器地址栏即可下载。

## 首次使用配置

### 1. 启动 Cursor

安装完成后，启动 Cursor。

### 2. 登录账号

- 可以使用 Google、GitHub 账号登录
- 或者创建新账号

### 3. 免费额度

Cursor 提供免费使用额度：
- **免费版：** 每月 2000 次补全，50 次慢速 AI 请求
- **Pro 版：** $20/月，无限补全，500 次快速 AI 请求

### 4. 配置 AI 模型

Cursor 支持多种 AI 模型：

**使用内置模型（推荐新手）：**
- GPT-4（默认）
- Claude 3.5 Sonnet
- GPT-3.5

**使用自定义 API（省钱）：**
1. 点击右上角设置图标
2. 选择 "Models"
3. 添加自己的 API Key：
   - OpenAI API
   - Anthropic API（Claude）
   - **DeepSeek API**（推荐，便宜且国内可用）

## 基本使用

### 1. AI 对话（Ctrl+L）

按 `Ctrl+L` 打开 AI 对话面板：
- 可以问问题
- 可以让 AI 编写代码
- 可以让 AI 解释代码

### 2. AI 编辑（Ctrl+K）

选中代码后按 `Ctrl+K`：
- 直接让 AI 修改选中的代码
- 例如："重构这个函数"、"添加错误处理"

### 3. 代码补全

输入代码时会自动提示 AI 补全：
- 按 `Tab` 接受补全
- 按 `Esc` 拒绝补全

### 4. 理解代码库

Cursor 会自动索引你的代码库：
- AI 可以理解整个项目结构
- 可以跨文件回答问题

## 使用 DeepSeek API（推荐）

DeepSeek 是国内的 AI 服务，价格便宜且效果好。

### 1. 获取 DeepSeek API Key

访问：https://platform.deepseek.com/
- 注册账号
- 获取 API Key

### 2. 在 Cursor 中配置

1. 打开设置（右上角齿轮图标）
2. 选择 "Models"
3. 点击 "Add Model"
4. 选择 "OpenAI Compatible"
5. 填写：
   - API Key: 你的 DeepSeek API Key
   - Base URL: `https://api.deepseek.com/v1`
   - Model: `deepseek-chat`

### 3. 价格对比

| 服务 | 价格（每百万 tokens） | 效果 |
|------|---------------------|------|
| GPT-4 | $30-60 | 最好 |
| Claude 3.5 | $15-75 | 很好 |
| DeepSeek | $0.14-0.28 | 接近 GPT-4 |

DeepSeek 比 GPT-4 便宜 **100-200 倍**！

## 常用快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl+L | 打开 AI 对话 |
| Ctrl+K | AI 编辑选中代码 |
| Ctrl+I | 内联 AI 补全 |
| Ctrl+Shift+P | 命令面板 |
| Ctrl+` | 打开终端 |

## 与 Claude Code 的对比

| 特性 | Claude Code | Cursor |
|------|-------------|--------|
| AI 对话 | ✅ | ✅ |
| 编辑文件 | ✅ | ✅ |
| 理解代码库 | ✅ | ✅ |
| 执行命令 | ✅ | ✅（终端） |
| 图形界面 | ❌ | ✅ |
| 代码补全 | ❌ | ✅ |
| 免费使用 | ❌（需付费） | ✅（有限额度） |
| 多模型支持 | ❌ | ✅ |

## 推荐使用场景

**使用 Cursor：**
- 日常编码和开发
- 需要代码补全
- 喜欢图形界面
- 想要更便宜的方案（配合 DeepSeek）

**使用 Claude Code：**
- 需要最强的 AI 能力
- 复杂的代码重构
- 喜欢命令行界面

## 常见问题

### Q: Cursor 是免费的吗？

A: 有免费版本，但有使用限制。Pro 版 $20/月。也可以配置自己的 API Key 来降低成本。

### Q: 可以同时使用 Cursor 和 Claude Code 吗？

A: 可以！它们互不冲突，可以根据需要选择使用。

### Q: 如何降低使用成本？

A: 配置 DeepSeek API，价格比 GPT-4 便宜 100 倍以上。

### Q: 支持中文吗？

A: 完全支持中文对话和编程。

## 开始使用

1. 下载安装 Cursor
2. 注册账号并登录
3. 打开你的项目文件夹
4. 按 `Ctrl+L` 开始与 AI 对话
5. 尝试让 AI 帮你写代码或解释代码

祝你使用愉快！
