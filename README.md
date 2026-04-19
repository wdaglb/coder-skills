# @kingeast/coder-skills

把当前项目内的 `AGENTS.md` 与 `skills/*` 软链接安装到 Codex / Claude Code。

## 直接用

### 在当前仓库里执行

```bash
pnpm coder-skills install
```

### 作为项目依赖执行

```bash
pnpm exec coder-skills install
```

先安装依赖时使用包名：

```bash
pnpm add -D @kingeast/coder-skills
```

### 临时执行一次

```bash
pnpm dlx @kingeast/coder-skills install
```

## 常用参数

```bash
--target codex
--target claude
--force
```

示例：

```bash
pnpm dlx @kingeast/coder-skills install --target codex
pnpm exec coder-skills install --force
```

## 会安装到哪里

- Codex
  - `AGENTS.md` -> `~/.codex/AGENTS.md`
  - `skills/<skill-name>` -> `~/.codex/skills/<skill-name>`
- Claude Code
  - `AGENTS.md` -> `~/.claude/AGENT.md`
  - `skills/<skill-name>` -> `~/.claude/skills/<skill-name>`

## 覆盖规则

- 不存在：直接创建软链接
- 已经是当前项目的同一链接：跳过
- 已存在其他文件或链接：
  - 交互终端：询问是否覆盖
  - 非交互终端：不会覆盖；如需覆盖请加 `--force`

## 自定义安装目录

```bash
CODEX_HOME=/custom/codex/home
CLAUDE_HOME=/custom/claude/home
```
