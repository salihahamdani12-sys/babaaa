import React, { useState, useEffect, useMemo } from 'react';
import {
  X, BarChart3, Clock, TrendingUp, BookOpen, Layers, Award,
  CheckCircle2, Sparkles, Flame, Target, Compass, ChevronLeft,
  Calendar, PieChart, Activity, Zap, ArrowRight, Share2, Check,
  BookMarked, RefreshCw, Eye
} from 'lucide-react';
import { BookId, BookInfo, ChapterMeta } from '../types';
import { BOOKS } from '../data/books';
import {
  getAnalyticsDashboardData,
  AnalyticsSummaryData,
  ChapterReadingStats,
  DailyDayRecord,
  VocabularyProgressStats
} from '../data/analyticsService';
import { formatFocusTime, subscribeToFocusSession } from '../data/focusService';
import { subscribeToVocabularyUpdates } from '../data/vocabularyService';

interface AnalyticsDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBook: BookInfo;
  onSelectChapter?: (chapter: ChapterMeta) => void;
  onSelectPage?: (page: number) => void;
  onOpenVocabReview?: () => void;
  onOpenFocusSession?: () => void;
}

interface RadialProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  circleColor?: string;
  progressGradientId?: string;
  label?: string;
  subLabel?: string;
}

const RadialProgressRing: React.FC<RadialProgressRingProps> = ({
  percentage,
  size = 148,
  strokeWidth = 12,
  circleColor = 'text-amber-200/50 dark:text-stone-800',
  progressGradientId = 'radialProgressGradient',
  label = 'نسبة المكتمل',
  subLabel,
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));
  const center = size / 2;
  const radius = center - strokeWidth / 2 - 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center select-none shrink-0"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`مؤشر تقدم القراءة الدائري: ${clamped}% مكتمل`}
    >
      <svg width={size} height={size} className="transform -rotate-90 drop-shadow-xs">
        <defs>
          <linearGradient id={progressGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Background Track Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          className={`fill-none stroke-current ${circleColor}`}
        />

        {/* Animated Radial Progress Arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={`url(#${progressGradientId})`}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="fill-none transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Inner Label & Large Percentage */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-arabic px-2">
        <span className="text-2xl sm:text-3xl font-mono font-black tracking-tight text-amber-950 dark:text-amber-300">
          {clamped}%
        </span>
        <span className="text-[10px] font-extrabold text-stone-600 dark:text-stone-300 leading-none mt-0.5">
          {label}
        </span>
        {subLabel && (
          <span className="text-[9px] text-stone-500 dark:text-stone-400 font-bold truncate max-w-[95%] mt-1">
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
};

export const AnalyticsDashboardModal: React.FC<AnalyticsDashboardModalProps> = ({
  isOpen,
  onClose,
  activeBook,
  onSelectChapter,
  onSelectPage,
  onOpenVocabReview,
  onOpenFocusSession,
}) => {
  const [selectedBookFilter, setSelectedBookFilter] = useState<BookId | 'ALL'>(activeBook.id);
  const [activeTab, setActiveTab] = useState<'chapters' | 'velocity' | 'daily' | 'vocab'>('chapters');
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<AnalyticsSummaryData>(() =>
    getAnalyticsDashboardData(activeBook.id)
  );

  // Sync on open or book change
  useEffect(() => {
    if (isOpen) {
      setSelectedBookFilter(activeBook.id);
      setDashboardData(getAnalyticsDashboardData(activeBook.id));
    }
  }, [isOpen, activeBook.id]);

  // Refresh when focus or vocabulary changes
  useEffect(() => {
    if (!isOpen) return;

    const unsubFocus = subscribeToFocusSession(() => {
      setDashboardData(getAnalyticsDashboardData(selectedBookFilter));
    });

    const unsubVocab = subscribeToVocabularyUpdates(() => {
      setDashboardData(getAnalyticsDashboardData(selectedBookFilter));
    });

    return () => {
      unsubFocus();
      unsubVocab();
    };
  }, [isOpen, selectedBookFilter]);

  const handleBookFilterChange = (newBookId: BookId | 'ALL') => {
    setSelectedBookFilter(newBookId);
    setDashboardData(getAnalyticsDashboardData(newBookId));
  };

  const handleCopyReport = () => {
    const reportText = `📊 تقرير إحصائيات القراءة والمراجعة - الأولى باك:
⏱️ إجمالي وقت القراءة: ${dashboardData.formattedTotalTime}
📖 الصفحات المنجزة: ${dashboardData.totalPagesRead} من ${dashboardData.totalBookPages} صفحة (${dashboardData.overallCompletionPercent}%)
🔥 أيام التتابع المتتالية: ${dashboardData.streakDays} أيام
🧠 المفردات المتقنة: ${dashboardData.vocabStats.masteredCount} من ${dashboardData.vocabStats.totalWords} كلمة (${dashboardData.vocabStats.masteryRatePercent}%)
🎯 دقة الاختبارات: ${dashboardData.vocabStats.quizAccuracyPercent}%`;

    navigator.clipboard.writeText(reportText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  if (!isOpen) return null;

  // Max reading time in chapters for relative progress bar scaling
  const maxChapterSec = Math.max(
    1,
    ...dashboardData.chapterStats.map((c) => c.totalSeconds)
  );

  // Max daily minutes for bar chart scaling
  const maxDailyMinutes = Math.max(
    dashboardData.dailyGoalMinutes * 1.5,
    ...dashboardData.dailyHistory.map((d) => d.totalMinutes)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-stone-50 dark:bg-stone-900 rounded-3xl shadow-2xl border-2 border-amber-300 dark:border-stone-700 overflow-hidden flex flex-col max-h-[92vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-linear-to-r from-amber-900 via-amber-950 to-stone-900 text-amber-100 flex items-center justify-between border-b border-amber-800 shrink-0">
          <div className="flex items-center gap-3 text-right">
            <div className="w-10 h-10 rounded-xl bg-amber-800/90 border border-amber-600 flex items-center justify-center text-amber-300 shadow-md">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight font-arabic">
                  لوحة تحكم وإحصائيات القراءة والاستيعاب
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-emerald-950 font-mono text-[10.5px] font-extrabold">
                  تحليل مباشر ⚡
                </span>
              </div>
              <p className="text-xs text-amber-200/80 font-arabic">
                تتبع وقت القراءة الفعلي لكل فصل، معدل الإنجاز اليومي، وتقدم استيعاب المفردات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReport}
              className="px-2.5 py-1.5 rounded-xl bg-amber-950 hover:bg-amber-800 text-amber-200 hover:text-white transition-colors cursor-pointer text-xs font-bold font-arabic hidden sm:flex items-center gap-1 border border-amber-800"
              title="نسخ تقرير الإنجاز"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? 'تم النسخ' : 'مشاركة التقرير'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-amber-950 hover:bg-rose-900 text-amber-200 hover:text-white transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CONTROLS STRIP: TABS & NOVEL FILTER */}
        <div className="flex flex-wrap items-center justify-between border-b border-amber-200/70 dark:border-stone-800 bg-amber-50/70 dark:bg-stone-850 px-4 py-2.5 gap-2.5 text-xs font-bold shrink-0">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-amber-200/50 dark:bg-stone-800 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('chapters')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-arabic flex-1 sm:flex-initial ${
                activeTab === 'chapters'
                  ? 'bg-amber-900 text-amber-100 shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>وقت القراءة لكل فصل ⏱️</span>
            </button>

            <button
              onClick={() => setActiveTab('velocity')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-arabic flex-1 sm:flex-initial ${
                activeTab === 'velocity'
                  ? 'bg-indigo-800 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-indigo-300" />
              <span>سرعة القراءة والإرهاق ⚡</span>
            </button>

            <button
              onClick={() => setActiveTab('daily')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-arabic flex-1 sm:flex-initial ${
                activeTab === 'daily'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
              <span>الإنجاز اليومي والرسوم 📈</span>
            </button>

            <button
              onClick={() => setActiveTab('vocab')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-arabic flex-1 sm:flex-initial ${
                activeTab === 'vocab'
                  ? 'bg-amber-500 text-amber-950 font-extrabold shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-800" />
              <span>استيعاب المفردات 🧠</span>
            </button>
          </div>

          {/* Book Switcher Dropdown */}
          <div className="flex items-center gap-2 mr-auto sm:mr-0">
            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-bold font-arabic">
              تصفية المؤلف:
            </span>
            <select
              value={selectedBookFilter}
              onChange={(e) => handleBookFilterChange(e.target.value as BookId | 'ALL')}
              className="bg-white dark:bg-stone-800 border border-amber-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl px-2.5 py-1 text-xs font-bold font-arabic cursor-pointer shadow-2xs"
            >
              <option value="la_boite_a_merveilles">علبة العجائب (La Boîte à Merveilles)</option>
              <option value="antigone">أنتيجون (Antigone)</option>
              <option value="le_dernier_jour_dun_condamne">آخر يوم لمحكوم (Le Dernier Jour)</option>
              <option value="ALL">جميع المؤلفات الثلاثة (Vue Globale)</option>
            </select>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 grow text-stone-800 dark:text-stone-100">
          {/* ========================================================================= */}
          {/* RADIAL READING PROGRESS RING HERO BANNER                                  */}
          {/* ========================================================================= */}
          <div className="p-4 sm:p-5 rounded-3xl bg-linear-to-br from-amber-100/90 via-orange-50/80 to-amber-100/90 dark:from-stone-900 dark:via-stone-900/95 dark:to-stone-900 border-2 border-amber-300 dark:border-stone-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 font-arabic text-right">
            {/* Left/Right Text Details */}
            <div className="flex-1 space-y-2.5 w-full">
              <div className="flex items-center gap-2 flex-wrap justify-between sm:justify-start">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 font-extrabold text-xs border border-emerald-500/30 flex items-center gap-1.5">
                  <PieChart className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>مؤشر تقدم القراءة الدائري (Reading Progress Ring)</span>
                </span>
                <span className="text-xs font-serif italic text-amber-900/80 dark:text-amber-300/80 font-bold">
                  {selectedBookFilter === 'ALL'
                    ? 'الرؤية الشاملة لجميع المؤلفات الثلاثة'
                    : (BOOKS.find((b) => b.id === selectedBookFilter)?.titleFrench || activeBook.titleFrench)}
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-2xl font-black text-amber-950 dark:text-amber-200">
                  {selectedBookFilter === 'ALL'
                    ? 'إجمالي إنجاز المقرّر الدراسي'
                    : (BOOKS.find((b) => b.id === selectedBookFilter)?.titleArabic || activeBook.titleArabic)}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 font-bold leading-relaxed mt-1">
                  تمت قراءة <strong className="text-emerald-700 dark:text-emerald-400 font-mono text-sm">{dashboardData.totalPagesRead}</strong> من إجمالي <strong className="font-mono text-sm">{dashboardData.totalBookPages}</strong> صفحة بنسبة إنجاز تبلغ <strong className="text-amber-700 dark:text-amber-400 font-mono text-sm">{dashboardData.overallCompletionPercent}%</strong>.
                </p>
              </div>

              {/* Quick Details Badges */}
              <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                <span className="px-2.5 py-1 rounded-xl bg-white/80 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                  <BookMarked className="w-3.5 h-3.5 text-amber-600" />
                  <span>الفصول المكتملة: {dashboardData.chapterStats.filter((c) => c.status === 'completed').length} من {dashboardData.chapterStats.length}</span>
                </span>

                <span className="px-2.5 py-1 rounded-xl bg-white/80 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>وقت القراءة: {dashboardData.formattedTotalTime}</span>
                </span>

                <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 font-extrabold text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span>تتابع القراءة: {dashboardData.streakDays} أيام متتالية</span>
                </span>
              </div>
            </div>

            {/* Visual Radial Progress Ring Element */}
            <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/60 dark:bg-stone-850/80 border border-amber-200 dark:border-stone-750 shadow-xs">
              <RadialProgressRing
                percentage={dashboardData.overallCompletionPercent}
                size={144}
                strokeWidth={13}
                label="إجمالي المكتمل"
                subLabel={`${dashboardData.totalPagesRead} / ${dashboardData.totalBookPages} ص`}
              />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TOP KPI CARDS                                                            */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-right">
            {/* Card 1: Total Reading Time */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-750 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500 font-arabic">وقت القراءة الفعلي</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-lg sm:text-xl font-mono font-bold text-amber-950 dark:text-amber-300">
                {dashboardData.formattedTotalTime}
              </p>
              <p className="text-[10.5px] text-stone-500 font-arabic">
                {dashboardData.totalPagesRead} صفحات تمت قراءتها
              </p>
            </div>

            {/* Card 2: Book Completion Rate */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-750 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500 font-arabic">نسبة إنجاز الرواية</span>
                <BookOpen className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-lg sm:text-xl font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {dashboardData.overallCompletionPercent}%
              </p>
              <div className="w-full h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${dashboardData.overallCompletionPercent}%` }}
                />
              </div>
            </div>

            {/* Card 3: Today's Goal */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-750 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500 font-arabic">الهدف اليومي</span>
                <Target className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-lg sm:text-xl font-mono font-bold text-stone-900 dark:text-stone-100">
                {Math.floor(dashboardData.todaySeconds / 60)} / {dashboardData.dailyGoalMinutes} دقيقة
              </p>
              <p className="text-[10.5px] text-stone-500 font-arabic flex items-center justify-end gap-1">
                <span>{dashboardData.todayCompletionPercent}% تم إنجازه</span>
                {dashboardData.todayCompletionPercent >= 100 && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
              </p>
            </div>

            {/* Card 4: Vocabulary Mastery */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-750 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500 font-arabic">استيعاب المفردات</span>
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-lg sm:text-xl font-mono font-bold text-amber-600 dark:text-amber-400">
                {dashboardData.vocabStats.masteredCount} / {dashboardData.vocabStats.totalWords} كلمة
              </p>
              <p className="text-[10.5px] text-stone-500 font-arabic">
                معدل الاستيعاب {dashboardData.vocabStats.masteryRatePercent}%
              </p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TAB: READING VELOCITY & FATIGUE TRACKER                                  */}
          {/* ========================================================================= */}
          {activeTab === 'velocity' && (
            <div className="space-y-5 text-right">
              {/* Fatigue Alert & Focus Mode Suggestion Banner */}
              <div className={`p-5 rounded-3xl border-2 shadow-sm space-y-4 transition-all ${
                dashboardData.readingVelocity.fatigueDetected
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-800'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                        dashboardData.readingVelocity.fatigueDetected
                          ? 'bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200'
                          : 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200'
                      }`}>
                        {dashboardData.readingVelocity.fatigueDetected ? '⚠️ تنبيه إرهاق محتمل' : '🌟 إيقاع قراءة ممتاز'}
                      </span>
                      <h3 className="font-bold text-base font-arabic text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <Zap className={`w-4 h-4 ${dashboardData.readingVelocity.fatigueDetected ? 'text-rose-600' : 'text-emerald-600'}`} />
                        <span>مؤشر سرعة القراءة (Reading Velocity Tracker)</span>
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm font-arabic text-stone-700 dark:text-stone-300 leading-relaxed">
                      {dashboardData.readingVelocity.fatigueMessageArabic}
                    </p>
                  </div>
                </div>

                {dashboardData.readingVelocity.fatigueDetected && onOpenFocusSession && (
                  <div className="pt-2 border-t border-rose-200 dark:border-rose-900 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-arabic text-rose-800 dark:text-rose-300 font-bold">
                      خذ استراحة تركيز قصيرة (Focus Mode Break) لاستعادة طاقتك الذهنية ⏱️
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenFocusSession();
                      }}
                      className="px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-arabic font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <span>بدء وضع التركيز والاستراحة (Focus Mode) ☕</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Velocity KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-750 shadow-2xs space-y-1">
                  <span className="text-xs font-arabic text-stone-500 font-bold block">متوسط سرعة القراءة</span>
                  <p className="text-2xl font-mono font-black text-amber-900 dark:text-amber-300">
                    {dashboardData.readingVelocity.averageWPM} <span className="text-xs font-arabic font-normal text-stone-500">كلمة/دقيقة (WPM)</span>
                  </p>
                  <p className="text-[11px] text-stone-500 font-arabic">معدل الاستيعاب الطبيعي للروايات</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-750 shadow-2xs space-y-1">
                  <span className="text-xs font-arabic text-stone-500 font-bold block">أقصى سرعة مسجلة</span>
                  <p className="text-2xl font-mono font-black text-emerald-700 dark:text-emerald-400">
                    {dashboardData.readingVelocity.fastestWPM} <span className="text-xs font-arabic font-normal text-stone-500">كلمة/دقيقة</span>
                  </p>
                  <p className="text-[11px] text-stone-500 font-arabic">أعلى إيقاع ذروة في القراءة</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-750 shadow-2xs space-y-1">
                  <span className="text-xs font-arabic text-stone-500 font-bold block">أبطأ إيقاع مسجل</span>
                  <p className="text-2xl font-mono font-black text-rose-600 dark:text-rose-400">
                    {dashboardData.readingVelocity.slowestWPM} <span className="text-xs font-arabic font-normal text-stone-500">كلمة/دقيقة</span>
                  </p>
                  <p className="text-[11px] text-stone-500 font-arabic">يتطلب تركيزاً أو استراحة</p>
                </div>
              </div>

              {/* Recent Pages Velocity Breakdown */}
              <div className="p-5 bg-white dark:bg-stone-850 rounded-2xl border border-amber-200 dark:border-stone-750 shadow-xs space-y-4">
                <h4 className="font-bold text-sm sm:text-base text-amber-950 dark:text-stone-100 font-arabic flex items-center justify-between">
                  <span>تحليل سرعة الصفحات الأخيرة</span>
                  <Activity className="w-4 h-4 text-amber-600" />
                </h4>

                {dashboardData.readingVelocity.recentPagesVelocity.length === 0 ? (
                  <p className="text-xs text-stone-500 font-arabic text-center py-6">
                    لم يتم تسجيل صفحات مقروءة كافية بعد. ابدأ القراءة في قسم الروايات لتظهر سرعة القراءة هنا!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {dashboardData.readingVelocity.recentPagesVelocity.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-amber-50/70 dark:bg-stone-900 border border-amber-100 dark:border-stone-800 flex items-center justify-between text-xs font-arabic"
                      >
                        <div className="flex items-center gap-3 font-mono">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.isSlow ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-350'
                          }`}>
                            {item.isSlow ? 'إيقاع بطيء ⚠️' : 'إيقاع نشط ✨'}
                          </span>
                          <span className="font-bold text-stone-900 dark:text-stone-100">{item.wordsPerMinute} WPM</span>
                          <span className="text-stone-400">({formatFocusTime(item.seconds)})</span>
                        </div>
                        <span className="font-bold text-amber-900 dark:text-amber-300">
                          صفحة {item.pageNumber}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: CHAPTER-BY-CHAPTER ACTUAL READING TIME                            */}
          {/* ========================================================================= */}
          {activeTab === 'chapters' && (
            <div className="space-y-4 text-right">
              {/* Header Box */}
              <div className="p-4 bg-white dark:bg-stone-850 rounded-2xl border border-amber-200 dark:border-stone-750 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-sm sm:text-base text-amber-950 dark:text-stone-100 font-arabic flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>إحصائيات وقت القراءة الفعلي ومعدل الصفحات لكل فصل</span>
                  </h3>
                  <p className="text-xs text-stone-500 font-arabic">
                    يتم احتساب الوقت تلقائياً عند قراءة صفحات كل فصل بدقة متناهية
                  </p>
                </div>

                {onOpenFocusSession && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenFocusSession();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-stone-800 text-amber-900 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer font-arabic transition-colors"
                  >
                    <Target className="w-3.5 h-3.5 text-amber-700" />
                    <span>جلسة التركيز والمؤقت ⏱️</span>
                  </button>
                )}
              </div>

              {/* Chapters Detailed Table / Cards */}
              <div className="space-y-3">
                {dashboardData.chapterStats.map((ch) => {
                  const relativeBarPct = Math.max(4, Math.round((ch.totalSeconds / maxChapterSec) * 100));

                  return (
                    <div
                      key={ch.chapterNumber}
                      className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-750 shadow-xs space-y-3 transition-all hover:border-amber-400"
                    >
                      {/* Top Row: Chapter Title & Time */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-serif font-bold text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-stone-750 px-2.5 py-1 rounded-md border border-amber-200 dark:border-stone-600">
                            Pages {ch.startPage} - {ch.endPage}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10.5px] font-arabic font-bold ${
                              ch.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300'
                                : ch.status === 'in_progress'
                                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300'
                                : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                            }`}
                          >
                            {ch.status === 'completed'
                              ? 'مكتمل ✅'
                              : ch.status === 'in_progress'
                              ? 'قيد القراءة ⏳'
                              : 'لم يبدأ بعد'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm sm:text-base font-arabic text-amber-950 dark:text-stone-100">
                            {ch.chapterTitleArabic}
                          </h4>
                          <span className="text-xs font-serif text-amber-800 dark:text-amber-400">
                            ({ch.chapterTitle})
                          </span>
                        </div>
                      </div>

                      {/* Middle Row: Progress Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                        <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-900/60 border border-amber-100 dark:border-stone-800 space-y-0.5">
                          <span className="text-[10.5px] text-stone-500 font-arabic block">الوقت المستغرق</span>
                          <span className="font-mono font-bold text-sm text-amber-950 dark:text-amber-300">
                            {ch.formattedTime}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-900/60 border border-amber-100 dark:border-stone-800 space-y-0.5">
                          <span className="text-[10.5px] text-stone-500 font-arabic block">الصفحات المنجزة</span>
                          <span className="font-mono font-bold text-sm text-emerald-700 dark:text-emerald-400">
                            {ch.pagesVisited} / {ch.totalPages} ص
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-900/60 border border-amber-100 dark:border-stone-800 space-y-0.5">
                          <span className="text-[10.5px] text-stone-500 font-arabic block">معدل كل صفحة</span>
                          <span className="font-mono font-bold text-sm text-stone-800 dark:text-stone-200">
                            {ch.averageSecondsPerPage > 0 ? formatFocusTime(ch.averageSecondsPerPage) : '--'}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-900/60 border border-amber-100 dark:border-stone-800 space-y-0.5">
                          <span className="text-[10.5px] text-stone-500 font-arabic block">الوقت المتبقي المقدر</span>
                          <span className="font-mono font-bold text-sm text-rose-600 dark:text-rose-400">
                            {ch.status === 'completed' ? '00:00' : formatFocusTime(ch.estimatedRemainingSeconds)}
                          </span>
                        </div>
                      </div>

                      {/* Visual Reading Time Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10.5px] text-stone-500 font-arabic">
                          <span>نسبة إنجاز الفصل: {ch.completionPercent}%</span>
                          <span>الوقت النسبي في الرواية</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden flex">
                          <div
                            className="h-full bg-linear-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
                            style={{ width: `${relativeBarPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <button
                          onClick={() => {
                            if (onSelectPage) onSelectPage(ch.startPage);
                            onClose();
                          }}
                          className="text-emerald-800 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer font-arabic"
                        >
                          <span>انتقل لبداية هذا الفصل (ص {ch.startPage})</span>
                          <span>←</span>
                        </button>

                        <span className="text-[11px] text-stone-400 font-mono">
                          {ch.totalPages} صفحات إجمالاً
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: DAILY COMPLETION RATE & VISUAL CHARTS                             */}
          {/* ========================================================================= */}
          {activeTab === 'daily' && (
            <div className="space-y-5 text-right">
              {/* Daily Chart Container */}
              <div className="p-5 bg-white dark:bg-stone-850 rounded-2xl border border-amber-200 dark:border-stone-750 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-750 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold text-xs font-arabic">
                      الهدف اليومي: {dashboardData.dailyGoalMinutes} دقيقة
                    </span>
                    <span className="text-xs text-stone-500 font-arabic">
                      سلسلة التتابع: {dashboardData.streakDays} أيام 🔥
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-amber-950 dark:text-stone-100 font-arabic flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>معدل وقت القراءة اليومي للأسبوع الأخير (بالدقائق)</span>
                  </h3>
                </div>

                {/* SVG / HTML Bar Chart */}
                <div className="h-56 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2">
                  {dashboardData.dailyHistory.map((day, idx) => {
                    const heightPercent = Math.min(100, Math.max(6, Math.round((day.totalMinutes / maxDailyMinutes) * 100)));
                    const isGoal = day.goalReached;

                    return (
                      <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        {/* Tooltip & Value */}
                        <div className="text-[11px] font-mono font-bold text-stone-700 dark:text-stone-300 opacity-80 group-hover:opacity-100">
                          {day.totalMinutes > 0 ? `${day.totalMinutes} د` : '0'}
                        </div>

                        {/* Bar */}
                        <div className="w-full max-w-[42px] bg-stone-100 dark:bg-stone-800 rounded-t-xl overflow-hidden h-full flex items-end">
                          <div
                            className={`w-full rounded-t-xl transition-all duration-500 ${
                              isGoal
                                ? 'bg-linear-to-t from-emerald-600 to-emerald-400 shadow-xs'
                                : day.totalMinutes > 0
                                ? 'bg-linear-to-t from-amber-600 to-amber-400'
                                : 'bg-stone-200 dark:bg-stone-700'
                            }`}
                            style={{ height: `${heightPercent}%` }}
                          />
                        </div>

                        {/* Day Label */}
                        <div className="text-center">
                          <span className="text-xs font-bold font-arabic text-stone-700 dark:text-stone-300 block">
                            {day.dayLabelArabic}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono block">
                            {day.date.slice(5)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-stone-100 dark:border-stone-750 text-xs font-arabic">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-emerald-500" />
                    <span>تم تحقيق الهدف اليومي ⭐</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-amber-500" />
                    <span>جلسة قراءة نشطة</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-stone-300 dark:bg-stone-700" />
                    <span>يوم راحة</span>
                  </div>
                </div>
              </div>

              {/* Novels Comparison Breakdown */}
              <div className="p-5 bg-white dark:bg-stone-850 rounded-2xl border border-amber-200 dark:border-stone-750 shadow-xs space-y-4">
                <h4 className="font-bold text-sm sm:text-base text-amber-950 dark:text-stone-100 font-arabic flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-amber-700" />
                  <span>توزيع وقت القراءة بين المؤلفات الثلاثة</span>
                </h4>

                <div className="space-y-3">
                  {dashboardData.bookComparison.map((b) => (
                    <div key={b.bookId} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-arabic">
                        <div className="flex items-center gap-2 font-mono">
                          <span className="font-bold text-amber-950 dark:text-amber-300">{b.formattedTime}</span>
                          <span className="text-stone-400">({b.pagesRead} / {b.totalPages} صفحة)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 dark:text-stone-100">{b.titleArabic}</span>
                          <span className="text-[11px] text-stone-500 font-serif">({b.titleFrench})</span>
                        </div>
                      </div>

                      <div className="w-full h-2.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${b.completionPercent}%`,
                            backgroundColor: b.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: VOCABULARY ACQUISITION & COMPREHENSION PROGRESS                    */}
          {/* ========================================================================= */}
          {activeTab === 'vocab' && (
            <div className="space-y-5 text-right">
              {/* Top Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border-2 border-emerald-300 dark:border-emerald-800 text-right space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 font-arabic">
                      متقنة تماماً (Mastered)
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-mono font-black text-emerald-700 dark:text-emerald-300">
                    {dashboardData.vocabStats.masteredCount}
                  </p>
                  <p className="text-[11px] text-emerald-800/80 dark:text-emerald-400 font-arabic">
                    إجابات صحيحة متكررة في الاختبارات
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-800 text-right space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-300 font-arabic">
                      قيد المراجعة (Learning)
                    </span>
                    <RefreshCw className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="text-2xl font-mono font-black text-amber-700 dark:text-amber-300">
                    {dashboardData.vocabStats.learningCount}
                  </p>
                  <p className="text-[11px] text-amber-800/80 dark:text-amber-400 font-arabic">
                    تحتاج لتثبيت في التكرار المتباعد
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border-2 border-indigo-300 dark:border-indigo-800 text-right space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 font-arabic">
                      مفردات جديدة (New)
                    </span>
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="text-2xl font-mono font-black text-indigo-700 dark:text-indigo-300">
                    {dashboardData.vocabStats.newCount}
                  </p>
                  <p className="text-[11px] text-indigo-800/80 dark:text-indigo-400 font-arabic">
                    تمت إضافتها وتنتظر أول اختبار
                  </p>
                </div>
              </div>

              {/* Progress & Category Distribution */}
              <div className="p-5 bg-white dark:bg-stone-850 rounded-2xl border border-amber-200 dark:border-stone-750 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-750 pb-3">
                  <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-stone-800 px-3 py-1 rounded-lg border border-emerald-200 dark:border-stone-700">
                    دقة الإجابات: {dashboardData.vocabStats.quizAccuracyPercent}% 🎯
                  </span>
                  <h4 className="font-bold text-sm sm:text-base text-amber-950 dark:text-stone-100 font-arabic flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-600" />
                    <span>معدل استيعاب المفردات حسب التصنيف الأدبي</span>
                  </h4>
                </div>

                {/* Stacked Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-arabic text-stone-600 dark:text-stone-300">
                    <span>{dashboardData.vocabStats.masteryRatePercent}% نسبة الإتقان الكلية</span>
                    <span>{dashboardData.vocabStats.totalWords} كلمة ومصطلحاً متاحاً</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden flex">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width: `${(dashboardData.vocabStats.masteredCount / Math.max(1, dashboardData.vocabStats.totalWords)) * 100}%`,
                      }}
                      title="المتقنة"
                    />
                    <div
                      className="h-full bg-amber-500 transition-all duration-500"
                      style={{
                        width: `${(dashboardData.vocabStats.learningCount / Math.max(1, dashboardData.vocabStats.totalWords)) * 100}%`,
                      }}
                      title="قيد المراجعة"
                    />
                    <div
                      className="h-full bg-indigo-500 transition-all duration-500"
                      style={{
                        width: `${(dashboardData.vocabStats.newCount / Math.max(1, dashboardData.vocabStats.totalWords)) * 100}%`,
                      }}
                      title="جديدة"
                    />
                  </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {dashboardData.vocabStats.categoryDistribution.map((cat) => (
                    <div
                      key={cat.nameArabic}
                      className="p-3 rounded-xl bg-amber-50/60 dark:bg-stone-900 border border-amber-100 dark:border-stone-800 text-right space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="font-bold text-xs font-arabic text-stone-800 dark:text-stone-200">
                          {cat.nameArabic}
                        </span>
                      </div>
                      <p className="font-mono font-bold text-sm text-amber-950 dark:text-amber-300">
                        {cat.count} كلمة
                      </p>
                    </div>
                  ))}
                </div>

                {/* Call to Action Button */}
                {onOpenVocabReview && (
                  <div className="pt-3 border-t border-stone-100 dark:border-stone-750 flex items-center justify-between">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenVocabReview();
                      }}
                      className="w-full py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs font-arabic shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Layers className="w-4 h-4 text-amber-300" />
                      <span>فتح بطاقات الذاكرة وبدء اختبار استيعاب المفردات الآن 🎯</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
