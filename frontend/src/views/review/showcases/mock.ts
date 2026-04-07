import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const data = Mock.mock({
  'list|15': [
    {
      'id|+1': 2001,
      'userNickname': '@cname',
      'orderNo': /ORD\d{12}/,
      'productName': '@ctitle(4, 8)',
      'content': '@cparagraph(1, 3)',
      'images|1-5': ['https://picsum.photos/seed/@integer(1,999)/200/200'],
      'status|1': ['pending', 'approved', 'rejected'],
      'rewardStatus|1': ['pending', 'rewarded', 'skipped'],
      'rewardPoints|10-100': 50,
      'createdTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    },
  ],
}).list;

setupMock({
  setup() {
    // List
    Mock.mock(new RegExp('/api/review/showcases'), 'get', (params: any) => {
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
    Mock.mock(new RegExp('/api/review/showcases/approve'), 'put', () => {
      return successResponseWrap(true);
    });

    // Reject
    Mock.mock(new RegExp('/api/review/showcases/reject'), 'put', () => {
      return successResponseWrap(true);
    });

    // Reward
    Mock.mock(new RegExp('/api/review/showcases/reward'), 'put', () => {
      return successResponseWrap(true);
    });
  },
});
