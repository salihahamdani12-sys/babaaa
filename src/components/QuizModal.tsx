import React, { useState } from 'react';
import { 
  X, HelpCircle, CheckCircle2, XCircle, Award, 
  RotateCcw, Sparkles, BookOpen, ArrowRight, ArrowLeft,
  FileText, Lightbulb, Eye, EyeOff, Check, Filter, Layers,
  Flame, Zap, Compass, MessageCircle, HelpCircle as QuestionIcon
} from 'lucide-react';
import { BookInfo, QuizCategoryFilter, QuizDifficulty, QuizQuestion, QuizRequest } from '../types';
import { getBookChapters, getPage } from '../data/bookService';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number;
  selectedPages: number[];
  onGenerateQuiz: (req: QuizRequest) => Promise<QuizQuestion[]>;
  bookInfo?: BookInfo;
}

interface CategoryOption {
  id: QuizCategoryFilter;
  labelArabic: string;
  labelFrench: string;
  description: string;
  icon: string;
  tag: string;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    id: 'ALL',
    labelArabic: 'شامل (مزيج الامتحان الجهوي الرسمي)',
    labelFrench: 'Complet (Examen Régional)',
    description: 'مزيج متكامل من أسئلة الأحداث، الأسباب، الحوارات، والمحسنات البديعية',
    icon: '⭐',
    tag: 'موصى به للجهوي',
  },
  {
    id: 'EVENTS_CAUSES',
    labelArabic: 'أسباب وتصرفات الشخصيات (علاش دار هاد الفعل؟)',
    labelFrench: 'Causes & Motivations (Pourquoi ?)',
    description: 'يركز على دوافع الشخصيات، أسباب الخلافات، والنتائج النفسية والسردية للأفعال',
    icon: '❓',
    tag: 'علاش دار هاد الشي؟',
  },
  {
    id: 'EVENTS_DIALOGUE',
    labelArabic: 'أطراف الحوار والمتحدثين (مع من كان كايدوي؟)',
    labelFrench: 'Dialogues & Interlocuteurs (Qui parle à qui ?)',
    description: 'تحديد من يتحدث ولمن يوجه كلامه، نبرة الحوار، ودلالات الردود والمواقف',
    icon: '🗣️',
    tag: 'مع من كان كيدوي؟',
  },
  {
    id: 'EVENTS_CHRONO',
    labelArabic: 'السياق الزمني والتموضع (إمتى طرا هاد الحدث؟)',
    labelFrench: 'Chronologie & Situation du passage',
    description: 'تأطير المقطع زمنياً وما وقع قبله وبعده في سياق الحبكة السردية',
    icon: '⏱️',
    tag: 'إمتى طرات هاد الوقعة؟',
  },
  {
    id: 'EVENTS',
    labelArabic: 'اختبار الأحداث والوقائع الشامل',
    labelFrench: 'Événements & Faits narratifs',
    description: 'مزيج شامل من وقائع الرواية، الأفعال، الأماكن، وردود أفعال الشخصيات',
    icon: '📖',
    tag: 'أحداث الرواية',
  },
  {
    id: 'FIGURES_DE_STYLE',
    labelArabic: 'المحسنات البديعية واللغة (Figures de style)',
    labelFrench: 'Figures de style & Langue',
    description: 'الاستعارة، التشبيه، المبالغة، التشخيص، التضاد، السجل الأدبي ومؤشرات النص',
    icon: '🎨',
    tag: 'بلاغة ولغة',
  },
  {
    id: 'CHARACTERS_THEMES',
    labelArabic: 'الشخصيات والمشاعر والعلاقات',
    labelFrench: 'Personnages & Thèmes',
    description: 'تحليل مواقف الشخصيات، حالتها النفسية، وطبيعة العلاقات والطباع',
    icon: '👥',
    tag: 'شخصيات وتيمات',
  },
  {
    id: 'COMPREHENSION',
    labelArabic: 'الفهم المباشر والدلالات النصية',
    labelFrench: 'Compréhension du texte',
    description: 'دلالات العبارات والمصطلحات الدقيقة في سياق الصفحة المختارة',
    icon: '🔍',
    tag: 'فهم ومعجم',
  },
];

