import React from 'react';
import { Sparkles, X, Volume2, BookOpen, CheckCircle, ArrowLeft } from 'lucide-react';
import { NovelPage, BookInfo } from '../types';

interface QuickReadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPageData: NovelPage;
  bookInfo?: BookInfo;
  onAudioRead: () => void;
  onStartDeepReading: () => void;
}

export const QuickReadModal: React.FC<QuickReadModalProps> = ({
  isOpen,
  onClose,
  currentPageData,
  bookInfo,
  onAudioRead,
  onStartDeepReading,
}) => {
  if (!isOpen) return null;

  // Extract 3 bullet points from keyEventsArabic or arabicSummary
  const events = currentPageData.keyEventsArabic || [];
  const point1 = events[0] || currentPageData.arabicSummary.slice(0, 120) || 'الإطار العام للأحداث والسياق الروائي في هذه الصفحة.';
  const point2 = events[1] || 'الحدث المحوري والتطور الدرامي البارز في مسار السرد.';
  const point3 = events[2] || 'الدلالة النفسية والوجودية والاستعداد للامتحان الجهوي للأولى باكالوريا.';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-amber-50 dark:bg-stone-900 border-2 border-amber-300 dark:border-stone-700 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col text-right font-arabic"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="bg-linear-to-r from-amber-800 via-amber-900 to-stone-900 dark:from-stone-900 dark:to-stone-950 p-6 text-white flex items-center justify-between border-b border-amber-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 flex items-center justify-center border border-amber-400/30">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block">
                Quick Read · نظرة خاطفة سريعة
              </span>
              <h2 className="text-lg font-bold text-white">
                خلاصة الصفحة {currentPageData.pageNumber} في 3 نقاط
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-amber-900/80 dark:text-stone-300 font-medium leading-relaxed bg-amber-100/60 dark:bg-stone-800 p-3 rounded-2xl border border-amber-200/60 dark:border-stone-700">
            💡 <strong className="text-amber-950 dark:text-amber-300">نصيحة للمراجعة:</strong> اقرأ هذه النقاط الثلاث السريعة لتكوين فكرة واضحة ومسبقة عن جوهر المقطع قبل الشروع في القراءة المعمقة.
          </p>

          <div className="space-y-3">
            <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-amber-200 dark:border-stone-700 shadow-2xs flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold flex items-center justify-center shrink-0 text-sm font-serif">
                1
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">الإطار والسياق:</span>
                <p className="text-xs sm:text-sm text-stone-900 dark:text-stone-100 font-medium leading-relaxed">
                  {point1}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-amber-200 dark:border-stone-700 shadow-2xs flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold flex items-center justify-center shrink-0 text-sm font-serif">
                2
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">الحدث المحوري:</span>
                <p className="text-xs sm:text-sm text-stone-900 dark:text-stone-100 font-medium leading-relaxed">
                  {point2}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-amber-200 dark:border-stone-700 shadow-2xs flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold flex items-center justify-center shrink-0 text-sm font-serif">
                3
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">البعد الدلالي للجهوي:</span>
                <p className="text-xs sm:text-sm text-stone-900 dark:text-stone-100 font-medium leading-relaxed">
                  {point3}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-amber-100/80 dark:bg-stone-900 p-4 border-t border-amber-200 dark:border-stone-800 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onAudioRead();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Volume2 className="w-4 h-4 text-indigo-200" />
            <span>استماع للخلاصة صوتياً</span>
          </button>

          <button
            onClick={() => {
              onStartDeepReading();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            <span>بدء القراءة المعمقة</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
