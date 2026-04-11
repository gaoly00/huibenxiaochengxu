import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const data: any[] = [];
for (let i = 0; i < 25; i += 1) {
  const imageCount = Mock.mock('@integer(0, 5)');
  const images: string[] = [];
  for (let j = 0; j < imageCount; j += 1) {
    images.push(
      `https://picsum.photos/seed/${Mock.mock('@integer(1,999)')}/200/200`
    );
  }
  const status = Mock.mock('@pick(["pending", "approved", "rejected"])');
  const hasImages = imageCount > 0;
  let rewardPoints = 0;
  if (status === 'approved') {
    rewardPoints = hasImages ? 20 : 10;
  }
  data.push({
    id: 1001 + i,
    userNickname: Mock.mock('@cname'),
    productName: Mock.mock('@ctitle(4, 8)'),
    content: Mock.mock('@cparagraph(1, 3)'),
    rating: Mock.mock('@integer(1, 5)'),
    images,
    imageCount,
    status,
    rewardPoints,
    createdTime: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
  });
}

setupMock({
  setup() {
    // List
    Mock.mock(new RegExp('/api/review/comments'), 'get', (params: any) => {
      const { url } = params;
      const urlObj = new URL(url, 'http://localhost');
      const page = parseInt(urlObj.searchParams.get('page') || '1', 10);
      const pageSize = parseInt(
        urlObj.searchParams.get('pageSize') || '10',
        10
      );
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return successResponseWrap({
        list: data.slice(start, end),
        total: data.length,
      });
    });

    // Approve — 自动计算积分
    Mock.mock(
      new RegExp('/api/review/comments/approve'),
      'put',
      (options: any) => {
        const idMatch = options.url.match(/\/approve\/(\d+)/);
        const id = idMatch ? Number(idMatch[1]) : 0;
        const record = data.find((item) => item.id === id);
        if (record) {
          record.status = 'approved';
          record.rewardPoints = record.imageCount > 0 ? 20 : 10;
        }
        return successResponseWrap(true);
      }
    );

    // Reject
    Mock.mock(
      new RegExp('/api/review/comments/reject'),
      'put',
      (options: any) => {
        const idMatch = options.url.match(/\/reject\/(\d+)/);
        const id = idMatch ? Number(idMatch[1]) : 0;
        const record = data.find((item) => item.id === id);
        if (record) {
          record.status = 'rejected';
          record.rewardPoints = 0;
        }
        return successResponseWrap(true);
      }
    );

    // Delete
    Mock.mock(
      new RegExp('/api/review/comments/delete'),
      'delete',
      (options: any) => {
        const idMatch = options.url.match(/\/delete\/(\d+)/);
        const id = idMatch ? Number(idMatch[1]) : 0;
        const idx = data.findIndex((item) => item.id === id);
        if (idx !== -1) data.splice(idx, 1);
        return successResponseWrap(true);
      }
    );
  },
});
