import localeMessageBox from '@/components/message-box/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';
// Dashboard
import localeWorkplace from '@/views/dashboard/workplace/locale/en-US';
// Picture Book
import localePBList from '@/views/picture-book/list/locale/en-US';
import localePBForm from '@/views/picture-book/form/locale/en-US';
import localePBCategory from '@/views/picture-book/category/locale/en-US';
import localePBTag from '@/views/picture-book/tag/locale/en-US';
// Product
import localeProdList from '@/views/product/list/locale/en-US';
import localeProdForm from '@/views/product/form/locale/en-US';
import localeProdShipping from '@/views/product/shipping/locale/en-US';
// Order
import localeOrderList from '@/views/order/list/locale/en-US';
import localeOrderDetail from '@/views/order/detail/locale/en-US';
// User
import localeUserList from '@/views/user-manage/list/locale/en-US';
import localeUserDetail from '@/views/user-manage/detail/locale/en-US';
// Review
import localeComments from '@/views/review/comments/locale/en-US';
import localeShowcases from '@/views/review/showcases/locale/en-US';
// Marketing
import localePoints from '@/views/marketing/points/locale/en-US';
import localeCheckin from '@/views/marketing/checkin/locale/en-US';
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
  'menu.product': 'Products',
  'menu.product.list': 'Product List',
  'menu.product.create': 'Create Product',
  'menu.product.edit': 'Edit Product',
  'menu.product.shippingTemplates': 'Shipping Templates',
  'menu.order': 'Orders',
  'menu.order.list': 'All Orders',
  'menu.order.physicalDetail': 'Physical Order Detail',
  'menu.order.digitalDetail': 'Digital Order Detail',
  'menu.userManage': 'Users',
  'menu.userManage.list': 'User List',
  'menu.userManage.detail': 'User Detail',
  'menu.review': 'Reviews',
  'menu.review.comments': 'Comments',
  'menu.review.showcases': 'Showcases',
  'menu.marketing': 'Marketing',
  'menu.marketing.points': 'Points Rules',
  'menu.marketing.checkin': 'Check-in Rules',
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
