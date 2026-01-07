# Subscription Tracker

Ứng dụng quản lý subscription và chia sẻ chi phí được xây dựng với Next.js 14+ App Router.

## 🚀 Tính năng

- ✅ Quản lý subscriptions (Netflix, Spotify, etc.)
- ✅ Chia sẻ chi phí với nhóm gia đình
- ✅ Thông báo email nhắc nhở thanh toán
- ✅ Thống kê chi phí theo tháng/danh mục
- ✅ Xác thực với NextAuth (Google OAuth)
- ✅ Backup dữ liệu lên Google Drive

## 📦 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: SQLite + Prisma ORM
- **Authentication**: NextAuth.js
- **Email**: Resend
- **UI**: TailwindCSS + Lucide Icons
- **Language**: TypeScript

## 🛠️ Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình biến môi trường

Sao chép file `.env.example` thành `.env` và điền các thông tin:

```bash
cp .env.example .env
```

Cập nhật các giá trị trong `.env`:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

### 3. Khởi tạo database

```bash
npm run db:push
```

### 4. Chạy ứng dụng

```bash
npm run dev
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000)

## 📁 Cấu trúc dự án

```
subscription-tracker/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # Auth pages
│   │   ├── api/             # API routes
│   │   ├── dashboard/       # Dashboard page
│   │   ├── subscriptions/   # Subscription pages
│   │   ├── statistics/      # Statistics page
│   │   └── settings/        # Settings page
│   ├── components/          # React components
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Core libraries
│   │   ├── db.ts           # Prisma client
│   │   ├── auth.ts         # NextAuth config
│   │   ├── mail.ts         # Email service
│   │   └── googleDrive.ts  # Google Drive API
│   ├── types/               # TypeScript types
│   ├── utils/               # Utility functions
│   └── i18n/                # Internationalization
├── prisma/
│   └── schema.prisma        # Database schema
└── public/                  # Static files
```

## 🔧 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run start` - Chạy production server
- `npm run lint` - Lint code
- `npm run db:push` - Push schema lên database
- `npm run db:studio` - Mở Prisma Studio
- `npm run db:generate` - Generate Prisma Client

## 📧 Email Notification

Email nhắc nhở được gửi tự động qua cron job:

```
GET /api/cron/notify
Authorization: Bearer YOUR_CRON_SECRET
```

Cấu hình cron job trên Vercel hoặc sử dụng service như Cron-job.org

## 🔒 Authentication

Dự án sử dụng NextAuth với Google OAuth. Để cấu hình:

1. Tạo OAuth credentials tại [Google Cloud Console](https://console.cloud.google.com)
2. Thêm `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` vào `.env`
3. Thêm callback URL: `http://localhost:3000/api/auth/callback/google`

## 📊 Database Schema

- **User**: Thông tin người dùng
- **Subscription**: Thông tin subscription
- **FamilyGroup**: Nhóm chia sẻ
- **Member**: Thành viên trong nhóm
- **EmailLog**: Lịch sử gửi email

## 🚢 Deploy

### Vercel (Recommended)

1. Push code lên GitHub
2. Import project vào Vercel
3. Cấu hình environment variables
4. Deploy!

### VPS

1. Build project: `npm run build`
2. Chạy: `npm start`
3. Sử dụng PM2 hoặc systemd để quản lý process

## 📝 License

MIT

## 👥 Author

Your Name
