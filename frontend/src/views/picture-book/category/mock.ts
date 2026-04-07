import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';

const data = Mock.mock({
  'list|10': [
    {
      'id': '@guid',
      'name|1': ['启蒙认知', '情感教育', '自然科学', '语言学习', '艺术启蒙', '生活习惯', '社交能力', '数学思维', '传统文化', '安全教育'],
      'sortOrder': '@integer(0,100)',
      'status|1': ['enabled', 'disabled'],
      'createdTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
      'updatedTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    },
  ],
});

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/picture-book/category/list'), (params: GetParams) => {
      const { current = 1, pageSize = 10 } = Object.fromEntries(
        new URLSearchParams(params.url.split('?')[1] || '')
      );
      const p = Number(current);
      const ps = Number(pageSize);
      const start = (p - 1) * ps;
      const end = start + ps;
      return successResponseWrap({
        list: data.list.slice(start, end),
        total: data.list.length,
      });
    });

    Mock.mock(new RegExp('/api/picture-book/category/create'), 'post', () => {
      return successResponseWrap({ id: Mock.mock('@guid') });
    });

    Mock.mock(new RegExp('/api/picture-book/category/[a-zA-Z0-9-]+$'), 'put', () => {
      return successResponseWrap(true);
    });

    Mock.mock(new RegExp('/api/picture-book/category/[a-zA-Z0-9-]+$'), 'delete', () => {
      return successResponseWrap(true);
    });
  },
});
