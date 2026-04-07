import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const orderStatuses = [
  'pending_payment', 'paid', 'shipped', 'delivered',
  'completed', 'cancelled', 'refunding', 'refunded',
];
const paymentStatuses = ['unpaid', 'paid', 'refunded'];
const shippingStatuses = ['pending', 'shipped', 'delivered'];
const deliveryStatuses = ['pending', 'delivering', 'delivered', 'failed'];

function generateOrder(isPhysical: boolean) {
  const unitPrice = Mock.mock('@float(9.9, 199, 1, 2)');
  const quantity = Mock.mock('@integer(1, 3)');
  const totalAmount = Number((unitPrice * quantity).toFixed(2));
  const pointsDeduction = Mock.mock('@integer(0, 50)');
  const actualAmount = Number(
    Math.max(totalAmount - pointsDeduction * 0.1, 0).toFixed(2)
  );
  return {
    id: Mock.mock('@guid'),
    orderNo: `ORD${Mock.mock("@datetime('yyyyMMdd')")}${Mock.mock('@string("number", 6)')}`,
    userId: Mock.mock('@guid'),
    userNickname: Mock.mock('@cname'),
    userAvatar: `https://picsum.photos/seed/${Mock.mock('@integer(1,200)')}/40/40`,
    orderType: isPhysical ? 'physical' : 'digital',
    productId: Mock.mock('@guid'),
    productName: Mock.mock('@ctitle(4, 8)'),
    productCover: `https://picsum.photos/seed/${Mock.mock('@integer(1,300)')}/80/80`,
    quantity,
    unitPrice,
    totalAmount,
    actualAmount,
    pointsDeduction,
    orderStatus: orderStatuses[Mock.mock('@integer(0, 7)')],
    paymentStatus: paymentStatuses[Mock.mock('@integer(0, 2)')],
    paymentTime: Mock.mock('@datetime'),
    shippingStatus: isPhysical ? shippingStatuses[Mock.mock('@integer(0, 2)')] : '',
    receiverName: isPhysical ? Mock.mock('@cname') : '',
    receiverPhone: isPhysical ? Mock.mock(/^1[3-9]\d{9}$/) : '',
    receiverAddress: isPhysical ? Mock.mock('@county(true)') + Mock.mock('@ctitle(5,10)') : '',
    logisticsCompany: isPhysical ? Mock.mock('@pick(["顺丰速运","中通快递","圆通速递","韵达快递"])') : '',
    logisticsNo: isPhysical ? Mock.mock('@string("number", 12)') : '',
    deliveryStatus: !isPhysical ? deliveryStatuses[Mock.mock('@integer(0, 3)')] : '',
    deliveryTime: !isPhysical ? Mock.mock('@datetime') : '',
    baiduPanUrl: !isPhysical ? `https://pan.baidu.com/s/${Mock.mock('@string("lower", 8)')}` : '',
    baiduPanCode: !isPhysical ? Mock.mock('@string("lower", 4)') : '',
    deliveryRetryCount: !isPhysical ? Mock.mock('@integer(0, 3)') : 0,
    remark: Mock.mock('@cparagraph(1)'),
    createdTime: Mock.mock('@datetime'),
    updatedTime: Mock.mock('@datetime'),
  };
}

function generateDeliveryLogs() {
  const count = Mock.mock('@integer(3, 5)');
  const logs = [];
  for (let i = 0; i < count; i += 1) {
    logs.push({
      id: Mock.mock('@guid'),
      orderId: Mock.mock('@guid'),
      action: Mock.mock('@pick(["自动交付","手动补发","重试交付"])'),
      result: Mock.mock('@pick(["成功","失败"])'),
      detail: Mock.mock('@cparagraph(1)'),
      operatorName: Mock.mock('@pick(["系统","管理员"])'),
      createdTime: Mock.mock('@datetime'),
    });
  }
  return logs;
}

setupMock({
  setup() {
    // GET /api/order/:id
    Mock.mock(new RegExp('/api/order/[a-zA-Z0-9-]+$'), 'get', () => {
      const isPhysical = Mock.mock('@boolean');
      return successResponseWrap(generateOrder(isPhysical));
    });

    // PUT /api/order/:id/ship
    Mock.mock(new RegExp('/api/order/[a-zA-Z0-9-]+/ship'), 'put', () => {
      return successResponseWrap(null);
    });

    // PUT /api/order/:id/logistics
    Mock.mock(new RegExp('/api/order/[a-zA-Z0-9-]+/logistics'), 'put', () => {
      return successResponseWrap(null);
    });

    // PUT /api/order/:id/remark
    Mock.mock(new RegExp('/api/order/[a-zA-Z0-9-]+/remark'), 'put', () => {
      return successResponseWrap(null);
    });

    // POST /api/order/:id/retry-delivery
    Mock.mock(new RegExp('/api/order/[a-zA-Z0-9-]+/retry-delivery'), 'post', () => {
      return successResponseWrap(null);
    });

    // POST /api/order/:id/manual-delivery
    Mock.mock(new RegExp('/api/order/[a-zA-Z0-9-]+/manual-delivery'), 'post', () => {
      return successResponseWrap(null);
    });

    // GET /api/order/:id/delivery-logs
    Mock.mock(new RegExp('/api/order/[a-zA-Z0-9-]+/delivery-logs'), 'get', () => {
      return successResponseWrap(generateDeliveryLogs());
    });
  },
});
