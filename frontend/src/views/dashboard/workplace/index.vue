<template>
  <div class="container">
    <div class="panel">
      <!-- Welcome Banner -->
      <a-card class="general-card" :bordered="false">
        <a-space direction="vertical" :size="8">
          <a-typography-title :heading="5" style="margin: 0">
            {{ $t('workplace.welcome', { name: userStore.name || 'Admin' }) }}
          </a-typography-title>
          <a-typography-text type="secondary">
            {{ $t('workplace.subtitle') }}
          </a-typography-text>
        </a-space>
      </a-card>

      <!-- Stats Cards -->
      <a-row :gutter="16" style="margin-top: 16px">
        <a-col :span="6" v-for="item in statsCards" :key="item.key">
          <a-card class="general-card" :bordered="false">
            <a-statistic :title="$t(item.label)" :value="item.value" :value-from="0" animation show-group-separator>
              <template #prefix>
                <span :class="['stat-icon', item.color]">
                  <icon-component :is="item.icon" />
                </span>
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>

      <!-- Rankings -->
      <a-row :gutter="16" style="margin-top: 16px">
        <a-col :span="12">
          <a-card class="general-card" :bordered="false" :title="$t('workplace.hotPictureBooks')">
            <a-table :data="hotBooks" :pagination="false" :bordered="false" size="small">
              <template #columns>
                <a-table-column :title="$t('workplace.rank')" :width="60">
                  <template #cell="{ rowIndex }">{{ rowIndex + 1 }}</template>
                </a-table-column>
                <a-table-column :title="$t('workplace.name')" data-index="name" />
                <a-table-column :title="$t('workplace.count')" data-index="count" :width="100" />
              </template>
            </a-table>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card class="general-card" :bordered="false" :title="$t('workplace.hotProducts')">
            <a-table :data="hotProducts" :pagination="false" :bordered="false" size="small">
              <template #columns>
                <a-table-column :title="$t('workplace.rank')" :width="60">
                  <template #cell="{ rowIndex }">{{ rowIndex + 1 }}</template>
                </a-table-column>
                <a-table-column :title="$t('workplace.name')" data-index="name" />
                <a-table-column :title="$t('workplace.count')" data-index="count" :width="100" />
              </template>
            </a-table>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import {
    queryDashboardStats,
    queryHotPictureBooks,
    queryHotProducts,
    DashboardStats,
    RankItem,
  } from '@/api/dashboard';

  const { t } = useI18n();
  const userStore = useUserStore();
  const { loading, setLoading } = useLoading(true);

  const stats = reactive<DashboardStats>({
    todayOrders: 0,
    todaySales: 0,
    pendingShipment: 0,
    digitalDeliverySuccess: 0,
    newUsers: 0,
  });

  const statsCards = ref([
    { key: 'todayOrders', label: 'workplace.todayOrders', value: 0, icon: 'icon-file', color: 'blue' },
    { key: 'todaySales', label: 'workplace.todaySales', value: 0, icon: 'icon-trophy', color: 'green' },
    { key: 'pendingShipment', label: 'workplace.pendingShipment', value: 0, icon: 'icon-send', color: 'orange' },
    { key: 'digitalDelivery', label: 'workplace.digitalDelivery', value: 0, icon: 'icon-check-circle', color: 'purple' },
  ]);

  const hotBooks = ref<RankItem[]>([]);
  const hotProducts = ref<RankItem[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, booksRes, productsRes] = await Promise.all([
        queryDashboardStats(),
        queryHotPictureBooks(),
        queryHotProducts(),
      ]);
      Object.assign(stats, statsRes.data);
      statsCards.value[0].value = statsRes.data.todayOrders;
      statsCards.value[1].value = statsRes.data.todaySales;
      statsCards.value[2].value = statsRes.data.pendingShipment;
      statsCards.value[3].value = statsRes.data.digitalDeliverySuccess;
      hotBooks.value = booksRes.data;
      hotProducts.value = productsRes.data;
    } finally {
      setLoading(false);
    }
  };

  fetchData();
</script>

<script lang="ts">
  export default {
    name: 'Workplace',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 16px 20px;
    background-color: var(--color-fill-2);
  }
  .panel {
    max-width: 1200px;
    margin: 0 auto;
  }
  .stat-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    margin-right: 8px;
    font-size: 16px;
    &.blue { background: rgb(var(--arcoblue-1)); color: rgb(var(--arcoblue-6)); }
    &.green { background: rgb(var(--green-1)); color: rgb(var(--green-6)); }
    &.orange { background: rgb(var(--orangered-1)); color: rgb(var(--orangered-6)); }
    &.purple { background: rgb(var(--purple-1)); color: rgb(var(--purple-6)); }
  }
</style>
