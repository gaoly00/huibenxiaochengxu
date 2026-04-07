import axios from 'axios';
import qs from 'query-string';
import {
  SmartKeywordRecord,
  SmartKeywordParams,
  SmartKeywordListRes,
  SmartTemplateRecord,
  SmartTemplateParams,
  SmartTemplateListRes,
} from '@/types/system';

export function queryKeywordList(params: SmartKeywordParams) {
  return axios.get<SmartKeywordListRes>('/api/smart-recommend/keyword/list', {
    params,
    paramsSerializer: (obj) => qs.stringify(obj),
  });
}

export function createKeyword(data: Partial<SmartKeywordRecord>) {
  return axios.post('/api/smart-recommend/keyword/create', data);
}

export function updateKeyword(id: string, data: Partial<SmartKeywordRecord>) {
  return axios.put(`/api/smart-recommend/keyword/${id}`, data);
}

export function deleteKeyword(id: string) {
  return axios.delete(`/api/smart-recommend/keyword/${id}`);
}

export function queryTemplateList(params: SmartTemplateParams) {
  return axios.get<SmartTemplateListRes>('/api/smart-recommend/template/list', {
    params,
    paramsSerializer: (obj) => qs.stringify(obj),
  });
}

export function createTemplate(data: Partial<SmartTemplateRecord>) {
  return axios.post('/api/smart-recommend/template/create', data);
}

export function updateTemplate(id: string, data: Partial<SmartTemplateRecord>) {
  return axios.put(`/api/smart-recommend/template/${id}`, data);
}

export function deleteTemplate(id: string) {
  return axios.delete(`/api/smart-recommend/template/${id}`);
}
