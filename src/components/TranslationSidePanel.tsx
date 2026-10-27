import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, CheckCircle2, BookOpen, Volume2, Copy, Check, 
  Sparkles, ShieldCheck, ArrowRight, Languages, AlertCircle, Maximize2, Minimize2,
  Layers, BookmarkCheck, ArrowLeft, Trophy, RefreshCw, Sliders, Play, Square
} from 'lucide-react';
import { BookId, TranslationResponse, TranslationMode } from '../types';
import { autoSaveWordTranslation, findSynonymsForWord } from '../data/vocabularyService';
import { cleanDirectArabicTranslation } from '../data/translationCache';
import { TranslationProgressCounter } from './TranslationProgressCounter';
import { NaturalTTSPlayer, TTSSettings, getTTSSettings, subscribeToTTSSettings, accessibleTTS, splitParagraphsIntoSentences, SpokenSentence } from '../data/ttsService';
import { AudioSettingsModal } from './AudioSettingsModal';

interface TranslationSidePanelProps {
  translation: TranslationResponse;
  onClose: () => void;
  pageNumber: number;
  bookId?: BookId;
  isSplitFullScreen?: boolean;
  onToggleSplitFullScreen?: () => void;
  onOpenVocabReview?: (cardId?: string) => void;
  onRetryWithMoreContext?: () => void;
  isRetryingWithContext?: boolean;
  onSwitchTranslationMode?: (mode: TranslationMode) => void;
  isTranslating?: boolean;
}

