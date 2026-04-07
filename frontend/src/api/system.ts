import axios from 'axios';
import qs from 'query-string';
import { BasicSettingConfig, PaymentSettingConfig, OperationLogParams, OperationLogListRes } from '@/types/system';

export function getBasicSetting() {
  return axios.get<BasicSettingConfig>('/api/system/basic-setting');
}

export function saveBasicSetting(data: BasicSettingConfig) {
  return axios.put('/api/system/basic-setting', data);
}

export function getPaymentSetting() {
  return axios.get<PaymentSettingConfig>('/api/system/payment-setting');
}

export function savePaymentSetting(data: PaymentSettingConfig) {
  return axios.put('/api/system/payment-setting', data);
}

export function queryOperationLogList(params: OperationLogParams) {
  return axios.get<OperationLogListRes>('/api/system/operation-log/list', {
    params,
    paramsSerializer: (obj) => qs.stringify(obj),
  });
}
