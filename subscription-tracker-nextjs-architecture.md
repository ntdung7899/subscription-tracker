
# Subscription Tracker – Next.js FE + BE Architecture

## 🎯 Mục tiêu
- Dùng **Next.js** làm cả Frontend + Backend
- Một codebase, dễ deploy, dễ mở rộng
- Component-based architecture với separation of concerns
- Type-safe với TypeScript

---

## 🧱 Kiến trúc tổng thể (Optimized)

```
subscription-tracker-frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   ├── statistics/page.tsx
│   │   │   └── subscriptions/
│   │   │       ├── _components/          # Shared components (private)
│   │   │       │   ├── index.ts          # Barrel exports
│   │   │       │   ├── SubscriptionHeader.tsx
│   │   │       │   ├── PriceCard.tsx
│   │   │       │   ├── FamilyGroupCard.tsx
│   │   │       │   ├── MemberCard.tsx
│   │   │       │   ├── StatsCard.tsx
│   │   │       │   ├── QuickActionsCard.tsx
│   │   │       │   ├── LoadingState.tsx
│   │   │       │   └── ErrorState.tsx
│   │   │       ├── _types/               # Type definitions (private)
│   │   │       │   └── index.ts          # All interfaces & types
│   │   │       ├── page.tsx              # List subscriptions (~90 lines)
│   │   │       ├── [id]/
│   │   │       │   ├── page.tsx          # Detail page (optimized)
│   │   │       │   └── README.md         # Documentation
│   │   │       └── new/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── subscriptions/
│   │   │   │   ├── route.ts              # GET, POST
│   │   │   │   └── [id]/route.ts         # PUT, DELETE
│   │   │   ├── members/route.ts
│   │   │   ├── settings/route.ts
│   │   │   └── cron/notify/route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── providers.tsx
│   │   └── globals.css
│   ├── components/                        # Global reusable components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── index.ts
│   │   ├── layout/
│   │   └── pages/
│   ├── hooks/                             # Custom hooks
│   │   ├── useFetch.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useSubscription.ts            # Fetch subscription logic
│   │   └── useDeleteSubscription.ts      # Delete subscription logic
│   ├── lib/                               # Core libraries
│   │   ├── db.ts                         # Prisma client
│   │   ├── auth.ts                       # NextAuth config
│   │   ├── mail.ts                       # Email service
│   │   └── googleDrive.ts                # Google Drive integration
│   ├── types/                             # Global type definitions
│   │   ├── index.ts                      # Core domain types
│   │   └── next-auth.d.ts                # NextAuth types
│   ├── utils/                             # Utility functions
│   │   ├── constants.ts
│   │   ├── helpers.ts                    # General helpers
│   │   └── formatters.ts                 # Format currency, date, etc.
│   ├── i18n/
│   │   ├── index.ts
│   │   └── translations.ts
│   └── data/                              # Mock data
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🏗️ Component Architecture Patterns

### 1. **Folder Conventions**
- `_components/` - Private components cho route cụ thể (không export ra ngoài)
- `_types/` - Private type definitions cho route cụ thể
- `components/` - Global shared components
- `types/` - Global type definitions

### 2. **Component Structure** (Single Responsibility)
```tsx
// Bad: 500+ lines, mixed concerns
export default function Page() {
  // All logic, UI, formatting in one file
}

// Good: Separated, focused components
export default function Page() {
  const { data, isLoading } = useCustomHook()
  
  if (isLoading) return <LoadingState />
  
  return (
    <>
      <Header {...props} />
      <ContentCard {...props} />
      <SidebarCard {...props} />
    </>
  )
}
```

### 3. **Type Organization**
```typescript
// _types/index.ts
// ==================== Domain Models ====================
export interface Member { ... }
export interface FamilyGroup { ... }

// ==================== Component Props ====================
export interface HeaderProps { ... }
export interface CardProps { ... }

// ==================== Constants ====================
export const CATEGORIES = [...]
export const COLORS = { ... }

// ==================== Utility Functions ====================
export function getCategoryColor(category: string): string { ... }
```

### 4. **Custom Hooks Pattern**
```typescript
// hooks/useSubscription.ts
export function useSubscription(id: string) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    fetchData()
  }, [id])
  
  return { data, isLoading, error, refetch }
}
```

### 5. **Barrel Exports**
```typescript
// _components/index.ts
export { SubscriptionHeader } from './SubscriptionHeader'
export { PriceCard } from './PriceCard'
export { FamilyGroupCard } from './FamilyGroupCard'
// ... other exports

