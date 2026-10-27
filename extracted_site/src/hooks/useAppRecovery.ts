import { useEffect, useState, useCallback } from 'react';

const CRITICAL_FAILURE_EVENT = 'app_critical_failure';

export interface AppFailureInfo {
  type: 'network' | 'quota' | 'script' | 'unknown';
  message: string;
  timestamp: number;
}

/**
 * Hook to manage application recovery state and trigger global error UI
 */
export function useAppRecovery() {
  const [failure, setFailure] = useState<AppFailureInfo | null>(null);

  const triggerCriticalFailure = useCallback((info: Omit<AppFailureInfo, 'timestamp'>) => {
    const fullInfo: AppFailureInfo = { ...info, timestamp: Date.now() };
    window.dispatchEvent(new CustomEvent(CRITICAL_FAILURE_EVENT, { detail: fullInfo }));
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      setFailure(e.detail);
    };
    window.addEventListener(CRITICAL_FAILURE_EVENT, handler);
    return () => window.removeEventListener(CRITICAL_FAILURE_EVENT, handler);
  }, []);

  const recover = useCallback(() => {
    // Clear potentially corrupted session state
    if (typeof window !== 'undefined') {
      console.info('[AppRecovery] Performing controlled refresh...');
      // We could clear specific localStorage keys here if needed
      // localStorage.removeItem('some_temp_key');
      window.location.reload();
    }
  }, []);

  return {
    failure,
    triggerCriticalFailure,
    recover,
  };
}

/**
 * Global utility to trigger recovery without being in a hook context
 */
export const reportCriticalFailure = (info: Omit<AppFailureInfo, 'timestamp'>) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CRITICAL_FAILURE_EVENT, { 
      detail: { ...info, timestamp: Date.now() } 
    }));
  }
};
