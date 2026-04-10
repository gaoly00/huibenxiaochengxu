import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { orderListData } from '@/views/order/list/mock';

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
    // GET /api/order/:id — 从列表数据中查找
    Mock.mock(new RegExp('/api/order/[a-zA-Z0-9-]+$'), 'get', (options: any) => {
      const idMatch = options.url.match(/\/api\/order\/([a-zA-Z0-9-]+)$/);
      const id = idMatch ? idMatch[1] : '';
      const found = orderListData.find((item: any) => item.id === id);
      return successResponseWrap(found || orderListData[0]);
    });

    // PUT /api/order/:id/ship
    Mock.mock(new RegExp('/api/order/[a-zA-Z0-9-]+/ship'), 'put', (options: any) => {
      const idMatch = options.url.match(/\/api\/order\/([a-zA-Z0-9-]+)\/ship/);
      const id = idMatch ? idMatch[1] : '';
      const order = orderListData.find((item: any) => item.id === id);
      if (order) {
        order.orderStatus = 'shipped';
        order.shippingStatus = 'shipped';
      }
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

    // POST /api/order/:id/refund
    Mock.mock(new RegExp('/api/order/[a-zA-Z0-9-]+/refund'), 'post', (options: any) => {
      const idMatch = options.url.match(/\/api\/order\/([a-zA-Z0-9-]+)\/refund/);
      const id = idMatch ? idMatch[1] : '';
      const order = orderListData.find((item: any) => item.id === id);
      if (order) {
        order.orderStatus = 'refunded';
        order.paymentStatus = 'refunded';
      }
      return successResponseWrap(null);
    });

    // GET /api/order/:id/delivery-logs
    Mock.mock(new RegExp('/api/order/[a-zA-Z0-9-]+/delivery-logs'), 'get', () => {
      return successResponseWrap(generateDeliveryLogs());
    });
  },
});