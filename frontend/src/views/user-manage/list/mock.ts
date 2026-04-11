import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { MockParams } from '@/types/mock';

const data: any[] = [];
for (let i = 0; i < 30; i += 1) {
  const points = Mock.mock('@integer(0, 5000)');
  const hasInviter = Mock.mock('@boolean');
  const hasDist = Mock.mock('@boolean');
  data.push({
    id: Mock.mock('@guid'),
    openId: `oXXXX${Mock.mock('@string("lower", 20)')}`,
    nickname: Mock.mock('@cname'),
    avatar: `https://picsum.photos/seed/${Mock.mock('@integer(1,300)')}/40/40`,
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
    totalPaidAmount: Mock.mock('@float(0, 5000, 0, 2)'),
    lastOrderTime: Mock.mock('@datetime'),
    remark: '',
    registrationTime: Mock.mock('@datetime'),
    updatedTime: Mock.mock('@datetime'),
  });
}

// 积分记录（共享，detail mock 也使用）
const pointsRecords: any[] = [];
const changeTypes = ['register', 'check_in', 'showcase', 'purchase', 'deduction', 'admin_adjust'];
for (let i = 0; i < 20; i += 1) {
  const changeType = changeTypes[Mock.mock('@integer(0, 5)')];
  const isPositive = ['register', 'check_in', 'showcase', 'admin_adjust'].includes(changeType);
  const pts = Mock.mock('@integer(1, 200)');
  pointsRecords.push({
    id: Mock.mock('@guid'),
    userId: data[Mock.mock('@integer(0, 4)')].id,
    userNickname: Mock.mock('@cname'),
    changeType,
    points: isPositive ? pts : -pts,
    balance: Mock.mock('@integer(0, 5000)'),
    reason: Mock.mock('@ctitle(4, 8)'),
    remark: '',
    createdTime: Mock.mock('@datetime'),
  });
}

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/user-manage/list'), (params: MockParams) => {
      const queryParams = qs.parseUrl(params.url).query as any;
      const current = Number(queryParams.current) || 1;
      const pageSize = Number(queryParams.pageSize) || 20;
      const start = (current - 1) * pageSize;
      const end = start + pageSize;
      const list = data.slice(start, end);
      return successResponseWrap({
        list,
        total: data.length,
      });
    });

    // PUT toggle user status
    Mock.mock(new RegExp('/api/user-manage/[a-zA-Z0-9-]+/status'), 'put', (options: any) => {
      const idMatch = options.url.match(/\/api\/user-manage\/([a-zA-Z0-9-]+)\/status/);
      const id = idMatch ? idMatch[1] : '';
      const body = JSON.parse(options.body);
      const user = data.find((item: any) => item.id === id);
      if (user) {
        user.status = body.status;
      }
      return successResponseWrap(true);
    });

    Mock.mock(new RegExp('/api/user-manage/adjust-points'), 'post', (options: any) => {
      const body = JSON.parse(options.body);
      const user = data.find((item: any) => item.id === body.userId);
      if (user) {
        const pts = Number(body.points);
        if (body.adjustType === 'increase') {
          user.points += pts;
          user.totalPoints += pts;
        } else {
          user.points = Math.max(0, user.points - pts);
        }
        // 插入积分记录
        pointsRecords.unshift({
          id: Mock.mock('@guid'),
          userId: user.id,
          userNickname: user.nickname,
          changeType: 'admin_adjust',
          points: body.adjustType === 'increase' ? pts : -pts,
          balance: user.points,
          reason: body.reason || '管理员调整',
          remark: body.remark || '',
          createdTime: new Date().toLocaleString(),
        });
      }
      return successResponseWrap(true);
    });
  },
});

// eslint-disable-next-line import/prefer-default-export
export { data as userListData, pointsRecords as userPointsRecords };
