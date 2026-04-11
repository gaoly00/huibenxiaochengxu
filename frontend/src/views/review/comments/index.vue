<template>
  <div class="container">
    <Breadcrumb :items="['menu.review', 'menu.review.comments']" />
    <a-card class="general-card" :title="$t('reviewComments.title')">
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
                <a-form-item field="userNickname" :label="$t('reviewComments.form.userNickname')">
                  <a-input
                    v-model="formModel.userNickname"
                    :placeholder="$t('reviewComments.form.userNickname.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="productName" :label="$t('reviewComments.form.productName')">
                  <a-input
                    v-model="formModel.productName"
                    :placeholder="$t('reviewComments.form.productName.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('reviewComments.form.status')">
                  <a-select
                    v-model="formModel.status"
                    :placeholder="$t('reviewComments.form.selectDefault')"
                    allow-clear
                  >
                    <a-option value="pending">{{ $t('reviewComments.status.pending') }}</a-option>
                    <a-option value="approved">{{ $t('reviewComments.status.approved') }}</a-option>
                    <a-option value="rejected">{{ $t('reviewComments.status.rejected') }}</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <!-- PLACEHOLDER_BUTTONS -->
        <a-divider style="height: 40px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space :size="18">
            <a-button type="primary" @click="search">
              <template #icon><icon-search /></template>
              {{ $t('reviewComments.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon><icon-refresh /></template>
              {{ $t('reviewComments.form.reset') }}
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
          <a-table-column :title="$t('reviewComments.columns.id')" data-index="id" :width="80" />
          <a-table-column :title="$t('reviewComments.columns.userNickname')" data-index="userNickname" :width="120" />
          <a-table-column :title="$t('reviewComments.columns.productName')" data-index="productName" :width="140" ellipsis />
          <a-table-column :title="$t('reviewComments.columns.content')" data-index="content" :width="200" ellipsis />
          <a-table-column :title="$t('reviewComments.columns.rating')" :width="140">
            <template #cell="{ record }">
              <a-rate :model-value="record.rating" readonly />
            </template>
          </a-table-column>
          <a-table-column :title="$t('reviewComments.columns.imageCount')" :width="80">
            <template #cell="{ record }">
              <a-badge v-if="record.imageCount > 0" :count="record.imageCount" />
              <span v-else>0</span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('reviewComments.columns.status')" :width="100">
            <template #cell="{ record }">
              <a-tag v-if="record.status === 'pending'" color="orange">{{ $t('reviewComments.status.pending') }}</a-tag>
              <a-tag v-else-if="record.status === 'approved'" color="green">{{ $t('reviewComments.status.approved') }}</a-tag>
              <a-tag v-else color="red">{{ $t('reviewComments.status.rejected') }}</a-tag>
            </template>
          </a-table-column>
          <a-table-column :title="$t('reviewComments.columns.rewardPoints')" :width="100">
            <template #cell="{ record }">
              <span v-if="record.rewardPoints > 0" style="color: #f5a623">+{{ record.rewardPoints }}</span>
              <span v-else>-</span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('reviewComments.columns.createdTime')" data-index="createdTime" :width="180" />
          <a-table-column :title="$t('reviewComments.columns.operations')" :width="200" fixed="right">
            <template #cell="{ record }">
              <a-space>
                <a-popconfirm
                  v-if="record.status === 'pending'"
                  :content="$t('reviewComments.operation.approve.confirm')"
                  @ok="handleApprove(record)"
                >
                  <a-button type="text" size="small" status="success">{{ $t('reviewComments.operation.approve') }}</a-button>
                </a-popconfirm>
                <a-popconfirm
                  v-if="record.status === 'pending'"
                  :content="$t('reviewComments.operation.reject.confirm')"
                  @ok="handleReject(record)"
                >
                  <a-button type="text" size="small" status="warning">{{ $t('reviewComments.operation.reject') }}</a-button>
                </a-popconfirm>
                <a-popconfirm :content="$t('reviewComments.operation.delete.confirm')" @ok="handleDelete(record)">
                  <a-button type="text" size="small" status="danger">{{ $t('reviewComments.operation.delete') }}</a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<!-- PLACEHOLDER_SCRIPT -->
<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import axios from 'axios';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(false);
  const renderData = ref<any[]>([]);

  const formModel = reactive({
    userNickname: '',
    productName: '',
    status: '',
  });

  const basePagination = { current: 1, pageSize: 10 };
  const pagination = reactive({ ...basePagination, showTotal: true, total: 0 });

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/review/comments', {
        params: { page, pageSize: basePagination.pageSize, ...formModel },
      });
      renderData.value = data.data.list;
      pagination.total = data.data.total;
      pagination.current = page;
    } finally {
      setLoading(false);
    }
  };

  const search = () => fetchData(1);
  const reset = () => {
    formModel.userNickname = '';
    formModel.productName = '';
    formModel.status = '';
    fetchData(1);
  };
  const onPageChange = (page: number) => fetchData(page);

  const handleApprove = async (record: any) => {
    await axios.put(`/api/review/comments/approve/${record.id}`);
    Message.success(t('reviewComments.operation.approve'));
    fetchData(pagination.current);
  };

  const handleReject = async (record: any) => {
    await axios.put(`/api/review/comments/reject/${record.id}`);
    Message.success(t('reviewComments.operation.reject'));
    fetchData(pagination.current);
  };

  const handleDelete = async (record: any) => {
    await axios.delete(`/api/review/comments/delete/${record.id}`);
    Message.success(t('reviewComments.operation.delete'));
    fetchData(pagination.current);
  };

  fetchData();
</script>

<script lang="ts">
  export default {
    name: 'ReviewComments',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 16px 20px;
  }
</style>
