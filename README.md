# Next.js CSR Authentication Template

A comprehensive template for building client-side rendered (CSR) Next.js applications with React Router v7, authentication, protected routes, and a simple API.

## Features

- **Client-Side Rendering (CSR)**
  - Single Page Application (SPA) architecture
  - React Router v7 for client-side routing
  - Next.js for API routes and server-side functionality

- **Complete Authentication System**
  - Login and Registration
  - Protected Routes
  - Role-Based Access Control (Admin vs Regular Users)

- **API Integration**
  - Auth API (Login, Register)
  - Products API (CRUD operations)
  - Admin Dashboard

- **Modular Architecture**
  - Feature-based organization
  - Clean separation of concerns
  - Reusable components and hooks

## Project Structure

The project follows a feature-based structure:

```
src/
├── features/              # Feature-based modules
│   ├── auth/              # Authentication feature
│   ├── dashboard/         # Dashboard feature
│   ├── profile/           # Profile feature
│   └── admin/             # Admin features
├── shared/                # Shared code across features
│   ├── components/        # Shared UI components
│   ├── hooks/             # Shared custom hooks
│   ├── lib/               # Utility libraries
│   ├── routes/            # Route definitions and guards
│   ├── services/          # Shared services
│   └── utils/             # Utility functions
├── pages/
│   ├── api/               # Next.js API routes 
│   └── index.js           # Entry point for SPA
├── styles/                # Global styles
└── App.jsx                # Main SPA component
```

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Seed the database: `npm run seed`
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Database Seeding

The template includes a simple JSON database stored in `data/db.json`. To reset the database to its initial state with the default admin user, run:

```bash
npm run seed
```

## Authentication

The template uses a simple token-based authentication system with localStorage for persistence. In a production environment, you should implement proper JWT handling, HTTP-only cookies, and more secure authentication practices.

### Default Admin Account

- **Email:** admin@example.com
- **Password:** adminpassword

## API Routes

- `/api/auth/login`: POST - Authenticate user
- `/api/auth/register`: POST - Register new user
- `/api/products`: GET (public), POST (admin)
- `/api/products/[id]`: GET (public), PUT/DELETE (admin)

## Client-Side Routing

The template uses React Router v7 for client-side routing:

- `/`: Dashboard home (protected)
- `/profile`: User profile (protected)
- `/login`: Login page (public)
- `/register`: Registration page (public)
- `/admin/users`: User management (admin only)
- `/admin/invitation-codes`: Invitation codes (admin only)

## Customization

This template is designed to be a starting point. You can:

- Replace the simple JSON database with MongoDB, PostgreSQL, etc.
- Enhance security with proper JWT implementation
- Add more features or expand existing ones
- Customize the UI to match your brand

## License

MIT