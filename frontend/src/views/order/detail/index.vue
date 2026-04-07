<template>
  <div class="container">
    <a-page-header
      :title="$t('order.detail.title')"
      :subtitle="orderData.orderNo"
      @back="goBack"
    />
    <a-spin :loading="loading" style="width: 100%">
      <!-- Order Info -->
      <a-card class="general-card" :title="$t('order.detail.orderInfo')">
        <a-descriptions :column="3" bordered>
          <a-descriptions-item :label="$t('order.detail.orderNo')">
            {{ orderData.orderNo }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('order.detail.orderType')">
            <a-tag v-if="orderData.orderType === 'physical'" color="blue">
              {{ $t('order.detail.type.physical') }}
            </a-tag>
            <a-tag v-else color="green">
              {{ $t('order.detail.type.digital') }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('order.detail.orderStatus')">
            <a-tag :color="orderStatusColorMap[orderData.orderStatus] || 'gray'">
              {{ $t(`order.detail.status.${orderData.orderStatus}`) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('order.detail.paymentStatus')">
            <a-tag :color="paymentStatusColorMap[orderData.paymentStatus] || 'gray'">
              {{ $t(`order.detail.payment.${orderData.paymentStatus}`) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('order.detail.createdTime')">
            {{ orderData.createdTime }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('order.detail.paymentTime')">
            {{ orderData.paymentTime || '-' }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <!-- Product Info -->
      <a-card class="general-card" :title="$t('order.detail.productInfo')" style="margin-top: 16px">
        <a-descriptions :column="3" bordered>
          <a-descriptions-item :label="$t('order.detail.productCover')">
            <a-image :src="orderData.productCover" width="80" height="80" fit="cover" />
          </a-descriptions-item>
          <a-descriptions-item :label="$t('order.detail.productName')">
            {{ orderData.productName }}
          </a-descriptions-item>

          <a-descriptions-item :label="$t('order.detail.quantity')">
            {{ orderData.quantity }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('order.detail.unitPrice')">
            ¥{{ orderData.unitPrice }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <!-- Amount Info -->
      <a-card class="general-card" :title="$t('order.detail.amountInfo')" style="margin-top: 16px">
        <a-descriptions :column="3" bordered>
          <a-descriptions-item :label="$t('order.detail.totalAmount')">
            ¥{{ orderData.totalAmount }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('order.detail.pointsDeduction')">
            {{ orderData.pointsDeduction }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('order.detail.actualAmount')">
            ¥{{ orderData.actualAmount }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <!-- Physical Order: Receiver Info -->
      <template v-if="orderData.orderType === 'physical'">
        <a-card class="general-card" :title="$t('order.detail.receiverInfo')" style="margin-top: 16px">
          <a-descriptions :column="3" bordered>
            <a-descriptions-item :label="$t('order.detail.receiverName')">
              {{ orderData.receiverName }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('order.detail.receiverPhone')">
              {{ orderData.receiverPhone }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('order.detail.receiverAddress')">
              {{ orderData.receiverAddress }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <a-card class="general-card" :title="$t('order.detail.shippingInfo')" style="margin-top: 16px">
          <a-descriptions :column="3" bordered>
            <a-descriptions-item :label="$t('order.detail.shippingStatus')">
              <a-tag :color="shippingStatusColorMap[orderData.shippingStatus] || 'gray'">
                {{ $t(`order.detail.shipping.${orderData.shippingStatus}`) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item :label="$t('order.detail.logisticsCompany')">
              {{ orderData.logisticsCompany || '-' }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('order.detail.logisticsNo')">
              {{ orderData.logisticsNo || '-' }}
            </a-descriptions-item>
          </a-descriptions>

          <template #extra>
            <a-space>
              <a-button type="primary" @click="shipModalVisible = true">
                {{ $t('order.detail.ship') }}
              </a-button>
              <a-button @click="logisticsModalVisible = true">
                {{ $t('order.detail.updateLogistics') }}
              </a-button>
            </a-space>
          </template>
        </a-card>
      </template>

      <!-- Digital Order: Delivery Info -->
      <template v-if="orderData.orderType === 'digital'">
        <a-card class="general-card" :title="$t('order.detail.deliveryInfo')" style="margin-top: 16px">
          <a-descriptions :column="3" bordered>
            <a-descriptions-item :label="$t('order.detail.deliveryStatus')">
              <a-tag :color="deliveryStatusColorMap[orderData.deliveryStatus] || 'gray'">
                {{ $t(`order.detail.delivery.${orderData.deliveryStatus}`) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item :label="$t('order.detail.deliveryTime')">
              {{ orderData.deliveryTime || '-' }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('order.detail.deliveryRetryCount')">
              {{ orderData.deliveryRetryCount }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('order.detail.baiduPanUrl')">
              {{ orderData.baiduPanUrl ? maskUrl(orderData.baiduPanUrl) : '-' }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('order.detail.baiduPanCode')">
              {{ orderData.baiduPanCode ? '****' : '-' }}
            </a-descriptions-item>
          </a-descriptions>
          <template #extra>
            <a-space>
              <a-popconfirm
                :content="$t('order.detail.retryConfirm')"
                @ok="handleRetryDelivery"
              >
                <a-button type="primary">{{ $t('order.detail.retryDelivery') }}</a-button>
              </a-popconfirm>
              <a-button @click="manualModalVisible = true">
                {{ $t('order.detail.manualDelivery') }}
              </a-button>
            </a-space>
          </template>
        </a-card>

        <!-- Delivery Logs -->
        <a-card class="general-card" :title="$t('order.detail.deliveryLogs')" style="margin-top: 16px">
          <a-table :data="deliveryLogs" :pagination="false" :bordered="false" size="small">
            <template #columns>
              <a-table-column :title="$t('order.detail.log.action')" data-index="action" />
              <a-table-column :title="$t('order.detail.log.result')" data-index="result" />
              <a-table-column :title="$t('order.detail.log.detail')" data-index="detail" />
              <a-table-column :title="$t('order.detail.log.operator')" data-index="operatorName" />
              <a-table-column :title="$t('order.detail.log.time')" data-index="createdTime" />
            </template>
          </a-table>
        </a-card>
      </template>
    </a-spin>

    <!-- Ship Modal -->
    <a-modal
      v-model:visible="shipModalVisible"
      :title="$t('order.detail.ship')"
      @ok="handleShip"
      @cancel="shipModalVisible = false"
    >
      <a-form :model="shipForm" layout="vertical">
        <a-form-item :label="$t('order.detail.logisticsCompany')" required>
          <a-input v-model="shipForm.logisticsCompany" />
        </a-form-item>
        <a-form-item :label="$t('order.detail.logisticsNo')" required>
          <a-input v-model="shipForm.logisticsNo" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Update Logistics Modal -->
    <a-modal
      v-model:visible="logisticsModalVisible"
      :title="$t('order.detail.updateLogistics')"
      @ok="handleUpdateLogistics"
      @cancel="logisticsModalVisible = false"
    >
      <a-form :model="logisticsForm" layout="vertical">
        <a-form-item :label="$t('order.detail.logisticsCompany')" required>
          <a-input v-model="logisticsForm.logisticsCompany" />
        </a-form-item>
        <a-form-item :label="$t('order.detail.logisticsNo')" required>
          <a-input v-model="logisticsForm.logisticsNo" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Manual Delivery Modal -->
    <a-modal
      v-model:visible="manualModalVisible"
      :title="$t('order.detail.manualDelivery')"
      @ok="handleManualDelivery"
      @cancel="manualModalVisible = false"
    >
      <a-form :model="manualForm" layout="vertical">
        <a-form-item :label="$t('order.detail.baiduPanUrl')" required>
          <a-input v-model="manualForm.baiduPanUrl" />
        </a-form-item>
        <a-form-item :label="$t('order.detail.baiduPanCode')" required>
          <a-input v-model="manualForm.baiduPanCode" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import {
    getOrderDetail,
    shipOrder,
    updateLogistics,
    retryDelivery,
    manualDelivery,
    queryDeliveryLogs,
  } from '@/api/order';
  import { OrderRecord, DeliveryLogRecord } from '@/types/order';

  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const { loading, setLoading } = useLoading(false);

  const orderId = route.params.id as string;
  const orderData = reactive<Partial<OrderRecord>>({});
  const deliveryLogs = ref<DeliveryLogRecord[]>([]);

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
  const shippingStatusColorMap: Record<string, string> = {
    pending: 'gray',
    shipped: 'orange',
    delivered: 'green',
  };
  const deliveryStatusColorMap: Record<string, string> = {
    pending: 'gray',
    delivering: 'blue',
    delivered: 'green',
    failed: 'red',
  };

  // Modals
  const shipModalVisible = ref(false);
  const logisticsModalVisible = ref(false);
  const manualModalVisible = ref(false);

  const shipForm = reactive({ logisticsCompany: '', logisticsNo: '' });
  const logisticsForm = reactive({ logisticsCompany: '', logisticsNo: '' });
  const manualForm = reactive({ baiduPanUrl: '', baiduPanCode: '' });

  const maskUrl = (url: string) => {
    if (url.length <= 20) return url.slice(0, 10) + '****';
    return url.slice(0, 20) + '****';
  };

  const goBack = () => {
    router.push({ name: 'OrderList' });
  };

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const { data } = await getOrderDetail(orderId);
      Object.assign(orderData, data);
      if (data.orderType === 'digital') {
        const logsRes = await queryDeliveryLogs(orderId);
        deliveryLogs.value = logsRes.data;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShip = async () => {
    try {
      await shipOrder(orderId, { ...shipForm });
      Message.success(t('order.detail.shipSuccess'));
      shipModalVisible.value = false;
      fetchDetail();
    } catch {
      // error handled by interceptor
    }
  };

  const handleUpdateLogistics = async () => {
    try {
      await updateLogistics(orderId, { ...logisticsForm });
      Message.success(t('order.detail.updateSuccess'));
      logisticsModalVisible.value = false;
      fetchDetail();
    } catch {
      // error handled by interceptor
    }
  };

  const handleRetryDelivery = async () => {
    try {
      await retryDelivery(orderId);
      Message.success(t('order.detail.retrySuccess'));
      fetchDetail();
    } catch {
      // error handled by interceptor
    }
  };

  const handleManualDelivery = async () => {
    try {
      await manualDelivery(orderId, { ...manualForm });
      Message.success(t('order.detail.manualSuccess'));
      manualModalVisible.value = false;
      fetchDetail();
    } catch {
      // error handled by interceptor
    }
  };

  fetchDetail();
</script>

<script lang="ts">
  export default {
    name: 'OrderDetail',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 0 20px 20px 20px;
  }
  .general-card {
    margin-bottom: 0;
  }
</style>
