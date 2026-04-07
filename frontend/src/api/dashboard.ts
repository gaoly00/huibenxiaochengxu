import axios from 'axios';

export interface DashboardStats {
  todayOrders: number;
  todaySales: number;
  pendingShipment: number;
  digitalDeliverySuccess: number;
  newUsers: number;
}

export interface RankItem {
  id: string;
  name: string;
  cover: string;
  count: number;
}

export function queryDashboardStats() {
  return axios.get<DashboardStats>('/api/dashboard/stats');
}

export function queryHotPictureBooks() {
  return axios.get<RankItem[]>('/api/dashboard/hot-picture-books');
}

export function queryHotProducts() {
  return axios.get<RankItem[]>('/api/dashboard/hot-products');
}
