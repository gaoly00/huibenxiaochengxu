<template>
  <div class="container">
    <Breadcrumb :items="['menu.review', 'menu.review.showcases']" />
    <a-card class="general-card" :title="$t('reviewShowcases.title')">
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
              <a-col :span="6">
                <a-form-item field="userNickname" :label="$t('reviewShowcases.form.userNickname')">
                  <a-input
                    v-model="formModel.userNickname"
                    :placeholder="$t('reviewShowcases.form.userNickname.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item field="productName" :label="$t('reviewShowcases.form.productName')">
                  <a-input
                    v-model="formModel.productName"
                    :placeholder="$t('reviewShowcases.form.productName.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item field="status" :label="$t('reviewShowcases.form.status')">
                  <a-select
                    v-model="formModel.status"
                    :placeholder="$t('reviewShowcases.form.selectDefault')"
                    allow-clear
                  >
                    <a-option value="pending">{{ $t('reviewShowcases.status.pending') }}</a-option>
                    <a-option value="approved">{{ $t('reviewShowcases.status.approved') }}</a-option>
                    <a-option value="rejected">{{ $t('reviewShowcases.status.rejected') }}</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item field="rewardStatus" :label="$t('reviewShowcases.form.rewardStatus')">
                  <a-select
                    v-model="formModel.rewardStatus"
                    :placeholder="$t('reviewShowcases.form.selectDefault')"
                    allow-clear
                  >
                    <a-option value="pending">{{ $t('reviewShowcases.rewardStatus.pending') }}</a-option>
                    <a-option value="rewarded">{{ $t('reviewShowcases.rewardStatus.rewarded') }}</a-option>
                    <a-option value="skipped">{{ $t('reviewShowcases.rewardStatus.skipped') }}</a-option>
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
              {{ $t('reviewShowcases.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon><icon-refresh /></template>
              {{ $t('reviewShowcases.form.reset') }}
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
          <a-table-column :title="$t('reviewShowcases.columns.id')" data-index="id" :width="80" />
          <a-table-column :title="$t('reviewShowcases.columns.userNickname')" data-index="userNickname" :width="120" />
          <a-table-column :title="$t('reviewShowcases.columns.orderNo')" data-index="orderNo" :width="160" />
          <a-table-column :title="$t('reviewShowcases.columns.productName')" data-index="productName" :width="140" ellipsis />
          <a-table-column :title="$t('reviewShowcases.columns.content')" data-index="content" :width="200" ellipsis />
          <a-table-column :title="$t('reviewShowcases.columns.images')" :width="80">
            <template #cell="{ record }">
              <a-badge :count="record.images.length" />
            </template>
          </a-table-column>
          <a-table-column :title="$t('reviewShowcases.columns.status')" :width="100">
            <template #cell="{ record }">
              <a-tag v-if="record.status === 'pending'" color="orange">
                {{ $t('reviewShowcases.status.pending') }}
              </a-tag>
              <a-tag v-else-if="record.status === 'approved'" color="green">
                {{ $t('reviewShowcases.status.approved') }}
              </a-tag>
              <a-tag v-else color="red">
                {{ $t('reviewShowcases.status.rejected') }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column :title="$t('reviewShowcases.columns.rewardStatus')" :width="100">
            <template #cell="{ record }">
              <a-tag v-if="record.rewardStatus === 'pending'" color="gray">
                {{ $t('reviewShowcases.rewardStatus.pending') }}
              </a-tag>
              <a-tag v-else-if="record.rewardStatus === 'rewarded'" color="green">
                {{ $t('reviewShowcases.rewardStatus.rewarded') }}
              </a-tag>
              <a-tag v-else color="orange">
                {{ $t('reviewShowcases.rewardStatus.skipped') }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column :title="$t('reviewShowcases.columns.rewardPoints')" data-index="rewardPoints" :width="100" />
          <a-table-column :title="$t('reviewShowcases.columns.createdTime')" data-index="createdTime" :width="180" />
          <a-table-column :title="$t('reviewShowcases.columns.operations')" :width="220" fixed="right">
            <template #cell="{ record }">
              <a-space>
                <a-popconfirm :content="$t('reviewShowcases.operation.approve.confirm')" @ok="handleApprove(record)">
                  <a-button type="text" size="small" status="success">
                    {{ $t('reviewShowcases.operation.approve') }}
                  </a-button>
                </a-popconfirm>
                <a-popconfirm :content="$t('reviewShowcases.operation.reject.confirm')" @ok="handleReject(record)">
                  <a-button type="text" size="small" status="warning">
                    {{ $t('reviewShowcases.operation.reject') }}
                  </a-button>
                </a-popconfirm>
                <a-popconfirm
                  :content="$t('reviewShowcases.operation.reward.confirm', { points: record.rewardPoints })"
                  @ok="handleReward(record)"
                >
                  <a-button type="text" size="small">
                    {{ $t('reviewShowcases.operation.reward') }}
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
  import useLoading from '@/hooks/loading';
  import { Message } from '@arco-design/web-vue';
  import axios from 'axios';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(false);
  const renderData = ref([]);

  const formModel = reactive({
    userNickname: '',
    productName: '',
    status: '',
    rewardStatus: '',
  });

  const basePagination = { current: 1, pageSize: 10 };
  const pagination = reactive({
    ...basePagination,
    showTotal: true,
    showPageSize: true,
    total: 0,
  });

  const fetchData = async (page = basePagination.current, pageSize = basePagination.pageSize) => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/review/showcases', {
        params: { page, pageSize, ...formModel },
      });
      renderData.value = data.data.list;
      pagination.total = data.data.total;
      pagination.current = page;
    } finally {
      setLoading(false);
    }
  };
  const search = () => {
    fetchData(1);
  };

  const reset = () => {
    formModel.userNickname = '';
    formModel.productName = '';
    formModel.status = '';
    formModel.rewardStatus = '';
    fetchData(1);
  };

  const onPageChange = (page: number) => {
    fetchData(page);
  };

  const handleApprove = async (record: any) => {
    await axios.put(`/api/review/showcases/approve/${record.id}`);
    Message.success(t('reviewShowcases.operation.approve'));
    fetchData(pagination.current);
  };

  const handleReject = async (record: any) => {
    await axios.put(`/api/review/showcases/reject/${record.id}`);
    Message.success(t('reviewShowcases.operation.reject'));
    fetchData(pagination.current);
  };

  const handleReward = async (record: any) => {
    await axios.put(`/api/review/showcases/reward/${record.id}`);
    Message.success(t('reviewShowcases.operation.reward'));
    fetchData(pagination.current);
  };

  fetchData();
</script>

<script lang="ts">
  export default {
    name: 'ReviewShowcases',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 16px 20px;
  }
</style>
