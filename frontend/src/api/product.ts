import axios from 'axios';
import qs from 'query-string';
import {
  ProductRecord,
  ProductParams,
  ProductListRes,
  ShippingTemplateRecord,
  ShippingTemplateParams,
  ShippingTemplateListRes,
} from '@/types/product';

export function queryProductList(params: ProductParams) {
  return axios.get<ProductListRes>('/api/product/list', {
    params,
    paramsSerializer: (obj) => qs.stringify(obj),
  });
}

export function getProductDetail(id: string) {
  return axios.get<ProductRecord>(`/api/product/${id}`);
}

export function createProduct(data: Partial<ProductRecord>) {
  return axios.post('/api/product/create', data);
}

export function updateProduct(id: string, data: Partial<ProductRecord>) {
  return axios.put(`/api/product/${id}`, data);
}

export function deleteProduct(id: string) {
  return axios.delete(`/api/product/${id}`);
}

export function toggleProductStatus(id: string, status: string) {
  return axios.put(`/api/product/${id}/status`, { status });
}

// 运费模板
export function queryShippingTemplateList(params: ShippingTemplateParams) {
  return axios.get<ShippingTemplateListRes>('/api/product/shipping-template/list', {
    params,
    paramsSerializer: (obj) => qs.stringify(obj),
  });
}

export function createShippingTemplate(data: Partial<ShippingTemplateRecord>) {
  return axios.post('/api/product/shipping-template/create', data);
}

export function updateShippingTemplate(id: string, data: Partial<ShippingTemplateRecord>) {
  return axios.put(`/api/product/shipping-template/${id}`, data);
}

export function deleteShippingTemplate(id: string) {
  return axios.delete(`/api/product/shipping-template/${id}`);
}
