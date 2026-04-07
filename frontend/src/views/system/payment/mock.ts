import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/system/payment'), () => {
      return successResponseWrap({
        enabled: true,
        paymentNote: '支付完成后，电子版绘本将自动发送至您的账户',
        mchId: '1600000001',
        appId: 'wx1234567890abcdef',
      });
    });
  },
});
