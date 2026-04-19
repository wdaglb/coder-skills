# UPGRADE

记录已发布版本的主要变化，便于安装、升级与回溯。

## 1.0.2 - 2026-04-19

补充 `large-file-gate` 技能，并明确 Claude Code 侧软链接行为。

### 新增

- 新增 `large-file-gate` 技能，用于在读取未知大小的文件前先执行 100KB 门禁检查，避免把大日志、大导出文件或生成产物直接读入上下文。
- `large-file-gate` 会随 `install` 一起安装到：
  - Codex：`~/.codex/skills/large-file-gate`
  - Claude Code：`~/.claude/skills/large-file-gate`

### 文档说明

- 明确了 Claude Code 目标文件名为单数 `AGENT.md`，目标路径为 `~/.claude/AGENT.md`。
- 补充了覆盖规则说明：当 `~/.claude/AGENT.md` 已存在且不是当前项目软链接时，安装流程不会静默覆盖，交互模式下会询问确认，非交互模式下需显式传入 `--force`。

### 影响

- 这是一个向后兼容的补充版本；现有 CLI 用法保持不变。
- 新版本安装后，Codex / Claude Code 均可额外获得 `large-file-gate` 技能目录软链接。

## 1.0.1 - 2026-04-19

修正发布配置并切换到 scoped npm 包名。

### 变更

- npm 包名从 `coder-skills` 调整为 `@kingeast/coder-skills`
- CLI 命令名保持不变，仍然使用 `coder-skills`
- `README.md` 中涉及安装包名的命令已同步改为 scoped 包名：
  - `pnpm add -D @kingeast/coder-skills`
  - `pnpm dlx @kingeast/coder-skills install`
- GitHub Actions 发布流程已升级到 Node 24 兼容写法，避免 Node 20 弃用告警影响后续发布

### 影响

- 之后发布到 npm 的目标包名为 `@kingeast/coder-skills`
- `pnpm exec coder-skills install` 与本地仓库内的 `pnpm coder-skills install` 用法不变

## 1.0.0 - 2026-04-19

首个可发布版本。

### 新增

- 新增 npm 包 `@kingeast/coder-skills`，其 CLI 命令为 `coder-skills`，可执行安装命令：
  - `pnpm coder-skills install`
  - `pnpm exec coder-skills install`
  - `pnpm dlx @kingeast/coder-skills install`
- 新增 `install` 子命令，支持将当前项目内的 `AGENTS.md` 与 `skills/*` 以软链接方式安装到：
  - Codex：`~/.codex/AGENTS.md`、`~/.codex/skills/<skill-name>`
  - Claude Code：`~/.claude/AGENT.md`、`~/.claude/skills/<skill-name>`
- 新增常用参数：
  - `--target codex`
  - `--target claude`
  - `--force`

### 行为说明

- 安装时会逐个 skill 建立软链接，不会整体替换目标端整个 `skills` 目录。
- 如果目标已经是当前项目的同一软链接，则会直接跳过，避免重复删除重建。
- 如果目标已存在但不是当前链接：
  - 交互终端会询问是否覆盖
  - 非交互终端不会自动覆盖；如需覆盖需显式传入 `--force`

### 文档与发布

- 新增 `README.md`，提供最小可用命令说明。
- 新增 GitHub Actions 发布流程：
  - 推送 `v*` tag 时自动校验并发布到 npm
  - 支持 `workflow_dispatch` 手动触发发布
- 补齐 npm 发布所需的基础元数据，包括：
  - `description`
  - `files`
  - `keywords`
  - `repository`
  - `homepage`
  - `bugs`
  - `engines`
  - `publishConfig`
