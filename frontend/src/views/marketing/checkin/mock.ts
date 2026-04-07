import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const defaultConfig = {
  enabled: true,
  dailyPoints: 5,
  consecutiveDescription: '连续签到7天额外奖励50积分，连续签到30天额外奖励200积分',
};

setupMock({
  setup() {
    // GET config
    Mock.mock(new RegExp('/api/marketing/checkin/config'), 'get', () => {
      return successResponseWrap(defaultConfig);
    });

    // PUT config
    Mock.mock(new RegExp('/api/marketing/checkin/config'), 'put', () => {
      return successResponseWrap(true);
    });
  },
});
