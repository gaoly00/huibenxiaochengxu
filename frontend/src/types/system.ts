import {
  EnableStatus,
  MigrationType,
  MigrationStatus,
  LogModule,
  LogAction,
} from './enums';

// ========== 智能选书 ==========
export interface SmartKeywordRecord {
  id: string;
  keyword: string;
  mappedCategories: string[];
  mappedTags: string[];
  recommendTemplateId: string;
  recommendTemplateName: string;
  weight: number;
  status: EnableStatus;
  createdTime: string;
  updatedTime: string;
}

export interface SmartKeywordParams {
  keyword?: string;
  status?: EnableStatus;
  current: number;
  pageSize: number;
}

export interface SmartKeywordListRes {
  list: SmartKeywordRecord[];
  total: number;
}

export interface SmartTemplateRecord {
  id: string;
  name: string;
  content: string;
  status: EnableStatus;
  createdTime: string;
  updatedTime: string;
}

export interface SmartTemplateParams {
  name?: string;
  status?: EnableStatus;
  current: number;
  pageSize: number;
}

export interface SmartTemplateListRes {
  list: SmartTemplateRecord[];
  total: number;
}

// ========== 数据迁移 ==========
export interface MigrationTaskRecord {
  id: string;
  name: string;
  migrationType: MigrationType;
  dataSourceDescription: string;
  status: MigrationStatus;
  successCount: number;
  failCount: number;
  createdTime: string;
  lastExecuteTime: string;
  log: string;
}

export interface MigrationTaskParams {
  name?: string;
  migrationType?: MigrationType;
  status?: MigrationStatus;
  current: number;
  pageSize: number;
}

export interface MigrationTaskListRes {
  list: MigrationTaskRecord[];
  total: number;
}

// ========== 系统设置 ==========
export interface BasicSettingConfig {
  appName: string;
  appDescription: string;
  contactInfo: string;
  pointsDeductionNote: string;
}

export interface PaymentSettingConfig {
  enabled: boolean;
  paymentNote: string;
  mchId: string;
  appId: string;
}

// ========== 操作日志 ==========
export interface OperationLogRecord {
  id: string;
  operatorName: string;
  module: LogModule;
  action: LogAction;
  summary: string;
  createdTime: string;
}

export interface OperationLogParams {
  operatorName?: string;
  module?: LogModule;
  startTime?: string;
  endTime?: string;
  current: number;
  pageSize: number;
}

export interface OperationLogListRes {
  list: OperationLogRecord[];
  total: number;
}
