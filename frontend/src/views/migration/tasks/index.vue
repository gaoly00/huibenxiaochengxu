<template>
  <div class="container">
    <Breadcrumb :items="['menu.migration', 'menu.migration.tasks']" />
    <a-card class="general-card" :title="$t('migrationTasks.title')">
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-button type="primary" @click="handleCreate">
            <template #icon><icon-plus /></template>
            {{ $t('migrationTasks.operation.create') }}
          </a-button>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :data="renderData"
        :pagination="pagination"
        :bordered="false"
        @page-change="onPageChange"
      >
        <template #columns>
          <a-table-column title="ID" data-index="id" :width="60" />
          <a-table-column :title="$t('migrationTasks.columns.name')" data-index="name" :width="150" />
          <a-table-column :title="$t('migrationTasks.columns.migrationType')" :width="100">
            <template #cell="{ record }">
              <a-tag>{{ $t(`migrationTasks.type.${record.migrationType}`) }}</a-tag>
            </template>
          </a-table-column>
          <a-table-column :title="$t('migrationTasks.columns.dataSourceDescription')" data-index="dataSourceDescription" ellipsis :width="180" />
          <a-table-column :title="$t('migrationTasks.columns.status')" :width="100">
            <template #cell="{ record }">
              <a-tag :color="statusColorMap[record.status]">
                {{ $t(`migrationTasks.status.${record.status}`) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column :title="$t('migrationTasks.columns.successCount')" data-index="successCount" :width="90" />
          <a-table-column :title="$t('migrationTasks.columns.failCount')" data-index="failCount" :width="90" />
          <a-table-column :title="$t('migrationTasks.columns.createdTime')" data-index="createdTime" :width="170" />
          <a-table-column :title="$t('migrationTasks.columns.lastExecuteTime')" data-index="lastExecuteTime" :width="170" />
          <a-table-column :title="$t('migrationTasks.columns.operations')" :width="160" fixed="right">
            <template #cell="{ record }">
              <a-space>
                <a-popconfirm :content="$t('migrationTasks.operation.execute.confirm')" @ok="handleExecute(record)">
                  <a-button type="text" size="small">
                    {{ $t('migrationTasks.operation.execute') }}
                  </a-button>
                </a-popconfirm>
                <a-button type="text" size="small" @click="handleViewLog(record)">
                  {{ $t('migrationTasks.operation.viewLog') }}
                </a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    <!-- Create Modal -->
    <a-modal
      v-model:visible="modalVisible"
      :title="$t('migrationTasks.modal.title.create')"
      @ok="handleModalOk"
      @cancel="modalVisible = false"
    >
      <a-form :model="formModel" layout="vertical">
        <a-form-item field="name" :label="$t('migrationTasks.form.name')">
          <a-input v-model="formModel.name" :placeholder="$t('migrationTasks.form.name.placeholder')" />
        </a-form-item>
        <a-form-item field="migrationType" :label="$t('migrationTasks.form.migrationType')">
          <a-select v-model="formModel.migrationType" :placeholder="$t('migrationTasks.form.migrationType.placeholder')">
            <a-option value="user">{{ $t('migrationTasks.type.user') }}</a-option>
            <a-option value="points">{{ $t('migrationTasks.type.points') }}</a-option>
            <a-option value="invite">{{ $t('migrationTasks.type.invite') }}</a-option>
            <a-option value="distribution">{{ $t('migrationTasks.type.distribution') }}</a-option>
            <a-option value="order">{{ $t('migrationTasks.type.order') }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="dataSourceDescription" :label="$t('migrationTasks.form.dataSourceDescription')">
          <a-textarea v-model="formModel.dataSourceDescription" :placeholder="$t('migrationTasks.form.dataSourceDescription.placeholder')" :auto-size="{ minRows: 3, maxRows: 6 }" />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- Log Drawer -->
    <a-drawer
      v-model:visible="drawerVisible"
      :title="$t('migrationTasks.drawer.title')"
      :width="520"
    >
      <pre style="white-space: pre-wrap; word-break: break-all;">{{ currentLog }}</pre>
    </a-drawer>
  </div>
</template>

<script lang="ts">
export default { name: 'MigrationTasks' };
</script>
<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { Message } from '@arco-design/web-vue';
import useLoading from '@/hooks/loading';

const { loading, setLoading } = useLoading(false);

const statusColorMap: Record<string, string> = {
  pending: 'gray',
  running: 'blue',
  success: 'green',
  failed: 'red',
};

const renderData = ref<any[]>([]);
const pagination = reactive({ current: 1, pageSize: 10, total: 0 });
const modalVisible = ref(false);
const drawerVisible = ref(false);
const currentLog = ref('');

const generateFormModel = () => ({
  name: '',
  migrationType: undefined as string | undefined,
  dataSourceDescription: '',
});
const formModel = reactive(generateFormModel());

const fetchData = async () => {
  setLoading(true);
  try {
    const { data: res } = await (await import('axios')).default.get('/api/migration/tasks');
    renderData.value = res.data.list || [];
    pagination.total = res.data.total || 0;
  } finally {
    setLoading(false);
  }
};
fetchData();

const onPageChange = (page: number) => {
  pagination.current = page;
  fetchData();
};

const handleCreate = () => {
  Object.assign(formModel, generateFormModel());
  modalVisible.value = true;
};

const handleExecute = (record: any) => {
  record.status = 'running';
  Message.success('任务已开始执行');
};

const handleViewLog = (record: any) => {
  currentLog.value = record.log || '暂无日志';
  drawerVisible.value = true;
};

const handleModalOk = () => {
  renderData.value.unshift({
    id: Date.now(),
    ...formModel,
    status: 'pending',
    successCount: 0,
    failCount: 0,
    createdTime: new Date().toLocaleString(),
    lastExecuteTime: '-',
    log: '',
  });
  pagination.total += 1;
  modalVisible.value = false;
  Message.success('创建成功');
};
</script>

<style scoped>
.container {
  padding: 0 20px 20px 20px;
}
</style>
