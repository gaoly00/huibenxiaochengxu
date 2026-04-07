<template>
  <div class="container">
    <Breadcrumb :items="['menu.marketing', 'menu.marketing.points']" />
    <a-card class="general-card" :title="$t('marketingPoints.title')">
      <a-form :model="formModel" layout="vertical" style="max-width: 500px">
        <a-form-item field="registerPoints" :label="$t('marketingPoints.registerPoints')">
          <a-input-number v-model="formModel.registerPoints" :min="0" style="width: 100%" />
        </a-form-item>
        <a-form-item field="checkInPoints" :label="$t('marketingPoints.checkInPoints')">
          <a-input-number v-model="formModel.checkInPoints" :min="0" style="width: 100%" />
        </a-form-item>
        <a-form-item field="showcasePoints" :label="$t('marketingPoints.showcasePoints')">
          <a-input-number v-model="formModel.showcasePoints" :min="0" style="width: 100%" />
        </a-form-item>
        <a-form-item field="pointsToYuanRate" :label="$t('marketingPoints.pointsToYuanRate')" :help="$t('marketingPoints.pointsToYuanRate.help')">
          <a-input-number v-model="formModel.pointsToYuanRate" :min="1" style="width: 100%" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" :loading="submitLoading" @click="handleSave">
            {{ $t('marketingPoints.save') }}
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
    registerPoints: 100,
    checkInPoints: 10,
    showcasePoints: 50,
    pointsToYuanRate: 100,
  });

  const fetchConfig = async () => {
    const { data } = await axios.get('/api/marketing/points/config');
    Object.assign(formModel, data.data);
  };

  const handleSave = async () => {
    submitLoading.value = true;
    try {
      await axios.put('/api/marketing/points/config', formModel);
      Message.success(t('marketingPoints.save.success'));
    } finally {
      submitLoading.value = false;
    }
  };

  fetchConfig();
</script>

<script lang="ts">
  export default {
    name: 'MarketingPoints',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 16px 20px;
  }
</style>
