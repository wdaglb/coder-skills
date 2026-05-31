# UPGRADE

记录已发布版本的主要变化，便于安装、升级与回溯。

## 1.0.12 - 2026-05-31

新增实施任务规划技能，并收紧方案落地后的执行确认链路。

### 新增

- 新增 `plan-implementation-tasks` 技能：
  - 将已确认的 `docs/plans` 方案拆分为 `docs/tasks/<方案文件>/tasks-N.md`
  - 每个实施步骤单独生成一个任务文件
  - 同步生成 `implementation-guide.md`，明确串行 / 并行分组、多 agent 执行建议、详细执行流程与边界事件处理

### 变更

- 调整 `ambiguity-planner` 与 `execution-gate`：
  - 方案文件落地后先确认是否拆分实施任务
  - 用户确认拆分时调用 `plan-implementation-tasks`
  - 实施任务规划完毕后，再确认是否按 `implementation-guide.md` 按步骤执行
- 将技能内固定选项格式从 `A / B / C / D` 统一改为 `1 / 2 / 3 / 4`
- 同步更新 `git-action` 的脏工作树确认模板，保持固定选项格式一致

### 影响

- 这是一个向后兼容的补充版本；CLI 用法、安装路径与包结构保持不变。
- 方案落地后的执行链路更严格：写入方案、拆分任务、按实施指导执行分别是独立确认点。
- 后续涉及可并行实施的任务，会优先通过 `implementation-guide.md` 明确多 agent 分工与停手边界。

## 1.0.11 - 2026-05-21

收敛 README 定位、安装覆盖策略与 DOC 协作规范。

### 变更

- 重写 `README.md`，将重点收敛为 skills 的作用、价值与内置能力，弱化安装脚本本身的介绍占比。
- 调整 `install` 默认行为：当目标已存在且不是当前仓库同一软链接时，默认直接覆盖安装，不再区分交互/非交互终端确认。
- 调整 `src/DOC.md` 协作规范：
  - 新增“始终提供完整、健壮、可扩展的解决方案，而非仅满足当前需求的最小实现”
  - 新增“助手回复应该更自然，更像一位同事”
  - 新增“需要用户确认时，禁止使用开放式回答句式；必须优先提供固定选项”
  - 新增“废弃旧方法不应直接删除；可先将整个旧方法注释保留，并注明废弃时间与原因”

### 影响

- 这是一个向后兼容的补充版本；外部安装入口与基本命令保持不变。
- `install` 会更强势地覆盖旧目标；若本地已有手工文件或自建链接需要保留，安装前应先自行备份。
- README 会更强调 skills 本身，而不是把仓库理解成单纯的安装工具。

## 1.0.10 - 2026-05-17

安装命令新增 OpenCode 目标，便于把规则与 skills 一起挂到 OpenCode 本地目录。

### 新增

- `install` 子命令新增 `opencode` 目标：
  - 支持 `--target opencode`
  - `--target all` 现在会同时覆盖 `codex`、`claude`、`opencode`
- 新增环境变量 `OPENCODE_HOME`，默认路径为 `~/.config/opencode`
- OpenCode 安装路径为：
  - `~/.config/opencode/AGENTS.md`
  - `~/.config/opencode/skills/<skill-name>`

### 文档说明

- `README.md` 已同步补充 OpenCode 支持、示例命令与自定义目录说明。
- 同步补充通用 Git 提交规范，明确 commit message 不得追加 AI 助手身份尾巴。
- `README.md` 已同步更新 install 覆盖策略说明：已存在目标默认直接覆盖。

### 影响

- 这是一个向后兼容的补充版本；原有 `codex` / `claude` 安装方式不变。
- 若你此前对 OpenCode 采用手工拷贝或自建链接，改用新版 `install` 时会被默认替换为当前仓库软链接；如需保留旧内容，需先自行备份。
- install 子命令的覆盖行为已改为：只要目标已存在且不是当前仓库同一软链接，就默认直接替换，不再区分交互/非交互终端确认。

## 1.0.9 - 2026-04-26

强化重歧义任务的主动补盲要求，并同步调整执行门禁的交付摘要措辞。

### 变更

