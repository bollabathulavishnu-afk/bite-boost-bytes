import { useEffect, useState } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';
import { Network } from '@capacitor/network';
import { PushNotifications } from '@capacitor/push-notifications';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

interface NetworkStatus {
  connected: boolean;
  connectionType: string;
}

export const useMobileFeatures = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    connected: true,
    connectionType: 'wifi'
  });
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const initializeMobileFeatures = async () => {
      // Check if running on native platform
      setIsNative(Capacitor.isNativePlatform());

      if (Capacitor.isNativePlatform()) {
        // Initialize splash screen
        await SplashScreen.show({
          showDuration: 2000,
          autoHide: true,
        });

        // Initialize network monitoring
        const status = await Network.getStatus();
        setNetworkStatus({
          connected: status.connected,
          connectionType: status.connectionType
        });

        // Listen for network changes
        Network.addListener('networkStatusChange', (status) => {
          setNetworkStatus({
            connected: status.connected,
            connectionType: status.connectionType
          });
        });

        // Handle app state changes
        App.addListener('appStateChange', ({ isActive }) => {
          if (isActive && !networkStatus.connected) {
            // App became active, check network status
            Network.getStatus().then(status => {
              setNetworkStatus({
                connected: status.connected,
                connectionType: status.connectionType
              });
            });
          }
        });

        // Initialize push notifications
        try {
          await PushNotifications.requestPermissions();
          await PushNotifications.register();

          PushNotifications.addListener('registration', (token) => {
            console.log('Push registration success, token: ' + token.value);
          });

          PushNotifications.addListener('registrationError', (error) => {
            console.error('Registration error: ', error.error);
          });

          PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('Push received: ', notification);
          });

          PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
            console.log('Push action performed: ', notification);
          });
        } catch (error) {
          console.log('Push notification setup failed:', error);
        }

        // Handle hardware back button
        App.addListener('backButton', ({ canGoBack }) => {
          if (canGoBack) {
            window.history.back();
          } else {
            App.exitApp();
          }
        });

        // Hide splash screen after initialization
        setTimeout(async () => {
          await SplashScreen.hide();
        }, 2000);
      }
    };

    initializeMobileFeatures();

    return () => {
      // Cleanup listeners
      Network.removeAllListeners();
      App.removeAllListeners();
      PushNotifications.removeAllListeners();
    };
  }, []);

  return {
    networkStatus,
    isNative
  };
};