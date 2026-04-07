import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';

const categories = ['启蒙认知', '情感教育', '自然科学', '语言学习'];
const tagPool = ['数字', '颜色', '动物', '情绪', '字母'];
const ageGroups = ['0-3', '3-6', '6-9', '9-12'];
const statuses = ['draft', 'published', 'offline'];
const pdfStatuses = ['not_uploaded', 'pending', 'converting', 'success', 'failed'];

const data = Mock.mock({
  'list|30': [
    {
      'id': '@guid',
      'title': '@ctitle(4,10)',
      'subtitle': '@ctitle(6,15)',
      'coverUrl': function () {
        return `https://picsum.photos/seed/${Mock.mock('@integer(1,500)')}/120/160`;
      },
      'categoryId': '@guid',
      'categoryName|1': categories,
      'tags': function () {
        const count = Mock.mock('@integer(1,3)');
        const shuffled = [...tagPool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      },
      'ageGroup|1': ageGroups,
      'status|1': statuses,
      'pdfConvertStatus|1': pdfStatuses,
      'isHomepageRecommend|1': [true, false],
      'isSmartRecommend|1': [true, false],
      'pageCount': '@integer(10,50)',
      'updatedTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    },
  ],
});

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/picture-book/list'), (params: GetParams) => {
      const { current = 1, pageSize = 10 } = Object.fromEntries(
        new URLSearchParams(params.url.split('?')[1] || '')
      );
      const p = Number(current);
      const ps = Number(pageSize);
      const start = (p - 1) * ps;
      const end = start + ps;
      return successResponseWrap({
        list: data.list.slice(start, end),
        total: data.list.length,
      });
    });
  },
});
