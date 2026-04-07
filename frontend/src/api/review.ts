import axios from 'axios';
import qs from 'query-string';
import { CommentRecord, CommentParams, CommentListRes, ShowcaseRecord, ShowcaseParams, ShowcaseListRes } from '@/types/marketing';

export function queryCommentList(params: CommentParams) {
  return axios.get<CommentListRes>('/api/review/comment/list', {
    params,
    paramsSerializer: (obj) => qs.stringify(obj),
  });
}

export function approveComment(id: string) {
  return axios.put(`/api/review/comment/${id}/approve`);
}

export function rejectComment(id: string) {
  return axios.put(`/api/review/comment/${id}/reject`);
}

export function deleteComment(id: string) {
  return axios.delete(`/api/review/comment/${id}`);
}

export function queryShowcaseList(params: ShowcaseParams) {
  return axios.get<ShowcaseListRes>('/api/review/showcase/list', {
    params,
    paramsSerializer: (obj) => qs.stringify(obj),
  });
}

export function approveShowcase(id: string) {
  return axios.put(`/api/review/showcase/${id}/approve`);
}

export function rejectShowcase(id: string) {
  return axios.put(`/api/review/showcase/${id}/reject`);
}

export function rewardShowcase(id: string) {
  return axios.post(`/api/review/showcase/${id}/reward`);
}
