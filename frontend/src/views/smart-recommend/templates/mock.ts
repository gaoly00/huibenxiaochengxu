import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const data = Mock.mock({
  'list|5': [
    {
      'id|+1': 1,
      name: () => Mock.mock('@ctitle(4, 8)'),
      content: () => Mock.mock('@cparagraph(2, 4)'),
      'status|1': ['enabled', 'disabled'],
      updatedTime: () => Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
    },
  ],
});

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/smart-recommend/templates'), () => {
      return successResponseWrap({
        list: data.list,
        total: data.list.length,
      });
    });
  },
});
