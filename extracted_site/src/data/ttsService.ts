export interface TTSSettings {
  frenchVoiceURI: string;
  arabicVoiceURI: string;
  frenchRate: number;
  arabicRate: number;
  frenchPitch: number;
  arabicPitch: number;
  autoReadArabicTranslation: boolean;
  voiceGenderPreference: 'all' | 'female' | 'male';
}

export interface VoiceOption {
  voice: SpeechSynthesisVoice;
  name: string;
  displayName: string;
  lang: string;
  gender: 'female' | 'male' | 'unknown';
  isNatural: boolean;
  isOnline: boolean;
}

const STORAGE_KEY = 'moroccan_1bac_tts_settings_v2';
const SETTINGS_CHANGE_EVENT = 'tts_settings_changed';

const DEFAULT_SETTINGS: TTSSettings = {
  frenchVoiceURI: '',
  arabicVoiceURI: '',
  frenchRate: 0.90,
  arabicRate: 0.88,
  frenchPitch: 1.0,
  arabicPitch: 1.0,
  autoReadArabicTranslation: true,
  voiceGenderPreference: 'female',
};

export function getTTSSettings(): TTSSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveTTSSettings(settings: Partial<TTSSettings>): TTSSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  const current = getTTSSettings();
  const updated = { ...current, ...settings };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(SETTINGS_CHANGE_EVENT, { detail: updated }));
  } catch (e) {
    console.warn('Could not save TTS settings:', e);
  }
  return updated;
}

