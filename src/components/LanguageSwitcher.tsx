'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('en');
  const [mounted, setMounted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setMounted(true);
    const locale = document.cookie.match(/NEXT_LOCALE=([^;]+)/)?.[1] || 'en';
    setCurrentLocale(locale);
  }, []);

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  if (!mounted) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2">
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">🇺🇸</span>
      </div>
    );
  }

  const switchLanguage = async (locale: string) => {
    if (locale === currentLocale) {
      setIsOpen(false);
      return;
    }

    setIsChanging(true);
    const languageName = languages.find(l => l.code === locale)?.name;
    
    toast.loading(`Switching to ${languageName}...`, { id: 'language-switch' });
    
    try {
      document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
      setCurrentLocale(locale);
      setIsOpen(false);
      
      // Give time for cookie to be set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Refresh the page to load new translations
      router.refresh();
      
      // Show success after a short delay
      setTimeout(() => {
        toast.success(`Language changed to ${languageName}`, { id: 'language-switch' });
        setIsChanging(false);
      }, 500);
    } catch (error) {
      toast.error('Failed to change language', { id: 'language-switch' });
      setIsChanging(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isChanging}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isChanging ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Globe className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">{currentLanguage.flag}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => switchLanguage(language.code)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  currentLocale === language.code
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
