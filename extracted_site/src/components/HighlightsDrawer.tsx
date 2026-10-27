import React, { useState } from 'react';
import {
  X,
  Highlighter,
  Trash2,
  Search,
  BookOpen,
  Copy,
  Check,
  Edit3,
  Volume2,
  Sparkles,
  Layers
} from 'lucide-react';
import { BookInfo, TextHighlight } from '../types';
import { HIGHLIGHT_COLORS, deleteHighlight, clearAllHighlights, updateHighlight } from '../data/highlightService';

interface HighlightsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookInfo: BookInfo;
  highlights: TextHighlight[];
  currentPage: number;
  onJumpToPage: (page: number) => void;
}

export const HighlightsDrawer: React.FC<HighlightsDrawerProps> = ({
  isOpen,
  onClose,
  bookInfo,
  highlights,
  currentPage,
  onJumpToPage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>('ALL');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredHighlights = highlights.filter((h) => {
    const matchesSearch =
      h.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.note && h.note.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesColor = selectedColorFilter === 'ALL' || h.colorId === selectedColorFilter;
    return matchesSearch && matchesColor;
  });

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSaveNote = (h: TextHighlight) => {
    updateHighlight(bookInfo.id, h.id, { note: noteDraft.trim() || undefined });
    setEditingNoteId(null);
  };

  const getColorConfig = (colorId: string) => {
    return HIGHLIGHT_COLORS.find((c) => c.id === colorId) || HIGHLIGHT_COLORS[0];
  };

  const playSpeech = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-amber-50 dark:bg-stone-900 rounded-3xl shadow-2xl border-2 border-amber-300 dark:border-stone-700 overflow-hidden flex flex-col max-h-[90vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-linear-to-r from-amber-900 via-amber-950 to-stone-900 text-amber-100 flex items-center justify-between border-b border-amber-800 shrink-0">
          <div className="flex items-center gap-3 text-right">
            <div className="w-10 h-10 rounded-2xl bg-amber-800/80 border border-amber-600/40 flex items-center justify-center shadow-inner text-amber-300">
              <Highlighter className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-arabic font-bold text-base text-amber-100 leading-tight flex items-center gap-2">
                <span>تظليلات وملاحظات القراءة</span>
                <span className="bg-amber-800 text-amber-200 text-xs px-2 py-0.5 rounded-full font-mono font-normal">
                  {highlights.length}
                </span>
              </h3>
              <p className="text-[11px] font-serif text-amber-300/80">
                {bookInfo.titleFrench} · Textes Surlignés (Synchronisés avec les Vocables)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-amber-300 hover:text-white hover:bg-amber-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Info Banner */}
        <div className="px-4 py-2 bg-amber-100/80 dark:bg-stone-850 border-b border-amber-200 dark:border-stone-800 flex items-center gap-2 text-xs font-arabic text-amber-950 dark:text-amber-200 shrink-0">
          <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
          <span>يتم حفظ وتضمين كافة تظليلاتك تلقائياً في نظام المفردات والبطاقات (Vocab & Flashcards) للمراجعة واختبار المعاني.</span>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-amber-100/60 dark:bg-stone-850 border-b border-amber-200 dark:border-stone-800 space-y-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-amber-700 dark:text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في الجمل المظللة أو الملاحظات..."
                className="w-full bg-white dark:bg-stone-800 border border-amber-200 dark:border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm font-arabic text-amber-950 dark:text-stone-100 placeholder:text-amber-800/40 dark:placeholder:text-stone-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {highlights.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('هل أنت متأكد من رغبتك في حذف جميع التظليلات في هذه الرواية؟')) {
                    clearAllHighlights(bookInfo.id);
                  }
                }}
                className="p-2 rounded-xl text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-arabic flex items-center gap-1 cursor-pointer transition-colors"
                title="مسح كافة التظليلات"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">مسح الكل</span>
              </button>
            )}
          </div>

          {/* Color Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-arabic font-semibold text-amber-900/80 dark:text-stone-400 shrink-0 ml-1">
              تصفية باللون:
            </span>
            <button
              onClick={() => setSelectedColorFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-arabic font-medium shrink-0 transition-all ${
                selectedColorFilter === 'ALL'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-800 text-amber-900 dark:text-stone-300 border border-amber-200 dark:border-stone-700'
              }`}
            >
              الكل ({highlights.length})
            </button>
            {HIGHLIGHT_COLORS.map((c) => {
              const count = highlights.filter((h) => h.colorId === c.id).length;
              if (count === 0 && selectedColorFilter !== c.id) return null;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedColorFilter(c.id)}
                  className={`px-2.5 py-1 rounded-lg font-arabic font-medium shrink-0 flex items-center gap-1.5 transition-all ${
                    selectedColorFilter === c.id
                      ? 'ring-2 ring-amber-700 dark:ring-amber-400 font-bold'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.bgLight, color: c.textLight }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.nameArabic}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Highlights List Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
          {filteredHighlights.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-stone-700">
                <Highlighter className="w-7 h-7" />
              </div>
              <h4 className="font-arabic font-bold text-base text-amber-950 dark:text-stone-200">
                لا توجد جمل مظللة {searchQuery ? 'تطابق بحثك' : 'حتى الآن'}
              </h4>
              <p className="text-xs text-amber-900/70 dark:text-stone-400 font-arabic max-w-sm mx-auto">
                قم بتحديد أي جملة في نص الرواية أثناء القراءة واختر لون التظليل لحفظها. ستتم مزامنتها تلقائياً مع نظام المفردات والبطاقات.
              </p>
            </div>
          ) : (
            filteredHighlights.map((h) => {
              const colorConf = getColorConfig(h.colorId);
              const isCurrentPage = h.pageNumber === currentPage;
              const isEditing = editingNoteId === h.id;

              return (
                <div
                  key={h.id}
                  className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                    isCurrentPage
                      ? 'bg-amber-100/70 dark:bg-stone-800/90 border-amber-400 dark:border-amber-500/60 shadow-xs'
                      : 'bg-white dark:bg-stone-850 hover:bg-amber-50/70 dark:hover:bg-stone-800 border-amber-200 dark:border-stone-750'
                  }`}
                >
                  {/* Top Bar of item */}
                  <div className="flex items-center justify-between gap-2 border-b border-amber-900/10 dark:border-stone-700/60 pb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onJumpToPage(h.pageNumber);
                          onClose();
                        }}
                        className="px-2 py-0.5 rounded-md bg-amber-200/80 dark:bg-stone-700 hover:bg-amber-300 dark:hover:bg-stone-600 text-amber-950 dark:text-stone-100 font-serif font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        title="انتقل إلى الصفحة"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
                        <span>Page {h.pageNumber}</span>
                        {isCurrentPage && (
                          <span className="text-[10px] font-arabic bg-amber-600 text-white px-1.5 py-0.1 rounded">
                            الصفحة الحالية
                          </span>
                        )}
                      </button>

                      {/* Quick Color Switcher */}
                      <div className="flex items-center gap-1">
                        {HIGHLIGHT_COLORS.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => updateHighlight(bookInfo.id, h.id, { colorId: c.id })}
                            className={`w-4 h-4 rounded-full border transition-transform hover:scale-125 ${
                              h.colorId === c.id
                                ? 'ring-2 ring-amber-800 dark:ring-amber-300 scale-110'
                                : 'opacity-60 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: c.hex, borderColor: c.borderDark }}
                            title={`تغيير اللون إلى ${c.nameArabic}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Actions Strip */}
                    <div className="flex items-center gap-1.5">
                      {/* Pronounce quote */}
                      <button
                        onClick={() => playSpeech(h.text)}
                        className="p-1 rounded text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition-colors"
                        title="استماع للنطق الفرنسي"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleCopyText(h.id, h.text)}
                        className="p-1 rounded text-stone-500 hover:text-amber-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-amber-200/50 dark:hover:bg-stone-700 transition-colors"
                        title="نسخ الاقتباس المظلل"
                      >
                        {copiedId === h.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          if (isEditing) {
                            handleSaveNote(h);
                          } else {
                            setEditingNoteId(h.id);
                            setNoteDraft(h.note || '');
                          }
                        }}
                        className="p-1 rounded text-stone-500 hover:text-amber-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-amber-200/50 dark:hover:bg-stone-700 transition-colors"
                        title={h.note ? 'تعديل الملاحظة' : 'إضافة ملاحظة'}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteHighlight(bookInfo.id, h.id)}
                        className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors"
                        title="إزالة التظليل"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Highlighted text quote */}
                  <div
                    onClick={() => {
                      onJumpToPage(h.pageNumber);
                      onClose();
                    }}
                    className="p-3.5 rounded-xl border font-serif text-sm sm:text-base leading-relaxed cursor-pointer transition-all hover:brightness-95"
                    style={{
                      backgroundColor: colorConf.bgLight,
                      borderColor: colorConf.borderLight,
                      color: colorConf.textLight,
                    }}
                  >
                    « {h.text} »
                  </div>

                  {/* Attached Note / Note Editor */}
                  {isEditing ? (
                    <div className="space-y-1.5 pt-1">
                      <textarea
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        placeholder="أضف تعليقك أو شرحك الخاص لهذه الجملة..."
                        className="w-full bg-white dark:bg-stone-900 border border-amber-300 dark:border-stone-700 rounded-lg p-2 text-xs font-arabic text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500 min-h-[60px]"
                        autoFocus
                      />
                      <div className="flex items-center justify-end gap-2 text-xs font-arabic">
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="px-2.5 py-1 rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300"
                        >
                          إلغاء
                        </button>
                        <button
                          onClick={() => handleSaveNote(h)}
                          className="px-3 py-1 rounded bg-amber-800 text-white hover:bg-amber-900 font-bold"
                        >
                          حفظ الملاحظة
                        </button>
                      </div>
                    </div>
                  ) : (
                    h.note && (
                      <div className="bg-amber-50/90 dark:bg-stone-900/80 border border-amber-200 dark:border-stone-700/60 rounded-lg p-2.5 text-xs text-amber-950 dark:text-stone-200 font-arabic flex items-start gap-2">
                        <Edit3 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div className="flex-1">{h.note}</div>
                      </div>
                    )
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-amber-100/60 dark:bg-stone-900 border-t border-amber-200 dark:border-stone-800 text-center text-xs text-amber-900/80 dark:text-stone-400 font-arabic shrink-0">
          يتم حفظ ومزامنة كافة التظليلات تلقائياً مع نظام المفردات والبطاقات (Vocab & Flashcards)
        </div>
      </div>
    </div>
  );
};