export function subscribeToTTSSettings(callback: (settings: TTSSettings) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    callback(getTTSSettings());
  };
  window.addEventListener(SETTINGS_CHANGE_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(SETTINGS_CHANGE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

/**
 * Automatically detects whether given text is Arabic or French/Latin based on character distribution
 */
export function detectLanguage(text: string): 'fr' | 'ar' {
  if (!text || typeof text !== 'string') return 'fr';
  const arabicCharCount = (text.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g) || []).length;
  const latinCharCount = (text.match(/[a-zA-ZÀ-ÿ]/g) || []).length;
  return arabicCharCount > latinCharCount ? 'ar' : 'fr';
}

/**
 * Classifies a voice by inferred gender, naturalness, and generates a friendly UI label
 */
export function classifyVoice(voice: SpeechSynthesisVoice): VoiceOption {
  const nameLower = voice.name.toLowerCase();
  const langLower = voice.lang.toLowerCase();

  const isNatural =
    nameLower.includes('natural') ||
    nameLower.includes('neural') ||
    nameLower.includes('online') ||
    nameLower.includes('enhanced') ||
    nameLower.includes('premium') ||
    nameLower.includes('google') ||
    nameLower.includes('siri') ||
    nameLower.includes('wavenet');

  const isOnline = nameLower.includes('online') || nameLower.includes('google');

  // Detect Female voice indicators
  const femaleKeywords = [
    'female', 'femme', 'woman', 'girl', 'aurelie', 'amelie', 'celine', 'hortense',
    'julie', 'audrey', 'marie', 'denise', 'claire', 'charlene', 'lea', 'siwis',
    'fatima', 'laila', 'zeina', 'salma', 'zariyah', 'hoda', 'mariam', 'yasmine',
    'farida', 'nour', 'nour-online', 'aya', 'sara'
  ];
  // Detect Male voice indicators
  const maleKeywords = [
    'male', 'homme', 'man', 'boy', 'thomas', 'henri', 'paul', 'nicolas', 'alain',
    'claude', 'shakir', 'tariq', 'maged', 'naayf', 'hamed', 'youssef', 'mehdi',
    'omar', 'ali', 'khalid'
  ];

  let gender: 'female' | 'male' | 'unknown' = 'unknown';
  if (femaleKeywords.some((k) => nameLower.includes(k))) {
    gender = 'female';
  } else if (maleKeywords.some((k) => nameLower.includes(k))) {
    gender = 'male';
  } else {
    // Default fallback assumption based on common browser voice index
    gender = 'female';
  }

  // Clean friendly display name
  let cleanName = voice.name
    .replace(/^Google\s+/i, '')
    .replace(/^Microsoft\s+/i, '')
    .replace(/^Apple\s+/i, '')
    .replace(/\s+Online\s+\(Natural\)/i, ' (HD)')
    .replace(/\s+\(Natural\)/i, ' (طبيعي)')
    .replace(/\s+Desktop/i, '')
    .trim();

  if (langLower.startsWith('fr')) {
    cleanName = `${cleanName} ${gender === 'female' ? '👩 (أنثى)' : '👨 (ذكر)'}`;
  } else if (langLower.startsWith('ar')) {
    cleanName = `${cleanName} ${gender === 'female' ? '👩 (قارئة)' : '👨 (قارئ)'}`;
  }

  return {
    voice,
    name: voice.name,
    displayName: cleanName,
    lang: voice.lang,
    gender,
    isNatural,
    isOnline,
  };
}

/**
 * Retrieves sorted natural French voices from the browser
 */
export function getFrenchVoiceOptions(): VoiceOption[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices().filter((v) => {
    const l = (v.lang || '').toLowerCase();
    const n = (v.name || '').toLowerCase();
    return (
      l.startsWith('fr') ||
      l.includes('-fr') ||
      l.includes('_fr') ||
      n.includes('french') ||
      n.includes('français') ||
      n.includes('france')
    );
  });
  const options = voices.map(classifyVoice);

  options.sort((a, b) => {
    // Natural / Neural first
    if (a.isNatural && !b.isNatural) return -1;
    if (!a.isNatural && b.isNatural) return 1;
    // Female preferred by default for pleasant narration
    if (a.gender === 'female' && b.gender !== 'female') return -1;
    if (a.gender !== 'female' && b.gender === 'female') return 1;
    return a.displayName.localeCompare(b.displayName);
  });

  return options;
}

/**
 * Cleans and formats Arabic text for ultra-clear, melodious and natural TTS enunciation
 */
export function normalizeArabicTextForTTS(text: string): string {
  if (!text) return '';
  let cleaned = text;

  // 1. Remove markdown markers (bold, italic, headers, bullet points)
  cleaned = cleaned.replace(/[*_#`~]+/g, ' ');
  cleaned = cleaned.replace(/^[•\-\–—\s]+/gm, '');

  // 2. Remove quote brackets and special brackets
  cleaned = cleaned.replace(/[«»"\[\]{}()]/g, ' ');

  // 3. Remove metadata indicators or footnote tags
  cleaned = cleaned.replace(/^(الترجمة|المعنى|شرح|ملاحظة|تنبيه|تحليل)\s*:\s*/gi, '');

  // 4. Natural phonetic expansions for common literary abbreviations
  cleaned = cleaned.replace(/\bص\.\s*(\d+)/g, 'الصفحة $1 ');
  cleaned = cleaned.replace(/\bج\.\s*(\d+)/g, 'الجزء $1 ');
  cleaned = cleaned.replace(/\bف\.\s*(\d+)/g, 'الفصل $1 ');

  // 5. Ensure gentle breath pauses at Arabic punctuation boundaries for human storytelling rhythm
  cleaned = cleaned.replace(/([،,؛;])/g, '$1 ');
  cleaned = cleaned.replace(/([.!?؟]+)/g, '$1 ');

  // 6. Consolidate multiple spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

/**
 * Pre-warms the browser's speech synthesis engine in the background
 * by loading and indexing all available system and cloud voices.
 */
export function warmUpSpeechEngine(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.getVoices();
    if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = () => {
        try {
          window.speechSynthesis.getVoices();
        } catch {}
      };
    }
  } catch {
    // Ignore warm-up errors
  }
}

// Auto-warmup on module load in browser
if (typeof window !== 'undefined') {
  warmUpSpeechEngine();
}

/**
 * Retrieves sorted natural Arabic voices from the browser with priority for neural & high-clarity human-like voices
 */
export function getArabicVoiceOptions(): VoiceOption[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices().filter((v) => {
    const l = (v.lang || '').toLowerCase();
    const n = (v.name || '').toLowerCase();
    return (
      l.startsWith('ar') ||
      l.includes('-ar') ||
      l.includes('_ar') ||
      n.includes('arabic') ||
      n.includes('arabe') ||
      n.includes('العربية')
    );
  });
  const options = voices.map(classifyVoice);

  const preferredArabicVoices = [
    'salma', 'shakir', 'maged', 'tariq', 'zeina', 'hoda', 'laila',
    'mariam', 'youssef', 'naayf', 'hamed', 'farida', 'nour', 'google', 'aya', 'sara'
  ];

  options.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    // 1. Natural / Neural online voices
    if (a.isNatural && !b.isNatural) return -1;
    if (!a.isNatural && b.isNatural) return 1;

    // 2. Preferred high-clarity Arabic narrators
    const aPref = preferredArabicVoices.findIndex((k) => aName.includes(k));
    const bPref = preferredArabicVoices.findIndex((k) => bName.includes(k));
    if (aPref !== -1 && bPref === -1) return -1;
    if (aPref === -1 && bPref !== -1) return 1;
    if (aPref !== -1 && bPref !== -1 && aPref !== bPref) return aPref - bPref;

    // 3. Female/Serene voices preferred by default
    if (a.gender === 'female' && b.gender !== 'female') return -1;
    if (a.gender !== 'female' && b.gender === 'female') return 1;

    return a.displayName.localeCompare(b.displayName);
  });

  return options;
}

/**
 * Finds best available voice matching saved settings or intelligent fallback
 */
export function resolveBestVoice(lang: 'fr' | 'ar', settings?: TTSSettings): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const currentSettings = settings || getTTSSettings();
  const allVoices = window.speechSynthesis.getVoices();

  const targetURI = lang === 'fr' ? currentSettings.frenchVoiceURI : currentSettings.arabicVoiceURI;
  if (targetURI && allVoices.length > 0) {
    const matched = allVoices.find((v) => v.voiceURI === targetURI);
    if (matched) return matched;
  }

  // Strict language filtering
  const matchingVoices = allVoices.filter((v) => {
    const l = (v.lang || '').toLowerCase();
    const n = (v.name || '').toLowerCase();
    if (lang === 'fr') {
      return l.startsWith('fr') || l.includes('fr-') || n.includes('french') || n.includes('français');
    }
    if (lang === 'ar') {
      return l.startsWith('ar') || l.includes('ar-') || n.includes('arabic') || n.includes('arabe') || n.includes('العربية');
    }
    return false;
  });

  if (matchingVoices.length > 0) {
    // Return highest quality/natural voice from matches
    return matchingVoices.sort((a, b) => {
        const aNat = a.name.toLowerCase().includes('natural') || a.name.toLowerCase().includes('neural') || a.name.toLowerCase().includes('google') || a.name.toLowerCase().includes('online');
        const bNat = b.name.toLowerCase().includes('natural') || b.name.toLowerCase().includes('neural') || b.name.toLowerCase().includes('google') || b.name.toLowerCase().includes('online');
        if (aNat && !bNat) return -1;
        if (!aNat && bNat) return 1;
        return 0;
    })[0];
  }

  // If no matching voice found, return null so browser speech synthesis uses default voice for utterance.lang
  return null;
}

export interface SpokenSentence {
  id: string;
  index: number;
  paragraphIndex: number;
  text: string;
  charStart: number;
  charEnd: number;
}

export interface TTSPlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  currentSentenceIndex: number;
  totalSentences: number;
  currentSentence: SpokenSentence | null;
  currentWordRange: { start: number; length: number; word: string } | null;
  lang: 'fr' | 'ar';
  rate: number;
  pitch: number;
  autoScroll: boolean;
  highlightBimodal: boolean;
  voiceName: string;
}

