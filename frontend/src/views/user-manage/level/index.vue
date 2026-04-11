<template>
  <div class="container">
    <Breadcrumb :items="['menu.userManage', 'menu.userManage.level']" />
    <a-card class="general-card" :title="$t('userManage.level.title')">
      <a-table
        row-key="id"
        :loading="loading"
        :data="levelData"
        :pagination="false"
        :bordered="false"
      >
        <template #columns>
          <a-table-column :title="$t('userManage.level.sort')" data-index="sort" :width="80" />
          <a-table-column :title="$t('userManage.level.name')" data-index="name" :width="140" />
          <a-table-column :title="$t('userManage.level.minPoints')" :width="160">
            <template #cell="{ record }">
              <a-input-number
                v-if="editingId === record.id"
                v-model="editForm.minPoints"
                :min="0"
                style="width: 120px"
              />
              <span v-else>{{ record.minPoints }}</span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('userManage.level.discount')" :width="160">
            <template #cell="{ record }">
              <a-input-number
                v-if="editingId === record.id"
                v-model="editForm.discount"
                :min="1"
                :max="100"
                style="width: 120px"
              />
              <span v-else>{{ record.discount }}%</span>
            </template>
          </a-table-column>
          <a-table-column :title="$t('userManage.level.operations')" :width="160">
            <template #cell="{ record }">
              <a-space v-if="editingId === record.id">
                <a-button type="text" size="small" status="success" @click="handleSave(record)">
                  {{ $t('userManage.level.save') }}
                </a-button>
                <a-button type="text" size="small" @click="editingId = ''">
                  {{ $t('userManage.level.cancel') }}
                </a-button>
              </a-space>
              <a-button v-else type="text" size="small" @click="startEdit(record)">
                {{ $t('userManage.level.edit') }}
              </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import axios from 'axios';
  import { MemberLevelRecord } from '@/types/business-user';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(false);
  const levelData = ref<MemberLevelRecord[]>([]);
  const editingId = ref('');
  const editForm = reactive({ minPoints: 0, discount: 100 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/user-manage/member-levels');
      levelData.value = data;
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (record: MemberLevelRecord) => {
    editingId.value = record.id;
    editForm.minPoints = record.minPoints;
    editForm.discount = record.discount;
  };

  const handleSave = async (record: MemberLevelRecord) => {
    try {
      await axios.put(`/api/user-manage/member-levels/${record.id}`, {
        minPoints: editForm.minPoints,
        discount: editForm.discount,
      });
      record.minPoints = editForm.minPoints;
      record.discount = editForm.discount;
      editingId.value = '';
      Message.success(t('userManage.level.saveSuccess'));
    } catch {
      // error handled by interceptor
    }
  };

  fetchData();
</script>

<script lang="ts">
  export default {
    name: 'MemberLevel',
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
