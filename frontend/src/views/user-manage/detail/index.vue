<template>
  <div class="container">
    <Breadcrumb :items="['menu.userManage', 'menu.userManage.detail']" />
    <a-card class="general-card">
      <template #title>
        <a-space>
          <a-button type="text" @click="goBack">
            <template #icon><icon-left /></template>
            {{ $t('userManage.detail.back') }}
          </a-button>
          <span>{{ $t('userManage.detail.title') }}</span>
        </a-space>
      </template>
      <a-spin :loading="loading" style="width: 100%">
        <a-tabs default-active-key="basic">
          <!-- Tab 1: 基本信息 -->
          <a-tab-pane key="basic" :title="$t('userManage.detail.tab.basic')">
            <a-descriptions :column="2" bordered>
              <a-descriptions-item :label="$t('userManage.detail.avatar')">
                <a-avatar :size="64"><img :src="userInfo.avatar" /></a-avatar>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('userManage.detail.nickname')">{{ userInfo.nickname }}</a-descriptions-item>
              <a-descriptions-item :label="$t('userManage.detail.phone')">{{ userInfo.phone }}</a-descriptions-item>
              <a-descriptions-item :label="$t('userManage.detail.points')">{{ userInfo.points }}</a-descriptions-item>
              <a-descriptions-item :label="$t('userManage.detail.totalPoints')">{{ userInfo.totalPoints }}</a-descriptions-item>
              <a-descriptions-item :label="$t('userManage.detail.status')">
                <a-tag v-if="userInfo.status === 'active'" color="green">{{ $t('userManage.detail.status.active') }}</a-tag>
                <a-tag v-else color="red">{{ $t('userManage.detail.status.disabled') }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item :label="$t('userManage.detail.inviterNickname')">{{ userInfo.inviterNickname || '-' }}</a-descriptions-item>
              <a-descriptions-item :label="$t('userManage.detail.distributionLevel')">{{ userInfo.distributionLevel }}</a-descriptions-item>
              <a-descriptions-item :label="$t('userManage.detail.distributionParentNickname')">{{ userInfo.distributionParentNickname || '-' }}</a-descriptions-item>
              <a-descriptions-item :label="$t('userManage.detail.totalCommission')">¥{{ userInfo.totalCommission }}</a-descriptions-item>
              <a-descriptions-item :label="$t('userManage.detail.registrationTime')">{{ userInfo.registrationTime }}</a-descriptions-item>
              <a-descriptions-item :label="$t('userManage.detail.remark')">{{ userInfo.remark || '-' }}</a-descriptions-item>
            </a-descriptions>
          </a-tab-pane>
          <!-- Tab 2: 订单记录 -->
          <a-tab-pane key="orders" :title="$t('userManage.detail.tab.orders')">
            <a-table row-key="id" :data="orderData" :pagination="false" :bordered="false">
              <template #columns>
                <a-table-column :title="$t('userManage.detail.order.orderNo')" data-index="orderNo" :width="220" />
                <a-table-column :title="$t('userManage.detail.order.productName')" data-index="productName" :width="160" />
                <a-table-column :title="$t('userManage.detail.order.orderType')" :width="100">
                  <template #cell="{ record }">
                    <a-tag v-if="record.orderType === 'physical'" color="blue">{{ $t('userManage.detail.order.type.physical') }}</a-tag>
                    <a-tag v-else color="green">{{ $t('userManage.detail.order.type.digital') }}</a-tag>
                  </template>
                </a-table-column>
                <a-table-column :title="$t('userManage.detail.order.actualAmount')" :width="100">
                  <template #cell="{ record }">¥{{ record.actualAmount }}</template>
                </a-table-column>
                <a-table-column :title="$t('userManage.detail.order.orderStatus')" :width="110">
                  <template #cell="{ record }">
                    <a-tag :color="orderStatusColorMap[record.orderStatus] || 'gray'">
                      {{ $t(`userManage.detail.order.status.${record.orderStatus}`) }}
                    </a-tag>
                  </template>
                </a-table-column>
                <a-table-column :title="$t('userManage.detail.order.createdTime')" data-index="createdTime" :width="180" />
              </template>
            </a-table>
          </a-tab-pane>
          <!-- Tab 3: 积分记录 -->
          <a-tab-pane key="points" :title="$t('userManage.detail.tab.points')">
            <a-table
              row-key="id"
              :data="pointsData"
              :pagination="pointsPagination"
              :bordered="false"
              @page-change="onPointsPageChange"
            >
              <template #columns>
                <a-table-column :title="$t('userManage.detail.points.changeType')" :width="120">
                  <template #cell="{ record }">
                    <a-tag :color="pointsTypeColorMap[record.changeType] || 'gray'">
                      {{ $t(`userManage.detail.points.type.${record.changeType}`) }}
                    </a-tag>
                  </template>
                </a-table-column>
                <a-table-column :title="$t('userManage.detail.points.amount')" :width="100">
                  <template #cell="{ record }">
                    <span :style="{ color: record.points > 0 ? '#00b42a' : '#f53f3f' }">
                      {{ record.points > 0 ? `+${record.points}` : record.points }}
                    </span>
                  </template>
                </a-table-column>
                <a-table-column :title="$t('userManage.detail.points.balance')" data-index="balance" :width="100" />
                <a-table-column :title="$t('userManage.detail.points.reason')" data-index="reason" :width="200" />
                <a-table-column :title="$t('userManage.detail.points.createdTime')" data-index="createdTime" :width="180" />
              </template>
            </a-table>
          </a-tab-pane>
          <!-- Tab 4: 邀请关系 -->
          <a-tab-pane key="invites" :title="$t('userManage.detail.tab.invites')">
            <a-table row-key="id" :data="inviteData" :pagination="false" :bordered="false">
              <template #columns>
                <a-table-column :title="$t('userManage.detail.nickname')" data-index="nickname" :width="120" />
                <a-table-column :title="$t('userManage.detail.phone')" data-index="phone" :width="130" />
                <a-table-column :title="$t('userManage.detail.registrationTime')" data-index="registrationTime" :width="180" />
              </template>
            </a-table>
          </a-tab-pane>
          <!-- Tab 5: 分销关系 -->
          <a-tab-pane key="distribution" :title="$t('userManage.detail.tab.distribution')">
            <a-descriptions :column="1" bordered>
              <a-descriptions-item :label="$t('userManage.detail.distributionLevel')">{{ userInfo.distributionLevel }}</a-descriptions-item>
              <a-descriptions-item :label="$t('userManage.detail.distributionParentNickname')">{{ userInfo.distributionParentNickname || '-' }}</a-descriptions-item>
              <a-descriptions-item :label="$t('userManage.detail.totalCommission')">¥{{ userInfo.totalCommission }}</a-descriptions-item>
            </a-descriptions>
          </a-tab-pane>
          <!-- Tab 6: 评论晒单 -->
          <a-tab-pane key="reviews" :title="$t('userManage.detail.tab.reviews')">
            <a-table row-key="id" :data="reviewData" :pagination="false" :bordered="false">
              <template #columns>
                <a-table-column title="类型" :width="100">
                  <template #cell="{ record }">
                    <a-tag v-if="record.type === 'comment'" color="blue">评论</a-tag>
                    <a-tag v-else color="orange">晒单</a-tag>
                  </template>
                </a-table-column>
                <a-table-column title="内容" :width="300" ellipsis>
                  <template #cell="{ record }">{{ record.content }}</template>
                </a-table-column>
                <a-table-column title="状态" :width="100">
                  <template #cell="{ record }">
                    <a-tag v-if="record.status === 'approved'" color="green">已通过</a-tag>
                    <a-tag v-else-if="record.status === 'rejected'" color="red">已拒绝</a-tag>
                    <a-tag v-else color="gray">待审核</a-tag>
                  </template>
                </a-table-column>
                <a-table-column title="时间" data-index="createdTime" :width="180" />
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';
  import useLoading from '@/hooks/loading';
  import { getUserDetail, queryPointsRecords } from '@/api/user-manage';
  import { BusinessUserRecord, PointsRecord } from '@/types/business-user';
  import { Pagination } from '@/types/global';

  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const { loading, setLoading } = useLoading(true);

  const userInfo = ref<Partial<BusinessUserRecord>>({});
  const orderData = ref<any[]>([]);
  const pointsData = ref<PointsRecord[]>([]);
  const inviteData = ref<any[]>([]);
  const reviewData = ref<any[]>([]);

  const basePagination: Pagination = { current: 1, pageSize: 10 };
  const pointsPagination = reactive({ ...basePagination, total: 0 });

  const orderStatusColorMap: Record<string, string> = {
    pending_payment: 'gray',
    paid: 'blue',
    shipped: 'orange',
    delivered: 'green',
    completed: 'green',
    cancelled: 'red',
    refunding: 'orange',
    refunded: 'red',
  };

  const pointsTypeColorMap: Record<string, string> = {
    register: 'green',
    check_in: 'blue',
    showcase: 'orange',
    purchase: 'red',
    deduction: 'red',
    admin_adjust: 'purple',
  };

  const goBack = () => {
    router.push({ name: 'UserManageList' });
  };

  const fetchUserDetail = async () => {
    setLoading(true);
    try {
      const id = route.params.id as string;
      const { data } = await getUserDetail(id);
      userInfo.value = data;
    } finally {
      setLoading(false);
    }
  };

  const fetchPointsRecords = async (current = 1) => {
    try {
      const { data } = await queryPointsRecords({
        userId: route.params.id as string,
        current,
        pageSize: pointsPagination.pageSize,
      });
      pointsData.value = data.list;
      pointsPagination.total = data.total;
      pointsPagination.current = current;
    } catch (e) {
      // ignore
    }
  };

  const onPointsPageChange = (current: number) => {
    fetchPointsRecords(current);
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/user-manage/user-orders', {
        params: { userId: route.params.id },
      });
      orderData.value = data;
    } catch (e) {
      // ignore
    }
  };

  const fetchInvites = async () => {
    try {
      const { data } = await axios.get('/api/user-manage/invited-users', {
        params: { userId: route.params.id },
      });
      inviteData.value = data;
    } catch (e) {
      // ignore
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get('/api/user-manage/user-reviews', {
        params: { userId: route.params.id },
      });
      reviewData.value = data;
    } catch (e) {
      // ignore
    }
  };

  onMounted(() => {
    fetchUserDetail();
    fetchPointsRecords();
    fetchOrders();
    fetchInvites();
    fetchReviews();
  });
</script>

<script lang="ts">
  export default {
    name: 'UserManageDetail',
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
