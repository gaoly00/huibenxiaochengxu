<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.payment']" />
    <a-card class="general-card" :title="$t('paymentSettings.title')">
      <a-form
        :model="formModel"
        :label-col-props="{ span: 4 }"
        :wrapper-col-props="{ span: 16 }"
        label-align="left"
        @submit="handleSave"
      >
        <a-form-item field="enabled" :label="$t('paymentSettings.form.enabled')">
          <a-switch v-model="formModel.enabled" />
        </a-form-item>
        <a-form-item field="paymentNote" :label="$t('paymentSettings.form.paymentNote')">
          <a-textarea v-model="formModel.paymentNote" :placeholder="$t('paymentSettings.form.paymentNote.placeholder')" :auto-size="{ minRows: 3, maxRows: 6 }" />
        </a-form-item>
        <a-form-item field="mchId" :label="$t('paymentSettings.form.mchId')">
          <a-input v-model="formModel.mchId" :placeholder="$t('paymentSettings.form.mchId.placeholder')" />
        </a-form-item>
        <a-form-item field="appId" :label="$t('paymentSettings.form.appId')">
          <a-input v-model="formModel.appId" :placeholder="$t('paymentSettings.form.appId.placeholder')" />
        </a-form-item>
        <a-form-item :wrapper-col-props="{ offset: 4 }">
          <a-button type="primary" html-type="submit" :loading="saving">
            {{ $t('paymentSettings.operation.save') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts">
export default { name: 'SystemPaymentSettings' };
</script>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import { Message } from '@arco-design/web-vue';

const formModel = reactive({
  enabled: false,
  paymentNote: '',
  mchId: '',
  appId: '',
});
const saving = ref(false);

const fetchData = async () => {
  try {
    const { data: res } = await (await import('axios')).default.get('/api/system/payment');
    Object.assign(formModel, res.data);
  } catch {
    // ignore
  }
};

onMounted(() => {
  fetchData();
});

const handleSave = async () => {
  saving.value = true;
  try {
    await (await import('axios')).default.post('/api/system/payment', formModel);
    Message.success('保存成功');
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.container {
  padding: 0 20px 20px 20px;
}
</style>
