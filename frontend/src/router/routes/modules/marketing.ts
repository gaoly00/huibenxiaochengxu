import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MARKETING: AppRouteRecordRaw = {
  path: '/marketing',
  name: 'marketing',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.marketing',
    requiresAuth: true,
    icon: 'icon-gift',
    order: 6,
  },
  children: [
    {
      path: 'distribution',
      name: 'MarketingDistribution',
      component: () => import('@/views/marketing/distribution/index.vue'),
      meta: {
        locale: 'menu.marketing.distribution',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default MARKETING;
