import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const PRODUCT: AppRouteRecordRaw = {
  path: '/product',
  name: 'product',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.product',
    requiresAuth: true,
    icon: 'icon-apps',
    order: 2,
  },
  children: [
    {
      path: 'list',
      name: 'ProductList',
      component: () => import('@/views/product/list/index.vue'),
      meta: {
        locale: 'menu.product.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'create',
      name: 'ProductCreate',
      component: () => import('@/views/product/form/index.vue'),
      meta: {
        locale: 'menu.product.create',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
    {
      path: 'edit/:id',
      name: 'ProductEdit',
      component: () => import('@/views/product/form/index.vue'),
      meta: {
        locale: 'menu.product.edit',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
    {
      path: 'shipping-templates',
      name: 'ShippingTemplates',
      component: () => import('@/views/product/shipping/index.vue'),
      meta: {
        locale: 'menu.product.shippingTemplates',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default PRODUCT;
