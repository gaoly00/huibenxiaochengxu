import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const defaultConfig = {
  registerPoints: 100,
  checkInPoints: 10,
  showcasePoints: 50,
  pointsToYuanRate: 100,
};

setupMock({
  setup() {
    // GET config
    Mock.mock(new RegExp('/api/marketing/points/config'), 'get', () => {
      return successResponseWrap(defaultConfig);
    });

    // PUT config
    Mock.mock(new RegExp('/api/marketing/points/config'), 'put', () => {
      return successResponseWrap(true);
    });
  },
});
