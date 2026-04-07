<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.logs']" />
    <a-card class="general-card" :title="$t('operationLogs.title')">
      <!-- Filter Form -->
      <a-row style="margin-bottom: 16px">
        <a-col :flex="1">
          <a-form
            :model="filterModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="operatorName" :label="$t('operationLogs.form.operatorName')">
                  <a-input
                    v-model="filterModel.operatorName"
                    :placeholder="$t('operationLogs.form.operatorName.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="module" :label="$t('operationLogs.form.module')">
                  <a-select
                    v-model="filterModel.module"
                    :placeholder="$t('operationLogs.form.module.placeholder')"
                    allow-clear
                  >
                    <a-option v-for="m in moduleOptions" :key="m" :value="m">
                      {{ $t(`operationLogs.module.${m}`) }}
                    </a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="dateRange" :label="$t('operationLogs.form.dateRange')">
                  <a-range-picker v-model="filterModel.dateRange" style="width: 100%" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 40px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space :size="18">
            <a-button type="primary" @click="search">
              <template #icon><icon-search /></template>
              {{ $t('operationLogs.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon><icon-refresh /></template>
              {{ $t('operationLogs.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <!-- Table -->
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
          <a-table-column :title="$t('operationLogs.columns.operatorName')" data-index="operatorName" :width="100" />
          <a-table-column :title="$t('operationLogs.columns.module')" :width="110">
            <template #cell="{ record }">
              <a-tag color="arcoblue">{{ $t(`operationLogs.module.${record.module}`) }}</a-tag>
            </template>
          </a-table-column>
          <a-table-column :title="$t('operationLogs.columns.action')" :width="90">
            <template #cell="{ record }">
              <a-tag color="orangered">{{ $t(`operationLogs.action.${record.action}`) }}</a-tag>
            </template>
          </a-table-column>
          <a-table-column :title="$t('operationLogs.columns.summary')" data-index="summary" ellipsis />
          <a-table-column :title="$t('operationLogs.columns.createdTime')" data-index="createdTime" :width="170" />
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts">
export default { name: 'SystemOperationLogs' };
</script>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import useLoading from '@/hooks/loading';

const { loading, setLoading } = useLoading(false);

const moduleOptions = ['user', 'product', 'order', 'pictureBook', 'system', 'migration', 'recommend'];
const renderData = ref<any[]>([]);
const pagination = reactive({ current: 1, pageSize: 10, total: 0 });

const generateFilterModel = () => ({
  operatorName: '',
  module: undefined as string | undefined,
  dateRange: [] as string[],
});
const filterModel = reactive(generateFilterModel());

const fetchData = async () => {
  setLoading(true);
  try {
    const { data: res } = await (await import('axios')).default.get('/api/system/logs');
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

const search = () => {
  pagination.current = 1;
  fetchData();
};

const reset = () => {
  Object.assign(filterModel, generateFilterModel());
  search();
};
</script>

<style scoped>
.container {
  padding: 0 20px 20px 20px;
}
</style>
