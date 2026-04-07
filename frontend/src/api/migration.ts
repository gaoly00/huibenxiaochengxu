import axios from 'axios';
import qs from 'query-string';
import { MigrationTaskRecord, MigrationTaskParams, MigrationTaskListRes } from '@/types/system';

export function queryMigrationTaskList(params: MigrationTaskParams) {
  return axios.get<MigrationTaskListRes>('/api/migration/task/list', {
    params,
    paramsSerializer: (obj) => qs.stringify(obj),
  });
}

export function createMigrationTask(data: Partial<MigrationTaskRecord>) {
  return axios.post('/api/migration/task/create', data);
}

export function executeMigrationTask(id: string) {
  return axios.post(`/api/migration/task/${id}/execute`);
}

export function getMigrationTaskDetail(id: string) {
  return axios.get<MigrationTaskRecord>(`/api/migration/task/${id}`);
}
