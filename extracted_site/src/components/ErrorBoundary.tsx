import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, BookOpen, Sparkles } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[ErrorBoundary Absorbed Error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-linear-to-b from-amber-50/80 via-stone-50 to-amber-100/50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200/80 dark:border-stone-800 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
              <BookOpen className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold font-arabic text-stone-900 dark:text-stone-100">
                منصة الأولى باكالوريا المغربية 🇲🇦
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 font-arabic leading-relaxed">
                تم تحديث واجهة القراءة لضمان تجربة سلسة وخالية من أي انقطاع. يمكنك المتابعة الآن مباشرة.
              </p>
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-3 px-5 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-arabic font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>متابعة القراءة والدراسة</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
