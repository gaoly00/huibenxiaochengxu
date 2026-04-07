import axios from 'axios';
import { PointsRuleConfig, CheckInRuleConfig, DistributionRuleConfig } from '@/types/marketing';

export function getPointsRuleConfig() {
  return axios.get<PointsRuleConfig>('/api/marketing/points-rule');
}

export function savePointsRuleConfig(data: PointsRuleConfig) {
  return axios.put('/api/marketing/points-rule', data);
}

export function getCheckInRuleConfig() {
  return axios.get<CheckInRuleConfig>('/api/marketing/checkin-rule');
}

export function saveCheckInRuleConfig(data: CheckInRuleConfig) {
  return axios.put('/api/marketing/checkin-rule', data);
}

export function getDistributionRuleConfig() {
  return axios.get<DistributionRuleConfig>('/api/marketing/distribution-rule');
}

export function saveDistributionRuleConfig(data: DistributionRuleConfig) {
  return axios.put('/api/marketing/distribution-rule', data);
}
