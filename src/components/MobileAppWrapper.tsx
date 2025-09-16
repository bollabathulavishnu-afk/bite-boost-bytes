import React, { useEffect } from 'react';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';
import { OfflineIndicator } from './OfflineIndicator';
import { Capacitor } from '@capacitor/core';

interface MobileAppWrapperProps {
  children: React.ReactNode;
}

export const MobileAppWrapper: React.FC<MobileAppWrapperProps> = ({ children }) => {
  const { networkStatus, isNative } = useMobileFeatures();

  useEffect(() => {
    // Add mobile-specific styling
    if (isNative) {
      document.body.classList.add('mobile-app');
      
      // Prevent zoom on mobile
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        );
      }

      // Add iOS status bar padding if needed
      if (Capacitor.getPlatform() === 'ios') {
        document.body.classList.add('ios-app');
      }

      // Add Android-specific styles
      if (Capacitor.getPlatform() === 'android') {
        document.body.classList.add('android-app');
      }
    }

    return () => {
      document.body.classList.remove('mobile-app', 'ios-app', 'android-app');
    };
  }, [isNative]);

  return (
    <div className="mobile-app-container">
      <OfflineIndicator 
        isOnline={networkStatus.connected} 
        connectionType={networkStatus.connectionType}
      />
      {children}
    </div>
  );
};