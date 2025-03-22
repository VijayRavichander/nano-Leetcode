// In a component that wraps your application or on your layout
"use client"
import { useTokenStore } from '@/lib/store/uiStore';
import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';

export function ClerkAuthListener() {
  const { isLoaded, isSignedIn } = useAuth();
  const { tokenStore, setTokenStore } = useTokenStore();

// Assuming you have a reset function

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // User has signed out
      setTokenStore("")
    }
  }, [isLoaded, isSignedIn]);

  return null; // This component doesn't render anything
}