// Usage
import { Header, PriceCard, FamilyGroupCard } from './_components'
```

---

## 🧠 Data Layer

- **Database**: PostgreSQL (Production) / SQLite (Development)
- **ORM**: Prisma
- **Migration**: Prisma Migrate

### Prisma Schema (Complete)

```prisma
// User authentication
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// Core business models
model Subscription {
  id               String        @id @default(cuid())
  appName          String
  category         String        // Productivity, Development, etc.
  price            Int           // Stored in cents/smallest unit
  currency         String        @default("VND")
  billingCycle     String        // monthly, yearly, quarterly
  notificationDays Int           @default(3)
  isShared         Boolean       @default(false)
  familyGroups     FamilyGroup[]
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
}

model FamilyGroup {
  id             String       @id @default(cuid())
  name           String
  subscriptionId String
  subscription   Subscription @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)
  members        Member[]
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

model Member {
  id              String      @id @default(cuid())
  name            String
  email           String
  amountPaid      Int         // In cents/smallest unit
  nextPaymentDate DateTime
  status          String      @default("active") // active, pending, overdue
  familyGroupId   String
  familyGroup     FamilyGroup @relation(fields: [familyGroupId], references: [id], onDelete: Cascade)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

model EmailLog {
  id        String   @id @default(cuid())
  memberId  String
  email     String
  subject   String
  status    String   // sent, failed
  error     String?
  sentAt    DateTime @default(now())
}
```

### Type System (TypeScript)

```typescript
// src/types/index.ts - Core domain types
export type BillingCycle = 'monthly' | 'yearly' | 'quarterly'
export type Currency = 'VND' | 'USD' | 'EUR' | 'GBP'
export type MemberStatus = 'active' | 'pending' | 'overdue'
export type EmailStatus = 'sent' | 'failed'

export interface Subscription {
  id: string
  appName: string
  category: string
  price: number
  currency: string
  billingCycle: BillingCycle
  notificationDays: number
  isShared: boolean
  familyGroups?: FamilyGroup[]
  createdAt: Date
  updatedAt: Date
}

export interface FamilyGroup {
  id: string
  name: string
  subscriptionId: string
  subscription?: Subscription
  members?: Member[]
  createdAt: Date
  updatedAt: Date
}

export interface Member {
  id: string
  name: string
  email: string
  amountPaid: number
  nextPaymentDate: Date
  status: MemberStatus
  familyGroupId: string
  familyGroup?: FamilyGroup
  createdAt: Date
  updatedAt: Date
}
```

---

## 📡 API Design (RESTful)

### Authentication
- **POST** `/api/auth/[...nextauth]` - NextAuth endpoints
- **GET** `/api/auth/session` - Get current session

### Subscriptions
- **GET** `/api/subscriptions` - List all subscriptions
  - Response: `Subscription[]` with familyGroups & members
  - Include: `{ familyGroups: { include: { members: true } } }`
  
- **POST** `/api/subscriptions` - Create new subscription
  - Body: `SubscriptionCreateInput`
  - Nested create: familyGroups + members
  
- **GET** `/api/subscriptions/[id]` - Get subscription detail
  - Response: `Subscription` with full relations
  
- **PUT** `/api/subscriptions/[id]` - Update subscription
  - Body: `SubscriptionUpdateInput`
  
- **DELETE** `/api/subscriptions/[id]` - Delete subscription
  - Cascade delete: familyGroups & members

### Members
- **GET** `/api/members` - List members by filters
- **POST** `/api/members` - Add member to family group
- *🎨 UI/UX Utilities

### Formatters (utils/formatters.ts)
```typescript
// Currency formatting
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency === 'VND' ? 'VND' : currency,
  }).format(amount)
}

// Date formatting
export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Relative time
export function formatRelativeTime(dateString: string | Date): string {
  // "2 days ago", "Next week", etc.
}

// Days until date
export function daysUntil(dateString: string | Date): number {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  const now = new Date()
  const diffInMs = date.getTime() - now.getTime()
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
}
```

### Styling System
- **Framework**: Tailwind CSS
- **Dark Mode**: `dark:` variants
- **Components**: Headless UI / Radix UI
- **Icons**: Lucide React
- **Responsive**: Mobile-first approach

---

## 🚀 Development Workflow

### Code Organization Best Practices

1. **Component Splitting**
   - Keep components under 100 lines
   - Extract reusable parts to `_components/`
   - One component per file

2. **Type Safety**
   - Define interfaces in `_types/`
   - Use TypeScript strict mode
   - Export types for reuse

3. **Custom Hooks**
   - Extract data fetching logic
   - Share stateful logic across components
   - Prefix with `use`

4. **Utility Functions**
   - Pure functions in `utils/`
   - Format, transform, calculate
   - Unit testable

5. **Naming Conventions**
   - Components: PascalCase (`SubscriptionCard.tsx`)
   - Hooks: camelCase with `use` prefix (`useSubscription.ts`)
   - Utils: camelCase (`formatCurrency.ts`)
   - Types: PascalCase for interfaces (`SubscriptionProps`)
   - Private folders: `_components/`, `_types/`

### Performance Optimization

```typescript
// Memoization
const totalMembers = useMemo(() => {
  return subscription.familyGroups.reduce(
    (acc, group) => acc + group.members.length, 0
  )
}, [subscription])

