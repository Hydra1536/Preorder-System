# Preorder System

A modern preorder management system built with Next.js 16, Prisma, and SQLite. This application allows users to create, read, update, and delete preorders with advanced filtering, sorting, and pagination capabilities.

## 🎯 Features

- **Preorder Management**: Create, read, update, and delete preorders with ease
- **Advanced Filtering**: Filter preorders by status (All, Active, Inactive)
- **Flexible Sorting**: Sort by Name, Created Date, Start Date, or End Date
- **Cursor-Based Pagination**: Efficient pagination using cursor-based approach for better performance
- **Status Management**: Toggle preorder status with real-time updates
- **Selection Checkboxes**: Select individual or all preorders for bulk operations
- **Form Validation**: Comprehensive client and server-side validation
- **Responsive UI**: Clean, modern interface that matches provided designs

## 💻 Tech Stack

### Frontend

- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework

### Backend

- **Next.js API Routes**: RESTful API endpoints
- **Prisma ORM**: Type-safe database access
- **SQLite**: Lightweight database

### Development

- **Node.js**: JavaScript runtime
- **npm/yarn**: Package management

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository** (or download the project)

```bash
cd "d:\Preorder System"
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up the database**

```bash
# Create SQLite database and run migrations
npm run db:push

# Seed the database with sample data
npm run db:seed
```

4. **Start the development server**

```bash
npm run dev
```

5. **Open your browser**
   Navigate to `http://localhost:3000` to see the application

The application will automatically redirect you to the preorders list page.

## 📚 Project Structure

```
.
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   └── preorders/        # Preorder API endpoints
│   ├── preorders/            # Preorder pages
│   │   ├── page.tsx          # List page
│   │   ├── create/           # Create page
│   │   └── [id]/edit/        # Edit page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── page.tsx              # Home page (redirects to /preorders)
├── components/               # React components
│   ├── PreorderTable.tsx     # Table display component
│   ├── PreorderForm.tsx      # Form for create/edit
│   ├── FilterTabs.tsx        # Filter and sort UI
│   ├── StatusToggle.tsx      # Status toggle switch
│   └── DeleteButton.tsx      # Delete action button
├── lib/                      # Utility functions
│   ├── prisma.ts             # Prisma client singleton
│   ├── validation.ts         # Input validation & sanitization
│   └── utils.ts              # Helper functions
├── prisma/                   # Prisma configuration
│   ├── schema.prisma         # Database schema
│   ├── seed.js               # Database seeding script
│   └── dev.db                # SQLite database file
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
└── .env.local                # Environment variables
```

## 🔌 API Endpoints

### Get Preorders

```
GET /api/preorders?filter=all&sort=createdAt&direction=desc&limit=10&cursor=<base64>
```

**Query Parameters:**

- `filter`: `all` | `active` | `inactive` (default: `all`)
- `sort`: `name` | `createdAt` | `startsAt` | `endsAt` (default: `createdAt`)
- `direction`: `asc` | `desc` (default: `desc`)
- `limit`: Number (default: 10, max: 100)
- `cursor`: Base64-encoded cursor for pagination (optional)

**Response:**

```json
{
  "data": [{ preorder objects }],
  "nextCursor": "base64string or null",
  "hasMore": boolean,
  "total": number
}
```

### Create Preorder

```
POST /api/preorders/create
```

**Request Body:**

```json
{
  "name": "string",
  "products": number,
  "preorderWhen": "out-of-stock" | "regardless-of-stock",
  "startsAt": "ISO date string",
  "endsAt": "ISO date string or null",
  "status": boolean
}
```

### Get Single Preorder

```
GET /api/preorders/[id]
```

### Update Preorder

```
PUT /api/preorders/[id]/update
```

**Request Body:** Same as Create (all fields optional for updates)

### Toggle Status

```
PATCH /api/preorders/[id]/status
```

**Request Body:**

```json
{
  "status": boolean
}
```

### Delete Preorder

```
DELETE /api/preorders/[id]/delete
```

## 🛡️ Security Features

### Strict Input Sanitization

- All user inputs are validated and sanitized before database operations
- Type checking for all input parameters
- String length validation to prevent injection attacks

### Database Indexing

The schema includes strategic indexes for performance:

- Index on `createdAt` for sorting and filtering
- Index on `startsAt` and `endsAt` for date-based queries
- Index on `status` for quick filtering
- Index on `name` for search operations
- Unique constraint on `name` to prevent duplicates

### Explicit Field Whitelisting

