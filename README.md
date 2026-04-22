# @kingeast/coder-skills

让 Codex / Claude Code 不再“每个项目都重新教一遍”。

`coder-skills` 是一套可长期维护的 AI 协作规则和技能集合。你把它安装到本机后，代理工具就能在不同项目里复用同一套工作方式，而不是每次都靠临时 prompt 约束。

## 它解决什么问题

如果你已经把 AI 用在日常开发里，通常会反复遇到这些问题：

- 新项目一开始，得重新告诉 AI 你的协作习惯、交付标准和风险边界
- 好不容易总结出来的技能和流程，只停留在某个仓库里，没法稳定复用
- 规则更新后，不同项目里还留着旧版本，越用越乱

这个仓库的目标很直接：把这些东西收敛成一套你自己可以持续维护、持续复用的本地能力。

## 你实际会得到什么

安装后，你得到的不是一个一次性脚本，而是一套能长期陪你工作的基础设施：

- **统一的协作规范**
  让 AI 在项目里按一致的方式理解需求、规划、实施、验证和交付。

- **可复用的技能目录**
  把常见开发场景里的规则沉淀成技能，减少重复解释。

- **一份持续生效的本地源**
  后续你只需要维护这一个仓库，更新后本机代理就会直接使用最新内容。

换句话说，它更像是在给 Codex / Claude Code 配一套长期可维护的“工作系统”。

## 适合谁用

它适合下面这类使用方式：

- 你希望给 Codex / Claude Code 配一套稳定的默认协作方式
- 你已经开始沉淀自己的 AI 技能库，不想散落在多个仓库
- 你希望多个项目共享同一套 AI 工作流，而不是每个项目单独复制一份规则

如果你只是偶尔临时写几个 prompt，不准备维护本地规则和技能，这个仓库的价值会小很多。

## 现在这套仓库内置了什么

当前仓库已经内置了一套偏真实项目协作的基础能力，包括：

- `execution-gate`：让 AI 在真正动手前先过执行门禁
- `ambiguity-planner`：需求不清或方案分叉时，先做分步收敛
- `git-action`：统一处理分支、脏工作树和高风险 Git 动作
- `large-file-gate`：避免 AI 无控制地读取大文件，挤爆上下文
- `pencil-design-replica`：按设计稿还原前端时，强制先出 demo 再正式集成

此外，仓库里还带有一份项目协作规范模板，用来约束 AI 的执行边界、验证方式、输出标准和交付方式。

## 它是怎么工作的

底层实现并不复杂：这个仓库会通过一个小 CLI，把规范文件和技能目录以**软链接**方式安装到 Codex / Claude Code 的本地目录里。

这样做有几个现实好处：

- 你只维护这一份源文件
- 内容一更新，本机代理就直接用最新版本
- 不会在不同项目里留下多份彼此漂移的旧副本

默认支持两个目标：

- `codex`
- `claude`

不传 `--target` 时，会同时安装到两者。

## 安装后本机会发生什么

安装完成后，仓库内容会被挂到本地代理目录：

- Codex: `~/.codex/AGENTS.md` 和 `~/.codex/skills/*`
- Claude Code: `~/.claude/AGENT.md` 和 `~/.claude/skills/*`

如果目标位置已经有文件，CLI 会根据当前是否为交互终端，以及你是否传入 `--force`，决定是询问覆盖还是保留现状。

## 直接使用

### 在当前仓库里执行

```bash
pnpm coder-skills install
```

### 作为项目依赖执行

```bash
pnpm add -D @kingeast/coder-skills
pnpm exec coder-skills install
```

### 临时执行一次

```bash
pnpm dlx @kingeast/coder-skills install
```

## 常用参数

```bash
--target codex
--target claude
--target all
--force
```

示例：

```bash
pnpm dlx @kingeast/coder-skills install --target codex
pnpm exec coder-skills install --force
```

## 覆盖规则

- 目标不存在：直接创建软链接
- 目标已经指向当前仓库：跳过
- 目标已存在其他文件或链接：
  - 交互终端：询问是否覆盖
  - 非交互终端：默认不覆盖
  - 显式传入 `--force`：直接替换

## 自定义安装目录

如果你不想安装到默认的用户目录，可以通过环境变量覆盖：

```bash
CODEX_HOME=/custom/codex/home
CLAUDE_HOME=/custom/claude/home
pnpm exec coder-skills install
```

## 仓库结构

```text
bin/
  coder-skills.js        # 安装 CLI
src/
  DOC.md                 # AI 协作规范模板
  skills/                # 可安装的技能目录
README.md
UPGRADE.md
```
