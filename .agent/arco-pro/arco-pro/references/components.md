# 组件开发规范

## Vue 3 组件结构

### Script Setup 规范

```vue
<script lang="ts" setup>
// 1. 导入语句（按顺序）
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import type { TableColumnData } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/store';
import { getUsers } from '@/api/users';
import type { UserRecord, UserQuery } from '@/types/users';

// 2. 组合式 API 调用
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const userStore = useUserStore();

// 3. 响应式状态
const loading = ref(false);
const tableData = ref<UserRecord[]>([]);

const searchForm = reactive<UserQuery>({
  page: 1,
  pageSize: 10,
  username: '',
});

// 4. 计算属性
const columns = computed<TableColumnData[]>(() => [...]);

// 5. 监听器
watch(() => searchForm.page, () => fetchData());

// 6. 生命周期
onMounted(() => fetchData());

// 7. 方法
const fetchData = async () => { ... };
const handleSearch = () => { ... };
</script>
```

### 表格列配置

```typescript
const columns = computed<TableColumnData[]>(() => [
  {
    title: t('users.columns.id'),
    dataIndex: 'id',
    width: 80,
    align: 'center',
  },
  {
    title: t('users.columns.username'),
    dataIndex: 'username',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: t('users.columns.status'),
    dataIndex: 'status',
    slotName: 'status',  // 使用插槽自定义渲染
  },
  {
    title: t('users.columns.createdAt'),
    dataIndex: 'created_at',
    width: 180,
  },
  {
    title: t('users.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
    width: 200,
    align: 'center',
  },
]);
```

### 分页配置

```typescript
const pagination = reactive({
  current: 1,           // 当前页（Arco Table 使用 current）
  pageSize: 10,         // 每页条数
  total: 0,             // 总条数
  showTotal: true,      // 显示总数
  showPageSize: true,   // 显示每页条数选择器
  pageSizeOptions: [10, 20, 50, 100],
});

// 页码变化
const handlePageChange = (page: number) => {
  searchForm.page = page;
  fetchData();
};

// 每页条数变化
const handlePageSizeChange = (pageSize: number) => {
  searchForm.page = 1;
  searchForm.pageSize = pageSize;
  fetchData();
};
```

### 表单验证

```typescript
import type { FormInstance } from '@arco-design/web-vue';

const formRef = ref<FormInstance>();
const formData = reactive({
  username: '',
  email: '',
});

const rules = {
  username: [
    { required: true, message: t('users.form.usernameRequired') },
    { minLength: 3, message: t('users.form.usernameMinLength') },
  ],
  email: [
    { required: true, message: t('users.form.emailRequired') },
    { type: 'email', message: t('users.form.emailInvalid') },
  ],
};

const handleSubmit = async () => {
  const valid = await formRef.value?.validate();
  if (valid) return;

  loading.value = true;
  try {
    await createUser(formData);
    Message.success(t('users.message.createSuccess'));
    router.back();
  } finally {
    loading.value = false;
  }
};
```

### 模态框操作

```typescript
const modalVisible = ref(false);
const modalLoading = ref(false);
const currentRecord = ref<UserRecord | null>(null);

const openModal = (record?: UserRecord) => {
  currentRecord.value = record || null;
  modalVisible.value = true;
};

const closeModal = () => {
  modalVisible.value = false;
  currentRecord.value = null;
};

const handleModalOk = async () => {
  modalLoading.value = true;
  try {
    // 执行操作
    closeModal();
    fetchData();
  } finally {
    modalLoading.value = false;
  }
};
```

## Arco Design 组件使用

### 常用布局

```vue
<template>
  <div class="container">
    <!-- 面包屑 -->
    <Breadcrumb :items="['menu.users', 'menu.users.list']" />

    <!-- 主卡片 -->
    <a-card class="general-card" :title="$t('menu.users.list')">
      <!-- 搜索区 -->
      <a-row>
        <a-col :flex="1">
          <a-form :model="searchForm" layout="inline">
            <a-form-item :label="$t('users.columns.username')">
              <a-input v-model="searchForm.username" allow-clear />
            </a-form-item>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="handleSearch">
              <template #icon><icon-search /></template>
              {{ $t('users.operation.search') }}
            </a-button>
            <a-button @click="handleReset">
              {{ $t('users.operation.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>

      <!-- 工具栏 -->
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-button type="primary" @click="handleCreate">
            <template #icon><icon-plus /></template>
            {{ $t('users.operation.create') }}
          </a-button>
        </a-col>
      </a-row>

      <!-- 表格 -->
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="columns"
        :data="tableData"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #status="{ record }">
          <a-tag :color="getStatusColor(record.status)">
            {{ $t(`users.status.${record.status}`) }}
          </a-tag>
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button type="text" size="small" @click="handleEdit(record)">
              {{ $t('users.operation.edit') }}
            </a-button>
            <a-popconfirm
              :content="$t('users.message.deleteConfirm')"
              @ok="handleDelete(record)"
            >
              <a-button type="text" size="small" status="danger">
                {{ $t('users.operation.delete') }}
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
```

### 样式规范

```vue
<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

.general-card {
  min-height: 400px;
}

// 表格操作按钮
:deep(.arco-table-td-content) {
  .arco-btn-text {
    padding: 0 4px;
  }
}
</style>
```