- Only explicitly whitelisted fields can be used for sorting: `name`, `createdAt`, `startsAt`, `endsAt`
- Only whitelisted filter values are accepted: `all`, `active`, `inactive`
- Direction limited to: `asc`, `desc`

### Enforced Default Fallbacks

- Invalid sort fields default to `createdAt`
- Invalid directions default to `desc`
- Invalid limits default to 10 (max 100)
- Page numbers default to 1 if invalid

### Partial Text Optimization

- Search queries trimmed to 100 characters maximum
- Special characters filtered from search inputs
- Only alphanumeric characters, spaces, and hyphens allowed

### Logical Operator Constraints

- Pagination limit capped at 100 to prevent performance issues
- Page-based validation to ensure logical consistency
- Cursor validation to prevent invalid pagination states

## 📊 Database Schema

### Preorder Model

```prisma
model Preorder {
  id           String   @id @default(cuid())
  name         String   @unique
  products     Int
  preorderWhen String   // "out-of-stock" or "regardless-of-stock"
  startsAt     DateTime
  endsAt       DateTime?
  status       Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Indexes for performance optimization
  @@index([createdAt])
  @@index([startsAt])
  @@index([endsAt])
  @@index([status])
  @@index([name])
}
```

## 🔄 Cursor-Based Pagination

The application uses cursor-based pagination for improved performance and reliability:

**Advantages:**

- More efficient than offset-based pagination for large datasets
- Handles insertions/deletions between requests gracefully
- Deterministic results with stable ordering
- No "n+1" problems on large datasets

**How it works:**

1. Request initial batch of items (includes an extra item to determine if more exist)
2. If more items exist, encode the ID of the last item as the next cursor (base64)
3. Next request includes the cursor parameter for pagination
4. Results always include secondary sort by ID for deterministic tie-breaking

## 📋 Available Scripts

```bash
# Development
npm run dev                # Start development server

# Production
npm run build              # Build for production
npm start                  # Start production server

# Database
npm run db:push            # Create/update database schema
npm run db:studio          # Open Prisma Studio (GUI)
npm run db:seed            # Seed database with sample data
npm run db:reset           # Reset database and seed

# Testing & Linting
npm run lint               # Run ESLint
npm test                   # Run tests (Jest)
npm run test:watch        # Run tests in watch mode
```

## 🧪 Testing Guide

### Manual Testing

#### 1. **Preorder List Page**

- [ ] Navigate to `/preorders` - List displays all preorders
- [ ] Filter by "Active" - Only active preorders shown
- [ ] Filter by "Inactive" - Only inactive preorders shown
- [ ] Filter by "All" - All preorders shown
- [ ] Click sort icon - Dropdown menu appears
- [ ] Select different sort options - Data sorted correctly
- [ ] Select ascending/descending - Sort direction changes
- [ ] Select all checkbox - All visible items get selected
- [ ] Deselect all checkbox - All items deselected
- [ ] Select individual items - Individual selection works
- [ ] Pagination shows correct range
- [ ] Click "Create Preorder" button - Navigates to create page

#### 2. **Create Preorder Page**

- [ ] Navigate to `/preorders/create`
- [ ] Back button visible - Clicking navigates back to list
- [ ] Fill form with valid data
  - [ ] Name field accepts text
  - [ ] Products field accepts numbers
  - [ ] Preorder when dropdown has options
  - [ ] Starts at date picker works
  - [ ] Ends at date picker optional
  - [ ] Status toggle switches
- [ ] Submit form - Saves to database and redirects
- [ ] Error for missing name - Shows error message
- [ ] Error for invalid products - Shows error message
- [ ] Cancel button - Returns to list without saving
- [ ] Save button loading state - Shows "Saving..." while saving

#### 3. **Edit Preorder Page**

- [ ] Click edit (pencil) icon on any preorder
- [ ] Form pre-filled with existing values
- [ ] Modify any field - Change is reflected
- [ ] Save changes - Updates in database
- [ ] Back button works - Returns to list
- [ ] Cancel button works - Discards changes
- [ ] Status toggle on form - Updates correctly

#### 4. **Status Toggle**

- [ ] Click status toggle on list
- [ ] Toggle switches immediately
- [ ] Database updates
- [ ] No page reload needed
- [ ] Toggle again - Reverts to original status

#### 5. **Delete Action**

- [ ] Click delete (trash) icon
- [ ] Confirmation dialog appears
- [ ] Cancel confirmation - Item remains
- [ ] Confirm deletion - Item removed from list and database
- [ ] Item no longer appears in any filter

