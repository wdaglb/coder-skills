---
name: pencil-design-replica
description: 将 Pencil 画布、.pen 文件、Pencil 导出的设计图或画布截图复现为可实现的前端代码，并强制遵循"先做 demo 确认、后落实际代码"的两阶段工作流。支持全新页面创建与现有页面改造。Use when the user asks to 根据设计稿做页面、照着画布还原前端、按 .pen / Pencil 设计转 React/Vue/HTML/CSS、复刻 UI、像素级还原、把设计图转代码、页面改版、组件改版、按新设计稿重做现有页面、保留原有业务逻辑只替换界面、先出 demo 再正式集成。Prefer this skill over generic frontend design when there is a concrete Pencil canvas, .pen file, design screenshot, or an existing page that must visually match a provided design. Do not use for purely creative frontend design from scratch without a concrete design source.
---

# Pencil Design Replica

## 概述

从 Pencil 设计稿到生产代码的**两阶段工作流**：
1. **Demo 阶段**：产出独立 HTML 预览，用户确认视觉还原度
2. **落地阶段**：确认通过后，按项目技术栈正式集成

**核心原则**：先让用户看到、点到、确认到，再写业务代码。避免返工。

**支持场景**：
- **场景 A**：全新页面/组件创建（无现有代码）
- **场景 B**：现有页面/组件改造（已有业务逻辑、接口、状态）

---

## 场景识别（首先执行）

在开始工作流前，必须先判断当前属于哪种场景：

### 场景 A：全新创建
**识别信号**：
- 用户说"新建页面"、"创建组件"、"从零开始"
- 目标路径不存在对应文件
- 用户未提及现有业务逻辑

**处理策略**：直接进入标准两阶段工作流。

### 场景 B：现有改造
**识别信号**：
- 用户说"改版"、"重新设计"、"按新设计稿调整"、"替换样式"
- 目标文件已存在且包含业务代码
- 用户提到"保留原有功能"、"接口不变"、"逻辑不动"

**处理策略**：进入**改造场景专项工作流**（见下方）。

---

## 强制执行规则（必须遵守）

### 🚫 严禁行为（Demo 确认前）

- 严禁直接修改 `src/`、`app/`、`components/` 等业务目录下的任何文件
- 严禁安装新依赖或修改 `package.json`
- **【改造场景特别约束】严禁删除或注释现有业务逻辑代码（接口调用、状态管理、事件处理等）**
- 严禁在没有预览确认的情况下声称"已完成"

### ✅ 必须行为

- 必须先生成一个**独立、自包含、可双击打开的 HTML 文件**
- 必须**自动触发浏览器打开该文件**（不能只生成不打开）
- 必须在获得用户明确确认（"确认"/"可以"/"通过"/"没问题"等）后，才能进入落地阶段
- **【改造场景特别要求】必须先读取并理解现有代码的业务逻辑，再进行 Demo 构建**

---

## 工作流详解

### 阶段零：场景判断与信息收集

#### 0.1 判断场景类型
根据用户描述和项目文件状态，判定场景 A 或场景 B。

#### 0.2 场景 A：收集创建信息
询问或推断：
- 目标画布 / 页面 / 组件名称
- 目标项目的技术栈（React/Vue/HTML + Tailwind/CSS Modules/等）
- 是否需要交互状态（hover、active、展开/收起等）

#### 0.3 场景 B：收集改造信息（关键）
**必须执行以下信息收集：**

1. **定位目标文件**
   - 询问或搜索："当前这个设计稿对应项目中的哪个页面/组件？"
   - 如用户未明确，主动列出可能匹配的文件供用户选择

2. **读取现有代码并分析**
   ```
   必须读取并理解以下内容：
   - 组件结构（JSX/Vue template 层级）
   - 数据来源（props、state、store、API 响应字段）
   - 事件处理（onClick、onSubmit 等）
   - 条件渲染逻辑（v-if、条件表达式等）
   - 循环渲染的数据字段（v-for、map 的 item 字段）
   ```

3. **标记保留项**
   向用户确认：
   ```
   📌 检测到以下业务逻辑将在改造中保留：
      - 接口调用：POST /api/xxx（字段：id, name, status）
      - 状态管理：useXxxStore / data.xxx
      - 交互事件：handleSubmit, handleDelete
      - 条件分支：status === 'active' 时的展示
   
   确认这些都需要保留吗？有需要调整的吗？
   ```

4. **识别改造范围**
   - 纯视觉改版（只改 CSS/布局结构）
   - 结构调整（DOM 层级变化，但数据和逻辑不变）
   - 组件拆分/合并
   - 新增/删除某些元素

---

### 阶段一：读取与分析

#### 1.1 读取 Pencil 设计数据

**必须执行以下读取序列（不要跳过）：**

