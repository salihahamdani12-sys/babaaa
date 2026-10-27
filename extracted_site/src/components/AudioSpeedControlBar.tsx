import React, { useState, useEffect } from 'react';
import {
  Gauge,
  RotateCcw,
  Sliders,
  Volume2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Play,
  Pause,
} from 'lucide-react';
import {
  accessibleTTS,
  TTSPlayerState,
  getTTSSettings,
  saveTTSSettings,
} from '../data/ttsService';
import { setAIAudioRate } from '../data/aiAudioService';
import { VoiceSelectorDropdown } from './VoiceSelectorDropdown';

interface AudioSpeedControlBarProps {
  ttsState: TTSPlayerState;
  onOpenSettingsModal?: () => void;
  className?: string;
  themeStyle?: 'boite' | 'antigone' | 'condamne' | 'neutral';
}

interface SpeedPreset {
  value: number;
  label: string;
  desc: string;
  icon: string;
}

const SPEED_PRESETS: SpeedPreset[] = [
  { value: 0.5, label: '0.5x', desc: 'بطيء جداً للمبتدئين', icon: '🐢' },
  { value: 0.75, label: '0.75x', desc: 'متأنٍ لتدقيق النطق', icon: '📖' },
  { value: 0.9, label: '0.9x', desc: 'هادئ ومريح', icon: '🎧' },
  { value: 1.0, label: '1.0x', desc: 'السرعة الطبيعية القياسية', icon: '⚡' },
  { value: 1.25, label: '1.25x', desc: 'سريع للمراجعة', icon: '🚀' },
  { value: 1.5, label: '1.5x', desc: 'متقدم للتدريب السريع', icon: '🏎️' },
  { value: 2.0, label: '2.0x', desc: 'أقصى سرعة للتصفح', icon: '⏩' },
];

