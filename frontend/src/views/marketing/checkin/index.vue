<template>
  <div class="container">
    <Breadcrumb :items="['menu.marketing', 'menu.marketing.checkin']" />
    <a-card class="general-card" :title="$t('marketingCheckin.title')">
      <a-form :model="formModel" layout="vertical" style="max-width: 500px">
        <a-form-item field="enabled" :label="$t('marketingCheckin.enabled')">
          <a-switch v-model="formModel.enabled" />
        </a-form-item>
        <a-form-item field="dailyPoints" :label="$t('marketingCheckin.dailyPoints')">
          <a-input-number v-model="formModel.dailyPoints" :min="0" style="width: 100%" />
        </a-form-item>
        <a-form-item field="consecutiveDescription" :label="$t('marketingCheckin.consecutiveDescription')">
          <a-textarea
            v-model="formModel.consecutiveDescription"
            :placeholder="$t('marketingCheckin.consecutiveDescription.placeholder')"
            :auto-size="{ minRows: 3, maxRows: 6 }"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" :loading="submitLoading" @click="handleSave">
            {{ $t('marketingCheckin.save') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import axios from 'axios';

  const { t } = useI18n();
  const submitLoading = ref(false);

  const formModel = reactive({
    enabled: true,
    dailyPoints: 5,
    consecutiveDescription: '',
  });

  const fetchConfig = async () => {
    const { data } = await axios.get('/api/marketing/checkin/config');
    Object.assign(formModel, data.data);
  };

  const handleSave = async () => {
    submitLoading.value = true;
    try {
      await axios.put('/api/marketing/checkin/config', formModel);
      Message.success(t('marketingCheckin.save.success'));
    } finally {
      submitLoading.value = false;
    }
  };

  fetchConfig();
</script>

<script lang="ts">
  export default {
    name: 'MarketingCheckin',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 16px 20px;
  }
</style>
