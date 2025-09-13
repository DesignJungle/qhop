# QHop - End Waiting Lines, Everywhere

[![Live Demo](https://img.shields.io/badge/Live%20Demo-QHop-blue?style=for-the-badge&logo=ionic)](https://designjungle.github.io/qhop)
[![GitHub release](https://img.shields.io/github/v/release/DesignJungle/qhop?style=for-the-badge)](https://github.com/DesignJungle/qhop/releases)
[![GitHub stars](https://img.shields.io/github/stars/DesignJungle/qhop?style=for-the-badge)](https://github.com/DesignJungle/qhop/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Ionic](https://img.shields.io/badge/Ionic-3880FF?style=for-the-badge&logo=ionic&logoColor=white)](https://ionicframework.com/)

A cross-platform SaaS (mobile-first) that replaces physical queues with smart, virtual lines for clinics, barbers, salons, service centers, banks, eateries, and government offices.

## ✨ **Key Features**

### 👥 **For Customers**
- **📱 Phone-Based Authentication** - Quick OTP verification, no app downloads required
- **🎯 Smart Queue Joining** - Join queues instantly with QR codes or business search
- **⏱️ Real-Time Updates** - Live position tracking and wait time estimates
- **🔔 Smart Notifications** - SMS alerts when it's your turn
- **📍 Location Awareness** - Find nearby businesses with active queues
- **⭐ Review System** - Rate and review your experience

### 🏢 **For Businesses**
- **📊 Comprehensive Dashboard** - Real-time queue monitoring and analytics
- **👨‍💼 Staff Management** - Role-based access, scheduling, and performance tracking
- **📈 Advanced Analytics** - Customer insights, peak hours, revenue tracking
- **🔧 Queue Customization** - Multiple queues, service types, and capacity management
- **📱 Multi-Platform Support** - Web, mobile, and tablet interfaces
- **🎨 Brand Integration** - Custom branding and white-label solutions

### 🚀 **Advanced Capabilities**
- **⚡ Real-Time WebSocket** - Instant updates across all connected devices
- **🤖 AI-Powered Insights** - Predictive analytics and optimization suggestions
- **🔗 API Integration** - RESTful APIs for third-party integrations
- **🌐 Multi-Language Support** - Localization for global markets
- **🔒 Enterprise Security** - End-to-end encryption and compliance ready

## 🏗️ **Architecture**

### **Frontend Stack**
- **⚛️ React 18** with TypeScript for type safety
- **📱 Ionic Framework** for cross-platform mobile development
- **🎨 Custom Design System** with QHop brand identity
- **📊 Chart.js** for advanced analytics visualization
- **🔌 Socket.io Client** for real-time communication

### **Backend Stack**
- **🟢 Node.js + Express** with TypeScript
- **🐘 PostgreSQL** with Prisma ORM for type-safe database operations
- **🔴 Redis** for caching and session management
- **📡 Socket.io** for real-time WebSocket communication
- **🔐 JWT Authentication** with role-based access control
- **📱 Twilio SMS** for OTP and notifications

### **DevOps & Deployment**
- **🐳 Docker** containerization for consistent deployments
- **⚙️ GitHub Actions** for CI/CD automation
- **🌐 GitHub Pages** for frontend hosting
- **☁️ Cloud-Ready** for AWS, Azure, or Google Cloud deployment

## 📱 Platform Support

- ✅ **Android** (Capacitor)
- 🔄 **iOS** (Capacitor - Coming Soon)
- ✅ **Web** (PWA)

## 🎨 **Design System**

QHop uses a comprehensive design system built on Ionic's design tokens:

### **Color Palette**
- **Primary**: `#FF8A3D` (Vibrant Orange) - Energy, enthusiasm, action
- **Secondary**: `#4ECDC4` (Teal) - Trust, reliability, professionalism
- **Accent**: `#45B7D1` (Sky Blue) - Innovation, clarity, communication
- **Success**: `#96CEB4` (Mint Green) - Success, completion, positive outcomes
- **Warning**: `#FFEAA7` (Warm Yellow) - Attention, caution, important information
- **Danger**: `#FD79A8` (Soft Pink) - Errors, urgent actions, critical alerts

### **Typography**
- **Primary Font**: Inter (Modern, clean, highly legible)
- **Headings**: 600-700 weight for strong hierarchy
- **Body Text**: 400-500 weight for optimal readability

### **Component Library**
All components follow QHop's design principles with consistent spacing, typography, and interaction patterns.

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 6+
- Git

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/qhop.git
cd qhop
```

### **2. Install Dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### **3. Environment Setup**
```bash
# Copy environment files
cp .env.example .env.local
cp backend/.env.example backend/.env

# Configure your environment variables
# - Database connection strings
# - Redis configuration
# - Twilio credentials
# - JWT secrets
```

### **4. Database Setup**
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
cd ..
```

### **5. Start Development Servers**
```bash
# Terminal 1: Start backend server
cd backend
npm run dev

# Terminal 2: Start frontend development server
npm run dev
```

### **6. Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/docs

## 📱 **Mobile Development**

### **iOS Development**
```bash
# Build for iOS
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

### **Android Development**
```bash
# Build for Android
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

## 📂 Project Structure

```
qhop/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React Context providers
│   ├── pages/              # Application pages
│   ├── services/           # Business logic services
│   └── theme/              # Design system variables
├── android/                # Android Capacitor project
├── ios/                    # iOS Capacitor project (coming soon)
├── public/                 # Static assets
└── dist/                   # Build output
```

## 🧪 Testing

```bash
# Run unit tests
npm run test.unit

# Run E2E tests
npm run test.e2e

# Lint code
npm run lint
```

## 📱 Android Setup

See [ANDROID_SETUP.md](./ANDROID_SETUP.md) for detailed Android development instructions.

## 🔄 **Development Status**

- ✅ **Design System**: Complete with comprehensive brand identity
- ✅ **Customer App**: Complete with phone-based OTP authentication
- ✅ **Business Dashboard**: Complete with dual-mode architecture
- ✅ **Backend API**: Complete with Node.js + TypeScript + PostgreSQL
- ✅ **Real-Time Features**: Complete with WebSocket integration
- ✅ **Advanced Analytics**: Complete with Chart.js visualizations
- ✅ **Staff Management**: Complete with role-based permissions
- ✅ **Authentication**: Complete with JWT + OTP system
- 🔄 **Payment Integration**: Planned for Phase 4
- 🔄 **AI Features**: Planned for Phase 4

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Ionic Framework](https://ionicframework.com/)
- Icons by [Ionicons](https://ionic.io/ionicons)
- Fonts by [Google Fonts](https://fonts.google.com/)

## 📞 Contact

- **Project Link**: [https://github.com/DesignJungle/qhop](https://github.com/DesignJungle/qhop)
- **Live Demo**: [https://designjungle.github.io/qhop](https://designjungle.github.io/qhop)
- **Issues**: [Report bugs or request features](https://github.com/DesignJungle/qhop/issues)

---

**QHop** - Making waiting lines a thing of the past! 🎉
