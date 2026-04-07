import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/system/basic'), () => {
      return successResponseWrap({
        appName: '绘本小程序',
        appDescription: '一款专注于儿童绘本阅读与购买的小程序平台',
        contactInfo: 'support@huiben.com',
        pointsDeductionNote: '每100积分可抵扣1元，单笔订单最多抵扣50%',
      });
    });
  },
});
