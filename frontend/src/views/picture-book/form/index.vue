<template>
  <div class="container">
    <Breadcrumb
      :items="['menu.pictureBook', isEdit ? 'menu.pictureBook.edit' : 'menu.pictureBook.create']"
    />
    <a-space direction="vertical" :size="16" fill>
      <!-- Section 1: 基础信息 -->
      <a-card class="general-card" :title="$t('pictureBookForm.section.basic')">
        <a-form
          ref="formRef"
          :model="formData"
          :label-col-props="{ span: 4 }"
          :wrapper-col-props="{ span: 18 }"
          label-align="left"
        >
          <a-form-item field="title" :label="$t('pictureBookForm.label.title')" :rules="[{ required: true, message: $t('pictureBookForm.rules.title') }]">
            <a-input v-model="formData.title" :placeholder="$t('pictureBookForm.placeholder.title')" />
          </a-form-item>
          <a-form-item field="subtitle" :label="$t('pictureBookForm.label.subtitle')">
            <a-input v-model="formData.subtitle" :placeholder="$t('pictureBookForm.placeholder.subtitle')" />
          </a-form-item>
          <a-form-item field="coverUrl" :label="$t('pictureBookForm.label.coverUrl')">
            <a-upload
              :auto-upload="false"
              list-type="picture-card"
              :limit="1"
              :file-list="coverFileList"
              @change="handleCoverChange"
            />
          </a-form-item>
          <a-form-item field="detail" :label="$t('pictureBookForm.label.detail')">
            <div style="border: 1px solid #e5e6eb; border-radius: 4px; width: 100%; z-index: 100;">
              <Toolbar
                style="border-bottom: 1px solid #e5e6eb"
                :editor="editorRef"
                :default-config="toolbarConfig"
                mode="default"
              />
              <Editor
                v-model="formData.detail"
                style="height: 360px; overflow-y: hidden"
                :default-config="editorConfig"
                mode="default"
                @on-created="handleEditorCreated"
              />
            </div>
          </a-form-item>
        </a-form>
      </a-card>
      <!-- Section 2: 分类与推荐 -->
      <a-card class="general-card" :title="$t('pictureBookForm.section.classify')">
        <a-form
          :model="formData"
          :label-col-props="{ span: 4 }"
          :wrapper-col-props="{ span: 18 }"
          label-align="left"
        >
          <a-form-item field="categoryId" :label="$t('pictureBookForm.label.categoryId')" :rules="[{ required: true, message: $t('pictureBookForm.rules.categoryId') }]">
            <a-select v-model="formData.categoryId" :placeholder="$t('pictureBookForm.placeholder.categoryId')">
              <a-option v-for="c in categoryOptions" :key="c.id" :value="c.id">{{ c.name }}</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="ageGroup" :label="$t('pictureBookForm.label.ageGroup')">
            <a-select v-model="formData.ageGroup" :placeholder="$t('pictureBookForm.placeholder.ageGroup')">
              <a-option value="0-3">0-3岁</a-option>
              <a-option value="3-6">3-6岁</a-option>
              <a-option value="6-9">6-9岁</a-option>
              <a-option value="9-12">9-12岁</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="tags" :label="$t('pictureBookForm.label.tags')">
            <a-select v-model="formData.tags" multiple :placeholder="$t('pictureBookForm.placeholder.tags')">
              <a-option v-for="tag in tagOptions" :key="tag.id" :value="tag.name">{{ tag.name }}</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="keywords" :label="$t('pictureBookForm.label.keywords')">
            <a-input v-model="formData.keywords" :placeholder="$t('pictureBookForm.placeholder.keywords')" />
          </a-form-item>
          <a-form-item field="sortOrder" :label="$t('pictureBookForm.label.sortOrder')">
            <a-input-number v-model="formData.sortOrder" :min="0" />
          </a-form-item>
          <a-form-item field="isHomepageRecommend" :label="$t('pictureBookForm.label.isHomepageRecommend')">
            <a-switch v-model="formData.isHomepageRecommend" />
          </a-form-item>
          <a-form-item field="isSmartRecommend" :label="$t('pictureBookForm.label.isSmartRecommend')">
            <a-switch v-model="formData.isSmartRecommend" />
          </a-form-item>
          <a-form-item field="status" :label="$t('pictureBookForm.label.status')">
            <a-select v-model="formData.status" :placeholder="$t('pictureBookForm.placeholder.status')">
              <a-option value="draft">{{ $t('pictureBookForm.status.draft') }}</a-option>
              <a-option value="published">{{ $t('pictureBookForm.status.published') }}</a-option>
              <a-option value="offline">{{ $t('pictureBookForm.status.offline') }}</a-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-card>
      <!-- Section 3: 阅读配置 -->
      <a-card class="general-card" :title="$t('pictureBookForm.section.reading')">
        <a-form
          :model="formData"
          :label-col-props="{ span: 4 }"
          :wrapper-col-props="{ span: 18 }"
          label-align="left"
        >
          <a-form-item field="pdfUrl" :label="$t('pictureBookForm.label.pdfUpload')">
            <a-upload
              :auto-upload="false"
              accept=".pdf"
              :limit="1"
              :file-list="pdfFileList"
              @change="handlePdfChange"
            >
              <template #upload-button>
                <a-button type="primary">
                  <template #icon><icon-upload /></template>
                  {{ $t('pictureBookForm.label.uploadPdf') }}
                </a-button>
              </template>
            </a-upload>
          </a-form-item>
          <a-form-item :label="$t('pictureBookForm.label.pdfConvertStatus')">
            <a-tag v-if="formData.pdfConvertStatus === 'success'" color="green">{{ $t('pictureBookForm.pdfStatus.success') }}</a-tag>
            <a-tag v-else-if="formData.pdfConvertStatus === 'failed'" color="red">{{ $t('pictureBookForm.pdfStatus.failed') }}</a-tag>
            <a-tag v-else-if="formData.pdfConvertStatus === 'converting'" color="blue">{{ $t('pictureBookForm.pdfStatus.converting') }}</a-tag>
            <a-tag v-else-if="formData.pdfConvertStatus === 'pending'" color="orange">{{ $t('pictureBookForm.pdfStatus.pending') }}</a-tag>
            <a-tag v-else color="gray">{{ $t('pictureBookForm.pdfStatus.notUploaded') }}</a-tag>
          </a-form-item>
          <a-form-item :label="$t('pictureBookForm.label.pageCount')">
            <span>{{ formData.pageCount || 0 }}</span>
          </a-form-item>
          <a-form-item field="allowOnlineReading" :label="$t('pictureBookForm.label.allowOnlineReading')">
            <a-switch v-model="formData.allowOnlineReading" />
          </a-form-item>
          <a-form-item field="readingClarity" :label="$t('pictureBookForm.label.readingClarity')">
            <a-select v-model="formData.readingClarity" :placeholder="$t('pictureBookForm.placeholder.readingClarity')">
              <a-option value="low">{{ $t('pictureBookForm.clarity.low') }}</a-option>
              <a-option value="medium">{{ $t('pictureBookForm.clarity.medium') }}</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="readingEndGuideText" :label="$t('pictureBookForm.label.readingEndGuideText')">
            <a-textarea v-model="formData.readingEndGuideText" :placeholder="$t('pictureBookForm.placeholder.readingEndGuideText')" :auto-size="{ minRows: 2 }" />
          </a-form-item>
        </a-form>
      </a-card>
      <!-- Section 4: 商品关联 -->
      <a-card class="general-card" :title="$t('pictureBookForm.section.product')">
        <a-form
          :model="formData"
          :label-col-props="{ span: 4 }"
          :wrapper-col-props="{ span: 18 }"
          label-align="left"
        >
          <a-form-item field="physicalProductId" :label="$t('pictureBookForm.label.physicalProductId')">
            <a-select v-model="formData.physicalProductId" :placeholder="$t('pictureBookForm.placeholder.physicalProductId')" allow-clear>
              <a-option v-for="p in physicalProducts" :key="p.id" :value="p.id">{{ p.name }}</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="digitalProductId" :label="$t('pictureBookForm.label.digitalProductId')">
            <a-select v-model="formData.digitalProductId" :placeholder="$t('pictureBookForm.placeholder.digitalProductId')" allow-clear>
              <a-option v-for="p in digitalProducts" :key="p.id" :value="p.id">{{ p.name }}</a-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-card>

      <!-- Bottom Action Bar -->
      <div class="action-bar">
        <a-space>
          <a-button type="primary" :loading="submitLoading" @click="handleSave">
            {{ $t('pictureBookForm.save') }}
          </a-button>
          <a-button @click="handleCancel">
            {{ $t('pictureBookForm.cancel') }}
          </a-button>
        </a-space>
      </div>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, shallowRef, onBeforeUnmount } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
  import type { IDomEditor, IToolbarConfig, IEditorConfig } from '@wangeditor/editor';
  import '@wangeditor/editor/dist/css/style.css';
  import useLoading from '@/hooks/loading';
  import { PictureBookRecord } from '@/types/picture-book';
  import {
    getPictureBookDetail,
    createPictureBook,
    updatePictureBook,
  } from '@/api/picture-book';
  import { queryCategoryList, queryTagList } from '@/api/picture-book';

  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const { loading: submitLoading, setLoading: setSubmitLoading } = useLoading(false);

  const isEdit = computed(() => route.name === 'PictureBookEdit');
  const bookId = computed(() => route.params.id as string);

  const formRef = ref();
  const coverFileList = ref<any[]>([]);
  const pdfFileList = ref<any[]>([]);
  const categoryOptions = ref<{ id: string; name: string }[]>([]);
  const tagOptions = ref<{ id: string; name: string }[]>([]);
  const physicalProducts = ref<{ id: string; name: string }[]>([]);
  const digitalProducts = ref<{ id: string; name: string }[]>([]);

  // wangeditor
  const editorRef = shallowRef<IDomEditor>();
  const toolbarConfig: Partial<IToolbarConfig> = {};
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入详情内容...',
  };
  const handleEditorCreated = (editor: IDomEditor) => {
    editorRef.value = editor;
  };
  onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor) editor.destroy();
  });

  const generateFormData = (): Partial<PictureBookRecord> => ({
    title: '',
    subtitle: '',
    coverUrl: '',
    detail: '',
    categoryId: '',
    ageGroup: undefined,
    tags: [],
    keywords: '',
    sortOrder: 0,
    isHomepageRecommend: false,
    isSmartRecommend: false,
    status: 'draft' as any,
    pdfUrl: '',
    pdfConvertStatus: 'not_uploaded' as any,
    pageCount: 0,
    allowOnlineReading: false,
    readingClarity: 'medium' as any,
    readingEndGuideText: '',
    physicalProductId: '',
    digitalProductId: '',
  });

  const formData = ref(generateFormData());

  const handleCoverChange = (_: any, currentFile: any) => {
    coverFileList.value = currentFile ? [currentFile] : [];
  };

  const handlePdfChange = (_: any, currentFile: any) => {
    pdfFileList.value = currentFile ? [currentFile] : [];
    // 从 PDF 第一页提取封面
    if (currentFile?.file) {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        try {
          const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
          const pdfjsLib = await import('pdfjs-dist');
          pdfjsLib.GlobalWorkerOptions.workerSrc = '';
          const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d')!;
          await page.render({ canvasContext: ctx, viewport }).promise;
          const dataUrl = canvas.toDataURL('image/png');
          formData.value.coverUrl = dataUrl;
          coverFileList.value = [
            { uid: 'pdf-cover', name: 'cover.png', url: dataUrl },
          ];
          Message.success('已从PDF第一页提取封面');
        } catch (e) {
          // PDF.js 未安装时静默失败，用户可手动上传封面
          console.warn('PDF封面提取失败，请手动上传封面', e);
        }
      };
      fileReader.readAsArrayBuffer(currentFile.file);
    }
  };

  const fetchDetail = async () => {
    if (!isEdit.value) return;
    try {
      const { data } = await getPictureBookDetail(bookId.value);
      formData.value = { ...data };
    } catch (e) {
      // ignore
    }
  };

  const fetchOptions = async () => {
    try {
      const [catRes, tagRes] = await Promise.all([
        queryCategoryList({ current: 1, pageSize: 100 }),
        queryTagList({ current: 1, pageSize: 100 }),
      ]);
      categoryOptions.value = catRes.data.list.map((c) => ({ id: c.id, name: c.name }));
      tagOptions.value = tagRes.data.list.map((t2) => ({ id: t2.id, name: t2.name }));
    } catch (e) {
      // ignore
    }
  };

  const handleSave = async () => {
    setSubmitLoading(true);
    try {
      if (isEdit.value) {
        await updatePictureBook(bookId.value, formData.value);
      } else {
        await createPictureBook(formData.value);
      }
      Message.success(t('pictureBookForm.saveSuccess'));
      router.push({ name: 'PictureBookList' });
    } catch (e) {
      // ignore
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    router.push({ name: 'PictureBookList' });
  };

  fetchOptions();
  fetchDetail();
</script>

<script lang="ts">
  export default {
    name: 'PictureBookForm',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 0 20px 20px 20px;
  }
  .action-bar {
    display: flex;
    justify-content: flex-end;
    padding: 16px 0;
  }
</style>
