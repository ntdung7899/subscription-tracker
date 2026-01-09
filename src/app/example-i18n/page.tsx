'use client';

import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function ExampleUsagePage() {
  const t = useTranslations();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('subscriptions.title')}</h1>
        <LanguageSwitcher />
      </div>

      <div className="space-y-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          {t('subscriptions.addSubscription')}
        </button>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t('subscriptions.fields.appName')}
          </label>
          <input
            type="text"
            placeholder={t('subscriptions.fields.appNamePlaceholder')}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <p className="text-sm text-gray-600">
          {t('subscriptions.notification.remindBefore', { days: 7 })}
        </p>
      </div>
    </div>
  );
}
