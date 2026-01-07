
# Subscription Tracker – Next.js FE + BE Architecture

## 🎯 Mục tiêu
- Dùng **Next.js** làm cả Frontend + Backend
- Một codebase, dễ deploy, dễ mở rộng

---

## 🧱 Kiến trúc tổng thể

```
subscription-tracker/
├── src/
│   ├── app/
│   │   ├── (auth)/login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── subscriptions/page.tsx
│   │   ├── subscriptions/[id]/page.tsx
│   │   ├── statistics/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── api/
│   │   │   ├── subscriptions/route.ts
│   │   │   ├── subscriptions/[id]/route.ts
│   │   │   ├── members/route.ts
│   │   │   ├── settings/route.ts
│   │   │   ├── auth/route.ts
│   │   │   └── cron/notify/route.ts
│   │   ├── layout.tsx
│   │   └── providers.tsx
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   │   ├── db.ts
│   │   ├── auth.ts
│   │   ├── mail.ts
│   │   └── googleDrive.ts
│   ├── types/
│   ├── utils/
│   └── i18n/
├── prisma/schema.prisma
├── public/
├── package.json
├── next.config.js
└── README.md
```

---

## 🧠 Data layer

- **Database**: SQLite
- **ORM**: Prisma

### Prisma schema (rút gọn)

```prisma
model Subscription {
  id String @id @default(cuid())
  appName String
  category String
  price Int
  currency String
  billingCycle String
  notificationDays Int
  isShared Boolean
  familyGroups FamilyGroup[]
}

model FamilyGroup {
  id String @id @default(cuid())
  name String
  subscriptionId String
  members Member[]
}

model Member {
  id String @id @default(cuid())
  name String
  email String
  amountPaid Int
  nextPaymentDate DateTime
  status String
  familyGroupId String
}
```

---

## 📡 API Design

### /api/subscriptions
- GET: danh sách subscription
- POST: tạo mới

### /api/subscriptions/[id]
- PUT: cập nhật
- DELETE: xoá

---

## 📧 Email Reminder (Backend)
- Cron chạy mỗi ngày
- Query member sắp đến hạn
- Gửi email (Resend / SMTP)
- Log trạng thái gửi

---

## 🔐 Authentication
- NextAuth
- Google / Email Magic Link
- Chuẩn bị cho multi-user

---

## 🚀 Lộ trình migrate

### Phase 1
- Setup Next.js + App Router
- Copy UI components
- Mock data

### Phase 2
- Prisma + SQLite
- CRUD API

### Phase 3
- Email backend
- Cron notify

### Phase 4
- Deploy (Vercel / VPS)
- Multi-user

---

## ✅ Kết luận
Next.js FE + BE giúp project:
- Gọn
- Dễ scale
- Chuẩn SaaS / Web App
