#!/bin/bash

# Notes AI Mobile App Build Script
# Make sure to run: chmod +x build-mobile.sh before executing

echo "🚀 Building Notes AI Mobile App..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Initialize Capacitor (if not already done)
if [ ! -f "capacitor.config.ts" ]; then
    echo "⚡ Initializing Capacitor..."
    npx cap init "Notes AI" app.lovable.71499d5dcda447eea8dd2213114c83f2
fi

# Build the web app
echo "🔨 Building web application..."
npm run build

# Add platforms if they don't exist
if [ ! -d "ios" ]; then
    echo "🍎 Adding iOS platform..."
    npx cap add ios
fi

if [ ! -d "android" ]; then
    echo "🤖 Adding Android platform..."
    npx cap add android
fi

# Update native dependencies
echo "🔄 Updating native dependencies..."
npx cap update ios
npx cap update android

# Sync web assets to native projects
echo "🔗 Syncing to native platforms..."
npx cap sync

echo "✅ Mobile app setup complete!"
echo ""
echo "Next steps:"
echo "• To run on Android: npx cap run android"
echo "• To run on iOS: npx cap run ios (macOS only)"
echo ""
echo "📱 Your Notes AI app is ready for mobile!"