# Grabeat Application Deployment Guide

## Table of Contents

- [Overview](#overview)
- [Deployment Options](#deployment-options)
- [Prerequisites](#prerequisites)
- [Option 1: Deploy to Cloud (Recommended)](#option-1-deploy-to-cloud-recommended)
  - [Backend Deployment (Railway/Render)](#backend-deployment-railwayrender)
  - [Database Deployment (Railway/Supabase)](#database-deployment-railwaysupabase)
  - [Redis Deployment (Upstash/Redis Cloud)](#redis-deployment-upstashredis-cloud)
  - [Frontend Deployment (Expo EAS)](#frontend-deployment-expo-eas)
- [Option 2: Deploy to VPS (Advanced)](#option-2-deploy-to-vps-advanced)
- [Option 3: Deploy with Docker (Self-Hosted)](#option-3-deploy-with-docker-self-hosted)
- [Environment Configuration](#environment-configuration)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Grabeat application consists of three main components that need to be deployed:

```
┌─────────────────────────────────────────────────────────┐
│                    DEPLOYMENT ARCHITECTURE               │
└─────────────────────────────────────────────────────────┘

┌──────────────────┐
│   Mobile App     │
│   (Expo/React    │ ──────┐
│    Native)       │       │
└──────────────────┘       │
                           │ HTTPS Requests
┌──────────────────┐       │
│   Web App        │ ──────┤
│   (Expo Web)     │       │
└──────────────────┘       │
                           ▼
                    ┌──────────────┐
                    │   Backend    │
                    │   (Node.js)  │
                    │   Port: 3000 │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
      ┌──────────┐  ┌──────────┐  ┌──────────┐
      │PostgreSQL│  │  Redis   │  │  Files   │
      │   DB     │  │  Cache   │  │ Storage  │
      │ Port:5432│  │ Port:6379│  │ (Future) │
      └──────────┘  └──────────┘  └──────────┘
```

---

## Deployment Options

### Comparison Table

| Option                   | Difficulty  | Cost     | Best For         | Pros                     | Cons            |
| ------------------------ | ----------- | -------- | ---------------- | ------------------------ | --------------- |
| **Cloud Platforms**      | ⭐ Easy     | $0-50/mo | Quick deployment | Fast setup, auto-scaling | Vendor lock-in  |
| **VPS (DigitalOcean)**   | ⭐⭐⭐ Hard | $5-20/mo | Full control     | Cost-effective, flexible | Manual setup    |
| **Docker (Self-hosted)** | ⭐⭐ Medium | $0-10/mo | Learning Docker  | Portable, consistent     | Requires server |

---

## Prerequisites

Before deploying, ensure you have:

✅ **Git & GitHub**

- Code pushed to GitHub repository
- `.env` files in `.gitignore`

✅ **Accounts Created** (for cloud deployment)

- [Railway](https://railway.app) or [Render](https://render.com) (Backend)
- [Supabase](https://supabase.com) or Railway (Database)
- [Upstash](https://upstash.com) (Redis)
- [Expo](https://expo.dev) (Mobile app)

✅ **Local Testing**

- Backend running successfully
- Database migrations working
- Mobile app connecting to backend

✅ **Environment Variables**

- Production values ready
- Secrets generated (JWT_SECRET)

---

## Option 1: Deploy to Cloud (Recommended)

This is the **easiest and fastest** way to deploy your application.

### Step 1: Deploy PostgreSQL Database

#### Option A: Railway (Recommended)

**Why Railway?**

- Free tier available
- One-click PostgreSQL deployment
- Automatic backups
- Great for startups

**Steps:**

1. **Go to [Railway.app](https://railway.app)** and sign up

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy PostgreSQL"

3. **Get Database URL**
   - Click on PostgreSQL service
   - Go to "Connect" tab
   - Copy the `DATABASE_URL` (looks like: `postgresql://user:password@host:5432/railway`)

4. **Configure Database**

   ```
   DATABASE_URL=postgresql://postgres:****@containers-us-west-123.railway.app:5432/railway
   ```

5. **Run Migrations**
   ```bash
   # In your local back-end directory
   DATABASE_URL="your-railway-url" npx prisma migrate deploy
   ```

#### Option B: Supabase (Free Tier)

**Why Supabase?**

- Generous free tier (500MB database)
- Built-in auth & storage
- Easy to use dashboard

**Steps:**

1. **Go to [Supabase.com](https://supabase.com)** and sign up

2. **Create New Project**
   - Project name: `grabeat`
   - Database password: (choose strong password)
   - Region: Closest to your users

3. **Get Connection String**
   - Go to Settings → Database
   - Copy "Connection string" (Transaction mode)
   - Replace `[YOUR-PASSWORD]` with your database password

4. **Connection String Format:**

   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

5. **Run Migrations:**
   ```bash
   DATABASE_URL="your-supabase-url" npx prisma migrate deploy
   ```

---

### Step 2: Deploy Redis

#### Option A: Upstash (Recommended - Free Tier)

**Why Upstash?**

- Serverless Redis
- Pay per request
- Free tier (10,000 commands/day)
- Global edge network

**Steps:**

1. **Go to [Upstash.com](https://upstash.com)** and sign up

2. **Create Redis Database**
   - Click "Create Database"
   - Name: `grabeat-tokens`
   - Type: Regional (for consistency) or Global (for performance)
   - Region: Choose closest to your backend

3. **Get Redis Credentials**
   - Go to your database dashboard
   - Copy connection details:
     ```
     REDIS_HOST=us1-xxxxx.upstash.io
     REDIS_PORT=6379
     REDIS_PASSWORD=your_password_here
     ```

4. **Update Backend Code** (if needed)

   Upstash requires TLS. Update `src/config/redis.js`:

   ```javascript
   const redis = new Redis({
     host: process.env.REDIS_HOST,
     port: process.env.REDIS_PORT,
     password: process.env.REDIS_PASSWORD,
     tls: process.env.NODE_ENV === "production" ? {} : undefined,
   });
   ```

#### Option B: Redis Cloud (Free 30MB)

**Steps:**

1. Go to [Redis.com/try-free](https://redis.com/try-free)
2. Create free database
3. Copy endpoint and password
4. Configure environment variables

---

### Step 3: Deploy Backend (Node.js API)

#### Option A: Railway

**Steps:**

1. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `Grabeat` repository
   - Select `back-end` folder as root

2. **Configure Build Settings**
   - Go to Settings → Build
   - Root Directory: `back-end`
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm start`

3. **Add Environment Variables**
   - Go to Variables tab
   - Add all variables:

   ```bash
   NODE_ENV=production
   PORT=3000
   HOST=0.0.0.0

   # Database (from Step 1)
   DATABASE_URL=postgresql://...

   # Redis (from Step 2)
   REDIS_HOST=...
   REDIS_PORT=6379
   REDIS_PASSWORD=...
   REDIS_DB=0

   # JWT (generate new secret)
   JWT_SECRET=your_production_secret_min_32_chars_here
   JWT_EXPIRES_IN=7d

   # Client URL (will update after frontend deployment)
   CLIENT_URL=https://your-frontend-url.com
   ```

4. **Generate JWT Secret**

   ```bash
   # Run locally to generate
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Copy the generated URL: `https://grabeat-backend.up.railway.app`

6. **Test Deployment**
   ```bash
   curl https://grabeat-backend.up.railway.app/health
   ```

#### Option B: Render (Free Tier)

**Steps:**

1. **Go to [Render.com](https://render.com)** and sign up

2. **Create Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository

3. **Configure Service**
   - Name: `grabeat-backend`
   - Region: Choose closest
   - Branch: `main` or `develop`
   - Root Directory: `back-end`
   - Runtime: `Node`
   - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `npm start`

4. **Set Environment Variables**
   - Add all variables from Railway example above

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - URL: `https://grabeat-backend.onrender.com`

**Note**: Render free tier spins down after inactivity (may be slow on first request)

#### Option C: Heroku

**Steps:**

1. **Install Heroku CLI**

   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**

   ```bash
   cd back-end
   heroku create grabeat-backend
   ```

3. **Add Buildpacks**

   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

4. **Set Environment Variables**

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set DATABASE_URL=your_database_url
   heroku config:set REDIS_HOST=your_redis_host
   heroku config:set JWT_SECRET=your_secret
   # ... add all others
   ```

5. **Deploy**

   ```bash
   git push heroku main
   ```

6. **Run Migrations**
   ```bash
   heroku run npx prisma migrate deploy
   ```

---

### Step 4: Deploy Frontend (React Native/Expo)

#### For Mobile App (Android/iOS)

**Using Expo Application Services (EAS)**

1. **Install EAS CLI**

   ```bash
   npm install -g eas-cli
   eas login
   ```

2. **Initialize EAS**

   ```bash
   cd front-end
   eas build:configure
   ```

3. **Update Backend URL**

   Create `front-end/app/config/api.config.ts`:

   ```typescript
   export const API_CONFIG = {
     BASE_URL: __DEV__ ? "http://localhost:3000" : "https://grabeat-backend.up.railway.app",
   };
   ```

   Update `app/utils/api.ts`:

   ```typescript
   import { API_CONFIG } from "../config/api.config";

   const BASE_URL = API_CONFIG.BASE_URL;
   ```

4. **Build for Android**

   ```bash
   eas build --platform android
   ```

5. **Build for iOS** (requires Apple Developer account - $99/year)

   ```bash
   eas build --platform ios
   ```

6. **Submit to Stores**

   ```bash
   # Google Play Store
   eas submit --platform android

   # Apple App Store
   eas submit --platform ios
   ```

#### For Web App

**Option A: Netlify**

1. **Create `front-end/netlify.toml`**

   ```toml
   [build]
     command = "expo export --platform web"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy**

   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Build
   npm run build

   # Deploy
   netlify deploy --prod
   ```

**Option B: Vercel**

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Deploy**

   ```bash
   cd front-end
   vercel
   ```

3. **Configure Build Settings**
   - Build Command: `expo export --platform web`
   - Output Directory: `dist`

---

### Step 5: Update Environment Variables

After all deployments, update these values:

1. **Backend - Update CLIENT_URL**

   ```bash
   # Railway/Render Dashboard
   CLIENT_URL=https://your-frontend-url.netlify.app
   ```

2. **Frontend - Update API URLs**

   ```typescript
   // app/config/api.config.ts
   BASE_URL: "https://grabeat-backend.up.railway.app";
   ```

3. **Redeploy Both**
   - Backend: Trigger redeploy on Railway/Render
   - Frontend: Push changes and redeploy

---

## Option 2: Deploy to VPS (Advanced)

**Recommended VPS Providers:**

- **DigitalOcean** ($5/month Droplet)
- **Linode** ($5/month Nanode)
- **AWS Lightsail** ($3.50/month)
- **Vultr** ($2.50/month)

### Step 1: Set Up Server

```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install Docker & Docker Compose
curl -fsSL https://get.docker.com | sh
apt install docker-compose -y

# Install Nginx (reverse proxy)
apt install nginx -y

# Install PM2 (process manager)
npm install -g pm2
```

### Step 2: Clone Repository

```bash
# Create app directory
mkdir -p /var/www/grabeat
cd /var/www/grabeat

# Clone repository
git clone https://github.com/your-username/grabeat.git .

# Set up backend
cd back-end
npm install
npx prisma generate
```

### Step 3: Deploy PostgreSQL & Redis with Docker

```bash
# Create docker-compose.yml
cd /var/www/grabeat/back-end

# Use your existing docker-compose.yml
docker-compose up -d

# Verify running
docker ps
```

### Step 4: Configure Environment

```bash
# Create production env file
nano .env.production

# Add all production variables
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/mydatabase
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_production_secret
CLIENT_URL=https://yourdomain.com
```

### Step 5: Run Database Migrations

```bash
npx prisma migrate deploy
```

### Step 6: Start Backend with PM2

```bash
# Start server
pm2 start src/server.js --name grabeat-backend --env production

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Step 7: Configure Nginx Reverse Proxy

```bash
# Create Nginx config
nano /etc/nginx/sites-available/grabeat
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

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

```bash
# Enable site
ln -s /etc/nginx/sites-available/grabeat /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 8: Install SSL Certificate (HTTPS)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d api.yourdomain.com

# Auto-renewal is configured automatically
```

### Step 9: Configure Firewall

```bash
# Allow SSH, HTTP, HTTPS
ufw allow ssh
ufw allow http
ufw allow https
ufw enable
```

---

## Option 3: Deploy with Docker (Self-Hosted)

Create a complete Docker setup for all services.

### Step 1: Create Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: "3.8"

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15
    container_name: grabeat-postgres
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - grabeat-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: grabeat-redis
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - grabeat-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./back-end
      dockerfile: Dockerfile
    container_name: grabeat-backend
    restart: always
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      HOST: 0.0.0.0
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      CLIENT_URL: ${CLIENT_URL}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - grabeat-network

volumes:
  postgres_data:
  redis_data:

networks:
  grabeat-network:
    driver: bridge
```

### Step 2: Create Backend Dockerfile

Create `back-end/Dockerfile`:

```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
```

### Step 3: Create .env.production

```bash
# Database
DB_USER=grabeat_user
DB_PASSWORD=secure_password_here
DB_NAME=grabeat_production

# Redis
REDIS_PASSWORD=secure_redis_password

# JWT
JWT_SECRET=your_super_secure_jwt_secret_min_32_chars

# Client
CLIENT_URL=https://yourdomain.com
```

### Step 4: Deploy

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Run database migrations
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check status
docker-compose -f docker-compose.prod.yml ps
```

---

## Environment Configuration

### Production Environment Variables Checklist

#### Backend (.env.production)

```bash
# Server
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database (use your deployed database URL)
DATABASE_URL=postgresql://user:password@host:5432/database

# Redis (use your deployed Redis credentials)
REDIS_HOST=your-redis-host.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0

# JWT (CRITICAL: Generate new secret for production!)
JWT_SECRET=generate_new_secret_with_openssl_rand_base64_32
JWT_EXPIRES_IN=7d

# CORS (your deployed frontend URL)
CLIENT_URL=https://your-app.netlify.app

# Optional: For email, storage, etc.
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your@email.com
# EMAIL_PASS=your_app_password
```

#### Frontend (app/config/api.config.ts)

```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__ ? "http://localhost:3000" : "https://grabeat-backend.up.railway.app",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};
```

---

## Post-Deployment Checklist

### ✅ Verification Steps

1. **Database Connection**

   ```bash
   # Test from backend
   curl https://your-backend-url/health
   ```

2. **Redis Connection**

   ```bash
   # Check Redis logs
   # Railway: View logs in dashboard
   # Docker: docker logs grabeat-redis
   ```

3. **API Endpoints**

   ```bash
   # Test registration
   curl -X POST https://your-backend-url/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"fullName":"Test User","email":"test@test.com","password":"Test1234","confirmPassword":"Test1234","phoneNumber":"+1234567890"}'

   # Test login
   curl -X POST https://your-backend-url/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"Test1234"}'
   ```

4. **Mobile App Connection**
   - Update API URL in app
   - Test login/register
   - Test protected routes
   - Test logout

5. **CORS Configuration**
   - Verify frontend can reach backend
   - Check browser console for CORS errors

### 🔒 Security Checklist

- [ ] Changed all default passwords
- [ ] Generated new JWT_SECRET for production
- [ ] Enabled HTTPS/SSL
- [ ] Configured CORS properly
- [ ] Set secure environment variables
- [ ] Database backups enabled
- [ ] Rate limiting configured
- [ ] Firewall rules set up
- [ ] Monitoring set up
- [ ] Error logging configured

---

## Monitoring & Maintenance

### Monitoring Tools

1. **Uptime Monitoring**
   - [UptimeRobot](https://uptimerobot.com) (Free)
   - [Pingdom](https://pingdom.com)
   - Monitor: `https://your-backend-url/health`

2. **Error Tracking**
   - [Sentry](https://sentry.io) (Free tier)
   - Install in backend:
     ```bash
     npm install @sentry/node
     ```

3. **Logging**
   - Railway/Render: Built-in logs
   - VPS: Use PM2 logs or Docker logs
   - Consider: [LogTail](https://logtail.com)

### Regular Maintenance

**Weekly:**

- Check error logs
- Monitor uptime
- Review API response times

**Monthly:**

- Update dependencies
- Review database size
- Check Redis memory usage
- Review security logs

**Quarterly:**

- Database backups verification
- Security audit
- Performance optimization
- Dependency updates

---

## Troubleshooting

### Common Deployment Issues

#### 1. Database Connection Failed

**Error**: `Can't reach database server`

**Solutions:**

```bash
# Check DATABASE_URL format
postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Test connection
npx prisma db pull

# Check if database is accessible
telnet your-db-host 5432
```

#### 2. Redis Connection Error

**Error**: `ECONNREFUSED redis:6379`

**Solutions:**

- Check Redis host/port in env variables
- Verify Redis password
- Check if Redis service is running
- For Upstash: Ensure TLS is enabled

#### 3. CORS Error in Frontend

**Error**: `Access to fetch blocked by CORS policy`

**Solutions:**

```javascript
// Update backend CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:8081", // Development
      "https://your-app.netlify.app", // Production
      "https://your-custom-domain.com",
    ],
    credentials: true,
  })
);
```

#### 4. JWT Token Invalid After Deployment

**Error**: `Invalid token signature`

**Cause**: Different JWT_SECRET in production

**Solution:**

- Use same JWT_SECRET across all environments
- Or: Logout and login again with new secret

#### 5. Build Fails on Railway/Render

**Error**: `npm ERR! code ELIFECYCLE`

**Solutions:**

```bash
# Check build command
npm install && npx prisma generate && npx prisma migrate deploy

# Ensure package.json has correct scripts
"scripts": {
  "start": "node src/server.js",
  "build": "npx prisma generate"
}
```

#### 6. Mobile App Can't Connect to Backend

**Solutions:**

- Check API_URL is correct (https://)
- Test backend URL in browser
- Check if backend is running
- Verify CORS allows your app domain
- Check network permissions in app.json

---

## Cost Estimation

### Free Tier Setup (Recommended for MVP)

| Service          | Provider | Cost         | Limits                          |
| ---------------- | -------- | ------------ | ------------------------------- |
| **Database**     | Supabase | $0           | 500MB, 2GB transfer             |
| **Redis**        | Upstash  | $0           | 10k commands/day                |
| **Backend**      | Render   | $0           | Spins down after 15min inactive |
| **Frontend Web** | Netlify  | $0           | 100GB bandwidth                 |
| **Mobile Build** | Expo EAS | $0           | Limited builds/month            |
| **Total**        |          | **$0/month** | Good for testing                |

### Paid Tier (Production Ready)

| Service          | Provider      | Cost           | Features               |
| ---------------- | ------------- | -------------- | ---------------------- |
| **Database**     | Railway       | $5             | Always-on, backups     |
| **Redis**        | Upstash       | $10            | 1M commands/month      |
| **Backend**      | Railway       | $5             | Always-on, auto-deploy |
| **Frontend Web** | Netlify       | $0             | 100GB bandwidth        |
| **Domain**       | Namecheap     | $12/year       | Custom domain          |
| **SSL**          | Let's Encrypt | $0             | Free SSL               |
| **Total**        |               | **~$20/month** | Production ready       |

### VPS Setup (Most Cost-Effective)

| Service    | Provider      | Cost          | Resources         |
| ---------- | ------------- | ------------- | ----------------- |
| **VPS**    | DigitalOcean  | $6            | 1GB RAM, 25GB SSD |
| **Domain** | Namecheap     | $12/year      | .com domain       |
| **SSL**    | Let's Encrypt | $0            | Free SSL          |
| **Total**  |               | **~$7/month** | Full control      |

---

## Next Steps

1. **Choose deployment option** based on your needs
2. **Deploy database first** (PostgreSQL & Redis)
3. **Deploy backend** and test endpoints
4. **Deploy frontend** and connect to backend
5. **Test end-to-end** functionality
6. **Set up monitoring** and backups
7. **Configure custom domain** (optional)
8. **Submit to app stores** (for mobile)

---

## Recommended Deployment Strategy

### For Learning/Testing:

**Free Tier Cloud** (Railway/Render + Supabase + Upstash)

- ✅ Easy setup
- ✅ No server management
- ✅ Free to start

### For Production MVP:

**Paid Cloud** (Railway + Supabase + Upstash)

- ✅ Always-on
- ✅ Auto-scaling
- ✅ Professional

### For Cost Optimization:

**VPS with Docker** (DigitalOcean + Docker Compose)

- ✅ Most cost-effective
- ✅ Full control
- ⚠️ Requires DevOps knowledge

---

## Support Resources

- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Expo EAS**: https://docs.expo.dev/eas/
- **Supabase Docs**: https://supabase.com/docs
- **Upstash Docs**: https://docs.upstash.com

---

_Last Updated: October 20, 2025_
