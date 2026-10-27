import React, { useState, useEffect, useRef } from 'react';
import {
  Timer, Play, Pause, Flame, Target, ChevronUp, ChevronDown,
  RotateCcw, Sparkles, CheckCircle2, Volume2, VolumeX, Maximize2,
  Clock, BookOpen, RefreshCw
} from 'lucide-react';
import { BookId, BookInfo, FocusSessionState } from '../types';
import {
  getFocusSessionState,
  subscribeToFocusSession,
  toggleFocusTimer,
  formatFocusTime,
  getPageReadingSeconds,
  setActiveReadingPage,
  resetCurrentPageTimer,
  resetTotalSessionTimer,
  playChimeSound,
} from '../data/focusService';

interface FocusSessionWidgetProps {
  activeBook: BookInfo;
  currentPage: number;
  totalPages: number;
  onOpenFocusModal: () => void;
}

export const FocusSessionWidget: React.FC<FocusSessionWidgetProps> = ({
  activeBook,
  currentPage,
  totalPages,
  onOpenFocusModal,
}) => {
  const [sessionState, setSessionState] = useState<FocusSessionState>(() => getFocusSessionState());
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [showResetMenu, setShowResetMenu] = useState<boolean>(false);
  const resetMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveReadingPage(activeBook.id, currentPage);
    const unsubscribe = subscribeToFocusSession((state) => {
      setSessionState(state);
    });
    return unsubscribe;
  }, [activeBook.id, currentPage]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (resetMenuRef.current && !resetMenuRef.current.contains(e.target as Node)) {
        setShowResetMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isDismissed) {
    return null;
  }

  const pageSeconds = getPageReadingSeconds(activeBook.id, currentPage);
  const totalSeconds = sessionState.todaySeconds;
  const goalMinutes = sessionState.dailyGoalMinutes;
  const todayMinutes = Math.floor(totalSeconds / 60);
  const progressPercent = Math.min(100, Math.round((totalSeconds / (goalMinutes * 60)) * 100));
  const isGoalAchieved = totalSeconds >= goalMinutes * 60;

  const handleResetPageTime = () => {
    resetCurrentPageTimer(activeBook.id, currentPage);
    playChimeSound('start');
    setShowResetMenu(false);
  };

  const handleResetTotalTime = () => {
    resetTotalSessionTimer();
    playChimeSound('start');
    setShowResetMenu(false);
  };

  // Minimized floating pill
  if (isMinimized) {
    return (
      <div 
        id="focus-widget-minimized"
        className="fixed bottom-4 left-4 z-40 animate-in fade-in slide-in-from-bottom-2 duration-150 font-arabic select-none"
        dir="rtl"
      >
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-900/90 border border-amber-500/40 shadow-xl backdrop-blur-md">
          <button
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 px-2 py-1 rounded-xl text-amber-100 hover:bg-stone-800 transition-colors cursor-pointer"
            title="توسيع عداد جلسة التركيز"
          >
            <div className="relative flex items-center justify-center">
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span
                className={`absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full ${
                  sessionState.isTimerRunning ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                }`}
              />
            </div>
            
            {/* Page Time & Total Time indicators */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <div className="text-right font-mono font-bold text-amber-300">
                {formatFocusTime(pageSeconds, 'digital')}
              </div>
              <div className="w-px h-3.5 bg-stone-700" />
              <div className="text-right font-mono font-bold text-emerald-400">
                {formatFocusTime(totalSeconds, 'digital')}
              </div>
            </div>

            <ChevronUp className="w-3 h-3 text-amber-400 mr-0.5" />
          </button>

          {/* Quick Play/Pause on Minimized Pill */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFocusTimer();
            }}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              sessionState.isTimerRunning
                ? 'bg-amber-800 hover:bg-amber-700 text-amber-100'
                : 'bg-emerald-700 hover:bg-emerald-600 text-white'
            }`}
            title={sessionState.isTimerRunning ? 'إيقاف مؤقت' : 'تشغيل المؤقت'}
          >
            {sessionState.isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>

          {/* Dismiss button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDismissed(true);
            }}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
            title="إخفاء العداد من الشاشة"
          >
            <span className="text-xs font-bold leading-none px-0.5">×</span>
          </button>
        </div>
      </div>
    );
  }

  // Expanded In-Reader Focus Widget
  return (
    <div
      id="focus-session-reader-widget"
      className="fixed bottom-4 left-4 z-40 w-80 sm:w-88 bg-white/98 dark:bg-stone-900/98 border-2 border-amber-400/80 dark:border-stone-700 rounded-3xl shadow-2xl backdrop-blur-md overflow-hidden font-arabic text-right transition-all duration-200 animate-in fade-in slide-in-from-bottom-3 select-none"
      dir="rtl"
    >
      {/* Widget Header */}
      <div className="px-4 py-2.5 bg-linear-to-l from-amber-800 via-amber-900 to-stone-900 text-amber-100 flex items-center justify-between border-b border-amber-700/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-700/60 border border-amber-500/40 text-amber-200">
            <Timer className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block leading-tight">كرونو القراءة والتركيز (Chrono)</span>
            <span className="text-[10px] text-amber-200/80">تتبع الوقت المباشر وإعادة الضبط</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenFocusModal}
            className="p-1.5 rounded-lg hover:bg-amber-800/80 text-amber-200 hover:text-white transition-colors cursor-pointer"
            title="فتح لوحة تحكم الهدف الكاملة"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-lg hover:bg-amber-800/80 text-amber-200 hover:text-white transition-colors cursor-pointer"
            title="تصغير العداد"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Widget Body */}
      <div className="p-3.5 space-y-3">
        {/* Dual Timers Grid: Page Time vs Total Session Time */}
        <div className="grid grid-cols-2 gap-2">
          {/* Box 1: Time on Current Page */}
          <div className="p-2.5 rounded-2xl bg-amber-50/80 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700 relative overflow-hidden">
            <div className="flex items-center justify-between text-[11px] text-amber-900 dark:text-amber-300 font-bold mb-1">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>صفحة {currentPage}:</span>
              </span>
              <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-amber-200/60 dark:bg-stone-700 text-amber-900 dark:text-amber-200">
                الحالية
              </span>
            </div>
            <div className="font-mono text-lg font-black text-amber-950 dark:text-amber-200">
              {formatFocusTime(pageSeconds, 'digital')}
            </div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
              {formatFocusTime(pageSeconds, 'arabicShort')}
            </div>
          </div>

          {/* Box 2: Total Session Time */}
          <div className="p-2.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-800/70 relative overflow-hidden">
            <div className="flex items-center justify-between text-[11px] text-emerald-950 dark:text-emerald-300 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                <span>الوقت الكلي:</span>
              </span>
              <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-emerald-200/70 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                المجموع
              </span>
            </div>
            <div className="font-mono text-lg font-black text-emerald-900 dark:text-emerald-300">
              {formatFocusTime(totalSeconds, 'digital')}
            </div>
            <div className="text-[10px] text-emerald-800/80 dark:text-emerald-400 truncate font-mono">
              {todayMinutes} دقيقة مقضية
            </div>
          </div>
        </div>

        {/* Action Controls: Play/Pause + Reset Menu */}
        <div className="flex items-center gap-2">
          {/* Play / Pause Primary Button */}
          <button
            onClick={() => toggleFocusTimer()}
            className={`flex-1 py-2 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95 ${
              sessionState.isTimerRunning
                ? 'bg-amber-100 hover:bg-amber-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-stone-700'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
            }`}
          >
            {sessionState.isTimerRunning ? (
              <>
                <Pause className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>إيقاف مؤقت للكرونو</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-white" />
                <span>تشغيل / متابعة الكرونو</span>
              </>
            )}
          </button>

          {/* Reset (إعادة الضبط) Dropdown Trigger */}
          <div className="relative" ref={resetMenuRef}>
            <button
              onClick={() => setShowResetMenu((prev) => !prev)}
              className="py-2 px-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-amber-100 dark:hover:bg-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="تقنية إعادة ضبط الكرونو (Reset)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>إعادة الضبط</span>
            </button>

            {/* Dropdown Options for Reset */}
            {showResetMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-56 bg-white dark:bg-stone-900 border-2 border-amber-400 dark:border-stone-700 rounded-2xl shadow-2xl p-2 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1 text-[10.5px] font-bold text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800">
                  خيارات إعادة الضبط (Reset Chrono)
                </div>

                <button
                  onClick={handleResetPageTime}
                  className="w-full text-right px-2.5 py-1.5 rounded-xl hover:bg-amber-50 dark:hover:bg-stone-800 text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                    <span>تصفير وقت الصفحة {currentPage}</span>
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">00:00</span>
                </button>

                <button
                  onClick={handleResetTotalTime}
                  className="w-full text-right px-2.5 py-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
                    <span>تصفير الوقت الكلي للجلسة</span>
                  </span>
                  <span className="text-[10px] font-mono text-rose-400">00:00</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Today's Goal Progress Bar */}
        <div className="p-2.5 rounded-2xl bg-amber-50/70 dark:bg-stone-800/70 border border-amber-200/60 dark:border-stone-750 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1 font-bold text-stone-800 dark:text-stone-200">
              <Target className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>الهدف اليومي ({goalMinutes} د):</span>
            </div>
            <span className="font-mono font-bold text-amber-900 dark:text-amber-300 text-[11px]">
              {todayMinutes} / {goalMinutes} د ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isGoalAchieved
                  ? 'bg-linear-to-r from-emerald-600 to-teal-400'
                  : 'bg-linear-to-r from-amber-700 to-amber-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Footer: Streak & Open Modal */}
        <div className="flex items-center justify-between text-[10.5px] pt-0.5">
          <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-bold">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>سلسلة إنجاز: {sessionState.streakDays} أيام</span>
          </div>

          <button
            onClick={onOpenFocusModal}
            className="text-amber-800 hover:text-amber-950 dark:text-amber-400 dark:hover:text-amber-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>لوحة التحكم الكاملة</span>
            <span>←</span>
          </button>
        </div>
      </div>
    </div>
  );
};
