import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';

const tagNames = [
  '数字', '颜色', '动物', '情绪', '字母',
  '形状', '水果', '交通工具', '家庭', '友谊',
  '勇气', '自然', '季节', '食物', '身体',
];

const data = Mock.mock({
  'list|15': [
    {
      'id': '@guid',
      'name': '@ctitle(2,4)',
      'sortOrder': '@integer(0,100)',
      'isSmartKeyword|1': [true, false],
      'status|1': ['enabled', 'disabled'],
      'createdTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
      'updatedTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    },
  ],
});

data.list.forEach((item: any, index: number) => {
  item.name = tagNames[index % tagNames.length];
});

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/picture-book/tag/list'), (params: GetParams) => {
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

    Mock.mock(new RegExp('/api/picture-book/tag/create'), 'post', () => {
      return successResponseWrap({ id: Mock.mock('@guid') });
    });

    Mock.mock(new RegExp('/api/picture-book/tag/[a-zA-Z0-9-]+$'), 'put', () => {
      return successResponseWrap(true);
    });

    Mock.mock(new RegExp('/api/picture-book/tag/[a-zA-Z0-9-]+$'), 'delete', () => {
      return successResponseWrap(true);
    });
  },
});
