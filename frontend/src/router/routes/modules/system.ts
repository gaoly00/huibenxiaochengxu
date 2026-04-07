import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SYSTEM: AppRouteRecordRaw = {
  path: '/system',
  name: 'system',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.system',
    requiresAuth: true,
    icon: 'icon-settings',
    order: 9,
  },
  children: [
    {
      path: 'basic',
      name: 'SystemBasic',
      component: () => import('@/views/system/basic/index.vue'),
      meta: {
        locale: 'menu.system.basic',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'payment',
      name: 'SystemPayment',
      component: () => import('@/views/system/payment/index.vue'),
      meta: {
        locale: 'menu.system.payment',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'logs',
      name: 'SystemLogs',
      component: () => import('@/views/system/logs/index.vue'),
      meta: {
        locale: 'menu.system.logs',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default SYSTEM;
