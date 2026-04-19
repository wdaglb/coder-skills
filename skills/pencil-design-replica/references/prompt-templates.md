# Pencil 设计复现提示词模板

## 1. 直接复现

```text
读取当前 Pencil 画布 <design.pen> 的设计参数，用 <当前项目技术栈> 生成代码，要求像素级还原。
```

## 2. 先做 demo 再确认

```text
读取当前 Pencil 画布 <design.pen>，先不要直接改正式页面。请先用 Agent Browser
技能做一个高保真 demo 范例给我确认；确认后，再按 <当前项目技术栈> 落到实际代
码中，要求尽量像素级还原。
```

## 3. 当前会话没有 Agent Browser 时的回退写法

```text
读取当前 Pencil 画布 <design.pen>，优先用 Agent Browser 技能做 demo；如果当前
没有该技能，则回退到 $playwright，先产出可预览的确认 demo，再落到
<当前项目技术栈> 的实际代码中，要求尽量像素级还原。
```

## 4. 针对单组件复现

```text
读取当前 Pencil 画布里选中的组件，先做一个可单独预览的 demo，确认视觉无误后，
再把它实现成 <当前项目技术栈> 中可复用的正式组件。
```

## 5. 针对整页复现

```text
读取当前 Pencil 画布的整页布局，先做路由隔离的静态 demo 让我确认，再按
<当前项目技术栈> 正式接入页面结构、组件与样式，要求尽量像素级还原。
```

## 使用说明

- 将 `<design.pen>` 替换为实际文件名或当前活动画布标识
- 将 `<当前项目技术栈>` 替换为真实技术栈，例如 React + Ant Design、
  Vue 3 + Element Plus、Spring Boot + Thymeleaf 等
- 如果用户没有说明是否要业务接线，默认先做静态高保真 demo
