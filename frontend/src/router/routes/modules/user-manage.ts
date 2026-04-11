import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USER_MANAGE: AppRouteRecordRaw = {
  path: '/user-manage',
  name: 'userManage',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.userManage',
    requiresAuth: true,
    icon: 'icon-user',
    order: 4,
  },
  children: [
    {
      path: 'list',
      name: 'UserManageList',
      component: () => import('@/views/user-manage/list/index.vue'),
      meta: {
        locale: 'menu.userManage.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'detail/:id',
      name: 'UserManageDetail',
      component: () => import('@/views/user-manage/detail/index.vue'),
      meta: {
        locale: 'menu.userManage.detail',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
    {
      path: 'level',
      name: 'MemberLevel',
      component: () => import('@/views/user-manage/level/index.vue'),
      meta: {
        locale: 'menu.userManage.level',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'points-rule',
      name: 'PointsRule',
      component: () => import('@/views/user-manage/points-rule/index.vue'),
      meta: {
        locale: 'menu.userManage.pointsRule',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default USER_MANAGE;
