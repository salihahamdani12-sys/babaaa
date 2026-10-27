import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, HelpCircle, Bookmark, Compass, CheckCircle2, ChevronLeft, Award, Theater, ArrowLeft, Layers, Trophy, RotateCw, Timer, Flame, Target, BarChart3, Headphones } from 'lucide-react';
import { BookId, BookInfo, ChapterMeta, FocusSessionState } from '../types';
import { BOOKS } from '../data/books';
import { getBookChapters } from '../data/bookService';
import { getStoredFlashcards } from '../data/vocabularyService';
import { getFocusSessionState, subscribeToFocusSession, formatFocusTime } from '../data/focusService';

interface WelcomeScreenProps {
  activeBookId: BookId;
  onSelectBook: (bookId: BookId) => void;
  onStartReading: (bookId: BookId, page?: number) => void;
  onOpenQuiz: (bookId: BookId) => void;
  onOpenChapter: (chapter: ChapterMeta) => void;
  onOpenVocabReview?: (tab?: 'cards' | 'quiz') => void;
  onOpenFocusSession?: () => void;
  onOpenAnalytics?: () => void;
  lastReadPages: Record<BookId, number>;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  activeBookId,
  onSelectBook,
  onStartReading,
  onOpenQuiz,
  onOpenChapter,
  onOpenVocabReview,
  onOpenFocusSession,
  onOpenAnalytics,
  lastReadPages,
}) => {
  const [selectedDirectoryBook, setSelectedDirectoryBook] = useState<BookId>(activeBookId);
  const [focusState, setFocusState] = useState<FocusSessionState>(() => getFocusSessionState());
  const flashcardsCount = getStoredFlashcards().length;

  useEffect(() => {
    const unsub = subscribeToFocusSession((s) => setFocusState(s));
    return unsub;
  }, []);

  const activeBook = BOOKS.find((b) => b.id === activeBookId) || BOOKS[0];
  const directoryBook = BOOKS.find((b) => b.id === selectedDirectoryBook) || activeBook;
  const directoryChapters = getBookChapters(selectedDirectoryBook);

  const todayMinutes = Math.floor(focusState.todaySeconds / 60);
  const goalMinutes = focusState.dailyGoalMinutes;
  const progressPercent = Math.min(100, Math.round((focusState.todaySeconds / (goalMinutes * 60)) * 100));
  const isGoalAchieved = focusState.todaySeconds >= goalMinutes * 60;


  const handleBookCardClick = (bookId: BookId) => {
    onSelectBook(bookId);
    setSelectedDirectoryBook(bookId);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 transition-colors duration-200">
      {/* Hero Welcome Header */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-stone-800 border border-amber-300/80 dark:border-stone-700 text-amber-900 dark:text-amber-300 text-xs font-medium font-arabic shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
          <span>المنصة التعليمية التفاعلية المعتمدة للأولى باكالوريا بالمغرب</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-arabic text-amber-950 dark:text-stone-100 tracking-tight leading-snug">
          مرحباً، ماذا تريد أن تقرأ اليوم؟
        </h1>

        <p className="max-w-3xl mx-auto text-sm sm:text-base text-amber-900/85 dark:text-stone-300 font-arabic leading-relaxed">
          اختر من القائمة الرئيسية للمؤلفات المقررة لمباشرة القراءة التفاعلية صفحة بصفحة، مع شروح دقيقة باللغة العربية الفصحى، ترجمة سياقية ذاتية التحقق، ونظام اختبارات جهوية معتمد.
        </p>

        {/* Daily Reading Goal & Analytics Dashboard Quick Cards */}
        <div className="max-w-3xl mx-auto pt-2 grid sm:grid-cols-2 gap-3" dir="rtl">
          {onOpenFocusSession && (
            <div
              onClick={onOpenFocusSession}
              className="p-3.5 rounded-2xl bg-linear-to-r from-amber-100/90 via-orange-50/90 to-amber-200/90 dark:from-stone-850 dark:via-stone-800 dark:to-stone-850 border border-amber-300/80 dark:border-stone-700 shadow-xs hover:shadow-md transition-all cursor-pointer text-right flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-800 text-white flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  <Timer className="w-4 h-4 text-amber-300 animate-pulse" />
                </div>
                <div className="space-y-0.5 text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-stone-900 dark:text-white">
                      الهدف اليومي: {todayMinutes}/{goalMinutes} د
                    </span>
                    {isGoalAchieved && (
                      <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                        ✓ مكتمل
                      </span>
                    )}
                  </div>
                  <div className="w-28 sm:w-36 h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isGoalAchieved ? 'bg-emerald-500' : 'bg-amber-600'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-bold text-xs shrink-0">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span className="font-mono">{focusState.streakDays}</span>
                <span className="text-[10.5px]">أيام</span>
              </div>
            </div>
          )}

          {onOpenAnalytics && (
            <div
              onClick={onOpenAnalytics}
              className="p-3.5 rounded-2xl bg-linear-to-r from-emerald-100/90 via-teal-50/90 to-amber-100/90 dark:from-stone-850 dark:via-stone-800 dark:to-stone-850 border border-emerald-300/80 dark:border-stone-700 shadow-xs hover:shadow-md transition-all cursor-pointer text-right flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-4 h-4 text-emerald-300" />
                </div>
                <div className="space-y-0.5 text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-stone-900 dark:text-white">
                      لوحة إحصائيات القراءة والرسوم
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 dark:bg-stone-800 dark:text-amber-300 text-[10px] font-bold">
                      تحليل 📊
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 font-arabic">
                    وقت كل فصل واستيعاب المفردات
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 font-arabic shrink-0 group-hover:-translate-x-1 transition-transform">
                عرض ←
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Main List of Prescribed Works (القائمة الرئيسية للمؤلفات) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-right">
            <h2 className="text-xl sm:text-2xl font-bold font-arabic text-amber-950 dark:text-stone-100 flex items-center gap-2 justify-end">
              <span>المؤلفات المقررة في الامتحان الجهوي</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse inline-block" />
            </h2>
            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-400 font-arabic">
              اختر الرواية أو المسرحية للدخول إليها ومطالعتها بكامل مزايا الترجمة والاختبارات
            </p>
          </div>
        </div>

        {/* 3 Masterpieces Grid Cards with Bespoke Atmospheric Themes */}
        <div className="grid md:grid-cols-3 gap-6">
          {BOOKS.map((book) => {
            const isSelected = activeBookId === book.id;
            const lastPage = lastReadPages[book.id] || 1;
            const isAntigone = book.id === 'antigone';
            const isCondamne = book.id === 'le_dernier_jour_dun_condamne';
            const isBoite = book.id === 'la_boite_a_merveilles';

            // Distinctive visual assets per book
            const cardTheme = isBoite
              ? {
                  containerActive: 'bg-linear-to-br from-amber-950 via-[#22150e] to-amber-900 border-amber-500 ring-2 ring-amber-400/40 text-amber-50 shadow-amber-950/40',
                  containerIdle: 'bg-white dark:bg-[#16120f] hover:bg-amber-50/60 dark:hover:bg-[#1f1915] border-amber-200 dark:border-amber-950/80 hover:border-amber-400 dark:hover:border-amber-700 text-stone-900 dark:text-stone-100',
                  accentBadge: 'bg-amber-500/25 border-amber-400/40 text-amber-200',
                  genreTag: isSelected ? 'bg-amber-400/20 text-amber-200 border border-amber-400/30' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300',
                  titleColor: isSelected ? 'text-amber-300' : 'text-amber-900 dark:text-amber-400',
                  buttonStart: 'bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-amber-900/30',
                  icon: <Sparkles className="w-4 h-4 text-amber-300" />,
                  themeBadge: 'خشب الأرز وزليج فاس',
                }
              : isAntigone
              ? {
                  containerActive: 'bg-linear-to-br from-rose-950 via-[#1f0914] to-rose-900 border-rose-500 ring-2 ring-rose-400/40 text-rose-50 shadow-rose-950/40',
                  containerIdle: 'bg-white dark:bg-[#170a12] hover:bg-rose-50/60 dark:hover:bg-[#220f1b] border-rose-200 dark:border-rose-950/80 hover:border-rose-400 dark:hover:border-rose-700 text-stone-900 dark:text-stone-100',
                  accentBadge: 'bg-rose-500/25 border-rose-400/40 text-rose-200',
                  genreTag: isSelected ? 'bg-rose-400/20 text-rose-200 border border-rose-400/30' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300',
                  titleColor: isSelected ? 'text-rose-300' : 'text-rose-900 dark:text-rose-400',
                  buttonStart: 'bg-linear-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-rose-900/30',
                  icon: <Theater className="w-4 h-4 text-rose-300" />,
                  themeBadge: 'تراجيديا طيبة والمخمل الأرجواني',
                }
              : {
                  containerActive: 'bg-linear-to-br from-slate-950 via-[#0a1120] to-blue-950 border-blue-500 ring-2 ring-blue-400/40 text-blue-50 shadow-blue-950/40',
                  containerIdle: 'bg-white dark:bg-[#0c121d] hover:bg-slate-50/60 dark:hover:bg-[#141e30] border-slate-300 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 text-stone-900 dark:text-stone-100',
                  accentBadge: 'bg-blue-500/25 border-blue-400/40 text-blue-200',
                  genreTag: isSelected ? 'bg-blue-400/20 text-blue-200 border border-blue-400/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-blue-300',
                  titleColor: isSelected ? 'text-sky-300' : 'text-slate-800 dark:text-sky-400',
                  buttonStart: 'bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-blue-900/30',
                  icon: <Award className="w-4 h-4 text-sky-300" />,
                  themeBadge: 'مداد هيغو وحجر بيسيتر',
                };

            return (
              <div
                key={book.id}
                id={`book-card-${book.id}`}
                className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 shadow-xl border-2 transition-all flex flex-col justify-between ${
                  isSelected ? cardTheme.containerActive : cardTheme.containerIdle
                }`}
              >
                {/* Active Indicator Badge */}
                {isSelected && (
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-arabic font-bold shadow-xs flex items-center gap-1 z-10">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>المؤلف النشط حالياً</span>
                  </div>
                )}

                <div className="space-y-3.5 text-right">
                  {/* Era & Atmospheric Tagline */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                    <span className="text-[10px] font-serif opacity-75">
                      {book.year} · {book.totalPages} Pages
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-arabic font-bold flex items-center gap-1 ${cardTheme.genreTag}`}>
                      {cardTheme.icon}
                      <span>{cardTheme.themeBadge}</span>
                    </span>
                  </div>

                  {/* Title & Author */}
                  <div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider block mb-1 font-serif ${
                      isSelected ? 'text-stone-300' : 'text-stone-500 dark:text-stone-400'
                    }`}>
                      {book.genre}
                    </span>
                    <h3 className={`text-xl sm:text-2xl font-bold font-serif tracking-tight leading-tight ${
                      isSelected ? 'text-white' : 'text-stone-900 dark:text-stone-100'
                    }`}>
                      {book.titleFrench}
                    </h3>
                    <div className={`text-base sm:text-lg font-bold font-arabic mt-1 ${cardTheme.titleColor}`}>
                      {book.titleArabic} — {book.authorArabic}
                    </div>
                  </div>

                  {/* Famous Quote Preview */}
                  <div className={`p-2.5 rounded-xl border text-[11px] font-serif italic text-right ${
                    isSelected
                      ? 'bg-black/25 border-white/10 text-stone-200'
                      : 'bg-stone-50 dark:bg-stone-850/60 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300'
                  }`}>
                    <p className="line-clamp-2">{book.theme.quote.french}</p>
                    <span className="block mt-1 font-arabic text-[10px] opacity-80 not-italic">
                      {book.theme.quote.speaker}
                    </span>
                  </div>

                  {/* Description */}
                  <p className={`text-xs font-arabic leading-relaxed line-clamp-3 ${
                    isSelected ? 'text-stone-200/90' : 'text-stone-600 dark:text-stone-400'
                  }`}>
                    {book.descriptionArabic}
                  </p>
                </div>

                {/* Action Buttons inside Card */}
                <div className="pt-4 border-t border-white/10 dark:border-stone-800 mt-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      id={`view-chapters-btn-${book.id}`}
                      onClick={() => {
                        handleBookCardClick(book.id);
                        const el = document.getElementById('chapters-directory-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-arabic font-medium flex items-center justify-center gap-1 transition-all ${
                        isSelected
                          ? 'bg-white/10 hover:bg-white/20 text-white'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700'
                      }`}
                    >
                      <Compass className="w-3 h-3" />
                      <span>{isAntigone ? 'المشاهد (18)' : isCondamne ? 'الفصول (49)' : 'الفصول (12)'}</span>
                    </button>

                    <button
                      id={`quiz-btn-${book.id}`}
                      onClick={() => {
                        onSelectBook(book.id);
                        onOpenQuiz(book.id);
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-arabic font-medium flex items-center justify-center gap-1 transition-all ${
                        isSelected
                          ? 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-500/40'
                          : 'bg-emerald-100 dark:bg-emerald-950/70 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-300'
                      }`}
                    >
                      <HelpCircle className="w-3 h-3 text-emerald-300" />
                      <span>اختبار جهوي</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {lastPage > 1 && (
                      <button
                        id={`resume-reading-btn-${book.id}`}
                        onClick={() => {
                          onSelectBook(book.id);
                          onStartReading(book.id, lastPage);
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-arabic font-bold flex items-center justify-center gap-1 transition-all shadow-xs shrink-0 ${
                          isSelected
                            ? 'bg-white/20 hover:bg-white/30 text-white'
                            : 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-white'
                        }`}
                        title={`متابعة من ص ${lastPage}`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>ص {lastPage}</span>
                      </button>
                    )}

                    <button
                      id={`start-reading-btn-${book.id}`}
                      onClick={() => {
                        onSelectBook(book.id);
                        onStartReading(book.id, lastPage > 1 ? lastPage : 1);
                      }}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-arabic font-bold flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-[1.01] ${cardTheme.buttonStart}`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{lastPage > 1 ? 'متابعة القراءة' : 'بدء القراءة'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Highlights for 1st Bac */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 text-right">
        <div className="bg-gradient-to-br from-purple-900/40 via-indigo-950/30 to-amber-50/90 dark:to-stone-900/90 border-2 border-purple-500/50 rounded-2xl p-5 shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-full bg-purple-700/80 text-purple-100 text-[10px] font-bold">
              فابور 100% 🎙️
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-800 text-purple-100 flex items-center justify-center">
              <Headphones className="w-4 h-4 text-amber-300" />
            </div>
          </div>
          <h3 className="font-bold text-base font-arabic text-purple-950 dark:text-purple-200">صوت ElevenLabs البشري</h3>
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-arabic leading-relaxed">
            استمع للنصوص الفرنسية والشروح بأصوات بشرية فائقة النقاء (Rachel, Adam, Antoni) مع 10,000 حرف مجاناً كل شهر بلا بطاقة بنكية.
          </p>
        </div>

        <div className="bg-amber-50/90 dark:bg-stone-900/90 border border-amber-200/80 dark:border-stone-800 rounded-xl p-5 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-800 dark:bg-amber-700 text-amber-100 flex items-center justify-center ml-auto">
            <CheckCircle2 className="w-4 h-4 text-amber-200" />
          </div>
          <h3 className="font-bold text-base font-arabic text-amber-950 dark:text-stone-100">ترجمة سياقية ذاتية التحقق</h3>
          <p className="text-xs sm:text-sm text-amber-900/80 dark:text-stone-400 font-arabic leading-relaxed">
            حدد أي كلمة أو جملة أو فقرة من نص «علبة العجائب» أو مسرحية «أنتيجون» لتحصل فوراً على مقابل عربي سياقي تام مع تدقيق آلي معتمد.
          </p>
        </div>

        <div className="bg-amber-50/90 dark:bg-stone-900/90 border border-amber-200/80 dark:border-stone-800 rounded-xl p-5 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-800 dark:bg-amber-700 text-amber-100 flex items-center justify-center ml-auto">
            <BookOpen className="w-4 h-4 text-amber-200" />
          </div>
          <h3 className="font-bold text-base font-arabic text-amber-950 dark:text-stone-100">ملخصات فصحى لكل صفحة</h3>
          <p className="text-xs sm:text-sm text-amber-900/80 dark:text-stone-400 font-arabic leading-relaxed">
            شريط جانبي متزامن يرافق كل صفحة فرنسية، يقدم ملخصاً مكثفاً باللغة العربية الفصحى وجرد الشخصيات والأحداث المفتاحية.
          </p>
        </div>

        <div className="bg-amber-50/90 dark:bg-stone-900/90 border border-amber-200/80 dark:border-stone-800 rounded-xl p-5 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 dark:bg-emerald-700 text-emerald-100 flex items-center justify-center ml-auto">
            <Award className="w-4 h-4 text-emerald-200" />
          </div>
          <h3 className="font-bold text-base font-arabic text-emerald-950 dark:text-emerald-300">تحضير للامتحان الجهوي</h3>
          <p className="text-xs sm:text-sm text-emerald-900/80 dark:text-stone-400 font-arabic leading-relaxed">
            مولد اختبارات جهوية يحاكي أسئلة الفهم (Compréhension) والمحسنات البديعية (Figures de style) الخاصة بالمؤلفات.
          </p>
        </div>
      </section>

      {/* Vocabulary Review & Digital Flashcards Feature Banner */}
      <section className="relative overflow-hidden bg-linear-to-r from-emerald-950 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-800/60 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 text-right max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-600/60 text-emerald-200 text-xs font-arabic font-bold">
              <Layers className="w-3.5 h-3.5 text-emerald-300" />
              <span>ميزة جديدة: بنك المفردات وبطاقات المراجعة (Flashcards)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-arabic text-white leading-tight">
              احفظ المفردات المترجمة واختبر معلوماتك في المرادفات والمعاني
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-arabic leading-relaxed">
              كل كلمة تترجمها في الشريط الجانبي تُحفظ تلقائياً في بطاقات رقمية تفاعلية ثنائية الوجه، مع مرادفات فرنسية مباشرة (Synonymes) واختبارات دورية لقياس نسبة الإتقان والجاهزية للامتحان الجهوي.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => onOpenVocabReview?.('cards')}
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-amber-700 hover:bg-amber-600 text-white text-xs sm:text-sm font-arabic font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105"
            >
              <RotateCw className="w-4 h-4 text-amber-200" />
              <span>تصفح بطاقات المراجعة ({flashcardsCount})</span>
            </button>
            <button
              onClick={() => onOpenVocabReview?.('quiz')}
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-arabic font-bold flex items-center justify-center gap-2 border border-emerald-600 shadow-md transition-all hover:scale-105"
            >
              <Trophy className="w-4 h-4 text-emerald-300" />
              <span>بدء اختبار المرادفات السريع</span>
            </button>
          </div>
        </div>
      </section>

      {/* Chapters & Scenes Directory */}
      <section id="chapters-directory-section" className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-right">
            <h2 className="text-xl sm:text-2xl font-bold font-arabic text-amber-950 dark:text-stone-100">
              فهرس محتويات {directoryBook.titleArabic} ({directoryChapters.length} {directoryBook.id === 'antigone' ? 'مشهداً' : 'فصلاً'})
            </h2>
            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-400 font-arabic">
              انقر على أي {directoryBook.id === 'antigone' ? 'مشهد' : 'فصل'} للانتقال الفوري وقراءته وترجمته
            </p>
          </div>

          {/* Book Switcher Tabs for Directory */}
          <div className="flex items-center bg-amber-200/70 dark:bg-stone-800 p-1 rounded-xl border border-amber-300 dark:border-stone-700">
            {BOOKS.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setSelectedDirectoryBook(b.id);
                  onSelectBook(b.id);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-arabic font-bold transition-all ${
                  selectedDirectoryBook === b.id
                    ? 'bg-amber-900 dark:bg-amber-700 text-white shadow-xs'
                    : 'text-amber-950 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700'
                }`}
              >
                {b.titleArabic} ({b.id === 'antigone' ? '18 مشهداً' : '12 فصلاً'})
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {directoryChapters.map((ch) => (
            <div
              key={ch.chapter}
              onClick={() => {
                onSelectBook(selectedDirectoryBook);
                onOpenChapter(ch);
              }}
              className="group bg-white/85 dark:bg-stone-900/85 hover:bg-amber-100/60 dark:hover:bg-stone-800 border border-amber-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-stone-700 rounded-xl p-4.5 cursor-pointer transition-all duration-200 hover:shadow-md text-right space-y-2.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-serif font-bold text-amber-700 dark:text-amber-400 group-hover:text-amber-900 dark:group-hover:text-amber-300">
                    Pages {ch.startPage} - {ch.endPage}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-300 text-[11px] font-serif font-semibold border border-amber-200 dark:border-stone-700">
                    {ch.title}
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-amber-950 dark:text-stone-100 font-arabic group-hover:text-amber-800 dark:group-hover:text-amber-300 leading-snug">
                  {ch.titleArabic}
                </h3>

                <p className="text-xs text-amber-900/75 dark:text-stone-400 font-arabic line-clamp-3 mt-1 leading-relaxed">
                  {ch.mainThemeArabic}
                </p>
              </div>

              <div className="pt-2 border-t border-amber-200/50 dark:border-stone-800 flex items-center justify-between text-xs font-arabic text-amber-800 dark:text-amber-400 group-hover:text-amber-950 dark:group-hover:text-stone-200 font-medium">
                <ChevronLeft className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:-translate-x-1 transition-transform" />
                <span>قراءة هذا {directoryBook.id === 'antigone' ? 'المشهد' : 'الفصل'} (ص {ch.startPage})</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
