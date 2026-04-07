<template>
  <div class="container">
    <Breadcrumb :items="['menu.module', 'menu.module.detail']" />
    <a-spin :loading="loading" style="width: 100%">
      <a-card class="general-card">
        <template #title>
          <a-space>
            <a-button type="text" @click="router.back()">
              <template #icon><icon-left /></template>
            </a-button>
            <span>{{ $t('module.modal.detailTitle') }}</span>
          </a-space>
        </template>
        <template #extra>
          <a-space>
            <a-button type="primary" @click="handleEdit">
              <template #icon><icon-edit /></template>
              {{ $t('module.operation.edit') }}
            </a-button>
            <a-popconfirm
              :content="$t('module.message.deleteConfirm')"
              @ok="handleDelete"
            >
              <a-button status="danger">
                <template #icon><icon-delete /></template>
                {{ $t('module.operation.delete') }}
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>

        <!-- 基本信息 -->
        <a-descriptions
          :column="2"
          :label-style="{ width: '120px' }"
          bordered
        >
          <a-descriptions-item :label="$t('module.columns.id')">
            {{ detail?.id }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('module.columns.name')">
            {{ detail?.name }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('module.columns.email')">
            {{ detail?.email }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('module.columns.phone')">
            {{ detail?.phone || '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('module.columns.status')">
            <a-tag :color="getStatusColor(detail?.status)">
              {{ $t(`module.status.${detail?.status}`) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('module.columns.role')">
            <a-space>
              <a-tag v-for="role in detail?.role" :key="role" color="arcoblue">
                {{ $t(`module.role.${role}`) }}
              </a-tag>
              <span v-if="!detail?.role?.length">-</span>
            </a-space>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('module.columns.balance')">
            <a-statistic :value="detail?.balance || 0" :precision="2">
              <template #suffix>元</template>
            </a-statistic>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('module.columns.createdAt')">
            {{ detail?.created_at }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('module.columns.updatedAt')">
            {{ detail?.updated_at }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('module.form.description')" :span="2">
            {{ detail?.description || '-' }}
          </a-descriptions-item>
        </a-descriptions>

        <!-- 关联数据 Tab -->
        <a-tabs default-active-key="logs" style="margin-top: 24px">
          <a-tab-pane key="logs" :title="$t('module.tabs.logs')">
            <a-table
              :data="logs"
              :pagination="false"
              :scroll="{ x: 800 }"
            >
              <template #columns>
                <a-table-column
                  :title="$t('module.logColumns.action')"
                  data-index="action"
                />
                <a-table-column
                  :title="$t('module.logColumns.operator')"
                  data-index="operator"
                />
                <a-table-column
                  :title="$t('module.logColumns.ip')"
                  data-index="ip"
                />
                <a-table-column
                  :title="$t('module.logColumns.createdAt')"
                  data-index="created_at"
                />
              </template>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="related" :title="$t('module.tabs.related')">
            <a-empty />
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';
import Breadcrumb from '@/components/breadcrumb/index.vue';
import {
  getModule,
  deleteModule,
  getModuleLogs,
} from '@/api/module';
import type { ModuleRecord, ModuleLog } from '@/types/module';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

// 状态
const loading = ref(false);
const detail = ref<ModuleRecord | null>(null);
const logs = ref<ModuleLog[]>([]);

// 获取 ID
const moduleId = Number(route.params.id);

// 获取状态颜色
const getStatusColor = (status?: string) => {
  const colorMap: Record<string, string> = {
    active: 'green',
    inactive: 'gray',
    banned: 'red',
  };
  return colorMap[status || ''] || 'blue';
};

// 获取详情
const fetchDetail = async () => {
  loading.value = true;
  try {
    const res = await getModule(moduleId);
    detail.value = res.data;
  } finally {
    loading.value = false;
  }
};

// 获取日志
const fetchLogs = async () => {
  try {
    const res = await getModuleLogs(moduleId);
    logs.value = res.data;
  } catch (error) {
    // 忽略错误
  }
};

// 编辑
const handleEdit = () => {
  router.push({ name: 'ModuleEdit', params: { id: moduleId } });
};

// 删除
const handleDelete = async () => {
  try {
    await deleteModule(moduleId);
    Message.success(t('module.message.deleteSuccess'));
    router.back();
  } catch (error) {
    // 错误由拦截器处理
  }
};

// 初始化
onMounted(() => {
  fetchDetail();
  fetchLogs();
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
