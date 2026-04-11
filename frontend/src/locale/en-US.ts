import localeMessageBox from '@/components/message-box/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';
// Dashboard
import localeWorkplace from '@/views/dashboard/workplace/locale/en-US';
// Picture Book
import localePBList from '@/views/picture-book/list/locale/en-US';
import localePBForm from '@/views/picture-book/form/locale/en-US';
import localePBCategory from '@/views/picture-book/category/locale/en-US';
import localePBTag from '@/views/picture-book/tag/locale/en-US';
import localePBShipping from '@/views/picture-book/shipping/locale/en-US';
// Order
import localeOrderList from '@/views/order/list/locale/en-US';
import localeOrderDetail from '@/views/order/detail/locale/en-US';
// User
import localeUserList from '@/views/user-manage/list/locale/en-US';
import localeUserDetail from '@/views/user-manage/detail/locale/en-US';
import localeUserLevel from '@/views/user-manage/level/locale/en-US';
import localeUserPointsRule from '@/views/user-manage/points-rule/locale/en-US';
// Review
import localeComments from '@/views/review/comments/locale/en-US';
// Marketing
import localeDistribution from '@/views/marketing/distribution/locale/en-US';
// Smart Recommend
import localeSmartKeywords from '@/views/smart-recommend/keywords/locale/en-US';
import localeSmartTemplates from '@/views/smart-recommend/templates/locale/en-US';
// Migration
import localeMigration from '@/views/migration/tasks/locale/en-US';
// System
import localeSystemBasic from '@/views/system/basic/locale/en-US';
import localeSystemPayment from '@/views/system/payment/locale/en-US';
import localeSystemLogs from '@/views/system/logs/locale/en-US';
import localeSettings from './en-US/settings';

export default {
  'menu.dashboard': 'Dashboard',
  'menu.dashboard.workplace': 'Workplace',
  'menu.pictureBook': 'Picture Books',
  'menu.pictureBook.list': 'Book List',
  'menu.pictureBook.create': 'Create Book',
  'menu.pictureBook.edit': 'Edit Book',
  'menu.pictureBook.categories': 'Categories',
  'menu.pictureBook.tags': 'Tags',
  'menu.pictureBook.shippingTemplates': 'Shipping Templates',
  'menu.order': 'Orders',
  'menu.order.list': 'All Orders',
  'menu.order.physicalDetail': 'Physical Order Detail',
  'menu.order.digitalDetail': 'Digital Order Detail',
  'menu.userManage': 'Users',
  'menu.userManage.list': 'User List',
  'menu.userManage.detail': 'User Detail',
  'menu.userManage.level': 'Member Levels',
  'menu.userManage.pointsRule': 'Points Rules',
  'menu.review': 'Reviews',
  'menu.review.comments': 'Reviews',
  'menu.marketing': 'Marketing',
  'menu.marketing.distribution': 'Distribution Rules',
  'menu.smartRecommend': 'Smart Recommend',
  'menu.smartRecommend.keywords': 'Keyword Mapping',
  'menu.smartRecommend.templates': 'Recommend Templates',
  'menu.migration': 'Data Migration',
  'menu.migration.tasks': 'Migration Tasks',
  'menu.system': 'System',
  'menu.system.basic': 'Basic Settings',
  'menu.system.payment': 'Payment Settings',
  'menu.system.logs': 'Operation Logs',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
  ...localePBList,
  ...localePBForm,
  ...localePBCategory,
  ...localePBTag,
  ...localePBShipping,
  ...localeOrderList,
  ...localeOrderDetail,
  ...localeUserList,
  ...localeUserDetail,
  ...localeUserLevel,
  ...localeUserPointsRule,
  ...localeComments,
  ...localeDistribution,
  ...localeSmartKeywords,
  ...localeSmartTemplates,
  ...localeMigration,
  ...localeSystemBasic,
  ...localeSystemPayment,
  ...localeSystemLogs,
};
