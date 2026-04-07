<template>
  <div class="container">
    <Breadcrumb :items="['menu.module', isEdit ? 'menu.module.edit' : 'menu.module.create']" />
    <a-card class="general-card">
      <template #title>
        {{ isEdit ? $t('module.modal.editTitle') : $t('module.modal.createTitle') }}
      </template>

      <a-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        :label-col-props="{ span: 6 }"
        :wrapper-col-props="{ span: 18 }"
        :style="{ maxWidth: '600px', margin: '0 auto' }"
      >
        <a-form-item :label="$t('module.form.name')" field="name">
          <a-input
            v-model="formData.name"
            :placeholder="$t('module.placeholder.name')"
            :max-length="50"
            allow-clear
          />
        </a-form-item>

        <a-form-item :label="$t('module.form.email')" field="email">
          <a-input
            v-model="formData.email"
            :placeholder="$t('module.placeholder.email')"
            :max-length="100"
            allow-clear
          />
        </a-form-item>

        <a-form-item :label="$t('module.form.phone')" field="phone">
          <a-input
            v-model="formData.phone"
            :placeholder="$t('module.placeholder.phone')"
            :max-length="20"
            allow-clear
          />
        </a-form-item>

        <a-form-item :label="$t('module.form.status')" field="status">
          <a-select
            v-model="formData.status"
            :placeholder="$t('module.placeholder.status')"
          >
            <a-option value="active">{{ $t('module.status.active') }}</a-option>
            <a-option value="inactive">{{ $t('module.status.inactive') }}</a-option>
            <a-option value="banned">{{ $t('module.status.banned') }}</a-option>
          </a-select>
        </a-form-item>

        <a-form-item :label="$t('module.form.role')" field="role">
          <a-select
            v-model="formData.role"
            :placeholder="$t('module.placeholder.role')"
            multiple
            allow-clear
          >
            <a-option value="admin">{{ $t('module.role.admin') }}</a-option>
            <a-option value="developer">{{ $t('module.role.developer') }}</a-option>
            <a-option value="agent">{{ $t('module.role.agent') }}</a-option>
          </a-select>
        </a-form-item>

        <a-form-item :label="$t('module.form.description')" field="description">
          <a-textarea
            v-model="formData.description"
            :placeholder="$t('module.placeholder.description')"
            :max-length="500"
            :auto-size="{ minRows: 3, maxRows: 6 }"
            show-word-limit
          />
        </a-form-item>

        <a-form-item :wrapper-col-props="{ span: 18, offset: 6 }">
          <a-space>
            <a-button type="primary" :loading="loading" @click="handleSubmit">
              {{ $t('message.confirm') }}
            </a-button>
            <a-button @click="handleCancel">
              {{ $t('message.cancel') }}
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import type { FormInstance } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';
import Breadcrumb from '@/components/breadcrumb/index.vue';
import {
  getModule,
  createModule,
  updateModule,
} from '@/api/module';
import type { CreateModuleDto, UpdateModuleDto, ModuleRecord } from '@/types/module';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

// 状态
const loading = ref(false);
const formRef = ref<FormInstance>();

// 是否编辑模式
const isEdit = computed(() => !!route.params.id);
const moduleId = computed(() => Number(route.params.id));

// 表单数据
const formData = reactive<CreateModuleDto & UpdateModuleDto>({
  name: '',
  email: '',
  phone: '',
  status: 'active',
  role: [],
  description: '',
});

// 表单验证规则
const rules = {
  name: [
    { required: true, message: t('module.form.nameRequired') },
    { minLength: 2, message: t('module.form.nameMinLength') },
    { maxLength: 50, message: t('module.form.nameMaxLength') },
  ],
  email: [
    { required: true, message: t('module.form.emailRequired') },
    { type: 'email', message: t('module.form.emailInvalid') },
  ],
  phone: [
    {
      match: /^1[3-9]\d{9}$/,
      message: t('module.form.phoneInvalid'),
    },
  ],
  status: [
    { required: true, message: t('module.form.statusRequired') },
  ],
};

// 获取详情（编辑模式）
const fetchDetail = async () => {
  if (!isEdit.value) return;

  loading.value = true;
  try {
    const res = await getModule(moduleId.value);
    Object.assign(formData, res.data);
  } finally {
    loading.value = false;
  }
};

// 提交表单
const handleSubmit = async () => {
  const valid = await formRef.value?.validate();
  if (valid) return;

  loading.value = true;
  try {
    if (isEdit.value) {
      await updateModule(moduleId.value, formData);
      Message.success(t('module.message.updateSuccess'));
    } else {
      await createModule(formData);
      Message.success(t('module.message.createSuccess'));
    }
    router.back();
  } finally {
    loading.value = false;
  }
};

// 取消
const handleCancel = () => {
  router.back();
};

// 初始化
onMounted(() => {
  if (isEdit.value) {
    fetchDetail();
  }
});
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

.general-card {
  min-height: 400px;
}
</style>
