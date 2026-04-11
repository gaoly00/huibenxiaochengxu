import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const ruleConfig = {
  registerEnabled: true,
  registerPoints: 100,
  checkInEnabled: true,
  checkInPoints: 10,
  consumeEnabled: true,
  consumePerYuan: 10,
  consumePoints: 1,
  reviewEnabled: true,
  reviewPoints: 20,
  deductionEnabled: true,
  deductionPerYuan: 1,
  deductionPoints: 100,
  maxDeductionPercent: 50,
};

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/user-manage/points-rule$'), 'get', () => {
      return successResponseWrap(ruleConfig);
    });

    Mock.mock(new RegExp('/api/user-manage/points-rule$'), 'put', (options: any) => {
      const body = JSON.parse(options.body);
      Object.assign(ruleConfig, body);
      return successResponseWrap(true);
    });
  },
});
