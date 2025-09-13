# QHop - End Waiting Lines, Everywhere

[![Live Demo](https://img.shields.io/badge/Live%20Demo-QHop-blue?style=for-the-badge&logo=ionic)](https://designjungle.github.io/qhop)
[![GitHub release](https://img.shields.io/github/v/release/DesignJungle/qhop?style=for-the-badge)](https://github.com/DesignJungle/qhop/releases)
[![GitHub stars](https://img.shields.io/github/stars/DesignJungle/qhop?style=for-the-badge)](https://github.com/DesignJungle/qhop/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Ionic](https://img.shields.io/badge/Ionic-3880FF?style=for-the-badge&logo=ionic&logoColor=white)](https://ionicframework.com/)

A cross-platform SaaS (mobile-first) that replaces physical queues with smart, virtual lines for clinics, barbers, salons, service centers, banks, eateries, and government offices.

## 🚀 Features

### For Customers
- **Smart Queue Joining**: Join queues remotely with real-time position updates
- **Business Discovery**: Find and browse nearby businesses by category
- **Live Notifications**: Get notified when it's your turn
- **Service Selection**: Choose specific services and party size
- **Progress Tracking**: Visual progress indicators and ETA calculations

### For Businesses
- **Queue Management**: Control capacity and reduce no-shows
- **Customer Analytics**: Insights into customer behavior and wait times
- **Service Configuration**: Manage multiple services and pricing
- **Real-time Dashboard**: Monitor queue status and customer flow

## 🛠️ Tech Stack

- **Frontend**: Ionic React + TypeScript
- **Mobile**: Capacitor (iOS/Android)
- **State Management**: React Context + Reducers
- **Styling**: CSS Custom Properties + Ionic Components
- **Build Tool**: Vite
- **Testing**: Cypress (E2E) + Vitest (Unit)

## 📱 Platform Support

- ✅ **Android** (Capacitor)
- 🔄 **iOS** (Capacitor - Coming Soon)
- ✅ **Web** (PWA)

## 🎨 Design System

QHop implements a comprehensive design system with:
- **Brand Colors**: Primary Blue (#0B72E7), Accent Green (#22C55E)
- **Typography**: Inter + Sora font families
- **Components**: QHopCard, QHopButton, QHopBadge, QHopProgress
- **Spacing**: 4pt grid system
- **Dark Mode**: Automatic system preference support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/qhop.git
cd qhop

# Install dependencies
npm install

# Start development server
npm run dev
```

### Mobile Development

```bash
# Build the app
npm run build

# Add platforms
npx cap add android
npx cap add ios

# Sync and run
npx cap sync
npx cap run android
npx cap run ios
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

## 🔄 Development Status

- ✅ **Design System**: Complete
- ✅ **Customer App**: 95% Complete
- 🔄 **Business App**: In Progress
- 🔄 **Backend API**: Planned
- 🔄 **Authentication**: Planned
- 🔄 **Payment Integration**: Planned

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
