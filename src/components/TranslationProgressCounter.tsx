import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, RefreshCw, Layers, Check } from 'lucide-react';

export interface TranslationProgressCounterProps {
  isTranslating: boolean;
  variant?: 'panel' | 'banner' | 'floating' | 'compact' | 'modal';
  targetText?: string;
  onDone?: () => void;
}

const STAGES = [
  { percent: 18, label: 'قراءة النص واستخراج التراكيب الفرنسية', tag: 'التحليل المعجمي' },
  { percent: 45, label: 'صياغة الترجمة الأدبية باللغة العربية الفصحى', tag: 'الترجمة الأدبية' },
  { percent: 72, label: 'التدقيق البيداغوجي لسياق الرواية والامتحان الجهوي', tag: 'المطابقة والتدقيق' },
  { percent: 92, label: 'استخلاص المحسنات البديعية والتحليل الأدبي', tag: 'التحليل البلاغي' },
  { percent: 100, label: 'اكتملت الترجمة والتدقيق بنجاح 100%', tag: 'جاهز 100%' },
];

export const TranslationProgressCounter: React.FC<TranslationProgressCounterProps> = ({
  isTranslating,
  variant = 'panel',
  targetText,
}) => {
  const [percent, setPercent] = useState<number>(() => (isTranslating ? 12 : 100));
  const [stageIndex, setStageIndex] = useState<number>(() => (isTranslating ? 0 : 4));
  const [visibleFloating, setVisibleFloating] = useState<boolean>(isTranslating);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    if (isTranslating) {
      setVisibleFloating(true);
      setPercent((prev) => (prev >= 100 ? 10 : Math.max(10, prev)));
      setStageIndex(0);

      interval = setInterval(() => {
        setPercent((prev) => {
          if (prev < 30) {
            setStageIndex(0);
            return prev + Math.floor(Math.random() * 6 + 4);
          } else if (prev < 65) {
            setStageIndex(1);
            return prev + Math.floor(Math.random() * 5 + 3);
          } else if (prev < 88) {
            setStageIndex(2);
            return prev + Math.floor(Math.random() * 4 + 2);
          } else if (prev < 96) {
            setStageIndex(3);
            return prev + Math.floor(Math.random() * 2 + 1);
          }
          return prev;
        });
      }, 200);
    } else {
      // Transition smoothly to 100%
      setPercent(100);
      setStageIndex(4);

      if (variant === 'floating') {
        // Keep floating banner visible for 2.8 seconds after 100% completion so user sees 100%
        hideTimer = setTimeout(() => {
          setVisibleFloating(false);
        }, 2800);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [isTranslating, variant]);

  const currentStage = STAGES[stageIndex] || STAGES[STAGES.length - 1];
  const isFinished = !isTranslating && percent >= 100;

  // COMPACT INLINE PILL (e.g. inside header or floating toolbar)
  if (variant === 'compact') {
    return (
      <div 
        role="status"
        aria-live="polite"
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-arabic transition-all shadow-xs ${
          isFinished 
            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
            : 'bg-indigo-900 text-white border-indigo-700 animate-pulse'
        }`}
      >
        {!isFinished ? (
          <RefreshCw className="w-3.5 h-3.5 text-indigo-300 animate-spin" />
        ) : (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        )}
        <span className="font-mono font-black text-sm">{percent}%</span>
        <span className="hidden sm:inline opacity-90">{currentStage.tag}</span>
      </div>
    );
  }

  // FLOATING BOTTOM BANNER / TOAST
  if (variant === 'floating') {
    if (!visibleFloating && !isTranslating) return null;

    return (
      <div 
        role="status"
        aria-live="polite"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-lg bg-stone-950/95 text-white p-4 rounded-2xl shadow-2xl border-2 border-emerald-500/60 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200 font-arabic ring-4 ring-emerald-950/40"
      >
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${
              isFinished
                ? 'bg-emerald-900/80 border-emerald-500 text-emerald-300'
                : 'bg-indigo-600/30 border-indigo-400/40 text-indigo-300'
            }`}>
              {isFinished ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-300" />
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{isFinished ? 'اكتملت الترجمة بنجاح' : 'الترجمة جارية بالذكاء الاصطناعي'}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isFinished ? 'bg-emerald-800 text-emerald-100' : 'bg-indigo-800 text-indigo-200 animate-pulse'
                }`}>
                  {currentStage.tag}
                </span>
              </h4>
              <p className="text-[11px] text-stone-300 truncate max-w-[240px] mt-0.5">{currentStage.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 font-mono font-black text-xl text-emerald-400 bg-stone-900 px-3.5 py-1.5 rounded-xl border border-emerald-600/60 shadow-inner">
            <span>{percent}</span>
            <span className="text-xs font-normal text-emerald-300">%</span>
          </div>
        </div>

        {/* Progress Track */}
        <div className="w-full bg-stone-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-stone-700">
          <div
            className={`h-full rounded-full transition-all duration-300 ease-out ${
              isFinished
                ? 'bg-linear-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                : 'bg-linear-to-r from-indigo-500 via-teal-400 to-emerald-400 shadow-[0_0_12px_rgba(45,212,191,0.8)]'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  }

  // PANEL / BANNER / MODAL VARIANT (Default)
  return (
    <div 
      role="status"
      aria-live="polite"
      className={`p-4 rounded-2xl border transition-all duration-300 font-arabic text-right ${
        isFinished 
          ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 shadow-xs'
          : 'bg-linear-to-br from-indigo-950 via-slate-900 to-emerald-950 border-indigo-500/50 text-white shadow-lg'
      }`}
    >
      {/* Header: Title, Live Percent Number (0-100%), and Status Badge */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${
            isFinished
              ? 'bg-emerald-200 dark:bg-emerald-900 border-emerald-400 text-emerald-800 dark:text-emerald-200'
              : 'bg-indigo-600/40 border-indigo-400 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
          }`}>
            {isFinished ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-300" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold">
                {isFinished ? 'اكتملت الترجمة والتدقيق بنجاح' : 'جاري ترجمة وتدقيق النص بالذكاء الاصطناعي'}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                isFinished 
                  ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 border-emerald-300'
                  : 'bg-indigo-500/30 text-indigo-200 border-indigo-400/40 animate-pulse'
              }`}>
                {currentStage.tag}
              </span>
            </div>
            <p className="text-[11px] opacity-80 mt-0.5 truncate max-w-[280px]">
              {currentStage.label}
            </p>
          </div>
        </div>

        {/* Large Prominent 0 to 100 Counter Badge */}
        <div className={`flex items-baseline gap-0.5 px-3.5 py-1.5 rounded-2xl border font-mono font-black shadow-inner ${
          isFinished
            ? 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border-emerald-300 text-xl'
            : 'bg-black/50 text-emerald-400 border-emerald-500/40 text-2xl shadow-[0_0_15px_rgba(16,185,129,0.4)]'
        }`}>
          <span className="tracking-tight">{percent}</span>
          <span className="text-xs font-bold text-stone-400">%</span>
        </div>
      </div>

      {/* Visual Live Progress Bar Track */}
      <div className="space-y-1.5 mt-3">
        <div className="w-full bg-black/30 dark:bg-stone-800/80 h-3 rounded-full overflow-hidden p-0.5 border border-white/10 dark:border-stone-700">
          <div
            className={`h-full rounded-full transition-all duration-300 ease-out relative ${
              isFinished
                ? 'bg-linear-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                : 'bg-linear-to-r from-indigo-500 via-teal-400 to-emerald-400 shadow-[0_0_12px_rgba(45,212,191,0.6)]'
            }`}
            style={{ width: `${percent}%` }}
          >
            {/* Shimmer animation */}
            {!isFinished && (
              <div className="absolute inset-0 bg-white/30 animate-pulse pointer-events-none" />
            )}
          </div>
        </div>

        {/* Step checkpoints */}
        <div className="grid grid-cols-4 gap-1.5 pt-1 text-[10px] text-stone-600 dark:text-stone-300">
          <div className={`text-center py-0.5 rounded ${percent >= 25 ? 'text-emerald-700 dark:text-emerald-300 font-bold' : 'opacity-60'}`}>
            1. التحليل
          </div>
          <div className={`text-center py-0.5 rounded ${percent >= 50 ? 'text-emerald-700 dark:text-emerald-300 font-bold' : 'opacity-60'}`}>
            2. الصياغة
          </div>
          <div className={`text-center py-0.5 rounded ${percent >= 75 ? 'text-emerald-700 dark:text-emerald-300 font-bold' : 'opacity-60'}`}>
            3. التدقيق
          </div>
          <div className={`text-center py-0.5 rounded ${percent >= 100 ? 'text-emerald-700 dark:text-emerald-300 font-bold' : 'opacity-60'}`}>
            4. الجاهزية 100%
          </div>
        </div>
      </div>
    </div>
  );
};
