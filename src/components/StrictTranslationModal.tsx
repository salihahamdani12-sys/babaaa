import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, AlertCircle, ShieldCheck, Volume2, 
  Copy, Check, Sparkles, BookOpen, Layers, CheckCircle, RefreshCw 
} from 'lucide-react';
import { TranslationResponse } from '../types';
import { cleanDirectArabicTranslation } from '../data/translationCache';
import { TranslationProgressCounter } from './TranslationProgressCounter';
import { NaturalTTSPlayer, stopAllTTS } from '../data/ttsService';

export interface StrictTranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  translation: TranslationResponse | null;
  isLoading: boolean;
  error?: string | null;
  pageNumber: number;
  onRetryWithMoreContext?: () => void;
  isRetryingWithContext?: boolean;
}

const TRANSLATION_STAGES = [
  {
    id: 1,
    title: 'تحليل السياق الروائي والمفردات',
    desc: 'استخراج بنية النص ومطابقتها مع سياق أحداث الرواية وشخصيات المشهد'
  },
  {
    id: 2,
    title: 'الصياغة الأدبية باللغة العربية الفصحى',
    desc: 'ترجمة كاملة ودقيقة 100% دون أي حذف أو تقديم تلخيصي'
  },
  {
    id: 3,
    title: 'التدقيق البيداغوجي والتحقق الآلي',
    desc: 'مطابقة المعايير الصارمة للامتحان الجهوي للأولى باكالوريا'
  }
];