/**
 * Splits paragraphs into accessible, natural spoken sentences with French & Arabic punctuation handling
 */
export function splitParagraphsIntoSentences(paragraphs: string[]): SpokenSentence[] {
  const sentences: SpokenSentence[] = [];
  let globalIndex = 0;

  // Protect common French abbreviations before splitting
  const protectAbbreviations = (text: string): string => {
    return text
      .replace(/\bM\.\s/g, 'M___ ')
      .replace(/\bMme\.\s/g, 'Mme___ ')
      .replace(/\bMlle\.\s/g, 'Mlle___ ')
      .replace(/\bDr\.\s/g, 'Dr___ ')
      .replace(/\bProf\.\s/g, 'Prof___ ')
      .replace(/\betc\.\s/g, 'etc___ ')
      .replace(/\bcf\.\s/g, 'cf___ ')
      .replace(/\bchap\.\s/g, 'chap___ ');
  };

  const restoreAbbreviations = (text: string): string => {
    return text
      .replace(/\bM___\s/g, 'M. ')
      .replace(/\bMme___\s/g, 'Mme. ')
      .replace(/\bMlle___\s/g, 'Mlle. ')
      .replace(/\bDr___\s/g, 'Dr. ')
      .replace(/\bProf___\s/g, 'Prof. ')
      .replace(/\betc___\s/g, 'etc. ')
      .replace(/\bcf___\s/g, 'cf. ')
      .replace(/\bchap___\s/g, 'chap. ');
  };

  paragraphs.forEach((pText, pIdx) => {
    const cleanP = pText.trim();
    if (!cleanP) return;

    const protectedText = protectAbbreviations(cleanP);
    // Split on French and Arabic punctuation: . ! ? ؟ ; ؛ \n
    const rawMatches = protectedText.match(/[^.!?؟;؛\n]+(?:[.!?؟;؛]+(?:['"»«]+)?|\s*$)/g) || [protectedText];

    let charCursor = 0;
    for (const rawMatch of rawMatches) {
      const restored = restoreAbbreviations(rawMatch).trim();
      if (!restored) continue;

      const foundStart = cleanP.indexOf(restored, charCursor);
      const start = foundStart !== -1 ? foundStart : charCursor;
      const end = start + restored.length;
      charCursor = end;

      sentences.push({
        id: `sent-${pIdx}-${sentences.length}`,
        index: globalIndex++,
        paragraphIndex: pIdx,
        text: restored,
        charStart: start,
        charEnd: end,
      });
    }
  });

  // Ultimate fallback if no sentences were parsed
  if (sentences.length === 0 && paragraphs.length > 0) {
    paragraphs.forEach((p, idx) => {
      const t = p.trim();
      if (t) {
        sentences.push({
          id: `sent-${idx}-0`,
          index: globalIndex++,
          paragraphIndex: idx,
          text: t,
          charStart: 0,
          charEnd: t.length,
        });
      }
    });
  }

  return sentences;
}

/**
 * Accessible Text-to-Speech Engine with real-time sentence & word tracking (Bimodal reading)
 */
export class AccessibleTTSEngine {
  private static instance: AccessibleTTSEngine;

  private sentences: SpokenSentence[] = [];
  private currentIndex = 0;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isPlaying = false;
  private isPaused = false;
  private lang: 'fr' | 'ar' = 'fr';
  private rate = 0.90;
  private pitch = 1.0;
  private autoScroll = true;
  private highlightBimodal = true;
  private currentWordRange: { start: number; length: number; word: string } | null = null;
  private subscribers: Set<(state: TTSPlayerState) => void> = new Set();
  private keepAliveTimer: NodeJS.Timeout | null = null;
  private wordFallbackTimer: NodeJS.Timeout | null = null;
  private rateDebounceTimer: NodeJS.Timeout | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      const settings = getTTSSettings();
      this.rate = settings.frenchRate || 0.90;
      this.pitch = settings.frenchPitch || 1.0;
    }
  }

  public static getInstance(): AccessibleTTSEngine {
    if (!AccessibleTTSEngine.instance) {
      AccessibleTTSEngine.instance = new AccessibleTTSEngine();
    }
    return AccessibleTTSEngine.instance;
  }

  public subscribe(callback: (state: TTSPlayerState) => void): () => void {
    this.subscribers.add(callback);
    callback(this.getState());
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify(): void {
    const state = this.getState();
    this.subscribers.forEach((cb) => {
      try {
        cb(state);
      } catch (err) {
        console.warn('TTS subscriber error:', err);
      }
    });
  }

  public getState(): TTSPlayerState {
    const curSentence = this.sentences[this.currentIndex] || null;
    let voiceName = '';
    if (typeof window !== 'undefined' && this.currentUtterance?.voice) {
      voiceName = this.currentUtterance.voice.name;
    }

    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      currentSentenceIndex: this.currentIndex,
      totalSentences: this.sentences.length,
      currentSentence: curSentence,
      currentWordRange: this.currentWordRange,
      lang: this.lang,
      rate: this.rate,
      pitch: this.pitch,
      autoScroll: this.autoScroll,
      highlightBimodal: this.highlightBimodal,
      voiceName,
    };
  }

  public setAutoScroll(enabled: boolean): void {
    this.autoScroll = enabled;
    this.notify();
  }

  public setHighlightBimodal(enabled: boolean): void {
    this.highlightBimodal = enabled;
    this.notify();
  }

  public loadSentences(sentences: SpokenSentence[], lang?: 'fr' | 'ar'): void {
    this.stopSpeechOnly();
    this.sentences = sentences;
    this.currentIndex = 0;
    
    // Auto-detect language if not explicitly provided
    if (lang) {
      this.lang = lang;
    } else if (sentences.length > 0 && sentences[0].text) {
      this.lang = detectLanguage(sentences[0].text);
    } else {
      this.lang = 'fr';
    }

    this.currentWordRange = null;

    const settings = getTTSSettings();
    this.rate = this.lang === 'fr' ? settings.frenchRate : settings.arabicRate;
    this.pitch = this.lang === 'fr' ? settings.frenchPitch : settings.arabicPitch;

    this.notify();
  }

  public playFromIndex(index: number): void {
    if (index < 0 || index >= this.sentences.length) return;
    this.stopSpeechOnly();
    this.currentIndex = index;
    this.currentWordRange = null;
    this.playCurrentSentence();
  }

  public playParagraph(paragraphIndex: number): void {
    const targetIdx = this.sentences.findIndex((s) => s.paragraphIndex === paragraphIndex);
    if (targetIdx !== -1) {
      this.playFromIndex(targetIdx);
    }
  }

  public play(): void {
    if (this.sentences.length === 0) return;
    if (this.isPaused) {
      this.resume();
      return;
    }
    this.playCurrentSentence();
  }

  public pause(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.pause();
    this.isPaused = true;
    this.clearKeepAlive();
    this.clearWordFallback();
    this.notify();
  }

  public resume(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.resume();
    } catch {}
    this.isPaused = false;
    this.startKeepAlive();
    // If speech synthesis did not resume or finished in background, replay current sentence
    if (!window.speechSynthesis.speaking) {
      this.playCurrentSentence();
      return;
    }
    this.notify();
  }

  public stop(): void {
    this.stopSpeechOnly();
    this.isPlaying = false;
    this.isPaused = false;
    this.currentWordRange = null;
    this.notify();
  }

  private stopSpeechOnly(): void {
    if (this.rateDebounceTimer) {
      clearTimeout(this.rateDebounceTimer);
      this.rateDebounceTimer = null;
    }
    this.clearKeepAlive();
    this.clearWordFallback();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
    this.currentUtterance = null;
    if (typeof window !== 'undefined') {
      (window as any).__moroccan_tts_active_utterance__ = null;
    }
  }

  public nextSentence(): void {
    if (this.currentIndex < this.sentences.length - 1) {
      this.playFromIndex(this.currentIndex + 1);
    } else {
      this.stop();
    }
  }

  public prevSentence(): void {
    if (this.currentIndex > 0) {
      this.playFromIndex(this.currentIndex - 1);
    } else {
      this.playFromIndex(0);
    }
  }

  public replayCurrentSentence(): void {
    this.playFromIndex(this.currentIndex);
  }

  public setRate(newRate: number): void {
    this.rate = Math.max(0.5, Math.min(2.0, Math.round(newRate * 100) / 100));
    this.notify();
    const wasPlaying = this.isPlaying && !this.isPaused;
    if (wasPlaying) {
      if (this.rateDebounceTimer) {
        clearTimeout(this.rateDebounceTimer);
      }
      this.rateDebounceTimer = setTimeout(() => {
        if (this.isPlaying && !this.isPaused) {
          this.playFromIndex(this.currentIndex);
        }
      }, 120);
    }
  }

  public setPitch(newPitch: number): void {
    this.pitch = Math.max(0.8, Math.min(1.3, Math.round(newPitch * 100) / 100));
    this.notify();
  }

  public setLanguage(lang: 'fr' | 'ar'): void {
    if (this.lang === lang) return;
    this.lang = lang;
    const settings = getTTSSettings();
    this.rate = lang === 'fr' ? settings.frenchRate : settings.arabicRate;
    this.pitch = lang === 'fr' ? settings.frenchPitch : settings.arabicPitch;
    const wasPlaying = this.isPlaying && !this.isPaused;
    if (wasPlaying) {
      this.playFromIndex(this.currentIndex);
    } else {
      this.notify();
    }
  }

  private startKeepAlive(): void {
    this.clearKeepAlive();
    // Fix Chrome 15-second speech synthesis pause bug
    this.keepAliveTimer = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.isPlaying && !this.isPaused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
  }

  private clearKeepAlive(): void {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  private clearWordFallback(): void {
    if (this.wordFallbackTimer) {
      clearInterval(this.wordFallbackTimer);
      this.wordFallbackTimer = null;
    }
  }

  private hasRetried = false;

  public forceReloadVoices(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
    }
  }

  private playCurrentSentence(isRetry: boolean = false): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const sentence = this.sentences[this.currentIndex];
    if (!sentence) {
      this.stop();
      return;
    }

    // Auto-detect language of this specific sentence if needed
    const currentSentenceLang = detectLanguage(sentence.text);
    const activeLang = this.lang || currentSentenceLang;

    // Safely unpause if browser is in paused state
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch {
      // Ignore
    }

    const spokenText = activeLang === 'ar'
      ? normalizeArabicTextForTTS(sentence.text)
      : sentence.text;

    console.log(`[TTS] Playing sentence in ${activeLang}:`, spokenText);

    if (!spokenText || spokenText.trim().length === 0) {
      console.log(`[TTS] Empty text, skipping sentence index ${this.currentIndex}`);
      if (this.currentIndex < this.sentences.length - 1) {
        this.currentIndex++;
        this.playCurrentSentence();
      } else {
        this.stop();
      }
      return;
    }

    const utterance = new SpeechSynthesisUtterance(spokenText);
    const settings = getTTSSettings();
    const voice = resolveBestVoice(activeLang, settings);

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || (activeLang === 'fr' ? 'fr-FR' : 'ar-SA');
    } else {
      utterance.lang = activeLang === 'fr' ? 'fr-FR' : 'ar-SA';
    }

    utterance.rate = this.rate || (activeLang === 'ar' ? 0.95 : 0.90);
    utterance.pitch = this.pitch || 1.0;

    let hasReceivedBoundaryEvent = false;
    let utteranceStartTime = 0;
    const minExpectedDurationMs = Math.max(1800, spokenText.length * 80 / (this.rate || 1));

    utterance.onstart = () => {
      utteranceStartTime = Date.now();
      this.isPlaying = true;
      this.isPaused = false;
      this.currentWordRange = null;
      this.startKeepAlive();
      this.notify();

      // Mobile / Fallback word progression if browser does not emit boundary events
      this.clearWordFallback();
      const words = sentence.text.split(/(\s+)/);
      if (words.length > 1) {
        let wordIndex = 0;
        let charAcc = 0;
        const avgWordDurationMs = Math.max(200, Math.min(800, Math.round((sentence.text.length * 55) / (words.length * (this.rate || 1)))));
        
        this.wordFallbackTimer = setInterval(() => {
          if (!this.isPlaying || this.isPaused || (hasReceivedBoundaryEvent && Date.now() - utteranceStartTime > 1000)) {
            this.clearWordFallback();
            return;
          }
          while (wordIndex < words.length && words[wordIndex].trim().length === 0) {
            charAcc += words[wordIndex].length;
            wordIndex++;
          }
          if (wordIndex < words.length) {
            const currentW = words[wordIndex];
            this.currentWordRange = {
              start: charAcc,
              length: currentW.length,
              word: currentW,
            };
            this.notify();
            charAcc += currentW.length;
            wordIndex++;
          } else {
            this.clearWordFallback();
          }
        }, avgWordDurationMs);
      }
    };

    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        hasReceivedBoundaryEvent = true;
        const charIndex = e.charIndex;
        const textFromChar = sentence.text.slice(charIndex);
        const match = textFromChar.match(/^[\w\u0600-\u06FFÀ-ÿ'-]+/);
        const word = match ? match[0] : '';
        this.currentWordRange = {
          start: charIndex,
          length: word.length || 1,
          word,
        };
        this.notify();
      }
    };

    utterance.onend = () => {
      this.clearKeepAlive();
      this.clearWordFallback();
      const elapsed = Date.now() - utteranceStartTime;
      const remainingTime = Math.max(0, minExpectedDurationMs - elapsed);

      const advance = () => {
        if (!this.isPlaying) return;
        if (this.currentIndex < this.sentences.length - 1) {
          // Automatically advance to next sentence smoothly
          this.currentIndex++;
          this.currentWordRange = null;
          this.playCurrentSentence();
        } else {
          this.isPlaying = false;
          this.isPaused = false;
          this.currentWordRange = null;
          this.notify();
        }
      };

      if (remainingTime > 150) {
        setTimeout(advance, remainingTime);
      } else {
        advance();
      }
    };

    utterance.onerror = (e) => {
      this.clearKeepAlive();
      this.clearWordFallback();
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('Speech synthesis utterance error:', e.error);
        
        // Retry logic: If language/voice unavailable, force reload voices once and retry
        if (!isRetry && (e.error === 'language-unavailable' || e.error === 'voice-unavailable')) {
            console.log('[TTS] Retrying after voice reload...');
            this.forceReloadVoices();
            this.playCurrentSentence(true);
            return;
        }

        if (utterance.voice && (e.error === 'language-unavailable' || e.error === 'voice-unavailable')) {
          const fallbackUtterance = new SpeechSynthesisUtterance(spokenText);
          fallbackUtterance.lang = activeLang === 'fr' ? 'fr-FR' : 'ar-SA';
          fallbackUtterance.rate = this.rate;
          (window as any).__moroccan_tts_active_utterance__ = fallbackUtterance;
          window.speechSynthesis.speak(fallbackUtterance);
          return;
        }
      }
      this.isPlaying = false;
      this.isPaused = false;
      this.notify();
    };

    this.currentUtterance = utterance;
    // Keep global reference alive to avoid Chrome GC bug
    if (typeof window !== 'undefined') {
      (window as any).__moroccan_tts_active_utterance__ = utterance;
    }

    // Direct synchronous speech dispatch to preserve transient user activation on mobile & desktop browsers
    try {
      console.log("[DEBUG] Attempting to speak utterance:", utterance); window.speechSynthesis.speak(utterance);
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch (err) {
      console.error('TTS speak exception:', err);
    }
  }
}