// Lazy loading
const Statistics = lazy(() => import('./statistics/page'))

// Optimistic updates
const { mutate } = useSWR('/api/subscriptions', fetcher, {
  optimisticData: newData,
  rollbackOnError: true,
})
```

---

## 🚀 Deployment

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Email (Resend)
RESEND_API_KEY="re_..."

# Cron Secret
CRON_SECRET="random-secret-for-cron"
```

### Vercel Deployment
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push to main
4. Setup cron jobs in vercel.json

### Database Migration
```bash
# Development
npx prisma migrate dev

# Production
npx prisma migrate deploy
```

---

## 🧪 Testing Strategy

### Unit Tests (Components)
```typescript
import { render, screen } from '@testing-library/react'
import { PriceCard } from './PriceCard'

test('renders price correctly', () => {
  render(<PriceCard price={100000} currency="VND" />)
  expect(screen.getByText(/100.000/)).toBeInTheDocument()
})
```

### Integration Tests (API)
```typescript
import { GET } from './api/subscriptions/route'

test('GET /api/subscriptions returns list', async () => {
  const response = await GET()
  const data = await response.json()
  expect(Array.isArray(data)).toBe(true)
})
```

---

## 📊 Monitoring & Analytics

### Error Tracking
- Sentry for error monitoring
- Log API errors to database
- Track email delivery status

### Performance
- Vercel Analytics
- Core Web Vitals
- Database query optimization

### User Analytics
- Google Analytics / Plausible
- Track feature usage
- Monitor user flows

---

## 🚀 Migration Roadmap

### ✅ Phase 1: Foundation (Completed)
- ✅ Setup Next.js 14 + App Router
- ✅ Tailwind CSS + Dark mode
- ✅ Component architecture
- ✅ Type system with TypeScript

### ✅ Phase 2: Core Features (Completed)
- ✅ Prisma + PostgreSQL
- ✅ CRUD APIs for subscriptions
- ✅ Custom hooks (useSubscription, useDeleteSubscription)
- ✅ Optimized components structure
- ✅ Formatters & utilities

### 🔄 Phase 3: Backend Services (In Progress)
- 🔄 NextAuth authentication
- 🔄 Email service integration
- 🔄 Cron job for notifications
- 🔄 Google Drive backup

### 📋 Phase 4: Production Ready
- ⏳ Unit & integration tests
- ⏳ Error handling & logging
- ⏳ Deploy to Vercel
- ⏳ Database optimization
- ⏳ Performance tuning

### 🎯 Phase 5: Advanced Features
- ⏳ Multi-user support
- ⏳ Real-time notifications (WebSocket)
- ⏳ Mobile app (React Native)
- ⏳ Analytics dashboard
- ⏳ Export/Import data

---

## ✅ Kết luận

### Next.js FE + BE Architecture Benefits:

✅ **Monolithic but Modular**
- Một codebase dễ manage
- Component-based architecture
- Clear separation of concerns

✅ **Type-Safe**
- TypeScript end-to-end
- Prisma type generation
- IntelliSense support

✅ **Performance**
- React Server Components
- Optimized bundle size
- Memoization & lazy loading

✅ **Developer Experience**
- Hot reload
- TypeScript autocomplete
- Clear folder structure
- Easy to onboard new developers

✅ **Production Ready**
- Easy deployment (Vercel)
- Built-in API routes
- Cron job support
- Database migrations

✅ **Scalable**
- Chuẩn SaaS architecture
- Easy to add multi-tenancy
- Ready for microservices split nếu cần

### Code Quality Standards

- **Components**: < 100 lines, single responsibility
- **Types**: All interfaces exported from `_types/`
- **Hooks**: Extract business logic from components
- **Utils**: Pure functions, unit testable
- **Performance**: useMemo for expensive calculations
- **Error Handling**: Try-catch in all API routes
- **Documentation**: README for complex featuresn Tracker <noreply@yourdomain.com>',
    to: member.email,
    subject: `Nhắc nhở: ${subscription.appName} sắp đến hạn`,
    html: renderEmailTemplate(member, subscription)
  })
  
  // Log to database
  await prisma.emailLog.create({
    data: {
      memberId: member.id,
      email: member.email,
      subject: '...',
      status: error ? 'failed' : 'sent',
      error: error?.message
    }
  })
}
```

### Cron Schedule (Vercel)
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/notify",
    "schedule": "0 9 * * *"  // 9:00 AM daily
  }]
}
```

