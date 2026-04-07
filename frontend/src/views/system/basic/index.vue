<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.basic']" />
    <a-card class="general-card" :title="$t('basicSettings.title')">
      <a-form
        :model="formModel"
        :label-col-props="{ span: 4 }"
        :wrapper-col-props="{ span: 16 }"
        label-align="left"
        @submit="handleSave"
      >
        <a-form-item field="appName" :label="$t('basicSettings.form.appName')">
          <a-input v-model="formModel.appName" :placeholder="$t('basicSettings.form.appName.placeholder')" />
        </a-form-item>
        <a-form-item field="appDescription" :label="$t('basicSettings.form.appDescription')">
          <a-textarea v-model="formModel.appDescription" :placeholder="$t('basicSettings.form.appDescription.placeholder')" :auto-size="{ minRows: 3, maxRows: 6 }" />
        </a-form-item>
        <a-form-item field="contactInfo" :label="$t('basicSettings.form.contactInfo')">
          <a-input v-model="formModel.contactInfo" :placeholder="$t('basicSettings.form.contactInfo.placeholder')" />
        </a-form-item>
        <a-form-item field="pointsDeductionNote" :label="$t('basicSettings.form.pointsDeductionNote')">
          <a-textarea v-model="formModel.pointsDeductionNote" :placeholder="$t('basicSettings.form.pointsDeductionNote.placeholder')" :auto-size="{ minRows: 3, maxRows: 6 }" />
        </a-form-item>
        <a-form-item :wrapper-col-props="{ offset: 4 }">
          <a-button type="primary" html-type="submit" :loading="saving">
            {{ $t('basicSettings.operation.save') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts">
export default { name: 'SystemBasicSettings' };
</script>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import { Message } from '@arco-design/web-vue';

const formModel = reactive({
  appName: '',
  appDescription: '',
  contactInfo: '',
  pointsDeductionNote: '',
});
const saving = ref(false);

const fetchData = async () => {
  try {
    const { data: res } = await (await import('axios')).default.get('/api/system/basic');
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
    await (await import('axios')).default.post('/api/system/basic', formModel);
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
