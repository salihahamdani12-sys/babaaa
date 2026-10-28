import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, HelpCircle, Compass, Type, Layers, Sparkles, Moon, Sun, 
  Star, Flag, CheckCircle2, TrendingUp, ChevronDown, Trophy, ArrowRight,
  Timer, Flame, Play, Pause, BarChart3
} from 'lucide-react';
import { BookId, BookInfo, ChapterMeta, FocusSessionState } from '../types';
import { BOOKS } from '../data/books';
import { getStoredFlashcards, subscribeToVocabularyUpdates } from '../data/vocabularyService';
import { getBookmarks, subscribeToBookmarks } from '../data/bookmarkService';
import { getChapterForBookPage, getBookChapters } from '../data/bookService';
import { getFocusSessionState, subscribeToFocusSession, formatFocusTime } from '../data/focusService';

const MindMapIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <circle cx="19" cy="5" r="2"></circle>
    <circle cx="5" cy="19" r="2"></circle>
    <circle cx="19" cy="19" r="2"></circle>
    <line x1="10" y1="10.5" x2="17.2" y2="6.2"></line>
    <line x1="14" y1="13.5" x2="17.5" y2="17.5"></line>
    <line x1="10" y1="13.5" x2="6.5" y2="17.5"></line>
  </svg>
);

