<template>
  <div class="container">
    <Breadcrumb :items="['menu.smartRecommend', 'menu.smartRecommend.keywords']" />
    <a-card class="general-card" :title="$t('keywords.title')">
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-button type="primary" @click="handleCreate">
            <template #icon><icon-plus /></template>
            {{ $t('keywords.operation.create') }}
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
          <a-table-column :title="$t('keywords.columns.keyword')" data-index="keyword" :width="120" />
          <a-table-column :title="$t('keywords.columns.mappedCategories')" :width="180">
            <template #cell="{ record }">
              <a-space wrap>
                <a-tag v-for="c in record.mappedCategories" :key="c" color="arcoblue">{{ c }}</a-tag>
              </a-space>
            </template>
          </a-table-column>
          <a-table-column :title="$t('keywords.columns.mappedTags')" :width="180">
            <template #cell="{ record }">
              <a-space wrap>
                <a-tag v-for="t in record.mappedTags" :key="t" color="green">{{ t }}</a-tag>
              </a-space>
            </template>
          </a-table-column>
          <a-table-column :title="$t('keywords.columns.recommendTemplateName')" data-index="recommendTemplateName" :width="140" />
          <a-table-column :title="$t('keywords.columns.weight')" data-index="weight" :width="80" />
          <a-table-column :title="$t('keywords.columns.status')" :width="90">
            <template #cell="{ record }">
              <a-tag :color="record.status === 'enabled' ? 'green' : 'gray'">
                {{ record.status === 'enabled' ? $t('keywords.status.enabled') : $t('keywords.status.disabled') }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column :title="$t('keywords.columns.updatedTime')" data-index="updatedTime" :width="170" />
          <a-table-column :title="$t('keywords.columns.operations')" :width="150" fixed="right">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="handleEdit(record)">
                  {{ $t('keywords.operation.edit') }}
                </a-button>
                <a-popconfirm :content="$t('keywords.operation.delete.confirm')" @ok="handleDelete(record)">
                  <a-button type="text" status="danger" size="small">
                    {{ $t('keywords.operation.delete') }}
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    <!-- Modal -->
    <a-modal
      v-model:visible="modalVisible"
      :title="isEdit ? $t('keywords.modal.title.edit') : $t('keywords.modal.title.create')"
      @ok="handleModalOk"
      @cancel="modalVisible = false"
    >
      <a-form :model="formModel" layout="vertical">
        <a-form-item field="keyword" :label="$t('keywords.form.keyword')">
          <a-input v-model="formModel.keyword" :placeholder="$t('keywords.form.keyword.placeholder')" />
        </a-form-item>
        <a-form-item field="mappedCategories" :label="$t('keywords.form.mappedCategories')">
          <a-select v-model="formModel.mappedCategories" :placeholder="$t('keywords.form.mappedCategories.placeholder')" multiple allow-clear>
            <a-option v-for="c in categoryOptions" :key="c" :value="c">{{ c }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="mappedTags" :label="$t('keywords.form.mappedTags')">
          <a-select v-model="formModel.mappedTags" :placeholder="$t('keywords.form.mappedTags.placeholder')" multiple allow-clear>
            <a-option v-for="t in tagOptions" :key="t" :value="t">{{ t }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="recommendTemplateId" :label="$t('keywords.form.recommendTemplateId')">
          <a-select v-model="formModel.recommendTemplateId" :placeholder="$t('keywords.form.recommendTemplateId.placeholder')" allow-clear>
            <a-option v-for="tpl in templateOptions" :key="tpl.id" :value="tpl.id">{{ tpl.name }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="weight" :label="$t('keywords.form.weight')">
          <a-input-number v-model="formModel.weight" :min="1" :max="100" />
        </a-form-item>
        <a-form-item field="status" :label="$t('keywords.form.status')">
          <a-select v-model="formModel.status" :placeholder="$t('keywords.form.status.placeholder')">
            <a-option value="enabled">{{ $t('keywords.status.enabled') }}</a-option>
            <a-option value="disabled">{{ $t('keywords.status.disabled') }}</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
export default { name: 'SmartRecommendKeywords' };
</script>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { Message } from '@arco-design/web-vue';
import useLoading from '@/hooks/loading';

const { loading, setLoading } = useLoading(false);

const categoryOptions = ['绘本', '故事书', '科普', '艺术', '启蒙'];
const tagOptions = ['热门', '新品', '经典', '畅销', '推荐', '限时'];
const templateOptions = [
  { id: 101, name: '默认推荐' },
  { id: 102, name: '首页推荐' },
  { id: 103, name: '分类推荐' },
  { id: 104, name: '搜索推荐' },
  { id: 105, name: '个性化推荐' },
];

const renderData = ref<any[]>([]);
const pagination = reactive({ current: 1, pageSize: 10, total: 0 });
const modalVisible = ref(false);
const isEdit = ref(false);
const editingId = ref<number | null>(null);

const generateFormModel = () => ({
  keyword: '',
  mappedCategories: [] as string[],
  mappedTags: [] as string[],
  recommendTemplateId: undefined as number | undefined,
  weight: 50,
  status: 'enabled',
});
const formModel = reactive(generateFormModel());

const fetchData = async () => {
  setLoading(true);
  try {
    const { data: res } = await (await import('axios')).default.get('/api/smart-recommend/keywords');
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
    keyword: record.keyword,
    mappedCategories: [...record.mappedCategories],
    mappedTags: [...record.mappedTags],
    recommendTemplateId: record.recommendTemplateId,
    weight: record.weight,
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
      recommendTemplateName:
        templateOptions.find((t) => t.id === formModel.recommendTemplateId)?.name || '',
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
