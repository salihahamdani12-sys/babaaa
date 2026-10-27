import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Sparkles, X, ChevronUp, ChevronDown, Copy, Check, Volume2, 
  VolumeX, RefreshCw, BookOpen, User, Compass, HelpCircle, 
  Layers, Lightbulb, CheckCircle2, Bookmark, Flame, Gauge
} from 'lucide-react';
import { PageSummaryResponse } from '../types';

export interface PageSummaryOverlayProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
  summaryData: PageSummaryResponse | null;
  isLoading: boolean;
  error?: string | null;
  onRegenerate: () => void;
  pageNumber: number;
  chapterTitle?: string;
  bookTitle?: string;
}

export const PageSummaryOverlay: React.FC<PageSummaryOverlayProps> = ({
  isOpen,
  isCollapsed,
  onToggleCollapse,
  onClose,
  summaryData,
  isLoading,
  error,
  onRegenerate,
  pageNumber,
  chapterTitle,
  bookTitle,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [arabicVoice, setArabicVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('audiobook_playback_speed');
        if (saved) {
          const parsed = parseFloat(saved);
          if (!isNaN(parsed) && parsed >= 0.75 && parsed <= 1.5) {
            return parsed;
          }
        }
      } catch {
        // ignore
      }
    }
    return 1.0;
  });
  const speechRateRef = useRef<number>(speechRate);
  const speechRateTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    speechRateRef.current = speechRate;
  }, [speechRate]);

  // Initialize Arabic voice for TTS
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const pickArabicVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const arVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('ar'));
      if (arVoices.length > 0) {
        setArabicVoice(arVoices[0]);
      }
    };

    pickArabicVoice();
    window.speechSynthesis.onvoiceschanged = pickArabicVoice;

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Stop speech when closing or unmounting
  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopSpeech();
    }
  }, [isOpen, stopSpeech]);

  const playAudioWithRate = useCallback((rateToUse: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (!summaryData) return;

    window.speechSynthesis.cancel();

    const fullSpeechText = `ملخص الصفحة ${pageNumber}. ${summaryData.quickSynopsisArabic}. ${
      summaryData.situationDuPassageArabic ? `سياق المقطع: ${summaryData.situationDuPassageArabic}.` : ''
    } ${
      summaryData.keyEventsArabic && summaryData.keyEventsArabic.length > 0
        ? `أهم الأحداث: ${summaryData.keyEventsArabic.join('، ')}.`
        : ''
    }`;

    const utterance = new SpeechSynthesisUtterance(fullSpeechText);
    utterance.lang = 'ar-SA';
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }
    utterance.rate = Math.min(2.0, Math.max(0.5, rateToUse * 0.95));

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  }, [arabicVoice, pageNumber, summaryData]);

  // Audio Playback of the Arabic summary
  const handleToggleAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('ميزة القراءة الصوتية غير مدعومة في هذا المتصفح.');
      return;
    }

    if (isPlayingAudio) {
      stopSpeech();
      return;
    }

    playAudioWithRate(speechRateRef.current);
  };

  const changeSpeechRate = (newRate: number, immediate = false) => {
    const clamped = Math.min(1.5, Math.max(0.75, Math.round(newRate * 100) / 100));
    setSpeechRate(clamped);
    speechRateRef.current = clamped;
    try {
      localStorage.setItem('audiobook_playback_speed', clamped.toString());
    } catch {
      // ignore
    }

    if (speechRateTimerRef.current) {
      clearTimeout(speechRateTimerRef.current);
      speechRateTimerRef.current = null;
    }

    if (isPlayingAudio) {
      if (immediate) {
        playAudioWithRate(clamped);
      } else {
        speechRateTimerRef.current = setTimeout(() => {
          playAudioWithRate(clamped);
        }, 180);
      }
    }
  };

  // Copy Summary text
  const handleCopy = () => {
    if (!summaryData) return;
    const textToCopy = `📖 ملخص الصفحة ${pageNumber} - ${summaryData.novelTitle || bookTitle || ''} (${summaryData.chapterTitle || chapterTitle || ''})\n\n📝 الملخص:\n${summaryData.quickSynopsisArabic}\n\n📍 تأطير المقطع (Situation du passage):\n${summaryData.situationDuPassageArabic || 'غير متوفر'}\n\n✨ أهم الأحداث:\n${(summaryData.keyEventsArabic || []).map((e, idx) => `${idx + 1}. ${e}`).join('\n')}\n\n💡 إضاءة للامتحان الجهوي:\n${summaryData.regionalExamPointers || 'مقرر الأولى باكالوريا'}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  // =========================================================================
  // 1. COLLAPSED VIEW (COMPACT FLOATING BANNER)
  // =========================================================================
  if (isCollapsed) {
    return (
      <div 
        id="page-summary-collapsed-overlay"
        className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl bg-amber-900/95 dark:bg-stone-900/95 text-amber-50 rounded-2xl p-2.5 sm:p-3 shadow-2xl border border-amber-600/60 dark:border-stone-700 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-200 font-arabic text-right"
      >
        <div className="flex items-center justify-between gap-2.5">
          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-950 text-amber-200 hover:text-white transition-colors cursor-pointer"
              title="إغلاق الملخص"
            >
              <X className="w-4 h-4" />
            </button>

            <button
              onClick={handleToggleAudio}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isPlayingAudio 
                  ? 'bg-emerald-500 text-white animate-pulse' 
                  : 'bg-amber-800/80 hover:bg-amber-700 text-amber-200 hover:text-white'
              }`}
              title={isPlayingAudio ? 'إيقاف القراءة الصوتية' : 'استماع للملخص بالصوت'}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {isPlayingAudio && (
              <div className="flex items-center gap-1.5 bg-amber-950/90 px-2 py-0.5 rounded-lg border border-amber-600/60 text-[10px]">
                <span className="font-mono font-bold text-amber-200">{speechRate.toFixed(2).replace(/\.?0+$/, '') || '1'}x</span>
                <input
                  type="range"
                  min="0.75"
                  max="1.5"
                  step="0.05"
                  value={speechRate}
                  onChange={(e) => changeSpeechRate(parseFloat(e.target.value), false)}
                  onMouseUp={() => changeSpeechRate(speechRateRef.current, true)}
                  onTouchEnd={() => changeSpeechRate(speechRateRef.current, true)}
                  aria-label="سرعة قراءة الملخص"
                  aria-valuemin={0.75}
                  aria-valuemax={1.5}
                  aria-valuenow={speechRate}
                  className="w-14 h-1 rounded appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            )}

            <button
              id="expand-page-summary-btn"
              onClick={onToggleCollapse}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              title="توسيع نافذة الملخص الكاملة"
            >
              <span>توسيع الملخص</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Preview info */}
          <div 
            onClick={onToggleCollapse}
            className="flex items-center gap-2 cursor-pointer truncate"
          >
            <div className="text-right truncate">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-700/70 text-amber-100 font-serif">
                  ص {pageNumber}
                </span>
                <span className="text-xs sm:text-sm font-bold text-amber-100 truncate">
                  ملخص الصفحة بالذكاء الاصطناعي (AI Summary)
                </span>
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0 animate-spin-slow" />
              </div>
              <p className="text-[11px] text-amber-200/80 truncate max-w-xs sm:max-w-md">
                {isLoading 
                  ? 'جارٍ استخراج وتوليد الملخص بالذكاء الاصطناعي...' 
                  : summaryData?.quickSynopsisArabic || 'اضغط هنا لعرض تفاصيل ملخص الصفحة وتأطير المقطع'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. EXPANDED VIEW (FULL RICH COLLAPSIBLE OVERLAY)
  // =========================================================================
  return (
    <div 
      id="page-summary-expanded-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200 font-arabic"
    >
      <div 
        className="bg-white dark:bg-stone-900 border border-amber-200/80 dark:border-stone-700 w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-right animate-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* OVERLAY HEADER */}
        <div className="px-5 py-3.5 bg-linear-to-l from-amber-800 via-amber-900 to-stone-900 text-amber-50 flex items-center justify-between border-b border-amber-700/60 shrink-0">
          {/* Header Title & Badges */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-700/80 border border-amber-500/60 flex items-center justify-center text-amber-200 shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                  <span>ملخص الصفحة {pageNumber} (AI Page Summary)</span>
                  {summaryData?.generatedWithAI && (
                    <span className="bg-amber-400 text-amber-950 text-[10px] px-2 py-0.2 rounded-full font-sans font-bold flex items-center gap-1 shadow-2xs">
                      <Sparkles className="w-2.5 h-2.5 fill-current" />
                      <span>Gemini AI</span>
                    </span>
                  )}
                </h2>
              </div>
              <p className="text-xs text-amber-200/80 font-serif">
                {bookTitle || summaryData?.novelTitle || 'مقرر الأولى باكالوريا'} — {chapterTitle || summaryData?.chapterTitle || `الصفحة ${pageNumber}`}
              </p>
            </div>
          </div>

          {/* Header Control Buttons (Collapse, Audio, Speed Slider, Copy, Close) */}
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {/* Audio Voice Read */}
            <button
              onClick={handleToggleAudio}
              disabled={isLoading || !summaryData}
              className={`p-2 rounded-xl transition-all shadow-xs cursor-pointer ${
                isPlayingAudio
                  ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
                  : 'bg-amber-800/80 hover:bg-amber-700 text-amber-100 hover:text-white'
              }`}
              title={isPlayingAudio ? 'إيقاف القراءة الصوتية' : 'استماع للملخص بالصوت (Lecture Vocale)'}
            >
              {isPlayingAudio ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {/* Audio Playback Speed Slider (0.75x to 1.5x) */}
            {isPlayingAudio && (
              <div className="flex items-center gap-1.5 bg-amber-950/80 px-2.5 py-1 rounded-xl border border-amber-600/50 text-xs text-amber-100 shadow-inner animate-in fade-in duration-150">
                <div className="flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-amber-300" />
                  <span className="font-mono text-[11px] font-bold text-amber-200 min-w-[34px] text-center">
                    {speechRate.toFixed(2).replace(/\.?0+$/, '') || '1'}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.5"
                  step="0.05"
                  value={speechRate}
                  onChange={(e) => changeSpeechRate(parseFloat(e.target.value), false)}
                  onMouseUp={() => changeSpeechRate(speechRateRef.current, true)}
                  onTouchEnd={() => changeSpeechRate(speechRateRef.current, true)}
                  aria-label="سرعة قراءة الملخص الصوتي من 0.75x إلى 1.5x"
                  aria-valuemin={0.75}
                  aria-valuemax={1.5}
                  aria-valuenow={speechRate}
                  title={`سرعة قراءة الملخص: ${speechRate.toFixed(2)}x`}
                  style={{
                    background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${Math.max(0, Math.min(100, ((speechRate - 0.75) / 0.75) * 100))}%, #78350f ${Math.max(0, Math.min(100, ((speechRate - 0.75) / 0.75) * 100))}%, #78350f 100%)`
                  }}
                  className="w-16 sm:w-20 h-1.5 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-hidden"
                />
              </div>
            )}

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              disabled={isLoading || !summaryData}
              className="p-2 rounded-xl bg-amber-800/80 hover:bg-amber-700 text-amber-100 hover:text-white transition-colors cursor-pointer"
              title="نسخ الملخص إلى الحافظة"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Collapse Button */}
            <button
              id="collapse-page-summary-btn"
              onClick={onToggleCollapse}
              className="p-2 rounded-xl bg-amber-800/80 hover:bg-amber-700 text-amber-100 hover:text-white transition-colors cursor-pointer"
              title="طيّ النافذة إلى شريط مصغر (Minimize)"
            >
              <ChevronUp className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-amber-950 hover:bg-red-900/90 text-amber-200 hover:text-white transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* OVERLAY BODY CONTENT */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 grow text-stone-800 dark:text-stone-200">
          {isLoading ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-amber-100 dark:bg-stone-800 border-2 border-amber-300 dark:border-stone-700 flex items-center justify-center text-amber-700 dark:text-amber-400 animate-pulse">
                <Sparkles className="w-7 h-7 animate-spin" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  جارٍ إعداد وتوليد ملخص الصفحة {pageNumber} بالذكاء الاصطناعي...
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  استخراج الأحداث المحورية، تأطير المقطع، وتحليل إضاءات الامتحان الجهوي
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-300 space-y-2">
              <p className="font-bold text-sm">تعذر توليد الملخص</p>
              <p className="text-xs">{error}</p>
              <button
                onClick={onRegenerate}
                className="mt-2 px-4 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : summaryData ? (
            <>
              {/* 1. QUICK SYNOPSIS (الملخص السردي المباشر) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-amber-200/80 dark:border-stone-700 pb-2.5">
                  <span className="text-[11px] font-serif font-bold text-amber-800 dark:text-amber-400 bg-amber-200/70 dark:bg-stone-700 px-2.5 py-0.5 rounded-full">
                    {summaryData.thematicInsight || 'الملخص المركز'}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 dark:text-amber-300">
                    <BookOpen className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    <span>الملخص السردي المركز (Synopsis de la page):</span>
                  </div>
                </div>

                <div className="text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-stone-200 whitespace-pre-line font-arabic pt-1">
                  {summaryData.quickSynopsisArabic}
                </div>
              </div>

              {/* 2. SITUATION DU PASSAGE (تأطير المقطع للامتحان الجهوي) */}
              {summaryData.situationDuPassageArabic && (
                <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 space-y-2 text-sky-950 dark:text-sky-200 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-sky-200/80 dark:bg-sky-900/80 text-sky-900 dark:text-sky-200 font-sans font-bold">
                      Question 1 / 2 Examen
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900 dark:text-sky-300">
                      <Compass className="w-4 h-4 text-sky-700 dark:text-sky-400" />
                      <span>تأطير المقطع في الرواية (Situation du passage):</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-sky-900/90 dark:text-sky-200/90 font-arabic pt-0.5">
                    {summaryData.situationDuPassageArabic}
                  </p>
                </div>
              )}

              {/* 3. KEY EVENTS (أبرز الأحداث والمحطات) */}
              {summaryData.keyEventsArabic && summaryData.keyEventsArabic.length > 0 && (
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                      {summaryData.keyEventsArabic.length} أحداث
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 dark:text-stone-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>أبرز الأحداث والمحطات في هذه الصفحة:</span>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {summaryData.keyEventsArabic.map((evt, idx) => (
                      <li 
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900/80 p-2.5 rounded-xl border border-stone-200/70 dark:border-stone-700/70 shadow-2xs"
                      >
                        <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed grow">{evt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 4. CHARACTERS (الشخصيات الحاضرة) */}
              {summaryData.mainCharacters && summaryData.mainCharacters.length > 0 && (
                <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-indigo-700 dark:text-indigo-400 font-sans font-semibold">
                      Personnages
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950 dark:text-indigo-200">
                      <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>الشخصيات المتفاعلة في الصفحة:</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {summaryData.mainCharacters.map((char, idx) => (
                      <div 
                        key={idx}
                        className="bg-white/90 dark:bg-stone-900/80 p-2.5 rounded-xl border border-indigo-100 dark:border-stone-700 text-xs space-y-0.5"
                      >
                        <span className="font-bold text-indigo-900 dark:text-indigo-300 font-serif block">
                          {char.name}
                        </span>
                        <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
                          {char.roleArabic}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. REGIONAL EXAM POINTERS (إضاءة للامتحان الجهوي) */}
              {summaryData.regionalExamPointers && (
                <div className="p-4 rounded-2xl bg-linear-to-l from-amber-500/15 via-orange-500/10 to-amber-500/15 border-2 border-amber-400/80 dark:border-amber-500/40 text-amber-950 dark:text-amber-200 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-600 text-white font-bold">
                      1ère Bac Régional
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 dark:text-amber-300">
                      <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-bounce" />
                      <span>إضاءة ونقطة ذهبية للامتحان الجهوي:</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed font-arabic text-amber-900 dark:text-amber-200 font-medium pt-0.5">
                    {summaryData.regionalExamPointers}
                  </p>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* OVERLAY FOOTER */}
        <div className="px-5 py-3.5 bg-stone-100 dark:bg-stone-900/90 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2.5 text-xs font-arabic shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onRegenerate}
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-amber-900 dark:text-amber-300 font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
              title="إعادة التلخيص بالذكاء الاصطناعي"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>إعادة التوليد (AI Refresh)</span>
            </button>
            <button
              onClick={onToggleCollapse}
              className="px-3 py-1.5 rounded-xl bg-stone-200/80 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold transition-colors cursor-pointer"
            >
              طيّ النافذة
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold transition-all shadow-xs cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