interface NavbarProps {
  currentView: 'home' | 'reader' | 'quiz';
  setCurrentView: (view: 'home' | 'reader' | 'quiz') => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  setFontSize: (size: 'sm' | 'base' | 'lg' | 'xl') => void;
  selectedPagesForQuiz: number[];
  onOpenQuiz: () => void;
  onOpenChapters: () => void;
  onOpenBookmarks?: () => void;
  onOpenVocabReview?: () => void;
  onOpenFocusSession?: () => void;
  onOpenPassageSituation?: () => void;
  onOpenAnalytics?: () => void;
  onOpenMindMap?: () => void;
  activeBook: BookInfo;
  onSelectBook: (bookId: BookId) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentPage,
  totalPages,
  onPageChange,
  fontSize,
  setFontSize,
  selectedPagesForQuiz,
  onOpenQuiz,
  onOpenChapters,
  onOpenBookmarks,
  onOpenVocabReview,
  onOpenFocusSession,
  onOpenPassageSituation,
  onOpenAnalytics,
  onOpenMindMap,
  activeBook,
  onSelectBook,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [flashcardsCount, setFlashcardsCount] = useState<number>(() => getStoredFlashcards().length);
  const [bookmarksCount, setBookmarksCount] = useState<number>(() => getBookmarks(activeBook.id).length);
  const [focusState, setFocusState] = useState<FocusSessionState>(() => getFocusSessionState());
  const [isProgressCardOpen, setIsProgressCardOpen] = useState<boolean>(false);
  const [hoveredPercent, setHoveredPercent] = useState<number | null>(null);
  const [hoveredPage, setHoveredPage] = useState<number | null>(null);
  const [hoveredChapter, setHoveredChapter] = useState<ChapterMeta | null>(null);
  const [tooltipX, setTooltipX] = useState<number>(0);

  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubFocus = subscribeToFocusSession((state) => {
      setFocusState(state);
    });
    return unsubFocus;
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToVocabularyUpdates((cards) => {
      setFlashcardsCount(cards.length);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    setBookmarksCount(getBookmarks(activeBook.id).length);
    const unsubscribe = subscribeToBookmarks(() => {
      setBookmarksCount(getBookmarks(activeBook.id).length);
    });
    return unsubscribe;
  }, [activeBook.id]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (progressCardRef.current && !progressCardRef.current.contains(event.target as Node)) {
        setIsProgressCardOpen(false);
      }
    };
    if (isProgressCardOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProgressCardOpen]);

  const fontSizes: Array<'sm' | 'base' | 'lg' | 'xl'> = ['sm', 'base', 'lg', 'xl'];

  const cycleFontSize = () => {
    const currentIndex = fontSizes.indexOf(fontSize);
    const nextIndex = (currentIndex + 1) % fontSizes.length;
    setFontSize(fontSizes[nextIndex]);
  };

  const isAntigone = activeBook.id === 'antigone';
  const isCondamne = activeBook.id === 'le_dernier_jour_dun_condamne';

  // Calculate book reading progress percentage
  const progressPercent = totalPages > 0 ? Math.min(100, Math.max(1, Math.round((currentPage / totalPages) * 100))) : 0;
  
  // Chapter & Final Chapter analytics
  const chapters = getBookChapters(activeBook.id);
  const currentChapter = getChapterForBookPage(activeBook.id, currentPage);
  const finalChapter = chapters.length > 0 ? chapters[chapters.length - 1] : null;
  const isAtFinalChapter = finalChapter ? currentPage >= finalChapter.startPage : false;
  const isCompleted = currentPage >= totalPages;
  const pagesRemaining = Math.max(0, totalPages - currentPage);
  
  const currentChapterIndex = chapters.findIndex((c) => c.chapter === currentChapter.chapter);
  const chaptersRemaining = chapters.length > 0 && currentChapterIndex >= 0
    ? Math.max(0, chapters.length - (currentChapterIndex + 1))
    : 0;

  // Book specific progress themes
  const progressGradient = isAntigone
    ? 'bg-linear-to-r from-rose-800 via-rose-500 to-amber-400'
    : isCondamne
    ? 'bg-linear-to-r from-slate-800 via-sky-500 to-indigo-400'
    : 'bg-linear-to-r from-amber-800 via-amber-500 to-emerald-400';

  const progressGlow = isAntigone
    ? 'shadow-[0_0_12px_rgba(244,63,94,0.6)]'
    : isCondamne
    ? 'shadow-[0_0_12px_rgba(56,189,248,0.6)]'
    : 'shadow-[0_0_12px_rgba(245,158,11,0.6)]';

  const trackBg = isAntigone
    ? 'bg-rose-950/20 dark:bg-rose-950/40'
    : isCondamne
    ? 'bg-slate-900/20 dark:bg-slate-900/40'
    : 'bg-amber-200/50 dark:bg-stone-800/90';

  // Handle Scrubbing & Hover on Progress Bar
  const handleProgressBarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || totalPages <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    const calcPage = Math.max(1, Math.min(Math.round((x / rect.width) * totalPages), totalPages));
    
    setTooltipX(x);
    setHoveredPercent(percent);
    setHoveredPage(calcPage);
    setHoveredChapter(getChapterForBookPage(activeBook.id, calcPage));
  };

  const handleProgressBarMouseLeave = () => {
    setHoveredPercent(null);
    setHoveredPage(null);
    setHoveredChapter(null);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || totalPages <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const targetPage = Math.max(1, Math.min(Math.round((x / rect.width) * totalPages), totalPages));
    onPageChange(targetPage);
  };

  // Header styling per book
  const headerBgClass = isAntigone
    ? 'bg-[#faf5f6]/95 dark:bg-[#15090f]/95 border-b border-rose-200/80 dark:border-[#381622]'
    : isCondamne
    ? 'bg-[#f1f5f9]/95 dark:bg-[#0c121d]/95 border-b border-slate-300/80 dark:border-[#1e293b]'
    : 'bg-amber-50/95 dark:bg-[#16120f]/95 border-b border-amber-200/70 dark:border-[#2e231c]';

  const navTabActiveClass = isAntigone
    ? 'bg-rose-900 text-white dark:bg-rose-800 shadow-xs'
    : isCondamne
    ? 'bg-slate-900 text-white dark:bg-slate-800 shadow-xs'
    : 'bg-amber-800 text-white dark:bg-amber-700 shadow-xs';

  const navTabIdleClass = isAntigone
    ? 'text-rose-950 dark:text-stone-300 hover:bg-rose-100/80 dark:hover:bg-stone-800'
    : isCondamne
    ? 'text-slate-900 dark:text-stone-300 hover:bg-slate-200/80 dark:hover:bg-stone-800'
    : 'text-amber-900 dark:text-stone-300 hover:bg-amber-100/80 dark:hover:bg-stone-800';

  return (
    <header className={`sticky top-0 z-40 ${headerBgClass} backdrop-blur-md shadow-xs transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logo & Active Book Details */}
        <div className="flex items-center gap-3">
          <button
            id="nav-home-btn"
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 text-right group transition-all"
            title="الصفحة الرئيسية ومكتبة المؤلفات"
          >
            <div className={`w-10 h-10 rounded-xl ${
              isAntigone
                ? 'bg-rose-950 text-rose-100'
                : isCondamne
                ? 'bg-slate-900 text-sky-100'
                : 'bg-amber-900 text-amber-100 dark:bg-amber-800'
            } flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
              <BookOpen className={`w-5 h-5 ${isAntigone ? 'text-rose-200' : isCondamne ? 'text-sky-300' : 'text-amber-200'}`} />
            </div>
            <div className="hidden xs:block text-right">
              <span className={`block text-sm sm:text-base font-bold font-arabic leading-tight ${
                isAntigone ? 'text-rose-950 dark:text-stone-100' : isCondamne ? 'text-slate-950 dark:text-stone-100' : 'text-amber-950 dark:text-stone-100'
              }`}>
                {activeBook.titleArabic}
              </span>
              <span className={`block text-[11px] font-serif italic tracking-wide ${
                isAntigone ? 'text-rose-800/80 dark:text-rose-400/80' : isCondamne ? 'text-slate-700/80 dark:text-sky-400/80' : 'text-amber-800/80 dark:text-amber-400/80'
              }`}>
                {activeBook.titleFrench} · 1ère Bac
              </span>
            </div>
          </button>

          {/* Quick Book Switcher Dropdown/Pills */}
          <div className="hidden sm:flex items-center bg-black/5 dark:bg-white/5 p-0.5 rounded-lg border border-stone-300/40 dark:border-stone-700">
            {BOOKS.map((b) => (
              <button
                key={b.id}
                id={`book-switch-${b.id}`}
                onClick={() => onSelectBook(b.id)}
                className={`px-2.5 py-1 text-xs font-arabic rounded-md transition-all ${
                  activeBook.id === b.id
                    ? b.id === 'antigone'
                      ? 'bg-rose-900 text-white font-bold shadow-xs'
                      : b.id === 'le_dernier_jour_dun_condamne'
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'bg-amber-800 text-white font-bold shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                }`}
                title={`التبديل إلى ${b.titleArabic}`}
              >
                {b.id === 'la_boite_a_merveilles' ? 'علبة العجائب' : b.id === 'antigone' ? 'أنتيجون' : 'آخر يوم لمحكوم'}
              </button>
            ))}
          </div>
        </div>

        {/* View Switcher Navigation */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <button
            id="nav-tab-home"
            onClick={() => setCurrentView('home')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-arabic font-medium transition-all ${
              currentView === 'home' ? navTabActiveClass : navTabIdleClass
            }`}
          >
            المؤلفات
          </button>

          <button
            id="nav-tab-reader"
            onClick={() => setCurrentView('reader')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-arabic font-medium flex items-center gap-1.5 transition-all ${
              currentView === 'reader' ? navTabActiveClass : navTabIdleClass
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>القراءة والترجمة</span>
          </button>

          {/* Vocabulary Review & Flashcards Action Button */}
          {onOpenVocabReview && (
            <button
              id="nav-tab-vocab"
              onClick={onOpenVocabReview}
              className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-arabic font-bold bg-amber-200/80 dark:bg-stone-800 hover:bg-amber-300 dark:hover:bg-stone-700 text-amber-950 dark:text-amber-300 border border-amber-300/80 dark:border-stone-700 flex items-center gap-1.5 transition-all shadow-xs"
              title="مراجعة المفردات وبطاقات الذاكرة"
            >
              <Layers className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
              <span className="hidden md:inline">المفردات والبطاقات</span>
              <span className="md:hidden">المفردات</span>
              <span className="bg-amber-800 dark:bg-amber-600 text-amber-50 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                {flashcardsCount}
              </span>
            </button>
          )}

          {/* Unified Chapters, Events, Summaries & Bookmarks Button (دمج الفصول والأحداث والمقاطع في زر موحد أنيق) */}
          <button
            id="nav-tab-chapters-events"
            onClick={onOpenChapters}
            className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-arabic font-bold bg-amber-100/95 dark:bg-stone-800 hover:bg-amber-200 dark:hover:bg-stone-750 text-amber-950 dark:text-amber-200 border-2 border-amber-300/90 dark:border-stone-650 flex items-center gap-2 transition-all shadow-xs cursor-pointer hover:scale-102"
            title={isAntigone ? "فهرس مشاهد مسرحية أنتيجون وملخصاتها وأحداثها ومقاطعها" : "فهرس فصول الرواية وملخصاتها وأحداثها ومقاطعها"}
          >
            <BookOpen className="w-4 h-4 text-amber-800 dark:text-amber-400" />
            <span className="hidden sm:inline">{isAntigone ? 'المشاهد والأحداث 📜' : 'الفصول والأحداث 📜'}</span>
            <span className="sm:hidden">الفصول 📜</span>
            {bookmarksCount > 0 && (
              <span className="bg-amber-500 text-amber-950 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold flex items-center gap-0.5 shadow-2xs" title="عدد المحفوظات">
                <Star className="w-2.5 h-2.5 fill-amber-950 text-amber-950" />
                {bookmarksCount}
              </span>
            )}
          </button>

          {/* Analytics & Reading Statistics Dashboard Button */}
          {onOpenAnalytics && (
            <button
              id="nav-tab-analytics"
              onClick={onOpenAnalytics}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-arabic font-bold bg-amber-200/80 dark:bg-stone-800 hover:bg-amber-300 dark:hover:bg-stone-700 text-amber-950 dark:text-amber-300 border border-amber-300/80 dark:border-stone-700 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="لوحة تحكم إحصائيات القراءة والرسوم البيانية"
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
              <span className="hidden xl:inline">لوحة الإحصائيات</span>
              <span className="xl:hidden">الإحصائيات 📊</span>
            </button>
          )}

          {/* Mind Map Studio Button */}
          {onOpenMindMap && (
            <button
              id="nav-tab-mindmap"
              onClick={onOpenMindMap}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-arabic font-bold bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950/80 dark:hover:bg-indigo-900 text-indigo-900 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-800 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="خرائط الذهن والتلخيص وعلاقات الشخصيات (Mind Map)"
            >
              <MindMapIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden lg:inline">خرائط الذهن 🧠</span>
              <span className="lg:hidden">MindMap</span>
            </button>
          )}

          <button
            id="nav-tab-quiz"
            onClick={onOpenQuiz}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-arabic font-medium flex items-center gap-1.5 transition-all ${
              currentView === 'quiz'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-emerald-100/90 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-200/90 dark:hover:bg-emerald-900/60 border border-emerald-300/40 dark:border-emerald-800/60'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>اختبار جهوي</span>
            {selectedPagesForQuiz.length > 0 && (
              <span className="bg-emerald-700 text-emerald-100 text-[10px] px-1.5 py-0.2 rounded-full font-sans font-bold">
                {selectedPagesForQuiz.length}
              </span>
            )}
          </button>
        </nav>

        {/* Right Controls: Focus Session, Visual Progress Card, Night Mode Toggle, Reader Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Focus Session & Daily Goal Button */}
          {onOpenFocusSession && (
            <button
              id="navbar-focus-session-btn"
              onClick={onOpenFocusSession}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-arabic transition-all duration-200 cursor-pointer shadow-xs ${
                focusState.todaySeconds >= focusState.dailyGoalMinutes * 60
                  ? 'bg-emerald-100/90 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                  : 'bg-amber-100/90 hover:bg-amber-200/90 dark:bg-stone-800 dark:hover:bg-stone-750 border-amber-300/80 dark:border-stone-700 text-amber-950 dark:text-amber-200'
              }`}
              title={`جلسة التركيز والهدف اليومي: ${Math.floor(focusState.todaySeconds / 60)} من ${focusState.dailyGoalMinutes} دقيقة. اضغط لضبط الهدف ومتابعة الإنجاز.`}
            >
              <div className="relative flex items-center justify-center">
                <Timer className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span
                  className={`absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full ${
                    focusState.isTimerRunning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
              </div>
              <span className="font-mono font-bold text-xs">
                {Math.floor(focusState.todaySeconds / 60)}/{focusState.dailyGoalMinutes}د
              </span>
              <span className="hidden xl:inline-block text-[10px] text-amber-900/80 dark:text-stone-400 font-bold border-r border-amber-300/60 dark:border-stone-700 pr-1 mr-0.5">
                {focusState.todaySeconds >= focusState.dailyGoalMinutes * 60 ? '✓ تم' : `${Math.min(100, Math.round((focusState.todaySeconds / (focusState.dailyGoalMinutes * 60)) * 100))}%`}
              </span>
            </button>
          )}

          {/* Interactive Visual Reading Progress Button / Card */}
          <div className="relative" ref={progressCardRef}>
            <button
              id="reading-progress-summary-btn"
              onClick={() => setIsProgressCardOpen((prev) => !prev)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer text-xs font-arabic ${
                isProgressCardOpen
                  ? 'bg-amber-300/90 dark:bg-stone-700 border-amber-400 dark:border-stone-600 text-amber-950 dark:text-white ring-2 ring-amber-400/40'
                  : 'bg-amber-200/60 hover:bg-amber-200 dark:bg-stone-800 dark:hover:bg-stone-750 border-amber-300/70 dark:border-stone-700 text-amber-950 dark:text-amber-200'
              }`}
              title={`تقدم القراءة: ${progressPercent}% نحو الفصل الختامي. اضغط لعرض التفاصيل.`}
            >
              <div className="flex items-center gap-1.5">
                {isCompleted ? (
                  <Trophy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : isAtFinalChapter ? (
                  <Flag className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-bounce" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                )}

                {/* Progress Mini Bar inside pill */}
                <div className="w-12 sm:w-16 h-2 rounded-full bg-stone-300/60 dark:bg-stone-900/80 overflow-hidden relative">
                  <div
                    className={`h-full ${progressGradient} transition-all duration-300 rounded-full`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <span className="font-mono font-bold text-xs">{progressPercent}%</span>
              </div>

              {/* Current Chapter Indicator (hidden on small mobile) */}
              <span className="hidden xl:inline-block text-[11px] text-amber-900/80 dark:text-stone-400 border-r border-amber-300/60 dark:border-stone-700 pr-1.5 mr-0.5 max-w-[120px] truncate">
                {isAntigone ? `مشهد ${currentChapter.chapter}` : `فصل ${currentChapter.chapter}`}
              </span>

              <ChevronDown className={`w-3.5 h-3.5 text-amber-700 dark:text-stone-400 transition-transform duration-200 ${isProgressCardOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* EXPANDABLE READING PROGRESS DETAILS POPOVER */}
            {isProgressCardOpen && (
              <div 
                className="absolute left-0 mt-2 w-80 sm:w-96 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-300/80 dark:border-stone-700 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 font-arabic text-right text-stone-800 dark:text-stone-100"
                dir="rtl"
              >
                {/* Popover Header */}
                <div className="flex items-center justify-between pb-3 border-b border-amber-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                        مؤشر التقدم في قراءة الرواية
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 font-serif">
                        {activeBook.titleFrench}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 font-mono font-bold text-xs border border-amber-200 dark:border-amber-800">
                    {progressPercent}%
                  </span>
                </div>

                {/* Progress Bar inside card */}
                <div className="py-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-600 dark:text-stone-400">
                      الصفحة <b className="text-stone-900 dark:text-stone-100 font-serif font-bold">{currentPage}</b> من أصل <b className="font-serif">{totalPages}</b>
                    </span>
                    <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                      {isCompleted ? 'اكتملت الرواية كاملة!' : `متبقي ${pagesRemaining} صفحة`}
                    </span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden relative p-0.5">
                    <div
                      className={`h-full rounded-full ${progressGradient} transition-all duration-300`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Milestone Towards Final Chapter */}
                <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-stone-800/80 border border-amber-200/70 dark:border-stone-700 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-amber-950 dark:text-amber-200 font-bold">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                      <span>{isAntigone ? 'المشهد الحالي:' : 'الفصل الحالي:'}</span>
                    </div>
                    <span className="text-[11px] text-stone-600 dark:text-stone-400 font-serif">
                      (صفحة {currentChapter.startPage} - {currentChapter.endPage})
                    </span>
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 text-[11px] font-medium leading-relaxed">
                    {currentChapter.title}
                  </p>

                  {/* Target Final Chapter Info */}
                  {finalChapter && (
                    <div className="pt-2 mt-2 border-t border-amber-200/60 dark:border-stone-700/60 flex items-start gap-2">
                      <Flag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-100 text-[11px]">
                          <span>{isAntigone ? 'المشهد الختامي:' : 'الفصل الختامي:'}</span>
                          <span className="text-emerald-700 dark:text-emerald-400">
                            {finalChapter.title}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-stone-500 dark:text-stone-400">
                          {isCompleted
                            ? 'أحسنت! لقد أتممت قراءة جميع الفصول والمشاهد المقررة.'
                            : isAtFinalChapter
                            ? 'أنت الآن في الفصل الختامي للعمل الأدبي!'
                            : `متبقي ${chaptersRemaining} ${isAntigone ? 'مشهد' : 'فصل'} للوصول إلى ختام المؤلف.`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setIsProgressCardOpen(false);
                        onOpenChapters();
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors cursor-pointer"
                    >
                      الفصول
                    </button>
                    {onOpenAnalytics && (
                      <button
                        onClick={() => {
                          setIsProgressCardOpen(false);
                          onOpenAnalytics();
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-amber-900 dark:text-amber-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <BarChart3 className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                        <span>لوحة الإحصائيات</span>
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setIsProgressCardOpen(false);
                      setCurrentView('reader');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer mr-auto"
                  >
                    <span>مواصلة القراءة</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Night / Day Mode Toggle Button */}
          {onToggleDarkMode && (
            <button
              id="theme-toggle-btn"
              onClick={onToggleDarkMode}
              className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs ${
                isDarkMode
                  ? 'bg-stone-800 hover:bg-stone-700 text-amber-300 border-stone-700'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
              }`}
              title={isDarkMode ? 'التبديل إلى الوضع النهاري العادي (Mode Jour)' : 'التبديل إلى الوضع الليلي المريح (Mode Nuit)'}
              aria-label="تبديل الوضع الليلي والنهاري"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span className="text-xs font-arabic font-bold hidden xs:inline">نهاري</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-amber-900" />
                  <span className="text-xs font-arabic font-bold hidden xs:inline">ليلي</span>
                </>
              )}
            </button>
          )}

          {/* Reader Quick Controls */}
          {currentView === 'reader' && (
            <div className="hidden md:flex items-center gap-2.5">
              {/* Font size toggle */}
              <button
                id="font-size-toggle-btn"
                onClick={cycleFontSize}
                className="p-1.5 text-xs text-amber-900 dark:text-stone-200 bg-amber-100/80 dark:bg-stone-800 hover:bg-amber-200/80 dark:hover:bg-stone-700 rounded-lg border border-amber-200 dark:border-stone-700 flex items-center gap-1 transition-all cursor-pointer"
                title="تغيير حجم خط القراءة"
              >
                <Type className="w-3.5 h-3.5" />
                <span className="font-mono uppercase font-bold text-[11px]">{fontSize}</span>
              </button>

              {/* Jump to page */}
              <div className="flex items-center gap-1.5 text-xs font-arabic text-amber-900 dark:text-stone-300">
                <span>صفحة</span>
                <select
                  id="header-page-select"
                  value={currentPage}
                  onChange={(e) => onPageChange(Number(e.target.value))}
                  className="bg-amber-100/90 dark:bg-stone-800 border border-amber-300 dark:border-stone-700 rounded px-2 py-1 text-xs font-serif font-bold text-amber-950 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num} className="bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100">
                      {num}
                    </option>
                  ))}
                </select>
                <span>من {totalPages}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RICH INTERACTIVE READING PROGRESS TRACK ALONG THE BOTTOM OF NAVBAR        */}
      {/* (Shown on non-reader views; in reader view, the dedicated bar is displayed) */}
      {/* ========================================================================= */}
      {currentView !== 'reader' && (
        <div 
          ref={progressBarRef}
          id="navbar-reading-progress-track"
          onClick={handleProgressBarClick}
          onMouseMove={handleProgressBarMouseMove}
          onMouseLeave={handleProgressBarMouseLeave}
          className={`w-full h-2 sm:h-2.5 ${trackBg} relative cursor-pointer group select-none transition-all duration-200`}
          title={`نسبة إنجاز قراءة ${activeBook.titleArabic}: ${progressPercent}% (الصفحة ${currentPage} من أصل ${totalPages}) - اضغط للانتقال السريع`}
        >
          {/* Fill Bar with Gradient & Active Glow */}
          <div
            className={`h-full ${progressGradient} ${progressGlow} transition-all duration-300 ease-out relative`}
            style={{ width: `${progressPercent}%` }}
          >
            {/* Subtle animated shimmer line on top edge */}
            <div className="absolute inset-0 bg-white/25 animate-pulse pointer-events-none" />

            {/* Active Glowing Head / Bead Marker */}
            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-amber-500 shadow-md transform scale-100 group-hover:scale-125 transition-transform" />
          </div>

          {/* Discrete Chapter Milestone Checkpoints / Ticks */}
          {chapters.map((ch, idx) => {
            const chPercent = (ch.startPage / totalPages) * 100;
            const isPassed = currentPage >= ch.startPage;
            return (
              <div
                key={ch.chapter || idx}
                className="absolute top-0 bottom-0 pointer-events-none flex items-center justify-center"
                style={{ left: `${chPercent}%` }}
              >
                <div 
                  className={`w-0.5 h-full ${
                    isPassed 
                      ? 'bg-white/40' 
                      : 'bg-stone-400/40 dark:bg-stone-600/50'
                  }`} 
                />
              </div>
            );
          })}

          {/* Final Chapter Destination Flag Checkpoint */}
          {finalChapter && (
            <div 
              className="absolute top-0 bottom-0 pointer-events-none flex items-center"
              style={{ left: `${(finalChapter.startPage / totalPages) * 100}%` }}
              title={`الفصل الختامي: ${finalChapter.title}`}
            >
              <div className="w-1 h-full bg-emerald-400 shadow-xs" />
            </div>
          )}

          {/* Interactive Hover Tooltip while scrubbing */}
          {hoveredPercent !== null && hoveredPage !== null && (
            <div
              className="absolute -bottom-10 -translate-x-1/2 bg-stone-900/95 text-white text-[11px] font-arabic font-bold px-2.5 py-1 rounded-lg shadow-xl pointer-events-none z-50 whitespace-nowrap border border-stone-700 animate-in fade-in zoom-in-95 duration-100 flex items-center gap-1.5"
              style={{ left: `${tooltipX}px` }}
            >
              <span className="text-amber-400 font-mono">{hoveredPercent}%</span>
              <span>·</span>
              <span>ص {hoveredPage}</span>
              {hoveredChapter && (
                <>
                  <span>·</span>
                  <span className="text-stone-300 font-normal max-w-[140px] truncate">
                    {hoveredChapter.title}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

