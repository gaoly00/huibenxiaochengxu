import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const ORDER: AppRouteRecordRaw = {
  path: '/order',
  name: 'order',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.order',
    requiresAuth: true,
    icon: 'icon-file',
    order: 3,
  },
  children: [
    {
      path: 'list',
      name: 'OrderList',
      component: () => import('@/views/order/list/index.vue'),
      meta: {
        locale: 'menu.order.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'physical/:id',
      name: 'PhysicalOrderDetail',
      component: () => import('@/views/order/detail/index.vue'),
      meta: {
        locale: 'menu.order.physicalDetail',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
    {
      path: 'digital/:id',
      name: 'DigitalOrderDetail',
      component: () => import('@/views/order/detail/index.vue'),
      meta: {
        locale: 'menu.order.digitalDetail',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
  ],
};

export default ORDER;
