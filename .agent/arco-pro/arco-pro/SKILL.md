---
name: arco-pro
description: |
  Arco Design Pro Vue 3 框架开发规范和最佳实践。当用户在 arco-design-pro-vite 项目中开发时自动应用，或通过 /arco-pro 手动触发。

  触发场景：
  - 工作目录包含 arco-design-pro-vite 或检测到 Arco Design Pro 项目结构
  - 用户提到 "arco pro"、"arco design"、"Arco Design Pro" 框架
  - 创建新页面、API、路由、组件、状态管理模块
  - 用户请求 /arco-pro 命令

  支持功能：
  - 完整的文件命名规范（kebab-case）
  - 路由配置和权限设置
  - API 接口定义和调用模式
  - Vue 3 + TypeScript 组件开发
  - Pinia 状态管理
  - 国际化（i18n）配置
  - 完整页面模板（列表页、表单页、详情页）
---

# Arco Design Pro 开发规范

## 快速参考

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| API 文件 | kebab-case | `user.ts`, `card-types.ts` |
| 路由文件 | kebab-case | `user-management.ts` |
| 页面目录 | kebab-case | `views/users/list/` |
| 组件目录 | kebab-case | `components/search-form/` |
| 类型文件 | kebab-case | `types/user-profile.ts` |
| Store 模块 | kebab-case | `store/modules/user-profile/` |

### 目录结构

```
src/
├── api/           # API 接口（kebab-case 命名）
├── router/routes/modules/  # 路由模块
├── views/[module]/[action]/  # 页面组件
├── store/modules/[module]/   # Pinia store
├── types/         # TypeScript 类型
└── locale/        # 国际化
```

## 开发流程

### 创建新功能模块

1. **定义类型** → `src/types/[module].ts`
2. **创建 API** → `src/api/[module].ts`
3. **配置路由** → `src/router/routes/modules/[module].ts`
4. **创建页面** → `src/views/[module]/[action]/index.vue`
5. **添加国际化** → `src/views/[module]/locale/zh-CN.ts`

### API 响应格式

```typescript
interface HttpResponse<T> {
  status: number;      // HTTP 状态码
  code: number;        // 业务码：20000 成功
  msg: string;         // 消息
  data: T;             // 数据
}

// 分页响应
interface PageResponse<T> {
  list: T[];
  total: number;
}
```

### 路由 Meta 必需字段

```typescript
meta: {
  locale: 'menu.module.action',  // 必需：国际化 key
  requiresAuth: true,            // 必需：是否需要登录
  icon: 'icon-name',             // 菜单图标
  order: 1,                      // 菜单排序
  roles: ['admin'],              // 角色限制（可选）
  permissions: ['user:read'],    // 权限标识（可选）
}
```

### 分页参数约定

- **请求**：`page`, `pageSize`
- **表格**：`current`（Arco Table 使用）
- **响应**：`{ list, total }`

## 页面模板

完整模板文件位于 `assets/templates/`：

- **list-page.vue** - 列表页（搜索 + 表格 + 分页）
- **form-page.vue** - 表单页（新增/编辑）
- **detail-page.vue** - 详情页

## 详细规范

- **命名和配置规范**：见 [references/conventions.md](references/conventions.md)
- **组件开发规范**：见 [references/components.md](references/components.md)
- **国际化规范**：见 [references/i18n.md](references/i18n.md)
