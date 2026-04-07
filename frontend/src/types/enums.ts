// ========== 绘本相关 ==========
export enum PictureBookStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  OFFLINE = 'offline',
}

export enum PdfConvertStatus {
  NOT_UPLOADED = 'not_uploaded',
  PENDING = 'pending',
  CONVERTING = 'converting',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export enum AgeGroup {
  AGE_0_3 = '0-3',
  AGE_3_6 = '3-6',
  AGE_6_9 = '6-9',
  AGE_9_12 = '9-12',
}

export enum ReadingClarity {
  LOW = 'low',
  MEDIUM = 'medium',
}

// ========== 商品相关 ==========
export enum ProductType {
  PHYSICAL = 'physical',
  DIGITAL = 'digital',
}

export enum ProductStatus {
  DRAFT = 'draft',
  ON_SALE = 'on_sale',
  OFF_SALE = 'off_sale',
}

export enum ProductSpec {
  A4 = 'A4',
  A5 = 'A5',
}

// ========== 订单相关 ==========
export enum OrderType {
  PHYSICAL = 'physical',
  DIGITAL = 'digital',
}

export enum OrderStatus {
  PENDING_PAYMENT = 'pending_payment',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDING = 'refunding',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

export enum ShippingStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
}

// ========== 电子版交付 ==========
export enum DeliveryStatus {
  PENDING = 'pending',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

// ========== 用户相关 ==========
export enum UserStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

export enum PointsChangeType {
  REGISTER = 'register',
  CHECK_IN = 'check_in',
  SHOWCASE = 'showcase',
  PURCHASE = 'purchase',
  DEDUCTION = 'deduction',
  ADMIN_ADJUST = 'admin_adjust',
}

export enum PointsAdjustType {
  INCREASE = 'increase',
  DECREASE = 'decrease',
}

// ========== 评论晒单 ==========
export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum ShowcaseRewardStatus {
  PENDING = 'pending',
  REWARDED = 'rewarded',
  SKIPPED = 'skipped',
}

// ========== 通用 ==========
export enum EnableStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

// ========== 数据迁移 ==========
export enum MigrationType {
  USER = 'user',
  POINTS = 'points',
  INVITE = 'invite',
  DISTRIBUTION = 'distribution',
  ORDER = 'order',
}

export enum MigrationStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
}

// ========== 操作日志 ==========
export enum LogModule {
  PICTURE_BOOK = 'picture_book',
  PRODUCT = 'product',
  ORDER = 'order',
  USER = 'user',
  MARKETING = 'marketing',
  SYSTEM = 'system',
}

export enum LogAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  PUBLISH = 'publish',
  OFFLINE = 'offline',
}
