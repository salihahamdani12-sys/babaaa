import React, { useState, useEffect } from 'react';
import {
  Timer, Flame, Target, Play, Pause, RotateCcw, Volume2, VolumeX,
  X, CheckCircle2, TrendingUp, Sparkles, BookOpen, Clock, Calendar,
  Award, Zap, ChevronLeft, ArrowRight, Layers, BarChart3, AlertCircle
} from 'lucide-react';
import { BookId, BookInfo, FocusSessionState } from '../types';
import {
  getFocusSessionState,
  subscribeToFocusSession,
  setDailyReadingGoalMinutes,
  toggleFocusTimer,
  setFocusMode,
  resetPomodoro,
  toggleFocusSound,
  formatFocusTime,
  getPageReadingSeconds,
  resetCurrentPageTimer,
  resetTotalSessionTimer,
  playChimeSound,
} from '../data/focusService';

interface FocusSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBook: BookInfo;
  currentPage: number;
  totalPages: number;
}

export const FocusSessionModal: React.FC<FocusSessionModalProps> = ({
  isOpen,
  onClose,
  activeBook,
  currentPage,
  totalPages,
}) => {
  const [sessionState, setSessionState] = useState<FocusSessionState>(() => getFocusSessionState());
  const [customGoalInput, setCustomGoalInput] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'session' | 'history' | 'goals'>('session');

  useEffect(() => {
    const unsubscribe = subscribeToFocusSession((state) => {
      setSessionState(state);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (sessionState) {
      setCustomGoalInput(String(sessionState.dailyGoalMinutes));
    }
  }, [sessionState.dailyGoalMinutes]);

  if (!isOpen) return null;

  const todayMinutes = Math.floor(sessionState.todaySeconds / 60);
  const goalMinutes = sessionState.dailyGoalMinutes;
  const progressPercent = Math.min(100, Math.round((sessionState.todaySeconds / (goalMinutes * 60)) * 100));
  const isGoalAchieved = sessionState.todaySeconds >= goalMinutes * 60;
  const pageSeconds = getPageReadingSeconds(activeBook.id, currentPage);

  // Goal presets in minutes
  const goalPresets = [10, 15, 20, 25, 30, 45, 60];

  const handleApplyCustomGoal = (minutes: number) => {
    if (minutes > 0 && minutes <= 300) {
      setDailyReadingGoalMinutes(minutes);
      playChimeSound('start');
    }
  };

  return (
    <div
      id="focus-session-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 font-arabic"
    >
      <div
        className="bg-white dark:bg-stone-900 border border-amber-300/80 dark:border-stone-700 w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-right animate-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* MODAL HEADER */}
        <div className="px-5 py-4 bg-linear-to-l from-amber-800 via-amber-900 to-stone-900 text-amber-50 flex items-center justify-between border-b border-amber-700/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-700/80 border border-amber-500/60 flex items-center justify-center text-amber-200 shadow-inner">
              <Timer className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  جلسة التركيز والهدف اليومي (Focus Session)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-mono text-[10.5px] font-bold">
                  1ère Bac
                </span>
              </div>
              <p className="text-xs text-amber-200/80 font-serif">
                تتبع وقت قراءة الصفحات وإنجاز الهدف القرائي اليومي
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Sound Toggle */}
            <button
              onClick={() => toggleFocusSound()}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                sessionState.soundEnabled
                  ? 'bg-amber-800/80 border-amber-600 text-amber-200 hover:text-white'
                  : 'bg-stone-800/80 border-stone-700 text-stone-400'
              }`}
              title={sessionState.soundEnabled ? 'كتم التنبيهات الصوتية' : 'تفعيل التنبيهات الصوتية'}
            >
              {sessionState.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-amber-950 hover:bg-red-900/80 text-amber-200 hover:text-white transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TAB NAVIGATION WITH DIRECT RESET BUTTON IN MENU */}
        <div className="flex flex-wrap items-center justify-between border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 px-4 py-2 gap-2 text-xs font-bold shrink-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveTab('session')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'session'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>المؤقت والجلسة الحالية</span>
            </button>

            <button
              onClick={() => setActiveTab('goals')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'goals'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>ضبط الهدف اليومي</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>سجل الإنجاز والمواظبة</span>
            </button>
          </div>

          {/* Quick Reset Menu Button */}
          <button
            onClick={() => {
              if (window.confirm('هل تريد إعادة ضبط العداد بالكامل والبدء من الصفر (00:00)؟')) {
                resetTotalSessionTimer();
                resetCurrentPageTimer(activeBook.id, currentPage);
                playChimeSound('start');
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/80 dark:hover:bg-rose-900 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs font-bold"
            title="إعادة ضبط المؤقت والبدء من الصفر (Reset Chrono vers 0)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>إعادة الضبط من الصفر (Reset) 🔄</span>
          </button>
        </div>

        {/* MODAL BODY CONTENT */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 grow text-stone-800 dark:text-stone-100">
          {/* ========================================================================= */}
          {/* TAB 1: ACTIVE FOCUS SESSION & PAGE TIMER                                 */}
          {/* ========================================================================= */}
          {activeTab === 'session' && (
            <div className="space-y-5">
              {/* Daily Goal Gauge & Milestone Card */}
              <div className="p-5 rounded-2xl bg-linear-to-br from-amber-50 via-orange-50/50 to-amber-100/60 dark:from-stone-800/90 dark:via-stone-850 dark:to-stone-900 border border-amber-200 dark:border-stone-700 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                  {/* Left (RTL right): Progress ring and main stats */}
                  <div className="flex items-center gap-4">
                    {/* SVG Circular Ring Gauge */}
                    <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-stone-200 dark:text-stone-700"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={isGoalAchieved ? 'text-emerald-500' : 'text-amber-600 dark:text-amber-400'}
                          strokeDasharray={`${progressPercent}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="font-mono font-black text-lg text-stone-900 dark:text-white">
                          {progressPercent}%
                        </span>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 font-bold">
                          {isGoalAchieved ? 'اكتمل!' : 'اليوم'}
                        </span>
                      </div>
                    </div>

                    {/* Stats summary */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-white">
                          وقت القراءة المنجز اليوم
                        </h3>
                        {isGoalAchieved && (
                          <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>تم إنجاز الهدف!</span>
                          </span>
                        )}
                      </div>

                      <div className="text-xl sm:text-2xl font-mono font-bold text-amber-900 dark:text-amber-300">
                        {formatFocusTime(sessionState.todaySeconds, 'arabicShort')}
                        <span className="text-xs font-arabic text-stone-500 dark:text-stone-400 font-normal mr-1.5">
                          من أصل هدف {goalMinutes} دقيقة
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-300">
                        {isGoalAchieved
                          ? '🎉 أحسنت! تجاوزت هدفك القرائي لهذا اليوم بنجاح.'
                          : `🎯 متبقي ${Math.max(0, goalMinutes - todayMinutes)} دقيقة لبلوغ هدفك اليومي.`}
                      </p>
                    </div>
                  </div>

                  {/* Right (RTL left): Streak Counter Badge */}
                  <div className="flex sm:flex-col items-center justify-center p-3 rounded-2xl bg-white/80 dark:bg-stone-900/90 border border-amber-200/80 dark:border-stone-700 text-center min-w-[120px] shadow-2xs">
                    <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                      <Flame className="w-5 h-5 fill-current animate-bounce" />
                      <span className="font-mono font-black text-xl">{sessionState.streakDays}</span>
                    </div>
                    <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400">
                      أيام متتالية
                    </span>
                  </div>
                </div>
              </div>

              {/* Specific Page Reading Time Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-700 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                        الوقت المستغرق في قراءة هذه الصفحة
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 font-serif">
                        {activeBook.titleFrench} — الصفحة {currentPage} من {totalPages}
                      </p>
                    </div>
                  </div>

                  {/* Reset Page Timer Button */}
                  <button
                    onClick={() => resetCurrentPageTimer(activeBook.id, currentPage)}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title="إعادة تصفير وقت هذه الصفحة فقط"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">تصفير الصفحة</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-700 space-y-1">
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 font-bold block">
                      الوقت المقضي في الصفحة {currentPage}:
                    </span>
                    <div className="text-xl font-mono font-bold text-stone-900 dark:text-stone-100">
                      {formatFocusTime(pageSeconds, 'arabicFull')}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-700 space-y-1">
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 font-bold block">
                      حالة المؤقت التلقائي:
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          sessionState.isTimerRunning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                        }`}
                      />
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                        {sessionState.isTimerRunning ? 'نشط ويعمل تلقائياً أثناء القراءة' : 'متوقف مؤقتاً'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Timer Controls & Modes */}
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800/60 border border-amber-200/60 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    نمط جلسة التركيز (Focus Mode):
                  </span>
                  <div className="flex items-center gap-1 bg-stone-200 dark:bg-stone-900 p-1 rounded-xl">
                    <button
                      onClick={() => setFocusMode('stopwatch')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        sessionState.activeSessionMode === 'stopwatch'
                          ? 'bg-amber-800 text-white shadow-2xs'
                          : 'text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      عداد تصاعدي مفتوح (Stopwatch)
                    </button>
                    <button
                      onClick={() => setFocusMode('pomodoro', 25)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        sessionState.activeSessionMode === 'pomodoro'
                          ? 'bg-amber-800 text-white shadow-2xs'
                          : 'text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      بومودورو 25 دقيقة (Pomodoro)
                    </button>
                  </div>
                </div>

                {/* Pomodoro Countdown Display if enabled */}
                {sessionState.activeSessionMode === 'pomodoro' && (
                  <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-amber-300 dark:border-stone-700 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs text-stone-600 dark:text-stone-400 block font-medium">
                        العد التنازلي لكتلة التركيز:
                      </span>
                      <span className="font-mono text-xl font-bold text-amber-900 dark:text-amber-300">
                        {formatFocusTime(sessionState.pomodoroSecondsRemaining, 'digital')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => resetPomodoro()}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                        title="إعادة ضبط بومودورو"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Main Action Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => toggleFocusTimer()}
                    className={`px-6 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer ${
                      sessionState.isTimerRunning
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {sessionState.isTimerRunning ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>إيقاف المؤقت مؤقتاً</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>تشغيل ومواصلة جلسة التركيز</span>
                      </>
                    )}
                  </button>

                  {/* Reset Page Time Button */}
                  <button
                    onClick={() => {
                      resetCurrentPageTimer(activeBook.id, currentPage);
                      playChimeSound('start');
                    }}
                    className="px-4 py-2.5 rounded-2xl font-bold text-xs bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="تصفير وقت قراءة الصفحة الحالية"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>تصفير الصفحة ({currentPage})</span>
                  </button>

                  {/* Reset Total Session Time Button */}
                  <button
                    onClick={() => {
                      if (window.confirm('هل أنت متأكد من تصفير وقت القراءة الكلي للجلسة؟')) {
                        resetTotalSessionTimer();
                        playChimeSound('start');
                      }
                    }}
                    className="px-4 py-2.5 rounded-2xl font-bold text-xs bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="تصفير وقت القراءة الكلي لهذا اليوم"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                    <span>تصفير الوقت الكلي</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: DAILY READING GOAL SETTINGS                                       */}
          {/* ========================================================================= */}
          {activeTab === 'goals' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700 space-y-2">
                <div className="flex items-center gap-2 text-amber-950 dark:text-amber-300 font-bold text-sm">
                  <Target className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>تحديد الهدف القرائي اليومي (Daily Reading Goal)</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  يساعدك الالتزام بورد يومي ثابت في قراءة مؤلفات الأولى باكالوريا («علبة العجائب»، «أنتيجون»، «آخر يوم لمحكوم بالإعدام») على الاستعداد المتين للامتحان الجهوي دون ضغط أو مراكمة.
                </p>
              </div>

              {/* Goal Presets */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                  اختر المدة اليومية المستهدفة:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {goalPresets.map((mins) => {
                    const isSelected = sessionState.dailyGoalMinutes === mins;
                    return (
                      <button
                        key={mins}
                        onClick={() => handleApplyCustomGoal(mins)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-800 text-white border-amber-900 shadow-md ring-2 ring-amber-400/50 scale-[1.02]'
                            : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-750'
                        }`}
                      >
                        <div className="font-mono text-lg font-bold">{mins} دقيقة</div>
                        <div className="text-[11px] opacity-80">
                          {mins <= 15 ? 'مراجعة خفيفة' : mins <= 30 ? 'الوتيرة المثالية' : 'تركيز مكثف'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Number Input */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 space-y-3">
                <label className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                  أو أدخل مدة مخصصة (بالدقائق):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={customGoalInput}
                    onChange={(e) => setCustomGoalInput(e.target.value)}
                    placeholder="مثلاً 20"
                    className="w-32 px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-center font-mono font-bold text-stone-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-stone-600 dark:text-stone-300">دقيقة يومياً</span>
                  <button
                    onClick={() => handleApplyCustomGoal(Number(customGoalInput))}
                    className="mr-auto px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    حفظ الهدف
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: HISTORY & STREAK INSIGHTS                                         */}
          {/* ========================================================================= */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>سجل الأيام السابقة ومواظبة القراءة:</span>
                </h3>
                <span className="text-xs text-stone-500 dark:text-stone-400">آخر 7 أيام</span>
              </div>

              {sessionState.history.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
                  <Sparkles className="w-8 h-8 mx-auto text-amber-600 dark:text-amber-400" />
                  <p className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    اليوم هو أول يوم في سجل تركيزك!
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    سيتم حفظ إنجازاتك ومواظبتك اليومية تلقائياً هنا مع تقدم الأيام.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sessionState.history.slice(0, 7).map((item, idx) => (
                    <div
                      key={item.date || idx}
                      className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-stone-500 dark:text-stone-400 text-[11px]">
                          {item.date}
                        </span>
                        {item.goalReached ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>مكتمل</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-[10px]">
                            قراءة جزئية
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                          {formatFocusTime(item.totalSeconds, 'arabicShort')}
                        </span>
                        <span className="text-[11px] text-stone-500 dark:text-stone-400">
                          (هدف {item.goalMinutes} د)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-5 py-3.5 bg-stone-100 dark:bg-stone-900/90 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs shrink-0">
          <div className="text-stone-500 dark:text-stone-400 flex items-center gap-1 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>المؤقت يتوقف تلقائياً عند تغيير علامة التبويب أو إيقاف النشاط</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold transition-all shadow-xs cursor-pointer"
          >
            إغلاق ومواصلة القراءة
          </button>
        </div>
      </div>
    </div>
  );
};
