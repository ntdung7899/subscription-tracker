'use client';

import { useTranslations } from 'next-intl';

export function useI18n() {
  const t = useTranslations();

  const validate = {
    required: (value: any) => {
      if (!value || (typeof value === 'string' && !value.trim())) {
        return t('errors.required');
      }
      return null;
    },
    
    email: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return t('errors.invalidEmail');
      }
      return null;
    },
    
    minLength: (value: string, min: number) => {
      if (value.length < min) {
        return t('errors.minLength', { min });
      }
      return null;
    },
    
    maxLength: (value: string, max: number) => {
      if (value.length > max) {
        return t('errors.maxLength', { max });
      }
      return null;
    },
    
    minValue: (value: number, min: number) => {
      if (value < min) {
        return t('errors.minValue', { min });
      }
      return null;
    },
    
    maxValue: (value: number, max: number) => {
      if (value > max) {
        return t('errors.maxValue', { max });
      }
      return null;
    },
    
    positive: (value: number) => {
      if (value <= 0) {
        return t('errors.mustBePositive');
      }
      return null;
    }
  };

  return {
    t,
    validate
  };
}
