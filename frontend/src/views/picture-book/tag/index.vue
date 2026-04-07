<template>
  <div class="container">
    <Breadcrumb :items="['menu.pictureBook', 'menu.pictureBook.tags']" />
    <a-card class="general-card" :title="$t('pictureBookTag.title')">
      <!-- Toolbar -->
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-button type="primary" @click="handleCreate">
            <template #icon><icon-plus /></template>
            {{ $t('pictureBookTag.operation.create') }}
          </a-button>
        </a-col>
      </a-row>
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
          <a-table-column title="ID" data-index="id" :width="80" ellipsis />
          <a-table-column
            :title="$t('pictureBookTag.columns.name')"
            data-index="name"
            :width="200"
          />
          <a-table-column
            :title="$t('pictureBookTag.columns.sortOrder')"
            data-index="sortOrder"
            :width="100"
          />
          <a-table-column :title="$t('pictureBookTag.columns.isSmartKeyword')" :width="120">
            <template #cell="{ record }">
              <a-tag v-if="record.isSmartKeyword" color="arcoblue">
                {{ $t('pictureBookTag.yes') }}
              </a-tag>
              <span v-else>{{ $t('pictureBookTag.no') }}</span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('pictureBookTag.columns.status')" :width="100">
            <template #cell="{ record }">
              <a-tag v-if="record.status === 'enabled'" color="green">
                {{ $t('pictureBookTag.status.enabled') }}
              </a-tag>
              <a-tag v-else color="red">
                {{ $t('pictureBookTag.status.disabled') }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column
            :title="$t('pictureBookTag.columns.updatedTime')"
            data-index="updatedTime"
            :width="180"
          />
          <a-table-column :title="$t('pictureBookTag.columns.operations')" :width="200" fixed="right">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="handleEdit(record)">
                  {{ $t('pictureBookTag.operation.edit') }}
                </a-button>
                <a-button type="text" size="small" status="success" @click="handleToggleStatus(record)">
                  {{ record.status === 'enabled' ? $t('pictureBookTag.operation.disable') : $t('pictureBookTag.operation.enable') }}
                </a-button>
                <a-popconfirm
                  :content="$t('pictureBookTag.operation.deleteConfirm')"
                  @ok="handleDelete(record)"
                >
                  <a-button type="text" size="small" status="danger">
                    {{ $t('pictureBookTag.operation.delete') }}
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <!-- Modal Form -->
    <a-modal
      v-model:visible="modalVisible"
      :title="isEditModal ? $t('pictureBookTag.modal.editTitle') : $t('pictureBookTag.modal.createTitle')"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <a-form ref="modalFormRef" :model="modalForm" layout="vertical">
        <a-form-item field="name" :label="$t('pictureBookTag.modal.name')" :rules="[{ required: true, message: $t('pictureBookTag.modal.nameRequired') }]">
          <a-input v-model="modalForm.name" :placeholder="$t('pictureBookTag.modal.namePlaceholder')" />
        </a-form-item>
        <a-form-item field="sortOrder" :label="$t('pictureBookTag.modal.sortOrder')">
          <a-input-number v-model="modalForm.sortOrder" :min="0" />
        </a-form-item>
        <a-form-item field="isSmartKeyword" :label="$t('pictureBookTag.modal.isSmartKeyword')">
          <a-switch v-model="modalForm.isSmartKeyword" />
        </a-form-item>
        <a-form-item field="status" :label="$t('pictureBookTag.modal.status')">
          <a-select v-model="modalForm.status">
            <a-option value="enabled">{{ $t('pictureBookTag.status.enabled') }}</a-option>
            <a-option value="disabled">{{ $t('pictureBookTag.status.disabled') }}</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import { TagRecord, TagParams } from '@/types/picture-book';
  import {
    queryTagList,
    createTag,
    updateTag,
    deleteTag,
  } from '@/api/picture-book';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);

  const basePagination: Pagination = { current: 1, pageSize: 10 };
  const renderData = ref<TagRecord[]>([]);
  const pagination = reactive({ ...basePagination, total: 0 });

  const modalVisible = ref(false);
  const isEditModal = ref(false);
  const editingId = ref('');
  const modalFormRef = ref();
  const modalForm = ref({
    name: '',
    sortOrder: 0,
    isSmartKeyword: false,
    status: 'enabled',
  });

  const fetchData = async (params: TagParams = { current: 1, pageSize: 10 }) => {
    setLoading(true);
    try {
      const { data } = await queryTagList(params);
      renderData.value = data.list;
      pagination.total = data.total;
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (current: number) => {
    pagination.current = current;
    fetchData({ current, pageSize: pagination.pageSize });
  };

  const handleCreate = () => {
    isEditModal.value = false;
    editingId.value = '';
    modalForm.value = { name: '', sortOrder: 0, isSmartKeyword: false, status: 'enabled' };
    modalVisible.value = true;
  };

  const handleEdit = (record: TagRecord) => {
    isEditModal.value = true;
    editingId.value = record.id;
    modalForm.value = {
      name: record.name,
      sortOrder: record.sortOrder,
      isSmartKeyword: record.isSmartKeyword,
      status: record.status,
    };
    modalVisible.value = true;
  };

  const handleModalOk = async () => {
    try {
      if (isEditModal.value) {
        await updateTag(editingId.value, modalForm.value);
      } else {
        await createTag(modalForm.value);
      }
      Message.success(t('pictureBookTag.operation.saveSuccess'));
      modalVisible.value = false;
      fetchData({ current: pagination.current, pageSize: pagination.pageSize });
    } catch (e) {
      // ignore
    }
  };

  const handleModalCancel = () => {
    modalVisible.value = false;
  };

  const handleDelete = async (record: TagRecord) => {
    try {
      await deleteTag(record.id);
      Message.success(t('pictureBookTag.operation.deleteSuccess'));
      fetchData({ current: pagination.current, pageSize: pagination.pageSize });
    } catch (e) {
      // ignore
    }
  };

  const handleToggleStatus = async (record: TagRecord) => {
    const newStatus = record.status === 'enabled' ? 'disabled' : 'enabled';
    try {
      await updateTag(record.id, { ...record, status: newStatus as any });
      Message.success(t('pictureBookTag.operation.statusSuccess'));
      fetchData({ current: pagination.current, pageSize: pagination.pageSize });
    } catch (e) {
      // ignore
    }
  };

  fetchData();
</script>

<script lang="ts">
  export default {
    name: 'PictureBookTags',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
