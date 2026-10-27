import React, { useState } from 'react';
import {
  Palette,
  Trash2,
  Sparkles,
  Edit3,
  Check,
  X,
  Copy,
  Volume2,
} from 'lucide-react';
import { HighlightColor, TextHighlight } from '../types';
import { HIGHLIGHT_COLORS } from '../data/highlightService';

interface HighlightActionPopoverProps {
  highlight: TextHighlight;
  position: { top: number; left: number };
  onClose: () => void;
  onUpdateColor: (colorId: string, customHex?: string) => void;
  onUpdateNote: (note: string) => void;
  onDelete: () => void;
  onTranslate: (text: string) => void;
  onSpeak?: (text: string) => void;
  isDarkMode?: boolean;
}

export const HighlightActionPopover: React.FC<HighlightActionPopoverProps> = ({
  highlight,
  position,
  onClose,
  onUpdateColor,
  onUpdateNote,
  onDelete,
  onTranslate,
  onSpeak,
  isDarkMode = false,
}) => {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(highlight.note || '');
  const [showCustomColorPicker, setShowCustomColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState(highlight.customColorHex || '#fef08a');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(highlight.text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const handleSaveNote = () => {
    onUpdateNote(noteDraft.trim());
    setIsEditingNote(false);
  };

  return (
    <div
      style={{
        top: `${Math.max(10, position.top - 8)}px`,
        left: `${Math.max(10, Math.min(position.left, window.innerWidth - 300))}px`,
      }}
      className="absolute z-40 animate-in fade-in zoom-in-95 duration-150 bg-white dark:bg-stone-900 border-2 border-amber-400 dark:border-amber-500 rounded-2xl p-3 shadow-2xl w-72 text-right font-arabic select-none text-stone-900 dark:text-stone-100"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header with Title & Close */}
      <div className="flex items-center justify-between border-b border-amber-200 dark:border-stone-800 pb-2 mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 dark:text-amber-300">
          <Palette className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>خيارات النص المظلل</span>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Color Palette Selector */}
      <div className="space-y-1.5 mb-3">
        <div className="text-[11px] text-stone-500 dark:text-stone-400">اختر لون التظليل:</div>
        <div className="flex items-center justify-between gap-1">
          {HIGHLIGHT_COLORS.map((c) => (
            <button
              key={c.id}
              onClick={() => onUpdateColor(c.id)}
              className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                highlight.colorId === c.id && !highlight.customColorHex
                  ? 'ring-2 ring-amber-800 dark:ring-amber-300 scale-110 shadow-xs'
                  : 'hover:scale-110 opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.hex, borderColor: c.borderDark }}
              title={c.nameArabic}
            />
          ))}

          {/* Custom Color Input */}
          <label
            className="w-6 h-6 rounded-full border border-dashed border-stone-400 flex items-center justify-center cursor-pointer hover:border-amber-600 transition-colors relative overflow-hidden"
            title="لون مخصص (Custom Color)"
          >
            <input
              type="color"
              value={customColor}
              onChange={(e) => {
                const hex = e.target.value;
                setCustomColor(hex);
                onUpdateColor('custom', hex);
              }}
              className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
            />
            <span
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: highlight.customColorHex || '#d97706' }}
            />
          </label>
        </div>
      </div>

      {/* Note Section */}
      {isEditingNote ? (
        <div className="space-y-1.5 mb-2.5">
          <textarea
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="اكتب ملاحظة أو شرحاً..."
            className="w-full bg-amber-50/50 dark:bg-stone-800 border border-amber-300 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-amber-500 min-h-[50px]"
            autoFocus
          />
          <div className="flex items-center justify-end gap-1.5 text-xs">
            <button
              onClick={() => setIsEditingNote(false)}
              className="px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300"
            >
              إلغاء
            </button>
            <button
              onClick={handleSaveNote}
              className="px-2.5 py-0.5 rounded bg-amber-800 text-white font-bold"
            >
              حفظ
            </button>
          </div>
        </div>
      ) : (
        highlight.note && (
          <div className="bg-amber-50/90 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700 rounded-lg p-2 text-[11px] text-amber-950 dark:text-stone-200 mb-2.5 flex items-start justify-between gap-1">
            <span>{highlight.note}</span>
            <button
              onClick={() => setIsEditingNote(true)}
              className="text-amber-700 dark:text-amber-400 text-[10px] underline"
            >
              تعديل
            </button>
          </div>
        )
      )}

      {/* Action Buttons Row */}
      <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-amber-200/80 dark:border-stone-800 text-xs">
        <button
          onClick={() => onTranslate(highlight.text)}
          className="px-2 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-1 font-bold text-[11px] shadow-xs cursor-pointer"
          title="ترجمة النص"
        >
          <Sparkles className="w-3 h-3 text-emerald-300" />
          <span>ترجمة</span>
        </button>

        {onSpeak && (
          <button
            onClick={() => onSpeak(highlight.text)}
            className="px-2 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900 flex items-center gap-1 font-bold text-[11px] shadow-xs cursor-pointer"
            title="نطق الجملة بالفرنسية"
          >
            <Volume2 className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            <span>نطق</span>
          </button>
        )}

        {!isEditingNote && !highlight.note && (
          <button
            onClick={() => setIsEditingNote(true)}
            className="px-2 py-1.5 rounded-lg bg-amber-100 dark:bg-stone-800 text-amber-950 dark:text-stone-200 hover:bg-amber-200 dark:hover:bg-stone-700 flex items-center gap-1 text-[11px] cursor-pointer"
          >
            <Edit3 className="w-3 h-3 text-amber-700 dark:text-amber-400" />
            <span>ملاحظة</span>
          </button>
        )}

        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-stone-300 hover:bg-amber-200 dark:hover:bg-stone-700 text-[11px] cursor-pointer"
          title="نسخ النص"
        >
          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={onDelete}
          className="px-2 py-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/80 flex items-center gap-1 text-[11px] cursor-pointer mr-auto"
          title="إزالة التظليل"
        >
          <Trash2 className="w-3 h-3" />
          <span>حذف</span>
        </button>
      </div>
    </div>
  );
};