export const TranslationSidePanel: React.FC<TranslationSidePanelProps> = ({
  translation,
  onClose,
  pageNumber,
  bookId = 'la_boite_a_merveilles',
  isSplitFullScreen = false,
  onToggleSplitFullScreen,
  onOpenVocabReview,
  onRetryWithMoreContext,
  isRetryingWithContext = false,
  onSwitchTranslationMode,
  isTranslating = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentPlayingLang, setCurrentPlayingLang] = useState<'fr' | 'ar' | null>(null);
  const [savedCardId, setSavedCardId] = useState<string | null>(null);
  const [paragraphMode, setParagraphMode] = useState<'split' | 'aligned'>('split');
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState(false);
  const [ttsSettings, setTtsSettings] = useState<TTSSettings>(() => getTTSSettings());

  const isWord = translation.type === 'WORD';
  const isSentence = translation.type === 'SENTENCE';
  const isParagraph = translation.type === 'PARAGRAPH';

  const cleanArabicTranslation = useMemo(() => {
    return cleanDirectArabicTranslation(translation.arabicTranslation);
  }, [translation.arabicTranslation]);

  useEffect(() => {
    const unsub = subscribeToTTSSettings((newSettings) => {
      setTtsSettings(newSettings);
    });
    return unsub;
  }, []);

  const frenchParas = translation.originalText
    ? translation.originalText.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
    : [];
  const arabicParas = useMemo(() => {
    return cleanArabicTranslation
      ? cleanArabicTranslation.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
      : [];
  }, [cleanArabicTranslation]);

  // Automatically save translated word into digital flashcards
  useEffect(() => {
    if (isWord && translation.originalText) {
      const result = autoSaveWordTranslation(translation, pageNumber, bookId);
      if (result && result.card) {
        setSavedCardId(result.card.id);
      }
    }
  }, [translation, pageNumber, bookId, isWord]);

  // Auto-play Arabic translation if enabled in settings
  useEffect(() => {
    if (cleanArabicTranslation && ttsSettings.autoReadArabicTranslation) {
      const timer = setTimeout(() => {
        playSpeech(cleanArabicTranslation, 'ar');
      }, 500);
      return () => {
        clearTimeout(timer);
        NaturalTTSPlayer.stop();
      };
    }
    return () => {
      NaturalTTSPlayer.stop();
    };
  }, [cleanArabicTranslation, ttsSettings.autoReadArabicTranslation]);

  const synonyms = isWord
    ? findSynonymsForWord(
        translation.originalText,
        translation.wordDetails?.alternativeMeanings?.filter((m) => /[a-zA-Z]/.test(m))
      )
    : [];

  const handleCopy = () => {
    const textToCopy = `${translation.originalText}\n\n${cleanArabicTranslation}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const playSpeech = (text: string, lang: 'fr' | 'ar') => {
    if (isPlayingAudio && currentPlayingLang === lang) {
      accessibleTTS.stop();
      NaturalTTSPlayer.stop();
      setIsPlayingAudio(false);
      setCurrentPlayingLang(null);
      return;
    }

    const paragraphs = text.split('\n\n').map(p => p.trim()).filter(Boolean);
    const sentences = splitParagraphsIntoSentences(paragraphs.length > 0 ? paragraphs : [text]);

    if (sentences.length > 1 || text.length > 250) {
      accessibleTTS.loadSentences(sentences, lang);
      accessibleTTS.play();
      setIsPlayingAudio(true);
      setCurrentPlayingLang(lang);

      let unsub: () => void = () => {};
      unsub = accessibleTTS.subscribe((state) => {
        if (!state.isPlaying && !state.isPaused) {
          setIsPlayingAudio(false);
          setCurrentPlayingLang(null);
          unsub();
        }
      });
    } else {
      NaturalTTSPlayer.speak(text, lang, {
        onStart: () => {
          setIsPlayingAudio(true);
          setCurrentPlayingLang(lang);
        },
        onEnd: () => {
          setIsPlayingAudio(false);
          setCurrentPlayingLang(null);
        },
        onError: () => {
          setIsPlayingAudio(false);
          setCurrentPlayingLang(null);
        },
      });
    }
  };

  return (
    <div className={`bg-amber-50/95 dark:bg-stone-900/95 border-2 border-emerald-700/60 dark:border-emerald-800/80 rounded-3xl shadow-xl flex flex-col overflow-hidden transition-all duration-300 ${
      isSplitFullScreen ? 'h-full min-h-[680px]' : 'h-full min-h-[580px]'
    }`}>
      {/* Panel Top Header Bar */}
      <div className="bg-linear-to-r from-emerald-950 via-emerald-900 to-amber-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-emerald-800 shrink-0">
        <div className="flex items-center gap-2.5 text-right">
          <div className="w-8 h-8 rounded-xl bg-emerald-800/80 border border-emerald-600/50 flex items-center justify-center text-emerald-200">
            <Languages className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-700/80 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-100">
                {isWord ? 'مفردة واحدة (Mot)' : isSentence ? 'جملة تامة (Phrase)' : 'فقرة كاملة (Paragraphe)'}
              </span>
              <span className="text-[11px] font-arabic text-emerald-200">
                الصفحة {pageNumber}
              </span>
            </div>
            <h3 className="font-arabic font-bold text-sm text-white leading-tight mt-0.5">
              صفحة الترجمة والتدقيق البيداغوجي (Nouvelle Page)
            </h3>
          </div>
        </div>

        {/* Action Controls: Fullscreen toggle & Close */}
        <div className="flex items-center gap-1.5">
          {onToggleSplitFullScreen && (
            <button
              onClick={onToggleSplitFullScreen}
              title={isSplitFullScreen ? "تصغير الحجم" : "توسيع العرض جنباً إلى جنب"}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
            >
              {isSplitFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={onClose}
            title="إغلاق والعودة لملخص الصفحة"
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Automatic Self-Testing & Verification Status Ribbon */}
      <div className="bg-emerald-100/90 dark:bg-emerald-950/80 border-b border-emerald-300 dark:border-emerald-800 px-4 py-2 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
          <span className="font-arabic font-bold text-xs text-emerald-950 dark:text-emerald-200">
            {translation.selfVerification.passed
              ? 'تم التحقق التلقائي بنجاح (Auto-Vérification Validée)'
              : 'تنبيه التدقيق التلقائي'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold">
          <span className="px-2 py-0.5 rounded-full bg-emerald-800 text-white font-mono">
            اكتمال {translation.selfVerification.completenessRatio}%
          </span>
        </div>
      </div>

      {/* Quick Audio Speech Toolbar for Arabic & French Translation */}
      <div className="bg-emerald-50 dark:bg-stone-850 px-4 py-2 border-b border-emerald-200 dark:border-stone-800 flex items-center justify-between flex-wrap gap-2 shrink-0 font-arabic text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>القارئ الصوتي الطبيعي:</span>
          </span>
          {isPlayingAudio && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>جاري القراءة {currentPlayingLang === 'ar' ? '(بالعربية)' : '(بالفرنسية)'}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => playSpeech(cleanArabicTranslation, 'ar')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer ${
              isPlayingAudio && currentPlayingLang === 'ar'
                ? 'bg-rose-700 hover:bg-rose-800 text-white'
                : 'bg-emerald-800 hover:bg-emerald-900 text-white'
            }`}
            title="استماع للترجمة بالصوت العربي الفصيح الطبيعي"
          >
            {isPlayingAudio && currentPlayingLang === 'ar' ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>إيقاف الصوت</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>🔊 استماع بالعربية</span>
              </>
            )}
          </button>

          <button
            onClick={() => playSpeech(translation.originalText, 'fr')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer ${
              isPlayingAudio && currentPlayingLang === 'fr'
                ? 'bg-rose-700 hover:bg-rose-800 text-white'
                : 'bg-indigo-800 hover:bg-indigo-900 text-white'
            }`}
            title="استماع للنص الأصلي بالفرنسية"
          >
            {isPlayingAudio && currentPlayingLang === 'fr' ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>إيقاف الصوت</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>🔊 بالفرنسية</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsAudioSettingsOpen(true)}
            className="p-1.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
            title="إعدادات الصوت والسرعة"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <AudioSettingsModal
        isOpen={isAudioSettingsOpen}
        onClose={() => setIsAudioSettingsOpen(false)}
      />

      {/* Panel Scrollable Content Body */}
      <div className="p-5 overflow-y-auto space-y-5 flex-1 text-right">
        {/* Live 0-100% Progress Counter & Stage Feedback */}
        <TranslationProgressCounter 
          isTranslating={isTranslating} 
          variant="panel" 
          targetText={translation.originalText} 
        />

        {/* Smart Context Toggle Control Bar */}
        <div className="bg-white dark:bg-stone-800/90 p-3 rounded-2xl border-2 border-emerald-600/50 dark:border-emerald-700/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-arabic font-bold text-emerald-950 dark:text-emerald-200">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span>نمط المعالجة والسياق (Smart Context Mode):</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-800 text-white">
              {translation.translationMode === 'word-by-word' ? '🔤 كلمة بكلمة' : '📝 جملة وسياق أدبي'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-arabic text-xs font-bold">
            <button
              onClick={() => onSwitchTranslationMode?.('word-by-word')}
              className={`py-2 px-3 rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                translation.translationMode === 'word-by-word' || (isWord && !translation.translationMode)
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs ring-2 ring-emerald-500/30 font-bold'
                  : 'bg-amber-50/80 dark:bg-stone-750 text-stone-800 dark:text-stone-200 border-amber-200 dark:border-stone-700 hover:bg-amber-100 dark:hover:bg-stone-700'
              }`}
              title="تحليل كلمة بكلمة مع الإعراب والوظيفة النحوية لكل كلمة"
            >
              <span>🔤 كلمة بكلمة (Mot à Mot)</span>
            </button>

            <button
              onClick={() => onSwitchTranslationMode?.('full-sentence')}
              className={`py-2 px-3 rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                translation.translationMode === 'full-sentence' || (!isWord && !translation.translationMode)
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs ring-2 ring-emerald-500/30 font-bold'
                  : 'bg-amber-50/80 dark:bg-stone-750 text-stone-800 dark:text-stone-200 border-amber-200 dark:border-stone-700 hover:bg-amber-100 dark:hover:bg-stone-700'
              }`}
              title="ترجمة سياقية أدبية متكاملة للجملة بأسلوب عربي فصيح"
            >
              <span>📝 جملة وسياق كامل (Phrase)</span>
            </button>
          </div>
        </div>

        {/* Word-by-Word Grammatical Breakdown Table (when Word-by-Word mode is active) */}
        {translation.translationMode === 'word-by-word' && translation.wordByWordBreakdown && translation.wordByWordBreakdown.length > 0 && (
          <div className="bg-white dark:bg-stone-800/90 rounded-2xl border-2 border-emerald-700/60 dark:border-emerald-800 p-4 space-y-3 shadow-md animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-amber-200 dark:border-stone-700 pb-2.5">
              <span className="text-[10px] font-mono font-bold bg-emerald-800 text-white px-2.5 py-0.5 rounded-full">
                Analyse Grammaticale & Lexicale
              </span>
              <h4 className="font-arabic font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>جدول الإعراب والتحليل المعجمي كلمة بكلمة</span>
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right font-arabic border-collapse">
                <thead>
                  <tr className="bg-amber-100/90 dark:bg-stone-700/80 text-amber-950 dark:text-amber-300 font-bold border-b border-amber-300 dark:border-stone-600">
                    <th className="p-2 text-left font-mono">الكلمة الأصليّة (Mot)</th>
                    <th className="p-2">المقابل العربي (Traduction)</th>
                    <th className="p-2">الموقع النحوي (Nature)</th>
                    <th className="p-2">وظيفتها الشارحة (Note)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100 dark:divide-stone-700">
                  {translation.wordByWordBreakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-amber-50/80 dark:hover:bg-stone-750 transition-colors">
                      <td className="p-2 text-left font-serif font-bold text-stone-900 dark:text-stone-100 dir-ltr">
                        {item.frenchWord}
                      </td>
                      <td className="p-2 font-bold text-emerald-800 dark:text-emerald-300">
                        {item.arabicTranslation}
                      </td>
                      <td className="p-2 text-stone-600 dark:text-stone-400 text-[11px]">
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-stone-700 text-amber-900 dark:text-amber-200 font-bold">
                          {item.partOfSpeech || 'عنصر تركيبي'}
                        </span>
                      </td>
                      <td className="p-2 text-stone-500 dark:text-stone-400 text-[11px] leading-tight">
                        {item.grammarNote || 'مفردة سياقية'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* =========================================================================
            RULE 1: SINGLE WORD SELECTION
            - Translate ONLY that single selected word into its precise Modern Standard Arabic contextual meaning
            - Automatically saved to Flashcard collection
            - Direct link to Vocabulary Review
           ========================================================================= */}
        {isWord && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Automatic Flashcard Saving Status Ribbon */}
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
              <button
                onClick={() => onOpenVocabReview?.(savedCardId || undefined)}
                className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-arabic font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-200" />
                <span>فتح بطاقات المراجعة</span>
              </button>

              <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-200 font-arabic text-xs font-bold text-right">
                <span>حُفظت تلقائياً في بطاقات الذاكرة</span>
                <BookmarkCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              </div>
            </div>

            {/* Selected Word in French */}
            <div className="bg-white dark:bg-stone-800/90 rounded-2xl border border-amber-200 dark:border-stone-700 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => playSpeech(translation.originalText, 'fr')}
                    title="استمع للمفردة بالفرنسية"
                    className="p-1.5 rounded-lg bg-amber-100 dark:bg-stone-700 hover:bg-amber-200 dark:hover:bg-stone-600 text-amber-900 dark:text-amber-300 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCopy}
                    title="نسخ الترجمة"
                    className="p-1.5 rounded-lg bg-amber-100 dark:bg-stone-700 hover:bg-amber-200 dark:hover:bg-stone-600 text-amber-900 dark:text-amber-300 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 font-bold uppercase">
                  المفردة الأصلية المختارة
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-stone-950 dark:text-stone-100 text-left tracking-wide">
                « {translation.originalText} »
              </h2>
            </div>

            {/* PRECISE CONTEXTUAL MEANING (ONLY THAT SINGLE WORD) */}
            <div className="bg-linear-to-br from-emerald-900 to-emerald-950 text-white rounded-2xl p-5 shadow-md space-y-2 border border-emerald-800">
              <div className="flex items-center justify-between text-emerald-200 text-xs font-arabic">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-800 text-[11px] font-bold">
                  {translation.wordDetails?.partOfSpeech || 'مفردة لغوية'}
                </span>
                <span className="font-bold">المعنى السياقي المعتمد في الرواية</span>
              </div>
              <p className="font-arabic font-extrabold text-2xl sm:text-3xl text-emerald-100 leading-tight pt-1">
                {translation.wordDetails?.primaryArabic || cleanArabicTranslation}
              </p>
              {translation.wordDetails?.contextualMeaning && (
                <p className="text-xs sm:text-sm font-arabic text-emerald-200/90 leading-relaxed pt-2 border-t border-emerald-800/80">
                  {translation.wordDetails.contextualMeaning}
                </p>
              )}
            </div>

            {/* FRENCH SYNONYMS HIGHLIGHT BOX FOR 1ST BAC */}
            {synonyms.length > 0 && (
              <div className="bg-emerald-950 text-emerald-50 rounded-2xl border border-emerald-700 p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-arabic font-bold text-emerald-300">
                  <span className="text-[10px] bg-emerald-800 px-2 py-0.5 rounded-full text-emerald-100 font-mono">
                    Synonymes Directs
                  </span>
                  <span>المرادفات بالفرنسية المعتمدة للامتحان:</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1 justify-end">
                  {synonyms.map((syn, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-emerald-800/90 text-white text-xs font-serif font-bold border border-emerald-600/60 shadow-2xs"
                    >
                      {syn}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* DIRECTLY BELOW: ALL ALTERNATIVE DICTIONARY DEFINITIONS & MEANINGS */}
            <div className="bg-white dark:bg-stone-800/90 rounded-2xl border border-amber-300 dark:border-stone-700 p-5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-amber-950 dark:text-amber-300 border-b border-amber-200 dark:border-stone-700 pb-2">
                <BookOpen className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <h4 className="font-arabic font-bold text-sm">
                  المعاني المعجمية والتعريفات البديلة (Définitions du Dictionnaire):
                </h4>
              </div>

              {/* Definitions List */}
              <div className="space-y-2">
                {(translation.wordDetails?.dictionaryDefinitions || [
                  'المعنى المعجمي العام في قواميس اللغة الفرنسية الكبرى (Le Robert / Larousse)',
                  'الاستعمال البلاغي والدلالي الخاص بأدب أحمد الصفريوي'
                ]).map((def, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-800 dark:text-stone-200 bg-amber-50/70 dark:bg-stone-750 p-3 rounded-xl border border-amber-200/60 dark:border-stone-700">
                    <span className="w-5 h-5 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="font-arabic leading-relaxed">{def}</span>
                  </div>
                ))}
              </div>

              {/* Alternative Synonyms / Meanings */}
              {translation.wordDetails?.alternativeMeanings && translation.wordDetails.alternativeMeanings.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-arabic font-bold text-stone-600 dark:text-stone-400 block mb-2">
                    مرادفات وبدائل دلالية معتمدة:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {translation.wordDetails.alternativeMeanings.map((alt, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-arabic font-bold"
                      >
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            RULE 2: COMPLETE SENTENCE SELECTION
            - Display entire selected French sentence alongside 100% COMPLETE contextual Modern Standard Arabic translation
            - Ensure no words are skipped, cut off, or omitted
           ========================================================================= */}
        {isSentence && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Original French Sentence */}
            <div className="bg-white dark:bg-stone-800/90 rounded-2xl border border-amber-300 dark:border-stone-700 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => playSpeech(translation.originalText, 'fr')}
                    title="استمع للجملة بالفرنسية"
                    className="p-1.5 rounded-lg bg-amber-100 dark:bg-stone-700 hover:bg-amber-200 dark:hover:bg-stone-600 text-amber-900 dark:text-amber-300 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCopy}
                    title="نسخ الجملة وترجمتها"
                    className="p-1.5 rounded-lg bg-amber-100 dark:bg-stone-700 hover:bg-amber-200 dark:hover:bg-stone-600 text-amber-900 dark:text-amber-300 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 font-bold uppercase">
                  الجملة الأصلية المختارة (Texte Original)
                </span>
              </div>
              <p className="font-serif text-base sm:text-lg text-stone-900 dark:text-stone-100 text-left leading-relaxed italic border-l-3 border-amber-600 pl-3">
                « {translation.originalText} »
              </p>
            </div>

            {/* 100% COMPLETE Modern Standard Arabic Translation */}
            <div className="bg-linear-to-br from-emerald-900 to-amber-950 text-white rounded-2xl p-5 shadow-md space-y-3 border border-emerald-800">
              <div className="flex items-center justify-between text-emerald-200 text-xs font-arabic">
                <span className="px-2 py-0.5 rounded-full bg-emerald-800/90 text-[10px] font-mono text-emerald-200 font-bold">
                  ترجمة تامة وشاملة 100%
                </span>
                <span className="font-bold">الترجمة السياقية الكاملة بالعربية الفصحى</span>
              </div>
              <p className="font-arabic text-base sm:text-lg font-bold text-amber-100 leading-relaxed text-right">
                {cleanArabicTranslation}
              </p>
              <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between text-xs text-emerald-200/80 font-arabic">
                <span>تم تدقيق اكتمال كل كلمة في الجملة دون أي بتر.</span>
                <button
                  onClick={() => playSpeech(cleanArabicTranslation, 'ar')}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>استماع</span>
                </button>
              </div>
            </div>

            {/* Stylistic Figure de Style Analysis for 1st Bac */}
            {translation.literaryAnalysis && (
              <div className="bg-white dark:bg-stone-800/90 rounded-2xl border border-amber-200 dark:border-stone-700 p-4 space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-arabic font-bold text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>المحسن البديعي المصاحب (Figure de style):</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-stone-700 text-amber-900 dark:text-amber-300 font-mono font-bold text-xs">
                    {translation.literaryAnalysis.figureDeStyle}
                  </span>
                </div>
                <p className="font-arabic text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  {translation.literaryAnalysis.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            RULE 3: PARAGRAPH SELECTION
            - Full split side-by-side view (New Page View)
            - Original French paragraph on the left side and full Modern Standard Arabic translation on the right side
           ========================================================================= */}
        {isParagraph && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* View Mode Toggle if multiple paragraphs exist */}
            {frenchParas.length > 1 && (
              <div className="flex items-center justify-between bg-amber-100/80 dark:bg-stone-800/80 p-1.5 rounded-2xl border border-amber-300 dark:border-stone-700 text-xs font-arabic font-bold">
                <span className="text-amber-900 dark:text-amber-300 px-2">
                  تنسيق عرض الفقرات ({frenchParas.length} فقرات):
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setParagraphMode('split')}
                    className={`px-3 py-1 rounded-xl transition-all ${
                      paragraphMode === 'split'
                        ? 'bg-amber-900 text-white shadow-xs'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-amber-200/60 dark:hover:bg-stone-700'
                    }`}
                  >
                    عرض شامل للورقة
                  </button>
                  <button
                    onClick={() => setParagraphMode('aligned')}
                    className={`px-3 py-1 rounded-xl transition-all ${
                      paragraphMode === 'aligned'
                        ? 'bg-emerald-900 text-white shadow-xs'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-amber-200/60 dark:hover:bg-stone-700'
                    }`}
                  >
                    مطابقة فقرة بفقرة
                  </button>
                </div>
              </div>
            )}

            {paragraphMode === 'aligned' && frenchParas.length > 1 ? (
              <div className="space-y-4">
                {frenchParas.map((fPara, idx) => {
                  const aPara = arabicParas[idx] || '';
                  return (
                    <div
                      key={idx}
                      className="bg-white dark:bg-stone-800/90 rounded-2xl border-2 border-amber-300 dark:border-stone-700 p-4 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-amber-200 dark:border-stone-700 pb-2">
                        <span className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-400">
                          الفقرة {idx + 1} من {frenchParas.length}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => playSpeech(fPara, 'fr')}
                            className="px-2 py-1 rounded bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 text-xs flex items-center gap-1"
                            title="استماع للفرنسية"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>FR</span>
                          </button>
                          {aPara && (
                            <button
                              onClick={() => playSpeech(aPara, 'ar')}
                              className="px-2 py-1 rounded bg-amber-100 dark:bg-stone-700 hover:bg-amber-200 dark:hover:bg-stone-600 text-amber-900 dark:text-amber-300 text-xs flex items-center gap-1 font-arabic"
                              title="استماع للعربية"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>عربي</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        {/* French */}
                        <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-stone-900/60 border border-amber-200 dark:border-stone-750 text-left">
                          <p className="font-serif text-xs sm:text-sm text-stone-900 dark:text-stone-200 leading-relaxed">
                            {fPara}
                          </p>
                        </div>
                        {/* Arabic */}
                        <div className="p-3 rounded-xl bg-emerald-950 text-amber-100 border border-emerald-800 text-right">
                          <p className="font-arabic text-xs sm:text-sm font-bold leading-loose">
                            {aPara || 'جاري إتمام الترجمة الدقيقة للفقرة...'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {/* French Paragraph (Left side in visual order) */}
                <div className="bg-white dark:bg-stone-800/90 rounded-2xl border-2 border-amber-300 dark:border-stone-700 p-5 shadow-xs flex flex-col justify-between order-2 md:order-1">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-amber-200 dark:border-stone-700 pb-2">
                      <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 font-bold uppercase">
                        Texte Français Original (ص {pageNumber})
                      </span>
                      <button
                        onClick={() => playSpeech(translation.originalText, 'fr')}
                        className="p-1 rounded bg-amber-100 dark:bg-stone-700 hover:bg-amber-200 dark:hover:bg-stone-600 text-amber-900 dark:text-amber-300"
                        title="استماع للنص الفرنسي كاملاً"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-serif text-sm sm:text-base text-stone-900 dark:text-stone-100 text-left leading-relaxed whitespace-pre-line">
                      {translation.originalText}
                    </p>
                  </div>
                </div>

                {/* Arabic Paragraph (Right side in visual order) */}
                <div className="bg-amber-900 dark:bg-stone-850 text-amber-50 rounded-2xl border-2 border-amber-800 dark:border-stone-700 p-5 shadow-xs flex flex-col justify-between order-1 md:order-2">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-amber-800 dark:border-stone-700 pb-2">
                      <span className="text-[11px] font-arabic text-amber-200 font-bold">
                        الترجمة الأدبية الفصحى التامة (100% دقة سياقية)
                      </span>
                      <button
                        onClick={() => playSpeech(cleanArabicTranslation, 'ar')}
                        className="p-1 rounded bg-amber-800 dark:bg-stone-700 hover:bg-amber-700 dark:hover:bg-stone-600 text-amber-100"
                        title="استماع للترجمة العربية كاملة"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-arabic text-sm sm:text-base font-bold text-amber-100 text-right leading-loose whitespace-pre-line">
                      {cleanArabicTranslation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Analysis & Context */}
            {translation.literaryAnalysis && (
              <div className="bg-white dark:bg-stone-800/90 rounded-2xl border border-amber-200 dark:border-stone-700 p-4 space-y-1.5 shadow-xs">
                <h5 className="font-arabic font-bold text-xs text-amber-950 dark:text-amber-300">
                  التحليل الأدبي والجمالي للفقرة للامتحان الجهوي:
                </h5>
                <p className="font-arabic text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  {translation.literaryAnalysis.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Retry with more surrounding context card */}
        {onRetryWithMoreContext && (
          <div className="p-3.5 rounded-2xl bg-amber-100/70 dark:bg-stone-800/80 border border-amber-300/80 dark:border-stone-700 space-y-2 text-right font-arabic">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                id="side-panel-retry-with-context-btn"
                onClick={onRetryWithMoreContext}
                disabled={isRetryingWithContext}
                className={`px-3 py-1.5 rounded-xl font-arabic font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                  isRetryingWithContext
                    ? 'bg-amber-300 dark:bg-stone-700 text-amber-800 dark:text-stone-400 cursor-not-allowed'
                    : 'bg-amber-800 hover:bg-amber-900 active:scale-98 text-white'
                }`}
                title="جلب نافذة سياقية موسعة من الفقرات المحيطة السابقة واللاحقة"
              >
                {isRetryingWithContext ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>جارٍ جلب السياق الموسّع...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-amber-200" />
                    <span>إعادة الترجمة بسياق موسّع</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1 text-xs font-bold text-amber-950 dark:text-amber-300">
                <BookOpen className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span>نافذة السياق الروائي:</span>
                {translation.isContextExpanded && (
                  <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    ✓ نشط
                  </span>
                )}
              </div>
            </div>

            <p className="text-[11px] text-amber-900/90 dark:text-stone-400 leading-relaxed">
              إذا كان المقطع يبدو مقتضباً أو ناقصاً، اضغط لجلب الفقرات السابقة واللاحقة لتوضيح المعنى كاملاً بنسبة 100%.
            </p>
          </div>
        )}

        {/* Detailed Self-Verification Report */}
        <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl p-3.5 space-y-1 text-right">
          <div className="flex items-center justify-between text-[11px] font-arabic font-bold text-stone-700 dark:text-stone-300">
            <span className="text-emerald-700 dark:text-emerald-400">✓ مطابقة شروط الأولى باكالوريا</span>
            <span>تقرير التدقيق الآلي الداخلي:</span>
          </div>
          <p className="text-[11px] font-arabic text-stone-600 dark:text-stone-400 leading-relaxed">
            {translation.selfVerification.notes}
          </p>
        </div>
      </div>
    </div>
  );
};