const DIFFICULTY_OPTIONS: { id: QuizDifficulty; labelArabic: string; labelFrench: string; descArabic: string; color: string; icon: string }[] = [
  {
    id: 'EASY',
    labelArabic: 'سهل ومباشر',
    labelFrench: 'Facile / Découverte',
    descArabic: 'أسئلة واضحة ومباشرة حول الشخصيات، الأماكن، والوقائع الصريحة',
    color: 'border-emerald-400 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-700',
    icon: '🟢',
  },
  {
    id: 'MEDIUM',
    labelArabic: 'متوسط (معياري جهوي)',
    labelFrench: 'Moyen / Examen Régional standard',
    descArabic: 'أسئلة جهوية كلاسيكية تركز على التعليل (Pourquoi)، الحوارات والسياق',
    color: 'border-amber-400 bg-amber-50 text-amber-950 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-700',
    icon: '🟡',
  },
  {
    id: 'HARD',
    labelArabic: 'صعب ومتقدم (تحليلي دقيق)',
    labelFrench: 'Difficile / Analyse approfondie',
    descArabic: 'أسئلة دقيقة واستنتاجية تختبر الفهم العميق للدوافع والتسلسل والتفاصيل',
    color: 'border-rose-400 bg-rose-50 text-rose-950 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-700',
    icon: '🔴',
  },
];

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  currentPage,
  selectedPages,
  onGenerateQuiz,
  bookInfo,
}) => {
  const totalPages = bookInfo?.totalPages || 99;
  const bookId = bookInfo?.id || 'la_boite_a_merveilles';
  const chapters = getBookChapters(bookId);

  const [quizRangeType, setQuizRangeType] = useState<'current' | 'chapter' | 'range' | 'selected' | 'all'>(
    selectedPages.length > 0 ? 'selected' : 'current'
  );
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number>(1);
  const [rangeStart, setRangeStart] = useState<number>(Math.max(1, currentPage - 2));
  const [rangeEnd, setRangeEnd] = useState<number>(Math.min(totalPages, currentPage + 2));
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('MEDIUM');
  const [questionsCount, setQuestionsCount] = useState<number>(4);
  const [categoryFilter, setCategoryFilter] = useState<QuizCategoryFilter>('ALL');

  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State to show original page excerpt text during quiz
  const [showPageExcerpt, setShowPageExcerpt] = useState(false);

  if (!isOpen) return null;

  const handleStartQuiz = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setQuestions([]);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsQuizCompleted(false);
    setShowPageExcerpt(false);

    try {
      let pages: number[] = [currentPage];

      if (quizRangeType === 'current') {
        pages = [currentPage];
      } else if (quizRangeType === 'chapter') {
        const foundCh = chapters.find((c) => c.chapter === selectedChapterNumber) || chapters[0];
        if (foundCh) {
          const s = Math.min(foundCh.startPage, foundCh.endPage);
          const e = Math.max(foundCh.startPage, foundCh.endPage);
          pages = Array.from({ length: e - s + 1 }, (_, i) => s + i);
        }
      } else if (quizRangeType === 'range') {
        const start = Math.min(rangeStart, rangeEnd);
        const end = Math.max(rangeStart, rangeEnd);
        pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      } else if (quizRangeType === 'selected' && selectedPages.length > 0) {
        pages = [...selectedPages];
      } else if (quizRangeType === 'all') {
        // Sample representative pages across novel
        const step = Math.max(1, Math.floor(totalPages / 8));
        pages = [];
        for (let p = 1; p <= totalPages; p += step) {
          pages.push(p);
        }
      }

      const generatedQuestions = await onGenerateQuiz({
        selectedPages: pages,
        numberOfQuestions: questionsCount,
        categoryFilter,
        difficulty,
        category: categoryFilter,
        bookId,
        scopeType: quizRangeType === 'current' ? 'current' : quizRangeType === 'chapter' ? 'chapter' : 'range',
        chapterNumber: selectedChapterNumber,
      });

      if (generatedQuestions && generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
      } else {
        setErrorMessage('تعذر إنشاء أسئلة لهذه الصفحات. يرجى تجربة نطاق آخر.');
      }
    } catch (err) {
      setErrorMessage('حدث خطأ أثناء إنشاء الاختبار الجهوي التفاعلي.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (selectedAnswers[currentQuestionIndex] !== undefined) return; // already answered
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowPageExcerpt(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  // Calculate score
  const score = questions.reduce((acc, q, idx) => {
    return selectedAnswers[idx] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const currentQ = questions[currentQuestionIndex];
  const hasAnsweredCurrent = selectedAnswers[currentQuestionIndex] !== undefined;
  const activePageData = currentQ ? getPage(bookId, currentQ.pageNumber) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#fcfaf7] dark:bg-[#12151e] border-2 border-amber-300/80 dark:border-stone-700 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-emerald-950 text-amber-50 p-4 sm:p-5 flex items-center justify-between border-b border-amber-400/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-arabic font-bold text-base sm:text-lg text-white">
                اختبار الأحداث، الأسباب والمحسنات البديعية
              </h3>
              <p className="text-xs text-amber-200/90 font-arabic">
                {bookInfo?.titleArabic || 'مقرر الأولى باكالوريا'} • محاكاة معايير الامتحان الجهوي الموحد
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-amber-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* 1. Setup screen if no active questions */}
          {questions.length === 0 && !isLoading && (
            <div className="space-y-5 text-right">
              {/* Range & Scope Selection Card */}
              <div className="bg-white dark:bg-[#1a1e2b] border border-amber-200/80 dark:border-stone-700 rounded-xl p-4 sm:p-5 space-y-3.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-700 dark:text-amber-300 font-sans font-medium">
                    {bookInfo?.titleFrench}
                  </span>
                  <h4 className="font-arabic font-bold text-sm sm:text-base text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
                    <span>1. تحديد نطاق الاختبار (صفحة، فصل، أو مجال مخصص):</span>
                    <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setQuizRangeType('current')}
                    className={`p-2.5 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center text-center gap-1 transition-all ${
                      quizRangeType === 'current'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 shadow-xs font-bold'
                        : 'border-amber-200/70 dark:border-stone-700 bg-amber-50/40 dark:bg-stone-800/40 hover:bg-amber-100/50 text-amber-900 dark:text-stone-300'
                    }`}
                  >
                    <span className="font-arabic text-xs font-bold">الصفحة الحالية</span>
                    <span className="text-[11px] font-sans font-semibold text-emerald-700 dark:text-emerald-300">
                      ص {currentPage}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuizRangeType('chapter')}
                    className={`p-2.5 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center text-center gap-1 transition-all ${
                      quizRangeType === 'chapter'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 shadow-xs font-bold'
                        : 'border-amber-200/70 dark:border-stone-700 bg-amber-50/40 dark:bg-stone-800/40 hover:bg-amber-100/50 text-amber-900 dark:text-stone-300'
                    }`}
                  >
                    <span className="font-arabic text-xs font-bold">فصل / مشهد كامل</span>
                    <span className="text-[11px] font-arabic font-semibold text-emerald-700 dark:text-emerald-300">
                      اختيار الفصل
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuizRangeType('range')}
                    className={`p-2.5 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center text-center gap-1 transition-all ${
                      quizRangeType === 'range'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 shadow-xs font-bold'
                        : 'border-amber-200/70 dark:border-stone-700 bg-amber-50/40 dark:bg-stone-800/40 hover:bg-amber-100/50 text-amber-900 dark:text-stone-300'
                    }`}
                  >
                    <span className="font-arabic text-xs font-bold">مجال (من - إلى)</span>
                    <span className="text-[11px] font-sans font-semibold text-emerald-700 dark:text-emerald-300">
                      ص {rangeStart} إلى {rangeEnd}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuizRangeType('all')}
                    className={`p-2.5 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center text-center gap-1 transition-all ${
                      quizRangeType === 'all'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 shadow-xs font-bold'
                        : 'border-amber-200/70 dark:border-stone-700 bg-amber-50/40 dark:bg-stone-800/40 hover:bg-amber-100/50 text-amber-900 dark:text-stone-300'
                    }`}
                  >
                    <span className="font-arabic text-xs font-bold">كامل الرواية</span>
                    <span className="text-[11px] font-sans font-semibold text-emerald-700 dark:text-emerald-300">
                      {totalPages} صفحة
                    </span>
                  </button>
                </div>

                {/* Chapter Select Dropdown */}
                {quizRangeType === 'chapter' && (
                  <div className="pt-2 border-t border-amber-100 dark:border-stone-800 flex items-center justify-between gap-3">
                    <span className="text-xs font-arabic font-bold text-amber-950 dark:text-amber-200">
                      اختر الفصل أو المشهد:
                    </span>
                    <select
                      value={selectedChapterNumber}
                      onChange={(e) => setSelectedChapterNumber(Number(e.target.value))}
                      className="bg-amber-50 dark:bg-stone-800 border border-amber-300 dark:border-stone-600 rounded-lg px-3 py-1.5 text-xs font-arabic font-bold text-amber-950 dark:text-amber-100 focus:ring-1 focus:ring-emerald-500 max-w-xs sm:max-w-md"
                    >
                      {chapters.map((ch) => (
                        <option key={ch.chapter} value={ch.chapter}>
                          {ch.title} — {ch.titleArabic} (ص {ch.startPage} إلى {ch.endPage})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Range inputs and quick presets if range selected */}
                {quizRangeType === 'range' && (
                  <div className="pt-3 border-t border-amber-100 dark:border-stone-800 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-arabic font-bold text-amber-950 dark:text-amber-200">
                        تحديد مجال الصفحات المطلوب (من ص X إلى ص Y):
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Start page picker */}
                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-stone-800 border border-amber-300 dark:border-stone-600 rounded-lg p-1">
                          <span className="text-xs font-arabic text-amber-900 dark:text-stone-300 px-1 font-bold">من صفحة:</span>
                          <button
                            type="button"
                            onClick={() => setRangeStart((prev) => Math.max(1, prev - 1))}
                            className="w-6 h-6 rounded bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-amber-100 flex items-center justify-center cursor-pointer shadow-xs"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={1}
                            max={totalPages}
                            value={rangeStart}
                            onChange={(e) => setRangeStart(Math.max(1, Math.min(totalPages, Number(e.target.value))))}
                            className="w-12 py-0.5 text-center font-bold text-emerald-950 dark:text-emerald-300 bg-transparent text-sm focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setRangeStart((prev) => Math.min(rangeEnd, prev + 1))}
                            className="w-6 h-6 rounded bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-amber-100 flex items-center justify-center cursor-pointer shadow-xs"
                          >
                            +
                          </button>
                        </div>

                        {/* End page picker */}
                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-stone-800 border border-amber-300 dark:border-stone-600 rounded-lg p-1">
                          <span className="text-xs font-arabic text-amber-900 dark:text-stone-300 px-1 font-bold">إلى صفحة:</span>
                          <button
                            type="button"
                            onClick={() => setRangeEnd((prev) => Math.max(rangeStart, prev - 1))}
                            className="w-6 h-6 rounded bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-amber-100 flex items-center justify-center cursor-pointer shadow-xs"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={1}
                            max={totalPages}
                            value={rangeEnd}
                            onChange={(e) => setRangeEnd(Math.max(1, Math.min(totalPages, Number(e.target.value))))}
                            className="w-12 py-0.5 text-center font-bold text-emerald-950 dark:text-emerald-300 bg-transparent text-sm focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setRangeEnd((prev) => Math.min(totalPages, prev + 1))}
                            className="w-6 h-6 rounded bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-amber-100 flex items-center justify-center cursor-pointer shadow-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Quick Preset Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-arabic font-bold text-stone-500 dark:text-stone-400 ml-1">
                        خيارات سريعة لمجال الصفحات:
                      </span>
                      {[
                        { label: 'من 1 إلى 5', start: 1, end: 5 },
                        { label: 'من 4 إلى 10', start: 4, end: 10 },
                        { label: 'من 1 إلى 10', start: 1, end: 10 },
                        { label: 'من 10 إلى 20', start: 10, end: 20 },
                        { label: 'من 20 إلى 30', start: 20, end: 30 },
                        { label: `حول الصفحة الحالية (ص ${Math.max(1, currentPage - 2)} إلى ${Math.min(totalPages, currentPage + 2)})`, start: Math.max(1, currentPage - 2), end: Math.min(totalPages, currentPage + 2) },
                      ].map((preset, idx) => {
                        const isPresetActive = rangeStart === preset.start && rangeEnd === preset.end;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setRangeStart(preset.start);
                              setRangeEnd(preset.end);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-arabic transition-all cursor-pointer ${
                              isPresetActive
                                ? 'bg-emerald-700 text-white font-bold shadow-xs'
                                : 'bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 text-stone-800 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                            }`}
                          >
                            ⚡ {preset.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between text-xs font-arabic">
                      <span className="text-emerald-900 dark:text-emerald-200 font-bold">
                        📌 نطاق الاختبار الحالي: من الصفحة {Math.min(rangeStart, rangeEnd)} إلى الصفحة {Math.max(rangeStart, rangeEnd)}
                      </span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        ({Math.abs(rangeEnd - rangeStart) + 1} صفحة مغطاة)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Difficulty Level Selection (Niveaux de difficulté) */}
              <div className="bg-white dark:bg-[#1a1e2b] border border-amber-200/80 dark:border-stone-700 rounded-xl p-4 sm:p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-amber-700 dark:text-amber-400 font-arabic">
                    تحديد مستوى صعوبة وتعقيد الأسئلة
                  </span>
                  <h4 className="font-arabic font-bold text-sm sm:text-base text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
                    <span>2. مستوى الصعوبة (Niveau de difficulté):</span>
                    <Zap className="w-4 h-4 text-amber-600" />
                  </h4>
                </div>

                <div className="grid sm:grid-cols-3 gap-2.5">
                  {DIFFICULTY_OPTIONS.map((diff) => {
                    const isSelected = difficulty === diff.id;
                    return (
                      <button
                        key={diff.id}
                        type="button"
                        onClick={() => setDifficulty(diff.id)}
                        className={`p-3 rounded-xl border-2 text-right transition-all flex flex-col gap-1 cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 shadow-xs ring-2 ring-emerald-500/30'
                            : 'border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/40 hover:bg-amber-50/50 text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{diff.icon}</span>
                          <span className="font-arabic font-bold text-xs sm:text-sm">
                            {diff.labelArabic}
                          </span>
                        </div>
                        <span className="text-[10px] font-sans font-semibold text-stone-500 dark:text-stone-400">
                          {diff.labelFrench}
                        </span>
                        <p className="text-[11px] font-arabic text-stone-600 dark:text-stone-400 leading-snug">
                          {diff.descArabic}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Question Category / Target Focus */}
              <div className="bg-white dark:bg-[#1a1e2b] border border-amber-200/80 dark:border-stone-700 rounded-xl p-4 sm:p-5 space-y-3.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-amber-700 dark:text-amber-400 font-arabic">
                    اختر تركيز الأسئلة (أحداث، أسباب، حوارات، أو بلاغة)
                  </span>
                  <h4 className="font-arabic font-bold text-sm sm:text-base text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
                    <span>3. نوعية الأسئلة المستهدفة:</span>
                    <Filter className="w-4 h-4 text-emerald-600" />
                  </h4>
                </div>

                <div className="grid sm:grid-cols-2 gap-2.5">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = categoryFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoryFilter(cat.id)}
                        className={`p-3 rounded-xl border-2 text-right transition-all flex flex-col gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/90 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-100 shadow-xs ring-1 ring-emerald-500/30'
                            : 'border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/40 hover:bg-amber-50/50 dark:hover:bg-stone-700/50 text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-stone-700 font-arabic font-bold text-amber-900 dark:text-amber-200">
                            {cat.tag}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-arabic font-bold text-xs sm:text-sm">
                              {cat.labelArabic}
                            </span>
                            <span className="text-sm">{cat.icon}</span>
                          </div>
                        </div>
                        <p className="text-[11px] font-arabic text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Number of Questions */}
              <div className="bg-white dark:bg-[#1a1e2b] border border-amber-200/80 dark:border-stone-700 rounded-xl p-4 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  {[3, 4, 6, 8].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionsCount(cnt)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ${
                        questionsCount === cnt
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-amber-100 dark:bg-stone-700 text-amber-900 dark:text-stone-200 hover:bg-amber-200 dark:hover:bg-stone-600'
                      }`}
                    >
                      {cnt} أسئلة
                    </button>
                  ))}
                </div>
                <span className="font-arabic font-bold text-xs sm:text-sm text-amber-950 dark:text-amber-100">
                  عدد أسئلة الاختبار:
                </span>
              </div>

              {errorMessage && (
                <p className="text-xs font-arabic text-red-600 bg-red-50 dark:bg-red-950/40 p-3 rounded-lg border border-red-200 dark:border-red-800">
                  {errorMessage}
                </p>
              )}

              {/* Start Quiz Button */}
              <button
                onClick={handleStartQuiz}
                className="w-full py-3.5 rounded-xl bg-linear-to-r from-emerald-800 via-teal-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-arabic font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.005] cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-emerald-200" />
                <span>توليد أسئلة الامتحان التفاعلية للوقائع والمحسنات</span>
              </button>
            </div>
          )}

          {/* 2. Loading State */}
          {isLoading && (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-1.5">
                <p className="font-arabic font-bold text-emerald-950 dark:text-emerald-100 text-base">
                  جارٍ تحليل وقائع المقطع وصياغة الأسئلة البيداغوجية...
                </p>
                <p className="font-arabic text-xs text-emerald-800/80 dark:text-emerald-400/80">
                  استخراج أسباب التصرفات (Pourquoi)، سياق المتحدثين (Qui parle à qui)، والمحسنات البديعية
                </p>
              </div>
            </div>
          )}

          {/* 3. Active Quiz Question Screen */}
          {questions.length > 0 && !isQuizCompleted && currentQ && (
            <div className="space-y-4 text-right">
              {/* Progress and Category Bar */}
              <div className="flex items-center justify-between text-xs font-arabic border-b border-amber-200 dark:border-stone-700 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-bold text-emerald-800 dark:text-emerald-300">
                    {currentQuestionIndex + 1} / {questions.length}
                  </span>
                  <span className="text-amber-400">•</span>
                  <span className="font-bold text-amber-900 dark:text-amber-200">
                    الدرجة: {score}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-[11px] font-bold">
                    {currentQ.category || 'Compréhension'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-[11px] font-serif">
                    ص {currentQ.pageNumber}
                  </span>
                </div>
              </div>

              {/* Target Concept Chip (if present) */}
              {currentQ.targetConcept && (
                <div className="flex items-center justify-end gap-1.5 text-[11px] font-arabic font-semibold text-emerald-800 dark:text-emerald-300">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>المفهوم المستهدف: {currentQ.targetConcept}</span>
                </div>
              )}

              {/* Quote Excerpt Box (if present) */}
              {currentQ.quoteExcerpt && (
                <div className="p-3 rounded-xl bg-amber-100/50 dark:bg-stone-800/60 border border-amber-300/70 dark:border-stone-600 text-left">
                  <span className="text-[10px] font-sans font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block mb-1">
                    Extrait du texte (Page {currentQ.pageNumber}) :
                  </span>
                  <p className="font-serif text-sm sm:text-base italic text-stone-900 dark:text-stone-100 leading-relaxed">
                    « {currentQ.quoteExcerpt} »
                  </p>
                </div>
              )}

              {/* Question Text (French + Arabic) */}
              <div className="bg-white dark:bg-[#1a1e2b] rounded-2xl border-2 border-emerald-300/80 dark:border-emerald-700/60 p-5 shadow-xs space-y-3">
                <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 text-left leading-relaxed">
                  {currentQ.questionFrench}
                </h3>
                <div className="pt-2 border-t border-amber-100 dark:border-stone-700/60">
                  <p className="font-arabic text-sm sm:text-base font-bold text-amber-950 dark:text-amber-200 text-right leading-relaxed">
                    {currentQ.questionArabic}
                  </p>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                  const isCorrect = optIdx === currentQ.correctIndex;
                  const showResult = hasAnsweredCurrent;

                  let btnStyle = 'border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1a1e2b] hover:border-emerald-500 hover:bg-emerald-50/40 text-stone-900 dark:text-stone-100';

                  if (showResult) {
                    if (isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 font-bold ring-2 ring-emerald-500/30';
                    } else if (isSelected) {
                      btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/30';
                    } else {
                      btnStyle = 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40 text-stone-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={hasAnsweredCurrent}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-3.5 sm:p-4 rounded-xl border-2 text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-lg text-xs font-bold font-sans flex items-center justify-center shrink-0 ${
                          showResult && isCorrect
                            ? 'bg-emerald-600 text-white'
                            : showResult && isSelected
                            ? 'bg-rose-600 text-white'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="font-serif text-sm sm:text-base leading-relaxed">
                          {opt}
                        </span>
                      </div>

                      {showResult && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* View Original Page Excerpt Toggle */}
              {activePageData && (
                <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 dark:border-stone-700">
                  <button
                    onClick={() => setShowPageExcerpt(!showPageExcerpt)}
                    className="text-xs font-arabic text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 flex items-center gap-1.5 cursor-pointer font-bold"
                  >
                    {showPageExcerpt ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPageExcerpt ? 'إخفاء نص الصفحة المعتمد' : 'معاينة نص الصفحة المعتمد للتأكد'}</span>
                  </button>
                  <span className="text-[11px] font-sans text-stone-500">
                    Page {currentQ.pageNumber}
                  </span>
                </div>
              )}

              {/* Expandable Page Text Preview */}
              {showPageExcerpt && activePageData && (
                <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-600 text-left space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300 border-b border-stone-200 dark:border-stone-700 pb-1">
                    <span>Texte intégral de la page {currentQ.pageNumber}</span>
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="font-serif text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line pr-2">
                    {activePageData.text}
                  </p>
                </div>
              )}

              {/* Immediate Feedback and Pedagogical Explanation */}
              {hasAnsweredCurrent && (
                <div className="p-4 sm:p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 space-y-3 text-right animate-in fade-in duration-200">
                  <div className="flex items-center justify-between font-arabic font-bold text-xs sm:text-sm">
                    <span className={selectedAnswers[currentQuestionIndex] === currentQ.correctIndex ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}>
                      {selectedAnswers[currentQuestionIndex] === currentQ.correctIndex
                        ? '✅ إجابة صحيحة وموفقة!'
                        : '⚠️ إجابة غير دقيقة — راجع التعليل البيداغوجي:'}
                    </span>
                    <span className="text-emerald-950 dark:text-emerald-100">التوضيح البيداغوجي المعتمد</span>
                  </div>

                  <p className="text-xs sm:text-sm font-arabic text-emerald-950 dark:text-emerald-100 leading-relaxed font-medium">
                    {currentQ.explanationArabic}
                  </p>

                  {/* Why Correct breakdown if present */}
                  {currentQ.reasoningBreakdown?.whyCorrectArabic && (
                    <div className="text-[11px] font-arabic text-emerald-800 dark:text-emerald-300 bg-white/70 dark:bg-stone-900/60 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 leading-relaxed">
                      <span className="font-bold">💡 لماذا هذا الخيار صحيح: </span>
                      {currentQ.reasoningBreakdown.whyCorrectArabic}
                    </div>
                  )}

                  <p className="text-xs font-serif italic text-emerald-800 dark:text-emerald-300 text-left pt-1 border-t border-emerald-200/60 dark:border-emerald-800/60">
                    « {currentQ.explanationFrench} »
                  </p>

                  <div className="pt-2 flex justify-start">
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-arabic font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <span>
                        {currentQuestionIndex < questions.length - 1 ? 'السؤال الموالي' : 'عرض النتيجة النهائية'}
                      </span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. Quiz Completed Screen */}
          {isQuizCompleted && (
            <div className="py-8 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/60 border-2 border-emerald-300 dark:border-emerald-700 flex items-center justify-center mx-auto text-emerald-700 dark:text-emerald-300 shadow-sm">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-arabic text-amber-950 dark:text-amber-100">
                  اكتمل الاختبار بنجاح!
                </h3>
                <p className="text-sm font-arabic text-amber-900 dark:text-stone-300">
                  حصلت على <span className="font-bold text-emerald-700 dark:text-emerald-400 text-lg">{score}</span> من أصل{' '}
                  <span className="font-bold text-amber-950 dark:text-amber-100 text-lg">{questions.length}</span> (
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{percentage}%</span>)
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-xl bg-amber-100/60 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 text-xs font-arabic text-amber-950 dark:text-stone-200 leading-relaxed text-right">
                {percentage >= 80 ? (
                  <p className="font-bold text-emerald-800 dark:text-emerald-300">
                    ممتاز! إلمامك بمجريات هذا المقطع وتعليلاته والمحسنات البديعية مطابق تماماً لمعايير الامتحان الجهوي.
                  </p>
                ) : percentage >= 50 ? (
                  <p className="text-amber-900 dark:text-amber-200">
                    مستوى جيد! يُستحسن مراجعة نص الصفحة والتأكد من أسباب الأحداث والصور البيانية لضمان النقطة الكاملة.
                  </p>
                ) : (
                  <p className="text-stone-800 dark:text-stone-300">
                    بداية جيدة للتمرن! أعد قراءة النص مع الاستعانة بالشريط الجانبي للترجمة الفصحى ثم أعد الاختبار.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setQuestions([]);
                    setIsQuizCompleted(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-arabic font-bold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>اختبار صفحات أو أنواع أخرى</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-100 text-xs font-arabic font-bold transition-colors cursor-pointer"
                >
                  العودة للقراءة
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
