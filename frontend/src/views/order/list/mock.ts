import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { MockParams } from '@/types/mock';

const orderStatuses = [
  'pending_payment',
  'paid',
  'shipped',
  'delivered',
  'completed',
  'cancelled',
  'refunding',
  'refunded',
];
const paymentStatuses = ['unpaid', 'paid', 'refunded'];
const shippingStatuses = ['pending', 'shipped', 'delivered'];
const deliveryStatuses = ['pending', 'delivering', 'delivered', 'failed'];
const orderTypes = ['physical', 'digital'];

const data: any[] = [];
for (let i = 0; i < 40; i += 1) {
  const orderType = orderTypes[Mock.mock('@integer(0, 1)')];
  const unitPrice = Mock.mock('@float(9.9, 199, 1, 2)');
  const quantity = Mock.mock('@integer(1, 3)');
  const totalAmount = Number((unitPrice * quantity).toFixed(2));
  const pointsDeduction = Mock.mock('@integer(0, 50)');
  const actualAmount = Number(
    Math.max(totalAmount - pointsDeduction * 0.1, 0).toFixed(2)
  );
  const isPhysical = orderType === 'physical';

  data.push({
    id: Mock.mock('@guid'),
    orderNo: `ORD${Mock.mock("@datetime('yyyyMMdd')")}${Mock.mock(
      '@string("number", 6)'
    )}`,
    userId: Mock.mock('@guid'),
    userNickname: Mock.mock('@cname'),
    userAvatar: `https://picsum.photos/seed/${Mock.mock(
      '@integer(1,200)'
    )}/40/40`,
    orderType,
    productId: Mock.mock('@guid'),
    productName: Mock.mock('@ctitle(4, 8)'),
    productCover: `https://picsum.photos/seed/${Mock.mock(
      '@integer(1,300)'
    )}/80/80`,
    quantity,
    unitPrice,
    totalAmount,
    actualAmount,
    pointsDeduction,
    orderStatus: orderStatuses[Mock.mock('@integer(0, 7)')],
    paymentStatus: paymentStatuses[Mock.mock('@integer(0, 2)')],
    paymentTime: Mock.mock('@datetime'),
    shippingStatus: isPhysical
      ? shippingStatuses[Mock.mock('@integer(0, 2)')]
      : '',
    receiverName: isPhysical ? Mock.mock('@cname') : '',
    receiverPhone: isPhysical ? Mock.mock(/^1[3-9]\d{9}$/) : '',
    receiverAddress: isPhysical
      ? Mock.mock('@county(true)') + Mock.mock('@ctitle(5, 10)')
      : '',
    logisticsCompany: isPhysical ? Mock.mock('@pick(["顺丰速运","中通快递","圆通速递","韵达快递"])') : '',
    logisticsNo: isPhysical ? Mock.mock('@string("number", 12)') : '',
    deliveryStatus: !isPhysical
      ? deliveryStatuses[Mock.mock('@integer(0, 3)')]
      : '',
    deliveryTime: !isPhysical ? Mock.mock('@datetime') : '',
    baiduPanUrl: !isPhysical
      ? `https://pan.baidu.com/s/${Mock.mock('@string("lower", 8)')}`
      : '',
    baiduPanCode: !isPhysical ? Mock.mock('@string("lower", 4)') : '',
    deliveryRetryCount: !isPhysical ? Mock.mock('@integer(0, 3)') : 0,
    remark: Mock.mock('@cparagraph(1)'),
    createdTime: Mock.mock('@datetime'),
    updatedTime: Mock.mock('@datetime'),
  });
}

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/order/list'), (params: MockParams) => {
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
  },
});
