import React, { useState, useEffect, useMemo } from 'react';
import {
  X, BookOpen, Sparkles, CheckCircle2, AlertCircle, HelpCircle,
  ArrowRight, ArrowLeft, RotateCcw, Volume2, Trophy, Eye, Check,
  BookMarked, Compass, Filter, Share2, Layers, Award, Clock, MapPin,
  Users, ListOrdered, Search, BookmarkCheck, ChevronDown
} from 'lucide-react';
import { BookId, BookInfo } from '../types';
import {
  NovelPassage,
  NOVEL_PASSAGES,
  getPassagesForBook,
  getPassageById,
  PassageQuizQuestion
} from '../data/passagesService';
import { CHAPTER_EVENTS_DATA, ChapterEventItem } from '../data/chapterEventsData';

interface PassageSituationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBook: BookInfo;
  initialPassageId?: string;
  initialChapterNumber?: number;
  initialTab?: 'test' | 'explore';
  onJumpToPage?: (pageNumber: number) => void;
}

export const PassageSituationModal: React.FC<PassageSituationModalProps> = ({
  isOpen,
  onClose,
  activeBook,
  initialPassageId,
  initialChapterNumber,
  initialTab = 'explore',
  onJumpToPage,
}) => {
  const [selectedBookId, setSelectedBookId] = useState<BookId>(activeBook.id);
  const [activeTab, setActiveTab] = useState<'test' | 'explore'>(initialTab);
  const [currentPassageIndex, setCurrentPassageIndex] = useState<number>(0);
  const [selectedChapterFilter, setSelectedChapterFilter] = useState<number | 'ALL'>(
    initialChapterNumber || 'ALL'
  );
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Quiz interactive state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showModelSituation, setShowModelSituation] = useState<boolean>(false);
  const [copiedSituation, setCopiedSituation] = useState<boolean>(false);

  // Filtered passages list
  const availablePassages = useMemo(() => {
    const bookPassages = getPassagesForBook(selectedBookId);
    if (selectedChapterFilter === 'ALL') {
      return bookPassages;
    }
    return bookPassages.filter((p) => p.chapterNumber === selectedChapterFilter);
  }, [selectedBookId, selectedChapterFilter]);

  // Chapter events list
  const allChapterSummaries = useMemo(() => {
    const list = CHAPTER_EVENTS_DATA[selectedBookId] || [];
    if (selectedChapterFilter === 'ALL') {
      return list;
    }
    return list.filter((ch) => ch.chapterNumber === selectedChapterFilter);
  }, [selectedBookId, selectedChapterFilter]);

  // Sync initial selection
  useEffect(() => {
    if (isOpen) {
      setSelectedBookId(activeBook.id);
      setActiveTab(initialTab);
      if (initialPassageId) {
        const foundIdx = availablePassages.findIndex((p) => p.id === initialPassageId);
        if (foundIdx !== -1) setCurrentPassageIndex(foundIdx);
      } else if (initialChapterNumber) {
        setSelectedChapterFilter(initialChapterNumber);
        setCurrentPassageIndex(0);
      }
      resetQuizState();
    }
  }, [isOpen, activeBook.id, initialPassageId, initialChapterNumber, initialTab]);

  const currentPassage = availablePassages[currentPassageIndex] || availablePassages[0] || NOVEL_PASSAGES[0];
  const currentQuestions = currentPassage.questions || [];
  const currentQuestion = currentQuestions[currentQuestionIndex] || currentQuestions[0];

  const resetQuizState = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setShowModelSituation(false);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setShowModelSituation(true);
    }
  };

  const handleNextPassage = () => {
    if (currentPassageIndex < availablePassages.length - 1) {
      setCurrentPassageIndex((prev) => prev + 1);
    } else {
      setCurrentPassageIndex(0);
    }
    resetQuizState();
  };

  const handlePrevPassage = () => {
    if (currentPassageIndex > 0) {
      setCurrentPassageIndex((prev) => prev - 1);
    } else {
      setCurrentPassageIndex(availablePassages.length - 1);
    }
    resetQuizState();
  };

  const handleCopyModelSituation = () => {
    const textToCopy = `${currentPassage.regionalExamModelSituationFrench}\n\n${currentPassage.regionalExamModelSituationArabic}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSituation(true);
    setTimeout(() => setCopiedSituation(false), 2000);
  };

  const handleSpeakFrench = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) return null;

  const isAntigone = selectedBookId === 'antigone';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-stone-50 dark:bg-stone-900 rounded-3xl shadow-2xl border-2 border-amber-300 dark:border-stone-700 overflow-hidden flex flex-col max-h-[92vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-linear-to-r from-amber-900 via-amber-950 to-stone-900 text-amber-100 flex items-center justify-between border-b border-amber-800">
          <div className="flex items-center gap-3 text-right">
            <div className="w-10 h-10 rounded-xl bg-amber-800/90 border border-amber-600 flex items-center justify-center text-amber-300 shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  النقاط والمقاطع الأساسية (Les Points Importants & Passages Clés)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-mono text-[10.5px] font-bold">
                  سؤال تأطير النص 🎯
                </span>
              </div>
              <p className="text-xs text-amber-200/80 font-serif">
                الأحداث والنقاط الأساسية لكل فصل مع التدريب على معرفة ما قبله وما بعده
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-amber-950 hover:bg-rose-900 text-amber-200 hover:text-white transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CONTROLS & TABS STRIP */}
        <div className="flex flex-wrap items-center justify-between border-b border-stone-200 dark:border-stone-800 bg-amber-50/70 dark:bg-stone-850 px-4 py-2.5 gap-2 text-xs font-bold shrink-0">
          {/* Main Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-amber-200/50 dark:bg-stone-800 rounded-xl">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5 text-emerald-300" />
              <span>دليل النقاطع والأحداث (Les Points Importants) 📜</span>
            </button>

            <button
              onClick={() => setActiveTab('test')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'test'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>اختبار وتأطير المقطع (Mode Test) 🎯</span>
            </button>
          </div>

          {/* Book Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-bold">المؤلف:</span>
            <select
              value={selectedBookId}
              onChange={(e) => {
                setSelectedBookId(e.target.value as BookId);
                setSelectedChapterFilter('ALL');
                setCurrentPassageIndex(0);
                resetQuizState();
              }}
              className="bg-white dark:bg-stone-800 border border-amber-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl px-2.5 py-1 text-xs font-bold cursor-pointer"
            >
              <option value="la_boite_a_merveilles">علبة العجائب (La Boîte à Merveilles)</option>
              <option value="antigone">أنتيجون (Antigone)</option>
              <option value="le_dernier_jour_dun_condamne">آخر يوم لمحكوم (Le Dernier Jour)</option>
            </select>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 grow text-stone-800 dark:text-stone-100">
          {/* ========================================================================= */}
          {/* TAB 1: EXPLORE ALL IMPORTANT POINTS & PASSAGES (Points Importants)         */}
          {/* ========================================================================= */}
          {activeTab === 'explore' && (
            <div className="space-y-4 text-right">
              {/* Chapter Filter Pill Bar */}
              <div className="p-3 bg-white dark:bg-stone-850 rounded-2xl border border-amber-200 dark:border-stone-700 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 dark:text-amber-300 font-arabic flex items-center gap-1.5">
                    <ListOrdered className="w-4 h-4 text-emerald-600" />
                    <span>النقاط الأساسية لكل فصل (مرقمة ومرتبة للمراجعة المباشرة)</span>
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono font-bold">
                    {CHAPTER_EVENTS_DATA[selectedBookId]?.length || 0} فصول / مشاهد
                  </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-arabic">
                  <button
                    onClick={() => setSelectedChapterFilter('ALL')}
                    className={`px-3 py-1 rounded-lg shrink-0 transition-all font-bold ${
                      selectedChapterFilter === 'ALL'
                        ? 'bg-amber-900 text-white'
                        : 'bg-amber-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-200'
                    }`}
                  >
                    جميع الفصول
                  </button>
                  {CHAPTER_EVENTS_DATA[selectedBookId]?.map((ch) => (
                    <button
                      key={ch.chapterNumber}
                      onClick={() => setSelectedChapterFilter(ch.chapterNumber)}
                      className={`px-2.5 py-1 rounded-lg shrink-0 transition-all font-bold text-[11px] ${
                        selectedChapterFilter === ch.chapterNumber
                          ? 'bg-emerald-800 text-white'
                          : 'bg-amber-100/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-200'
                      }`}
                    >
                      {isAntigone ? `المشهد ${ch.chapterNumber}` : `الفصل ${ch.chapterNumber}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chapter Stream */}
              <div className="space-y-4">
                {allChapterSummaries.map((ch) => (
                  <div
                    key={ch.chapterNumber}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-850 border-2 border-amber-200 dark:border-stone-700 shadow-xs space-y-3.5"
                  >
                    {/* Chapter Header */}
                    <div className="flex items-start justify-between gap-3 border-b border-amber-100 dark:border-stone-750 pb-3">
                      {onJumpToPage && (
                        <button
                          onClick={() => {
                            onJumpToPage(ch.startPage);
                            onClose();
                          }}
                          className="text-xs font-serif font-bold text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-stone-750 px-2.5 py-1 rounded-md border border-amber-200 dark:border-stone-600 hover:bg-amber-200 cursor-pointer shrink-0"
                        >
                          Pages {ch.startPage} - {ch.endPage}
                        </button>
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center justify-end gap-2">
                          <h3 className="font-bold text-base font-arabic text-amber-950 dark:text-amber-100">
                            {ch.chapterTitleArabic}
                          </h3>
                          <span className="text-xs font-serif text-amber-800 dark:text-amber-400">
                            ({ch.chapterTitle})
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-300 font-arabic leading-relaxed">
                          {ch.globalSummaryArabic}
                        </p>
                      </div>
                    </div>

                    {/* Numbered Points list for this chapter */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 font-arabic">
                        <ListOrdered className="w-3.5 h-3.5 text-amber-600" />
                        <span>النقاط والأحداث المهمة في هذا الفصل ({ch.events.length} نقاط):</span>
                      </h4>

                      {ch.events.map((ev, idx) => (
                        <div
                          key={ev.id}
                          className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
                            ev.isKeyTurningPoint
                              ? 'bg-amber-50/90 dark:bg-stone-900 border-amber-300 dark:border-amber-800 ring-1 ring-amber-300/40'
                              : 'bg-stone-50/70 dark:bg-stone-900/60 border-amber-100 dark:border-stone-800'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-amber-800 text-white font-mono text-xs flex items-center justify-center shrink-0">
                                {ev.eventOrder}
                              </span>
                              <span className="text-amber-950 dark:text-amber-200 font-arabic text-sm">
                                {ev.titleArabic}
                              </span>
                              {ev.isKeyTurningPoint && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-600 text-white font-arabic font-normal">
                                  نقطة تحول رئيسية ⚡
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-mono text-stone-500 bg-white dark:bg-stone-800 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                              ص {ev.pageNumber}
                            </span>
                          </div>

                          {/* French Title */}
                          <p className="text-xs font-serif font-bold text-stone-700 dark:text-stone-300 text-left">
                            {ev.title}
                          </p>

                          {/* Description */}
                          <p className="text-stone-800 dark:text-stone-200 font-arabic text-right leading-relaxed text-xs">
                            {ev.arabicDescription}
                          </p>

                          {/* French Excerpt */}
                          {ev.frenchExcerpt && (
                            <p className="font-serif italic text-stone-700 dark:text-stone-300 text-left text-[11px] bg-white dark:bg-stone-950 p-2 rounded-lg border border-stone-200 dark:border-stone-800">
                              « {ev.frenchExcerpt} »
                            </p>
                          )}

                          {/* Footer Info & Actions */}
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

                            <div className="flex items-center gap-2">
                              {onJumpToPage && (
                                <button
                                  onClick={() => {
                                    onJumpToPage(ev.pageNumber);
                                    onClose();
                                  }}
                                  className="text-emerald-800 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer font-arabic"
                                >
                                  <span>انتقل لصفحة المقطع بالرواية</span>
                                  <span>←</span>
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setSelectedChapterFilter(ch.chapterNumber);
                                  setActiveTab('test');
                                  resetQuizState();
                                }}
                                className="px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                              >
                                <Award className="w-3 h-3 text-amber-300" />
                                <span>اختبار هذا الفصل</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: INTERACTIVE PASSAGE SITUATION TEST (Mode Test)                    */}
          {/* ========================================================================= */}
          {activeTab === 'test' && (
            <div className="space-y-5">
              {/* Top Navigation & Passage Index Badge */}
              <div className="flex items-center justify-between bg-amber-50/80 dark:bg-stone-800/80 p-3 rounded-2xl border border-amber-200 dark:border-stone-700">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-amber-800 text-white font-mono font-black text-xs">
                    مقطع {currentPassageIndex + 1} من {availablePassages.length}
                  </span>
                  <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
                    {currentPassage.chapterTitleArabic} — {currentPassage.titleArabic}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevPassage}
                    className="p-1.5 rounded-lg bg-white dark:bg-stone-700 hover:bg-amber-100 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-600 transition-colors cursor-pointer"
                    title="المقطع السابق"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextPassage}
                    className="p-1.5 rounded-lg bg-white dark:bg-stone-700 hover:bg-amber-100 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-600 transition-colors cursor-pointer"
                    title="المقطع التالي"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Passage Box (French Excerpt + Arabic) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-850 border-2 border-amber-300/80 dark:border-stone-700 shadow-md space-y-3">
                <div className="flex items-center justify-between border-b border-amber-100 dark:border-stone-750 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-serif font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                      📜 نص المقطع المقترح للتأطير (Extrait du Passage)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                      الصفحة {currentPassage.pageNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSpeakFrench(currentPassage.frenchExcerpt)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title="استماع لنطق المقطع"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Écouter</span>
                    </button>
                    {onJumpToPage && (
                      <button
                        onClick={() => {
                          onJumpToPage(currentPassage.pageNumber);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title="فتح الصفحة كاملة في القارئ"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>فتح الرواية</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* French Excerpt */}
                <p className="font-serif text-base sm:text-lg leading-relaxed text-left text-stone-900 dark:text-stone-100 italic bg-amber-50/40 dark:bg-stone-900/60 p-3.5 rounded-xl border border-amber-100 dark:border-stone-800">
                  « {currentPassage.frenchExcerpt} »
                </p>

                {/* Arabic Translation of Excerpt */}
                <div className="p-3 rounded-xl bg-amber-100/40 dark:bg-stone-800/60 text-xs font-arabic text-stone-700 dark:text-stone-300 leading-relaxed text-right">
                  <span className="font-bold text-amber-900 dark:text-amber-300 ml-1">الترجمة التقريبية:</span>
                  {currentPassage.arabicTranslation}
                </div>

                {/* Characters & Location Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    <span>الشخصيات: {currentPassage.characters.join('، ')}</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>المكان: {currentPassage.locationArabic}</span>
                  </div>
                </div>
              </div>

              {/* Question Box */}
              {currentQuestion && !showModelSituation && (
                <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border-2 border-amber-400 dark:border-stone-700 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-750 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-800 text-white font-mono text-xs flex items-center justify-center font-bold">
                        {currentQuestionIndex + 1}
                      </span>
                      <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                        السؤال {currentQuestionIndex + 1} من {currentQuestions.length}
                      </span>
                    </div>

                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-300 font-bold">
                      {currentQuestion.type === 'chapter' ? 'تحديد الفصل' : currentQuestion.type === 'before' ? 'ما قبل المقطع' : 'ما بعد المقطع'}
                    </span>
                  </div>

                  {/* Question Prompts */}
                  <div className="space-y-1 text-right">
                    <h4 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 font-arabic">
                      {currentQuestion.questionArabic}
                    </h4>
                    <p className="text-xs font-serif text-stone-500 dark:text-stone-400 text-left">
                      {currentQuestion.questionFrench}
                    </p>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2 pt-1">
                    {currentQuestion.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === currentQuestion.correctIndex;

                      let btnStyle = 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-amber-400';

                      if (isAnswerSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-400 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-100 dark:bg-rose-950/80 border-rose-500 text-rose-900 dark:text-rose-100 ring-2 ring-rose-400';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-amber-100 dark:bg-amber-950/80 border-amber-500 text-amber-950 dark:text-amber-100 ring-2 ring-amber-400 font-bold';
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          disabled={isAnswerSubmitted}
                          className={`w-full p-3.5 rounded-xl border text-right text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-mono text-xs flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span>{opt}</span>
                          </div>

                          {isAnswerSubmitted && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          )}
                          {isAnswerSubmitted && isSelected && !isCorrect && (
                            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Submit / Next Button */}
                  <div className="pt-3 border-t border-stone-100 dark:border-stone-750 flex items-center justify-between">
                    {!isAnswerSubmitted ? (
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={selectedOption === null}
                        className="w-full py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        تأكيد الإجابة
                      </button>
                    ) : (
                      <div className="w-full space-y-3">
                        {/* Explanation */}
                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 text-xs space-y-1 text-right">
                          <span className="font-bold text-amber-900 dark:text-amber-300">💡 التعليل والشرح البيداغوجي:</span>
                          <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-arabic">
                            {currentQuestion.explanationArabic}
                          </p>
                        </div>

                        <button
                          onClick={handleNextQuestion}
                          className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>{currentQuestionIndex < currentQuestions.length - 1 ? 'السؤال الموالي' : 'عرض التأطير النموذجي الكامل (Situation du passage)'}</span>
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Model Situation du Passage (Exam ready) */}
              {showModelSituation && (
                <div className="p-5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-700 shadow-lg space-y-4 text-right animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <h4 className="font-bold text-sm sm:text-base text-emerald-950 dark:text-emerald-200">
                        الصياغة النموذجية المعتمدة للامتحان الجهوي (Situation du Passage)
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyModelSituation}
                        className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="نسخ التأطير النموذجي"
                      >
                        {copiedSituation ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                        <span>{copiedSituation ? 'تم النسخ' : 'نسخ الصياغة'}</span>
                      </button>

                      <button
                        onClick={() => handleSpeakFrench(currentPassage.regionalExamModelSituationFrench)}
                        className="p-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 transition-colors cursor-pointer"
                        title="نطق التأطير بالفرنسية"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* French Model Paragraph */}
                  <div className="p-4 rounded-xl bg-white dark:bg-stone-850 border border-emerald-300 dark:border-emerald-800 font-serif text-base sm:text-lg leading-relaxed text-left text-stone-900 dark:text-stone-100 shadow-xs">
                    « {currentPassage.regionalExamModelSituationFrench} »
                  </div>

                  {/* Arabic Translation of the Model */}
                  <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700 text-xs sm:text-sm font-arabic text-stone-800 dark:text-stone-200 leading-loose">
                    <span className="font-bold text-amber-950 dark:text-amber-300 block mb-1">الترجمة والشرح بالعربية:</span>
                    {currentPassage.regionalExamModelSituationArabic}
                  </div>

                  {/* Before & After Quick Recap Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1">
                      <span className="font-bold text-amber-900 dark:text-amber-300 block">⏪ ما قبل المقطع (Ce qui précède):</span>
                      <p className="text-stone-700 dark:text-stone-300">{currentPassage.whatPrecededArabic}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1">
                      <span className="font-bold text-emerald-900 dark:text-emerald-300 block">⏩ ما بعد المقطع (Ce qui suit):</span>
                      <p className="text-stone-700 dark:text-stone-300">{currentPassage.whatFollowsArabic}</p>
                    </div>
                  </div>

                  {/* Next Passage Button */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={resetQuizState}
                      className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>إعادة اختبار هذا المقطع</span>
                    </button>

                    <button
                      onClick={handleNextPassage}
                      className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <span>الانتقال للمقطع الموالي</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
