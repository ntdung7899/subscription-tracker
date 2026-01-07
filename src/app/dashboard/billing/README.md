# Billing & Invoice Management System

A comprehensive billing and invoice management system for the Subscription Tracker SaaS application.

## Features

### 1. Billing Overview (`/dashboard/billing`)
- **Metrics Dashboard**: Displays 4 key metrics
  - Current Plan (plan name and price)
  - Next Billing Date
  - Last Payment (amount and date)
  - Account Status (active/inactive)
- **Quick Actions**:
  - Upgrade Plan → redirects to `/pricing`
  - Update Payment Method → redirects to billing settings
  - View All Invoices → redirects to invoice list
- **Billing Information Panel**: Shows plan details and pricing
- **Next Payment Notice**: Banner with upcoming payment date

### 2. Invoice List (`/dashboard/billing/invoices`)
- **Invoice Table**: Displays all user invoices with:
  - Invoice Number (unique identifier)
  - Issue Date
  - Billing Period (start - end dates)
  - Total Amount ($USD)
  - Status Badge (paid/unpaid/failed/canceled)
  - View Action (links to invoice detail)
- **Status Filter**: Filter invoices by status (all, paid, unpaid, failed)
- **Pagination**: Navigate through invoices with page controls
- **Empty State**: Friendly message when no invoices found
- **Loading State**: Spinner during data fetch

### 3. Invoice Detail (`/dashboard/billing/invoices/[invoiceId]`)
- **Invoice Header**: 
  - Invoice number and status badge
  - Download PDF button (placeholder)
  - Back to invoices navigation
- **Billing Information**:
  - From: Company details (Subscription Tracker)
  - Bill To: Customer information from BillingProfile
- **Invoice Dates**:
  - Date Issued
  - Due Date
  - Billing Period
- **Line Items Table**: Subscription charges
- **Amount Breakdown**:
  - Subtotal
  - Tax
  - Total (in USD)
- **Payment History**: List of related payments with:
  - Amount, payment method, date
  - Transaction reference
  - Payment status

### 4. Payment History (`/dashboard/billing/payments`)
- **Payment Table**: All payment transactions with:
  - Transaction ID (with reference)
  - Date and Time
  - Amount ($USD)
  - Payment Method (card/bank_transfer/wallet)
  - Status Badge (completed/pending/failed/refunded)
  - Related Invoice Number (clickable link)
- **Method Filter**: Filter by payment method
- **Pagination**: Navigate through payment history
- **Empty State**: Message when no payments found

### 5. Billing Settings (`/dashboard/billing/settings`)
- **Contact Information**:
  - Billing Email (required) - receives all invoices
- **Company Information**:
  - Company Name (optional)
  - Tax ID / VAT Number (optional)
- **Billing Address**:
  - Street Address
  - City, State/Province
  - ZIP/Postal Code
  - Country (dropdown selection)
- **Save/Cancel Actions**:
  - Change detection (enables buttons when modified)
  - Save Changes (PUT request to API)
  - Cancel (resets to original values)
  - Success/Error notifications
- **Payment Method Section**: 
  - Shows default card (placeholder)
  - Update payment method button

## Database Schema

### Invoice Model
```prisma
model Invoice {
  id                  String    @id @default(cuid())
  userId              String
  invoiceNumber       String    @unique
  issuedAt            DateTime  @default(now())
  dueDate             DateTime
  paidAt              DateTime?
  billingPeriodStart  DateTime
  billingPeriodEnd    DateTime
  subtotal            Int       // Amount in cents
  tax                 Int       // Amount in cents
  total               Int       // Amount in cents
  currency            String    @default("USD")
  status              String    @default("unpaid") // unpaid, paid, failed, canceled
  payments            Payment[]
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  @@index([userId])
  @@index([status])
}
```

### Payment Model
```prisma
model Payment {
  id             String   @id @default(cuid())
  userId         String
  invoiceId      String?
  invoice        Invoice? @relation(fields: [invoiceId], references: [id])
  amount         Int      // Amount in cents
  method         String   // card, bank_transfer, wallet
  status         String   @default("pending") // pending, completed, failed, refunded
  transactionRef String?  // External payment gateway reference
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  @@index([userId])
  @@index([invoiceId])
}
```

