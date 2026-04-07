import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const PICTURE_BOOK: AppRouteRecordRaw = {
  path: '/picture-book',
  name: 'pictureBook',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.pictureBook',
    requiresAuth: true,
    icon: 'icon-book',
    order: 1,
  },
  children: [
    {
      path: 'list',
      name: 'PictureBookList',
      component: () => import('@/views/picture-book/list/index.vue'),
      meta: {
        locale: 'menu.pictureBook.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'create',
      name: 'PictureBookCreate',
      component: () => import('@/views/picture-book/form/index.vue'),
      meta: {
        locale: 'menu.pictureBook.create',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
    {
      path: 'edit/:id',
      name: 'PictureBookEdit',
      component: () => import('@/views/picture-book/form/index.vue'),
      meta: {
        locale: 'menu.pictureBook.edit',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
    {
      path: 'categories',
      name: 'PictureBookCategories',
      component: () => import('@/views/picture-book/category/index.vue'),
      meta: {
        locale: 'menu.pictureBook.categories',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'tags',
      name: 'PictureBookTags',
      component: () => import('@/views/picture-book/tag/index.vue'),
      meta: {
        locale: 'menu.pictureBook.tags',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default PICTURE_BOOK;