export const accessibleTTS = AccessibleTTSEngine.getInstance();

/**
 * Core high-fidelity speech player with natural parameters and utterance lifecycle
 */
export class NaturalTTSPlayer {
  private static currentUtterance: SpeechSynthesisUtterance | null = null;
  private static isPlaying = false;
  private static isPaused = false;

  static stop(): void {
    accessibleTTS.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isPlaying = false;
    this.isPaused = false;
    this.currentUtterance = null;
    if (typeof window !== 'undefined') {
      (window as any).__moroccan_tts_single_utterance__ = null;
    }
  }

  static pause(): void {
    accessibleTTS.pause();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      this.isPaused = true;
    }
  }

  static resume(): void {
    accessibleTTS.resume();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      this.isPaused = false;
    }
  }

  static speak(
    text: string,
    lang?: 'fr' | 'ar',
    options?: {
      overrideVoiceURI?: string;
      overrideRate?: number;
      overridePitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      options?.onError?.(new Error('Speech synthesis not supported in this browser'));
      return;
    }

    const cleanText = text.trim();
    if (!cleanText) return;

    this.stop();

    const activeLang = lang || detectLanguage(cleanText);
    const spokenText = activeLang === 'ar' ? normalizeArabicTextForTTS(cleanText) : cleanText;

    const settings = getTTSSettings();
    let voice = resolveBestVoice(activeLang, settings);

    if (options?.overrideVoiceURI && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const allVoices = window.speechSynthesis.getVoices();
      const match = allVoices.find((v) => v.voiceURI === options.overrideVoiceURI);
      if (match) voice = match;
    }

    const utterance = new SpeechSynthesisUtterance(spokenText);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || (activeLang === 'fr' ? 'fr-FR' : 'ar-SA');
    } else {
      utterance.lang = activeLang === 'fr' ? 'fr-FR' : 'ar-SA';
    }

    // Apply human-calibrated cadence
    if (activeLang === 'fr') {
      utterance.rate = options?.overrideRate ?? settings.frenchRate ?? 0.90;
      utterance.pitch = options?.overridePitch ?? settings.frenchPitch ?? 1.0;
    } else {
      utterance.rate = options?.overrideRate ?? settings.arabicRate ?? 0.88;
      utterance.pitch = options?.overridePitch ?? settings.arabicPitch ?? 1.0;
    }

    utterance.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
      options?.onStart?.();
    };

    utterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.currentUtterance = null;
      if (typeof window !== 'undefined') {
        (window as any).__moroccan_tts_single_utterance__ = null;
      }
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.isPlaying = false;
      this.isPaused = false;
      this.currentUtterance = null;
      if (typeof window !== 'undefined') {
        (window as any).__moroccan_tts_single_utterance__ = null;
      }
      options?.onError?.(e);
    };

    this.currentUtterance = utterance;
    if (typeof window !== 'undefined') {
      (window as any).__moroccan_tts_single_utterance__ = utterance;
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }

    console.log("[DEBUG] Attempting to speak utterance:", utterance); window.speechSynthesis.speak(utterance);
  }
}