1. `get_editor_state(include_schema=true)` —— 获取当前上下文
2. 若指定 `.pen` 文件未打开 → `open_document`
3. `batch_get` 获取目标节点及子树 —— 理解层级结构
4. `get_variables` —— 提取设计 token（颜色/字体/间距）
5. `get_screenshot` —— 保存视觉基准，用于后续比对
6. 如布局复杂 → `snapshot_layout` —— 获取精确的盒模型数据

**读取检查清单：**
- [ ] 容器布局方向（flex/grid/absolute）
- [ ] 主间距系统（gap/padding/margin）
- [ ] 字体栈（family/size/weight/line-height）
- [ ] 颜色调色板（主色/背景/边框/文字层级）
- [ ] 组件实例与 overrides
- [ ] 响应式断点（如有）

#### 1.2 【改造场景】新旧结构对比分析

**必须执行结构映射分析：**

| 设计稿元素 | 现有代码位置 | 数据来源 | 保留/新增/删除 |
|-----------|-------------|---------|--------------|
| 用户头像 | `<Avatar src={user.avatar} />` | `user.avatar` | 保留，样式更新 |
| 标题区域 | `<h1>{title}</h1>` | `props.title` | 保留，样式更新 |
| 新增的侧边栏 | 无 | 新接口/新状态？ | 新增，需确认数据来源 |
| 旧的分页器 | `<Pagination />` | `page, setPage` | 保留，位置调整 |

**向用户确认映射关系后再进入 Demo 构建。**

---

### 阶段二：Demo 构建与预览（关键阶段）

#### 2.1 创建独立 Demo 文件

- 文件命名：`pencil-preview-[画布名]-[时间戳].html`
- 存放位置：项目根目录或 `.pencil-preview/` 临时目录
- 样式方案：内联 `<style>` 标签（确保自包含，不依赖外部构建工具）

#### 2.2 Demo 代码要求

**【场景 A：全新创建】**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pencil 设计稿预览 - 新建</title>
  <style>
    /* CSS Reset */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: [从设计稿获取];
      background: [从设计稿获取];
    }
    /* 所有样式严格遵循读取到的设计 token，禁止猜测 */
  </style>
</head>
<body>
  <!-- 静态结构，模拟数据写死 -->
  <!-- 示例：<div class="card">示例标题</div> -->
</body>
</html>
```

**【场景 B：现有改造】**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pencil 设计稿预览 - 改版对比</title>
  <style>
    /* CSS Reset */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: [从设计稿获取];
      background: [从设计稿获取];
      padding: 20px;
    }

    /* 对比布局：左旧右新 或 上下对比 */
    .comparison {
      display: flex;
      gap: 40px;
    }

    .old-version {
      flex: 1;
      border-right: 2px dashed #ccc;
      padding-right: 40px;
    }

    .new-version {
      flex: 1;
    }

    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 14px;
      margin-bottom: 16px;
    }

    .badge.old {
      background: #f0f0f0;
      color: #666;
    }

    .badge.new {
      background: #e6f7e6;
      color: #2e7d32;
    }

    /* 业务数据模拟 */
    .mock-data-note {
      background: #fff3cd;
      border: 1px solid #ffecb5;
      border-radius: 8px;
      padding: 16px;
      margin: 20px 0;
      font-size: 14px;
    }

    .mock-data-note code {
      background: #f8f9fa;
      padding: 2px 6px;
      border-radius: 4px;
    }

    /* 新设计稿样式（严格按设计 token） */
    /* ... */
  </style>
</head>
<body>
  <!-- 改造说明区 -->
  <div class="mock-data-note">
    <strong>📦 业务逻辑保留说明</strong><br>
    以下数据字段和交互逻辑将在正式代码中保留：<br>
    • 接口响应字段：<code>{{ mockData.user.name }}</code>、<code>{{ mockData.stats }}</code><br>
    • 事件处理：<code>handleSubmit()</code>、<code>handleDelete(id)</code><br>
    • 条件渲染：<code>status === 'active'</code> 时的展示<br>
    <em>👇 下方为视觉 Demo，使用模拟数据展示</em>
  </div>

  <!-- 对比视图（推荐） -->
  <div class="comparison">
    <!-- 旧版（现有代码的简化渲染） -->
    <div class="old-version">
      <span class="badge old">📋 当前版本</span>
      <!-- 将现有组件结构简化后放这里，帮助用户理解变化 -->
      <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
        <!-- 旧版结构 -->
      </div>
    </div>

    <!-- 新版（设计稿还原） -->
    <div class="new-version">
      <span class="badge new">✨ 新设计稿版本</span>
      <!-- 严格按照新设计稿的结构和样式 -->
      <div class="new-design">
        <!-- 新版结构，使用模拟数据填充 -->
      </div>
    </div>
  </div>

  <!-- 或使用单一新版视图（如果用户不需要对比） -->
  <!-- 
  <div class="new-design-only">
    <span class="badge new">✨ 新设计稿预览</span>
    新版结构...
  </div>
  -->
</body>
</html>
```

