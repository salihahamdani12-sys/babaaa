import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  Sliders,
  Sparkles,
  Eye,
  Scroll,
  Gauge,
  HelpCircle,
  X,
  Languages,
  BookmarkCheck,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { TTSPlayerState, accessibleTTS } from '../data/ttsService';
import {
  stopAIAudio,
  pauseAIAudio,
  resumeAIAudio,
  getAIAudioState,
  subscribeAIAudio,
  setAIAudioRate,
  AIAudioState,
} from '../data/aiAudioService';

interface AccessibleAudioPlayerProps {
  ttsState: TTSPlayerState;
  onOpenSettings: () => void;
  onClose: () => void;
  pageNumber: number;
  chapterTitle?: string;
}

export const AccessibleAudioPlayer: React.FC<AccessibleAudioPlayerProps> = ({
  ttsState,
  onOpenSettings,
  onClose,
  pageNumber,
  chapterTitle,
}) => {
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [aiState, setAiState] = useState<AIAudioState>(() => getAIAudioState());

  useEffect(() => {
    return subscribeAIAudio((s) => {
      setAiState(s);
    });
  }, []);

  const {
    isPlaying: ttsPlaying,
    isPaused: ttsPaused,
    currentSentenceIndex,
    totalSentences,
    currentSentence,
    currentWordRange,
    lang,
    rate,
    autoScroll,
    highlightBimodal,
    voiceName,
  } = ttsState;

  const isPlaying = aiState.isPlaying || ttsPlaying;
  const isPaused = aiState.isPaused || ttsPaused;
  const isLoading = aiState.isLoading;

  const progressPercent =
    totalSentences > 0 ? Math.round(((currentSentenceIndex + 1) / totalSentences) * 100) : 0;

  // Active word karaoke split if available
  const renderSentenceWithActiveWord = () => {
    if (!currentSentence) return null;
    const text = currentSentence.text;
    if (!currentWordRange || currentWordRange.start === undefined) {
      return <span>{text}</span>;
    }

    const { start, length } = currentWordRange;
    const before = text.slice(0, start);
    const word = text.slice(start, start + length);
    const after = text.slice(start + length);

    return (
      <span>
        {before}
        <mark className="bg-amber-300 dark:bg-amber-500 text-stone-950 px-1 py-0.5 rounded font-bold transition-all shadow-xs">
          {word}
        </mark>
        {after}
      </span>
    );
  };

  return (
    <section
      role="region"
      aria-label="قارئ الصفحة الصوتي لتسهيل الوصول والتعلّم السمعي"
      className="bg-stone-900/95 dark:bg-stone-950 text-white rounded-2xl p-4 shadow-2xl border-2 border-indigo-500/80 animate-in fade-in slide-in-from-top-3 duration-200 font-arabic select-none"
    >
      <div className="flex flex-col gap-3">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 border-b border-stone-800 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/90 border border-indigo-400/40 flex items-center justify-center text-indigo-100 shadow-inner">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <span>قارئ الصفحة الصوتي الذكي</span>
                  {isLoading && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-sans border border-amber-400/40 animate-pulse">
                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      <span>جاري تحضير الصوت...</span>
                    </span>
                  )}
                  {!isLoading && isPlaying && !isPaused && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-sans border border-emerald-400/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>قراءة نشطة</span>
                    </span>
                  )}
                  {!isLoading && isPaused && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-sans border border-amber-400/40">
                      موقوف مؤقتاً
                    </span>
                  )}
                </h3>
              </div>
              <p className="text-[11px] text-stone-400 flex items-center gap-1.5 flex-wrap">
                <span>الصفحة {pageNumber} {chapterTitle ? `• ${chapterTitle}` : ''}</span>
                <span>•</span>
                <span className="text-indigo-300 font-sans">
                  {lang === 'fr' ? 'الفرنسية الأصلية 🇫🇷' : 'الشرح العربي 🇲🇦'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-900/80 to-indigo-900 text-purple-200 border border-purple-500/50 flex items-center gap-1 font-bold">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  {aiState.engine === 'elevenlabs'
                    ? 'ElevenLabs AI 🎙️ (فابور)'
                    : aiState.audioUrl
                    ? 'Gemini AI Voice 🌟'
                    : 'SpeechSynthesis Engine 🎙️'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Shortcuts help toggle */}
            <button
              onClick={() => setShowShortcutsHelp(!showShortcutsHelp)}
              aria-label="اختصارات لوحة المفاتيح للقراءة الصوتية"
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              title="اختصارات لوحة المفاتيح الميسرة"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Audio Settings Modal Trigger */}
            <button
              onClick={onOpenSettings}
              aria-label="فتح إعدادات الصوت والنبرة"
              className="px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/80 text-indigo-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              title="تخصيص نبرة الصوت والمؤدي"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-300" />
              <span className="hidden sm:inline">إعدادات الصوت</span>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="إغلاق قارئ الصفحة الصوتي"
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              title="إغلاق القارئ الصوتي"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Shortcuts quick legend if opened */}
        {showShortcutsHelp && (
          <div className="p-2.5 rounded-xl bg-indigo-950/70 border border-indigo-700/60 text-xs text-indigo-200 space-y-1 animate-in fade-in duration-150">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>اختصارات لوحة المفاتيح لتسهيل الوصول والتنقل:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 font-mono text-white text-[10px]">
                  Space
                </kbd>
                <span>تشغيل / إيقاف مؤقت</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 font-mono text-white text-[10px]">
                  Alt + →
                </kbd>
                <span>الجملة التالية</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 font-mono text-white text-[10px]">
                  Alt + ←
                </kbd>
                <span>الجملة السابقة</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 font-mono text-white text-[10px]">
                  Esc
                </kbd>
                <span>إيقاف القارئ</span>
              </div>
            </div>
          </div>
        )}

        {/* Live Active Sentence Karaoke Display */}
        <div
          aria-live="polite"
          className="p-3 rounded-xl bg-stone-950/80 border border-indigo-900/60 text-stone-200 min-h-[58px] flex items-center justify-between gap-3 shadow-inner"
        >
          <div className="text-left text-sm sm:text-base font-serif italic text-indigo-100 flex-1 leading-relaxed">
            {currentSentence ? (
              renderSentenceWithActiveWord()
            ) : (
              <span className="text-stone-500 font-arabic not-italic text-xs">
                انقر فوق &quot;تشغيل&quot; لبدء قراءة الصفحة صوتياً وتتبع الجمل والكلمات كلمة بكلمة...
              </span>
            )}
          </div>
          {totalSentences > 0 && (
            <div className="shrink-0 text-right font-mono text-[11px] text-stone-400 bg-stone-900 px-2 py-1 rounded-lg border border-stone-800">
              <span className="text-indigo-300 font-bold">{currentSentenceIndex + 1}</span> /{' '}
              <span>{totalSentences}</span>
            </div>
          )}
        </div>

        {/* Visual Progress Bar with Interactive Scrubber */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
            <span>التقدم في قراءة الصفحة: {progressPercent}%</span>
            <span>
              الجملة {currentSentenceIndex + 1} من {totalSentences}
            </span>
          </div>
          <div
            className="w-full h-2 rounded-full bg-stone-800 relative overflow-hidden cursor-pointer"
            onClick={(e) => {
              if (totalSentences <= 0) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              const targetIdx = Math.floor(ratio * totalSentences);
              accessibleTTS.playFromIndex(targetIdx);
            }}
            title="انقر للانتقال لموضع محدد في الصفحة"
          >
            <div
              className="h-full bg-linear-to-r from-indigo-500 via-indigo-400 to-amber-400 rounded-full transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          {/* Main Playback Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Skip Previous Sentence */}
            <button
              onClick={() => accessibleTTS.prevSentence()}
              disabled={currentSentenceIndex <= 0}
              aria-label="الجملة السابقة"
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-750 disabled:opacity-40 disabled:cursor-not-allowed text-stone-200 hover:text-white transition-colors cursor-pointer"
              title="الجملة السابقة (Alt + ←)"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Replay Current Sentence */}
            <button
              onClick={() => accessibleTTS.replayCurrentSentence()}
              aria-label="إعادة الجملة الحالية"
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 hover:text-white transition-colors cursor-pointer"
              title="إعادة نطق الجملة الحالية"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Play / Pause Toggle */}
            <button
              onClick={() => {
                const aiState = getAIAudioState();
                if (aiState.isPlaying && !aiState.isPaused) {
                  pauseAIAudio();
                } else if (aiState.isPaused) {
                  resumeAIAudio();
                } else if (isPlaying && !isPaused) {
                  accessibleTTS.pause();
                } else if (isPaused) {
                  accessibleTTS.resume();
                } else {
                  accessibleTTS.play();
                }
              }}
              aria-label={isPlaying && !isPaused ? 'إيقاف مؤقت للقراءة' : 'تشغيل القراءة الصوتية'}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
              title={isPlaying && !isPaused ? 'إيقاف مؤقت (Space)' : 'تشغيل القارئ (Space)'}
            >
              {isPlaying && !isPaused ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>إيقاف مؤقت</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isPaused ? 'استئناف' : 'تشغيل القراءة'}</span>
                </>
              )}
            </button>

            {/* Stop Button */}
            <button
              onClick={() => {
                stopAIAudio();
                accessibleTTS.stop();
              }}
              disabled={!isPlaying && !isPaused}
              aria-label="إيقاف كامل للقراءة"
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-750 disabled:opacity-40 disabled:cursor-not-allowed text-rose-300 hover:text-rose-200 transition-colors cursor-pointer"
              title="إيقاف كامل (Esc)"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>

            {/* Skip Next Sentence */}
            <button
              onClick={() => accessibleTTS.nextSentence()}
              disabled={currentSentenceIndex >= totalSentences - 1}
              aria-label="الجملة التالية"
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-750 disabled:opacity-40 disabled:cursor-not-allowed text-stone-200 hover:text-white transition-colors cursor-pointer"
              title="الجملة التالية (Alt + →)"
            >
              <SkipBack className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Presets & Dynamic Slider (0.5x to 2.0x) */}
          <div className="flex items-center gap-2 bg-stone-950 px-2 py-1 rounded-xl border border-stone-800 text-xs font-mono">
            <div className="flex items-center gap-1 shrink-0">
              <Gauge className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-amber-400 font-bold min-w-[38px] text-center">{rate.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={rate}
              onChange={(e) => {
                const r = parseFloat(e.target.value);
                accessibleTTS.setRate(r);
                setAIAudioRate(r);
              }}
              aria-label="تعديل سرعة القراءة الصوتية"
              title={`سرعة القراءة: ${rate.toFixed(2)}x`}
              className="w-16 sm:w-24 h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="hidden sm:flex items-center gap-0.5">
              {[
                { rateVal: 0.5, label: '0.5x' },
                { rateVal: 0.75, label: '0.75x' },
                { rateVal: 1.0, label: '1.0x' },
                { rateVal: 1.25, label: '1.25x' },
                { rateVal: 1.5, label: '1.5x' },
                { rateVal: 2.0, label: '2.0x' },
              ].map((p) => (
                <button
                  key={p.rateVal}
                  onClick={() => {
                    accessibleTTS.setRate(p.rateVal);
                    setAIAudioRate(p.rateVal);
                  }}
                  aria-label={`تغيير السرعة إلى ${p.label}`}
                  className={`px-1.5 py-0.5 rounded-lg transition-all cursor-pointer ${
                    Math.abs(rate - p.rateVal) < 0.05
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'text-stone-400 hover:text-white hover:bg-stone-850'
                  }`}
                  title={`سرعة القراءة: ${p.label}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility Toggles (Bimodal Highlight & Auto-Scroll) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => accessibleTTS.setHighlightBimodal(!highlightBimodal)}
              aria-label={highlightBimodal ? 'تعطيل تتبع النص المرئي' : 'تفعيل تتبع النص المرئي'}
              className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                highlightBimodal
                  ? 'bg-amber-950/80 text-amber-200 border-amber-600/70 shadow-xs'
                  : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
              }`}
              title="تتبع بصري ملون للجمل والكلمات أثناء نطقها (Bimodal Reading للمساعدة البصرية)"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">تتبع بصري</span>
            </button>

            <button
              onClick={() => accessibleTTS.setAutoScroll(!autoScroll)}
              aria-label={autoScroll ? 'تعطيل التمرير التلقائي' : 'تفعيل التمرير التلقائي'}
              className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                autoScroll
                  ? 'bg-indigo-950/80 text-indigo-200 border-indigo-600/70 shadow-xs'
                  : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
              }`}
              title="تمرير الصفحة تلقائياً لمواكبة الجملة المقروءة"
            >
              <Scroll className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">تمرير تلقائي</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
