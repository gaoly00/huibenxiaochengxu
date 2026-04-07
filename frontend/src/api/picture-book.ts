import axios from 'axios';
import qs from 'query-string';
import {
  PictureBookRecord,
  PictureBookParams,
  PictureBookListRes,
  CategoryRecord,
  CategoryParams,
  CategoryListRes,
  TagRecord,
  TagParams,
  TagListRes,
} from '@/types/picture-book';

export function queryPictureBookList(params: PictureBookParams) {
  return axios.get<PictureBookListRes>('/api/picture-book/list', {
    params,
    paramsSerializer: (obj) => qs.stringify(obj),
  });
}

export function getPictureBookDetail(id: string) {
  return axios.get<PictureBookRecord>(`/api/picture-book/${id}`);
}

export function createPictureBook(data: Partial<PictureBookRecord>) {
  return axios.post('/api/picture-book/create', data);
}

export function updatePictureBook(id: string, data: Partial<PictureBookRecord>) {
  return axios.put(`/api/picture-book/${id}`, data);
}

export function deletePictureBook(id: string) {
  return axios.delete(`/api/picture-book/${id}`);
}

export function togglePictureBookStatus(id: string, status: string) {
  return axios.put(`/api/picture-book/${id}/status`, { status });
}

export function retryPdfConvert(id: string) {
  return axios.post(`/api/picture-book/${id}/retry-convert`);
}

// 分类
export function queryCategoryList(params: CategoryParams) {
  return axios.get<CategoryListRes>('/api/picture-book/category/list', {
    params,
    paramsSerializer: (obj) => qs.stringify(obj),
  });
}

export function createCategory(data: Partial<CategoryRecord>) {
  return axios.post('/api/picture-book/category/create', data);
}

export function updateCategory(id: string, data: Partial<CategoryRecord>) {
  return axios.put(`/api/picture-book/category/${id}`, data);
}

export function deleteCategory(id: string) {
  return axios.delete(`/api/picture-book/category/${id}`);
}

// 标签
export function queryTagList(params: TagParams) {
  return axios.get<TagListRes>('/api/picture-book/tag/list', {
    params,
    paramsSerializer: (obj) => qs.stringify(obj),
  });
}

export function createTag(data: Partial<TagRecord>) {
  return axios.post('/api/picture-book/tag/create', data);
}

export function updateTag(id: string, data: Partial<TagRecord>) {
  return axios.put(`/api/picture-book/tag/${id}`, data);
}

export function deleteTag(id: string) {
  return axios.delete(`/api/picture-book/tag/${id}`);
}