/**
 * Global helper to stop all active TTS reading (AccessibleAudioPlayer, NaturalTTSPlayer, SpeechSynthesis)
 */
export function stopAllTTS(): void {
  NaturalTTSPlayer.stop();
  accessibleTTS.stop();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    (window as any).__moroccan_tts_single_utterance__ = null;
  }
}

/**
 * Helper to play bound Arabic translation text with the configured voice
 */
export function playBoundArabicTranslation(
  arabicText: string,
  options?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): void {
  NaturalTTSPlayer.speak(arabicText, 'ar', options);
}

// Global Audio Element and Volume helpers
const VOLUME_STORAGE_KEY = 'moroccan_tts_volume_level';
let cachedNarrationVolume = 1.0;

export function getNarrationVolume(): number {
  if (typeof window === 'undefined') return 1.0;
  try {
    const raw = localStorage.getItem(VOLUME_STORAGE_KEY);
    if (raw !== null) {
      const parsed = parseFloat(raw);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
        cachedNarrationVolume = parsed;
        return parsed;
      }
    }
  } catch {}
  return cachedNarrationVolume;
}

export function setNarrationVolume(volume: number): void {
  const clamped = Math.max(0, Math.min(1, volume));
  cachedNarrationVolume = clamped;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(VOLUME_STORAGE_KEY, clamped.toString());
    } catch {}
    const active = getActiveGeminiAudio();
    if (active) {
      active.volume = clamped;
    }
  }
}

