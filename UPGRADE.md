# UPGRADE

记录已发布版本的主要变化，便于安装、升级与回溯。

## 1.0.0 - 2026-04-19

首个可发布版本。

### 新增

- 新增 `coder-skills` CLI，可执行安装命令：
  - `pnpm coder-skills install`
  - `pnpm exec coder-skills install`
  - `pnpm dlx coder-skills install`
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