#### 2.3 🖥️ 强制自动预览（核心要求）

**生成 HTML 文件后，必须立即执行以下动作之一来打开浏览器：**

| 环境 | 命令 |
|------|------|
| macOS | `open [文件绝对路径]` |
| Windows | `start [文件绝对路径]` |
| Linux | `xdg-open [文件绝对路径]` |
| Codex 内置能力 | 调用 `preview_url` 并传入 `file://[文件绝对路径]` |
| 备选方案 | 启动本地静态服务器（`npx serve .` 或 `python -m http.server 8080`）并打开 `http://localhost:8080/[文件名]` |

**验证**：执行命令后，确认浏览器窗口已弹出并正确渲染。若未自动弹出，告知用户文件路径并请用户手动打开。

#### 2.4 截图存档（推荐）

调用 `get_screenshot` 或 Playwright 截取 Demo 渲染效果：
- **场景 A**：与设计稿截图并排对比
- **场景 B**：新旧版本并排对比 + 与设计稿对比

#### 2.5 请求用户确认

**场景 A 确认模板：**
```
📋 Demo 已生成并打开
   - 文件位置：[文件绝对路径]
   - 预览方式：已在浏览器中打开

✅ 请确认视觉还原是否符合预期：
   - 布局结构
   - 颜色/字体
   - 间距留白

回复"确认"继续落实际代码，或指出需要调整的地方。
```

**场景 B 确认模板：**
```
📋 改版 Demo 已生成并打开
   - 文件位置：[文件绝对路径]
   - 预览方式：已在浏览器中打开（展示新旧对比）

📦 将保留的业务逻辑：
   - 接口：[列举]
   - 状态：[列举]
   - 事件：[列举]
   - 数据字段：[列举]

✅ 请确认：
   1. 新设计稿的视觉效果是否满意？
   2. 上述业务逻辑保留范围是否正确？
   3. 新旧版本对比的改动方向是否符合预期？

回复"确认"继续落实际代码改造，或指出需要调整的地方。
```

**⚠️ 必须等待用户明确确认后才能进入阶段三。禁止跳过。**

---

### 阶段三：正式代码落地（仅在用户确认后执行）

#### 3.1 分析目标项目结构

- 识别组件目录（`src/components/`、`app/components/` 等）
- 识别样式方案（Tailwind、CSS Modules、Styled Components 等）
- 识别设计 token 映射（`--color-primary`、`$spacing-md` 等）

#### 3.2 转换策略

| Demo 代码中的写法 | 项目中的落地方式 |
|------------------|----------------|
| 硬编码颜色值 | 映射为项目 CSS 变量 / Tailwind 类 |
| 内联 style | 提取为 className 或模块化样式 |
| 单一 HTML 结构 | 拆分为可复用组件 |
| 静态模拟数据 | 替换为真实数据绑定 |

#### 3.3 场景 A：全新创建实施

- **最小改动**：只新增必要的组件，不重构现有代码
- **复用优先**：优先使用项目已有的 Button、Card、Container 等基础组件
- **渐进增强**：先保证静态还原，再根据需求添加交互逻辑

#### 3.4 场景 B：现有改造实施（关键）

**改造原则：**

1. **业务逻辑零破坏**
   - 保持所有 `useState`、`store`、`API 调用` 不变
   - 保持所有事件处理函数签名和调用不变
   - 保持所有条件判断逻辑不变
   - 只调整 JSX/Vue template 的结构和 className

2. **数据绑定字段保留**
   ```jsx
   // 改造前
   <div className="old-card">
     <span className="old-title">{data.title}</span>
     <span className="old-value">{data.value}</span>
   </div>

   // 改造后（只改结构和样式，数据绑定不变）
   <div className="new-card">
     <div className="new-card-header">
       <span className="new-title">{data.title}</span>
     </div>
     <div className="new-card-body">
       <span className="new-value">{data.value}</span>
     </div>
   </div>
   ```

3. **样式迁移策略**
   - 如果是 CSS Modules：更新 `.module.css` 文件中的类定义
   - 如果是 Tailwind：替换 className 为新的工具类组合
   - 如果是 Styled Components：更新 styled 组件定义

4. **结构变化适配**
   - 新增元素：如果设计稿新增了元素但无对应数据，向用户确认数据来源
   - 删除元素：确认该元素在业务上确实可以移除
   - 重排层级：保持数据绑定路径不变，只调整 DOM 嵌套关系

