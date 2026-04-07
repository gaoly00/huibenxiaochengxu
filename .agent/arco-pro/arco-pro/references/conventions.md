# 命名和配置规范

## API 接口规范

### 文件结构

```typescript
// src/api/user-profile.ts
import axios from 'axios';

// 类型定义
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface UserProfileQuery {
  page: number;
  pageSize: number;
  username?: string;
}

export interface UserProfileResponse {
  list: UserProfile[];
  total: number;
}

// API 函数
export function getUserProfiles(params: UserProfileQuery) {
  return axios.get<UserProfileResponse>('/user-profiles', { params });
}

export function getUserProfile(id: number) {
  return axios.get<UserProfile>(`/user-profiles/${id}`);
}

export function createUserProfile(data: Partial<UserProfile>) {
  return axios.post<UserProfile>('/user-profiles', data);
}

export function updateUserProfile(id: number, data: Partial<UserProfile>) {
  return axios.put<UserProfile>(`/user-profiles/${id}`, data);
}

export function deleteUserProfile(id: number) {
  return axios.delete(`/user-profiles/${id}`);
}
```

### CRUD 函数命名

| 操作 | 函数名 |
|------|--------|
| 列表查询 | `get[Module]s(params)` |
| 单条查询 | `get[Module](id)` |
| 创建 | `create[Module](data)` |
| 更新 | `update[Module](id, data)` |
| 删除 | `delete[Module](id)` |
| 批量操作 | `batch[Action][Module]s(ids)` |

## 路由配置规范

### 完整路由模块

```typescript
// src/router/routes/modules/user-profile.ts
import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USER_PROFILE: AppRouteRecordRaw = {
  path: '/user-profile',
  name: 'userProfile',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.userProfile',
    requiresAuth: true,
    icon: 'icon-user',
    order: 2,
    permissions: ['user-profile:read'],
  },
  children: [
    {
      path: 'list',
      name: 'UserProfileList',
      component: () => import('@/views/user-profile/list/index.vue'),
      meta: {
        locale: 'menu.userProfile.list',
        requiresAuth: true,
        permissions: ['user-profile:read'],
      },
    },
    {
      path: 'create',
      name: 'UserProfileCreate',
      component: () => import('@/views/user-profile/form/index.vue'),
      meta: {
        locale: 'menu.userProfile.create',
        requiresAuth: true,
        permissions: ['user-profile:create'],
        hideInMenu: true,
      },
    },
    {
      path: 'edit/:id',
      name: 'UserProfileEdit',
      component: () => import('@/views/user-profile/form/index.vue'),
      meta: {
        locale: 'menu.userProfile.edit',
        requiresAuth: true,
        permissions: ['user-profile:update'],
        hideInMenu: true,
      },
    },
    {
      path: 'detail/:id',
      name: 'UserProfileDetail',
      component: () => import('@/views/user-profile/detail/index.vue'),
      meta: {
        locale: 'menu.userProfile.detail',
        requiresAuth: true,
        permissions: ['user-profile:read'],
        hideInMenu: true,
      },
    },
  ],
};

export default USER_PROFILE;
```

### Meta 字段说明

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `locale` | `string` | ✅ | 国际化 key，格式：`menu.module[.action]` |
| `requiresAuth` | `boolean` | ✅ | 是否需要登录 |
| `icon` | `string` | ❌ | 菜单图标，仅父级需要 |
| `order` | `number` | ❌ | 菜单排序，数字越小越靠前 |
| `roles` | `string[]` | ❌ | 角色限制，如 `['admin', 'developer']` |
| `permissions` | `string[]` | ❌ | 权限标识，如 `['user:read']` |
| `hideInMenu` | `boolean` | ❌ | 是否在菜单中隐藏 |

## Pinia Store 规范

### Store 文件结构

```
store/modules/user-profile/
├── index.ts    # store 定义
└── types.ts    # 类型定义
```

### Store 定义

```typescript
// store/modules/user-profile/types.ts
export interface UserProfileState {
  currentProfile: UserProfile | null;
  profiles: UserProfile[];
  total: number;
}

// store/modules/user-profile/index.ts
import { defineStore } from 'pinia';
import type { UserProfileState } from './types';
import { getUserProfiles, getUserProfile } from '@/api/user-profile';

const useUserProfileStore = defineStore('user-profile', {
  state: (): UserProfileState => ({
    currentProfile: null,
    profiles: [],
    total: 0,
  }),

  getters: {
    profileCount(state): number {
      return state.profiles.length;
    },
  },

  actions: {
    setCurrentProfile(profile: UserProfile | null) {
      this.currentProfile = profile;
    },

    async fetchProfiles(params: UserProfileQuery) {
      const res = await getUserProfiles(params);
      this.profiles = res.data.list;
      this.total = res.data.total;
      return res.data;
    },

    async fetchProfile(id: number) {
      const res = await getUserProfile(id);
      this.currentProfile = res.data;
      return res.data;
    },

    clearProfiles() {
      this.profiles = [];
      this.total = 0;
    },
  },
});

export default useUserProfileStore;
```

## 类型定义规范

### 类型文件结构

```typescript
// src/types/user-profile.ts

// 常量枚举
export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BANNED: 'banned',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

// 实体类型
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone?: string;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

// 查询参数
export interface UserProfileQuery {
  page: number;
  pageSize: number;
  username?: string;
  status?: UserStatus;
}

// 响应类型
export interface UserProfileListResponse {
  list: UserProfile[];
  total: number;
}

// 创建/更新 DTO
export interface CreateUserProfileDto {
  username: string;
  email: string;
  phone?: string;
}

export interface UpdateUserProfileDto {
  username?: string;
  email?: string;
  phone?: string;
  status?: UserStatus;
}
```

### 命名约定

| 类型 | 命名规则 | 示例 |
|------|----------|------|
| 实体 | `[Module]` | `UserProfile` |
| 查询参数 | `[Module]Query` | `UserProfileQuery` |
| 列表响应 | `[Module]ListResponse` | `UserProfileListResponse` |
| 创建 DTO | `Create[Module]Dto` | `CreateUserProfileDto` |
| 更新 DTO | `Update[Module]Dto` | `UpdateUserProfileDto` |
| 状态 | `[Module]State` | `UserProfileState` |
