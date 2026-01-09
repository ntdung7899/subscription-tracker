import {getRequestConfig} from 'next-intl/server';
import {cookies} from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

  return {
    locale,
    messages: {
      common: (await import(`../locales/${locale}/common.json`)).default,
      auth: (await import(`../locales/${locale}/auth.json`)).default,
      dashboard: (await import(`../locales/${locale}/dashboard.json`)).default,
      subscriptions: (await import(`../locales/${locale}/subscriptions.json`)).default,
      categories: (await import(`../locales/${locale}/categories.json`)).default,
      errors: (await import(`../locales/${locale}/errors.json`)).default,
      landing: (await import(`../locales/${locale}/landing.json`)).default,
    }
  };
});
