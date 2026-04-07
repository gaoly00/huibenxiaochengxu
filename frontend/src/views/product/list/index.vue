<template>
  <div class="container">
    <Breadcrumb :items="['menu.product', 'menu.product.list']" />
    <a-card class="general-card" :title="$t('productList.title')">
      <!-- Filter Form -->
      <a-row style="margin-bottom: 16px">
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="name" :label="$t('productList.form.name')">
                  <a-input
                    v-model="formModel.name"
                    :placeholder="$t('productList.form.name.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="type" :label="$t('productList.form.type')">
                  <a-select
                    v-model="formModel.type"
                    :placeholder="$t('productList.form.selectDefault')"
                    allow-clear
                  >
                    <a-option value="physical">{{ $t('productList.type.physical') }}</a-option>
                    <a-option value="digital">{{ $t('productList.type.digital') }}</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('productList.form.status')">
                  <a-select
                    v-model="formModel.status"
                    :placeholder="$t('productList.form.selectDefault')"
                    allow-clear
                  >
                    <a-option value="draft">{{ $t('productList.status.draft') }}</a-option>
                    <a-option value="on_sale">{{ $t('productList.status.onSale') }}</a-option>
                    <a-option value="off_sale">{{ $t('productList.status.offSale') }}</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="pictureBookTitle"
                  :label="$t('productList.form.pictureBookTitle')"
                >
                  <a-input
                    v-model="formModel.pictureBookTitle"
                    :placeholder="$t('productList.form.pictureBookTitle.placeholder')"
                  />
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
              {{ $t('productList.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon><icon-refresh /></template>
              {{ $t('productList.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <!-- Toolbar -->
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-button type="primary" @click="handleCreate">
            <template #icon><icon-plus /></template>
            {{ $t('productList.operation.create') }}
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
          <a-table-column :title="$t('productList.columns.coverUrl')" :width="90">
            <template #cell="{ record }">
              <a-image :src="record.coverUrl" width="60" height="60" fit="cover" />
            </template>
          </a-table-column>
          <a-table-column
            :title="$t('productList.columns.name')"
            data-index="name"
            :width="160"
            ellipsis
          />
          <a-table-column :title="$t('productList.columns.type')" :width="100">
            <template #cell="{ record }">
              <a-tag v-if="record.type === 'physical'" color="blue">
                {{ $t('productList.type.physical') }}
              </a-tag>
              <a-tag v-else color="green">
                {{ $t('productList.type.digital') }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column
            :title="$t('productList.columns.price')"
            data-index="price"
            :width="100"
          />
          <a-table-column
            :title="$t('productList.columns.originalPrice')"
            data-index="originalPrice"
            :width="100"
          />
          <a-table-column :title="$t('productList.columns.status')" :width="100">
            <template #cell="{ record }">
              <a-tag v-if="record.status === 'draft'" color="gray">
                {{ $t('productList.status.draft') }}
              </a-tag>
              <a-tag v-else-if="record.status === 'on_sale'" color="green">
                {{ $t('productList.status.onSale') }}
              </a-tag>
              <a-tag v-else color="red">
                {{ $t('productList.status.offSale') }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column
            :title="$t('productList.columns.categoryName')"
            data-index="categoryName"
            :width="120"
          />
          <a-table-column
            :title="$t('productList.columns.pictureBookTitle')"
            data-index="pictureBookTitle"
            :width="140"
            ellipsis
          />
          <a-table-column
            :title="$t('productList.columns.sales')"
            data-index="sales"
            :width="80"
          />
          <a-table-column
            :title="$t('productList.columns.updatedTime')"
            data-index="updatedTime"
            :width="180"
          />
          <a-table-column
            :title="$t('productList.columns.operations')"
            :width="200"
            fixed="right"
          >
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="handleEdit(record)">
                  {{ $t('productList.operation.edit') }}
                </a-button>
                <a-button
                  type="text"
                  size="small"
                  :status="record.status === 'on_sale' ? 'warning' : 'success'"
                  @click="handleToggleStatus(record)"
                >
                  {{
                    record.status === 'on_sale'
                      ? $t('productList.operation.offSale')
                      : $t('productList.operation.onSale')
                  }}
                </a-button>
                <a-popconfirm
                  :content="$t('productList.operation.deleteConfirm')"
                  @ok="handleDelete(record)"
                >
                  <a-button type="text" size="small" status="danger">
                    {{ $t('productList.operation.delete') }}
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import { ProductRecord, ProductParams } from '@/types/product';
  import {
    queryProductList,
    deleteProduct,
    toggleProductStatus,
  } from '@/api/product';
  import Breadcrumb from '@/components/breadcrumb/index.vue';

  const { t } = useI18n();
  const router = useRouter();
  const { loading, setLoading } = useLoading(true);

  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
  };

  const generateFormModel = () => ({
    name: '',
    type: '',
    status: '',
    pictureBookTitle: '',
  });

  const formModel = ref(generateFormModel());
  const renderData = ref<ProductRecord[]>([]);
  const pagination = reactive({ ...basePagination });

  const fetchData = async (
    params: ProductParams = { current: 1, pageSize: basePagination.pageSize }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryProductList(params);
      renderData.value = data.list;
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as ProductParams);
  };

  const reset = () => {
    formModel.value = generateFormModel();
    fetchData({ ...basePagination } as ProductParams);
  };

  const onPageChange = (current: number) => {
    fetchData({
      ...basePagination,
      ...formModel.value,
      current,
    } as unknown as ProductParams);
  };

  const handleCreate = () => {
    router.push({ name: 'ProductCreate' });
  };

  const handleEdit = (record: ProductRecord) => {
    router.push({ name: 'ProductEdit', params: { id: record.id } });
  };

  const handleDelete = async (record: ProductRecord) => {
    try {
      await deleteProduct(record.id);
      Message.success(t('productList.operation.deleteSuccess'));
      fetchData({ ...basePagination, ...formModel.value, current: pagination.current } as unknown as ProductParams);
    } catch (err) {
      // handle error
    }
  };

  const handleToggleStatus = async (record: ProductRecord) => {
    const newStatus = record.status === 'on_sale' ? 'off_sale' : 'on_sale';
    try {
      await toggleProductStatus(record.id, newStatus);
      Message.success(t('productList.operation.statusSuccess'));
      fetchData({ ...basePagination, ...formModel.value, current: pagination.current } as unknown as ProductParams);
    } catch (err) {
      // handle error
    }
  };

  fetchData();
</script>

<script lang="ts">
  export default {
    name: 'ProductList',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
