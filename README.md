# 🍔 Grabeat

<div align="center">

![Grabeat Logo](https://img.shields.io/badge/Grabeat-Food%20Delivery-FF6B6B?style=for-the-badge&logo=uber-eats&logoColor=white)

**A modern, full-stack food delivery application built with React Native and Node.js**

[![React Native](https://img.shields.io/badge/React%20Native-0.76-61DAFB?style=flat&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-52.0-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat&logo=redis&logoColor=white)](https://redis.io/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

[Features](#-features) • [Screenshots](#-screenshots) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 About

Grabeat is a comprehensive food delivery platform that connects hungry customers with their favorite restaurants. Built with modern technologies and best practices, it offers a seamless experience for browsing menus, placing orders, and tracking deliveries in real-time.

### ✨ Key Highlights

- 🎨 **Modern UI/UX** - Fully responsive design that works on phones, tablets, and desktops
- 🔐 **Secure Authentication** - JWT-based auth with Redis token whitelist for instant logout
- 📱 **Cross-Platform** - Single codebase for iOS, Android, and Web
- 🚀 **High Performance** - Optimized with caching, lazy loading, and efficient state management
- 🎭 **Beautiful Animations** - Smooth transitions and modern toast notifications
- 🏗️ **Scalable Architecture** - Clean, maintainable code following industry best practices

---

## 🎯 Features

### For Customers

- ✅ **User Authentication** - Secure sign up, login, and logout with modern notifications
- 🍕 **Browse Restaurants** - Explore restaurants with beautiful card layouts
- 🔍 **Smart Search** - Search dishes by name, cuisine, or category with real-time filtering
- 🛒 **Shopping Cart** - Add, remove, and manage items before checkout
- 📦 **Order Tracking** - View order history and track current orders
- 👤 **Profile Management** - Update personal information and preferences
- 🎨 **Dark Mode Ready** - Eye-friendly interface with modern color schemes

### For Developers

- 🔒 **Redis Token Whitelist** - Instant token invalidation for enhanced security
- 📊 **RESTful API** - Well-documented endpoints with Zod validation
- 🗄️ **Prisma ORM** - Type-safe database queries with migrations
- 🎯 **Centralized Theme System** - Consistent design tokens across the app
- 📱 **Responsive Utilities** - Automatic scaling for all screen sizes
- 🧪 **Testing Ready** - Configured for unit and integration tests
- 🐳 **Docker Support** - Ready for containerized deployment

---

## 🖼️ Screenshots

<div align="center">

### Mobile Views

| Login/Signup                         | Home Screen                        | Search & Filters                       |
| ------------------------------------ | ---------------------------------- | -------------------------------------- |
| ![Login](docs/screenshots/login.png) | ![Home](docs/screenshots/home.png) | ![Search](docs/screenshots/search.png) |

| Profile                                  | Orders                                 | Notifications                                       |
| ---------------------------------------- | -------------------------------------- | --------------------------------------------------- |
| ![Profile](docs/screenshots/profile.png) | ![Orders](docs/screenshots/orders.png) | ![Notifications](docs/screenshots/notification.png) |

### Responsive Design

| Phone     | Tablet  | Desktop |
| --------- | ------- | ------- |
| 📱 iPhone | 📱 iPad | 🖥️ Web  |

</div>

---

## 🛠️ Tech Stack

### Frontend

```
React Native 0.76.9  •  Expo 52.0.47  •  TypeScript
React Navigation 7.x  •  Async Storage  •  Axios
Custom Responsive System  •  Animated API
```

**Key Libraries:**

- **UI/UX**: Expo Checkbox, Vector Icons, Blur Effects
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **State**: React Context API + Hooks
- **Storage**: AsyncStorage for local persistence
- **HTTP**: Axios for API communication
- **Animations**: React Native Animated API

### Backend

```
Node.js 18+  •  Express 5.1  •  PostgreSQL 15  •  Redis 7
Prisma ORM 6.17  •  JWT  •  Bcrypt  •  Zod
```

**Key Features:**

- **Security**: Helmet, CORS, JWT with Redis whitelist
- **Validation**: Zod schemas for request validation
- **ORM**: Prisma for type-safe database queries
- **Caching**: Redis for sessions and token management
- **Middleware**: Custom error handling, rate limiting, async wrapper

### Development Tools

```
ESLint  •  Git  •  Docker  •  Postman  •  VS Code
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm/yarn
- **PostgreSQL** 15+ (or Docker)
- **Redis** 7+ (or Docker)
- **Expo CLI** (for mobile development)
- **Git** for version control

### 📦 Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/SORAAAAAAAAA/Grabeat.git
cd Grabeat/app
```

#### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd back-end

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your .env file
# Edit .env with your database credentials and JWT secret
```

**Required Environment Variables:**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/grabeat"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:8081
```

**Setup Database:**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed the database
npm run seed
```

**Start Backend Server:**

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Backend will run at `http://localhost:3000` 🎉

#### 3️⃣ Frontend Setup

```bash
# Navigate to frontend directory (from app folder)
cd front-end

# Install dependencies
npm install

# Start Expo development server
npm start
```

**Run on Different Platforms:**

```bash
# iOS (requires macOS + Xcode)
npm run ios

# Android (requires Android Studio + Emulator)
npm run android

# Web browser
npm run web
```

Frontend will open Expo DevTools in your browser 🎉

---

## 🐳 Docker Setup (Alternative)

Quick start with Docker Compose:

```bash
# From the back-end directory
cd back-end

# Start all services (PostgreSQL, Redis, Backend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Services:**

- Backend API: `http://localhost:3000`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

---

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

### Backend Documentation

- 📖 [**Backend Architecture**](back-end/docs/architecture.md) - System design, patterns, and structure
- 🚀 [**Deployment Guide**](back-end/docs/DEPLOYMENT_GUIDE.md) - Cloud, VPS, and Docker deployment
- 🔐 [**Authentication Flow**](back-end/docs/authentication.md) - JWT + Redis token management

### Frontend Documentation

- 📱 [**Responsive Design System**](front-end/RESPONSIVE_DESIGN.md) - Complete responsive guide
- 🎨 [**Theme System**](front-end/RESPONSIVE_SUMMARY.md) - Design tokens and utilities
- 🔔 [**Notification System**](front-end/NOTIFICATION_SYSTEM.md) - Modern toast notifications
- 🧹 [**Cleanup Summary**](front-end/CLEANUP_SUMMARY.md) - Code maintenance guide

### API Documentation

```bash
# Backend endpoints are documented in:
back-end/docs/api/
├── auth.md          # Authentication endpoints
├── users.md         # User management
├── products.md      # Product catalog
└── orders.md        # Order management
```

---

## 🏗️ Project Structure

```
Grabeat/app/
├── back-end/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── migrations/         # Database migrations
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth/           # Authentication module
│   │   │   ├── users/          # User management
│   │   │   ├── products/       # Product catalog
│   │   │   └── orders/         # Order processing
│   │   ├── config/
│   │   │   ├── database.js     # Prisma configuration
│   │   │   ├── redis.js        # Redis client
│   │   │   └── constants.js    # App constants
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js      # JWT + Redis verification
│   │   │   ├── errorHandler.middleware.js
│   │   │   ├── rateLimiter.middleware.js
│   │   │   └── validation.middleware.js
│   │   ├── services/
│   │   │   ├── email.services.js
│   │   │   ├── payment.services.js
│   │   │   └── storage.services.js
│   │   ├── utils/
│   │   │   ├── jwt.util.js
│   │   │   ├── password.util.js
│   │   │   ├── logger.util.js
│   │   │   └── response.util.js
│   │   ├── app.js              # Express app setup
│   │   └── server.js           # Server entry point
│   ├── tests/                  # Test suites
│   ├── docs/                   # Backend documentation
│   ├── docker-compose.yml      # Docker services
│   └── package.json
│
└── front-end/
    ├── app/
    │   ├── components/
    │   │   ├── MainPage.tsx    # Home screen
    │   │   ├── Search.tsx      # Search & filters
    │   │   ├── Profile.tsx     # User profile
    │   │   ├── Orders.tsx      # Order history
    │   │   └── Cart.tsx        # Shopping cart
    │   ├── context/
    │   │   └── AuthContext.tsx # Authentication state
    │   ├── utils/
    │   │   ├── responsive.ts   # Responsive utilities
    │   │   └── theme.ts        # Design tokens
    │   ├── index.tsx           # Navigation setup
    │   └── LogSign.tsx         # Auth screens
    ├── assets/                 # Images, fonts, icons
    ├── android/                # Android native code
    ├── ios/                    # iOS native code (if applicable)
    ├── docs/                   # Frontend documentation
    └── package.json
```

---

## 🔐 Security Features

- ✅ **JWT Authentication** with secure token generation
- ✅ **Redis Token Whitelist** for instant token invalidation
- ✅ **Password Hashing** with bcrypt (10 rounds)
- ✅ **Request Validation** using Zod schemas
- ✅ **Rate Limiting** to prevent abuse
- ✅ **CORS Protection** with configurable origins
- ✅ **Helmet Security Headers** for Express
- ✅ **Async Error Handling** to prevent crashes
- ✅ **Environment Variables** for sensitive data

---

## 🎨 Responsive Design

The app uses a custom responsive system that automatically scales across devices:

### Breakpoints

- 📱 **Small**: 375px (iPhone SE)
- 📱 **Medium**: 414px (iPhone 13)
- 📱 **Tablet**: 768px (iPad)
- 💻 **Large Tablet**: 1024px (iPad Pro)
- 🖥️ **Desktop**: 1366px+

### Features

- Automatic spacing, typography, and layout scaling
- Device detection utilities
- Responsive grid system (2-4 columns)
- Centralized theme tokens
- Platform-specific adjustments

**Example:**

```typescript
import { spacing, typography, colors } from './utils/theme';
import { isTablet, responsiveFontSize } from './utils/responsive';

// Automatic responsive sizing
<Text style={{
  fontSize: typography.fontSize.xl,  // Auto-scales
  padding: spacing.lg,               // Auto-scales
  color: colors.primary
}}>
```

---

## 📊 API Endpoints

### Authentication

```
POST   /api/auth/register       # Register new user
POST   /api/auth/login          # Login user
POST   /api/auth/logout         # Logout current device
POST   /api/auth/logout-all     # Logout all devices
GET    /api/auth/me             # Get current user
```

### Users

```
GET    /api/users/:id           # Get user by ID
PATCH  /api/users/:id           # Update user
DELETE /api/users/:id           # Delete user
```

### Products

```
GET    /api/products            # List all products
GET    /api/products/:id        # Get product details
POST   /api/products            # Create product (admin)
PATCH  /api/products/:id        # Update product (admin)
DELETE /api/products/:id        # Delete product (admin)
```

### Orders

```
GET    /api/orders              # List user orders
GET    /api/orders/:id          # Get order details
POST   /api/orders              # Create new order
PATCH  /api/orders/:id          # Update order status
```

---

## 🧪 Testing

### Backend Tests

```bash
cd back-end
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### Frontend Tests

```bash
cd front-end
npm test                # Run all tests
npm run test:watch      # Watch mode
```

---

## 🚢 Deployment

### Quick Deploy Options

#### Option 1: Cloud Platform (Recommended)

- **Backend**: Railway, Render, or Heroku
- **Database**: Supabase, Railway, or ElephantSQL
- **Redis**: Upstash or Redis Cloud
- **Frontend**: Expo EAS Build + Netlify/Vercel for web

#### Option 2: VPS (DigitalOcean, AWS, etc.)

```bash
# Follow the comprehensive deployment guide
cat back-end/docs/DEPLOYMENT_GUIDE.md
```

#### Option 3: Docker

```bash
cd back-end
docker-compose -f docker-compose.prod.yml up -d
```

**See [Deployment Guide](back-end/docs/DEPLOYMENT_GUIDE.md) for detailed instructions.**

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### How to Contribute

1. **Fork the repository**

   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**

   ```bash
   git clone https://github.com/your-username/Grabeat.git
   cd Grabeat/app
   ```

3. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make your changes**

   - Write clean, readable code
   - Follow existing code style
   - Add tests if applicable
   - Update documentation

5. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: Add amazing feature"
   ```

6. **Push to your fork**

   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Describe your changes

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Add new feature
fix: Fix a bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

---

## 🐛 Bug Reports & Feature Requests

### Found a Bug?

1. Check [existing issues](https://github.com/SORAAAAAAAAA/Grabeat/issues)
2. If new, [create an issue](https://github.com/SORAAAAAAAAA/Grabeat/issues/new) with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details

### Want a Feature?

1. [Open a feature request](https://github.com/SORAAAAAAAAA/Grabeat/issues/new)
2. Describe the feature and use case
3. We'll discuss and prioritize

---

## 📝 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Cielo**

- GitHub: [@SORAAAAAAAAA](https://github.com/SORAAAAAAAAA)
- Project: [Grabeat](https://github.com/SORAAAAAAAAA/Grabeat)

---

## 🙏 Acknowledgments

- React Native & Expo teams for the amazing framework
- Prisma for the excellent ORM
- All open-source contributors whose libraries made this possible

---

## 📞 Support

Need help? Here's how to get support:

- 📖 Read the [documentation](back-end/docs/)
- 🐛 Report bugs via [GitHub Issues](https://github.com/SORAAAAAAAAA/Grabeat/issues)
- 💬 Discussions on [GitHub Discussions](https://github.com/SORAAAAAAAAA/Grabeat/discussions)
- 📧 Email: [your-email@example.com]

---

## 🗺️ Roadmap

### Version 1.1

- [ ] Real-time order tracking with WebSocket
- [ ] Push notifications
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Restaurant dashboard
- [ ] Delivery driver app

### Version 1.2

- [ ] Reviews and ratings system
- [ ] Favorites and wishlists
- [ ] Promotional codes and discounts
- [ ] Multi-language support
- [ ] Advanced analytics

### Version 2.0

- [ ] AI-powered recommendations
- [ ] Voice ordering
- [ ] AR menu preview
- [ ] Social features

---

## ⚡ Performance

- 📱 **Fast Load Times**: Optimized bundle size with lazy loading
- 🚀 **Smooth Animations**: 60 FPS animations using native driver
- 💾 **Efficient Caching**: Redis for backend, AsyncStorage for frontend
- 🎯 **Optimized Images**: Compressed assets with proper formats
- 📊 **Database Indexing**: Optimized queries with Prisma

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with ❤️ and lots of ☕**

[Back to Top](#-grabeat)

---

**Happy Coding! 🚀**

</div>
