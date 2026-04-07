import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const data = Mock.mock({
  'list|20': [
    {
      'id|+1': 1001,
      'userNickname': '@cname',
      'targetType|1': ['pictureBook', 'product'],
      'targetName': '@ctitle(4, 8)',
      'content': '@cparagraph(1, 3)',
      'rating|1-5': 5,
      'status|1': ['pending', 'approved', 'rejected'],
      'createdTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    },
  ],
}).list;

setupMock({
  setup() {
    // List
    Mock.mock(new RegExp('/api/review/comments'), 'get', (params: any) => {
      const { url } = params;
      const urlObj = new URL(url, 'http://localhost');
      const page = parseInt(urlObj.searchParams.get('page') || '1', 10);
      const pageSize = parseInt(urlObj.searchParams.get('pageSize') || '10', 10);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return successResponseWrap({
        list: data.slice(start, end),
        total: data.length,
      });
    });

    // Approve
    Mock.mock(new RegExp('/api/review/comments/approve'), 'put', () => {
      return successResponseWrap(true);
    });

    // Reject
    Mock.mock(new RegExp('/api/review/comments/reject'), 'put', () => {
      return successResponseWrap(true);
    });

    // Delete
    Mock.mock(new RegExp('/api/review/comments/delete'), 'delete', () => {
      return successResponseWrap(true);
    });
  },
});
