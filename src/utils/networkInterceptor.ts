import { reportCriticalFailure } from '../hooks/useAppRecovery';

let failureCount429 = 0;
const MAX_429_BEFORE_FATAL = 5;

/**
 * Initializes global network interceptors to detect critical system failures
 */
export function initNetworkInterceptor() {
  if (typeof window === 'undefined' || (window as any).__NETWORK_INTERCEPTOR_INIT__) return;
  (window as any).__NETWORK_INTERCEPTOR_INIT__ = true;

  const originalFetch = window.fetch;

  try {
    // Attempt to safely patch fetch using property descriptor to avoid "getter only" errors
    const patchedFetch = async (...args: any[]) => {
      try {
        const response = await (originalFetch as any)(...args);
        
        // Monitor for Quota Exceeded (429) or Service Unavailable (503)
        if (response.status === 429) {
          failureCount429++;
          console.warn(`[NetworkMonitor] detected 429 Quota Exceeded (${failureCount429}/${MAX_429_BEFORE_FATAL})`);
          
          if (failureCount429 >= MAX_429_BEFORE_FATAL) {
            reportCriticalFailure({
              type: 'quota',
              message: 'تم تجاوز حصة الاستخدام المسموح بها (API Quota Exceeded). يرجى تحديث التطبيق لاحقاً.'
            });
          }
        }
        
        // Reset counter on successful requests
        if (response.ok) {
          if (failureCount429 > 0) failureCount429 = Math.max(0, failureCount429 - 1);
        }

        return response;
      } catch (error: any) {
        const errorMsg = error?.message || '';
        if (
          errorMsg.includes('Failed to fetch') || 
          errorMsg.includes('NetworkError') ||
          errorMsg.includes('ERR_CONNECTION_TIMED_OUT')
        ) {
          console.error('[NetworkMonitor] Fatal network error detected:', errorMsg);
        }
        throw error;
      }
    };

    // Use defineProperty which is more robust than direct assignment
    Object.defineProperty(window, 'fetch', {
      value: patchedFetch,
      configurable: true,
      writable: true
    });
  } catch (patchError) {
    console.warn('[NetworkMonitor] Global fetch patching blocked by environment. Monitoring limited to reported errors.', patchError);
  }

  // Intercept WebSocket failures if possible (partially via global error)
  window.addEventListener('error', (event) => {
    const target = event.target as any;
    if (target && (target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {
      console.warn('[NetworkMonitor] Resource failed to load:', target.src || target.href);
    }
  }, true);
}
