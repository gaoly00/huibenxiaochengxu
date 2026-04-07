import {
  OrderType,
  OrderStatus,
  PaymentStatus,
  ShippingStatus,
  DeliveryStatus,
} from './enums';

export interface OrderRecord {
  id: string;
  orderNo: string;
  userId: string;
  userNickname: string;
  userAvatar: string;
  orderType: OrderType;
  // 商品信息
  productId: string;
  productName: string;
  productCover: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  pointsDeduction: number;
  actualAmount: number;
  // 状态
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentTime: string;
  // 纸质版
  shippingStatus: ShippingStatus;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  logisticsCompany: string;
  logisticsNo: string;
  // 电子版
  deliveryStatus: DeliveryStatus;
  deliveryTime: string;
  baiduPanUrl: string;
  baiduPanCode: string;
  deliveryRetryCount: number;
  // 通用
  remark: string;
  createdTime: string;
  updatedTime: string;
}

export interface OrderParams {
  orderNo?: string;
  userNickname?: string;
  productName?: string;
  orderType?: OrderType;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  shippingStatus?: ShippingStatus;
  startTime?: string;
  endTime?: string;
  current: number;
  pageSize: number;
}

export interface OrderListRes {
  list: OrderRecord[];
  total: number;
}

// 交付日志
export interface DeliveryLogRecord {
  id: string;
  orderId: string;
  action: string;
  result: string;
  detail: string;
  operatorName: string;
  createdTime: string;
}
