import axios from 'axios';
import qs from 'query-string';
import {
  BusinessUserRecord,
  BusinessUserParams,
  BusinessUserListRes,
  PointsRecord,
  PointsRecordParams,
  PointsRecordListRes,
  PointsAdjustForm,
} from '@/types/business-user';

export function queryUserList(params: BusinessUserParams) {
  return axios.get<BusinessUserListRes>('/api/user-manage/list', {
    params,
    paramsSerializer: (obj) => qs.stringify(obj),
  });
}

export function getUserDetail(id: string) {
  return axios.get<BusinessUserRecord>(`/api/user-manage/${id}`);
}

export function adjustUserPoints(data: PointsAdjustForm) {
  return axios.post('/api/user-manage/adjust-points', data);
}

export function addUserRemark(id: string, remark: string) {
  return axios.put(`/api/user-manage/${id}/remark`, { remark });
}

export function toggleUserStatus(id: string, status: string) {
  return axios.put(`/api/user-manage/${id}/status`, { status });
}

export function queryPointsRecords(params: PointsRecordParams) {
  return axios.get<PointsRecordListRes>('/api/user-manage/points-records', {
    params,
    paramsSerializer: (obj) => qs.stringify(obj),
  });
}
