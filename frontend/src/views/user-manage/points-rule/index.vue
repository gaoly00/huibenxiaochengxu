<template>
  <div class="container">
    <Breadcrumb :items="['menu.userManage', 'menu.userManage.pointsRule']" />
    <a-card class="general-card" :title="$t('userManage.pointsRule.title')" :loading="loading">
      <a-form :model="form" layout="vertical" style="max-width: 600px">
        <!-- 积分获取规则 -->
        <a-typography-title :heading="6">{{ $t('userManage.pointsRule.earn') }}</a-typography-title>
        <a-form-item :label="$t('userManage.pointsRule.register')">
          <a-space>
            <a-switch v-model="form.registerEnabled" />
            <a-input-number
              v-model="form.registerPoints"
              :min="0"
              :disabled="!form.registerEnabled"
              style="width: 140px"
            />
            <span>{{ $t('userManage.pointsRule.register.points') }}</span>
          </a-space>
        </a-form-item>
        <a-form-item :label="$t('userManage.pointsRule.checkIn')">
          <a-space>
            <a-switch v-model="form.checkInEnabled" />
            <a-input-number
              v-model="form.checkInPoints"
              :min="0"
              :disabled="!form.checkInEnabled"
              style="width: 140px"
            />
            <span>{{ $t('userManage.pointsRule.checkIn.points') }}</span>
          </a-space>
        </a-form-item>
        <a-form-item :label="$t('userManage.pointsRule.consume.rule')">
          <a-space>
            <a-switch v-model="form.consumeEnabled" />
            <span>{{ $t('userManage.pointsRule.consume.perYuan') }}</span>
            <a-input-number
              v-model="form.consumePerYuan"
              :min="1"
              :disabled="!form.consumeEnabled"
              style="width: 100px"
            />
            <span>{{ $t('userManage.pointsRule.consume.points') }}</span>
            <a-input-number
              v-model="form.consumePoints"
              :min="1"
              :disabled="!form.consumeEnabled"
              style="width: 100px"
            />
          </a-space>
        </a-form-item>
        <a-form-item :label="$t('userManage.pointsRule.review')">
          <a-space>
            <a-switch v-model="form.reviewEnabled" />
            <a-input-number
              v-model="form.reviewPoints"
              :min="0"
              :disabled="!form.reviewEnabled"
              style="width: 140px"
            />
            <span>{{ $t('userManage.pointsRule.review.points') }}</span>
          </a-space>
        </a-form-item>

        <a-divider />

        <!-- 积分消耗规则 -->
        <a-typography-title :heading="6">{{ $t('userManage.pointsRule.consume') }}</a-typography-title>
        <a-form-item :label="$t('userManage.pointsRule.deduction')">
          <a-space>
            <a-switch v-model="form.deductionEnabled" />
            <span>{{ $t('userManage.pointsRule.deduction.perYuan') }}</span>
            <a-input-number
              v-model="form.deductionPerYuan"
              :min="1"
              :disabled="!form.deductionEnabled"
              style="width: 100px"
            />
            <span>{{ $t('userManage.pointsRule.deduction.points') }}</span>
            <a-input-number
              v-model="form.deductionPoints"
              :min="1"
              :disabled="!form.deductionEnabled"
              style="width: 100px"
            />
          </a-space>
        </a-form-item>
        <a-form-item :label="$t('userManage.pointsRule.maxDeductionPercent')">
          <a-input-number
            v-model="form.maxDeductionPercent"
            :min="0"
            :max="100"
            :disabled="!form.deductionEnabled"
            style="width: 140px"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" :loading="saving" @click="handleSave">
            {{ $t('userManage.pointsRule.save') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import axios from 'axios';
  import { PointsRuleConfig } from '@/types/business-user';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(false);
  const saving = ref(false);

  const form = reactive<PointsRuleConfig>({
    registerEnabled: true,
    registerPoints: 100,
    checkInEnabled: true,
    checkInPoints: 10,
    consumeEnabled: true,
    consumePerYuan: 10,
    consumePoints: 1,
    reviewEnabled: true,
    reviewPoints: 20,
    deductionEnabled: true,
    deductionPerYuan: 1,
    deductionPoints: 100,
    maxDeductionPercent: 50,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/user-manage/points-rule');
      Object.assign(form, data);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    saving.value = true;
    try {
      await axios.put('/api/user-manage/points-rule', { ...form });
      Message.success(t('userManage.pointsRule.saveSuccess'));
    } finally {
      saving.value = false;
    }
  };

  fetchData();
</script>

<script lang="ts">
  export default {
    name: 'PointsRule',
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
