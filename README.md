# Preorder System

A modern preorder management system built with Next.js 16, Prisma, and SQLite. This application allows users to create, read, update, and delete preorders with advanced filtering, sorting, and pagination capabilities.

## Features

- **Preorder Management**: Create, read, update, and delete preorders with ease
- **Advanced Filtering**: Filter preorders by status (All, Active, Inactive)
- **Flexible Sorting**: Sort by Name, Created Date, Start Date, or End Date
- **Cursor-Based Pagination**: Efficient pagination using cursor-based approach for better performance
- **Status Management**: Toggle preorder status with real-time updates
- **Selection Checkboxes**: Select individual or all preorders for bulk operations
- **Form Validation**: Comprehensive client and server-side validation
- **Responsive UI**: Clean, modern interface that matches provided designs

## Tech Stack

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

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Docker Desktop or Docker Engine, if you want to run with Docker

### Setup Using Docker

Docker is the easiest way to run the production build locally. The container creates the SQLite schema automatically and seeds sample data when the database is empty.

1. **Build the image**

```bash
docker build -t preorder-system .
```

2. **Run the container with a persistent database volume**

```bash
docker run --rm -p 3000:3000 -v preorder-data:/data preorder-system
```

3. **Open your browser**

Navigate to `http://localhost:3000`.

The app stores SQLite data at `/data/preorder.db` inside the container. The `preorder-data` Docker volume keeps that database between container restarts.

4. **Optional: disable automatic sample seeding**

```bash
docker run --rm -p 3000:3000 -v preorder-data:/data -e SEED_DATABASE=false preorder-system
```

5. **Optional: reset Docker database data**

Stop the container, then remove the Docker volume:

```bash
docker volume rm preorder-data
```

### Setup Without Docker

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

## Project Structure

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

## Troubleshooting

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

## System Design

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

## Security Considerations

1. **Input Validation**: All user inputs validated on both client and server
2. **CSRF Protection**: Built into Next.js
3. **SQL Injection Prevention**: Prisma ORM handles parameterized queries
4. **XSS Prevention**: React escapes values by default
5. **Rate Limiting**: Consider adding rate limiting middleware for production
6. **Authentication**: Consider adding authentication for production use

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## Support

For issues or questions, please create an issue in the repository.

---

**Last Updated**: 2026-06-23
**Version**: 1.0.0
