import { UserStatus, PointsChangeType, PointsAdjustType } from './enums';

export interface BusinessUserRecord {
  id: string;
  openId: string;
  nickname: string;
  avatar: string;
  phone: string;
  points: number;
  totalPoints: number;
  status: UserStatus;
  // 邀请关系
  inviterId: string;
  inviterNickname: string;
  // 分销
  distributionLevel: number;
  distributionParentId: string;
  distributionParentNickname: string;
  totalCommission: number;
  // 统计
  orderCount: number;
  lastOrderTime: string;
  remark: string;
  registrationTime: string;
  updatedTime: string;
}

export interface BusinessUserParams {
  nickname?: string;
  phone?: string;
  status?: UserStatus;
  current: number;
  pageSize: number;
}

export interface BusinessUserListRes {
  list: BusinessUserRecord[];
  total: number;
}

// 积分记录
export interface PointsRecord {
  id: string;
  userId: string;
  userNickname: string;
  changeType: PointsChangeType;
  points: number;
  balance: number;
  reason: string;
  remark: string;
  createdTime: string;
}

export interface PointsRecordParams {
  userId?: string;
  changeType?: PointsChangeType;
  current: number;
  pageSize: number;
}

export interface PointsRecordListRes {
  list: PointsRecord[];
  total: number;
}

// 积分调整表单
export interface PointsAdjustForm {
  userId: string;
  adjustType: PointsAdjustType;
  points: number;
  reason: string;
  remark: string;
}
