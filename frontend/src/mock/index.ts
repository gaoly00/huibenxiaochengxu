import Mock from 'mockjs';

import './user';
import './message-box';

// P0
import '@/views/dashboard/workplace/mock';
import '@/views/picture-book/list/mock';
import '@/views/picture-book/form/mock';
import '@/views/picture-book/category/mock';
import '@/views/picture-book/tag/mock';
import '@/views/picture-book/shipping/mock';
import '@/views/order/list/mock';
import '@/views/order/detail/mock';
import '@/views/user-manage/list/mock';
import '@/views/user-manage/detail/mock';
// P1
import '@/views/review/comments/mock';
import '@/views/review/showcases/mock';
import '@/views/marketing/points/mock';
import '@/views/marketing/checkin/mock';
import '@/views/marketing/distribution/mock';
// P2
import '@/views/smart-recommend/keywords/mock';
import '@/views/smart-recommend/templates/mock';
import '@/views/migration/tasks/mock';
import '@/views/system/basic/mock';
import '@/views/system/payment/mock';
import '@/views/system/logs/mock';

Mock.setup({
  timeout: '300-600',
});
