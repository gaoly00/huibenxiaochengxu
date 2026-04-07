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
    lastOrderTime: Mock.mock('@datetime'),
    remark: '',
    registrationTime: Mock.mock('@datetime'),
    updatedTime: Mock.mock('@datetime'),
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

    Mock.mock(new RegExp('/api/user-manage/adjust-points'), 'post', () => {
      return successResponseWrap(true);
    });
  },
});