export function getActiveGeminiAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  return (window as any).__moroccan_active_audio_element__ || null;
}

export function setActiveGeminiAudio(audio: HTMLAudioElement | null): void {
  if (typeof window === 'undefined') return;
  (window as any).__moroccan_active_audio_element__ = audio;
  if (audio) {
    audio.volume = getNarrationVolume();
  }
}

export function jumpNarrationSeconds(seconds: number): void {
  const active = getActiveGeminiAudio();
  if (active && !isNaN(active.duration) && active.duration > 0) {
    active.currentTime = Math.max(0, Math.min(active.duration, active.currentTime + seconds));
    return;
  }

  // Jump in accessible sentence tracker
  if (seconds > 0) {
    accessibleTTS.nextSentence();
  } else {
    accessibleTTS.prevSentence();
  }
}

/**
 * Diagnostic utility that forces a test of the speech engine with an explicit Arabic voice fallback
 * when the default engine returns empty or silent nodes.
 */
export function diagnoseAndTestArabicSpeechEngine(
  testText: string = 'تجربة الصوت العربي الفصيح',
  onSuccess?: () => void,
  onError?: (err: any) => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError?.(new Error('SpeechSynthesis not supported'));
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const voices = window.speechSynthesis.getVoices();
    const arabicVoices = voices.filter(v => (v.lang || '').toLowerCase().startsWith('ar') || (v.name || '').toLowerCase().includes('arabic'));

    console.log('[TTS Diagnostic] Available voices count:', voices.length);
    console.log('[TTS Diagnostic] Arabic voices found:', arabicVoices.map(v => `${v.name} (${v.lang})`));

    const utterance = new SpeechSynthesisUtterance(normalizeArabicTextForTTS(testText));
    if (arabicVoices.length > 0) {
      utterance.voice = arabicVoices[0];
      utterance.lang = arabicVoices[0].lang || 'ar-SA';
    } else {
      utterance.lang = 'ar-SA';
    }
    utterance.rate = 0.90;
    utterance.pitch = 1.0;

    let started = false;
    utterance.onstart = () => {
      started = true;
      console.log('[TTS Diagnostic] Test speech started successfully');
      onSuccess?.();
    };

    utterance.onerror = (e) => {
      console.warn('[TTS Diagnostic] Test speech error:', e);
      onError?.(e);
    };

    utterance.onend = () => {
      console.log('[TTS Diagnostic] Test speech ended');
    };

    console.log("[DEBUG] Attempting to speak utterance:", utterance); window.speechSynthesis.speak(utterance);
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    // Fallback timer check if onstart doesn't fire within 800ms
    setTimeout(() => {
      if (!started && window.speechSynthesis.speaking) {
        started = true;
        onSuccess?.();
      }
    }, 800);

  } catch (err) {
    console.error('[TTS Diagnostic] Exception:', err);
    onError?.(err);
  }
}


