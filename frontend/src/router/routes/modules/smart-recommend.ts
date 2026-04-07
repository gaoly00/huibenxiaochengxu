import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SMART_RECOMMEND: AppRouteRecordRaw = {
  path: '/smart-recommend',
  name: 'smartRecommend',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.smartRecommend',
    requiresAuth: true,
    icon: 'icon-bulb',
    order: 7,
  },
  children: [
    {
      path: 'keywords',
      name: 'SmartRecommendKeywords',
      component: () => import('@/views/smart-recommend/keywords/index.vue'),
      meta: {
        locale: 'menu.smartRecommend.keywords',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'templates',
      name: 'SmartRecommendTemplates',
      component: () => import('@/views/smart-recommend/templates/index.vue'),
      meta: {
        locale: 'menu.smartRecommend.templates',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default SMART_RECOMMEND;
