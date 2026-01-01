# Architecture Documentation

This document provides a comprehensive overview of the VizLock application architecture, design decisions, and technical implementation details.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Patterns](#architecture-patterns)
- [Directory Structure](#directory-structure)
- [Technology Stack](#technology-stack)
- [Authentication Flow](#authentication-flow)
- [Database Schema](#database-schema)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Security Architecture](#security-architecture)
- [State Management](#state-management)
- [Routing](#routing)
- [Styling Approach](#styling-approach)
- [Performance Optimizations](#performance-optimizations)
- [Future Improvements](#future-improvements)

## System Overview

VizLock is a full-stack web application built with Next.js 15 (App Router) that implements a visual password authentication system. Users authenticate by clicking specific coordinates on an image rather than using traditional text passwords.

### Key Components

1. **Frontend**: Next.js React application with TypeScript
2. **Backend**: Next.js API Routes (serverless functions)
3. **Database**: MongoDB with Mongoose ODM
4. **Authentication**: JWT-based with HTTP-only cookies

## Architecture Patterns

### 1. Server-Side Rendering (SSR) / Static Generation

Next.js App Router provides:
- Server Components by default (reduced client bundle)
- Static generation for optimal performance
- Dynamic rendering when needed

### 2. API Routes Pattern

Next.js API Routes act as the backend layer:
- Serverless functions
- RESTful endpoints
- Type-safe request/response handling

### 3. Component-Based Architecture

- Reusable UI components (shadcn/ui)
- Feature-based component organization
- Separation of concerns

### 4. Middleware Pattern

Next.js middleware handles:
- Route protection
- Authentication checks
- Request redirection

## Directory Structure

```
visual-lock-security/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group (no URL segment)
│   │   ├── layout.tsx            # Auth pages layout
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── register/
│   │       └── page.tsx          # Register page
│   ├── api/                      # API Routes
│   │   ├── login/
│   │   │   └── route.ts          # Login endpoint
│   │   ├── register/
│   │   │   └── route.ts          # Register endpoint
│   │   └── logout/
│   │       └── route.ts          # Logout endpoint
│   ├── dashboard/                # Protected dashboard
│   │   ├── layout.tsx            # Dashboard layout
│   │   ├── page.tsx              # Dashboard page
│   │   └── data.json             # Sample data
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── app-sidebar.tsx           # Dashboard sidebar
│   ├── chart-area-interactive.tsx
│   ├── data-table.tsx
│   ├── Navbar.tsx
│   └── ...
├── lib/                          # Utility libraries
│   ├── auth.ts                   # JWT utilities
│   ├── db.ts                     # Database connection
│   └── utils.ts                  # General utilities
├── models/                       # Database models
│   └── User.ts                   # User schema
├── hooks/                        # React hooks
│   └── use-mobile.ts
├── middleware.ts                 # Next.js middleware
├── public/                       # Static assets
└── ...
```

## Technology Stack

### Frontend

- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Headless UI primitives
- **shadcn/ui**: Component library
- **next-themes**: Theme management

### Backend

- **Next.js API Routes**: Serverless functions
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **Jose**: JWT implementation

### Development Tools

- **TypeScript**: Type checking
- **ESLint**: Code linting
- **Turbopack**: Fast bundler (dev mode)

## Authentication Flow

### Registration Flow

```
User Input → Frontend Validation → POST /api/register
    ↓
Database Check (username exists?)
    ↓
Create User Document → Save to MongoDB
    ↓
Return Success Response
```

### Login Flow

```
User Input → Frontend Validation → POST /api/login
    ↓
Database Query (find user)
    ↓
Coordinate Matching (with 50px tolerance)
    ↓
Generate JWT Token → Set HTTP-only Cookie
    ↓
Redirect to /dashboard
```

### Authentication Middleware

```
Request → Middleware Check
    ↓
Extract auth_token from cookies
    ↓
Route Type:
    - Protected Route (/dashboard/*)
      → Token exists? → Allow / Redirect to /login
    - Auth Route (/login, /register)
      → Token exists? → Redirect to /dashboard / Allow
```

### Session Management

- **Token Storage**: HTTP-only cookies (prevents XSS)
- **Token Expiration**: 7 days
- **Token Refresh**: Not implemented (future enhancement)
- **Multi-Device**: Supported (separate cookies per device)

## Database Schema

### User Model

```typescript
{
  username: {
    type: String,
    unique: true,
    required: true
  },
  passwordCoords: [{
    x: Number,
    y: Number
  }],
  _id: ObjectId,
  __v: Number
}
```

**Indexes**:
- `username`: Unique index (enforced by Mongoose)

**Constraints**:
- Username must be unique
- Exactly 5 coordinates required (enforced in application logic)

### Database Connection

The application uses Mongoose with connection caching to optimize database connections in serverless environments:

```typescript
// Connection caching prevents multiple connections
let cached = global.mongoose || { conn: null, promise: null }
```

This pattern is essential for Next.js API Routes which can be invoked multiple times in serverless environments.

## Frontend Architecture

### Component Hierarchy

```
RootLayout (app/layout.tsx)
  └── ThemeProvider
      ├── Auth Pages (app/(auth)/)
      │   ├── LoginPage
      │   └── RegisterPage
      └── Dashboard (app/dashboard/)
          └── SidebarProvider
              ├── AppSidebar
              └── SidebarInset
                  ├── SiteHeader
                  ├── SectionCards
                  ├── ChartAreaInteractive
                  └── DataTable
```

### State Management

The application uses React's built-in state management:

- **Local State**: `useState` for component-level state
- **No Global State Library**: No Redux/Zustand (can be added if needed)
- **Server State**: Next.js Server Components for data fetching

### Client vs Server Components

- **Server Components**: Default in App Router (reduced bundle size)
- **Client Components**: Marked with `'use client'` directive
  - Interactive components (forms, buttons)
  - Components using hooks (useState, useEffect)
  - Theme providers

### Data Fetching

- **Server Components**: Direct database access
- **Client Components**: Fetch API calls to API Routes
- **No SWR/React Query**: Can be added for caching/invalidation

## Backend Architecture

### API Routes

Next.js API Routes are serverless functions that handle HTTP requests:

```
Request → route.ts → Handler Function → Response
```

**Route Handlers**:
- `POST /api/register`: User registration
- `POST /api/login`: User authentication
- `POST /api/logout`: Session termination

### Error Handling

```typescript
try {
  // Business logic
} catch (error) {
  return NextResponse.json(
    { error: 'Error message' },
    { status: 400 }
  )
}
```

**Error Response Format**:
```json
{
  "error": "Human-readable error message"
}
```

### Database Access Pattern

```typescript
// 1. Connect to database
await connectToDatabase()

// 2. Perform operations
const user = await User.findOne({ username })

// 3. Return response
return NextResponse.json({ data })
```

## Security Architecture

### Authentication Security

1. **JWT Tokens**
   - Signed with HS256 algorithm
   - 7-day expiration
   - Stored in HTTP-only cookies

2. **Password Security**
   - Visual coordinates (not text passwords)
   - 50px tolerance buffer
   - Order-dependent matching

3. **Cookie Security**
   - `HttpOnly`: Prevents JavaScript access (XSS protection)
   - `Secure`: HTTPS only (production)
   - `SameSite: lax`: CSRF protection

### Route Protection

Middleware protects routes before rendering:
- Checks for authentication token
- Redirects unauthenticated users
- Prevents authenticated users from accessing auth pages

### Input Validation

- Client-side validation (UX)
- Server-side validation (security)
- Type checking with TypeScript

### Security Considerations

**Current Limitations**:
- No rate limiting
- No password complexity requirements
- No account lockout after failed attempts
- No two-factor authentication

**Recommended Enhancements**:
- Implement rate limiting
- Add password pattern strength requirements
- Add account lockout mechanism
- Consider 2FA for enhanced security

## State Management

### Current Approach

- **Local State**: React `useState` for component state
- **Server State**: Next.js Server Components
- **Form State**: Controlled components with useState

### Potential Improvements

- **Global State**: Zustand/Redux for shared state
- **Server State**: SWR/React Query for API caching
- **Form State**: React Hook Form for complex forms

## Routing

### Next.js App Router

- **File-based routing**: Directory structure defines routes
- **Route Groups**: `(auth)` groups routes without URL segment
- **Layouts**: Shared layouts for route segments
- **Middleware**: Runs before route handlers

### Route Structure

```
/                    → app/page.tsx
/login               → app/(auth)/login/page.tsx
/register            → app/(auth)/register/page.tsx
/dashboard           → app/dashboard/page.tsx
/api/login           → app/api/login/route.ts
/api/register        → app/api/register/route.ts
/api/logout          → app/api/logout/route.ts
```

## Styling Approach

### Tailwind CSS

- Utility-first CSS framework
- JIT (Just-In-Time) compilation
- Responsive design utilities
- Dark mode support

### Component Styling

- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **Custom Styles**: Tailwind utility classes
- **Global Styles**: `app/globals.css`

### Theme System

- **next-themes**: Theme provider
- **System Preference**: Detects OS theme
- **Manual Toggle**: User can override
- **CSS Variables**: For theme colors

## Performance Optimizations

### Current Optimizations

1. **Server Components**: Reduced client bundle
2. **Image Optimization**: Next.js Image component
3. **Font Optimization**: Next.js font optimization
4. **Database Connection Caching**: Prevents reconnections

### Potential Optimizations

1. **Code Splitting**: Dynamic imports for large components
2. **API Caching**: Cache API responses
3. **Static Generation**: Pre-render static pages
4. **Database Indexing**: Optimize queries
5. **CDN**: Serve static assets from CDN
6. **Bundle Analysis**: Identify and reduce bundle size

## Future Improvements

### Short Term

- [ ] Add loading states
- [ ] Improve error handling UI
- [ ] Add form validation feedback
- [ ] Implement password reset
- [ ] Add user profile management

### Medium Term

- [ ] Add rate limiting
- [ ] Implement session management
- [ ] Add analytics dashboard
- [ ] Improve coordinate matching algorithm
- [ ] Add password strength indicators

### Long Term

- [ ] Multi-factor authentication
- [ ] Social login integration
- [ ] API versioning
- [ ] GraphQL API
- [ ] Real-time features (WebSockets)
- [ ] Mobile app support
- [ ] Advanced analytics
- [ ] Audit logging

## Design Decisions

### Why Visual Passwords?

- **Memorability**: Easier to remember than complex passwords
- **Uniqueness**: Pattern-based authentication
- **Security**: No password reuse across sites
- **User Experience**: Intuitive and engaging

### Why Next.js?

- **Full-Stack**: Single framework for frontend and backend
- **Performance**: Server-side rendering and optimization
- **Developer Experience**: Excellent tooling and TypeScript support
- **Ecosystem**: Large community and resources

### Why MongoDB?

- **Flexibility**: Schema-less design for coordinate arrays
- **Scalability**: Horizontal scaling capabilities
- **Developer Experience**: Easy to work with
- **JSON-like**: Natural fit for JavaScript/TypeScript

### Why JWT?

- **Stateless**: No server-side session storage
- **Scalable**: Works across multiple servers
- **Standard**: Industry-standard authentication
- **Secure**: Cryptographic signing

## Conclusion

This architecture provides a solid foundation for the VizLock application. The modular structure, modern technologies, and security considerations create a maintainable and scalable system. Future enhancements can be added incrementally without major refactoring.
