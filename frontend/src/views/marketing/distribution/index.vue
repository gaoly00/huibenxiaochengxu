<template>
  <div class="container">
    <Breadcrumb :items="['menu.marketing', 'menu.marketing.distribution']" />
    <a-card class="general-card" :title="$t('marketingDistribution.title')">
      <a-form :model="formModel" layout="vertical" style="max-width: 500px">
        <a-form-item field="enabled" :label="$t('marketingDistribution.enabled')">
          <a-switch v-model="formModel.enabled" />
        </a-form-item>
        <a-form-item field="levelDescription" :label="$t('marketingDistribution.levelDescription')">
          <a-input v-model="formModel.levelDescription" />
        </a-form-item>
        <a-form-item field="level1CommissionRate" :label="$t('marketingDistribution.level1CommissionRate')">
          <a-input-number v-model="formModel.level1CommissionRate" :min="0" :max="100" style="width: 100%">
            <template #suffix>%</template>
          </a-input-number>
        </a-form-item>
        <a-form-item field="level2CommissionRate" :label="$t('marketingDistribution.level2CommissionRate')">
          <a-input-number v-model="formModel.level2CommissionRate" :min="0" :max="100" style="width: 100%">
            <template #suffix>%</template>
          </a-input-number>
        </a-form-item>
        <a-form-item field="ruleDescription" :label="$t('marketingDistribution.ruleDescription')">
          <a-textarea
            v-model="formModel.ruleDescription"
            :placeholder="$t('marketingDistribution.ruleDescription.placeholder')"
            :auto-size="{ minRows: 3, maxRows: 6 }"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" :loading="submitLoading" @click="handleSave">
            {{ $t('marketingDistribution.save') }}
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
    levelDescription: '固定二级分销',
    level1CommissionRate: 10,
    level2CommissionRate: 5,
    ruleDescription: '',
  });

  const fetchConfig = async () => {
    const { data } = await axios.get('/api/marketing/distribution/config');
    Object.assign(formModel, data.data);
  };

  const handleSave = async () => {
    submitLoading.value = true;
    try {
      await axios.put('/api/marketing/distribution/config', formModel);
      Message.success(t('marketingDistribution.save.success'));
    } finally {
      submitLoading.value = false;
    }
  };

  fetchConfig();
</script>

<script lang="ts">
  export default {
    name: 'MarketingDistribution',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 16px 20px;
  }
</style>
