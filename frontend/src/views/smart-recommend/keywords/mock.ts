import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const categories = ['绘本', '故事书', '科普', '艺术', '启蒙'];
const tags = ['热门', '新品', '经典', '畅销', '推荐', '限时'];
const templateNames = ['默认推荐', '首页推荐', '分类推荐', '搜索推荐', '个性化推荐'];

const data = Mock.mock({
  'list|10': [
    {
      'id|+1': 1,
      keyword: () => Mock.mock('@cword(2, 4)'),
      'mappedCategories|1-3': () =>
        categories[Mock.mock('@integer(0, 4)')],
      'mappedTags|1-3': () => tags[Mock.mock('@integer(0, 5)')],
      recommendTemplateName: () =>
        templateNames[Mock.mock('@integer(0, 4)')],
      'recommendTemplateId|+1': 101,
      'weight|1-100': 1,
      'status|1': ['enabled', 'disabled'],
      updatedTime: () => Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
    },
  ],
});

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/smart-recommend/keywords'), () => {
      return successResponseWrap({
        list: data.list,
        total: data.list.length,
      });
    });
  },
});