#### 6. **Data Validation**

- [ ] Create with duplicate name - Shows error
- [ ] Name with special characters - Sanitized properly
- [ ] Very long name - Truncated or validated
- [ ] Negative products - Shows error
- [ ] Large product numbers - Accepted (within limits)
- [ ] Invalid dates - Shows error
- [ ] End date before start date - Handled appropriately

#### 7. **Pagination**

- [ ] Initial load - Shows first 10 items
- [ ] Next button - Loads next page
- [ ] Previous button - Loads previous page
- [ ] Total count - Accurate count displayed
- [ ] Cursor persistence - Correct items shown per page

### Automated Testing Example

Create a test file at `__tests__/api/preorders.test.ts`:

```typescript
describe("Preorders API", () => {
  it("should fetch all preorders", async () => {
    const response = await fetch("http://localhost:3000/api/preorders");
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("data");
    expect(data).toHaveProperty("nextCursor");
    expect(data).toHaveProperty("hasMore");
  });

  it("should filter active preorders", async () => {
    const response = await fetch(
      "http://localhost:3000/api/preorders?filter=active",
    );
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data.every((p: any) => p.status === true)).toBe(true);
  });

  it("should create a preorder", async () => {
    const response = await fetch("http://localhost:3000/api/preorders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Preorder",
        products: 5,
        preorderWhen: "regardless-of-stock",
        startsAt: new Date().toISOString(),
        endsAt: null,
        status: true,
      }),
    });
    expect(response.status).toBe(201);
  });
});
```

Run with: `npm test`

### Testing Checklist

**Frontend:**

- [ ] All form fields render correctly
- [ ] Form validation works
- [ ] API calls succeed
- [ ] Error messages display properly
- [ ] Loading states show correctly
- [ ] Redirects work as expected
- [ ] UI matches design screenshots

**Backend:**

- [ ] All API endpoints accessible
- [ ] Input validation working
- [ ] Database operations successful
- [ ] Proper error responses
- [ ] Pagination cursor working
- [ ] Filtering and sorting accurate
- [ ] Status updates reflected immediately

**Database:**

- [ ] Schema created correctly
- [ ] Sample data seeded successfully
- [ ] Indexes created for performance
- [ ] Unique constraints enforced
- [ ] Timestamps auto-populated
- [ ] Relationships working correctly

## 🎨 UI Design Details

The application follows the design specifications from the provided UI screenshots:

- **Color Scheme**: Neutral grays with black accents
- **Typography**: Clean, readable sans-serif
- **Spacing**: Consistent padding and margins
- **Components**: Buttons, toggles, form inputs styled consistently
- **Responsive**: Works on desktop and tablet screens

## 🐛 Troubleshooting

### Database Issues

```bash
# Reset database completely
npm run db:reset

# View database with Prisma Studio
npm run db:studio
```

### Port Already in Use

```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :3000
kill -9 <PID>
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## 📝 Design Decisions

### 1. **Cursor-Based Pagination**

- **Why**: More efficient than offset-based pagination
- **Benefit**: Better performance with large datasets, handles insertions/deletions gracefully

### 2. **Strict Input Sanitization**

- **Why**: Prevent injection attacks and data corruption
- **Implementation**: Validation functions for all inputs, type checking, length limits

### 3. **Database Indexing Strategy**

- **Why**: Optimize query performance
- **Implementation**: Indexes on frequently sorted/filtered fields (createdAt, startsAt, endsAt, status, name)

### 4. **Explicit Field Whitelisting**

- **Why**: Prevent invalid queries and ensure consistent results
- **Implementation**: Only allowed sort fields and filter values accepted

### 5. **Enforced Default Fallbacks**

- **Why**: Ensure deterministic behavior
- **Implementation**: Invalid parameters default to sensible values, logged for debugging

### 6. **Typescript Throughout**

- **Why**: Type safety reduces bugs
- **Implementation**: Strict mode enabled, type definitions for all functions

### 7. **Component-Based Architecture**

- **Why**: Reusable, maintainable code
- **Implementation**: Separate components for table, form, filters, etc.

## 🔐 Security Considerations

1. **Input Validation**: All user inputs validated on both client and server
2. **CSRF Protection**: Built into Next.js
3. **SQL Injection Prevention**: Prisma ORM handles parameterized queries
4. **XSS Prevention**: React escapes values by default
5. **Rate Limiting**: Consider adding rate limiting middleware for production
6. **Authentication**: Consider adding authentication for production use

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**Last Updated**: 2026-06-23
**Version**: 1.0.0
