import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const categories = [
  { id: 'cat-1', name: '经典绘本' },
  { id: 'cat-2', name: '科普百科' },
  { id: 'cat-3', name: '情商培养' },
  { id: 'cat-4', name: '习惯养成' },
];

setupMock({
  setup() {
    // GET /api/product/:id
    Mock.mock(new RegExp('/api/product/[a-zA-Z0-9-]+$'), 'get', () => {
      const cat = Mock.mock(`@pick(${JSON.stringify(categories)})`);
      const type = Mock.mock('@pick(["physical", "digital"])');
      const price = parseFloat(Mock.mock('@float(9.9, 199, 1, 2)'));
      return successResponseWrap({
        id: Mock.mock('@guid'),
        name: `${Mock.mock('@ctitle(4, 8)')}${type === 'physical' ? '纸质版' : '电子版'}`,
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
        status: Mock.mock('@pick(["draft", "on_sale", "off_sale"])'),
        categoryId: cat.id,
        categoryName: cat.name,
        pictureBookId: 'book-1',
        pictureBookTitle: '小王子',
        spec: type === 'physical' ? Mock.mock('@pick(["A4", "A5"])') : '',
        shippingTemplateId: type === 'physical' ? 'tpl-1' : '',
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
    });

    // POST /api/product/create
    Mock.mock(new RegExp('/api/product/create'), 'post', () => {
      return successResponseWrap({ id: Mock.mock('@guid') });
    });

    // PUT /api/product/:id
    Mock.mock(new RegExp('/api/product/[a-zA-Z0-9-]+$'), 'put', () => {
      return successResponseWrap(true);
    });

    // DELETE /api/product/:id
    Mock.mock(new RegExp('/api/product/[a-zA-Z0-9-]+$'), 'delete', () => {
      return successResponseWrap(true);
    });

    // PUT /api/product/:id/status
    Mock.mock(new RegExp('/api/product/[a-zA-Z0-9-]+/status'), 'put', () => {
      return successResponseWrap(true);
    });
  },
});