import React, { useState } from 'react';
import {
  X,
  Download,
  FileSpreadsheet,
  Printer,
  Copy,
  Check,
  FileText,
  Sparkles,
  Layers,
  BookOpen,
  ArrowRight,
  ExternalLink,
  FileDown,
  Loader2
} from 'lucide-react';
import { FlashcardWord, BookId } from '../types';
import {
  exportVocabularyToCSV,
  exportVocabularyToAnki,
  exportVocabularyToJSON,
  copyVocabularyToClipboard,
  printVocabularyRevisionSheet,
  exportVocabularyToPDF
} from '../data/vocabularyExportService';
import { getBookInfo } from '../data/bookService';

interface VocabularyExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredCards: FlashcardWord[];
  allCards: FlashcardWord[];
  activeBookId: BookId;
}

export const VocabularyExportModal: React.FC<VocabularyExportModalProps> = ({
  isOpen,
  onClose,
  filteredCards,
  allCards,
  activeBookId,
}) => {
  // Default to 'all' so user can export all flashcard words at once
  const [exportScope, setExportScope] = useState<'filtered' | 'active_book' | 'all'>('all');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<{ percent: number; statusText: string } | null>(null);

  if (!isOpen) return null;

  const currentBookInfo = getBookInfo(activeBookId);
  const activeBookCards = allCards.filter((c) => c.bookId === activeBookId);

  // Cards selected based on scope
  const targetCards =
    exportScope === 'filtered'
      ? filteredCards
      : exportScope === 'active_book'
      ? activeBookCards
      : allCards;

  const showNotification = (msg: string) => {
    setDownloadSuccessMessage(msg);
    setTimeout(() => {
      setDownloadSuccessMessage(null);
    }, 4000);
  };

  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return;
    setIsGeneratingPDF(true);
    setPdfProgress({ percent: 5, statusText: 'بدء إعداد صفحات الـ PDF...' });
    try {
      await exportVocabularyToPDF(
        targetCards,
        {
          bookFilter: exportScope === 'all' ? 'all' : activeBookId,
          novelTitle: exportScope === 'all' ? 'جميع المؤلفات المقررة' : currentBookInfo?.titleArabic,
        },
        (pct, msg) => {
          setPdfProgress({ percent: pct, statusText: msg });
        }
      );
      showNotification(`تم تنزيل ملف الـ PDF بنجاح (${targetCards.length} مفردة).`);
    } catch (err: any) {
      console.error('PDF export error:', err);
      showNotification('تعذر إنشاء الـ PDF، يمكنك استخدام خيار الطباعة المباشرة.');
    } finally {
      setIsGeneratingPDF(false);
      setPdfProgress(null);
    }
  };

  const handleExportCSV = () => {
    exportVocabularyToCSV(targetCards, {
      bookFilter: exportScope === 'all' ? 'all' : activeBookId,
      novelTitle: exportScope === 'all' ? 'جميع المؤلفات المقررة' : currentBookInfo?.titleArabic,
    });
    showNotification(`تم تنزيل ملف Excel / CSV بنجاح (${targetCards.length} مفردة).`);
  };

  const handleExportAnki = () => {
    exportVocabularyToAnki(targetCards, {
      bookFilter: exportScope === 'all' ? 'all' : activeBookId,
      novelTitle: exportScope === 'all' ? 'جميع المؤلفات المقررة' : currentBookInfo?.titleArabic,
    });
    showNotification(`تم إنشاء ملف Anki / Quizlet جاهز للاستيراد.`);
  };

  const handleExportJSON = () => {
    exportVocabularyToJSON(targetCards, {
      bookFilter: exportScope === 'all' ? 'all' : activeBookId,
      novelTitle: exportScope === 'all' ? 'جميع المؤلفات المقررة' : currentBookInfo?.titleArabic,
    });
    showNotification(`تم تنزيل ملف JSON الرقمي.`);
  };

  const handleCopy = async () => {
    const success = await copyVocabularyToClipboard(targetCards, {
      bookFilter: exportScope === 'all' ? 'all' : activeBookId,
      novelTitle: exportScope === 'all' ? 'جميع المؤلفات المقررة' : currentBookInfo?.titleArabic,
    });
    if (success) {
      setCopiedSuccess(true);
      showNotification(`تم نسخ ${targetCards.length} مفردة إلى الحافظة كجدول منظم.`);
      setTimeout(() => setCopiedSuccess(false), 2500);
    }
  };

  const handlePrint = () => {
    printVocabularyRevisionSheet(targetCards, {
      bookFilter: exportScope === 'all' ? 'all' : activeBookId,
      novelTitle: exportScope === 'all' ? 'جميع المؤلفات المقررة' : currentBookInfo?.titleArabic,
    });
    showNotification('تم فتح نافذة الطباعة / الحفظ كـ PDF للمتصفح.');
  };

  return (
    <div className="fixed inset-0 z-60 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[#FAF7EE] dark:bg-stone-900 w-full max-w-2xl rounded-3xl border-2 border-amber-800/40 dark:border-stone-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-linear-to-r from-amber-950 via-stone-900 to-amber-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-amber-800/60 shrink-0">
          <div className="flex items-center gap-3 text-right">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-arabic">
                تصدير بنك مفردات الامتحان الجهوي
              </h3>
              <p className="text-xs text-amber-200/80 font-arabic">
                تحميل وطباعة المصطلحات والشروح الأدبية لمراجعة سريعة ومنظمة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-amber-100 flex items-center justify-center transition-all cursor-pointer"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-right font-arabic">
          {/* Success Banner if active */}
          {downloadSuccessMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{downloadSuccessMessage}</span>
            </div>
          )}

          {/* 1. Scope Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center justify-between">
              <span>اختر نطاق المفردات المراد تصديرها:</span>
              <span className="font-mono text-amber-800 dark:text-amber-400 font-bold">
                {targetCards.length} مفردة محددة
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setExportScope('filtered')}
                className={`p-3 rounded-2xl border text-right transition-all flex flex-col gap-1 cursor-pointer ${
                  exportScope === 'filtered'
                    ? 'bg-amber-100/90 dark:bg-amber-950/60 border-amber-500 ring-2 ring-amber-400 text-amber-950 dark:text-amber-200 shadow-xs'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-amber-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">المفردات المعروضة حالياً</span>
                  <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-900 dark:text-amber-300 font-bold">
                    {filteredCards.length}
                  </span>
                </div>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 font-normal">
                  وفق الفلتر والتصنيف النشط
                </span>
              </button>

              <button
                type="button"
                onClick={() => setExportScope('active_book')}
                className={`p-3 rounded-2xl border text-right transition-all flex flex-col gap-1 cursor-pointer ${
                  exportScope === 'active_book'
                    ? 'bg-amber-100/90 dark:bg-amber-950/60 border-amber-500 ring-2 ring-amber-400 text-amber-950 dark:text-amber-200 shadow-xs'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-amber-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate">{currentBookInfo?.titleArabic || 'الرواية الحالية'}</span>
                  <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-900 dark:text-amber-300 font-bold">
                    {activeBookCards.length}
                  </span>
                </div>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 font-normal">
                  كامل مفردات هذا المؤلف
                </span>
              </button>

              <button
                type="button"
                onClick={() => setExportScope('all')}
                className={`p-3 rounded-2xl border text-right transition-all flex flex-col gap-1 cursor-pointer ${
                  exportScope === 'all'
                    ? 'bg-amber-100/90 dark:bg-amber-950/60 border-amber-500 ring-2 ring-amber-400 text-amber-950 dark:text-amber-200 shadow-xs'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-amber-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">جميع المؤلفات الـ 3</span>
                  <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-900 dark:text-amber-300 font-bold">
                    {allCards.length}
                  </span>
                </div>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 font-normal">
                  كامل بنك المفردات الجهوي
                </span>
              </button>
            </div>
          </div>

          {/* PDF Progress Banner if actively generating */}
          {pdfProgress && (
            <div className="p-4 bg-amber-50/90 dark:bg-amber-950/70 border-2 border-amber-500 rounded-2xl space-y-2 shadow-md animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-bold text-amber-950 dark:text-amber-200">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-spin" />
                  <span>{pdfProgress.statusText}</span>
                </span>
                <span className="font-mono text-amber-800 dark:text-amber-300 font-extrabold">{pdfProgress.percent}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-amber-200 dark:bg-amber-900/80 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-emerald-600 transition-all duration-300 rounded-full"
                  style={{ width: `${pdfProgress.percent}%` }}
                />
              </div>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 font-normal">
                يتم الآن توليد وتنسيق صفحات الـ PDF (A4) بالمصطلحات والشروح الأدبية تمهيداً للتنزيل المباشر.
              </p>
            </div>
          )}

          {/* 2. Export Format Cards */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
              اختر صيغة التصدير والتنزيل:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Direct PDF Download (Primary) */}
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-amber-50/60 dark:from-stone-800 dark:to-stone-850 border-2 border-emerald-500 dark:border-emerald-600 hover:border-emerald-600 hover:shadow-lg transition-all text-right flex items-start gap-3 cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed col-span-1 sm:col-span-2 relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  {isGeneratingPDF ? (
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  ) : (
                    <FileDown className="w-6 h-6" />
                  )}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm sm:text-base text-emerald-950 dark:text-emerald-200">
                      تحميل ملف PDF مباشر (Télécharger PDF)
                    </span>
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full shadow-xs">
                      تنزيل فوري بصيغة .pdf ⭐
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                    توليد ملف PDF عالي الدقة بحجم A4 جاهز للتنزيل والحفظ على جهازك أو هاتفك لمراجعته بدون إنترنت.
                  </p>
                </div>
              </button>

              {/* Option B: Printable Revision Sheet */}
              <button
                type="button"
                onClick={handlePrint}
                disabled={isGeneratingPDF}
                className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-amber-500 hover:shadow-md transition-all text-right flex items-start gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Printer className="w-4 h-4" />
                </div>
                <div className="space-y-1 flex-1">
                  <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 block">
                    طباعة ورقية / حفظ عبر المتصفح
                  </span>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed font-normal">
                    فتح نافذة الطباعة المباشرة لإرساله للطابعة أو حفظه كـ PDF عبر مربع المتصفح.
                  </p>
                </div>
              </button>

              {/* Option C: Excel / CSV */}
              <button
                type="button"
                onClick={handleExportCSV}
                disabled={isGeneratingPDF}
                className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-amber-500 hover:shadow-md transition-all text-right flex items-start gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div className="space-y-1 flex-1">
                  <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 block">
                    ملف Excel / CSV معرّب
                  </span>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed font-normal">
                    متوافق 100% مع Microsoft Excel وGoogle Sheets بترميز UTF-8 للمصطلحات.
                  </p>
                </div>
              </button>

              {/* Option D: Anki / Quizlet TXT */}
              <button
                type="button"
                onClick={handleExportAnki}
                disabled={isGeneratingPDF}
                className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-indigo-500 hover:shadow-md transition-all text-right flex items-start gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-1 flex-1">
                  <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 block">
                    استيراد Anki / Quizlet
                  </span>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed font-normal">
                    ملف نصي منسق جاهز للاستيراد المباشر كبطاقات حفظ تكرار متباعد.
                  </p>
                </div>
              </button>

              {/* Option E: Copy to Clipboard */}
              <button
                type="button"
                onClick={handleCopy}
                disabled={isGeneratingPDF}
                className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-rose-500 hover:shadow-md transition-all text-right flex items-start gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {copiedSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                      نسخ كجدول منظم
                    </span>
                    {copiedSuccess && (
                      <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">
                        تم النسخ!
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed font-normal">
                    نسخ النص للملخصات الشخصية، تطبيق Word، Notion أو المشاركة عبر WhatsApp.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* 3. Live Terms Preview Snippet */}
          <div className="bg-amber-50/60 dark:bg-stone-800/60 p-3.5 rounded-2xl border border-amber-200/80 dark:border-stone-700 space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
              <span className="font-bold text-amber-950 dark:text-amber-300 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>معاينة عينة من المفردات المصدرة:</span>
              </span>
              <span className="text-[11px] font-mono">
                عرض 4 من أصل {targetCards.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {targetCards.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  className="bg-white dark:bg-stone-850 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-2 shadow-2xs"
                >
                  <span className="font-serif font-black text-stone-900 dark:text-stone-100 text-left dir-ltr">
                    « {c.frenchWord} »
                  </span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-400 truncate max-w-[140px]">
                    {c.arabicMeaning}
                  </span>
                </div>
              ))}
            </div>

            {targetCards.length > 4 && (
              <p className="text-[11px] text-stone-500 text-center pt-1">
                + {targetCards.length - 4} مفردة أخرى ستُدرج في ملف التصدير بكامل تفاصيلها وسياقها
              </p>
            )}
          </div>

          {/* Additional Options */}
          <div className="pt-2 flex items-center justify-between border-t border-stone-200 dark:border-stone-800 text-xs text-stone-500">
            <button
              type="button"
              onClick={handleExportJSON}
              className="text-[11px] text-stone-500 hover:text-amber-900 dark:hover:text-amber-300 underline cursor-pointer"
            >
              تصدير كملف JSON للمطورين والنسخ الاحتياطي
            </button>
            <span className="text-[11px]">
              الامتحان الجهوي الموحد للأولى باكالوريا بالمغرب 🇲🇦
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
