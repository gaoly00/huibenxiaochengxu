<template>
  <div class="container">
    <Breadcrumb :items="['menu.pictureBook', 'menu.pictureBook.list']" />
    <a-card class="general-card" :title="$t('pictureBookList.title')">
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
                <a-form-item field="title" :label="$t('pictureBookList.form.title')">
                  <a-input
                    v-model="formModel.title"
                    :placeholder="$t('pictureBookList.form.title.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="categoryId" :label="$t('pictureBookList.form.category')">
                  <a-select
                    v-model="formModel.categoryId"
                    :placeholder="$t('pictureBookList.form.selectDefault')"
                    allow-clear
                  >
                    <a-option v-for="c in categoryOptions" :key="c.id" :value="c.id">
                      {{ c.name }}
                    </a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('pictureBookList.form.status')">
                  <a-select
                    v-model="formModel.status"
                    :placeholder="$t('pictureBookList.form.selectDefault')"
                    allow-clear
                  >
                    <a-option value="draft">{{ $t('pictureBookList.status.draft') }}</a-option>
                    <a-option value="published">{{ $t('pictureBookList.status.published') }}</a-option>
                    <a-option value="offline">{{ $t('pictureBookList.status.offline') }}</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="pdfConvertStatus" :label="$t('pictureBookList.form.pdfConvertStatus')">
                  <a-select
                    v-model="formModel.pdfConvertStatus"
                    :placeholder="$t('pictureBookList.form.selectDefault')"
                    allow-clear
                  >
                    <a-option value="not_uploaded">{{ $t('pictureBookList.pdfStatus.notUploaded') }}</a-option>
                    <a-option value="pending">{{ $t('pictureBookList.pdfStatus.pending') }}</a-option>
                    <a-option value="converting">{{ $t('pictureBookList.pdfStatus.converting') }}</a-option>
                    <a-option value="success">{{ $t('pictureBookList.pdfStatus.success') }}</a-option>
                    <a-option value="failed">{{ $t('pictureBookList.pdfStatus.failed') }}</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="isHomepageRecommend" :label="$t('pictureBookList.form.isHomepageRecommend')">
                  <a-select
                    v-model="formModel.isHomepageRecommend"
                    :placeholder="$t('pictureBookList.form.selectDefault')"
                    allow-clear
                  >
                    <a-option :value="true">{{ $t('pictureBookList.yes') }}</a-option>
                    <a-option :value="false">{{ $t('pictureBookList.no') }}</a-option>
                  </a-select>
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
              {{ $t('pictureBookList.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon><icon-refresh /></template>
              {{ $t('pictureBookList.form.reset') }}
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
            {{ $t('pictureBookList.operation.create') }}
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
          <a-table-column :title="$t('pictureBookList.columns.coverUrl')" :width="100">
            <template #cell="{ record }">
              <a-image :src="record.coverUrl" width="60" height="80" fit="cover" />
            </template>
          </a-table-column>
          <a-table-column
            :title="$t('pictureBookList.columns.title')"
            data-index="title"
            :width="160"
            ellipsis
          />
          <a-table-column
            :title="$t('pictureBookList.columns.categoryName')"
            data-index="categoryName"
            :width="120"
          />
          <a-table-column :title="$t('pictureBookList.columns.tags')" :width="180">
            <template #cell="{ record }">
              <a-space wrap>
                <a-tag v-for="tag in record.tags" :key="tag" size="small">{{ tag }}</a-tag>
              </a-space>
            </template>
          </a-table-column>
          <a-table-column :title="$t('pictureBookList.columns.status')" :width="100">
            <template #cell="{ record }">
              <a-tag v-if="record.status === 'draft'" color="gray">{{ $t('pictureBookList.status.draft') }}</a-tag>
              <a-tag v-else-if="record.status === 'published'" color="green">{{ $t('pictureBookList.status.published') }}</a-tag>
              <a-tag v-else color="red">{{ $t('pictureBookList.status.offline') }}</a-tag>
            </template>
          </a-table-column>
          <a-table-column :title="$t('pictureBookList.columns.isHomepageRecommend')" :width="120">
            <template #cell="{ record }">
              {{ record.isHomepageRecommend ? $t('pictureBookList.yes') : $t('pictureBookList.no') }}
            </template>
          </a-table-column>
          <a-table-column
            :title="$t('pictureBookList.columns.salesCount')"
            data-index="salesCount"
            :width="80"
          />
          <a-table-column :title="$t('pictureBookList.columns.pdfConvertStatus')" :width="120">
            <template #cell="{ record }">
              <a-tag v-if="record.pdfConvertStatus === 'success'" color="green">{{ $t('pictureBookList.pdfStatus.success') }}</a-tag>
              <a-tag v-else-if="record.pdfConvertStatus === 'failed'" color="red">{{ $t('pictureBookList.pdfStatus.failed') }}</a-tag>
              <a-tag v-else-if="record.pdfConvertStatus === 'converting'" color="blue">{{ $t('pictureBookList.pdfStatus.converting') }}</a-tag>
              <a-tag v-else-if="record.pdfConvertStatus === 'pending'" color="orange">{{ $t('pictureBookList.pdfStatus.pending') }}</a-tag>
              <a-tag v-else color="gray">{{ $t('pictureBookList.pdfStatus.notUploaded') }}</a-tag>
            </template>
          </a-table-column>
          <a-table-column
            :title="$t('pictureBookList.columns.updatedTime')"
            data-index="updatedTime"
            :width="180"
          />
          <a-table-column :title="$t('pictureBookList.columns.operations')" :width="200" fixed="right">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="handleEdit(record)">
                  {{ $t('pictureBookList.operation.edit') }}
                </a-button>
                <a-button type="text" size="small" status="success" @click="handleToggleStatus(record)">
                  {{ record.status === 'published' ? $t('pictureBookList.operation.offline') : $t('pictureBookList.operation.publish') }}
                </a-button>
                <a-popconfirm
                  :content="$t('pictureBookList.operation.deleteConfirm')"
                  @ok="handleDelete(record)"
                >
                  <a-button type="text" size="small" status="danger">
                    {{ $t('pictureBookList.operation.delete') }}
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
  import { PictureBookRecord, PictureBookParams } from '@/types/picture-book';
  import {
    queryPictureBookList,
    deletePictureBook,
    togglePictureBookStatus,
  } from '@/api/picture-book';
  import { queryCategoryList } from '@/api/picture-book';

  const { t } = useI18n();
  const router = useRouter();
  const { loading, setLoading } = useLoading(true);

  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
  };

  const generateFormModel = () => ({
    title: '',
    categoryId: '',
    status: '',
    pdfConvertStatus: '',
    isHomepageRecommend: undefined as boolean | undefined,
  });

  const formModel = ref(generateFormModel());
  const renderData = ref<PictureBookRecord[]>([]);
  const pagination = reactive({ ...basePagination, total: 0 });
  const categoryOptions = ref<{ id: string; name: string }[]>([]);

  const fetchData = async (params: PictureBookParams = { current: 1, pageSize: 10 }) => {
    setLoading(true);
    try {
      const { data } = await queryPictureBookList(params);
      renderData.value = data.list;
      pagination.total = data.total;
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await queryCategoryList({ current: 1, pageSize: 100 });
      categoryOptions.value = data.list.map((c) => ({ id: c.id, name: c.name }));
    } catch (e) {
      // ignore
    }
  };

  const search = () => {
    pagination.current = basePagination.current;
    fetchData({
      ...formModel.value,
      current: pagination.current,
      pageSize: pagination.pageSize,
    } as unknown as PictureBookParams);
  };

  const reset = () => {
    formModel.value = generateFormModel();
    pagination.current = basePagination.current;
    fetchData({ current: pagination.current, pageSize: pagination.pageSize });
  };

  const onPageChange = (current: number) => {
    pagination.current = current;
    fetchData({
      ...formModel.value,
      current,
      pageSize: pagination.pageSize,
    } as unknown as PictureBookParams);
  };

  const handleCreate = () => {
    router.push({ name: 'PictureBookCreate' });
  };

  const handleEdit = (record: PictureBookRecord) => {
    router.push({ name: 'PictureBookEdit', params: { id: record.id } });
  };

  const handleDelete = async (record: PictureBookRecord) => {
    try {
      await deletePictureBook(record.id);
      Message.success(t('pictureBookList.operation.deleteSuccess'));
      fetchData({ ...formModel.value, current: pagination.current, pageSize: pagination.pageSize } as unknown as PictureBookParams);
    } catch (e) {
      // ignore
    }
  };

  const handleToggleStatus = async (record: PictureBookRecord) => {
    const newStatus = record.status === 'published' ? 'offline' : 'published';
    try {
      await togglePictureBookStatus(record.id, newStatus);
      Message.success(t('pictureBookList.operation.statusSuccess'));
      fetchData({ ...formModel.value, current: pagination.current, pageSize: pagination.pageSize } as unknown as PictureBookParams);
    } catch (e) {
      // ignore
    }
  };

  fetchCategories();
  fetchData();
</script>

<script lang="ts">
  export default {
    name: 'PictureBookList',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
