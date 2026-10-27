import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Zap, ShieldAlert, WifiOff } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
  lastErrorTimestamp: number;
  isNetworkRelated: boolean;
}

export class ErrorBoundaryWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorCount: 0,
      lastErrorTimestamp: 0,
      isNetworkRelated: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorMsg = error.message.toLowerCase();
    
    // Ignore Vite HMR WebSocket errors
    if (errorMsg.includes('websocket') && (errorMsg.includes('vite') || errorMsg.includes('hmr') || errorMsg.includes('closed without opened'))) {
      return {};
    }

    const isNetwork = 
      errorMsg.includes('websocket') || 
      errorMsg.includes('500') || 
      errorMsg.includes('fetch') || 
      errorMsg.includes('network') ||
      errorMsg.includes('failed to fetch');

    return { 
      hasError: true, 
      error,
      isNetworkRelated: isNetwork
    };
  }

  componentDidMount() {
    window.addEventListener('error', this.handleGlobalError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.handleGlobalError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  handleGlobalError = (event: ErrorEvent) => {
    this.processGlobalError(event.error || new Error(event.message));
  };

  handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    this.processGlobalError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
  };

  processGlobalError = (error: Error) => {
    const errorMsg = error.message.toLowerCase();

    // Ignore Vite HMR WebSocket errors - these are development artifacts and should not crash the UI
    if (errorMsg.includes('websocket') && (errorMsg.includes('vite') || errorMsg.includes('hmr') || errorMsg.includes('closed without opened'))) {
      console.debug('[ErrorBoundary] Ignoring non-critical development WebSocket error:', error.message);
      return;
    }

    const isNetwork = 
      errorMsg.includes('websocket') || 
      errorMsg.includes('500') || 
      errorMsg.includes('fetch') || 
      errorMsg.includes('network') ||
      errorMsg.includes('failed to fetch');

    if (isNetwork) {
      this.setState({
        hasError: true,
        error,
        isNetworkRelated: true
      });
      this.componentDidCatch(error, { componentStack: 'Global Error Listener' });
    }
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo | { componentStack: string }) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    const now = Date.now();
    const { lastErrorTimestamp, errorCount } = this.state;
    
    // Detect repeated errors (e.g., within 30 seconds)
    const isRepeated = now - lastErrorTimestamp < 30000;
    
    this.setState({
      errorCount: isRepeated ? errorCount + 1 : 1,
      lastErrorTimestamp: now,
    });
  }

  handleHardReset = () => {
    // Clear potentially stale localStorage states that might be causing loops
    // But keep the essential ones like 'site_unlocked'
    const essentialKeys = ['site_unlocked', 'app_theme'];
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !essentialKeys.includes(key)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));

    // Force a clean application re-initialization
    // window.location.reload(true) is deprecated in some browsers but explicitly requested
    try {
      (window.location as any).reload(true);
    } catch (e) {
      window.location.reload();
    }
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const isCritical = this.state.errorCount >= 2;

      return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border-2 border-amber-500/20 dark:border-stone-800 overflow-hidden">
            {/* Recovery Dashboard Header */}
            <div className="bg-amber-500 dark:bg-amber-600 p-6 text-white flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                {this.state.isNetworkRelated ? <WifiOff className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
              </div>
              <div>
                <h2 className="text-xl font-bold leading-tight">لوحة استعادة النظام</h2>
                <p className="text-amber-100 text-sm">Recovery Dashboard</p>
              </div>
            </div>

            <div className="p-8 space-y-6 text-right dir-rtl">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center justify-end gap-2">
                  <span>حدث خطأ غير متوقع</span>
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                  {this.state.isNetworkRelated 
                    ? "يبدو أن هناك مشكلة في الاتصال بالخادم (خطأ 500 أو WebSocket). قد يكون هذا بسبب ضعف الشبكة أو تحديث النظام."
                    : "واجه التطبيق صعوبة في تحميل بعض العناصر التعليمية. نعتذر عن هذا الإزعاج التقني."}
                </p>
              </div>

              {isCritical && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-4 rounded-2xl flex items-start gap-3">
                  <div className="flex-1 text-xs text-red-700 dark:text-red-400 leading-normal">
                    <strong>تنبيه تكرار الخطأ:</strong> لقد تم رصد تكرار لهذا العطل في وقت قصير. ننصح بإجراء "إعادة ضبط شاملة" لتنظيف الذاكرة المؤقتة وضمان استقرار الجلسة.
                  </div>
                  <Zap className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={this.handleHardReset}
                  className="w-full py-4 px-6 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black dark:hover:bg-white transition-all shadow-lg active:scale-95"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>إعادة ضبط شاملة ونظامية (Hard Reset)</span>
                </button>

                <button
                  onClick={this.handleRetry}
                  className="w-full py-3 px-6 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-stone-200 dark:hover:bg-stone-750 transition-all active:scale-95"
                >
                  <span>محاولة الاستمرار</span>
                </button>
              </div>

              <div className="pt-4 text-center">
                <p className="text-[10px] text-stone-400 font-mono uppercase tracking-widest">
                  System Error Log: {this.state.error?.name || 'UnknownError'}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