5. **改造检查清单**
   ```
   改动前备份检查：
   □ 已理解原有数据流
   □ 已记录所有 props 和 state 字段
   □ 已记录所有事件处理函数

   改动时检查：
   □ 所有 {data.field} 绑定保持不变
   □ 所有 onClick/onSubmit 等事件绑定保持不变
   □ 所有条件渲染 (&& / ? :) 保持不变
   □ 所有循环渲染的 key 和数据源保持不变

   改动后验证：
   □ 页面无控制台报错
   □ 所有交互功能正常
   □ API 调用正常触发
   ```

#### 3.5 验证与交付

落地完成后需完成以下验证：
- [ ] 运行项目，截图与设计稿比对
- [ ] 验证正常展示状态
- [ ] 验证边界情况（空内容、长文本折行等）
- [ ] 【场景 B】验证原有业务功能无回归（点击、提交、切换等）
- [ ] 输出交付说明

**交付说明模板：**

**场景 A 模板：**
```
✅ 设计稿落地完成

📁 新增文件：
   - src/components/XXX.tsx
   - src/styles/XXX.module.css

🎯 设计还原说明：
   - 已验证项目：[列举]
   - 已知差异：[列举]

🚀 查看方式：
   运行 [启动命令] 后访问 [页面路由]
```

**场景 B 模板：**
```
✅ 页面改版完成

📁 修改文件：
   - src/pages/XXX.tsx（样式和结构调整）
   - src/pages/XXX.module.css（样式更新）

📦 业务逻辑保留确认：
   - ✅ 接口调用：POST /api/xxx（字段未变）
   - ✅ 状态管理：useXxxStore（未变）
   - ✅ 事件处理：handleSubmit、handleDelete（签名未变）
   - ✅ 数据字段：id, name, status（绑定路径未变）

🎨 视觉改动：
   - 布局从横向改为纵向
   - 卡片圆角从 8px 改为 12px
   - 主色调从 #1890ff 改为设计稿指定的 #2e7d32

🔍 已知差异/待确认：
   - 设计稿中的"推荐位"模块需要新接口数据，待后端提供后补充

🚀 验证方式：
   1. 运行 npm run dev
   2. 访问 http://localhost:3000/xxx
   3. 测试原有功能：点击提交按钮 → 确认接口调用正常
```

---

## 故障处理指南

| 问题现象 | 排查与解决 |
|---------|-----------|
| `get_variables` 返回空 | 检查设计稿是否定义了变量；若无，从节点 computed styles 中提取 |
| 自动打开浏览器失败 | 1. 打印文件绝对路径让用户手动打开 2. 尝试备选命令 |
| 预览效果与设计稿差异大 | 重新调用 `snapshot_layout` 核对盒模型 |
| 用户说"可以"但未明确确认 | 追问："您确认可以按此视觉效果落实际代码了吗？" |
| 【场景 B】改造后业务功能异常 | 对比改动前后的 JSX 结构，检查是否有条件渲染或数据绑定被意外删除 |
| 【场景 B】新旧结构无法一一映射 | 列出无法映射的元素，向用户确认：新增/删除/数据来源？ |

---

## 快速参考：理想执行轨迹

### 场景 A：全新创建
```
用户: "帮我把这个 pencil 设计稿转成 React 页面"
    ↓
Agent: "正在读取设计稿数据..."
    [执行读取序列]
    ↓
Agent: "已生成预览 Demo，正在打开浏览器..."
    [写入 demo.html + 执行 open 命令]
    ↓
Agent: "📋 Demo 已打开，请确认视觉还原。确认后我将落成 React 组件。"
    ↓
用户: "确认"
    ↓
Agent: "正在转换到项目 React 代码..."
    [在 src/components 下创建组件]
    ↓
Agent: "✅ 已完成。文件：src/components/NewPage.tsx"
```

### 场景 B：现有改造
```
用户: "这个页面按新设计稿改一下，原来的功能不要动"
    ↓
Agent: "正在定位目标文件和读取现有业务逻辑..."
    [搜索/询问定位文件，读取代码]
    ↓
Agent: "📦 检测到以下业务逻辑将保留：
         - 接口：/api/user/info
         - 状态：userInfo, isLoading
         - 事件：handleSave, handleCancel
         确认这些都需要保留吗？"
    ↓
用户: "对，都保留"
    ↓
Agent: "正在读取设计稿并生成对比 Demo..."
    [执行读取序列 + 生成新旧对比 demo.html]
    ↓
Agent: "📋 改版对比 Demo 已打开。
         左侧是当前版本，右侧是新设计稿版本。
         请确认视觉效果和改动方向。"
    ↓
用户: "右侧的效果可以，就这样改吧"
    ↓
Agent: "正在改造目标文件，保留原有业务逻辑..."
    [更新 JSX 结构和样式，保持数据绑定不变]
    ↓
Agent: "✅ 改版完成。文件：src/pages/Profile.tsx。
         原有功能已验证正常，请运行项目确认。"
```
