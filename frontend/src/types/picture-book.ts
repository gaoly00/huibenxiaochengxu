import {
  PictureBookStatus,
  PdfConvertStatus,
  AgeGroup,
  ReadingClarity,
  EnableStatus,
} from './enums';

// 绘本
export interface PictureBookRecord {
  id: string;
  title: string;
  subtitle: string;
  coverUrl: string;
  detail: string;
  categoryId: string;
  categoryName: string;
  ageGroup: AgeGroup;
  tags: string[];
  keywords: string;
  sortOrder: number;
  isHomepageRecommend: boolean;
  isSmartRecommend: boolean;
  status: PictureBookStatus;
  // PDF 阅读相关
  pdfUrl: string;
  pdfConvertStatus: PdfConvertStatus;
  pageCount: number;
  pageImages: string[];
  allowOnlineReading: boolean;
  readingClarity: ReadingClarity;
  readingEndGuideText: string;
  // 商品关联
  physicalProductId: string;
  physicalProductName: string;
  digitalProductId: string;
  digitalProductName: string;
  createdTime: string;
  updatedTime: string;
}

export interface PictureBookParams extends Partial<PictureBookRecord> {
  current: number;
  pageSize: number;
}

export interface PictureBookListRes {
  list: PictureBookRecord[];
  total: number;
}

// 分类
export interface CategoryRecord {
  id: string;
  name: string;
  sortOrder: number;
  status: EnableStatus;
  createdTime: string;
  updatedTime: string;
}

export interface CategoryParams {
  name?: string;
  status?: EnableStatus;
  current: number;
  pageSize: number;
}

export interface CategoryListRes {
  list: CategoryRecord[];
  total: number;
}

// 标签
export interface TagRecord {
  id: string;
  name: string;
  sortOrder: number;
  isSmartKeyword: boolean;
  status: EnableStatus;
  createdTime: string;
  updatedTime: string;
}

export interface TagParams {
  name?: string;
  status?: EnableStatus;
  current: number;
  pageSize: number;
}

export interface TagListRes {
  list: TagRecord[];
  total: number;
}
