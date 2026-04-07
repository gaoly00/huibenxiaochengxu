import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const productTypes = ['physical', 'digital'];
const productStatuses = ['draft', 'on_sale', 'off_sale'];
const categories = [
  { id: 'cat-1', name: '经典绘本' },
  { id: 'cat-2', name: '科普百科' },
  { id: 'cat-3', name: '情商培养' },
  { id: 'cat-4', name: '习惯养成' },
];
const bookTitles = [
  '小王子', '猜猜我有多爱你', '好饿的毛毛虫',
  '大卫不可以', '逃家小兔', '爱心树',
  '我爸爸', '我妈妈', '彩虹色的花', '蚂蚁和西瓜',
];

const allData: any[] = [];
for (let i = 0; i < 25; i += 1) {
  const type = Mock.mock(`@pick(${JSON.stringify(productTypes)})`);
  const suffix = type === 'physical' ? '纸质版' : '电子版';
  const price = parseFloat(Mock.mock('@float(9.9, 199, 1, 2)'));
  const cat = Mock.mock(`@pick(${JSON.stringify(categories)})`);
  const book = Mock.mock(`@pick(${JSON.stringify(bookTitles)})`);
  allData.push({
    id: Mock.mock('@guid'),
    name: `${Mock.mock('@ctitle(4, 8)')}${suffix}`,
    type,
    coverUrl: `https://picsum.photos/seed/${Mock.mock('@integer(1, 999)')}/120/120`,
    images: [
      `https://picsum.photos/seed/${Mock.mock('@integer(1, 999)')}/400/400`,
      `https://picsum.photos/seed/${Mock.mock('@integer(1, 999)')}/400/400`,
    ],
    description: Mock.mock('@cparagraph(1, 3)'),
    detail: Mock.mock('@cparagraph(2, 5)'),
    price,
    originalPrice: parseFloat((price * 1.5).toFixed(2)),
    status: Mock.mock(`@pick(${JSON.stringify(productStatuses)})`),
    categoryId: cat.id,
    categoryName: cat.name,
    pictureBookId: Mock.mock('@guid'),
    pictureBookTitle: book,
    spec: type === 'physical' ? Mock.mock('@pick(["A4", "A5"])') : '',
    shippingTemplateId: type === 'physical' ? Mock.mock('@guid') : '',
    shippingTemplateName: type === 'physical' ? '默认运费模板' : '',
    freeShippingNote: type === 'physical' ? '满99元包邮' : '',
    stockEnabled: type === 'physical',
    stock: type === 'physical' ? Mock.mock('@integer(10, 500)') : 0,
    baiduPanUrl: type === 'digital' ? 'https://pan.baidu.com/s/xxxxx' : '',
    baiduPanCode: type === 'digital' ? Mock.mock('@string("lower", 4)') : '',
    deliveryNote: type === 'digital' ? '购买后自动发送百度网盘链接' : '',
    deliveryTemplate: type === 'digital' ? '您购买的电子版绘本链接：{url} 提取码：{code}' : '',
    sales: Mock.mock('@integer(0, 500)'),
    createdTime: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
    updatedTime: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
  });
}

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/product/list'), (params: { url: string }) => {
      const queryParams = qs.parseUrl(params.url).query as any;
      const current = parseInt(queryParams.current, 10) || 1;
      const pageSize = parseInt(queryParams.pageSize, 10) || 10;

      let filtered = [...allData];
      if (queryParams.name) {
        filtered = filtered.filter((item) =>
          item.name.includes(queryParams.name)
        );
      }
      if (queryParams.type) {
        filtered = filtered.filter((item) => item.type === queryParams.type);
      }
      if (queryParams.status) {
        filtered = filtered.filter(
          (item) => item.status === queryParams.status
        );
      }
      if (queryParams.pictureBookTitle) {
        filtered = filtered.filter((item) =>
          item.pictureBookTitle.includes(queryParams.pictureBookTitle)
        );
      }

      const start = (current - 1) * pageSize;
      const end = start + pageSize;
      const list = filtered.slice(start, end);

      return successResponseWrap({
        list,
        total: filtered.length,
      });
    });
  },
});
