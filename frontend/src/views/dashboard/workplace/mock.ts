import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/dashboard/stats'), () => {
      return successResponseWrap({
        todayOrders: Mock.mock('@integer(10, 200)'),
        todaySales: Mock.mock('@float(1000, 50000, 0, 2)'),
        pendingShipment: Mock.mock('@integer(5, 50)'),
        digitalDeliverySuccess: Mock.mock('@integer(3, 80)'),
        newUsers: Mock.mock('@integer(5, 100)'),
      });
    });

    Mock.mock(new RegExp('/api/dashboard/hot-picture-books'), () => {
      const list = [];
      for (let i = 0; i < 5; i += 1) {
        list.push({
          id: Mock.mock('@guid'),
          name: Mock.mock('@ctitle(4, 10)'),
          cover: `https://picsum.photos/seed/${Mock.mock('@integer(1,100)')}/60/80`,
          count: Mock.mock('@integer(100, 5000)'),
        });
      }
      list.sort((a: any, b: any) => b.count - a.count);
      return successResponseWrap(list);
    });

    Mock.mock(new RegExp('/api/dashboard/hot-products'), () => {
      const list = [];
      for (let i = 0; i < 5; i += 1) {
        list.push({
          id: Mock.mock('@guid'),
          name: Mock.mock('@ctitle(4, 10)'),
          cover: `https://picsum.photos/seed/${Mock.mock('@integer(1,100)')}/60/80`,
          count: Mock.mock('@integer(50, 3000)'),
        });
      }
      list.sort((a: any, b: any) => b.count - a.count);
      return successResponseWrap(list);
    });
  },
});
