import { ReviewStatus, ShowcaseRewardStatus } from './enums';

// 评论
export interface CommentRecord {
  id: string;
  userId: string;
  userNickname: string;
  userAvatar: string;
  targetType: 'picture_book' | 'product';
  targetId: string;
  targetName: string;
  content: string;
  rating: number;
  status: ReviewStatus;
  createdTime: string;
  updatedTime: string;
}

export interface CommentParams {
  userNickname?: string;
  targetName?: string;
  status?: ReviewStatus;
  current: number;
  pageSize: number;
}

export interface CommentListRes {
  list: CommentRecord[];
  total: number;
}

// 晒单
export interface ShowcaseRecord {
  id: string;
  userId: string;
  userNickname: string;
  userAvatar: string;
  orderId: string;
  orderNo: string;
  productId: string;
  productName: string;
  content: string;
  images: string[];
  status: ReviewStatus;
  rewardStatus: ShowcaseRewardStatus;
  rewardPoints: number;
  createdTime: string;
  updatedTime: string;
}

export interface ShowcaseParams {
  userNickname?: string;
  productName?: string;
  status?: ReviewStatus;
  rewardStatus?: ShowcaseRewardStatus;
  current: number;
  pageSize: number;
}

export interface ShowcaseListRes {
  list: ShowcaseRecord[];
  total: number;
}

// 积分规则配置
export interface PointsRuleConfig {
  registerPoints: number;
  checkInPoints: number;
  showcasePoints: number;
  pointsToYuanRate: number; // 多少积分抵1元
}

// 签到规则配置
export interface CheckInRuleConfig {
  enabled: boolean;
  dailyPoints: number;
  consecutiveDescription: string;
}

// 分销规则配置
export interface DistributionRuleConfig {
  enabled: boolean;
  levelDescription: string;
  level1CommissionRate: number;
  level2CommissionRate: number;
  ruleDescription: string;
}
