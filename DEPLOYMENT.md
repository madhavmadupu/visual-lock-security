# Deployment Guide

This guide covers deployment strategies and best practices for the VizLock application.

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Configuration](#environment-configuration)
- [Vercel Deployment](#vercel-deployment)
- [Self-Hosted Deployment](#self-hosted-deployment)
- [Docker Deployment](#docker-deployment)
- [Database Setup](#database-setup)
- [Security Considerations](#security-considerations)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All tests pass (when implemented)
- [ ] Environment variables are configured
- [ ] Database is set up and accessible
- [ ] Build completes without errors (`npm run build`)
- [ ] No console errors in production build
- [ ] Security headers are configured
- [ ] HTTPS is enabled
- [ ] Error logging is set up

## Environment Configuration

### Required Environment Variables

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Generating JWT Secret

Generate a secure random string:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Environment-Specific Values

#### Development
```env
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

#### Production
```env
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Vercel Deployment

Vercel is the recommended platform for Next.js applications.

### Prerequisites

- Vercel account
- GitHub/GitLab/Bitbucket repository

### Deployment Steps

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

2. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

3. **Environment Variables**
   - Add all required environment variables in Vercel dashboard
   - Settings → Environment Variables
   - Add for Production, Preview, and Development

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `your-project.vercel.app`

### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate is automatically provisioned

### Vercel Configuration

Create `vercel.json` (optional):

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["iad1"]
}
```

## Self-Hosted Deployment

### Using Node.js

1. **Build the Application**
   ```bash
   npm install
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

3. **Use Process Manager (PM2)**
   ```bash
   npm install -g pm2
   pm2 start npm --name "vizlock" -- start
   pm2 save
   pm2 startup
   ```

### Using Nginx as Reverse Proxy

1. **Install Nginx**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Configure Nginx**
   Create `/etc/nginx/sites-available/vizlock`:

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/vizlock /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## Docker Deployment

### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
      - NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
    env_file:
      - .env
    restart: unless-stopped

  # Optional: MongoDB service (if not using external DB)
  # mongo:
  #   image: mongo:7
  #   ports:
  #     - "27017:27017"
  #   volumes:
  #     - mongo-data:/data/db
  #   restart: unless-stopped

# volumes:
#   mongo-data:
```

### Next.js Standalone Output

Update `next.config.ts`:

```typescript
const nextConfig = {
  output: 'standalone',
};

export default nextConfig;
```

### Building and Running

```bash
# Build
docker build -t vizlock .

# Run
docker run -p 3000:3000 --env-file .env vizlock

# Or use Docker Compose
docker-compose up -d
```

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free or paid cluster
   - Choose your preferred region

2. **Configure Access**
   - Database Access: Create database user
   - Network Access: Add IP whitelist (0.0.0.0/0 for all, or specific IPs)

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` and `<dbname>`

4. **Environment Variable**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/vizlock?retryWrites=true&w=majority
   ```

### Local MongoDB

For development or self-hosted:

1. **Install MongoDB**
   ```bash
   # Ubuntu/Debian
   sudo apt install mongodb

   # macOS
   brew install mongodb-community
   ```

2. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

3. **Connection String**
   ```env
   MONGO_URI=mongodb://localhost:27017/vizlock
   ```

## Security Considerations

### Production Security Checklist

- [ ] **HTTPS**: Always use HTTPS in production
- [ ] **Environment Variables**: Never commit secrets to git
- [ ] **JWT Secret**: Use strong, random JWT secret
- [ ] **Cookie Security**: Secure and HttpOnly cookies enabled
- [ ] **CORS**: Configure CORS if exposing API
- [ ] **Rate Limiting**: Implement rate limiting (recommended)
- [ ] **Input Validation**: Validate all inputs
- [ ] **Error Handling**: Don't expose sensitive errors
- [ ] **Dependencies**: Keep dependencies updated
- [ ] **Security Headers**: Configure security headers

### Security Headers

Add to `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### Rate Limiting

Consider implementing rate limiting:

```typescript
// middleware.ts (example)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimit = new Map();

export async function middleware(req: NextRequest) {
  // Rate limiting logic
  // ...
  
  return NextResponse.next();
}
```

Or use a service like:
- Upstash Redis
- Vercel Edge Middleware
- Cloudflare Rate Limiting

## Monitoring and Maintenance

### Logging

- Use a logging service (e.g., Logtail, Datadog)
- Log errors and important events
- Monitor application performance

### Error Tracking

- Set up error tracking (e.g., Sentry, Rollbar)
- Monitor production errors
- Set up alerts for critical errors

### Performance Monitoring

- Use Vercel Analytics (if on Vercel)
- Monitor API response times
- Track database query performance

### Regular Maintenance

- Update dependencies regularly
- Monitor security advisories
- Review and rotate secrets periodically
- Backup database regularly
- Monitor disk space and resources

## Troubleshooting

### Build Failures

**Issue**: Build fails with TypeScript errors
- **Solution**: Fix TypeScript errors locally before deploying
- Check `tsconfig.json` configuration

**Issue**: Build fails with module resolution errors
- **Solution**: Clear `.next` directory and `node_modules`, reinstall

### Runtime Errors

**Issue**: Application crashes on startup
- **Check**: Environment variables are set correctly
- **Check**: Database connection is working
- **Check**: Port 3000 is available

**Issue**: Database connection errors
- **Check**: `MONGO_URI` is correct
- **Check**: Network access (firewall, IP whitelist)
- **Check**: Database credentials are valid

### Performance Issues

**Issue**: Slow page loads
- **Optimize**: Images, bundle size
- **Enable**: Caching headers
- **Consider**: CDN for static assets

**Issue**: Database performance
- **Add**: Indexes on frequently queried fields
- **Monitor**: Query performance
- **Consider**: Database connection pooling

## Deployment Platforms

### Vercel (Recommended)
- ✅ Easy Next.js deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions

### Netlify
- ✅ Good Next.js support
- ✅ Easy deployment
- ✅ Free tier available

### Railway
- ✅ Simple deployment
- ✅ Built-in database options
- ✅ Good for full-stack apps

### DigitalOcean App Platform
- ✅ Managed platform
- ✅ Database options
- ✅ Good scaling options

### AWS/GCP/Azure
- ✅ Full control
- ✅ Enterprise-grade
- ⚠️ More complex setup

## CI/CD

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      # Add deployment steps
```

## Backup Strategy

### Database Backups

- **MongoDB Atlas**: Automated backups available
- **Self-hosted**: Set up regular backups
- **Frequency**: Daily backups recommended
- **Retention**: Keep 30 days minimum

### Code Backups

- Use version control (Git)
- Tag releases
- Keep deployment artifacts

---

For more information, refer to:
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
