# QHop Android Development Setup

## 🚀 Running QHop on Android Emulator

Your QHop app is now ready to run on Android! Follow these steps to preview it on an Android emulator.

### Prerequisites

1. **Android Studio** - Download and install from [developer.android.com/studio](https://developer.android.com/studio)
2. **Android SDK** - Installed automatically with Android Studio
3. **Android Virtual Device (AVD)** - Create one in Android Studio

### Step 1: Setup Android Studio

1. Open Android Studio
2. Go to **Tools > AVD Manager**
3. Click **Create Virtual Device**
4. Choose a device (recommended: **Pixel 4** or newer)
5. Select a system image (recommended: **API 30** or higher)
6. Click **Finish** to create the AVD

### Step 2: Start the Android Emulator

1. In AVD Manager, click the **Play** button next to your virtual device
2. Wait for the emulator to boot up completely
3. Make sure the emulator is running and unlocked

### Step 3: Run QHop on Android

Open your terminal in the QHop project directory and run:

```bash
# Option 1: Open in Android Studio (recommended for development)
npx cap open android

# Option 2: Run directly on emulator
npx cap run android
```

### Step 4: Development Workflow

For ongoing development, use this workflow:

1. **Make changes** to your React/TypeScript code
2. **Build the app**:
   ```bash
   npm run build
   ```
3. **Sync changes** to Android:
   ```bash
   npx cap sync android
   ```
4. **Run on emulator**:
   ```bash
   npx cap run android
   ```

### Live Reload (Optional)

For faster development, you can use live reload:

1. Start your development server:
   ```bash
   npm run dev
   ```
2. Update `capacitor.config.ts` to point to your dev server:
   ```typescript
   const config: CapacitorConfig = {
     appId: 'com.qhop.app',
     appName: 'QHop',
     webDir: 'dist',
     server: {
       url: 'http://localhost:5173',
       cleartext: true
     }
   };
   ```
3. Sync and run:
   ```bash
   npx cap sync android
   npx cap run android
   ```

### Troubleshooting

#### Emulator Issues
- **Emulator won't start**: Check if virtualization is enabled in BIOS
- **App crashes**: Check Android Studio Logcat for error messages
- **Slow performance**: Allocate more RAM to the emulator in AVD settings

#### Build Issues
- **Build fails**: Make sure all TypeScript errors are fixed
- **Sync fails**: Delete `android/` folder and run `npx cap add android` again

#### Network Issues
- **API calls fail**: Use `10.0.2.2` instead of `localhost` for emulator networking
- **CORS issues**: Configure your backend to allow emulator origins

### Android-Specific Features

QHop includes these Android-optimized features:

1. **Native Navigation**: Hardware back button support
2. **Status Bar**: Automatic theming based on your design system
3. **Haptic Feedback**: Native vibration for user interactions
4. **Keyboard Management**: Automatic keyboard handling
5. **App Icon**: Configured with QHop branding

### Performance Tips

1. **Enable Hardware Acceleration** in AVD settings
2. **Use x86_64 system images** for better performance
3. **Allocate sufficient RAM** (4GB+ recommended)
4. **Close unnecessary apps** on your development machine

### Next Steps

Once you have the Android emulator working:

1. Test all QHop features (queue joining, notifications, etc.)
2. Test on different screen sizes and orientations
3. Test offline functionality
4. Prepare for real device testing
5. Consider setting up automated testing with Appium

### Real Device Testing

To test on a real Android device:

1. Enable **Developer Options** on your device
2. Enable **USB Debugging**
3. Connect device via USB
4. Run: `npx cap run android --target=<device-id>`

---

## 📱 QHop Features to Test

When running on Android, make sure to test:

- ✅ **Navigation**: Bottom tabs and page transitions
- ✅ **Queue Joining**: Modal flows and form interactions
- ✅ **Real-time Updates**: Position changes and notifications
- ✅ **Responsive Design**: Different screen sizes
- ✅ **Touch Interactions**: Buttons, cards, and gestures
- ✅ **Dark Mode**: Automatic theme switching
- ✅ **Performance**: Smooth animations and transitions

Enjoy developing QHop on Android! 🎉