export const AudioSpeedControlBar: React.FC<AudioSpeedControlBarProps> = ({
  ttsState,
  onOpenSettingsModal,
  className = '',
  themeStyle = 'boite',
}) => {
  const [currentRate, setCurrentRate] = useState<number>(() => ttsState.rate || 1.0);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Subscribe to TTS Player state rate changes
  useEffect(() => {
    if (ttsState.rate && Math.abs(ttsState.rate - currentRate) > 0.02) {
      setCurrentRate(ttsState.rate);
    }
  }, [ttsState.rate]);

  const handleRateChange = (newRate: number) => {
    const clamped = Math.max(0.5, Math.min(2.0, Math.round(newRate * 100) / 100));
    setCurrentRate(clamped);

    accessibleTTS.setRate(clamped);
    setAIAudioRate(clamped);

    // Save preferences
    saveTTSSettings({
      frenchRate: clamped,
      arabicRate: clamped,
    });
  };

  const getComprehensionGuidance = (rate: number) => {
    if (rate <= 0.6) {
      return {
        badge: '🐢 مستوى بطيء جداً',
        text: 'مثالي للتركيز على مخارج الحروف الفرنسية وتدقيق كل كلمة ومصطلح.',
        color: 'text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-950/80 border-sky-300 dark:border-sky-800',
      };
    }
    if (rate <= 0.85) {
      return {
        badge: '📖 استيعاب تعليمي متأنٍ',
        text: 'سرعة موصى بها لفهم النصوص الأدبية الصعبة وتتبع الترجمة بالتوازي.',
        color: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800',
      };
    }
    if (rate <= 1.15) {
      return {
        badge: '⚡ السرعة الطبيعية القياسية',
        text: 'الإيقاع الأصلي للسرد الروائي والقراءة التعبيرية.',
        color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800',
      };
    }
    if (rate <= 1.55) {
      return {
        badge: '🚀 سرعة متقدمة للمراجعة',
        text: 'ممتازة للطلاب المتمكنين ولمراجعة الفصول قبيل الامتحان الجهوي.',
        color: 'text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/80 border-purple-300 dark:border-purple-800',
      };
    }
    return {
      badge: '⏩ أقصى سرعة للتصفح السمعي',
      text: 'سرعة فائقة للتصفح وتنشيط الذاكرة السمعية.',
      color: 'text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80 border-rose-300 dark:border-rose-800',
    };
  };

  const guidance = getComprehensionGuidance(currentRate);

  // Border & Accent theme styles
  const themeContainerStyle =
    themeStyle === 'boite'
      ? 'border-amber-300/80 dark:border-stone-700 bg-linear-to-r from-amber-50/90 via-orange-50/70 to-amber-50/90 dark:from-stone-900 dark:via-stone-900/95 dark:to-stone-900'
      : themeStyle === 'antigone'
      ? 'border-rose-300/80 dark:border-stone-700 bg-linear-to-r from-rose-50/90 via-orange-50/60 to-rose-50/90 dark:from-stone-900 dark:via-stone-900/95 dark:to-stone-900'
      : 'border-slate-300/80 dark:border-stone-700 bg-linear-to-r from-slate-50/90 via-sky-50/60 to-slate-50/90 dark:from-stone-900 dark:via-stone-900/95 dark:to-stone-900';

  const isAudioActive = ttsState.isPlaying && !ttsState.isPaused;

  return (
    <div
      role="region"
      aria-label="شريط التحكم في سرعة القراءة الصوتية"
      className={`rounded-2xl p-3.5 sm:p-4 border-2 shadow-sm font-arabic transition-all duration-200 ${themeContainerStyle} ${className}`}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-inner ${
            isAudioActive
              ? 'bg-emerald-600 text-white animate-pulse'
              : 'bg-amber-600/90 text-white dark:bg-amber-700'
          }`}>
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <span>سرعة القراءة الصوتية</span>
                <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 font-normal">
                  (Vitesse de lecture)
                </span>
              </span>
              <span className="font-mono font-black text-xs px-2 py-0.5 rounded-full bg-amber-500/20 dark:bg-amber-400/20 text-amber-900 dark:text-amber-200 border border-amber-400/40">
                {currentRate.toFixed(2)}x
              </span>
              {isAudioActive && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full font-bold border border-emerald-300 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  قيد التشغيل
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 hidden sm:block">
              اضبط سرعة النطق من 0.5x إلى 2.0x لتلائم مستوى استيعابك للمفردات الفرنسية
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Voice Selection Dropdown */}
          <VoiceSelectorDropdown currentLang={ttsState.lang} variant="compact" />

          {/* Reset button */}
          <button
            onClick={() => handleRateChange(1.0)}
            disabled={Math.abs(currentRate - 1.0) < 0.02}
            className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 bg-stone-200/80 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
            title="إعادة ضبط السرعة على 1.0x (السرعة الطبيعية)"
          >
            <RotateCcw className="w-3 h-3" />
            <span>1.0x عادي</span>
          </button>

          {/* Settings Modal Button */}
          {onOpenSettingsModal && (
            <button
              onClick={onOpenSettingsModal}
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="إعدادات الصوت ونوع النبرة واختيار الأصوات"
              aria-label="إعدادات الصوت المتقدمة"
            >
              <Sliders className="w-4 h-4" />
            </button>
          )}

          {/* Collapse/Expand Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label={isExpanded ? 'طي شريط السرعة' : 'توسيع شريط السرعة'}
            title={isExpanded ? 'طي تفاصيل السرعة' : 'إظهار خيارات السرعة الكاملة'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Controls */}
      {isExpanded && (
        <div className="flex flex-col gap-3 pt-1 animate-in fade-in duration-150">
          {/* Slider Row */}
          <div className="flex items-center gap-3 bg-white/70 dark:bg-stone-950/60 p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
            <span className="text-xs font-mono font-bold text-stone-500 dark:text-stone-400 min-w-8 text-center">
              0.5x
            </span>
            <div className="relative flex-1 flex items-center">
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={currentRate}
                onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                aria-label="شريط تعديل سرعة القراءة الصوتية من 0.5 إلى 2.0"
                className="w-full h-2.5 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-600 dark:accent-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <span className="text-xs font-mono font-bold text-stone-500 dark:text-stone-400 min-w-8 text-center">
              2.0x
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
            {SPEED_PRESETS.map((preset) => {
              const isSelected = Math.abs(currentRate - preset.value) < 0.03;
              return (
                <button
                  key={preset.value}
                  onClick={() => handleRateChange(preset.value)}
                  className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-center border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-amber-600 dark:bg-amber-500 text-white border-amber-700 shadow-sm ring-2 ring-amber-400/50 font-black scale-102'
                      : 'bg-white/80 dark:bg-stone-800/80 hover:bg-amber-100/80 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700/80 font-bold hover:scale-101'
                  }`}
                  title={`${preset.label} - ${preset.desc}`}
                  aria-label={`تحديد السرعة: ${preset.label}`}
                >
                  <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                    <span>{preset.icon}</span>
                    <span className="font-mono">{preset.label}</span>
                  </div>
                  <span className={`text-[9px] truncate max-w-full hidden sm:block ${
                    isSelected ? 'text-amber-100' : 'text-stone-500 dark:text-stone-400'
                  }`}>
                    {preset.desc.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Pedagogical Guidance Badge */}
          <div className={`flex items-start sm:items-center gap-2 p-2 rounded-xl border text-xs font-arabic ${guidance.color} transition-all`}>
            <span className="font-extrabold shrink-0">{guidance.badge}:</span>
            <span className="text-[11px] leading-relaxed">{guidance.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};
