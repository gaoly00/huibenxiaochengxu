<template>
  <div class="container">
    <Breadcrumb :items="['menu.userManage', 'menu.userManage.list']" />
    <a-card class="general-card" :title="$t('userManage.list.title')">
      <!-- Filter Form -->
      <a-row style="margin-bottom: 16px">
        <a-col :flex="1">
          <a-form
            :model="searchForm"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
            auto-label-width
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="nickname" :label="$t('userManage.list.nickname')">
                  <a-input
                    v-model="searchForm.nickname"
                    :placeholder="$t('userManage.list.nickname.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="phone" :label="$t('userManage.list.phone')">
                  <a-input
                    v-model="searchForm.phone"
                    :placeholder="$t('userManage.list.phone.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('userManage.list.status')">
                  <a-select
                    v-model="searchForm.status"
                    :placeholder="$t('userManage.list.status.placeholder')"
                    allow-clear
                  >
                    <a-option value="active">{{ $t('userManage.list.status.active') }}</a-option>
                    <a-option value="disabled">{{ $t('userManage.list.status.disabled') }}</a-option>
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
              {{ $t('userManage.list.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon><icon-refresh /></template>
              {{ $t('userManage.list.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <!-- Table -->
      <a-table
        row-key="id"
        :loading="loading"
        :data="renderData"
        :pagination="pagination"
        :bordered="false"
        :scroll="{ x: 1600 }"
        @page-change="onPageChange"
      >
        <template #columns>
          <a-table-column :title="$t('userManage.list.id')" data-index="id" :width="120" ellipsis />
          <a-table-column :title="$t('userManage.list.avatar')" :width="80">
            <template #cell="{ record }">
              <a-avatar :size="32"><img :src="record.avatar" /></a-avatar>
            </template>
          </a-table-column>
          <a-table-column :title="$t('userManage.list.nickname')" data-index="nickname" :width="120" />
          <a-table-column :title="$t('userManage.list.phone')" data-index="phone" :width="130" />
          <a-table-column :title="$t('userManage.list.points')" data-index="points" :width="80" />
          <a-table-column :title="$t('userManage.list.inviterNickname')" data-index="inviterNickname" :width="120">
            <template #cell="{ record }">{{ record.inviterNickname || '-' }}</template>
          </a-table-column>
          <a-table-column :title="$t('userManage.list.distributionLevel')" data-index="distributionLevel" :width="100" />
          <a-table-column :title="$t('userManage.list.orderCount')" data-index="orderCount" :width="80" />
          <a-table-column :title="$t('userManage.list.lastOrderTime')" data-index="lastOrderTime" :width="180" />
          <a-table-column :title="$t('userManage.list.status')" :width="80">
            <template #cell="{ record }">
              <a-tag v-if="record.status === 'active'" color="green">{{ $t('userManage.list.status.active') }}</a-tag>
              <a-tag v-else color="red">{{ $t('userManage.list.status.disabled') }}</a-tag>
            </template>
          </a-table-column>
          <a-table-column :title="$t('userManage.list.registrationTime')" data-index="registrationTime" :width="180" />
          <a-table-column :title="$t('userManage.list.operations')" :width="180" fixed="right">
            <template #cell="{ record }">
              <a-button type="text" size="small" @click="viewDetail(record)">
                {{ $t('userManage.list.viewDetail') }}
              </a-button>
              <a-button type="text" size="small" @click="openAdjustModal(record)">
                {{ $t('userManage.list.adjustPoints') }}
              </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    <!-- Points Adjustment Modal -->
    <a-modal
      v-model:visible="adjustModalVisible"
      :title="$t('userManage.list.adjustPoints.title')"
      :ok-loading="adjustLoading"
      @ok="handleAdjustPoints"
      @cancel="adjustModalVisible = false"
    >
      <a-form :model="adjustForm" layout="vertical">
        <a-form-item field="adjustType" :label="$t('userManage.list.adjustPoints.adjustType')">
          <a-radio-group v-model="adjustForm.adjustType">
            <a-radio value="increase">{{ $t('userManage.list.adjustPoints.increase') }}</a-radio>
            <a-radio value="decrease">{{ $t('userManage.list.adjustPoints.decrease') }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item field="points" :label="$t('userManage.list.adjustPoints.points')">
          <a-input-number v-model="adjustForm.points" :min="1" style="width: 100%" />
        </a-form-item>
        <a-form-item field="reason" :label="$t('userManage.list.adjustPoints.reason')" :rules="[{ required: true, message: $t('userManage.list.adjustPoints.reason.placeholder') }]">
          <a-input v-model="adjustForm.reason" :placeholder="$t('userManage.list.adjustPoints.reason.placeholder')" />
        </a-form-item>
        <a-form-item field="remark" :label="$t('userManage.list.adjustPoints.remark')">
          <a-textarea v-model="adjustForm.remark" :placeholder="$t('userManage.list.adjustPoints.remark.placeholder')" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import { queryUserList, adjustUserPoints } from '@/api/user-manage';
  import { BusinessUserRecord, BusinessUserParams, PointsAdjustForm } from '@/types/business-user';
  import { Pagination } from '@/types/global';
  import { UserStatus, PointsAdjustType } from '@/types/enums';

  const { t } = useI18n();
  const router = useRouter();
  const { loading, setLoading } = useLoading(false);

  const basePagination: Pagination = { current: 1, pageSize: 20 };
  const pagination = reactive({ ...basePagination, total: 0 });
  const renderData = ref<BusinessUserRecord[]>([]);

  const generateSearchForm = () => ({
    nickname: '',
    phone: '',
    status: undefined as UserStatus | undefined,
  });
  const searchForm = reactive(generateSearchForm());

  const fetchData = async (params: BusinessUserParams) => {
    setLoading(true);
    try {
      const { data } = await queryUserList(params);
      renderData.value = data.list;
      pagination.total = data.total;
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    pagination.current = basePagination.current;
    const params: BusinessUserParams = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      nickname: searchForm.nickname || undefined,
      phone: searchForm.phone || undefined,
      status: searchForm.status,
    };
    fetchData(params);
  };

  const reset = () => {
    Object.assign(searchForm, generateSearchForm());
    search();
  };

  const onPageChange = (current: number) => {
    pagination.current = current;
    const params: BusinessUserParams = {
      current,
      pageSize: pagination.pageSize,
      nickname: searchForm.nickname || undefined,
      phone: searchForm.phone || undefined,
      status: searchForm.status,
    };
    fetchData(params);
  };

  const viewDetail = (record: BusinessUserRecord) => {
    router.push({ name: 'UserManageDetail', params: { id: record.id } });
  };

  // Points adjustment
  const adjustModalVisible = ref(false);
  const adjustLoading = ref(false);
  const adjustForm = reactive<PointsAdjustForm>({
    userId: '',
    adjustType: PointsAdjustType.INCREASE,
    points: 1,
    reason: '',
    remark: '',
  });

  const openAdjustModal = (record: BusinessUserRecord) => {
    adjustForm.userId = record.id;
    adjustForm.adjustType = PointsAdjustType.INCREASE;
    adjustForm.points = 1;
    adjustForm.reason = '';
    adjustForm.remark = '';
    adjustModalVisible.value = true;
  };

  const handleAdjustPoints = async () => {
    if (!adjustForm.reason) return;
    adjustLoading.value = true;
    try {
      await adjustUserPoints(adjustForm);
      Message.success(t('userManage.list.adjustPoints.success'));
      adjustModalVisible.value = false;
      search();
    } finally {
      adjustLoading.value = false;
    }
  };

  search();
</script>

<script lang="ts">
  export default {
    name: 'UserManageList',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 0 20px 20px 20px;
  }
  .general-card {
    min-height: 395px;
  }
</style>
