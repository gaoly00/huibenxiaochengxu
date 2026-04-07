import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';
// Dashboard
import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';
// 绘本
import localePBList from '@/views/picture-book/list/locale/zh-CN';
import localePBForm from '@/views/picture-book/form/locale/zh-CN';
import localePBCategory from '@/views/picture-book/category/locale/zh-CN';
import localePBTag from '@/views/picture-book/tag/locale/zh-CN';
// 商品
import localeProdList from '@/views/product/list/locale/zh-CN';
import localeProdForm from '@/views/product/form/locale/zh-CN';
import localeProdShipping from '@/views/product/shipping/locale/zh-CN';
// 订单
import localeOrderList from '@/views/order/list/locale/zh-CN';
import localeOrderDetail from '@/views/order/detail/locale/zh-CN';
// 用户
import localeUserList from '@/views/user-manage/list/locale/zh-CN';
import localeUserDetail from '@/views/user-manage/detail/locale/zh-CN';
// 评论晒单
import localeComments from '@/views/review/comments/locale/zh-CN';
import localeShowcases from '@/views/review/showcases/locale/zh-CN';
// 营销
import localePoints from '@/views/marketing/points/locale/zh-CN';
import localeCheckin from '@/views/marketing/checkin/locale/zh-CN';
import localeDistribution from '@/views/marketing/distribution/locale/zh-CN';
// 智能选书
import localeSmartKeywords from '@/views/smart-recommend/keywords/locale/zh-CN';
import localeSmartTemplates from '@/views/smart-recommend/templates/locale/zh-CN';
// 数据迁移
import localeMigration from '@/views/migration/tasks/locale/zh-CN';
// 系统
import localeSystemBasic from '@/views/system/basic/locale/zh-CN';
import localeSystemPayment from '@/views/system/payment/locale/zh-CN';
import localeSystemLogs from '@/views/system/logs/locale/zh-CN';
import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '工作台',
  'menu.dashboard.workplace': '工作台',
  'menu.pictureBook': '绘本内容管理',
  'menu.pictureBook.list': '绘本列表',
  'menu.pictureBook.create': '新增绘本',
  'menu.pictureBook.edit': '编辑绘本',
  'menu.pictureBook.categories': '分类管理',
  'menu.pictureBook.tags': '标签管理',
  'menu.product': '商品管理',
  'menu.product.list': '商品列表',
  'menu.product.create': '新增商品',
  'menu.product.edit': '编辑商品',
  'menu.product.shippingTemplates': '运费模板',
  'menu.order': '订单管理',
  'menu.order.list': '全部订单',
  'menu.order.physicalDetail': '纸质版订单详情',
  'menu.order.digitalDetail': '电子版订单详情',
  'menu.userManage': '用户管理',
  'menu.userManage.list': '用户列表',
  'menu.userManage.detail': '用户详情',
  'menu.review': '评论与晒单',
  'menu.review.comments': '评论管理',
  'menu.review.showcases': '晒单管理',
  'menu.marketing': '营销配置',
  'menu.marketing.points': '积分规则',
  'menu.marketing.checkin': '签到规则',
  'menu.marketing.distribution': '分销规则',
  'menu.smartRecommend': '智能选书',
  'menu.smartRecommend.keywords': '关键词映射',
  'menu.smartRecommend.templates': '推荐模板',
  'menu.migration': '数据迁移',
  'menu.migration.tasks': '迁移任务',
  'menu.system': '系统设置',
  'menu.system.basic': '基础设置',
  'menu.system.payment': '支付配置',
  'menu.system.logs': '操作日志',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
  ...localePBList,
  ...localePBForm,
  ...localePBCategory,
  ...localePBTag,
  ...localeProdList,
  ...localeProdForm,
  ...localeProdShipping,
  ...localeOrderList,
  ...localeOrderDetail,
  ...localeUserList,
  ...localeUserDetail,
  ...localeComments,
  ...localeShowcases,
  ...localePoints,
  ...localeCheckin,
  ...localeDistribution,
  ...localeSmartKeywords,
  ...localeSmartTemplates,
  ...localeMigration,
  ...localeSystemBasic,
  ...localeSystemPayment,
  ...localeSystemLogs,
};
