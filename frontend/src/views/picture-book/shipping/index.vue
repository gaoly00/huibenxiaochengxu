<template>
  <div class="container">
    <Breadcrumb :items="['menu.pictureBook', 'menu.pictureBook.shippingTemplates']" />
    <a-card class="general-card" :title="$t('shippingTemplate.title')">
      <!-- Toolbar -->
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-button type="primary" @click="handleCreate">
            <template #icon><icon-plus /></template>
            {{ $t('shippingTemplate.operation.create') }}
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
            :title="$t('shippingTemplate.columns.name')"
            data-index="name"
            :width="160"
          />
          <a-table-column
            :title="$t('shippingTemplate.columns.chargeDescription')"
            data-index="chargeDescription"
            :width="200"
            ellipsis
          />
          <a-table-column
            :title="$t('shippingTemplate.columns.freeShippingRule')"
            data-index="freeShippingRule"
            :width="200"
            ellipsis
          />
          <a-table-column :title="$t('shippingTemplate.columns.status')" :width="100">
            <template #cell="{ record }">
              <a-tag v-if="record.status === 'enabled'" color="green">
                {{ $t('shippingTemplate.status.enabled') }}
              </a-tag>
              <a-tag v-else color="gray">
                {{ $t('shippingTemplate.status.disabled') }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column
            :title="$t('shippingTemplate.columns.updatedTime')"
            data-index="updatedTime"
            :width="180"
          />
          <a-table-column
            :title="$t('shippingTemplate.columns.operations')"
            :width="200"
            fixed="right"
          >
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="handleEdit(record)">
                  {{ $t('shippingTemplate.operation.edit') }}
                </a-button>
                <a-button
                  type="text"
                  size="small"
                  :status="record.status === 'enabled' ? 'warning' : 'success'"
                  @click="handleToggleStatus(record)"
                >
                  {{
                    record.status === 'enabled'
                      ? $t('shippingTemplate.operation.disable')
                      : $t('shippingTemplate.operation.enable')
                  }}
                </a-button>
                <a-popconfirm
                  :content="$t('shippingTemplate.operation.deleteConfirm')"
                  @ok="handleDelete(record)"
                >
                  <a-button type="text" size="small" status="danger">
                    {{ $t('shippingTemplate.operation.delete') }}
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
      :title="isModalEdit ? $t('shippingTemplate.modal.editTitle') : $t('shippingTemplate.modal.createTitle')"
      :ok-loading="submitLoading"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <a-form ref="modalFormRef" :model="modalForm" layout="vertical">
        <a-form-item
          field="name"
          :label="$t('shippingTemplate.modal.name')"
          :rules="[{ required: true, message: $t('shippingTemplate.modal.nameRequired') }]"
        >
          <a-input v-model="modalForm.name" :placeholder="$t('shippingTemplate.modal.namePlaceholder')" />
        </a-form-item>
        <a-form-item
          field="chargeDescription"
          :label="$t('shippingTemplate.modal.chargeDescription')"
        >
          <a-textarea
            v-model="modalForm.chargeDescription"
            :placeholder="$t('shippingTemplate.modal.chargeDescriptionPlaceholder')"
            :auto-size="{ minRows: 2, maxRows: 4 }"
          />
        </a-form-item>
        <a-form-item
          field="freeShippingRule"
          :label="$t('shippingTemplate.modal.freeShippingRule')"
        >
          <a-textarea
            v-model="modalForm.freeShippingRule"
            :placeholder="$t('shippingTemplate.modal.freeShippingRulePlaceholder')"
            :auto-size="{ minRows: 2, maxRows: 4 }"
          />
        </a-form-item>
        <a-form-item field="status" :label="$t('shippingTemplate.modal.status')">
          <a-select v-model="modalForm.status">
            <a-option value="enabled">{{ $t('shippingTemplate.status.enabled') }}</a-option>
            <a-option value="disabled">{{ $t('shippingTemplate.status.disabled') }}</a-option>
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
  import { ShippingTemplateRecord } from '@/types/picture-book';
  import {
    queryShippingTemplateList,
    createShippingTemplate,
    updateShippingTemplate,
    deleteShippingTemplate,
  } from '@/api/picture-book';
  import Breadcrumb from '@/components/breadcrumb/index.vue';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const submitLoading = ref(false);
  const modalFormRef = ref();

  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
  };

  const renderData = ref<ShippingTemplateRecord[]>([]);
  const pagination = reactive({ ...basePagination });
  const modalVisible = ref(false);
  const isModalEdit = ref(false);
  const editingId = ref('');

  const generateModalForm = () => ({
    name: '',
    chargeDescription: '',
    freeShippingRule: '',
    status: 'enabled',
  });

  const modalForm = ref(generateModalForm());

  const fetchData = async (
    params = { current: 1, pageSize: basePagination.pageSize }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryShippingTemplateList(params);
      renderData.value = data.list;
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current });
  };

  const handleCreate = () => {
    isModalEdit.value = false;
    editingId.value = '';
    modalForm.value = generateModalForm();
    modalVisible.value = true;
  };

  const handleEdit = (record: ShippingTemplateRecord) => {
    isModalEdit.value = true;
    editingId.value = record.id;
    modalForm.value = {
      name: record.name,
      chargeDescription: record.chargeDescription,
      freeShippingRule: record.freeShippingRule,
      status: record.status,
    };
    modalVisible.value = true;
  };

  const handleModalOk = async () => {
    const res = await modalFormRef.value?.validate();
    if (res) return;
    submitLoading.value = true;
    try {
      if (isModalEdit.value) {
        await updateShippingTemplate(editingId.value, modalForm.value);
      } else {
        await createShippingTemplate(modalForm.value);
      }
      Message.success(t('shippingTemplate.operation.saveSuccess'));
      modalVisible.value = false;
      fetchData({ ...basePagination, current: pagination.current });
    } catch (err) {
      // handle error
    } finally {
      submitLoading.value = false;
    }
  };

  const handleModalCancel = () => {
    modalVisible.value = false;
  };

  const handleDelete = async (record: ShippingTemplateRecord) => {
    try {
      await deleteShippingTemplate(record.id);
      Message.success(t('shippingTemplate.operation.deleteSuccess'));
      fetchData({ ...basePagination, current: pagination.current });
    } catch (err) {
      // handle error
    }
  };

  const handleToggleStatus = async (record: ShippingTemplateRecord) => {
    const newStatus = record.status === 'enabled' ? 'disabled' : 'enabled';
    try {
      await updateShippingTemplate(record.id, { ...record, status: newStatus as any });
      Message.success(t('shippingTemplate.operation.statusSuccess'));
      fetchData({ ...basePagination, current: pagination.current });
    } catch (err) {
      // handle error
    }
  };

  fetchData();
</script>

<script lang="ts">
  export default {
    name: 'ShippingTemplates',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
