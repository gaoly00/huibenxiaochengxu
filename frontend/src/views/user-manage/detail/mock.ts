import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { MockParams } from '@/types/mock';

// Mock user detail
const generateUserDetail = () => {
  const points = Mock.mock('@integer(0, 5000)');
  const hasInviter = Mock.mock('@boolean');
  const hasDist = Mock.mock('@boolean');
  return {
    id: Mock.mock('@guid'),
    openId: `oXXXX${Mock.mock('@string("lower", 20)')}`,
    nickname: Mock.mock('@cname'),
    avatar: `https://picsum.photos/seed/${Mock.mock('@integer(1,300)')}/80/80`,
    phone: `1${Mock.mock('@string("number", 10)')}`,
    points,
    totalPoints: points + Mock.mock('@integer(0, 3000)'),
    status: Mock.mock('@pick(["active", "disabled"])'),
    inviterId: hasInviter ? Mock.mock('@guid') : null,
    inviterNickname: hasInviter ? Mock.mock('@cname') : null,
    distributionLevel: Mock.mock('@integer(0, 2)'),
    distributionParentId: hasDist ? Mock.mock('@guid') : null,
    distributionParentNickname: hasDist ? Mock.mock('@cname') : null,
    totalCommission: Mock.mock('@float(0, 500, 0, 2)'),
    orderCount: Mock.mock('@integer(0, 50)'),
    lastOrderTime: Mock.mock('@datetime'),
    remark: Mock.mock('@cparagraph(1)'),
    registrationTime: Mock.mock('@datetime'),
    updatedTime: Mock.mock('@datetime'),
  };
};

// Mock points records
const pointsRecords: any[] = [];
const changeTypes = ['register', 'check_in', 'showcase', 'purchase', 'deduction', 'admin_adjust'];
for (let i = 0; i < 20; i += 1) {
  const changeType = changeTypes[Mock.mock('@integer(0, 5)')];
  const isPositive = ['register', 'check_in', 'showcase', 'admin_adjust'].includes(changeType);
  const pts = Mock.mock('@integer(1, 200)');
  pointsRecords.push({
    id: Mock.mock('@guid'),
    userId: Mock.mock('@guid'),
    userNickname: Mock.mock('@cname'),
    changeType,
    points: isPositive ? pts : -pts,
    balance: Mock.mock('@integer(0, 5000)'),
    reason: Mock.mock('@ctitle(4, 8)'),
    remark: '',
    createdTime: Mock.mock('@datetime'),
  });
}

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
    // GET user detail
    Mock.mock(new RegExp('/api/user-manage/[a-zA-Z0-9-]+$'), 'get', () => {
      return successResponseWrap(generateUserDetail());
    });

    // PUT user remark
    Mock.mock(new RegExp('/api/user-manage/[a-zA-Z0-9-]+/remark'), 'put', () => {
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
        list: pointsRecords.slice(start, end),
        total: pointsRecords.length,
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
