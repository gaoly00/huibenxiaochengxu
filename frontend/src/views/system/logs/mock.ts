import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const modules = ['user', 'product', 'order', 'pictureBook', 'system', 'migration', 'recommend'];
const actions = ['create', 'update', 'delete', 'execute', 'login'];
const operators = ['admin', '张三', '李四', '王五', '赵六'];

const data = Mock.mock({
  'list|50': [
    {
      'id|+1': 1,
      operatorName: () => operators[Mock.mock('@integer(0, 4)')],
      module: () => modules[Mock.mock('@integer(0, 6)')],
      action: () => actions[Mock.mock('@integer(0, 4)')],
      summary: () => Mock.mock('@csentence(10, 30)'),
      createdTime: () => Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
    },
  ],
});

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/system/logs'), () => {
      return successResponseWrap({
        list: data.list,
        total: data.list.length,
      });
    });
  },
});
