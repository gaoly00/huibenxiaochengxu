<template>
  <div class="container">
    <Breadcrumb :items="['menu.smartRecommend', 'menu.smartRecommend.templates']" />
    <a-card class="general-card" :title="$t('templates.title')">
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-button type="primary" @click="handleCreate">
            <template #icon><icon-plus /></template>
            {{ $t('templates.operation.create') }}
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
          <a-table-column :title="$t('templates.columns.name')" data-index="name" :width="160" />
          <a-table-column :title="$t('templates.columns.content')" data-index="content" ellipsis :width="280" />
          <a-table-column :title="$t('templates.columns.status')" :width="90">
            <template #cell="{ record }">
              <a-tag :color="record.status === 'enabled' ? 'green' : 'gray'">
                {{ record.status === 'enabled' ? $t('templates.status.enabled') : $t('templates.status.disabled') }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column :title="$t('templates.columns.updatedTime')" data-index="updatedTime" :width="170" />
          <a-table-column :title="$t('templates.columns.operations')" :width="150" fixed="right">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="handleEdit(record)">
                  {{ $t('templates.operation.edit') }}
                </a-button>
                <a-popconfirm :content="$t('templates.operation.delete.confirm')" @ok="handleDelete(record)">
                  <a-button type="text" status="danger" size="small">
                    {{ $t('templates.operation.delete') }}
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model:visible="modalVisible"
      :title="isEdit ? $t('templates.modal.title.edit') : $t('templates.modal.title.create')"
      @ok="handleModalOk"
      @cancel="modalVisible = false"
    >
      <a-form :model="formModel" layout="vertical">
        <a-form-item field="name" :label="$t('templates.form.name')">
          <a-input v-model="formModel.name" :placeholder="$t('templates.form.name.placeholder')" />
        </a-form-item>
        <a-form-item field="content" :label="$t('templates.form.content')">
          <a-textarea v-model="formModel.content" :placeholder="$t('templates.form.content.placeholder')" :auto-size="{ minRows: 3, maxRows: 6 }" />
        </a-form-item>
        <a-form-item field="status" :label="$t('templates.form.status')">
          <a-select v-model="formModel.status" :placeholder="$t('templates.form.status.placeholder')">
            <a-option value="enabled">{{ $t('templates.status.enabled') }}</a-option>
            <a-option value="disabled">{{ $t('templates.status.disabled') }}</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
export default { name: 'SmartRecommendTemplates' };
</script>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { Message } from '@arco-design/web-vue';
import useLoading from '@/hooks/loading';

const { loading, setLoading } = useLoading(false);
const renderData = ref<any[]>([]);
const pagination = reactive({ current: 1, pageSize: 10, total: 0 });
const modalVisible = ref(false);
const isEdit = ref(false);
const editingId = ref<number | null>(null);

const generateFormModel = () => ({
  name: '',
  content: '',
  status: 'enabled',
});
const formModel = reactive(generateFormModel());

const fetchData = async () => {
  setLoading(true);
  try {
    const { data: res } = await (await import('axios')).default.get('/api/smart-recommend/templates');
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

const resetForm = () => {
  Object.assign(formModel, generateFormModel());
};

const handleCreate = () => {
  resetForm();
  isEdit.value = false;
  editingId.value = null;
  modalVisible.value = true;
};

const handleEdit = (record: any) => {
  isEdit.value = true;
  editingId.value = record.id;
  Object.assign(formModel, {
    name: record.name,
    content: record.content,
    status: record.status,
  });
  modalVisible.value = true;
};

const handleDelete = (record: any) => {
  renderData.value = renderData.value.filter((item) => item.id !== record.id);
  Message.success('删除成功');
};

const handleModalOk = () => {
  if (isEdit.value && editingId.value !== null) {
    const idx = renderData.value.findIndex((item) => item.id === editingId.value);
    if (idx !== -1) {
      renderData.value[idx] = { ...renderData.value[idx], ...formModel };
    }
    Message.success('编辑成功');
  } else {
    renderData.value.unshift({
      id: Date.now(),
      ...formModel,
      updatedTime: new Date().toLocaleString(),
    });
    pagination.total += 1;
    Message.success('创建成功');
  }
  modalVisible.value = false;
};
</script>

<style scoped>
.container {
  padding: 0 20px 20px 20px;
}
</style>
