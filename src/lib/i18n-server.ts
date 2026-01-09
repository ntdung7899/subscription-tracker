import { cookies } from 'next/headers';

const translations: Record<string, Record<string, any>> = {
  en: {
    errors: {
      required: 'This field is required',
      invalidEmail: 'Invalid email address',
      invalidPassword: 'Password must be at least 8 characters',
      unauthorized: 'Unauthorized access',
      forbidden: 'Access forbidden',
      notFound: 'Resource not found',
      internalError: 'Internal server error',
      badRequest: 'Bad request',
      conflict: 'Resource already exists',
      validationError: 'Validation error',
    },
    subscriptions: {
      created: 'Subscription created successfully',
      updated: 'Subscription updated successfully',
      deleted: 'Subscription deleted successfully',
      notFound: 'Subscription not found',
      fetchError: 'Failed to fetch subscriptions',
      createError: 'Failed to create subscription',
      updateError: 'Failed to update subscription',
      deleteError: 'Failed to delete subscription',
    },
    categories: {
      created: 'Category created successfully',
      updated: 'Category updated successfully',
      deleted: 'Category deleted successfully',
      notFound: 'Category not found',
      alreadyExists: 'Category already exists',
      fetchError: 'Failed to fetch categories',
      createError: 'Failed to create category',
      updateError: 'Failed to update category',
      deleteError: 'Failed to delete category',
    },
  },
  vi: {
    errors: {
      required: 'Trường này là bắt buộc',
      invalidEmail: 'Địa chỉ email không hợp lệ',
      invalidPassword: 'Mật khẩu phải có ít nhất 8 ký tự',
      unauthorized: 'Truy cập không được phép',
      forbidden: 'Truy cập bị cấm',
      notFound: 'Không tìm thấy tài nguyên',
      internalError: 'Lỗi máy chủ nội bộ',
      badRequest: 'Yêu cầu không hợp lệ',
      conflict: 'Tài nguyên đã tồn tại',
      validationError: 'Lỗi xác thực',
    },
    subscriptions: {
      created: 'Tạo subscription thành công',
      updated: 'Cập nhật subscription thành công',
      deleted: 'Xóa subscription thành công',
      notFound: 'Không tìm thấy subscription',
      fetchError: 'Không thể tải subscriptions',
      createError: 'Không thể tạo subscription',
      updateError: 'Không thể cập nhật subscription',
      deleteError: 'Không thể xóa subscription',
    },
    categories: {
      created: 'Tạo danh mục thành công',
      updated: 'Cập nhật danh mục thành công',
      deleted: 'Xóa danh mục thành công',
      notFound: 'Không tìm thấy danh mục',
      alreadyExists: 'Danh mục đã tồn tại',
      fetchError: 'Không thể tải danh mục',
      createError: 'Không thể tạo danh mục',
      updateError: 'Không thể cập nhật danh mục',
      deleteError: 'Không thể xóa danh mục',
    },
  },
};

export async function getLocale(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get('NEXT_LOCALE')?.value || 'en';
}

export async function getTranslation(key: string, params?: Record<string, any>): Promise<string> {
  const locale = await getLocale();
  const keys = key.split('.');
  let value: any = translations[locale];

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      value = key;
      break;
    }
  }

  if (typeof value === 'string' && params) {
    return value.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] || '');
  }

  return value || key;
}

export function createApiResponse(
  success: boolean,
  data: any = null,
  messageKey?: string,
  status: number = 200
) {
  return {
    success,
    data,
    messageKey,
    status,
  };
}

export async function localizedApiResponse(
  success: boolean,
  data: any = null,
  messageKey?: string,
  status: number = 200
) {
  const message = messageKey ? await getTranslation(messageKey) : undefined;

  return {
    success,
    data,
    message,
    messageKey,
    status,
  };
}
