import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const defaultConfig = {
  enabled: true,
  levelDescription: '固定二级分销',
  level1CommissionRate: 10,
  level2CommissionRate: 5,
  ruleDescription: '用户通过分享链接邀请好友购买商品，一级推荐人获得订单金额10%佣金，二级推荐人获得5%佣金。',
};

setupMock({
  setup() {
    // GET config
    Mock.mock(new RegExp('/api/marketing/distribution/config'), 'get', () => {
      return successResponseWrap(defaultConfig);
    });

    // PUT config
    Mock.mock(new RegExp('/api/marketing/distribution/config'), 'put', () => {
      return successResponseWrap(true);
    });
  },
});
