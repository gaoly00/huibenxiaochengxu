import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const levelData = [
  { id: '1', name: '普通会员', minPoints: 0, discount: 100, sort: 1 },
  { id: '2', name: '银卡会员', minPoints: 500, discount: 95, sort: 2 },
  { id: '3', name: '金卡会员', minPoints: 2000, discount: 90, sort: 3 },
  { id: '4', name: '钻石会员', minPoints: 5000, discount: 85, sort: 4 },
];

setupMock({
  setup() {
    // GET member levels
    Mock.mock(new RegExp('/api/user-manage/member-levels$'), 'get', () => {
      return successResponseWrap(levelData);
    });

    // PUT update member level
    Mock.mock(new RegExp('/api/user-manage/member-levels/[a-zA-Z0-9-]+$'), 'put', (options: any) => {
      const idMatch = options.url.match(/\/member-levels\/([a-zA-Z0-9-]+)$/);
      const id = idMatch ? idMatch[1] : '';
      const body = JSON.parse(options.body);
      const level = levelData.find((item) => item.id === id);
      if (level) {
        level.minPoints = body.minPoints ?? level.minPoints;
        level.discount = body.discount ?? level.discount;
      }
      return successResponseWrap(true);
    });
  },
});
