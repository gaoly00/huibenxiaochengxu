import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const categories = ['启蒙认知', '情感教育', '自然科学', '语言学习'];
const tagPool = ['数字', '颜色', '动物', '情绪', '字母'];
const ageGroups = ['0-3', '3-6', '6-9', '9-12'];
const statuses = ['draft', 'published', 'offline'];
const pdfStatuses = ['not_uploaded', 'pending', 'converting', 'success', 'failed'];

setupMock({
  setup() {
    // GET detail
    Mock.mock(new RegExp('/api/picture-book/[a-zA-Z0-9-]+$'), 'get', () => {
      const catIndex = Mock.mock('@integer(0,3)');
      return successResponseWrap({
        id: Mock.mock('@guid'),
        title: Mock.mock('@ctitle(4,10)'),
        subtitle: Mock.mock('@ctitle(6,15)'),
        coverUrl: `https://picsum.photos/seed/${Mock.mock('@integer(1,500)')}/120/160`,
        detail: Mock.mock('@cparagraph(3,6)'),
        categoryId: Mock.mock('@guid'),
        categoryName: categories[catIndex],
        ageGroup: ageGroups[Mock.mock('@integer(0,3)')],
        tags: (() => {
          const count = Mock.mock('@integer(1,3)');
          const shuffled = [...tagPool].sort(() => 0.5 - Math.random());
          return shuffled.slice(0, count);
        })(),
        keywords: Mock.mock('@cword(2,4)'),
        sortOrder: Mock.mock('@integer(0,100)'),
        isHomepageRecommend: Mock.mock('@boolean'),
        isSmartRecommend: Mock.mock('@boolean'),
        status: statuses[Mock.mock('@integer(0,2)')],
        pdfUrl: '',
        pdfConvertStatus: pdfStatuses[Mock.mock('@integer(0,4)')],
        pageCount: Mock.mock('@integer(10,50)'),
        pageImages: [],
        allowOnlineReading: Mock.mock('@boolean'),
        readingClarity: Mock.mock('@pick(["low","medium"])'),
        readingEndGuideText: Mock.mock('@csentence(10,30)'),
        physicalEnabled: Mock.mock('@boolean'),
        physicalSpecs: Mock.mock('@pick(["A4"], ["A5"], ["A4","A5"])'),
        physicalPriceA4: Mock.mock('@float(20,100,2,2)'),
        physicalPriceA5: Mock.mock('@float(10,80,2,2)'),
        physicalShippingTemplateId: Mock.mock('@guid'),
        physicalStockEnabled: Mock.mock('@boolean'),
        physicalStock: Mock.mock('@integer(0,500)'),
        digitalEnabled: Mock.mock('@boolean'),
        digitalPrice: Mock.mock('@float(5,50,2,2)'),
        digitalBaiduPanUrl: 'https://pan.baidu.com/s/1example',
        digitalBaiduPanCode: Mock.mock('@string("lower",4)'),
        digitalDeliveryNote: '购买后自动发送网盘链接',
        createdTime: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
        updatedTime: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
      });
    });

    // POST create
    Mock.mock(new RegExp('/api/picture-book/create'), 'post', () => {
      return successResponseWrap({ id: Mock.mock('@guid') });
    });

    // PUT update
    Mock.mock(new RegExp('/api/picture-book/[a-zA-Z0-9-]+$'), 'put', () => {
      return successResponseWrap(true);
    });

    // DELETE
    Mock.mock(new RegExp('/api/picture-book/[a-zA-Z0-9-]+$'), 'delete', () => {
      return successResponseWrap(true);
    });

    // PUT toggle status
    Mock.mock(new RegExp('/api/picture-book/[a-zA-Z0-9-]+/status'), 'put', () => {
      return successResponseWrap(true);
    });

    // POST retry convert
    Mock.mock(new RegExp('/api/picture-book/[a-zA-Z0-9-]+/retry-convert'), 'post', () => {
      return successResponseWrap(true);
    });
  },
});
