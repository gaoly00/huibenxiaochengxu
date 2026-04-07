<template>
  <div class="container">
    <Breadcrumb :items="['menu.order', 'menu.order.list']" />
    <a-card class="general-card" :title="$t('order.list.title')">
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
                <a-form-item field="orderNo" :label="$t('order.list.orderNo')">
                  <a-input
                    v-model="searchForm.orderNo"
                    :placeholder="$t('order.list.orderNo.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="userNickname" :label="$t('order.list.userNickname')">
                  <a-input
                    v-model="searchForm.userNickname"
                    :placeholder="$t('order.list.userNickname.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="productName" :label="$t('order.list.productName')">
                  <a-input
                    v-model="searchForm.productName"
                    :placeholder="$t('order.list.productName.placeholder')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="orderType" :label="$t('order.list.orderType')">
                  <a-select
                    v-model="searchForm.orderType"
                    :placeholder="$t('order.list.orderType.placeholder')"
                    allow-clear
                  >
                    <a-option value="physical">{{ $t('order.list.type.physical') }}</a-option>
                    <a-option value="digital">{{ $t('order.list.type.digital') }}</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="orderStatus" :label="$t('order.list.orderStatus')">
                  <a-select
                    v-model="searchForm.orderStatus"
                    :placeholder="$t('order.list.orderStatus.placeholder')"
                    allow-clear
                  >
                    <a-option v-for="s in orderStatusOptions" :key="s.value" :value="s.value">
                      {{ s.label }}
                    </a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="paymentStatus" :label="$t('order.list.paymentStatus')">
                  <a-select
                    v-model="searchForm.paymentStatus"
                    :placeholder="$t('order.list.paymentStatus.placeholder')"
                    allow-clear
                  >
                    <a-option v-for="s in paymentStatusOptions" :key="s.value" :value="s.value">
                      {{ s.label }}
                    </a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="dateRange" :label="$t('order.list.dateRange')">
                  <a-range-picker
                    v-model="searchForm.dateRange"
                    style="width: 100%"
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
              {{ $t('order.list.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon><icon-refresh /></template>
              {{ $t('order.list.reset') }}
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
        @page-change="onPageChange"
      >
        <template #columns>
          <a-table-column :title="$t('order.list.orderNo')" data-index="orderNo" :width="200" />
          <a-table-column :title="$t('order.list.userNickname')" data-index="userNickname" :width="120" />
          <a-table-column :title="$t('order.list.productName')" data-index="productName" :width="160" />
          <a-table-column :title="$t('order.list.productCover')" :width="80">
            <template #cell="{ record }">
              <a-image :src="record.productCover" width="40" height="40" fit="cover" />
            </template>
          </a-table-column>
          <a-table-column :title="$t('order.list.orderType')" :width="100">
            <template #cell="{ record }">
              <a-tag v-if="record.orderType === 'physical'" color="blue">{{ $t('order.list.type.physical') }}</a-tag>
              <a-tag v-else color="green">{{ $t('order.list.type.digital') }}</a-tag>
            </template>
          </a-table-column>
          <a-table-column :title="$t('order.list.totalAmount')" data-index="totalAmount" :width="100">
            <template #cell="{ record }">¥{{ record.totalAmount }}</template>
          </a-table-column>
          <a-table-column :title="$t('order.list.actualAmount')" data-index="actualAmount" :width="100">
            <template #cell="{ record }">¥{{ record.actualAmount }}</template>
          </a-table-column>
          <a-table-column :title="$t('order.list.paymentStatus')" :width="100">
            <template #cell="{ record }">
              <a-tag :color="paymentStatusColorMap[record.paymentStatus] || 'gray'">
                {{ $t(`order.list.payment.${record.paymentStatus}`) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column :title="$t('order.list.orderStatus')" :width="110">
            <template #cell="{ record }">
              <a-tag :color="orderStatusColorMap[record.orderStatus] || 'gray'">
                {{ $t(`order.list.status.${record.orderStatus}`) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column :title="$t('order.list.createdTime')" data-index="createdTime" :width="180" />
          <a-table-column :title="$t('order.list.operations')" :width="100" fixed="right">
            <template #cell="{ record }">
              <a-button type="text" size="small" @click="viewDetail(record)">
                {{ $t('order.list.viewDetail') }}
              </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import useLoading from '@/hooks/loading';
  import { queryOrderList } from '@/api/order';
  import { OrderRecord, OrderParams } from '@/types/order';
  import { Pagination } from '@/types/global';
  import { OrderStatus, PaymentStatus } from '@/types/enums';

  const { t } = useI18n();
  const router = useRouter();
  const { loading, setLoading } = useLoading(false);

  const basePagination: Pagination = { current: 1, pageSize: 20 };
  const pagination = reactive({ ...basePagination, total: 0 });
  const renderData = ref<OrderRecord[]>([]);

  const generateSearchForm = () => ({
    orderNo: '',
    userNickname: '',
    productName: '',
    orderType: undefined as string | undefined,
    orderStatus: undefined as string | undefined,
    paymentStatus: undefined as string | undefined,
    dateRange: undefined as string[] | undefined,
  });
  const searchForm = reactive(generateSearchForm());

  const orderStatusOptions = computed(() =>
    Object.values(OrderStatus).map((v) => ({
      value: v,
      label: t(`order.list.status.${v}`),
    }))
  );
  const paymentStatusOptions = computed(() =>
    Object.values(PaymentStatus).map((v) => ({
      value: v,
      label: t(`order.list.payment.${v}`),
    }))
  );

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
  const paymentStatusColorMap: Record<string, string> = {
    unpaid: 'gray',
    paid: 'blue',
    refunded: 'red',
  };

  const fetchData = async (params: OrderParams) => {
    setLoading(true);
    try {
      const { data } = await queryOrderList(params);
      renderData.value = data.list;
      pagination.total = data.total;
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    pagination.current = basePagination.current;
    const params: OrderParams = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      orderNo: searchForm.orderNo || undefined,
      userNickname: searchForm.userNickname || undefined,
      productName: searchForm.productName || undefined,
      orderType: searchForm.orderType as any,
      orderStatus: searchForm.orderStatus as any,
      paymentStatus: searchForm.paymentStatus as any,
      startTime: searchForm.dateRange?.[0],
      endTime: searchForm.dateRange?.[1],
    };
    fetchData(params);
  };

  const reset = () => {
    Object.assign(searchForm, generateSearchForm());
    search();
  };

  const onPageChange = (current: number) => {
    pagination.current = current;
    const params: OrderParams = {
      current,
      pageSize: pagination.pageSize,
      orderNo: searchForm.orderNo || undefined,
      userNickname: searchForm.userNickname || undefined,
      productName: searchForm.productName || undefined,
      orderType: searchForm.orderType as any,
      orderStatus: searchForm.orderStatus as any,
      paymentStatus: searchForm.paymentStatus as any,
      startTime: searchForm.dateRange?.[0],
      endTime: searchForm.dateRange?.[1],
    };
    fetchData(params);
  };

  const viewDetail = (record: OrderRecord) => {
    const name = record.orderType === 'physical' ? 'PhysicalOrderDetail' : 'DigitalOrderDetail';
    router.push({ name, params: { id: record.id } });
  };

  search();
</script>

<script lang="ts">
  export default {
    name: 'OrderList',
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
