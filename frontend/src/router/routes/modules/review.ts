import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const REVIEW: AppRouteRecordRaw = {
  path: '/review',
  name: 'review',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.review',
    requiresAuth: true,
    icon: 'icon-message',
    order: 5,
  },
  children: [
    {
      path: 'comments',
      name: 'ReviewComments',
      component: () => import('@/views/review/comments/index.vue'),
      meta: {
        locale: 'menu.review.comments',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'showcases',
      name: 'ReviewShowcases',
      component: () => import('@/views/review/showcases/index.vue'),
      meta: {
        locale: 'menu.review.showcases',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default REVIEW;
