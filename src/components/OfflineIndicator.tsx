import React from 'react';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OfflineIndicatorProps {
  isOnline: boolean;
  connectionType?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ 
  isOnline, 
  connectionType 
}) => {
  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <Alert className="border-destructive bg-destructive/10">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span>You're offline. Please check your internet connection.</span>
        </AlertDescription>
      </Alert>
    </div>
  );
};