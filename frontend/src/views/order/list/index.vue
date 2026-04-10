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
      <!-- Toolbar -->
      <a-row style="margin-bottom: 16px">
        <a-col :span="24" style="text-align: right">
          <a-button status="success" @click="handleExport">
            <template #icon><icon-download /></template>
            {{ $t('order.list.export') }}
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
        :row-selection="rowSelection"
        v-model:selectedKeys="selectedKeys"
        @page-change="onPageChange"
      >
        <template #columns>
          <a-table-column :title="$t('order.list.orderNo')" data-index="orderNo" :width="200" />
          <a-table-column :title="$t('order.list.buyer')" :width="120">
            <template #cell="{ record }">
              <a-popover v-if="record.orderType === 'physical' && record.receiverName" trigger="hover" position="right">
                <span style="cursor: pointer; color: rgb(var(--primary-6))">{{ record.userNickname }}</span>
                <template #content>
                  <div style="min-width: 260px">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px">
                      <strong>{{ $t('order.list.receiverName') }}：</strong>
                      <span>{{ record.receiverName }}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px">
                      <strong>{{ $t('order.list.receiverPhone') }}：</strong>
                      <span>{{ record.receiverPhone }}</span>
                    </div>
                    <div style="margin-bottom: 12px">
                      <strong>{{ $t('order.list.receiverAddress') }}：</strong>
                      <div style="margin-top: 4px">{{ record.receiverAddress }}</div>
                    </div>
                    <a-button
                      type="primary"
                      size="small"
                      long
                      @click="copyText(`${record.receiverName} ${record.receiverPhone} ${record.receiverAddress}`)"
                    >
                      {{ $t('order.list.copyAll') }}
                    </a-button>
                  </div>
                </template>
              </a-popover>
              <span v-else>{{ record.userNickname }}</span>
            </template>
          </a-table-column>
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
          <a-table-column :title="$t('order.list.actualAmount')" data-index="actualAmount" :width="100">
            <template #cell="{ record }">¥{{ record.actualAmount }}</template>
          </a-table-column>
          <a-table-column :title="$t('order.list.orderStatus')" :width="110">
            <template #cell="{ record }">
              <a-tag :color="orderStatusColorMap[record.orderStatus] || 'gray'">
                {{ $t(`order.list.status.${record.orderStatus}`) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column :title="$t('order.list.createdTime')" data-index="createdTime" :width="180" />
          <a-table-column :title="$t('order.list.operations')" :width="200" fixed="right">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="viewDetail(record)">
                  {{ $t('order.list.viewDetail') }}
                </a-button>
                <a-button
                  v-if="record.orderType === 'physical' && record.orderStatus === 'paid' && record.shippingStatus === 'pending'"
                  type="text"
                  size="small"
                  status="success"
                  @click="openShipModal(record)"
                >
                  {{ $t('order.list.ship') }}
                </a-button>
                <a-popconfirm
                  v-if="['paid', 'shipped', 'delivered', 'completed'].includes(record.orderStatus)"
                  :content="$t('order.list.refundConfirm')"
                  @ok="handleRefund(record)"
                >
                  <a-button type="text" size="small" status="danger">
                    {{ $t('order.list.refund') }}
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <!-- Ship Modal -->
    <a-modal
      v-model:visible="shipModalVisible"
      :title="$t('order.list.shipTitle')"
      @ok="handleShip"
      @cancel="shipModalVisible = false"
    >
      <a-form :model="shipForm" layout="vertical">
        <a-form-item :label="$t('order.list.logisticsCompany')" required>
          <a-select v-model="shipForm.logisticsCompany" :placeholder="$t('order.list.logisticsCompany.placeholder')">
            <a-option value="申通快递">申通快递</a-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('order.list.logisticsNo')" required>
          <a-input v-model="shipForm.logisticsNo" :placeholder="$t('order.list.logisticsNo.placeholder')" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import { queryOrderList, shipOrder, refundOrder } from '@/api/order';
  import { OrderRecord, OrderParams } from '@/types/order';
  import { Pagination } from '@/types/global';
  import { OrderStatus, PaymentStatus } from '@/types/enums';
  import * as XLSX from 'xlsx';

  const { t } = useI18n();
  const router = useRouter();
  const { loading, setLoading } = useLoading(false);

  const basePagination: Pagination = { current: 1, pageSize: 20 };
  const pagination = reactive({ ...basePagination, total: 0 });
  const renderData = ref<OrderRecord[]>([]);
  const selectedKeys = ref<string[]>([]);
  const rowSelection = reactive({
    type: 'checkbox' as const,
    showCheckedAll: true,
  });

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

  // 发货弹窗
  const shipModalVisible = ref(false);
  const currentShipOrderId = ref('');
  const shipForm = reactive({ logisticsCompany: '', logisticsNo: '' });

  const openShipModal = (record: OrderRecord) => {
    currentShipOrderId.value = record.id;
    shipForm.logisticsCompany = '';
    shipForm.logisticsNo = '';
    shipModalVisible.value = true;
  };

  const handleShip = async () => {
    try {
      await shipOrder(currentShipOrderId.value, { ...shipForm });
      Message.success(t('order.list.shipSuccess'));
      shipModalVisible.value = false;
      search();
    } catch {
      // error handled by interceptor
    }
  };

  // 退款
  const handleRefund = async (record: OrderRecord) => {
    try {
      await refundOrder(record.id);
      Message.success(t('order.list.refundSuccess'));
      search();
    } catch {
      // error handled by interceptor
    }
  };

  // 复制文本
  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      Message.success(t('order.list.copied'));
    } catch {
      Message.error('Copy failed');
    }
  };

  // 导出 Excel
  const handleExport = () => {
    const source = selectedKeys.value.length > 0
      ? renderData.value.filter((r) => selectedKeys.value.includes(r.id))
      : renderData.value;
    if (source.length === 0) {
      Message.warning(t('order.list.exportEmpty'));
      return;
    }
    const rows = source.map((r) => ({
      [t('order.list.orderNo')]: r.orderNo,
      [t('order.list.buyer')]: r.userNickname,
      [t('order.list.productName')]: r.productName,
      [t('order.list.orderType')]: r.orderType === 'physical' ? t('order.list.type.physical') : t('order.list.type.digital'),
      [t('order.list.actualAmount')]: r.actualAmount,
      [t('order.list.orderStatus')]: t(`order.list.status.${r.orderStatus}`),
      [t('order.list.receiverName')]: r.receiverName || '',
      [t('order.list.receiverPhone')]: r.receiverPhone || '',
      [t('order.list.receiverAddress')]: r.receiverAddress || '',
      [t('order.list.createdTime')]: r.createdTime,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, `orders_${new Date().toISOString().slice(0, 10)}.xlsx`);
    Message.success(t('order.list.exportSuccess'));
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