### BillingProfile Model
```prisma
model BillingProfile {
  id           String   @id @default(cuid())
  userId       String   @unique
  billingEmail String
  companyName  String?
  address      String?
  city         String?
  state        String?
  zipCode      String?
  country      String?
  taxId        String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

## API Endpoints

### 1. GET `/api/billing/overview`
**Description**: Get billing dashboard metrics  
**Authentication**: Required (NextAuth session)  
**Response**:
```json
{
  "currentPlan": {
    "name": "Pro",
    "price": 29.99,
    "cycle": "monthly"
  },
  "nextBillingDate": "2024-02-01T00:00:00.000Z",
  "lastPayment": {
    "amount": 29.99,
    "date": "2024-01-01T00:00:00.000Z"
  },
  "status": "active"
}
```

### 2. GET `/api/billing/invoices`
**Description**: List all user invoices with pagination and filtering  
**Authentication**: Required  
**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status (all, paid, unpaid, failed)

**Response**:
```json
{
  "invoices": [
    {
      "id": "inv_123",
      "invoiceNumber": "INV-2024-001",
      "issuedAt": "2024-01-01T00:00:00.000Z",
      "dueDate": "2024-01-15T00:00:00.000Z",
      "paidAt": "2024-01-05T00:00:00.000Z",
      "billingPeriodStart": "2024-01-01T00:00:00.000Z",
      "billingPeriodEnd": "2024-01-31T23:59:59.999Z",
      "total": 29.99,
      "currency": "USD",
      "status": "paid"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### 3. GET `/api/billing/invoices/[invoiceId]`
**Description**: Get detailed invoice information  
**Authentication**: Required (validates userId matches)  
**Response**:
```json
{
  "invoice": {
    "id": "inv_123",
    "invoiceNumber": "INV-2024-001",
    "issuedAt": "2024-01-01T00:00:00.000Z",
    "dueDate": "2024-01-15T00:00:00.000Z",
    "paidAt": "2024-01-05T00:00:00.000Z",
    "billingPeriodStart": "2024-01-01T00:00:00.000Z",
    "billingPeriodEnd": "2024-01-31T23:59:59.999Z",
    "subtotal": 27.26,
    "tax": 2.73,
    "total": 29.99,
    "currency": "USD",
    "status": "paid"
  },
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "companyName": "Acme Inc",
    "address": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94102",
    "country": "US",
    "taxId": "123-45-6789"
  },
  "payments": [
    {
      "id": "pay_123",
      "amount": 29.99,
      "method": "card",
      "status": "completed",
      "transactionRef": "ch_1234567890",
      "createdAt": "2024-01-05T00:00:00.000Z"
    }
  ]
}
```

### 4. GET `/api/billing/payments`
**Description**: List all user payments with pagination  
**Authentication**: Required  
**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

**Response**:
```json
{
  "payments": [
    {
      "id": "pay_123",
      "amount": 29.99,
      "method": "card",
      "status": "completed",
      "transactionRef": "ch_1234567890",
      "createdAt": "2024-01-05T00:00:00.000Z",
      "invoiceNumber": "INV-2024-001"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### 5. GET `/api/billing/settings`
**Description**: Get user's billing profile  
**Authentication**: Required  
**Response**:
```json
{
  "billingEmail": "john@example.com",
  "companyName": "Acme Inc",
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94102",
  "country": "US",
  "taxId": "123-45-6789"
}
```

### 6. PUT `/api/billing/settings`
**Description**: Update billing profile (upsert operation)  
**Authentication**: Required  
**Request Body**:
```json
{
  "billingEmail": "john@example.com",
  "companyName": "Acme Inc",
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94102",
  "country": "US",
  "taxId": "123-45-6789"
}
```
**Response**: Same as GET response

## Technical Implementation

### Financial Precision
- All amounts stored in **cents** (Int) to prevent floating-point errors
- Conversion to dollars happens in API responses: `amount / 100`
- Display formatted as: `$${amount.toFixed(2)}`

### Security
- All API routes protected with NextAuth `getServerSession`
- User isolation: `WHERE userId = session.user.id`
- Invoice access validation: 404 if userId doesn't match
- No sensitive data exposed in client-side code

### Pagination Pattern
```typescript
const skip = (page - 1) * limit
const [data, total] = await Promise.all([
  prisma.model.findMany({ skip, take: limit }),
  prisma.model.count()
])
const totalPages = Math.ceil(total / limit)
```

### Status Management
- **Invoice Status**: `unpaid | paid | failed | canceled`
- **Payment Status**: `pending | completed | failed | refunded`
- Color-coded badges for visual identification

### Upsert Pattern (Billing Settings)
```typescript
await prisma.billingProfile.upsert({
  where: { userId: session.user.id },
  update: { ...data },
  create: { userId: session.user.id, ...data }
})
```

## UI/UX Features

### Dark Mode Support
- All components fully support dark mode
- Consistent color scheme across billing pages
- Automatic theme detection and persistence

### Responsive Design
- Tables scroll horizontally on mobile
- Grid layouts adapt to screen size
- Touch-friendly interactive elements

### Loading States
- Spinner animations during data fetch
- Disabled buttons during async operations
- Skeleton screens (can be enhanced)

### Empty States
- Friendly messages when no data exists
- Relevant icons (FileText, CreditCard)
- Contextual help text

### Status Badges
- **Paid/Completed**: Green background
- **Unpaid/Pending**: Yellow background
- **Failed**: Red background
- **Canceled/Refunded**: Gray background

## Date Formatting
Uses `date-fns` library for consistent formatting:
- **Full Date**: `MMMM dd, yyyy` → "January 01, 2024"
- **Short Date**: `MMM dd, yyyy` → "Jan 01, 2024"
- **Date Range**: `MMM dd - MMM dd, yyyy` → "Jan 01 - Jan 31, 2024"
- **Time**: `HH:mm` → "14:30"

## Navigation Flow

```
/dashboard/billing (Overview)
  ├─ Quick Action: Upgrade Plan → /pricing
  ├─ Quick Action: Update Payment → /dashboard/billing/settings
  ├─ Quick Action: View Invoices → /dashboard/billing/invoices
  │
  /dashboard/billing/invoices (Invoice List)
    ├─ Filter by Status
    ├─ View Invoice → /dashboard/billing/invoices/[invoiceId]
    │   ├─ Download PDF (placeholder)
    │   ├─ View Payment → Payment from list
    │   └─ Back to Invoices
    │
  /dashboard/billing/payments (Payment History)
    ├─ Filter by Method
    ├─ View Invoice → /dashboard/billing/invoices/[invoiceId]
    │
  /dashboard/billing/settings (Billing Settings)
    ├─ Update Billing Info
    └─ Update Payment Method (placeholder)
```

## Future Enhancements

### High Priority
1. **PDF Invoice Generation**: Implement actual PDF download using libraries like `jspdf` or `pdfkit`
2. **Payment Gateway Integration**: Connect to Stripe/PayPal for real payment processing
3. **Email Notifications**: Send invoice emails when generated
4. **Automatic Billing**: Scheduled jobs to generate invoices and charge customers

### Medium Priority
5. **Invoice Customization**: Allow users to customize invoice templates
6. **Multiple Payment Methods**: Support multiple saved payment methods
7. **Refund Processing**: UI for issuing refunds
8. **Export Data**: Export invoices and payments to CSV/Excel
9. **Invoice Notes**: Add custom notes to invoices
10. **Payment Plans**: Support for installment payments

### Low Priority
11. **Tax Rate Configuration**: Dynamic tax rates based on location
12. **Multi-Currency**: Support for different currencies
13. **Dunning Management**: Automated retry logic for failed payments
14. **Credit Notes**: Issue credit notes for refunds
15. **Accounting Integration**: Export to QuickBooks, Xero, etc.

## Migration Command

To create the billing tables in your database:

```bash
npx prisma migrate dev --name add_billing_models
```

## Testing Checklist

- [ ] Overview page displays metrics correctly
- [ ] Invoice list shows all user invoices
- [ ] Invoice filter works for all statuses
- [ ] Invoice pagination navigates correctly
- [ ] Invoice detail shows complete information
- [ ] Payment history displays all transactions
- [ ] Payment filter works for all methods
- [ ] Payment pagination navigates correctly
- [ ] Billing settings loads existing data
- [ ] Billing settings saves updates successfully
- [ ] All API endpoints require authentication
- [ ] User can only access their own invoices
- [ ] Amounts display correctly (cents → dollars)
- [ ] Dates format consistently across pages
- [ ] Status badges show correct colors
- [ ] Dark mode works on all pages
- [ ] Mobile responsive on all pages
- [ ] Loading states show during async operations
- [ ] Empty states display when no data
- [ ] Error handling works for failed requests

## Dependencies

- **next**: ^14.2.35
- **react**: ^18
- **next-auth**: Latest (for authentication)
- **@prisma/client**: ^5.22.0
- **date-fns**: Latest (for date formatting)
- **lucide-react**: Latest (for icons)
- **typescript**: ^5.5.0

## License

This billing system is part of the Subscription Tracker SaaS application.
