# @kingeast/coder-skills

## 当前这套仓库内置的 skills

这套仓库目前内置的重点，不是泛泛的“提示词集合”，而是偏真实研发协作中的高频工作法：

- `execution-gate`
  在真正动手前先过执行门禁，判断是轻任务可直做，还是重任务必须先收敛。

- `audit-completion-risks`
  在代码任务完成后做收尾风险审查，只列风险、按严重程度排序，并给出文件位置。

- `ambiguity-planner`
  处理边界不清、方案分叉、风险不稳的任务，把规划拆成一步一步可确认的固定选项。

- `plan-implementation-tasks`
  在方案文件已经落地后，把实施过程拆成 `docs/tasks/<方案文件>/tasks-N.md` 任务文件，并生成实施指导文件标明串行 / 并行分组。

- `git-action`
  统一处理任务分支、脏工作树、提交消息、高风险 Git 动作的边界与规范。

- `large-file-gate`
  读取未知大小的文件前先做门禁，避免把大日志、大导出、大生成物直接塞进上下文。

- `pencil-design-replica`
  按设计稿还原前端时，强制先出 demo，再落正式代码，避免一开始就把现有页面推倒重做。

除了这些 skills，仓库里还提供一份通用协作规范模板，用来约束 AI 的实现原则、验证要求和交付方式。

## 适合什么样的使用方式

这个仓库适合下面这类人：

- 希望长期维护自己的 AI skills，而不是只收集零散 prompt
- 希望多个项目共享同一套协作规则与专项工作法
- 希望把“反复纠偏 AI”的成本，逐步转成可复用的默认能力

如果你只是偶尔临时写几句 prompt，不准备长期维护 skills，这个仓库的价值会小很多。

## skills 是怎么生效的

仓库通过一个很薄的 CLI，把 `src/DOC.md` 和 `src/skills/*` 以软链接方式挂到本地代理目录。

这意味着：

- 你维护的是同一份 skill 源
- skills 更新后，本机代理会直接使用新版本
- 不需要在不同项目之间手工同步多份副本

当前支持的目标：

- `codex`
- `claude`
- `opencode`

## 最小安装方式

```bash
pnpm coder-skills install
```

或者：

```bash
pnpm exec coder-skills install
pnpm dlx @kingeast/coder-skills install
```

安装后会把 skills 挂到对应本地目录：

- Codex: `~/.codex/skills/*`
- Claude Code: `~/.claude/skills/*`
- OpenCode: `~/.config/opencode/skills/*`

对应的规范文件也会一并安装：

- Codex: `~/.codex/AGENTS.md`
- Claude Code: `~/.claude/AGENT.md`
- OpenCode: `~/.config/opencode/AGENTS.md`

## 安装行为

- 目标不存在：直接创建软链接
- 目标已经指向当前仓库：跳过
- 目标已存在其他文件或链接：默认直接替换为当前仓库的软链接

可选参数：

```bash
--target codex
--target claude
--target opencode
--target all
```

如需自定义安装目录，可通过环境变量覆盖：

```bash
CODEX_HOME=/custom/codex/home
CLAUDE_HOME=/custom/claude/home
OPENCODE_HOME=/custom/opencode/home
pnpm exec coder-skills install
```

## 仓库结构

```text
bin/
  coder-skills.js
src/
  DOC.md
  skills/
README.md
UPGRADE.md
```
