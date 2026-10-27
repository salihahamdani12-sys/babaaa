import React, { useState, useEffect, useCallback } from 'react';
import { Wrench, CheckCircle, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { accessibleTTS, stopAllTTS, warmUpSpeechEngine } from '../data/ttsService';

interface AutoFixerWidgetProps {
  onFixApplied?: () => void;
  className?: string;
  variant?: 'compact' | 'floating' | 'button';
}

export const AutoFixerWidget: React.FC<AutoFixerWidgetProps> = ({
  onFixApplied,
  className = '',
  variant = 'button',
}) => {
  const [isFixing, setIsFixing] = useState(false);
  const [fixSuccess, setFixSuccess] = useState(false);

  // Automatic Background Watchdog: Detects any hung speech or frozen utterance
  useEffect(() => {
    let stallCheckTimer: NodeJS.Timeout;

    const runWatchdog = () => {
      const state = accessibleTTS.getState();
      if (state.isPlaying && !state.isPaused && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.paused) {
          try {
            window.speechSynthesis.resume();
          } catch {}
        }
      }
    };

    stallCheckTimer = setInterval(runWatchdog, 3000);
    return () => clearInterval(stallCheckTimer);
  }, []);

  const triggerInstantFix = useCallback(() => {
    setIsFixing(true);
    setFixSuccess(false);

    try {
      // 1. Force kill any ghost audio and speech locks
      stopAllTTS();

      // 2. Pre-warm and reload browser speech synthesis voices
      warmUpSpeechEngine();

      // 3. Clear transient storage stalls safely
      if (typeof window !== 'undefined') {
        try {
          if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            window.speechSynthesis.resume();
          }
        } catch {}
      }

      setTimeout(() => {
        setIsFixing(false);
        setFixSuccess(true);
        onFixApplied?.();
        setTimeout(() => setFixSuccess(false), 3000);
      }, 350);
    } catch (e) {
      console.warn('AutoFixer notice:', e);
      setIsFixing(false);
    }
  }, [onFixApplied]);

  if (variant === 'compact') {
    return (
      <button
        onClick={triggerInstantFix}
        disabled={isFixing}
        className={`px-2.5 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs font-arabic font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 ${className}`}
        title="مصلح الصوت التلقائي: اضغط هنا إذا توقف الصوت لإعادة ضبط المحرك الصوتي فوراً"
        aria-label="إصلاح الصوت التلقائي"
      >
        {isFixing ? (
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600 dark:text-amber-400" />
        ) : fixSuccess ? (
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        )}
        <span>{fixSuccess ? 'تم الإصلاح ✓' : isFixing ? 'جاري الضبط...' : 'مصلح الصوت ⚡'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={triggerInstantFix}
      disabled={isFixing}
      className={`px-3 py-1.5 rounded-xl bg-linear-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/25 border border-amber-500/40 text-amber-950 dark:text-amber-200 text-xs font-arabic font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 ${className}`}
      title="مصلح الصوت الذكي الفوري: اضغط لإعادة تهيئة المحرك وتحديث الصوت فورياً"
      aria-label="مصلح الصوت التلقائي الذكي"
    >
      {isFixing ? (
        <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-700 dark:text-amber-300" />
      ) : fixSuccess ? (
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-bounce" />
      )}
      <span>{fixSuccess ? 'تم التحديث بنجاح ✓' : isFixing ? 'جاري إعادة الضبط...' : 'مصلح الصوت الفوري ⚡'}</span>
    </button>
  );
};
