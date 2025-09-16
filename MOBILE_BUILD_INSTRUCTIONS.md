# Notes AI Mobile App - Build Instructions

## Prerequisites
- Node.js and npm installed
- For iOS: macOS with Xcode installed
- For Android: Android Studio installed

## Setup Steps

1. **Export and Clone Project**
   ```bash
   # Export your project to GitHub via Lovable's "Export to GitHub" button
   # Then clone your repository
   git clone <your-github-repo-url>
   cd <your-project-name>
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Add Mobile Platforms**
   ```bash
   # Add iOS platform (macOS only)
   npx cap add ios
   
   # Add Android platform
   npx cap add android
   ```

4. **Update Native Dependencies**
   ```bash
   # Update iOS dependencies
   npx cap update ios
   
   # Update Android dependencies  
   npx cap update android
   ```

5. **Build Web Assets**
   ```bash
   npm run build
   ```

6. **Sync to Native Platforms**
   ```bash
   npx cap sync
   ```

7. **Run on Device/Emulator**
   ```bash
   # Run on Android
   npx cap run android
   
   # Run on iOS (macOS only)
   npx cap run ios
   ```

## Features Included

✅ **WebView Integration**: Opens your Notes AI website in a native container
✅ **Splash Screen**: Shows logo while loading
✅ **Offline Detection**: Displays message when internet is unavailable  
✅ **Native Navigation**: Hardware back button support
✅ **Push Notifications**: Ready for future implementation
✅ **Cross-Platform**: Works on both iOS and Android
✅ **Safe Area Support**: Proper spacing for notched devices

## Customization

### Splash Screen
- Replace `public/splash.png` with your 1024x1024 logo
- Modify colors in `capacitor.config.ts`

### App Identity
- Update `appName` and `appId` in `capacitor.config.ts`
- Change app icons in native projects after generation

### Website URL
- Update the `server.url` in `capacitor.config.ts` to point to your live website

## Troubleshooting

- **Build Fails**: Ensure all dependencies are installed with `npm install`
- **iOS Issues**: Make sure Xcode is properly installed and updated
- **Android Issues**: Verify Android Studio and SDK are configured
- **Sync Issues**: Always run `npx cap sync` after making changes

## Production Deployment

1. **iOS**: Use Xcode to archive and submit to App Store
2. **Android**: Use Android Studio to generate signed APK/AAB for Play Store

## Support

For mobile development questions, read the Lovable mobile development blog post:
https://lovable.dev/blogs/TODO