- 调整 `execution-gate`：
  - 明确重歧义任务需要主动识别用户未显式提出、但会影响方案稳定性的边界、异常与取舍
  - 要求转交 `ambiguity-planner` 时主动补盲，将范围、权限、数据、兼容、失败、回滚、验证与发布等关键点压成固定选项
  - 将紧凑交付摘要中的 `下一步` 字段改为 `建议`，避免把可选建议误读为必须动作
- 同步更新 `execution-gate` 的 OpenAI agent 默认提示词，确保入口文案与新规则一致

### 影响

- 这是一个向后兼容的发布版本；CLI 用法、安装路径与包结构保持不变
- 技能在重歧义任务中会更主动补齐用户未提及但会影响决策的关键边界

## 1.0.8 - 2026-04-24

收紧规划与交付口径，避免开放式补需求和过长交付摘要。

### 变更

- 调整 `ambiguity-planner`：
  - 明确需求未收清时继续问到可稳定实施
  - 明确简单事项不应被硬拆成多轮收敛
  - 补充输出验收清单与手工前向样例约束
- 调整 `execution-gate`：
  - 明确关键边界未闭合时不得降级放行
  - 明确已足够实施的小问题不得升级成重歧义
  - 新增紧凑版交付摘要格式，默认不单列“改动”区块

### 影响

- 这是一个向后兼容的发布版本；CLI 用法与安装路径保持不变
- 技能输出会更偏向固定选项收敛与短版交付摘要
## 1.0.7 - 2026-04-23

完善协作规范文案，并收敛规划与 Git 技能的执行边界。

### 变更

- 重写 `README.md`，补充仓库定位、适用场景、安装结果、覆盖规则与目录结构说明
- 调整 `src/DOC.md`：
  - 统一改为“AI 助手”表述
  - 移除仓库内多代理派发策略说明
  - 收敛交付示例，避免把过程性进度模板混入最终交付格式
- 重构 `execution-gate`：
  - 从“低 / 中 / 高歧义”收敛为“轻 / 重歧义”两级判定
  - 明确轻歧义任务可直接执行，重歧义任务必须转交 `ambiguity-planner`
  - 强化固定开场、真实状态一致与高风险边界升级规则
- 调整 `ambiguity-planner`：
  - 要求每轮给出当前估计总步数
  - 用户选择前不再单独输出“影响”分节
  - 影响说明改为在边界确认后进入下一步时补充
- 调整 `git-action`：
  - 明确提交消息必须概括实际功能改动
  - 补充空泛 commit message 的禁止规则
- 同步更新相关 `agents/openai.yaml` 提示词，确保技能入口文案与规则一致

### 影响

- 这是一个向后兼容的发布版本；CLI 安装路径与基本使用方式保持不变
- 依赖旧版技能文案行为的协作习惯，需要按新的轻 / 重歧义与分步收敛规则适配

## 1.0.6 - 2026-04-22

重构技能目录布局，并强化规划类技能的分工与收敛规则。

### 变更

- 将仓库内技能源目录迁移到 `src/` 下：
  - `AGENTS.md` / `skills/*` 的源布局调整为 `src/DOC.md` 与 `src/skills/*`
  - CLI 安装逻辑同步改为从 `src/` 读取源文件
- 保持外部安装目标不变：
  - Codex 仍安装到 `~/.codex/AGENTS.md` 与 `~/.codex/skills/*`
  - Claude Code 仍安装到 `~/.claude/AGENT.md` 与 `~/.claude/skills/*`
- 新增 `ambiguity-planner` 技能，用于处理中 / 高歧义任务的分步收敛与逐步规划
- 重构 `execution-gate`，将其职责收敛为统一门禁、低歧义简化规划、中高歧义转交与边界把关
- 明确中 / 高歧义任务的方案文件规则：
  - 仅中 / 高歧义任务询问是否落实到方案文件
  - 用户确认后，自动检查并创建 `docs/plans` 后再写入方案文件
- 强化 `ambiguity-planner` 的推进边界：
  - 允许持续推进
  - 防止无限推进
  - 防止过深推进到实现级细节

### 影响

- 这是一个向后兼容的发布版本；外部安装路径与 CLI 基本用法保持不变
- 若有直接依赖仓库内部源路径的脚本，需要从根目录 `AGENTS.md` / `skills/*` 切换到 `src/DOC.md` / `src/skills/*`

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
- 新增 `install` 子命令，支持将当前项目 `src/` 目录下的 `DOC.md` 与 `skills/*` 以软链接方式安装到：
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
