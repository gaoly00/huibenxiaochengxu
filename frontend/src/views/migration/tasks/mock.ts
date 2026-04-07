import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const migrationTypes = ['user', 'points', 'invite', 'distribution', 'order'];
const statuses = ['pending', 'running', 'success', 'failed'];

const data = Mock.mock({
  'list|8': [
    {
      'id|+1': 1,
      name: () => Mock.mock('@ctitle(4, 8)'),
      migrationType: () => migrationTypes[Mock.mock('@integer(0, 4)')],
      dataSourceDescription: () => Mock.mock('@cparagraph(1, 2)'),
      status: () => statuses[Mock.mock('@integer(0, 3)')],
      'successCount|0-5000': 1,
      'failCount|0-100': 1,
      createdTime: () => Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
      lastExecuteTime: () => Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
      log: () =>
        `[INFO] 开始执行迁移任务...\n[INFO] 连接数据源成功\n[INFO] 读取数据 ${Mock.mock('@integer(100, 5000)')} 条\n[INFO] 数据校验通过\n[INFO] 写入目标数据库...\n[INFO] 迁移完成`,
    },
  ],
});

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/migration/tasks'), () => {
      return successResponseWrap({
        list: data.list,
        total: data.list.length,
      });
    });
  },
});
