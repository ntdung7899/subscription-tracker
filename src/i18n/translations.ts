export const vi = {
  common: {
    loading: 'Đang tải...',
    error: 'Có lỗi xảy ra',
    success: 'Thành công',
    save: 'Lưu',
    cancel: 'Hủy',
    delete: 'Xóa',
    edit: 'Sửa',
    add: 'Thêm',
    search: 'Tìm kiếm',
  },
  dashboard: {
    title: 'Tổng quan',
    totalSubscriptions: 'Tổng Subscriptions',
    monthlyExpense: 'Chi phí tháng này',
    upcomingPayments: 'Sắp đến hạn',
  },
  subscriptions: {
    title: 'Subscriptions',
    add: 'Thêm Subscription',
    appName: 'Tên ứng dụng',
    category: 'Danh mục',
    price: 'Giá',
    billingCycle: 'Chu kỳ thanh toán',
    notificationDays: 'Số ngày nhắc trước',
    isShared: 'Chia sẻ',
    empty: 'Chưa có subscription nào',
  },
  members: {
    title: 'Thành viên',
    name: 'Tên',
    email: 'Email',
    amountPaid: 'Số tiền',
    nextPaymentDate: 'Ngày thanh toán',
    status: 'Trạng thái',
  },
  settings: {
    title: 'Cài đặt',
    notifications: 'Thông báo',
    googleDrive: 'Google Drive',
    account: 'Tài khoản',
  },
}

export const en = {
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
  },
  dashboard: {
    title: 'Dashboard',
    totalSubscriptions: 'Total Subscriptions',
    monthlyExpense: 'Monthly Expense',
    upcomingPayments: 'Upcoming Payments',
  },
  subscriptions: {
    title: 'Subscriptions',
    add: 'Add Subscription',
    appName: 'App Name',
    category: 'Category',
    price: 'Price',
    billingCycle: 'Billing Cycle',
    notificationDays: 'Notification Days',
    isShared: 'Shared',
    empty: 'No subscriptions yet',
  },
  members: {
    title: 'Members',
    name: 'Name',
    email: 'Email',
    amountPaid: 'Amount',
    nextPaymentDate: 'Payment Date',
    status: 'Status',
  },
  settings: {
    title: 'Settings',
    notifications: 'Notifications',
    googleDrive: 'Google Drive',
    account: 'Account',
  },
}

export type Locale = 'vi' | 'en'
export const translations = { vi, en }
