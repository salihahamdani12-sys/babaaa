import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  ChevronDown,
  Check,
  User,
  Sparkles,
  Play,
  Square,
  Mic,
  Languages,
} from 'lucide-react';
import {
  getTTSSettings,
  saveTTSSettings,
  subscribeToTTSSettings,
  getFrenchVoiceOptions,
  getArabicVoiceOptions,
  VoiceOption,
  NaturalTTSPlayer,
  TTSSettings,
} from '../data/ttsService';

interface VoiceSelectorDropdownProps {
  currentLang?: 'fr' | 'ar';
  variant?: 'compact' | 'full' | 'topbar';
  className?: string;
}

export const VoiceSelectorDropdown: React.FC<VoiceSelectorDropdownProps> = ({
  currentLang = 'fr',
  variant = 'compact',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLang, setActiveLang] = useState<'fr' | 'ar'>(currentLang);
  const [settings, setSettings] = useState<TTSSettings>(() => getTTSSettings());
  const [frenchVoices, setFrenchVoices] = useState<VoiceOption[]>([]);
  const [arabicVoices, setArabicVoices] = useState<VoiceOption[]>([]);
  const [testingVoiceURI, setTestingVoiceURI] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync currentLang if changed from parent
  useEffect(() => {
    setActiveLang(currentLang);
  }, [currentLang]);

  // Subscribe to TTS settings updates
  useEffect(() => {
    const unsubscribe = subscribeToTTSSettings((newSettings) => {
      setSettings(newSettings);
    });
    return unsubscribe;
  }, []);

  // Load available browser speechSynthesis voices
  useEffect(() => {
    const loadVoices = () => {
      setFrenchVoices(getFrenchVoiceOptions());
      setArabicVoices(getArabicVoiceOptions());
    };

    loadVoices();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeVoices = activeLang === 'fr' ? frenchVoices : arabicVoices;
  const currentVoiceURI = activeLang === 'fr' ? settings.frenchVoiceURI : settings.arabicVoiceURI;

  // Selected voice option or fallback first option
  const selectedVoice =
    activeVoices.find((v) => v.voice.voiceURI === currentVoiceURI) ||
    (activeVoices.length > 0 ? activeVoices[0] : null);

  const handleSelectVoice = (voiceURI: string) => {
    if (activeLang === 'fr') {
      saveTTSSettings({ frenchVoiceURI: voiceURI });
    } else {
      saveTTSSettings({ arabicVoiceURI: voiceURI });
    }
    setIsOpen(false);
  };

  const handleTestVoice = (e: React.MouseEvent, voiceOption: VoiceOption) => {
    e.stopPropagation();
    if (testingVoiceURI === voiceOption.voice.voiceURI) {
      NaturalTTSPlayer.stop();
      setTestingVoiceURI(null);
      return;
    }

    setTestingVoiceURI(voiceOption.voice.voiceURI);

    // Short 3-second neutral literary sample for quality verification
    const sampleText =
      activeLang === 'fr'
        ? 'Lecture naturelle pour le roman.'
        : 'قراءة فصيحة سلسة للنصوص الأدبية.';

    // Enforce 3-second neutral sample cutoff
    const previewTimer = setTimeout(() => {
      NaturalTTSPlayer.stop();
      setTestingVoiceURI(null);
    }, 3200);

    NaturalTTSPlayer.speak(sampleText, activeLang, {
      overrideVoiceURI: voiceOption.voice.voiceURI,
      onEnd: () => {
        clearTimeout(previewTimer);
        setTestingVoiceURI(null);
      },
      onError: () => {
        clearTimeout(previewTimer);
        setTestingVoiceURI(null);
      },
    });
  };

  return (
    <div ref={containerRef} className={`relative inline-block font-arabic text-right ${className}`}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center justify-between gap-2 rounded-xl transition-all cursor-pointer shadow-2xs border ${
          variant === 'topbar'
            ? 'px-3 py-1.5 bg-amber-200/80 dark:bg-stone-800 hover:bg-amber-300 dark:hover:bg-stone-700 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-stone-700 text-xs font-bold'
            : variant === 'full'
            ? 'w-full px-3.5 py-2 bg-stone-900 border-stone-700 text-white hover:bg-stone-850 text-xs font-bold'
            : 'px-2.5 py-1.5 bg-white/90 dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-750 text-stone-900 dark:text-stone-100 border-stone-300 dark:border-stone-700 text-xs font-semibold'
        }`}
        title="اختر صوت القارئ البشري عالي الدقة (HD Neural Voice)"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5 truncate max-w-[170px] sm:max-w-[220px]">
          <Mic className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="truncate">
            {selectedVoice ? selectedVoice.displayName : 'الصوت الافتراضي للجهاز'}
          </span>
          {selectedVoice?.isNatural && (
            <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono font-bold shrink-0">
              HD
            </span>
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu Overlay */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 mt-1.5 w-72 sm:w-80 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border-2 border-indigo-500/40 dark:border-stone-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-2">
          {/* Header & Language Tabs */}
          <div className="p-2 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/80 rounded-xl mb-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200 mb-2">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>أصوات القراءة العالية الدقة</span>
              </span>

              {/* Explicit Voice Preview Button for currently selected voice */}
              {selectedVoice && (
                <button
                  type="button"
                  onClick={(e) => handleTestVoice(e, selectedVoice)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs ${
                    testingVoiceURI === selectedVoice.voice.voiceURI
                      ? 'bg-amber-500 text-stone-950 font-black animate-pulse'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                  title="استماع لمعاينة محايدة مدتها 3 ثوانٍ للتحقق من جودة الصوت قبل بدء القراءة"
                >
                  {testingVoiceURI === selectedVoice.voice.voiceURI ? (
                    <>
                      <Square className="w-2.5 h-2.5 fill-current" />
                      <span>جاري المعاينة (3s)...</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-2.5 h-2.5" />
                      <span>معاينة الصوت (3s)</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 bg-stone-200/80 dark:bg-stone-800 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveLang('fr')}
                className={`flex-1 py-1 px-2 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  activeLang === 'fr'
                    ? 'bg-indigo-700 text-white shadow-2xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
                }`}
              >
                <span>🇫🇷 الفرنسية ({frenchVoices.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveLang('ar')}
                className={`flex-1 py-1 px-2 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  activeLang === 'ar'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
                }`}
              >
                <span>🇲🇦 العربية ({arabicVoices.length})</span>
              </button>
            </div>
          </div>

          {/* Voice List Options */}
          <div className="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {activeVoices.length === 0 ? (
              <div className="p-3 text-center text-xs text-stone-500 dark:text-stone-400">
                جاري تحميل أصوات الجهاز أو استخدام الصوت الافتراضي للنظام...
              </div>
            ) : (
              activeVoices.map((v) => {
                const isSelected =
                  currentVoiceURI === v.voice.voiceURI ||
                  (!currentVoiceURI && activeVoices[0].voice.voiceURI === v.voice.voiceURI);
                const isTesting = testingVoiceURI === v.voice.voiceURI;

                return (
                  <div
                    key={v.voice.voiceURI}
                    onClick={() => handleSelectVoice(v.voice.voiceURI)}
                    className={`w-full p-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-400 text-indigo-950 dark:text-indigo-200 font-bold shadow-2xs'
                        : 'bg-white dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                          <User className="w-3 h-3 text-stone-400" />
                        )}
                      </div>
                      <span className="truncate">{v.displayName}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {v.isNatural && (
                        <span className="px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-900/80 text-[9px] text-indigo-800 dark:text-indigo-200 font-mono font-bold">
                          HD
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleTestVoice(e, v)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isTesting
                            ? 'bg-amber-500 text-stone-950 animate-pulse'
                            : 'bg-stone-200/90 dark:bg-stone-700 hover:bg-indigo-600 hover:text-white text-stone-700 dark:text-stone-200'
                        }`}
                        title={isTesting ? 'إيقاف المعاينة' : 'استماع لمعاينة الصوت لمدة 3 ثوانٍ'}
                      >
                        {isTesting ? (
                          <>
                            <Square className="w-2.5 h-2.5 fill-current text-stone-950" />
                            <span>إيقاف</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>معاينة 3s</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Note */}
          <div className="mt-1.5 p-2 bg-stone-100 dark:bg-stone-950 text-[10px] text-stone-500 dark:text-stone-400 rounded-xl flex items-center justify-between border border-stone-200 dark:border-stone-800">
            <span>تتأثر الأصوات المتاحة بنوع الجهاز والنظام</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">SpeechSynthesis</span>
          </div>
        </div>
      )}
    </div>
  );
};
