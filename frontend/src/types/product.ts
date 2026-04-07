import { ProductType, ProductStatus, ProductSpec, EnableStatus } from './enums';

export interface ProductRecord {
  id: string;
  name: string;
  type: ProductType;
  coverUrl: string;
  images: string[];
  description: string;
  detail: string;
  price: number;
  originalPrice: number;
  status: ProductStatus;
  categoryId: string;
  categoryName: string;
  // 关联绘本
  pictureBookId: string;
  pictureBookTitle: string;
  // 纸质版专属
  spec: ProductSpec;
  shippingTemplateId: string;
  shippingTemplateName: string;
  freeShippingNote: string;
  stockEnabled: boolean;
  stock: number;
  // 电子版专属
  baiduPanUrl: string;
  baiduPanCode: string;
  deliveryNote: string;
  deliveryTemplate: string;
  sales: number;
  createdTime: string;
  updatedTime: string;
}

export interface ProductParams extends Partial<ProductRecord> {
  current: number;
  pageSize: number;
}

export interface ProductListRes {
  list: ProductRecord[];
  total: number;
}

// 运费模板
export interface ShippingTemplateRecord {
  id: string;
  name: string;
  chargeDescription: string;
  freeShippingRule: string;
  status: EnableStatus;
  createdTime: string;
  updatedTime: string;
}

export interface ShippingTemplateParams {
  name?: string;
  status?: EnableStatus;
  current: number;
  pageSize: number;
}

export interface ShippingTemplateListRes {
  list: ShippingTemplateRecord[];
  total: number;
}
