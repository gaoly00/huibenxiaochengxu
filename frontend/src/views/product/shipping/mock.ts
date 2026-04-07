import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const allData: any[] = [];
const templateNames = [
  '默认运费模板',
  '偏远地区运费模板',
  '包邮模板',
  '重量计费模板',
  '件数计费模板',
];

for (let i = 0; i < 5; i += 1) {
  allData.push({
    id: Mock.mock('@guid'),
    name: templateNames[i],
    chargeDescription: Mock.mock('@cparagraph(1, 2)'),
    freeShippingRule: Mock.mock('@cparagraph(1, 2)'),
    status: Mock.mock('@pick(["enabled", "disabled"])'),
    createdTime: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
    updatedTime: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
  });
}

setupMock({
  setup() {
    // List
    Mock.mock(new RegExp('/api/product/shipping-template/list'), (params: { url: string }) => {
      const queryParams = qs.parseUrl(params.url).query as any;
      const current = parseInt(queryParams.current, 10) || 1;
      const pageSize = parseInt(queryParams.pageSize, 10) || 10;
      const start = (current - 1) * pageSize;
      const end = start + pageSize;
      const list = allData.slice(start, end);
      return successResponseWrap({
        list,
        total: allData.length,
      });
    });

    // Create
    Mock.mock(new RegExp('/api/product/shipping-template/create'), 'post', () => {
      return successResponseWrap({ id: Mock.mock('@guid') });
    });

    // Update
    Mock.mock(new RegExp('/api/product/shipping-template/[a-zA-Z0-9-]+$'), 'put', () => {
      return successResponseWrap(true);
    });

    // Delete
    Mock.mock(new RegExp('/api/product/shipping-template/[a-zA-Z0-9-]+$'), 'delete', () => {
      return successResponseWrap(true);
    });
  },
});