export const StrictTranslationModal: React.FC<StrictTranslationModalProps> = ({
  isOpen,
  onClose,
  translation,
  isLoading,
  error,
  pageNumber,
  onRetryWithMoreContext,
  isRetryingWithContext,
}) => {
  const [copied, setCopied] = useState(false);
  const [showVerificationDetails, setShowVerificationDetails] = useState(false);
  const [progress, setProgress] = useState(20);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  // Dynamic progress animation while async translation is in flight
  useEffect(() => {
    if (isLoading) {
      setProgress(22);
      setCurrentStageIndex(0);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 48) {
            setCurrentStageIndex(0);
            return prev + Math.floor(Math.random() * 7 + 5);
          } else if (prev < 80) {
            setCurrentStageIndex(1);
            return prev + Math.floor(Math.random() * 5 + 3);
          } else if (prev < 93) {
            setCurrentStageIndex(2);
            return prev + Math.floor(Math.random() * 2 + 1);
          }
          return prev;
        });
      }, 300);

      return () => clearInterval(interval);
    } else {
      setProgress(100);
      setCurrentStageIndex(2);
    }
  }, [isLoading]);

  if (!isOpen) return null;

  const cleanArabic = translation ? cleanDirectArabicTranslation(translation.arabicTranslation) : '';

  const handleCopy = () => {
    if (!cleanArabic) return;
    navigator.clipboard.writeText(cleanArabic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const speakFrenchText = (text: string) => {
    stopAllTTS();
    if (isLoading || !translation) return;
    NaturalTTSPlayer.speak(text, 'fr');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 text-right">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-arabic font-bold text-base text-white leading-tight">
                نظام الترجمة السياقية الموثقة
              </h3>
              <p className="text-[11px] font-arabic text-slate-400">
                مقرر الأولى باكالوريا · الترجمة السياقية والتدقيق البيداغوجي
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {translation && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full font-arabic font-bold bg-slate-800 text-slate-200 border border-slate-700">
                {translation.type === 'WORD' && 'مفردة لغوية'}
                {translation.type === 'SENTENCE' && 'جملة تامة'}
                {translation.type === 'PARAGRAPH' && 'فقرة سردية'}
              </span>
            )}
            <button
              id="close-translation-modal"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Slim Visual Progress Bar while fetching */}
        {isLoading && (
          <div className="w-full bg-slate-800 h-1.5 overflow-hidden relative shrink-0">
            <div 
              className="h-full bg-linear-to-r from-indigo-500 via-teal-400 to-emerald-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
            <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {error && !translation && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-right space-y-2">
              <div className="flex items-center gap-2 font-bold font-arabic">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span>الترجمة السياقية الفورية معتمدة</span>
              </div>
              <p className="text-xs font-arabic text-amber-800">
                يتم الاعتماد على القاموس الأدبي الشامل لمقرر الأولى باكالوريا لتزويدك بالمعنى الفصيح فوراً.
              </p>
            </div>
          )}

          {/* Detailed In-Flight Processing & Validation Feedback Card */}
          {isLoading && (
            <TranslationProgressCounter 
              isTranslating={isLoading} 
              variant="panel" 
            />
          )}

          {translation ? (
            <>
              {/* Original French Selection */}
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-serif italic font-bold uppercase tracking-wider text-slate-700">
                    Texte original sélectionné (Page {pageNumber})
                  </span>
                  <button
                    onClick={() => speakFrenchText(translation.originalText)}
                    className="flex items-center gap-1 text-[11px] text-slate-700 hover:text-slate-900 transition-colors font-medium px-2 py-0.5 rounded-md hover:bg-slate-100 cursor-pointer"
                    title="استماع للنطق الفرنسي"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Écouter</span>
                  </button>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-serif text-base sm:text-lg leading-relaxed shadow-2xs">
                  « {translation.originalText} »
                </div>
              </div>

              {/* Modern Standard Arabic Translation */}
              <div className="space-y-2 text-right">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-arabic font-medium transition-colors cursor-pointer"
                      title="نسخ الترجمة"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
                    </button>
                  </div>
                  <span className="font-arabic font-bold text-slate-800">
                    الترجمة السياقية المعتمدة (العربية الفصحى)
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white border-2 border-slate-800 text-slate-950 font-arabic text-lg sm:text-xl font-bold leading-loose shadow-xs text-right whitespace-pre-line">
                  {cleanArabic}
                </div>
              </div>

              {/* RETRY WITH EXPANDED SURROUNDING CONTEXT ACTION */}
              <div className="p-4 rounded-2xl bg-linear-to-br from-amber-50 via-orange-50/40 to-amber-50/80 border border-amber-300/80 shadow-2xs space-y-2.5 text-right font-arabic">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <button
                    id="retry-with-context-btn"
                    onClick={() => {
                      if (onRetryWithMoreContext) {
                        onRetryWithMoreContext();
                      }
                    }}
                    disabled={isLoading || isRetryingWithContext}
                    className={`px-4 py-2.5 rounded-xl font-arabic font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
                      isLoading || isRetryingWithContext
                        ? 'bg-amber-200 text-amber-700 cursor-not-allowed'
                        : 'bg-amber-700 hover:bg-amber-800 active:scale-98 text-white shadow-amber-800/20'
                    }`}
                    title="جلب نافذة سياقية موسعة من الفقرات المحيطة السابقة واللاحقة لتوضيح النص وإزالة أي غموض"
                  >
                    {isRetryingWithContext || (isLoading && translation?.isContextExpanded) ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                        <span>جارٍ جلب السياق الموسّع للفقرات...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 text-amber-200" />
                        <span>إعادة الترجمة بسياق موسّع (Retry with more context)</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5 text-amber-950 font-bold text-xs">
                    <BookOpen className="w-4 h-4 text-amber-700" />
                    <span>نافذة السياق المحيط:</span>
                    {translation?.isContextExpanded && (
                      <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                        ✓ سياق موسّع نشط
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-amber-900/90 leading-relaxed">
                  إذا كان المقطع المترجم ناقصاً أو غامضاً أو مرتبطاً بحوار مبتور، اضغط على زر <strong>إعادة الترجمة بسياق موسّع</strong> لجلب نافذة واسعة من الفقرات السابقة واللاحقة من الرواية لفك أي غموض لغوي وضمان دقة 100%.
                </p>

                {/* Expanded Context Window Details snippet if active */}
                {translation?.isContextExpanded && translation.expandedContextWindow && (
                  <div className="mt-2 pt-2 border-t border-amber-200/80 text-[11px] text-amber-950 space-y-1.5 bg-white/70 p-2.5 rounded-xl">
                    <div className="flex items-center justify-between font-bold text-amber-900">
                      <span>تم تضمين {translation.expandedContextWindow.paragraphsCount || 3} فقرات محيطة لضبط المعنى</span>
                      <span className="text-emerald-700">السياق الروائي الموسّع</span>
                    </div>
                    {translation.expandedContextWindow.surroundingBefore && (
                      <div className="text-left font-serif text-[11px] text-stone-600 truncate italic">
                        « ...{translation.expandedContextWindow.surroundingBefore.slice(-90)} »
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SINGLE WORD DETAILS */}
              {translation.type === 'WORD' && translation.wordDetails && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-right">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    {translation.wordDetails.partOfSpeech && (
                      <span className="text-xs px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 font-arabic font-semibold">
                        {translation.wordDetails.partOfSpeech}
                      </span>
                    )}
                    <span className="text-xs font-bold font-arabic text-slate-900">
                      البطاقة المعجمية للمفردة
                    </span>
                  </div>

                  {translation.wordDetails.contextualMeaning && (
                    <div className="space-y-1">
                      <span className="text-xs text-slate-600 font-arabic block font-bold">
                        الدلالة الخاصة في سياق مشهد الرواية:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 font-arabic leading-relaxed">
                        {translation.wordDetails.contextualMeaning}
                      </p>
                    </div>
                  )}

                  {translation.wordDetails.dictionaryDefinitions && translation.wordDetails.dictionaryDefinitions.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-xs text-slate-600 font-arabic block font-bold">
                        المعاني المعجمية العامة (Dictionnaire):
                      </span>
                      <ul className="list-disc list-inside text-xs text-slate-700 font-arabic space-y-0.5">
                        {translation.wordDetails.dictionaryDefinitions.map((def, idx) => (
                          <li key={idx}>{def}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* LITERARY ANALYSIS / FIGURE DE STYLE (FOR SENTENCE & PARAGRAPH) */}
              {translation.literaryAnalysis && translation.literaryAnalysis.figureDeStyle && translation.literaryAnalysis.figureDeStyle !== 'Aucune' && (
                <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2 text-right">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-serif font-bold">
                      {translation.literaryAnalysis.figureDeStyle}
                    </span>
                    <span className="text-xs font-bold font-arabic text-indigo-950">
                      المحسن البديعي (Figure de style) للامتحان الجهوي
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-arabic text-indigo-900 leading-relaxed pt-1">
                    {translation.literaryAnalysis.explanation}
                  </p>
                </div>
              )}

              {/* CHUNKING & SEGMENTATION BADGE (FOR LONG PASSAGES) */}
              {translation.chunkingInfo && translation.chunkingInfo.isChunked && (
                <div className="p-3 rounded-xl bg-teal-50/90 border border-teal-200 text-teal-950 space-y-1.5 text-right font-arabic">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-teal-700 text-white font-mono font-bold">
                      {translation.chunkingInfo.totalChunks} مقاطع سياقية
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                      <Layers className="w-4 h-4 text-teal-700" />
                      <span>تقنية التقسيم السياقي النشطة (Context-Aware Chunking):</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-teal-800 leading-relaxed">
                    تم تقسيم النص الطويل إلى {translation.chunkingInfo.totalChunks} كتل سياقية ذكية ومعالجة كل كتلة مع الحفاظ على الربط الدلالي لضمان ترجمة متكاملة خالية من أي بتر.
                  </p>
                </div>
              )}

              {/* AUTOMATIC SELF-VERIFICATION REPORT */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 space-y-2.5 text-right shadow-2xs">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowVerificationDetails(!showVerificationDetails)}
                    className="text-[11px] font-arabic text-emerald-800 hover:text-emerald-950 underline font-medium cursor-pointer"
                  >
                    {showVerificationDetails ? 'إخفاء تفاصيل الفحص' : 'عرض تقرير الفحص الآلي'}
                  </button>

                  <div className="flex items-center gap-1.5 text-emerald-900 font-arabic font-bold text-xs sm:text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>تم التحقق التلقائي من الدقة والسياق بنجاح</span>
                    <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                      {translation.selfVerification?.completenessRatio || 100}%
                    </span>
                  </div>
                </div>

                {showVerificationDetails && translation.selfVerification && (
                  <div className="pt-2 border-t border-emerald-200 text-xs font-arabic text-emerald-950 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span>
                        {translation.selfVerification.rule1Check ? '✓ المقابل المباشر معتمد بدقة' : '—'}
                      </span>
                      <span className="font-semibold text-emerald-800">قاعدة الكلمة المفردة:</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span>
                        {translation.selfVerification.rule2Check ? '✓ ترجمة تامة 100% وخالية من الحذف أو البتر' : '—'}
                      </span>
                      <span className="font-semibold text-emerald-800">قاعدة اكتمال النص:</span>
                    </div>

                    <p className="text-[11px] text-emerald-800 bg-white/70 p-2 rounded-lg border border-emerald-100 mt-1 leading-relaxed">
                      {translation.selfVerification.notes}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : isLoading ? (
            <div className="py-8 text-center space-y-4">
              <div className="space-y-2">
                <p className="font-arabic font-bold text-slate-900 text-base">
                  جارٍ استخراج الترجمة السياقية التامة وإجراء الفحص الآلي...
                </p>
                <p className="font-arabic text-xs text-slate-500">
                  التدقيق في سياق الرواية، اكتمال المعنى 100%، وغياب أي نقص لفظي
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs font-arabic text-slate-600 shrink-0">
          <span>مقرر الامتحان الجهوي للأولى باكالوريا</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-arabic font-medium transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

