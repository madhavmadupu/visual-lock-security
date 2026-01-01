# VizLock - Visual Lock Security System

A modern, secure authentication system that uses visual password patterns instead of traditional text-based passwords. Users authenticate by clicking on specific coordinates on an image, creating a unique and memorable password pattern.

## 🌟 Features

- **Visual Password Authentication**: Click 5 points on an image to create your password pattern
- **JWT-Based Security**: Secure token-based authentication with HTTP-only cookies
- **Protected Dashboard**: Beautiful, responsive dashboard with analytics and data visualization
- **User Management**: Easy registration and login flow
- **Modern UI**: Built with Next.js 15, React 19, and Tailwind CSS
- **Dark Mode Support**: Built-in theme switching
- **MongoDB Integration**: Persistent user data storage

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **MongoDB** (local instance or MongoDB Atlas account)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd visual-lock-security
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGO_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT token signing | Yes | - |
| `NEXT_PUBLIC_BASE_URL` | Base URL of the application | No | `http://localhost:3000` |
| `NODE_ENV` | Environment mode (development/production) | No | `development` |

### MongoDB Setup

#### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/vizlock`

#### MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `<password>` and `<dbname>` in the connection string

### JWT Secret

Generate a secure random string for `JWT_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📖 Usage

### Registration

1. Navigate to `/register`
2. Enter a unique username
3. Click 5 points on the security image to create your password pattern
4. Click "Submit" to create your account

### Login

1. Navigate to `/login`
2. Enter your username
3. Click the same 5 points you registered with (within a 50px tolerance)
4. Click "Submit" to authenticate

### Dashboard

After successful login, you'll be redirected to the protected dashboard (`/dashboard`) where you can:
- View analytics and statistics
- Browse data tables
- Access various features through the sidebar

### Logout

Click the logout button to clear your session and return to the login page.

## 📁 Project Structure

```
visual-lock-security/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── api/                 # API routes
│   │   ├── login/
│   │   ├── register/
│   │   └── logout/
│   ├── dashboard/           # Protected dashboard
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── ui/                  # UI components (shadcn/ui)
│   └── ...                  # Feature components
├── lib/                     # Utility libraries
│   ├── auth.ts              # JWT authentication helpers
│   ├── db.ts                # Database connection
│   └── utils.ts             # General utilities
├── models/                  # Database models
│   └── User.ts              # User schema
├── middleware.ts            # Next.js middleware
└── public/                  # Static assets
```

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🛠 Technology Stack

### Core
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript

### Database & Authentication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Jose** - JWT implementation

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **shadcn/ui** - UI component library
- **Lucide React** - Icon library
- **Tabler Icons** - Additional icons
- **next-themes** - Theme management

### Data Visualization
- **Recharts** - Charting library
- **TanStack Table** - Table component

### Other
- **Zod** - Schema validation
- **Sonner** - Toast notifications

## 📚 API Documentation

For detailed API documentation, see [API.md](./API.md).

### Quick Reference

- `POST /api/register` - Register a new user
- `POST /api/login` - Authenticate user
- `POST /api/logout` - Clear authentication session

## 🔒 Security Features

- **HTTP-Only Cookies**: Prevents XSS attacks
- **JWT Tokens**: Secure, stateless authentication
- **Password Tolerance**: 50px buffer for coordinate matching
- **Protected Routes**: Middleware-based route protection
- **Secure Cookies**: Enabled in production mode

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Development Tips

- The development server uses Turbopack for faster builds
- Hot module replacement is enabled
- Type checking is performed by TypeScript

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running (if using local instance)
- Verify your `MONGO_URI` is correct
- Check network connectivity for Atlas connections
- Verify database user credentials

### Authentication Issues

- Ensure `JWT_SECRET` is set in environment variables
- Clear browser cookies if experiencing login problems
- Check browser console for errors

### Build Errors

- Clear `.next` directory: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📝 License

This project is private and proprietary.

## 👥 Authors

- Project maintainers

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev) and [Tabler Icons](https://tabler.io/icons)

---

For more information, please refer to the detailed documentation files:
- [API Documentation](./API.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [Contributing Guidelines](./CONTRIBUTING.md)