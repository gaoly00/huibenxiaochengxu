import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { MockParams } from '@/types/mock';
import { userListData, userPointsRecords } from '@/views/user-manage/list/mock';

// Mock orders for user
const orderStatuses = ['pending_payment', 'paid', 'shipped', 'delivered', 'completed', 'cancelled', 'refunding', 'refunded'];
const userOrders: any[] = [];
for (let i = 0; i < 10; i += 1) {
  const orderType = Mock.mock('@pick(["physical", "digital"])');
  userOrders.push({
    id: Mock.mock('@guid'),
    orderNo: `ORD${Mock.mock("@datetime('yyyyMMdd')")}${Mock.mock('@string("number", 6)')}`,
    productName: Mock.mock('@ctitle(4, 8)'),
    orderType,
    actualAmount: Mock.mock('@float(9.9, 199, 1, 2)'),
    orderStatus: orderStatuses[Mock.mock('@integer(0, 7)')],
    createdTime: Mock.mock('@datetime'),
  });
}

// Mock invited users
const invitedUsers: any[] = [];
for (let i = 0; i < 5; i += 1) {
  invitedUsers.push({
    id: Mock.mock('@guid'),
    nickname: Mock.mock('@cname'),
    phone: `1${Mock.mock('@string("number", 10)')}`,
    registrationTime: Mock.mock('@datetime'),
  });
}

// Mock reviews
const reviewStatuses = ['pending', 'approved', 'rejected'];
const userReviews: any[] = [];
for (let i = 0; i < 6; i += 1) {
  userReviews.push({
    id: Mock.mock('@guid'),
    type: Mock.mock('@pick(["comment", "showcase"])'),
    content: Mock.mock('@cparagraph(1, 3)'),
    status: reviewStatuses[Mock.mock('@integer(0, 2)')],
    createdTime: Mock.mock('@datetime'),
  });
}

setupMock({
  setup() {
    // GET user detail — 从列表数据中查找（只匹配 UUID 格式的 id）
    Mock.mock(new RegExp('/api/user-manage/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'), 'get', (options: any) => {
      const idMatch = options.url.match(/\/api\/user-manage\/([0-9a-fA-F-]+)$/);
      const id = idMatch ? idMatch[1] : '';
      const found = userListData.find((item: any) => item.id === id);
      return successResponseWrap(found || userListData[0]);
    });

    // PUT user remark
    Mock.mock(new RegExp('/api/user-manage/[0-9a-fA-F]{8}-[0-9a-fA-F-]+/remark'), 'put', () => {
      return successResponseWrap(true);
    });

    // GET points records
    Mock.mock(new RegExp('/api/user-manage/points-records'), (params: MockParams) => {
      const queryParams = qs.parseUrl(params.url).query as any;
      const current = Number(queryParams.current) || 1;
      const pageSize = Number(queryParams.pageSize) || 10;
      const start = (current - 1) * pageSize;
      const end = start + pageSize;
      return successResponseWrap({
        list: userPointsRecords.slice(start, end),
        total: userPointsRecords.length,
      });
    });

    // GET user orders (for detail page)
    Mock.mock(new RegExp('/api/user-manage/user-orders'), () => {
      return successResponseWrap(userOrders);
    });

    // GET invited users
    Mock.mock(new RegExp('/api/user-manage/invited-users'), () => {
      return successResponseWrap(invitedUsers);
    });

    // GET user reviews
    Mock.mock(new RegExp('/api/user-manage/user-reviews'), () => {
      return successResponseWrap(userReviews);
    });
  },
});
