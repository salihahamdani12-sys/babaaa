import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, BookOpen, ChevronLeft, Star, Trash2, BookmarkCheck, 
  Sparkles, Calendar, ArrowRight, BookMarked, Compass, Layers, Award,
  Clock, MapPin, Users, Search, ListOrdered, CheckCircle2, ChevronDown,
  Languages
} from 'lucide-react';
import { BookInfo, BookmarkItem, ChapterMeta } from '../types';
import { getBookmarks, removeBookmark, subscribeToBookmarks } from '../data/bookmarkService';
import { getPassagesForChapter, getPassagesForBook, NOVEL_PASSAGES } from '../data/passagesService';
import { getChapterEvents, getChapterSummary, CHAPTER_EVENTS_DATA, ChapterEventItem } from '../data/chapterEventsData';

interface ChaptersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter: (chapter: ChapterMeta) => void;
  onSelectPage?: (page: number) => void;
  onOpenPassageSituation?: (chapterNumber?: number) => void;
  onOpenAnalytics?: () => void;
  currentPage: number;
  bookInfo: BookInfo;
  chapters: ChapterMeta[];
  initialTab?: 'chapters' | 'events' | 'bookmarks';
}

export const ChaptersDrawer: React.FC<ChaptersDrawerProps> = ({
  isOpen,
  onClose,
  onSelectChapter,
  onSelectPage,
  onOpenPassageSituation,
  onOpenAnalytics,
  currentPage,
  bookInfo,
  chapters,
  initialTab = 'chapters',
}) => {
  const [activeTab, setActiveTab] = useState<'chapters' | 'events' | 'bookmarks'>(initialTab);
  const [language, setLanguage] = useState<'ar' | 'fr'>('ar');
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [showAllBooks, setShowAllBooks] = useState(false);
  const [expandedChapterPassages, setExpandedChapterPassages] = useState<number | null>(null);
  const [eventsChapterFilter, setEventsChapterFilter] = useState<number | 'ALL'>('ALL');
  const [eventsSearchQuery, setEventsSearchQuery] = useState('');

  // Sync bookmarks
  useEffect(() => {
    if (isOpen) {
      setBookmarks(getBookmarks(showAllBooks ? undefined : bookInfo.id));
      setActiveTab(initialTab);
    }
  }, [isOpen, showAllBooks, bookInfo.id, initialTab]);

  useEffect(() => {
    const unsubscribe = subscribeToBookmarks(() => {
      setBookmarks(getBookmarks(showAllBooks ? undefined : bookInfo.id));
    });
    return unsubscribe;
  }, [showAllBooks, bookInfo.id]);

  const isAntigone = bookInfo.id === 'antigone';
  const currentBookBookmarks = bookmarks.filter((b) => b.bookId === bookInfo.id);

  // All events & passages data for this book
  const allBookEvents = useMemo(() => {
    const list = CHAPTER_EVENTS_DATA[bookInfo.id] || [];
    return list;
  }, [bookInfo.id]);

  const filteredEventsChapters = useMemo(() => {
    let list = allBookEvents;
    if (eventsChapterFilter !== 'ALL') {
      list = list.filter((ch) => ch.chapterNumber === eventsChapterFilter);
    }
    if (eventsSearchQuery.trim()) {
      const q = eventsSearchQuery.toLowerCase();
      list = list.map((ch) => ({
        ...ch,
        events: ch.events.filter(
          (ev) =>
            ev.title.toLowerCase().includes(q) ||
            ev.titleArabic.toLowerCase().includes(q) ||
            ev.arabicDescription.toLowerCase().includes(q) ||
            ev.frenchExcerpt.toLowerCase().includes(q) ||
            ev.characters.some((c) => c.toLowerCase().includes(q))
        ),
      })).filter((ch) => ch.events.length > 0);
    }
    return list;
  }, [allBookEvents, eventsChapterFilter, eventsSearchQuery]);

  if (!isOpen) return null;

  const handlePageClick = (pageNum: number) => {
    if (onSelectPage) {
      onSelectPage(pageNum);
    } else {
      const matched = chapters.find((ch) => pageNum >= ch.startPage && pageNum <= ch.endPage);
      if (matched) onSelectChapter(matched);
    }
    onClose();
  };

  const handleRemoveBookmark = (e: React.MouseEvent, pageNum: number, bookId: any) => {
    e.stopPropagation();
    removeBookmark(bookId, pageNum);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-amber-50 dark:bg-stone-900 rounded-3xl shadow-2xl border-2 border-amber-300 dark:border-stone-700 overflow-hidden flex flex-col max-h-[90vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-5 sm:px-6 py-3.5 bg-linear-to-r from-amber-900 via-amber-950 to-stone-900 text-amber-100 flex items-center justify-between border-b border-amber-800 gap-3">
          <div className="flex items-center gap-2.5 text-right">
            <div className="w-9 h-9 rounded-xl bg-amber-800 flex items-center justify-center text-amber-300 shadow-xs shrink-0">
              {activeTab === 'chapters' ? (
                <BookOpen className="w-5 h-5" />
              ) : activeTab === 'events' ? (
                <ListOrdered className="w-5 h-5" />
              ) : (
                <Star className="w-5 h-5 fill-amber-300" />
              )}
            </div>
            <div>
              <h3 className="font-arabic font-bold text-base text-amber-100 leading-tight">
                {activeTab === 'chapters'
                  ? isAntigone
                    ? `فهرس ومشاهد مسرحية أنتيجون (${chapters.length} مشهداً)`
                    : `فهرس فصول وملخصات الرواية (${chapters.length} فصلاً)`
                  : activeTab === 'events'
                  ? `أحداث ومقاطع كل فصل (Les Événements & Passages Clés)`
                  : `الصفحات المحفوظة والمميزة بالنجوم (${bookmarks.length})`}
              </h3>
              <p className="text-[11px] font-serif text-amber-300/80">
                {bookInfo.titleFrench} · {bookInfo.author}
              </p>
            </div>
          </div>

          {/* Right Header Action Controls: FR/AR right next to X button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Direct FR / AR Toggle right next to X */}
            <div className="flex items-center bg-black/80 p-0.5 sm:p-1 rounded-xl border border-amber-400/80 shadow-xs">
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                  language === 'fr'
                    ? 'bg-blue-600 text-white shadow-xs scale-102 ring-1 ring-white/60 font-serif'
                    : 'text-stone-300 hover:text-white font-serif'
                }`}
                title="Passer en Français"
              >
                <span>🇫🇷</span>
                <span>FR</span>
              </button>

              <button
                onClick={() => setLanguage('ar')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                  language === 'ar'
                    ? 'bg-emerald-600 text-white shadow-xs scale-102 ring-1 ring-white/60 font-arabic'
                    : 'text-stone-300 hover:text-white font-arabic'
                }`}
                title="التحويل للعربية"
              >
                <span>🇲🇦</span>
                <span>AR</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-amber-300 hover:text-white hover:bg-amber-800 transition-colors cursor-pointer bg-amber-950/60 border border-amber-700/60"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 🌟 HERO LANGUAGE SELECTOR BANNER - بارز جداً ومستقل للتبديل اللغوي الفوري */}
        <div className="bg-linear-to-r from-amber-100 via-amber-200 to-amber-100 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 px-4 sm:px-6 py-2.5 border-b-2 border-amber-300 dark:border-stone-700 flex flex-wrap items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2.5 text-right">
            <div className="w-8 h-8 rounded-xl bg-amber-900 text-amber-200 flex items-center justify-center font-bold text-base shadow-xs">
              🌐
            </div>
            <div>
              <span className="text-xs font-black text-amber-950 dark:text-amber-100 font-arabic block leading-tight">
                لغة عرض الملخصات والأحداث (Langue d&apos;affichage) :
              </span>
              <span className="text-[11px] text-amber-900/80 dark:text-stone-300 font-arabic">
                اضغط لاختيار الفرنسية 🇫🇷 أو العربية 🇲🇦 لجميع الفصول والأحداث
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-stone-900 dark:bg-black rounded-2xl border-2 border-amber-400 shadow-md">
            <button
              onClick={() => setLanguage('fr')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                language === 'fr'
                  ? 'bg-linear-to-r from-indigo-600 to-blue-600 text-white shadow-lg scale-105 ring-2 ring-white/70 font-serif'
                  : 'text-stone-300 hover:text-white font-serif'
              }`}
            >
              <span className="text-base">🇫🇷</span>
              <span>Français (FR)</span>
              {language === 'fr' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-200" />}
            </button>

            <button
              onClick={() => setLanguage('ar')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                language === 'ar'
                  ? 'bg-linear-to-r from-amber-600 to-emerald-600 text-white shadow-lg scale-105 ring-2 ring-white/70 font-arabic'
                  : 'text-stone-300 hover:text-white font-arabic'
              }`}
            >
              <span className="text-base">🇲🇦</span>
              <span>العربية (ARB)</span>
              {language === 'ar' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-200" />}
            </button>
          </div>
        </div>

        {/* Tab Switcher Navigation */}
        <div className="px-4 py-2 bg-amber-50 dark:bg-stone-850 border-b border-amber-200 dark:border-stone-750 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 p-1 bg-amber-200/60 dark:bg-stone-800 rounded-xl w-full sm:w-auto">
            {/* Tab 1: Chapters */}
            <button
              onClick={() => setActiveTab('chapters')}
              className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-arabic font-bold transition-all cursor-pointer flex-1 sm:flex-initial ${
                activeTab === 'chapters'
                  ? 'bg-amber-900 text-amber-100 shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isAntigone ? 'المشاهد والملخصات' : 'الفصول والملخصات'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-800/80 text-amber-200 font-mono">
                {chapters.length}
              </span>
            </button>

            {/* Tab 2: Passages & Events */}
            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-arabic font-bold transition-all cursor-pointer flex-1 sm:flex-initial ${
                activeTab === 'events'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-300'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5 text-emerald-300" />
              <span>الأحداث والمقاطع 📜</span>
            </button>

            {/* Tab 3: Bookmarks */}
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-arabic font-bold transition-all cursor-pointer flex-1 sm:flex-initial ${
                activeTab === 'bookmarks'
                  ? 'bg-amber-500 text-amber-950 font-extrabold shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>المحفوظات</span>
              {currentBookBookmarks.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-900 text-amber-100 font-mono font-bold">
                  {currentBookBookmarks.length}
                </span>
              )}
            </button>
          </div>

          {/* Right Action Tools: Exam Button & Bookmarks filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Exam Situation du passage button */}
            {onOpenPassageSituation && (
              <button
                onClick={() => {
                  onOpenPassageSituation();
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold font-arabic flex items-center gap-1.5 shadow-xs cursor-pointer mr-auto sm:mr-0"
              >
                <Compass className="w-3.5 h-3.5 text-amber-300" />
                <span>امتحان وتأطير المقاطع 🎯</span>
              </button>
            )}

            {activeTab === 'bookmarks' && (
              <button
                onClick={() => setShowAllBooks(!showAllBooks)}
                className="text-[11px] font-arabic text-amber-900 dark:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>{showAllBooks ? 'عرض هذا المؤلف فقط' : 'عرض جميع المؤلفات'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 grow">
          {activeTab === 'chapters' ? (
            /* Tab 1: Chapters List with Collapsible Events & Passages */
            chapters.map((ch) => {
              const isCurrent = currentPage >= ch.startPage && currentPage <= ch.endPage;
              const chapterPassages = getPassagesForChapter(bookInfo.id, ch.chapter);
              const chapterEvents = getChapterEvents(bookInfo.id, ch.chapter);
              const summaryData = getChapterSummary(bookInfo.id, ch.chapter);
              const isExpanded = expandedChapterPassages === ch.chapter;

              const chapterTitle = language === 'fr'
                ? (summaryData?.chapterTitle || ch.title)
                : (summaryData?.chapterTitleArabic || ch.titleArabic);

              const chapterSummary = language === 'fr'
                ? (summaryData?.globalSummaryFrench || ch.title)
                : (summaryData?.globalSummaryArabic || ch.mainThemeArabic);

              return (
                <div
                  key={ch.chapter}
                  className={`p-4 rounded-2xl border text-right transition-all space-y-3 ${
                    isCurrent
                      ? 'bg-amber-100/90 dark:bg-stone-800 border-amber-500 dark:border-amber-400 ring-2 ring-amber-400/50 shadow-xs'
                      : 'bg-white dark:bg-stone-850 border-amber-200 dark:border-stone-700 text-stone-900 dark:text-stone-100'
                  }`}
                >
                  {/* Top Bar: Chapter Title & Page Navigation */}
                  <div
                    onClick={() => {
                      setExpandedChapterPassages(isExpanded ? null : ch.chapter);
                    }}
                    className="flex items-center justify-between gap-4 cursor-pointer hover:opacity-95"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      <ChevronDown className={`w-5 h-5 text-amber-700 dark:text-amber-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectChapter(ch);
                          onClose();
                        }}
                        className="text-xs font-serif font-bold text-amber-800 dark:text-amber-400 bg-amber-100 hover:bg-amber-200 dark:bg-stone-700 dark:hover:bg-stone-650 px-2.5 py-1 rounded-md border border-amber-200 dark:border-stone-600 transition-colors flex items-center gap-1 cursor-pointer"
                        title="الانتقال وقراءة هذا الفصل في الرواية"
                      >
                        <span>Pages {ch.startPage} - {ch.endPage}</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-0.5 text-right">
                      <h4 className={`font-bold text-sm sm:text-base text-amber-950 dark:text-stone-100 ${language === 'fr' ? 'font-serif text-left dir-ltr' : 'font-arabic'}`}>
                        {chapterTitle}
                      </h4>
                      {language === 'ar' && ch.title && (
                        <span className="text-[11px] font-serif font-semibold text-amber-800 dark:text-amber-400 block">
                          ({ch.title})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Chapter Summary Box (ملخص الفصل في واجهة القائمة) */}
                  <div
                    onClick={() => setExpandedChapterPassages(isExpanded ? null : ch.chapter)}
                    className="bg-amber-50/90 dark:bg-stone-800/90 p-3.5 rounded-xl border border-amber-200/80 dark:border-stone-700 text-xs leading-relaxed space-y-1.5 cursor-pointer shadow-2xs hover:bg-amber-100/50 dark:hover:bg-stone-800 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 dark:text-amber-300">
                      <span className="flex items-center gap-1.5 font-arabic">
                        <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                        <span>{language === 'fr' ? 'Résumé & Trame du chapitre :' : 'ملخص ومجريات الفصل :'}</span>
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 bg-amber-100/70 dark:bg-stone-700 px-2 py-0.5 rounded">
                        {language === 'fr' ? `Pages ${ch.startPage}-${ch.endPage}` : `ص ${ch.startPage} - ${ch.endPage}`}
                      </span>
                    </div>
                    <p className={`${language === 'fr' ? 'text-left dir-ltr font-serif' : 'text-right dir-rtl font-arabic'} text-stone-800 dark:text-stone-200`}>
                      {chapterSummary}
                    </p>
                  </div>

                  {/* Chapter Key Passages & Events Accordion Trigger */}
                  <div className="pt-2 border-t border-amber-200/60 dark:border-stone-750 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedChapterPassages(isExpanded ? null : ch.chapter);
                      }}
                      className="text-amber-900 dark:text-amber-300 hover:underline font-bold flex items-center gap-1.5 cursor-pointer bg-amber-100/60 dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-stone-700 font-arabic"
                    >
                      <ListOrdered className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                      <span>
                        {isExpanded
                          ? (language === 'fr' ? 'Masquer les événements & passages' : 'إخفاء أحداث ومقاطع هذا الفصل')
                          : (language === 'fr'
                              ? `Afficher les événements & passages (${chapterEvents.length || chapterPassages.length} événements) 🔎`
                              : `عرض الأحداث والمقاطع الأساسية لهذا الفصل (${chapterEvents.length || chapterPassages.length} أحداث) 🔎`)}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectChapter(ch);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[11px] font-arabic flex items-center gap-1 cursor-pointer"
                      >
                        <BookOpen className="w-3 h-3 text-emerald-300" />
                        <span>{language === 'fr' ? 'Lire le chapitre' : 'قراءة الفصل بالرواية'}</span>
                      </button>

                      {onOpenPassageSituation && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenPassageSituation(ch.chapter);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold text-[11px] font-arabic flex items-center gap-1 cursor-pointer"
                        >
                          <Award className="w-3 h-3 text-amber-300" />
                          <span>{language === 'fr' ? 'Examen de passage 🎯' : 'امتحان وتأطير هذا الفصل 🎯'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Events & Passages Detailed Timeline (ينسدل من تحته الفصول والأحداث) */}
                  {isExpanded && (
                    <div className="pt-2 space-y-3 animate-in fade-in duration-150">
                      {/* Chronological Events */}
                      {chapterEvents.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-xs font-bold font-arabic text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>{language === 'fr' ? 'Événements chronologiques du chapitre :' : 'الأحداث الأساسية بالتسلسل الزمني:'}</span>
                          </h5>
                          {chapterEvents.map((ev) => {
                            const evTitle = language === 'fr' ? ev.title : ev.titleArabic;
                            const evDesc = language === 'fr' ? (ev.frenchExcerpt || ev.title) : ev.arabicDescription;

                            return (
                              <div
                                key={ev.id}
                                className={`p-3 rounded-xl border text-xs space-y-1.5 transition-colors ${
                                  ev.isKeyTurningPoint
                                    ? 'bg-amber-100/70 dark:bg-amber-950/30 border-amber-400/80 dark:border-amber-700/80'
                                    : 'bg-amber-50/70 dark:bg-stone-900/80 border-amber-200 dark:border-stone-750'
                                }`}
                              >
                                <div className="flex items-center justify-between font-bold">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`text-amber-950 dark:text-amber-200 ${language === 'fr' ? 'font-serif text-left dir-ltr' : 'font-arabic'}`}>
                                      {evTitle}
                                    </span>
                                    {ev.isKeyTurningPoint && (
                                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-600 text-white font-arabic">
                                        {language === 'fr' ? 'Tournant clé ⚡' : 'حدث مفصلي ⚡'}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10.5px] font-mono text-stone-500 bg-stone-200/60 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                                    {language === 'fr' ? `p. ${ev.pageNumber}` : `ص ${ev.pageNumber}`}
                                  </span>
                                </div>

                                <p className={`text-stone-800 dark:text-stone-200 leading-relaxed ${language === 'fr' ? 'font-serif text-left dir-ltr' : 'font-arabic text-right'}`}>
                                  {evDesc}
                                </p>

                                {language === 'ar' && ev.frenchExcerpt && (
                                  <p className="font-serif italic text-stone-600 dark:text-stone-400 text-left line-clamp-2 text-[11px] bg-white/60 dark:bg-stone-950/60 p-1.5 rounded border border-amber-100 dark:border-stone-800 dir-ltr">
                                    « {ev.frenchExcerpt} »
                                  </p>
                                )}

                                <div className="flex flex-wrap items-center justify-between pt-1 gap-2 text-[11px]">
                                  <div className="flex items-center gap-3 text-stone-500 text-[10.5px]">
                                    {ev.characters.length > 0 && (
                                      <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3 text-amber-600" />
                                        {ev.characters.join(', ')}
                                      </span>
                                    )}
                                    {ev.location && (
                                      <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-stone-500" />
                                        {ev.location}
                                      </span>
                                    )}
                                  </div>

                                  <button
                                    onClick={() => handlePageClick(ev.pageNumber)}
                                    className="text-emerald-800 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer font-arabic"
                                  >
                                    <span>{language === 'fr' ? 'Accéder à la page' : 'انتقل لصفحة الحدث بالرواية'}</span>
                                    <span>←</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Exam Key Passages for this chapter */}
                      {chapterPassages.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-amber-200/50 dark:border-stone-750">
                          <h5 className="text-xs font-bold font-arabic text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-amber-600" />
                            <span>{language === 'fr' ? 'Passages clés pour l\'examen régional :' : 'المقاطع المؤطرة الخاصة بالامتحان الجهوي:'}</span>
                          </h5>
                          {chapterPassages.map((psg) => (
                            <div
                              key={psg.id}
                              className="p-3 rounded-xl bg-amber-50/90 dark:bg-stone-900/90 border border-amber-300 dark:border-stone-700 text-xs space-y-2"
                            >
                              <div className="flex items-center justify-between font-bold">
                                <span className={`text-amber-950 dark:text-amber-200 ${language === 'fr' ? 'font-serif text-left dir-ltr' : 'font-arabic'}`}>
                                  📌 {language === 'fr' ? `Passage page ${psg.pageNumber}` : psg.titleArabic}
                                </span>
                                <span className="text-[10.5px] font-mono text-stone-500">
                                  {language === 'fr' ? `p. ${psg.pageNumber}` : `ص ${psg.pageNumber}`}
                                </span>
                              </div>

                              <p className="font-serif italic text-stone-700 dark:text-stone-300 line-clamp-2 text-left dir-ltr">
                                « {psg.frenchExcerpt} »
                              </p>

                              {language === 'ar' && (
                                <p className="text-[11px] text-stone-600 dark:text-stone-400 font-arabic text-right">
                                  <strong className="text-amber-900 dark:text-amber-300">الترجمة: </strong>
                                  {psg.arabicTranslation}
                                </p>
                              )}

                              <div className="p-2 rounded-lg bg-amber-100/50 dark:bg-stone-800/80 text-[11px] space-y-1 text-right font-arabic">
                                <div className="text-amber-950 dark:text-stone-200">
                                  <strong>⬅️ {language === 'fr' ? 'Ce qui précède :' : 'الحدث السابق: '}</strong>{language === 'fr' ? psg.whatPrecededArabic : psg.whatPrecededArabic}
                                </div>
                                <div className="text-amber-950 dark:text-stone-200">
                                  <strong>➡️ {language === 'fr' ? 'Ce qui suit :' : 'الحدث اللاحق: '}</strong>{language === 'fr' ? psg.whatFollowsArabic : psg.whatFollowsArabic}
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-1 text-[11px]">
                                <button
                                  onClick={() => handlePageClick(psg.pageNumber)}
                                  className="text-emerald-800 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer font-arabic"
                                >
                                  <span>{language === 'fr' ? 'Accéder au passage' : 'انتقل للمقطع بالرواية'}</span>
                                  <span>←</span>
                                </button>

                                {onOpenPassageSituation && (
                                  <button
                                    onClick={() => {
                                      onOpenPassageSituation(ch.chapter);
                                      onClose();
                                    }}
                                    className="text-amber-800 dark:text-amber-400 font-bold hover:underline cursor-pointer font-arabic"
                                  >
                                    {language === 'fr' ? 'Examen de passage 🎯' : 'اختبار وتأطير في هذا المقطع 🎯'}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : activeTab === 'events' ? (
            /* Tab 2: Full Events & Passages Guide (Without Quiz) */
            <div className="space-y-4 text-right">
              {/* Filter and Search Bar */}
              <div className="p-3 bg-white dark:bg-stone-850 rounded-2xl border border-amber-200 dark:border-stone-700 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-arabic text-amber-950 dark:text-stone-200 flex items-center gap-1.5">
                    <ListOrdered className="w-4 h-4 text-emerald-600" />
                    <span>دليل أحداث ومقاطع الرواية كاملة بالتفصيل</span>
                  </span>
                  <span className="text-[11px] text-stone-500 font-arabic">
                    قراءة واستيعاب مباشر بدون اختبار
                  </span>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={eventsSearchQuery}
                    onChange={(e) => setEventsSearchQuery(e.target.value)}
                    placeholder="ابحث في الأحداث أو الشخصيات أو المقاطع..."
                    className="w-full pr-9 pl-3 py-1.5 text-xs rounded-xl bg-amber-50/60 dark:bg-stone-900 border border-amber-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-arabic focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  />
                  {eventsSearchQuery && (
                    <button
                      onClick={() => setEventsSearchQuery('')}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Chapter Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-arabic">
                  <button
                    onClick={() => setEventsChapterFilter('ALL')}
                    className={`px-3 py-1 rounded-lg shrink-0 transition-all font-bold ${
                      eventsChapterFilter === 'ALL'
                        ? 'bg-amber-900 text-white'
                        : 'bg-amber-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-200'
                    }`}
                  >
                    جميع الفصول
                  </button>
                  {allBookEvents.map((ch) => (
                    <button
                      key={ch.chapterNumber}
                      onClick={() => setEventsChapterFilter(ch.chapterNumber)}
                      className={`px-2.5 py-1 rounded-lg shrink-0 transition-all font-bold text-[11px] ${
                        eventsChapterFilter === ch.chapterNumber
                          ? 'bg-emerald-800 text-white'
                          : 'bg-amber-100/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-200'
                      }`}
                    >
                      {isAntigone ? `المشهد ${ch.chapterNumber}` : `الفصل ${ch.chapterNumber}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Events & Passages Chapters Stream */}
              {filteredEventsChapters.length === 0 ? (
                <div className="py-12 text-center text-stone-500 text-xs font-arabic">
                  لا توجد نتائج مطابقة لبحثك
                </div>
              ) : (
                filteredEventsChapters.map((ch) => (
                  <div
                    key={ch.chapterNumber}
                    className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-700 space-y-3.5 shadow-xs"
                  >
                    {/* Chapter Header Summary */}
                    <div className="flex items-start justify-between gap-3 border-b border-amber-100 dark:border-stone-750 pb-3">
                      <button
                        onClick={() => handlePageClick(ch.startPage)}
                        className="text-xs font-serif font-bold text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-stone-750 px-2.5 py-1 rounded-md border border-amber-200 dark:border-stone-600 hover:bg-amber-200 cursor-pointer shrink-0"
                      >
                        Pages {ch.startPage} - {ch.endPage}
                      </button>
                      <div className="space-y-1 text-right">
                        <h4 className={`font-bold text-sm sm:text-base text-amber-950 dark:text-stone-100 ${language === 'fr' ? 'font-serif text-left dir-ltr' : 'font-arabic'}`}>
                          {language === 'fr' ? ch.chapterTitle : ch.chapterTitleArabic}
                        </h4>
                        <p className={`text-xs text-stone-600 dark:text-stone-300 leading-relaxed ${language === 'fr' ? 'font-serif text-left dir-ltr' : 'font-arabic'}`}>
                          {language === 'fr' ? ch.globalSummaryFrench : ch.globalSummaryArabic}
                        </p>
                      </div>
                    </div>

                    {/* Events List in Chapter */}
                    <div className="space-y-2.5">
                      {ch.events.map((ev) => (
                        <div
                          key={ev.id}
                          className={`p-3 rounded-xl border text-xs space-y-2 ${
                            ev.isKeyTurningPoint
                              ? 'bg-amber-50/90 dark:bg-stone-900 border-amber-300 dark:border-amber-800/80 ring-1 ring-amber-300/40'
                              : 'bg-stone-50/70 dark:bg-stone-900/60 border-amber-100 dark:border-stone-800'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <div className="flex items-center gap-2">
                              <span className={`text-amber-950 dark:text-amber-200 text-xs sm:text-sm ${language === 'fr' ? 'font-serif text-left dir-ltr' : 'font-arabic'}`}>
                                {language === 'fr' ? ev.title : ev.titleArabic}
                              </span>
                              {ev.isKeyTurningPoint && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-600 text-white font-arabic font-normal">
                                  {language === 'fr' ? 'Tournant clé ⚡' : 'حدث رئيسي ⚡'}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-mono text-stone-500 bg-white dark:bg-stone-800 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                              {language === 'fr' ? `p. ${ev.pageNumber}` : `ص ${ev.pageNumber}`}
                            </span>
                          </div>

                          <p className={`text-stone-800 dark:text-stone-200 leading-relaxed text-xs ${language === 'fr' ? 'font-serif text-left dir-ltr' : 'font-arabic text-right'}`}>
                            {language === 'fr' ? (ev.frenchExcerpt || ev.title) : ev.arabicDescription}
                          </p>

                          {language === 'ar' && ev.frenchExcerpt && (
                            <p className="font-serif italic text-stone-700 dark:text-stone-300 text-left text-[11px] bg-white dark:bg-stone-950 p-2 rounded-lg border border-stone-200 dark:border-stone-800 dir-ltr">
                              « {ev.frenchExcerpt} »
                            </p>
                          )}

                          <div className="flex flex-wrap items-center justify-between pt-1 gap-2 text-[11px]">
                            <div className="flex items-center gap-3 text-stone-500 text-[10.5px]">
                              {ev.characters.length > 0 && (
                                <span className="flex items-center gap-1 font-arabic">
                                  <Users className="w-3 h-3 text-amber-600" />
                                  {ev.characters.join(', ')}
                                </span>
                              )}
                              {ev.location && (
                                <span className="flex items-center gap-1 font-arabic">
                                  <MapPin className="w-3 h-3 text-stone-500" />
                                  {ev.location}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => handlePageClick(ev.pageNumber)}
                              className="text-emerald-800 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer font-arabic"
                            >
                              <span>انتقل لقراءة الحدث في الرواية (ص {ev.pageNumber})</span>
                              <span>←</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Tab 3: Bookmarked Pages */
            bookmarks.length === 0 ? (
              <div className="py-12 px-4 text-center space-y-3 font-arabic">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-stone-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-2xs">
                  <Star className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-stone-800 dark:text-stone-100 text-base">
                  لا توجد صفحات محفوظة بعد
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
                  يمكنك حفظ وتمييز أي صفحة للرجوع إليها لاحقاً بالضغط على زر النجمة ⭐ أعلى القارئ أو من شريط أدوات الصفحة.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookmarks.map((bm) => {
                  const isCurrent = currentPage === bm.pageNumber && bookInfo.id === bm.bookId;
                  const formattedDate = new Date(bm.createdAt).toLocaleDateString('ar-MA', {
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <div
                      key={`${bm.bookId}-page-${bm.pageNumber}`}
                      onClick={() => handlePageClick(bm.pageNumber)}
                      className={`p-4 rounded-xl border text-right cursor-pointer transition-all space-y-2.5 ${
                        isCurrent
                          ? 'bg-amber-100/90 dark:bg-stone-800 border-amber-500 dark:border-amber-400 ring-2 ring-amber-400/50 shadow-xs'
                          : 'bg-white dark:bg-stone-850 hover:bg-amber-50/80 dark:hover:bg-stone-800 border-amber-200 dark:border-stone-700 text-stone-900 dark:text-stone-100'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-amber-100 dark:border-stone-750 pb-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleRemoveBookmark(e, bm.pageNumber, bm.bookId)}
                            className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                            title="إلغاء حفظ الصفحة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[10px] text-stone-400 dark:text-stone-500 font-arabic flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formattedDate}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {bm.chapterTitleArabic && (
                            <span className="text-xs font-arabic text-amber-900 dark:text-amber-300 font-semibold">
                              {bm.chapterTitleArabic}
                            </span>
                          )}
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-amber-950 font-serif font-bold text-xs flex items-center gap-1 shadow-2xs">
                            <Star className="w-3 h-3 fill-amber-950" />
                            Page {bm.pageNumber}
                          </span>
                        </div>
                      </div>

                      {/* Snippet / Summary */}
                      {bm.arabicSummary && (
                        <p className="text-xs font-arabic text-stone-700 dark:text-stone-300 line-clamp-2 leading-relaxed">
                          {bm.arabicSummary}
                        </p>
                      )}

                      {bm.snippet && (
                        <p className="text-[11px] font-serif italic text-stone-600 dark:text-stone-400 line-clamp-1 bg-amber-50/60 dark:bg-stone-900 p-1.5 rounded-lg border border-amber-100 dark:border-stone-800">
                          « {bm.snippet} »
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[11px] text-amber-800 dark:text-amber-400 font-arabic font-medium">
                        <span className="flex items-center gap-1 hover:underline">
                          انقر للانتقال للصفحة
                          <ArrowRight className="w-3 h-3 rotate-180" />
                        </span>
                        {bm.bookId !== bookInfo.id && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                            {bm.bookId === 'antigone' ? 'Antigone' : bm.bookId === 'le_dernier_jour_dun_condamne' ? 'Le Dernier Jour' : 'La Boîte à Merveilles'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
