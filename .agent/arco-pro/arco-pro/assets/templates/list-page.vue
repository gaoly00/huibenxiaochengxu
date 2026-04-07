<template>
  <div class="container">
    <Breadcrumb :items="['menu.module', 'menu.module.list']" />
    <a-card class="general-card" :title="$t('menu.module.list')">
      <!-- 搜索区域 -->
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="searchForm"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item :label="$t('module.columns.name')" field="name">
                  <a-input
                    v-model="searchForm.name"
                    :placeholder="$t('module.placeholder.name')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item :label="$t('module.columns.status')" field="status">
                  <a-select
                    v-model="searchForm.status"
                    :placeholder="$t('module.placeholder.status')"
                    allow-clear
                  >
                    <a-option value="active">{{ $t('module.status.active') }}</a-option>
                    <a-option value="inactive">{{ $t('module.status.inactive') }}</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item :label="$t('module.columns.createdAt')" field="dateRange">
                  <a-range-picker
                    v-model="searchForm.dateRange"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="handleSearch">
              <template #icon><icon-search /></template>
              {{ $t('module.operation.search') }}
            </a-button>
            <a-button @click="handleReset">
              <template #icon><icon-refresh /></template>
              {{ $t('module.operation.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>

      <!-- 工具栏 -->
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleCreate">
              <template #icon><icon-plus /></template>
              {{ $t('module.operation.create') }}
            </a-button>
            <a-button
              status="danger"
              :disabled="!selectedKeys.length"
              @click="handleBatchDelete"
            >
              <template #icon><icon-delete /></template>
              {{ $t('module.operation.batchDelete') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="12" style="text-align: right">
          <a-button @click="fetchData">
            <template #icon><icon-refresh /></template>
            {{ $t('module.operation.refresh') }}
          </a-button>
        </a-col>
      </a-row>

      <!-- 表格 -->
      <a-table
        ref="tableRef"
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="columns"
        :data="tableData"
        :row-selection="rowSelection"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      >
        <!-- 状态列 -->
        <template #status="{ record }">
          <a-tag :color="getStatusColor(record.status)">
            {{ $t(`module.status.${record.status}`) }}
          </a-tag>
        </template>

        <!-- 操作列 -->
        <template #operations="{ record }">
          <a-space>
            <a-button type="text" size="small" @click="handleView(record)">
              {{ $t('module.operation.view') }}
            </a-button>
            <a-button type="text" size="small" @click="handleEdit(record)">
              {{ $t('module.operation.edit') }}
            </a-button>
            <a-popconfirm
              :content="$t('module.message.deleteConfirm')"
              @ok="handleDelete(record)"
            >
              <a-button type="text" size="small" status="danger">
                {{ $t('module.operation.delete') }}
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import type { TableColumnData } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';
import Breadcrumb from '@/components/breadcrumb/index.vue';
import {
  getModuleList,
  deleteModule,
  batchDeleteModules,
} from '@/api/module';
import type { ModuleRecord, ModuleQuery } from '@/types/module';

const router = useRouter();
const { t } = useI18n();

// 状态
const loading = ref(false);
const tableData = ref<ModuleRecord[]>([]);
const selectedKeys = ref<number[]>([]);

// 搜索表单
const searchForm = reactive<ModuleQuery>({
  page: 1,
  pageSize: 10,
  name: '',
  status: '',
  dateRange: [],
});

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: true,
  showPageSize: true,
  pageSizeOptions: [10, 20, 50, 100],
});

// 行选择配置
const rowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  selectedRowKeys: selectedKeys,
  onlyCurrent: false,
});

// 表格列
const columns = computed<TableColumnData[]>(() => [
  {
    title: t('module.columns.id'),
    dataIndex: 'id',
    width: 80,
    align: 'center',
  },
  {
    title: t('module.columns.name'),
    dataIndex: 'name',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t('module.columns.status'),
    dataIndex: 'status',
    slotName: 'status',
    width: 100,
    align: 'center',
  },
  {
    title: t('module.columns.createdAt'),
    dataIndex: 'created_at',
    width: 180,
  },
  {
    title: t('module.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
    width: 200,
    align: 'center',
    fixed: 'right',
  },
]);

// 获取状态颜色
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    active: 'green',
    inactive: 'gray',
    banned: 'red',
  };
  return colorMap[status] || 'blue';
};

// 获取数据
const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getModuleList(searchForm);
    tableData.value = res.data.list;
    pagination.total = res.data.total;
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  searchForm.page = 1;
  pagination.current = 1;
  fetchData();
};

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    page: 1,
    pageSize: 10,
    name: '',
    status: '',
    dateRange: [],
  });
  pagination.current = 1;
  fetchData();
};

// 分页变化
const handlePageChange = (page: number) => {
  searchForm.page = page;
  pagination.current = page;
  fetchData();
};

const handlePageSizeChange = (pageSize: number) => {
  searchForm.page = 1;
  searchForm.pageSize = pageSize;
  pagination.current = 1;
  pagination.pageSize = pageSize;
  fetchData();
};

// 新建
const handleCreate = () => {
  router.push({ name: 'ModuleCreate' });
};

// 查看
const handleView = (record: ModuleRecord) => {
  router.push({ name: 'ModuleDetail', params: { id: record.id } });
};

// 编辑
const handleEdit = (record: ModuleRecord) => {
  router.push({ name: 'ModuleEdit', params: { id: record.id } });
};

// 删除
const handleDelete = async (record: ModuleRecord) => {
  try {
    await deleteModule(record.id);
    Message.success(t('module.message.deleteSuccess'));
    fetchData();
  } catch (error) {
    // 错误由拦截器处理
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (!selectedKeys.value.length) return;

  try {
    await batchDeleteModules(selectedKeys.value);
    Message.success(t('module.message.deleteBatchSuccess'));
    selectedKeys.value = [];
    fetchData();
  } catch (error) {
    // 错误由拦截器处理
  }
};

// 初始化
fetchData();
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

.general-card {
  min-height: 400px;
}
</style>
