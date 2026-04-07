import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MIGRATION: AppRouteRecordRaw = {
  path: '/migration',
  name: 'migration',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.migration',
    requiresAuth: true,
    icon: 'icon-sync',
    order: 8,
  },
  children: [
    {
      path: 'tasks',
      name: 'MigrationTasks',
      component: () => import('@/views/migration/tasks/index.vue'),
      meta: {
        locale: 'menu.migration.tasks',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default MIGRATION;
