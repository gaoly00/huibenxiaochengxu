<template>
  <div class="container">
    <Breadcrumb :items="['menu.product', isEdit ? 'menu.product.edit' : 'menu.product.create']" />
    <a-spin :loading="loading" style="width: 100%">
      <a-card class="general-card">
        <a-form
          ref="formRef"
          :model="formModel"
          :label-col-props="{ span: 4 }"
          :wrapper-col-props="{ span: 16 }"
          label-align="left"
        >
          <!-- Section 1: 基础信息 -->
          <a-typography-title :heading="6" style="margin-top: 0">
            {{ $t('productForm.section.basic') }}
          </a-typography-title>
          <a-form-item
            field="name"
            :label="$t('productForm.label.name')"
            :rules="[{ required: true, message: $t('productForm.rules.name') }]"
          >
            <a-input v-model="formModel.name" :placeholder="$t('productForm.placeholder.name')" />
          </a-form-item>
          <a-form-item field="coverUrl" :label="$t('productForm.label.coverUrl')">
            <a-input v-model="formModel.coverUrl" :placeholder="$t('productForm.placeholder.coverUrl')" />
          </a-form-item>
          <a-form-item field="images" :label="$t('productForm.label.images')">
            <a-input v-model="formModel.imagesStr" :placeholder="$t('productForm.placeholder.images')" />
          </a-form-item>
          <a-form-item field="description" :label="$t('productForm.label.description')">
            <a-textarea
              v-model="formModel.description"
              :placeholder="$t('productForm.placeholder.description')"
              :auto-size="{ minRows: 2, maxRows: 5 }"
            />
          </a-form-item>
          <a-form-item field="detail" :label="$t('productForm.label.detail')">
            <a-textarea
              v-model="formModel.detail"
              :placeholder="$t('productForm.placeholder.detail')"
              :auto-size="{ minRows: 3, maxRows: 8 }"
            />
          </a-form-item>
          <a-form-item
            field="price"
            :label="$t('productForm.label.price')"
            :rules="[{ required: true, message: $t('productForm.rules.price') }]"
          >
            <a-input-number
              v-model="formModel.price"
              :min="0"
              :precision="2"
              :placeholder="$t('productForm.placeholder.price')"
              style="width: 200px"
            />
          </a-form-item>
          <a-form-item field="originalPrice" :label="$t('productForm.label.originalPrice')">
            <a-input-number
              v-model="formModel.originalPrice"
              :min="0"
              :precision="2"
              :placeholder="$t('productForm.placeholder.originalPrice')"
              style="width: 200px"
            />
          </a-form-item>
          <a-form-item
            field="type"
            :label="$t('productForm.label.type')"
            :rules="[{ required: true, message: $t('productForm.rules.type') }]"
          >
            <a-radio-group v-model="formModel.type">
              <a-radio value="physical">{{ $t('productForm.type.physical') }}</a-radio>
              <a-radio value="digital">{{ $t('productForm.type.digital') }}</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item field="status" :label="$t('productForm.label.status')">
            <a-select v-model="formModel.status" style="width: 200px">
              <a-option value="draft">{{ $t('productForm.status.draft') }}</a-option>
              <a-option value="on_sale">{{ $t('productForm.status.onSale') }}</a-option>
              <a-option value="off_sale">{{ $t('productForm.status.offSale') }}</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="categoryId" :label="$t('productForm.label.categoryId')">
            <a-select
              v-model="formModel.categoryId"
              :placeholder="$t('productForm.placeholder.categoryId')"
              style="width: 200px"
            >
              <a-option value="cat-1">经典绘本</a-option>
              <a-option value="cat-2">科普百科</a-option>
              <a-option value="cat-3">情商培养</a-option>
              <a-option value="cat-4">习惯养成</a-option>
            </a-select>
          </a-form-item>
          <!-- Section 2: 纸质版专属 -->
          <template v-if="formModel.type === 'physical'">
            <a-divider />
            <a-typography-title :heading="6">
              {{ $t('productForm.section.physical') }}
            </a-typography-title>
            <a-form-item field="spec" :label="$t('productForm.label.spec')">
              <a-select v-model="formModel.spec" style="width: 200px">
                <a-option value="A4">A4</a-option>
                <a-option value="A5">A5</a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="shippingTemplateId" :label="$t('productForm.label.shippingTemplateId')">
              <a-select
                v-model="formModel.shippingTemplateId"
                :placeholder="$t('productForm.placeholder.shippingTemplateId')"
                style="width: 300px"
              >
                <a-option value="tpl-1">默认运费模板</a-option>
                <a-option value="tpl-2">偏远地区运费模板</a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="freeShippingNote" :label="$t('productForm.label.freeShippingNote')">
              <a-input
                v-model="formModel.freeShippingNote"
                :placeholder="$t('productForm.placeholder.freeShippingNote')"
              />
            </a-form-item>
            <a-form-item field="stockEnabled" :label="$t('productForm.label.stockEnabled')">
              <a-switch v-model="formModel.stockEnabled" />
            </a-form-item>
            <a-form-item
              v-if="formModel.stockEnabled"
              field="stock"
              :label="$t('productForm.label.stock')"
            >
              <a-input-number
                v-model="formModel.stock"
                :min="0"
                style="width: 200px"
              />
            </a-form-item>
          </template>
          <!-- Section 3: 电子版专属 -->
          <template v-if="formModel.type === 'digital'">
            <a-divider />
            <a-typography-title :heading="6">
              {{ $t('productForm.section.digital') }}
            </a-typography-title>
            <a-form-item field="baiduPanUrl" :label="$t('productForm.label.baiduPanUrl')">
              <a-input
                v-model="formModel.baiduPanUrl"
                :placeholder="$t('productForm.placeholder.baiduPanUrl')"
              />
            </a-form-item>
            <a-form-item field="baiduPanCode" :label="$t('productForm.label.baiduPanCode')">
              <a-input
                v-model="formModel.baiduPanCode"
                :placeholder="$t('productForm.placeholder.baiduPanCode')"
                style="width: 200px"
              />
            </a-form-item>
            <a-form-item field="deliveryNote" :label="$t('productForm.label.deliveryNote')">
              <a-textarea
                v-model="formModel.deliveryNote"
                :placeholder="$t('productForm.placeholder.deliveryNote')"
                :auto-size="{ minRows: 2, maxRows: 4 }"
              />
            </a-form-item>
            <a-form-item field="deliveryTemplate" :label="$t('productForm.label.deliveryTemplate')">
              <a-textarea
                v-model="formModel.deliveryTemplate"
                :placeholder="$t('productForm.placeholder.deliveryTemplate')"
                :auto-size="{ minRows: 2, maxRows: 4 }"
              />
            </a-form-item>
          </template>

          <!-- Section 4: 关联绘本 -->
          <a-divider />
          <a-typography-title :heading="6">
            {{ $t('productForm.section.bindBook') }}
          </a-typography-title>
          <a-form-item field="pictureBookId" :label="$t('productForm.label.pictureBookId')">
            <a-select
              v-model="formModel.pictureBookId"
              :placeholder="$t('productForm.placeholder.pictureBookId')"
              style="width: 300px"
              allow-clear
            >
              <a-option value="book-1">小王子</a-option>
              <a-option value="book-2">猜猜我有多爱你</a-option>
              <a-option value="book-3">好饿的毛毛虫</a-option>
              <a-option value="book-4">大卫不可以</a-option>
              <a-option value="book-5">逃家小兔</a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <!-- Bottom Action Bar -->
        <div class="action-bar">
          <a-space>
            <a-button type="primary" :loading="submitLoading" @click="handleSubmit">
              {{ $t('productForm.action.save') }}
            </a-button>
            <a-button @click="handleCancel">
              {{ $t('productForm.action.cancel') }}
            </a-button>
          </a-space>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import {
    getProductDetail,
    createProduct,
    updateProduct,
  } from '@/api/product';
  import Breadcrumb from '@/components/breadcrumb/index.vue';

  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const { loading, setLoading } = useLoading(false);
  const submitLoading = ref(false);
  const formRef = ref();

  const isEdit = computed(() => route.name === 'ProductEdit');
  const productId = computed(() => route.params.id as string);

  const generateFormModel = () => ({
    name: '',
    coverUrl: '',
    imagesStr: '',
    description: '',
    detail: '',
    price: undefined as number | undefined,
    originalPrice: undefined as number | undefined,
    type: 'physical',
    status: 'draft',
    categoryId: '',
    spec: 'A4',
    shippingTemplateId: '',
    freeShippingNote: '',
    stockEnabled: false,
    stock: 0,
    baiduPanUrl: '',
    baiduPanCode: '',
    deliveryNote: '',
    deliveryTemplate: '',
    pictureBookId: '',
  });

  const formModel = ref(generateFormModel());

  const fetchDetail = async () => {
    if (!isEdit.value) return;
    setLoading(true);
    try {
      const { data } = await getProductDetail(productId.value);
      formModel.value = {
        ...generateFormModel(),
        ...data,
        imagesStr: (data.images || []).join(','),
      };
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const res = await formRef.value?.validate();
    if (res) return;
    submitLoading.value = true;
    try {
      const submitData = {
        ...formModel.value,
        images: formModel.value.imagesStr
          ? formModel.value.imagesStr.split(',')
          : [],
      };
      if (isEdit.value) {
        await updateProduct(productId.value, submitData);
      } else {
        await createProduct(submitData);
      }
      Message.success(t('productForm.action.saveSuccess'));
      router.push({ name: 'ProductList' });
    } catch (err) {
      // handle error
    } finally {
      submitLoading.value = false;
    }
  };

  const handleCancel = () => {
    router.back();
  };

  fetchDetail();
</script>

<script lang="ts">
  export default {
    name: 'ProductForm',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 0 20px 20px 20px;
  }
  .action-bar {
    margin-top: 20px;
    padding: 10px 0;
    text-align: center;
  }
</style>
