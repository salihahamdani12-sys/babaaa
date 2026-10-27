import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  Volume1,
  VolumeX,
  Gauge,
  Sliders,
  Sparkles,
  Keyboard,
  Headphones,
  Zap,
  Repeat,
  HelpCircle,
  BookmarkCheck,
} from 'lucide-react';
import {
  TTSPlayerState,
  accessibleTTS,
  getNarrationVolume,
  setNarrationVolume,
  jumpNarrationSeconds,
  getActiveGeminiAudio,
} from '../data/ttsService';
import { VoiceSelectorDropdown } from './VoiceSelectorDropdown';

interface AudioControlCenterOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  ttsState: TTSPlayerState;
  pageNumber: number;
  chapterTitle?: string;
  bookTitle?: string;
}

export const AudioControlCenterOverlay: React.FC<AudioControlCenterOverlayProps> = ({
  isOpen,
  onClose,
  ttsState,
  pageNumber,
  chapterTitle,
  bookTitle,
}) => {
  const [volume, setVolume] = useState<number>(() => getNarrationVolume());
  const [prevVolume, setPrevVolume] = useState<number>(1.0);
  const [hotkeyToast, setHotkeyToast] = useState<{ message: string; icon: string } | null>(null);
  const [showHotkeyGuide, setShowHotkeyGuide] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Sync volume with global volume helper
  const handleVolumeChange = (newVol: number) => {
    const clamped = Math.max(0, Math.min(1, Math.round(newVol * 100) / 100));
    setVolume(clamped);
    setNarrationVolume(clamped);
  };

  const handleToggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      handleVolumeChange(0);
      showToast('تم كتم الصوت 🔇', '🔇');
    } else {
      const restore = prevVolume > 0 ? prevVolume : 0.85;
      handleVolumeChange(restore);
      showToast(`تم تفعيل الصوت (${Math.round(restore * 100)}%) 🔊`, '🔊');
    }
  };

  // Toast feedback popup helper for hotkey tactile confirmation
  const showToast = useCallback((message: string, icon: string) => {
    setHotkeyToast({ message, icon });
    const timer = setTimeout(() => {
      setHotkeyToast(null);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Jump -10s or +10s with visual toast feedback
  const handleJump = useCallback((seconds: number) => {
    jumpNarrationSeconds(seconds);
    if (seconds < 0) {
      showToast(`رجوع 10 ثوانٍ (Rewind -10s) ⏪`, '⏪');
    } else {
      showToast(`تقدم 10 ثوانٍ (Forward +10s) ⏩`, '⏩');
    }
  }, [showToast]);

  // Sync current time and duration of active audio element
  useEffect(() => {
    const interval = setInterval(() => {
      const audio = getActiveGeminiAudio();
      if (audio) {
        setCurrentTime(audio.currentTime || 0);
        setDuration(audio.duration || 0);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Keyboard Hotkey Listener for intuitive 10s jump & playback control
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore hotkeys if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const key = e.key.toLowerCase();

      // J or Shift + Left Arrow: Jump 10s Back
      if (key === 'j' || (e.shiftKey && e.key === 'ArrowLeft') || key === '[') {
        e.preventDefault();
        handleJump(-10);
      }
      // L or Shift + Right Arrow: Jump 10s Forward
      else if (key === 'l' || (e.shiftKey && e.key === 'ArrowRight') || key === ']') {
        e.preventDefault();
        handleJump(10);
      }
      // K or Space: Play / Pause Toggle
      else if (key === 'k' || key === ' ') {
        e.preventDefault();
        if (ttsState.isPlaying && !ttsState.isPaused) {
          accessibleTTS.pause();
          showToast('إيقاف مؤقت ⏸️', '⏸️');
        } else if (ttsState.isPaused) {
          accessibleTTS.resume();
          showToast('استئناف القراءة ▶️', '▶️');
        } else {
          accessibleTTS.play();
          showToast('بدء القراءة 🎧', '🎧');
        }
      }
      // R: Replay current sentence / excerpt
      else if (key === 'r') {
        e.preventDefault();
        accessibleTTS.replayCurrentSentence();
        showToast('إعادة المقطع الحالي 🔄', '🔄');
      }
      // M: Toggle Mute
      else if (key === 'm') {
        e.preventDefault();
        handleToggleMute();
      }
      // Esc: Close Overlay
      else if (key === 'escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleJump, showToast, ttsState, onClose]);

  if (!isOpen) return null;

  const { isPlaying, isPaused, currentSentence, lang, rate } = ttsState;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200 font-arabic select-none text-right"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-stone-900 text-white rounded-3xl shadow-2xl border-2 border-indigo-500/70 overflow-hidden flex flex-col max-h-[90vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Visual Hotkey Toast Feedback Floating Badge */}
        {hotkeyToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-extrabold text-sm shadow-2xl border-2 border-indigo-300 animate-in fade-in zoom-in-95 duration-150 flex items-center gap-2">
            <span className="text-lg">{hotkeyToast.icon}</span>
            <span>{hotkeyToast.message}</span>
          </div>
        )}

        {/* Header Bar */}
        <div className="px-6 py-4 bg-linear-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white flex items-center justify-between border-b border-indigo-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/90 border border-indigo-400/50 flex items-center justify-center text-indigo-100 shadow-inner">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                <span>مركز التحكم الصوتي المتقدم (Audio Control Center)</span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2.5 py-0.5 rounded-full font-mono border border-amber-400/40">
                  -10s / +10s Hotkeys
                </span>
              </h2>
              <p className="text-[11px] text-indigo-200/80">
                قفز ذكي 10 ثوانٍ، تكرار الملاحظات الأدبية الصعبة، واختصارات سريعة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHotkeyGuide((prev) => !prev)}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                showHotkeyGuide
                  ? 'bg-amber-500 text-stone-950 border-amber-400'
                  : 'bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 border-indigo-700/60'
              }`}
              title="دليل اختصارات لوحة المفاتيح"
            >
              <Keyboard className="w-4 h-4" />
              <span className="hidden sm:inline">الاختصارات</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              title="إغلاق مركز التحكم الصوتي"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hotkey Guide Section if Toggled */}
        {showHotkeyGuide && (
          <div className="p-4 bg-indigo-950/90 border-b border-indigo-800 text-xs space-y-2 text-indigo-100 animate-in fade-in duration-150">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>اختصارات لوحة المفاتيح المتاحة أثناء القراءة:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
              <div className="p-2 rounded-xl bg-stone-900 border border-indigo-800 flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-amber-300 font-mono text-[10px]">
                  J / [
                </kbd>
                <span>رجوع 10s (Rewind)</span>
              </div>
              <div className="p-2 rounded-xl bg-stone-900 border border-indigo-800 flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-amber-300 font-mono text-[10px]">
                  L / ]
                </kbd>
                <span>تقديم 10s (Forward)</span>
              </div>
              <div className="p-2 rounded-xl bg-stone-900 border border-indigo-800 flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-amber-300 font-mono text-[10px]">
                  Space / K
                </kbd>
                <span>تشغيل / إيقاف</span>
              </div>
              <div className="p-2 rounded-xl bg-stone-900 border border-indigo-800 flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-amber-300 font-mono text-[10px]">
                  R
                </kbd>
                <span>إعادة نطق الجملة</span>
              </div>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Currently Spoken Excerpt Display */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-indigo-900/80 text-stone-100 shadow-inner space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800 pb-2">
              <span className="flex items-center gap-1.5 font-bold text-indigo-300">
                <BookmarkCheck className="w-4 h-4 text-indigo-400" />
                <span>المقطع الأدبي المقروء الآن (الصفحة {pageNumber}):</span>
              </span>
              <span className="font-mono text-[11px] text-stone-400">
                {lang === 'fr' ? 'الفرسية الأصلية 🇫🇷' : 'الترجمة العربية 🇲🇦'}
              </span>
            </div>

            <div className="text-left text-sm sm:text-base font-serif italic text-indigo-100 leading-relaxed min-h-[48px] flex items-center">
              {currentSentence ? (
                <span>{currentSentence.text}</span>
              ) : (
                <span className="text-stone-500 font-arabic not-italic text-xs">
                  اضغط على زر التشغيل أو استمتع بالاستماع لترجمة المقاطع الأدبية الصعبة...
                </span>
              )}
            </div>
          </div>

          {/* MAIN PROMINENT 10s JUMP CONTROLS */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 py-2">
            {/* -10s Rewind Button */}
            <button
              onClick={() => handleJump(-10)}
              className="group flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-stone-800 hover:bg-stone-750 active:scale-95 border-2 border-indigo-500/50 hover:border-indigo-400 text-indigo-200 transition-all cursor-pointer shadow-lg"
              title="رجوع 10 ثوانٍ للوراء لإعادة الاستماع للمقطع الأدبي (J / [ )"
            >
              <div className="flex items-center gap-1">
                <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 group-hover:-rotate-45 transition-transform duration-200" />
                <span className="text-xs sm:text-sm font-mono font-black text-amber-300">-10s</span>
              </div>
              <span className="text-[10px] text-stone-400 mt-1 font-bold">رجوع 10 ثوانٍ</span>
            </button>

            {/* Play / Pause Main Trigger */}
            <button
              onClick={() => {
                if (isPlaying && !isPaused) {
                  accessibleTTS.pause();
                } else if (isPaused) {
                  accessibleTTS.resume();
                } else {
                  accessibleTTS.play();
                }
              }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold flex flex-col items-center justify-center shadow-xl border-2 border-indigo-300 cursor-pointer active:scale-95 transition-all"
              title={isPlaying && !isPaused ? 'إيقاف مؤقت (Space)' : 'تشغيل القراءة (Space)'}
            >
              {isPlaying && !isPaused ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current translate-x-0.5" />
              )}
            </button>

            {/* +10s Fast Forward Button */}
            <button
              onClick={() => handleJump(10)}
              className="group flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-stone-800 hover:bg-stone-750 active:scale-95 border-2 border-indigo-500/50 hover:border-indigo-400 text-indigo-200 transition-all cursor-pointer shadow-lg"
              title="تقديم 10 ثوانٍ للأمام (L / ] )"
            >
              <div className="flex items-center gap-1">
                <span className="text-xs sm:text-sm font-mono font-black text-amber-300">+10s</span>
                <RotateCw className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 group-hover:rotate-45 transition-transform duration-200" />
              </div>
              <span className="text-[10px] text-stone-400 mt-1 font-bold">تقديم 10 ثوانٍ</span>
            </button>
          </div>

          {/* Speed & Volume Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Speed Control Slider */}
            <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-300">
                <span className="flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-amber-400" />
                  <span>سرعة النطق:</span>
                </span>
                <span className="font-mono text-amber-300 font-extrabold px-2 py-0.5 rounded bg-stone-900 border border-stone-750">
                  {(rate || 1.0).toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={rate || 1.0}
                onChange={(e) => accessibleTTS.setRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                <span>0.5x (بطيء)</span>
                <span>1.0x (عادي)</span>
                <span>2.0x (سريع)</span>
              </div>
            </div>

            {/* Independent Volume Control Slider */}
            <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-300">
                <button
                  onClick={handleToggleMute}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                >
                  {volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-indigo-400" />
                  )}
                  <span>مستوى الصوت:</span>
                </button>
                <span className="font-mono text-indigo-300 font-extrabold px-2 py-0.5 rounded bg-stone-900 border border-stone-750">
                  {Math.round(volume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                <span>0% (كتم)</span>
                <span>50%</span>
                <span>100% (أقصى)</span>
              </div>
            </div>
          </div>

          {/* High-Quality Voice Selection */}
          <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800 flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>اختيار مؤدي الصوت (Voice Persona):</span>
            </span>
            <VoiceSelectorDropdown currentLang={lang} variant="compact" />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 shrink-0">
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>استخدم المفاتيح <kbd className="px-1.5 py-0.5 bg-stone-800 rounded text-amber-300 font-mono text-[10px]">J</kbd> و <kbd className="px-1.5 py-0.5 bg-stone-800 rounded text-amber-300 font-mono text-[10px]">L</kbd> للقفز 10 ثوانٍ</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
