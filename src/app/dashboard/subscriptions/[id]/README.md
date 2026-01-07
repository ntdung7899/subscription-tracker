# Subscription Detail Page - Optimized Structure

## 📁 Cấu trúc thư mục

```
src/app/dashboard/subscriptions/
├── _components/              # Reusable components
│   ├── index.ts             # Barrel export
│   ├── SubscriptionHeader.tsx
│   ├── PriceCard.tsx
│   ├── FamilyGroupCard.tsx
│   ├── MemberCard.tsx
│   ├── StatsCard.tsx
│   ├── QuickActionsCard.tsx
│   ├── LoadingState.tsx
│   └── ErrorState.tsx
├── _types/                  # Type definitions
│   └── index.ts
├── [id]/
│   └── page.tsx            # Main page (optimized)
└── page.tsx                # List page
```

## 🎯 Tối ưu hóa đã thực hiện

### 1. **Component Splitting**
File gốc (~500 lines) đã được tách thành:
- 8 components nhỏ, focused, reusable
- Mỗi component có trách nhiệm rõ ràng (Single Responsibility Principle)
- Dễ test và maintain hơn

### 2. **Custom Hooks**
- `useSubscription`: Quản lý fetch subscription data
- `useDeleteSubscription`: Quản lý delete logic
- Tách biệt business logic khỏi UI

### 3. **Utility Functions**
- `formatters.ts`: Tất cả formatting logic (currency, date, etc.)
- Centralized, reusable across app
- Consistent formatting

### 4. **Performance Optimization**
- `useMemo` cho calculated values (totalMembers)
- Conditional rendering tối ưu
- Component memoization ready

## 📦 Components

### SubscriptionHeader
Header với breadcrumb, title, badges và action buttons
```tsx
<SubscriptionHeader
  appName={string}
  category={string}
  isShared={boolean}
  subscriptionId={string}
  onDelete={() => void}
  isDeleting={boolean}
/>
```

### PriceCard
Hiển thị thông tin giá và billing cycle
```tsx
<PriceCard
  price={number}
  currency={string}
  billingCycle={string}
  notificationDays={number}
  formatCurrency={(amount, currency) => string}
/>
```

### FamilyGroupCard
Danh sách family groups và members
```tsx
<FamilyGroupCard
  familyGroups={FamilyGroup[]}
  currency={string}
  formatCurrency={(amount, currency) => string}
  formatDate={(dateString) => string}
/>
```

### MemberCard
Thông tin chi tiết của từng member
```tsx
<MemberCard
  member={Member}
  currency={string}
  formatCurrency={(amount, currency) => string}
  formatDate={(dateString) => string}
/>
```

### StatsCard
Thống kê subscription
```tsx
<StatsCard
  totalMembers={number}
  createdAt={string}
  updatedAt={string}
  isShared={boolean}
  formatDate={(dateString) => string}
/>
```

### QuickActionsCard
Quick action buttons
```tsx
<QuickActionsCard
  subscriptionId={string}
  onSendReminder={() => void}
/>
```

### LoadingState & ErrorState
Loading và error states
```tsx
<LoadingState />
<ErrorState error={string | null} />
```

## 🔧 Custom Hooks

### useSubscription
```typescript
const { subscription, isLoading, error, refetch } = useSubscription(id)
```

### useDeleteSubscription
```typescript
const { isDeleting, deleteSubscription } = useDeleteSubscription()
```

## 📊 Benefits

### Before (Original)
- ❌ 1 file với 500+ lines
- ❌ Mixed concerns (UI + logic + formatting)
- ❌ Khó test individual parts
- ❌ Khó reuse components
- ❌ Performance không tối ưu

### After (Optimized)
- ✅ Main page chỉ ~90 lines
- ✅ 8 focused, reusable components
- ✅ Custom hooks tách biệt business logic
- ✅ Utility functions centralized
- ✅ Easy to test & maintain
- ✅ Better performance với useMemo
- ✅ Type-safe với TypeScript
- ✅ Consistent code structure

## 🚀 Usage Example

```tsx
// Main page - Clean & Simple
export default function SubscriptionDetailPage({ params }: { params: { id: string } }) {
  const { subscription, isLoading, error } = useSubscription(params.id)
  const { isDeleting, deleteSubscription } = useDeleteSubscription()
  
  const totalMembers = useMemo(
    () => subscription?.familyGroups.reduce((acc, g) => acc + g.members.length, 0) ?? 0,
    [subscription]
  )

  if (isLoading) return <LoadingState />
  if (error || !subscription) return <ErrorState error={error} />

  return (
    <div>
      <SubscriptionHeader {...props} />
      <PriceCard {...props} />
      <FamilyGroupCard {...props} />
      <StatsCard {...props} />
      <QuickActionsCard {...props} />
    </div>
  )
}
```

## 🎨 Styling
- Tailwind CSS with dark mode support
- Responsive design
- Consistent spacing và colors
- Reusable utility classes

## 📝 Notes
- Tất cả components đều type-safe
- Barrel exports trong `_components/index.ts`
- Formatters có thể reuse across app
- Easy để extend thêm features mới
