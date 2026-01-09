# Trạng Thái I18n - Translation Status

## ✅ Đã Hoàn Thành (Completed)

### Landing Page & Navigation
- ✅ `src/app/page.tsx` - Landing page với tất cả sections
- ✅ `src/components/LandingHeader.tsx` - Header navigation
- ✅ `src/components/LanguageSwitcher.tsx` - Language switcher component
- ✅ Translation files: `locales/*/landing.json` (228 keys synchronized)

## 🔄 Cần Cập Nhật (Needs Translation)

### Authentication Pages
- ⚠️ `src/app/(auth)/login/page.tsx`
  - Hardcoded: "Email address", "Password", "Remember me", "Forgot password?"
  - Cần sử dụng: `auth.signIn.*` keys
  
- ⚠️ `src/app/signup/page.tsx`
  - Hardcoded: "Full name", "Email address", "Password", "Confirm password"
  - Cần sử dụng: `auth.signUp.*` keys

### Dashboard Pages
- ⚠️ `src/app/dashboard/page.tsx`
  - Hardcoded: Dashboard titles, stats labels
  - Cần sử dụng: `dashboard.*` keys

- ⚠️ `src/app/dashboard/_components/MonthlySpendingChart.tsx`
  - Hardcoded: "Monthly Spending Trend"
  - Cần sử dụng: `dashboard.charts.*` keys

- ⚠️ `src/app/dashboard/_components/CategoryBreakdownChart.tsx`
  - Hardcoded: "Spending by Category"
  - Cần sử dụng: `dashboard.charts.*` keys

- ⚠️ `src/app/dashboard/_components/RecentSubscriptionsList.tsx`
  - Hardcoded: "Recent Subscriptions"
  - Cần sử dụng: `dashboard.*` keys

- ⚠️ `src/app/dashboard/_components/UpcomingPaymentsTable.tsx`
  - Hardcoded: "Upcoming Payments"
  - Cần sử dụng: `dashboard.*` keys

### Subscription Pages
- ⚠️ `src/app/dashboard/subscriptions/page.tsx`
  - Hardcoded: "All Subscriptions", "Add Subscription", "Filter by Category"
  - Translation keys available but not applied
  - Cần sử dụng: `subscriptions.*` keys

- ⚠️ `src/app/dashboard/subscriptions/new/page.tsx`
  - Hardcoded: Form labels, buttons
  - Translation keys exist: `subscriptions.fields.*`
  - Cần áp dụng các keys có sẵn

- ⚠️ `src/app/dashboard/subscriptions/[id]/page.tsx`
  - Hardcoded: Subscription details labels
  - Cần sử dụng: `subscriptions.*` keys

- ⚠️ `src/app/dashboard/subscriptions/[id]/edit/page.tsx`
  - Hardcoded: Edit form labels
  - Cần sử dụng: `subscriptions.*` keys

### Category Pages
- ⚠️ `src/app/dashboard/categories/page.tsx`
  - Hardcoded: Category management text
  - Translation keys available: `categories.*`

### Billing Pages
- ⚠️ `src/app/dashboard/billing/page.tsx`
- ⚠️ `src/app/dashboard/billing/invoices/page.tsx`
- ⚠️ `src/app/dashboard/billing/payments/page.tsx`
- ⚠️ `src/app/dashboard/billing/settings/page.tsx`
  - Cần thêm translation keys cho billing

### Settings Pages
- ⚠️ `src/app/dashboard/settings/page.tsx`
  - Cần thêm translation keys cho settings

### Pricing Page
- ⚠️ `src/app/pricing/page.tsx`
  - Cần thêm translation keys cho pricing

## 📋 Translation Files Status

### Available Keys (228 total)
```
common.json (35 keys) - ✅ Synchronized
auth.json (23 keys) - ✅ Synchronized  
dashboard.json (18 keys) - ⚠️ Available but not applied
subscriptions.json (67 keys) - ⚠️ Available but not applied
categories.json (12 keys) - ⚠️ Available but not applied
errors.json (21 keys) - ⚠️ Available but not applied
landing.json (52 keys) - ✅ Applied
```

## 🎯 Priority Tasks

### High Priority (Core User Experience)
1. **Login & Signup Pages** - Most visible to new users
2. **Dashboard Main Page** - First page after login
3. **Subscriptions List & New** - Core functionality

### Medium Priority
4. **Subscription Details & Edit**
5. **Category Management**
6. **Dashboard Components** (charts, tables)

### Low Priority
7. **Billing Pages**
8. **Settings Pages**
9. **Pricing Page**

## 📝 Implementation Pattern

### Example: Update Login Page
```tsx
// Before
<label>Email address <span>*</span></label>

// After
import { useTranslations } from 'next-intl'
const t = useTranslations('auth.signIn')
<label>{t('emailPlaceholder')} <span>*</span></label>
```

### Steps for Each Page:
1. Import `useTranslations` from 'next-intl'
2. Add translation hook: `const t = useTranslations('namespace')`
3. Replace hardcoded text with `t('key')`
4. Verify keys exist in both en/vi translation files
5. Test language switching

## 🔍 How to Find Untranslated Text

### Search Patterns:
```bash
# Find hardcoded English labels
grep -r "Email address" src/app/
grep -r "Password" src/app/
grep -r "Subscription" src/app/

# Find missing useTranslations
grep -L "useTranslations" src/app/**/*.tsx
```

## ✨ Quick Win Tasks

### Can be done in < 5 minutes each:
- [ ] Update login page labels
- [ ] Update signup page labels
- [ ] Update dashboard title
- [ ] Update subscription list headers
- [ ] Update category modal

## 📊 Progress Tracker

- Landing Page: ✅ 100%
- Navigation: ✅ 100%
- Authentication: 🟡 30% (structure ready, needs application)
- Dashboard: 🟡 20% (keys exist, needs application)
- Subscriptions: 🟡 40% (keys exist, partially applied)
- Categories: 🟡 30% (keys exist, needs application)
- Billing: 🔴 0% (needs translation keys)
- Settings: 🔴 0% (needs translation keys)
- Pricing: 🔴 0% (needs translation keys)

**Overall Progress: ~35%**

## 🚀 Next Steps

1. Review this document
2. Pick a priority area
3. Update components one by one
4. Test with language switcher (EN/VI)
5. Update this document as you complete sections
