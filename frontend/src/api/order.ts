import axios from 'axios';
import qs from 'query-string';
import { OrderRecord, OrderParams, OrderListRes, DeliveryLogRecord } from '@/types/order';

export function queryOrderList(params: OrderParams) {
  return axios.get<OrderListRes>('/api/order/list', {
    params,
    paramsSerializer: (obj) => qs.stringify(obj),
  });
}

export function getOrderDetail(id: string) {
  return axios.get<OrderRecord>(`/api/order/${id}`);
}

export function shipOrder(id: string, data: { logisticsCompany: string; logisticsNo: string }) {
  return axios.put(`/api/order/${id}/ship`, data);
}

export function updateLogistics(id: string, data: { logisticsCompany: string; logisticsNo: string }) {
  return axios.put(`/api/order/${id}/logistics`, data);
}

export function addOrderRemark(id: string, remark: string) {
  return axios.put(`/api/order/${id}/remark`, { remark });
}

export function retryDelivery(id: string) {
  return axios.post(`/api/order/${id}/retry-delivery`);
}

export function manualDelivery(id: string, data: { baiduPanUrl: string; baiduPanCode: string }) {
  return axios.post(`/api/order/${id}/manual-delivery`, data);
}

export function queryDeliveryLogs(orderId: string) {
  return axios.get<DeliveryLogRecord[]>(`/api/order/${orderId}/delivery-logs`);
}

export function refundOrder(id: string) {
  return axios.post(`/api/order/${id}/refund`);
}