### Email Template
- HTML template with Tailwind CSS
- Personalized with member name
- Show subscription details
- Payment amount & date
- Action button to dashboard

---

## 🔐 Authentication & Authorization

### NextAuth Configuration
```typescript
// lib/auth.ts
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './db'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
}
```

### Protected Routes
```typescript
// Middleware pattern
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }
  return session
}
```

### Multi-tenant Support (Future)
- Add `userId` to Subscription model
- Filter queries by `session.user.id`
- Row-level security with Prisma

---

## 📊 Dashboard Implementation

### Overview
Production-ready dashboard with KPI cards, charts, tables, and recent activity lists.

### Architecture
```
src/app/dashboard/
├── _components/              # Dashboard-specific components
│   ├── index.ts             # Barrel exports
│   ├── StatsCard.tsx        # KPI metric card with icon
│   ├── MonthlySpendingChart.tsx    # Line chart (Recharts)
│   ├── CategoryBreakdownChart.tsx  # Pie chart (Recharts)
│   ├── UpcomingPaymentsTable.tsx   # Responsive table
│   └── RecentSubscriptionsList.tsx # Activity list
├── _types/
│   └── index.ts             # Dashboard type definitions
└── page.tsx                 # Main dashboard page (~100 lines)
```

### Type Definitions
```typescript
// Dashboard Statistics
interface DashboardStats {
  totalSubscriptions: number
  monthlyCost: number
  expiringSoon: number
  totalMembers: number
}

// Chart Data
interface MonthlySpending {
  month: string
  amount: number
}

interface CategoryBreakdown {
  category: string
  amount: number
}

// Upcoming Payment
interface UpcomingPayment {
  id: string
  name: string
  amount: number
  dueDate: string
  category: string
}

// Recent Subscription
interface RecentSubscription {
  id: string
  name: string
  category: string
  status: string
  createdAt: string
}
```

### Components

#### StatsCard
- **Purpose**: Display KPI metrics with icons
- **Props**: title, value, icon (Lucide), isLoading
- **Features**: Skeleton loading state, icon background colors
- **Size**: ~40 lines

#### MonthlySpendingChart
- **Purpose**: Visualize spending trends over 6 months
- **Library**: Recharts (LineChart)
- **Features**: Responsive, dark mode support, formatted currency tooltips
- **Size**: ~65 lines

#### CategoryBreakdownChart
- **Purpose**: Show spending distribution by category
- **Library**: Recharts (PieChart)
- **Features**: Color-coded segments, percentage labels, responsive legend
- **Size**: ~95 lines

#### UpcomingPaymentsTable
- **Purpose**: List next 5 upcoming payments
- **Features**: Responsive table, date formatting, category badges, empty state
- **Size**: ~80 lines

#### RecentSubscriptionsList
- **Purpose**: Show last 5 subscriptions added
- **Features**: Status badges, relative time, empty state
- **Size**: ~70 lines

### Custom Hook
```typescript
// src/hooks/useDashboard.ts
export function useDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [charts, setCharts] = useState<ChartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Parallel fetch: /api/dashboard/summary & /api/dashboard/charts
    // Error handling & loading states
  }, [])

  return { summary, charts, isLoading, error }
}
```

### API Endpoints

#### GET /api/dashboard/summary
- **Returns**: DashboardSummary (stats, upcomingPayments, recentSubscriptions)
- **Logic**:
  - Count total subscriptions
  - Calculate monthly cost (split among members if shared)
  - Find payments expiring in next 7 days
  - Count total members across all groups
  - Get next 5 upcoming payments (30 days)
  - Get last 5 created subscriptions

#### GET /api/dashboard/charts
- **Returns**: ChartData (monthlySpending, categoryBreakdown)
- **Logic**:
  - Generate last 6 months spending trend
  - Aggregate spending by category
  - Sort categories by amount

### Data Flow
1. Dashboard page mounts → useDashboard hook fetches data
2. Parallel API calls to /summary and /charts
3. Loading skeletons shown during fetch
4. Data updates trigger component re-renders
5. Error states handled gracefully

### Best Practices Applied
✅ Component size < 100 lines (except CategoryBreakdownChart at 95)
✅ Type-safe with TypeScript interfaces
✅ Custom hooks for data fetching
✅ Parallel API requests for performance
✅ Loading & error states on all components
✅ Responsive design (mobile/tablet/desktop)
✅ Dark mode support
✅ Empty states for no data
✅ Formatters for currency and dates
✅ Barrel exports for clean imports

### Performance Optimizations
- Parallel API fetching (Promise.all)
- Memoized calculations in APIs
- Responsive charts (ResponsiveContainer)
- Skeleton loading for perceived performance
- Limited data sets (top 5 items)

---

