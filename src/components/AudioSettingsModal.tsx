import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  Headphones,
  Sliders,
  Check,
  Play,
  Square,
  Sparkles,
  User,
  Gauge,
  Music,
  CheckCircle2,
  RefreshCw,
  Zap,
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Radio,
  Layers,
} from 'lucide-react';
import {
  TTSSettings,
  getTTSSettings,
  saveTTSSettings,
  getFrenchVoiceOptions,
  getArabicVoiceOptions,
  VoiceOption,
  NaturalTTSPlayer,
} from '../data/ttsService';
import {
  ElevenLabsConfig,
  ElevenLabsUserQuota,
  CURATED_VOICES,
  getElevenLabsConfig,
  saveElevenLabsConfig,
  checkElevenLabsQuota,
  generateElevenLabsAudio,
  elevenLabsPlayer,
} from '../data/elevenLabsService';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<TTSSettings>(() => getTTSSettings());
  const [frenchVoices, setFrenchVoices] = useState<VoiceOption[]>([]);
  const [arabicVoices, setArabicVoices] = useState<VoiceOption[]>([]);
  const [isPlayingTest, setIsPlayingTest] = useState<'fr' | 'ar' | 'eleven-fr' | 'eleven-ar' | null>(null);
  const [activeTab, setActiveTab] = useState<'eleven-ar' | 'eleven-fr' | 'eleven-key' | 'browser'>('eleven-ar');

  // ElevenLabs state
  const [elevenConfig, setElevenConfig] = useState<ElevenLabsConfig>(() => getElevenLabsConfig());
  const [showApiKey, setShowApiKey] = useState(false);
  const [quota, setQuota] = useState<ElevenLabsUserQuota | null>(null);
  const [isCheckingQuota, setIsCheckingQuota] = useState(false);
  const [quotaMessage, setQuotaMessage] = useState<string | null>(null);
  const [customKeyInput, setCustomKeyInput] = useState(elevenConfig.apiKey);

  useEffect(() => {
    if (!isOpen) return;
    setSettings(getTTSSettings());
    const elv = getElevenLabsConfig();
    setElevenConfig(elv);
    setCustomKeyInput(elv.apiKey);

    const loadVoices = () => {
      setFrenchVoices(getFrenchVoiceOptions());
      setArabicVoices(getArabicVoiceOptions());
    };

    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Auto-check quota if API key exists
    if (elv.apiKey) {
      handleCheckQuota(elv.apiKey);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdate = (updates: Partial<TTSSettings>) => {
    const updated = saveTTSSettings(updates);
    setSettings(updated);
  };

  const handleElevenUpdate = (updates: Partial<ElevenLabsConfig>) => {
    const updated = saveElevenLabsConfig(updates);
    setElevenConfig(updated);
  };

  const handleCheckQuota = async (keyToCheck?: string) => {
    setIsCheckingQuota(true);
    setQuotaMessage(null);
    try {
      const q = await checkElevenLabsQuota(keyToCheck || customKeyInput);
      setQuota(q);
      if (q.validKey) {
        setQuotaMessage('✅ المفتاح صالح والرصيد المجاني نشط!');
      } else if (q.configured) {
        setQuotaMessage('⚠️ المفتاح غير صالح أو انتهت صلاحيته. تأكد من نسخه كاملاً.');
      }
    } catch {
      setQuotaMessage('تعذر التحقق من الرصيد حالياً.');
    } finally {
      setIsCheckingQuota(false);
    }
  };

  const handleSaveElevenKey = () => {
    const trimmed = customKeyInput.trim();
    handleElevenUpdate({ apiKey: trimmed });
    handleCheckQuota(trimmed);
  };

  const handleTestElevenVoice = async (lang: 'fr' | 'ar') => {
    const testKey = lang === 'ar' ? 'eleven-ar' : 'eleven-fr';
    if (isPlayingTest === testKey) {
      elevenLabsPlayer.stop();
      setIsPlayingTest(null);
      return;
    }

    setIsPlayingTest(testKey);
    const sampleText =
      lang === 'ar'
        ? 'مرحباً بك ! هذا نموذج لقراءة صوتية عربية فصيحة وسلسة بتقنية ElevenLabs لشرح وترجمة روايات الأولى باكالوريا.'
        : 'Bonjour ! Bienvenue sur la plateforme de Première Année Baccalauréat. Voici une lecture fluide et vivante avec ElevenLabs.';

    const voiceToUse = lang === 'ar'
      ? (elevenConfig.selectedArabicVoiceId || 'pNInz6obpgDQGcFmaJgB')
      : (elevenConfig.selectedFrenchVoiceId || elevenConfig.selectedVoiceId || '21m00Tcm4TlvDq8ikWAM');

    const speedToUse = lang === 'ar'
      ? (elevenConfig.arabicPlaybackSpeed || 0.95)
      : (elevenConfig.playbackSpeed || 1.0);

    try {
      const res = await generateElevenLabsAudio(sampleText, {
        voiceId: voiceToUse,
        lang,
        modelId: elevenConfig.selectedModelId,
      });

      if (res.success && res.audioUrl) {
        await elevenLabsPlayer.playUrl(res.audioUrl, speedToUse, () => {
          setIsPlayingTest(null);
        });
      } else {
        if (res.message) {
          setQuotaMessage(`⚠️ ${res.message} (تم التحويل للقارئ المحلي المؤقت)`);
        }
        // Fallback to local speak if API key is not configured or error
        NaturalTTSPlayer.speak(sampleText, lang, {
          onEnd: () => setIsPlayingTest(null),
          onError: () => setIsPlayingTest(null),
        });
      }
    } catch {
      setIsPlayingTest(null);
    }
  };

  const handleTestVoice = (lang: 'fr' | 'ar') => {
    if (isPlayingTest === lang) {
      NaturalTTSPlayer.stop();
      setIsPlayingTest(null);
      return;
    }

    setIsPlayingTest(lang);
    const sampleText =
      lang === 'fr'
        ? 'Bonjour ! Voici un exemple de lecture vocale naturelle et fluide pour votre roman.'
        : 'مرحباً بك ! هذا نموذج لقراءة صوتية عربية فصيحة وسلسة لفهم أحداث الرواية وترجمتها.';

    NaturalTTSPlayer.speak(sampleText, lang, {
      onEnd: () => setIsPlayingTest(null),
      onError: () => setIsPlayingTest(null),
    });
  };

  // Filter voices for Arabic tab vs French tab
  const arabicElevenVoices = CURATED_VOICES.filter(
    (v) => v.recommendedFor?.some((r) => r.includes('العربي') || r.includes('التحليل') || r.includes('الامتحان') || r.includes('الشرح') || r.includes('الباك')) || v.voiceId === 'pNInz6obpgDQGcFmaJgB' || v.voiceId === 'VR6AewLTigWG44044A40' || v.voiceId === 'TxGEqnHWrfWFTfGW9XjX' || v.voiceId === 'yoZ06aMxZJJ28mfd3POQ' || v.voiceId === '21m00Tcm4TlvDq8ikWAM'
  );

  const frenchElevenVoices = CURATED_VOICES.filter(
    (v) => v.recommendedFor?.some((r) => r.includes('merveilles') || r.includes('antigone') || r.includes('condamne') || r.includes('الروايات') || r.includes('المشاعر')) || v.voiceId === '21m00Tcm4TlvDq8ikWAM' || v.voiceId === 'EXAVITQu4vr4xnSDxMaL' || v.voiceId === 'ErXwobaYiN019PkySvjV' || v.voiceId === 'AZnzlk1XvdvUeBnXmlld' || v.voiceId === 'MF3mGyEYCl7XYWbV9V6O'
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => {
        NaturalTTSPlayer.stop();
        elevenLabsPlayer.stop();
        onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl bg-amber-50 dark:bg-stone-900 rounded-3xl shadow-2xl border-2 border-indigo-500/40 dark:border-stone-700 overflow-hidden flex flex-col max-h-[92vh] font-arabic transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-linear-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white flex items-center justify-between border-b border-indigo-800 shrink-0">
          <div className="flex items-center gap-3 text-right">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-indigo-600 to-purple-600 border border-indigo-400/50 flex items-center justify-center shadow-inner text-white">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white leading-tight flex items-center gap-2">
                <span>استوديو القراءة الصوتية بالذكاء الاصطناعي</span>
                <span className="bg-gradient-to-r from-amber-400 to-amber-200 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-full font-sans shadow-xs">
                  ElevenLabs 🎙️
                </span>
              </h3>
              <p className="text-[11px] text-indigo-200/80">
                أصوات بشرية فائقة النقاء للروايات والترجمة (فابور وبدون كارت بنكية)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              NaturalTTSPlayer.stop();
              elevenLabsPlayer.stop();
              onClose();
            }}
            className="p-1.5 rounded-xl text-indigo-200 hover:text-white hover:bg-indigo-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs (Explicitly Featuring Arabic for ElevenLabs as requested) */}
        <div className="px-4 py-2.5 bg-indigo-100/60 dark:bg-stone-850 border-b border-indigo-200 dark:border-stone-800 flex items-center justify-between gap-1.5 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5 p-1 bg-white/70 dark:bg-stone-800 rounded-2xl border border-indigo-200 dark:border-stone-700 w-full min-w-[540px]">
            {/* 1. ELEVENLABS ARABIC TAB */}
            <button
              onClick={() => setActiveTab('eleven-ar')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'eleven-ar'
                  ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-xs ring-2 ring-emerald-500/30'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-emerald-50 dark:hover:bg-stone-750'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>🇲🇦 ElevenLabs عربي (فابور)</span>
            </button>

            {/* 2. ELEVENLABS FRENCH TAB */}
            <button
              onClick={() => setActiveTab('eleven-fr')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'eleven-fr'
                  ? 'bg-gradient-to-r from-indigo-700 to-purple-800 text-white shadow-xs ring-2 ring-indigo-500/30'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-indigo-50 dark:hover:bg-stone-750'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>🇫🇷 ElevenLabs فرنسي (فابور)</span>
            </button>

            {/* 3. ELEVENLABS KEY & ACCOUNT */}
            <button
              onClick={() => setActiveTab('eleven-key')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'eleven-key'
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-purple-50 dark:hover:bg-stone-750'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-amber-300" />
              <span>🔑 مفتاح الحساب والرصيد</span>
            </button>

            {/* 4. BROWSER WEB SPEECH FALLBACK */}
            <button
              onClick={() => setActiveTab('browser')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'browser'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-stone-750'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              <span>🔊 قارئ المتصفح</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-right">
          {/* ========================================================================= */}
          {/* TAB 1: ELEVENLABS ARABIC VOICES (للترجمة والشرح باللغة العربية الفصحى) */}
          {/* ========================================================================= */}
          {activeTab === 'eleven-ar' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Highlight Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white border border-emerald-500/40 shadow-lg relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
                        100% مجاني وبلا بطاقة بنكية
                      </span>
                      <span className="text-[11px] text-emerald-200">أصوات عربية فصيحة ومعبرة</span>
                    </div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>القارئ العربي الفائق بتقنية ElevenLabs</span>
                    </h4>
                    <p className="text-xs text-emerald-200/90 leading-relaxed max-w-lg">
                      قراءة ترجمات روايات الأولى باكالوريا وشروحها باللغة العربية الفصحى بنبرة جهورية وقورة تناسب الامتحان الجهوي.
                    </p>
                  </div>

                  {/* Arabic Test Button */}
                  <button
                    onClick={() => handleTestElevenVoice('ar')}
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${
                      isPlayingTest === 'eleven-ar'
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40'
                    }`}
                    title="تجربة القراءة باللغة العربية الفصحى عبر ElevenLabs"
                  >
                    {isPlayingTest === 'eleven-ar' ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>إيقاف التجربة</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current text-emerald-200" />
                        <span>🇲🇦 تشغيل تجربة بالعربية الفصحى</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Voice Selector Box for Arabic */}
              <div className="bg-white dark:bg-stone-850 p-4 rounded-2xl border border-emerald-200 dark:border-stone-750 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-750 pb-2">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>اختيار صوت القراءة العربي المفضل (أصوات مجانية معتمدة 100%):</span>
                  </span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    الصوت الحالي: {CURATED_VOICES.find((v) => v.voiceId === (elevenConfig.selectedArabicVoiceId || 'pNInz6obpgDQGcFmaJgB'))?.name || 'Adam'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {arabicElevenVoices.map((v) => {
                    const isSelected = (elevenConfig.selectedArabicVoiceId || 'pNInz6obpgDQGcFmaJgB') === v.voiceId;
                    return (
                      <button
                        key={v.voiceId}
                        onClick={() => handleElevenUpdate({ selectedArabicVoiceId: v.voiceId })}
                        className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-950 dark:text-emerald-200 font-bold ring-2 ring-emerald-400/50'
                            : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-emerald-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-1.5">
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                            <span className="text-xs font-bold">{v.name}</span>
                            <span className="text-[10px] text-stone-400">
                              {v.gender === 'female' ? '👩 أنثى' : '👨 ذكر'}
                            </span>
                          </div>
                          {v.recommendedFor && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-sans bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                              {v.recommendedFor[0]}
                            </span>
                          )}
                        </div>

                        {v.arabicSuitability && (
                          <p className="text-[10.5px] text-emerald-800 dark:text-emerald-300 font-medium leading-relaxed bg-emerald-100/40 dark:bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
                            ✨ {v.arabicSuitability}
                          </p>
                        )}

                        <p className="text-[11px] text-stone-500 dark:text-stone-400 font-normal line-clamp-2">
                          {v.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Arabic Speed Slider */}
              <div className="bg-white dark:bg-stone-850 p-4 rounded-2xl border border-emerald-200 dark:border-stone-750 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-emerald-600" />
                    <span>سرعة قراءة الشرح والترجمة العربية:</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-stone-700 text-emerald-900 dark:text-emerald-200 text-xs font-mono font-bold">
                    {(elevenConfig.arabicPlaybackSpeed || 0.95).toFixed(2)}x
                  </span>
                </div>

                <div className="space-y-1.5">
                  <input
                    type="range"
                    min="0.75"
                    max="1.50"
                    step="0.05"
                    value={elevenConfig.arabicPlaybackSpeed || 0.95}
                    onChange={(e) => handleElevenUpdate({ arabicPlaybackSpeed: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                    <span>ترتيل متأنٍ (0.75x)</span>
                    <span className="text-emerald-600 font-bold">فصيح طبيعي (0.95x - 1.00x)</span>
                    <span>مراجعة سريعة (1.50x)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ELEVENLABS FRENCH VOICES (لقراءة النصوص والروايات الفرنسية) */}
          {/* ========================================================================= */}
          {activeTab === 'eleven-fr' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Highlight Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 text-white border border-indigo-500/40 shadow-lg relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[11px] font-bold">
                        Voix Humaine 100% Gratuite
                      </span>
                      <span className="text-[11px] text-indigo-200">Lecture fluide et expressive</span>
                    </div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>القارئ الفرنسي الفائق بتقنية ElevenLabs</span>
                    </h4>
                    <p className="text-xs text-indigo-200/90 leading-relaxed max-w-lg">
                      قراءة نصوص روايات الباكالوريا الثلاث بنبرة روائية فرنسية متقنة مخارج الحروف.
                    </p>
                  </div>

                  {/* French Test Button */}
                  <button
                    onClick={() => handleTestElevenVoice('fr')}
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${
                      isPlayingTest === 'eleven-fr'
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-stone-950'
                    }`}
                    title="تجربة قراءة النص الفرنسي عبر ElevenLabs"
                  >
                    {isPlayingTest === 'eleven-fr' ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>إيقاف التجربة</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>🇫🇷 تشغيل تجربة بالفرنسية</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Voice Selector Box for French */}
              <div className="bg-white dark:bg-stone-850 p-4 rounded-2xl border border-indigo-200 dark:border-stone-750 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-750 pb-2">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-indigo-600" />
                    <span>اختيار صوت القراءة الفرنسية (أصوات مجانية معتمدة 100%):</span>
                  </span>
                  <span className="text-[11px] text-indigo-700 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                    الصوت الحالي: {CURATED_VOICES.find((v) => v.voiceId === (elevenConfig.selectedFrenchVoiceId || elevenConfig.selectedVoiceId || '21m00Tcm4TlvDq8ikWAM'))?.name || 'Rachel'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {frenchElevenVoices.map((v) => {
                    const isSelected = (elevenConfig.selectedFrenchVoiceId || elevenConfig.selectedVoiceId || '21m00Tcm4TlvDq8ikWAM') === v.voiceId;
                    return (
                      <button
                        key={v.voiceId}
                        onClick={() => handleElevenUpdate({ selectedFrenchVoiceId: v.voiceId, selectedVoiceId: v.voiceId })}
                        className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-950 dark:text-indigo-200 font-bold ring-2 ring-indigo-400/50'
                            : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-indigo-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-1.5">
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                            <span className="text-xs font-bold">{v.name}</span>
                            <span className="text-[10px] text-stone-400">
                              {v.gender === 'female' ? '👩 أنثى' : '👨 ذكر'}
                            </span>
                          </div>
                          {v.recommendedFor && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-sans bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                              {v.recommendedFor[0]}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-stone-500 dark:text-stone-400 font-normal line-clamp-2">
                          {v.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* French Speed Slider */}
              <div className="bg-white dark:bg-stone-850 p-4 rounded-2xl border border-indigo-200 dark:border-stone-750 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-indigo-600" />
                    <span>سرعة قراءة النص الفرنسي:</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-stone-700 text-indigo-900 dark:text-indigo-200 text-xs font-mono font-bold">
                    {(elevenConfig.playbackSpeed || 1.0).toFixed(2)}x
                  </span>
                </div>

                <div className="space-y-1.5">
                  <input
                    type="range"
                    min="0.75"
                    max="1.50"
                    step="0.05"
                    value={elevenConfig.playbackSpeed || 1.0}
                    onChange={(e) => handleElevenUpdate({ playbackSpeed: parseFloat(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                    <span>قراءة بطيئة ميسرة (0.75x)</span>
                    <span className="text-indigo-600 font-bold">طبيعي (1.00x)</span>
                    <span>سريع (1.50x)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: ELEVENLABS KEY, QUOTA & DARIJA GUIDE */}
          {/* ========================================================================= */}
          {activeTab === 'eleven-key' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* API Key Box */}
              <div className="bg-white dark:bg-stone-850 p-4 rounded-2xl border border-purple-200 dark:border-stone-750 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-750 pb-2">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-purple-600" />
                    <span>مفتاح ElevenLabs API المجاني:</span>
                  </span>
                  <a
                    href="https://elevenlabs.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>فتح موقع elevenlabs.io</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={customKeyInput}
                        onChange={(e) => setCustomKeyInput(e.target.value)}
                        placeholder="أدخل مفتاحك هنا (مثال: xi_api_key...)"
                        className="w-full pl-10 pr-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <button
                      onClick={handleSaveElevenKey}
                      disabled={isCheckingQuota}
                      className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      {isCheckingQuota ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      <span>حفظ وفحص</span>
                    </button>
                  </div>

                  {quotaMessage && (
                    <p className="text-[11px] text-purple-700 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-950/40 p-2 rounded-lg border border-purple-200 dark:border-purple-800">
                      {quotaMessage}
                    </p>
                  )}

                  {/* Free Balance Widget */}
                  {quota && quota.validKey && (
                    <div className="p-3 rounded-xl bg-purple-50/70 dark:bg-stone-800/80 border border-purple-200 dark:border-stone-700 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>الرصيد الشهري المجاني:</span>
                        </div>
                        <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                          متبقي: {quota.remainingCharacters.toLocaleString()} / {quota.characterLimit.toLocaleString()} حرف مجاناً ({quota.tier})
                        </p>
                      </div>
                      <div className="w-24 bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all"
                          style={{ width: `${Math.max(5, 100 - quota.percentUsed)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Quick Moroccan Darija Tutorial on Free Setup */}
                  <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-stone-800/60 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-950 dark:text-amber-200 space-y-1.5">
                    <div className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>كيفاش تجيب كود ElevenLabs فابور 100% بلا كارط بَنكية؟</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-stone-600 dark:text-stone-300">
                      <li>دخل لموقع <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="font-bold underline text-indigo-600 dark:text-indigo-400">elevenlabs.io</a> وسجل حساب بـ Google أو Email مجاناً.</li>
                      <li>سير لـ <strong>Profile (تحت في اليسار) &gt; API Keys</strong> ودير Create New Key.</li>
                      <li>انسخ الـ Key وحطو في الخانة أعلاه، غيخدم مباشرة بلا أي اقتطاع أو طلب بطاقة بنكية!</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Model Choice */}
              <div className="bg-white dark:bg-stone-850 p-4 rounded-2xl border border-purple-200 dark:border-stone-750 space-y-2 shadow-xs">
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>نموذج الذكاء الاصطناعي (Model):</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleElevenUpdate({ selectedModelId: 'eleven_multilingual_v2' })}
                    className={`p-2.5 rounded-xl border text-right text-xs transition-all cursor-pointer ${
                      elevenConfig.selectedModelId === 'eleven_multilingual_v2'
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-600 text-purple-900 dark:text-purple-200 font-bold ring-2 ring-purple-400/30'
                        : 'bg-stone-50 dark:bg-stone-800 border-stone-200 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="font-bold">eleven_multilingual_v2</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">أعلى دقة ونبرة طبيعية للفرنسية والعربية الفصحى</div>
                  </button>

                  <button
                    onClick={() => handleElevenUpdate({ selectedModelId: 'eleven_flash_v2_5' })}
                    className={`p-2.5 rounded-xl border text-right text-xs transition-all cursor-pointer ${
                      elevenConfig.selectedModelId === 'eleven_flash_v2_5'
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-600 text-purple-900 dark:text-purple-200 font-bold ring-2 ring-purple-400/30'
                        : 'bg-stone-50 dark:bg-stone-800 border-stone-200 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="font-bold">eleven_flash_v2_5 ⚡</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">أسرع استجابة + توفير 50% من الحروف</div>
                  </button>
                </div>
              </div>

              {/* Auto Read Option */}
              <div className="bg-white dark:bg-stone-850 p-4 rounded-2xl border border-amber-200 dark:border-stone-750 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-right">
                    <span className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <span>القراءة الصوتية التلقائية للترجمة العربية:</span>
                    </span>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      تشغيل الصوت العربي الفصيح تلقائياً فور ترجمة أي صفحة أو جملة.
                    </p>
                  </div>

                  <button
                    onClick={() => handleUpdate({ autoReadArabicTranslation: !settings.autoReadArabicTranslation })}
                    className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                      settings.autoReadArabicTranslation ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                        settings.autoReadArabicTranslation ? 'translate-x-0' : '-translate-x-5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: BROWSER WEB SPEECH VOICES (احتياطي في حالة عدم توفر إنترنت) */}
          {/* ========================================================================= */}
          {activeTab === 'browser' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* French Browser Voices */}
              <div className="bg-white dark:bg-stone-850 p-4 rounded-2xl border border-indigo-200 dark:border-stone-750 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-750 pb-2">
                  <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-indigo-600" />
                    <span>أصوات القراءة الفرنسية المحلية (المتصفح):</span>
                  </span>
                  <button
                    onClick={() => handleTestVoice('fr')}
                    className="px-2.5 py-1 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                  >
                    {isPlayingTest === 'fr' ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                    <span>{isPlayingTest === 'fr' ? 'إيقاف التجربة' : 'تجربة الصوت'}</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {frenchVoices.length === 0 ? (
                    <p className="text-xs text-stone-500 py-2 text-center">
                      يتم استخدام الصوت الافتراضي للجهاز (fr-FR).
                    </p>
                  ) : (
                    frenchVoices.map((v) => {
                      const isSelected = settings.frenchVoiceURI === v.voice.voiceURI || (!settings.frenchVoiceURI && frenchVoices[0].voice.voiceURI === v.voice.voiceURI);
                      return (
                        <button
                          key={v.voice.voiceURI}
                          onClick={() => handleUpdate({ frenchVoiceURI: v.voice.voiceURI })}
                          className={`w-full p-2 rounded-xl border text-right text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-950 dark:text-indigo-200 font-bold ring-2 ring-indigo-400/50'
                              : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-indigo-50/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                            <span>{v.displayName}</span>
                          </div>
                          {v.isNatural && (
                            <span className="px-1.5 py-0.2 rounded bg-indigo-200/80 dark:bg-indigo-900 text-[10px] text-indigo-900 dark:text-indigo-200 font-mono">
                              طبيعي HD
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Arabic Browser Voices */}
              <div className="bg-white dark:bg-stone-850 p-4 rounded-2xl border border-emerald-200 dark:border-stone-750 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-750 pb-2">
                  <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>أصوات القراءة العربية المحلية (المتصفح):</span>
                  </span>
                  <button
                    onClick={() => handleTestVoice('ar')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                  >
                    {isPlayingTest === 'ar' ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                    <span>{isPlayingTest === 'ar' ? 'إيقاف التجربة' : 'تجربة الصوت'}</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {arabicVoices.length === 0 ? (
                    <p className="text-xs text-stone-500 py-2 text-center">
                      يتم استخدام الصوت العربي القياسي للنظام (ar-SA).
                    </p>
                  ) : (
                    arabicVoices.map((v) => {
                      const isSelected = settings.arabicVoiceURI === v.voice.voiceURI || (!settings.arabicVoiceURI && arabicVoices[0].voice.voiceURI === v.voice.voiceURI);
                      return (
                        <button
                          key={v.voice.voiceURI}
                          onClick={() => handleUpdate({ arabicVoiceURI: v.voice.voiceURI })}
                          className={`w-full p-2 rounded-xl border text-right text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold ring-2 ring-emerald-400/50'
                              : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-emerald-50/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                            <span>{v.displayName}</span>
                          </div>
                          {v.isNatural && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-200/80 dark:bg-emerald-900 text-[10px] text-emerald-900 dark:text-emerald-200 font-mono">
                              فصيح HD
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-amber-100/60 dark:bg-stone-900 border-t border-amber-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 font-arabic shrink-0">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>يتم حفظ تفضيلات ElevenLabs والأصوات تلقائياً</span>
          </span>
          <button
            onClick={() => {
              NaturalTTSPlayer.stop();
              elevenLabsPlayer.stop();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-indigo-900 hover:bg-indigo-950 text-white font-bold transition-all shadow-xs cursor-pointer"
          >
            حفظ وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};


