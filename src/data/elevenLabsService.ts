/**
 * ElevenLabs High-Fidelity Neural Voice Service
 * Supports 10,000 free monthly characters with zero credit card required ("fabor bla credit").
 * Provides ultra-realistic human voices (Rachel, Adam, Antoni, Bella, Sarah, etc.)
 * with intelligent sentence caching and seamless fallback to browser Web Speech.
 */

export interface ElevenLabsVoice {
  voiceId: string;
  name: string;
  description: string;
  gender: 'female' | 'male' | 'unknown';
  category?: string;
  previewUrl?: string;
  recommendedFor?: string[];
  arabicSuitability?: string;
}

export interface ElevenLabsConfig {
  apiKey: string;
  selectedVoiceId: string;
  selectedFrenchVoiceId: string;
  selectedArabicVoiceId: string;
  selectedModelId: 'eleven_multilingual_v2' | 'eleven_flash_v2_5' | 'eleven_turbo_v2_5';
  enabled: boolean;
  stability: number;
  similarityBoost: number;
  style: number;
  useSpeakerBoost: boolean;
  playbackSpeed: number;
  arabicPlaybackSpeed: number;
}

export interface ElevenLabsUserQuota {
  configured: boolean;
  validKey: boolean;
  tier: string;
  characterCount: number;
  characterLimit: number;
  remainingCharacters: number;
  percentUsed: number;
  nextResetUnix?: number;
}

const STORAGE_KEY = 'moroccan_1bac_elevenlabs_config_v1';
const CONFIG_CHANGE_EVENT = 'elevenlabs_config_changed';

export const CURATED_VOICES: ElevenLabsVoice[] = [
  {
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    name: 'Rachel',
    description: 'نبرة هادئة ودافئة ومحبوبة، ممتازة للسرد الروائي الفرنسي والشرح العربي السلس',
    gender: 'female',
    recommendedFor: ['la_boite_a_merveilles', 'الروايات'],
    arabicSuitability: 'ممتازة للقراءة الهادئة والملخصات باللغة العربية الفصحى',
  },
  {
    voiceId: 'pNInz6obpgDQGcFmaJgB',
    name: 'Adam',
    description: 'صوت سردي عميق وفخم ومؤثر، مثالي للترجمات العربية الفصحى ورواية آخر يوم لمحكوم بالإعدام',
    gender: 'male',
    recommendedFor: ['le_dernier_jour_dun_condamne', 'الشرح العربي', 'المقاطع الدرامية'],
    arabicSuitability: 'الخيار الأفضل للترجمة والشرح باللغة العربية الفصحى (نبرة إذاعية وقورة)',
  },
  {
    voiceId: 'ErXwobaYiN019PkySvjV',
    name: 'Antoni',
    description: 'نبرة مسرحية معبرة وواضحة جداً، رائعة لحوارات أنتيجون والحوارات الفصحى',
    gender: 'male',
    recommendedFor: ['antigone', 'الحوارات'],
    arabicSuitability: 'ممتاز للحوارات والتفاعل الدرامي الفصيح',
  },
  {
    voiceId: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Bella',
    description: 'صوت أنثوي شاعري رقيق، مناسب لذكريات طفولة سيدي محمد وأسرار علبة العجائب',
    gender: 'female',
    recommendedFor: ['la_boite_a_merveilles', 'الوصف'],
    arabicSuitability: 'صوت شاعري دافئ ومناسب للأدب المغاربي المترجم',
  },
  {
    voiceId: 'VR6AewLTigWG44044A40',
    name: 'Arnold',
    description: 'صوت وقور ورخيم ومتقن، رائع للشروحات الأدبية العربية وأسئلة الامتحان الجهوي',
    gender: 'male',
    recommendedFor: ['الشروحات والتحليل', 'الامتحان الجهوي'],
    arabicSuitability: 'صوت رخيم ممتاز للشرح والتحليل باللغة العربية الفصحى',
  },
  {
    voiceId: 'AZnzlk1XvdvUeBnXmlld',
    name: 'Domi',
    description: 'نبرة قوية وحيوية وواضحة، ممتازة للمراجعة السريعة واسترجاع الأحداث',
    gender: 'female',
    recommendedFor: ['المراجعة السريعة', 'الملخصات'],
    arabicSuitability: 'نبرة واضحة ومخارج حروف دقيقة للاستيعاب السريع',
  },
  {
    voiceId: 'MF3mGyEYCl7XYWbV9V6O',
    name: 'Elli',
    description: 'نبرة عاطفية رقيقة ومعبرة، رائعة للمواقف الإنسانية والمشاعر الأدبية',
    gender: 'female',
    recommendedFor: ['المشاعر الأدبية', 'الروايات'],
    arabicSuitability: 'نبرة رقيقة للمواقف الإنسانية والوجدانية',
  },
  {
    voiceId: 'TxGEqnHWrfWFTfGW9XjX',
    name: 'Josh',
    description: 'صوت طبيعي وشبابي وسلس، ممتاز لتبسيط الشروح باللغة العربية والفرنسية',
    gender: 'male',
    recommendedFor: ['التبسيط والشرح', 'مراجعة الدروس'],
    arabicSuitability: 'نبرة شبابية قريبة للطلاب مناسبة لشرح المفاهيم الصعبة',
  },
  {
    voiceId: 'yoZ06aMxZJJ28mfd3POQ',
    name: 'Sam',
    description: 'نبرة واثقة وديناميكية، ممتازة لنصائح ومنهجية الامتحان الجهوي',
    gender: 'male',
    recommendedFor: ['منهجية الامتحان', 'نصائح الباك'],
    arabicSuitability: 'نبرة تشجيعية واثقة للمراجعة النهائية للجهوي',
  },
];

const DEFAULT_CONFIG: ElevenLabsConfig = {
  apiKey: '',
  selectedVoiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel
  selectedFrenchVoiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel
  selectedArabicVoiceId: 'pNInz6obpgDQGcFmaJgB', // Adam
  selectedModelId: 'eleven_multilingual_v2',
  enabled: true,
  stability: 0.5,
  similarityBoost: 0.75,
  style: 0.05,
  useSpeakerBoost: true,
  playbackSpeed: 1.0,
  arabicPlaybackSpeed: 0.95,
};

export function getElevenLabsConfig(): ElevenLabsConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveElevenLabsConfig(updates: Partial<ElevenLabsConfig>): ElevenLabsConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  const current = getElevenLabsConfig();
  const next = { ...current, ...updates };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(CONFIG_CHANGE_EVENT, { detail: next }));
  } catch (err) {
    console.warn('Could not save ElevenLabs config:', err);
  }
  return next;
}

export function subscribeElevenLabsConfig(callback: (config: ElevenLabsConfig) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    callback(getElevenLabsConfig());
  };
  window.addEventListener(CONFIG_CHANGE_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(CONFIG_CHANGE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

/**
 * Checks the user's free monthly credit balance from ElevenLabs API
 */
export async function checkElevenLabsQuota(apiKeyOverride?: string): Promise<ElevenLabsUserQuota> {
  const config = getElevenLabsConfig();
  const key = apiKeyOverride || config.apiKey;

  if (!key) {
    return {
      configured: false,
      validKey: false,
      tier: 'none',
      characterCount: 0,
      characterLimit: 10000,
      remainingCharacters: 0,
      percentUsed: 0,
    };
  }

  try {
    const res = await fetch('/api/elevenlabs/user', {
      headers: {
        'xi-api-key': key,
      },
    });

    if (!res.ok) {
      return {
        configured: true,
        validKey: false,
        tier: 'unknown',
        characterCount: 0,
        characterLimit: 10000,
        remainingCharacters: 0,
        percentUsed: 0,
      };
    }

    const data = await res.json();
    return {
      configured: true,
      validKey: data.validKey !== false,
      tier: data.tier || 'free',
      characterCount: data.characterCount ?? 0,
      characterLimit: data.characterLimit ?? 10000,
      remainingCharacters: data.remainingCharacters ?? 10000,
      percentUsed: data.percentUsed ?? 0,
      nextResetUnix: data.nextResetUnix,
    };
  } catch (err) {
    return {
      configured: true,
      validKey: true,
      tier: 'free',
      characterCount: 0,
      characterLimit: 10000,
      remainingCharacters: 10000,
      percentUsed: 0,
    };
  }
}

// In-memory client cache for played audio to guarantee zero double credit usage
const clientAudioCache = new Map<string, string>(); // cacheKey -> data URL
let globalQuotaExhausted = false;

export interface ElevenLabsTTSResponse {
  success: boolean;
  audioUrl?: string;
  error?: string;
  message?: string;
  fallbackToBrowser?: boolean;
  fromCache?: boolean;
}

/**
 * Generates ElevenLabs audio for a given string
 */
export async function generateElevenLabsAudio(
  text: string,
  options?: {
    voiceId?: string;
    modelId?: 'eleven_multilingual_v2' | 'eleven_flash_v2_5' | 'eleven_turbo_v2_5';
    bookId?: string;
    pageNumber?: number;
    lang?: 'ar' | 'fr';
  }
): Promise<ElevenLabsTTSResponse> {
  const config = getElevenLabsConfig();
  if (!config.enabled || globalQuotaExhausted) {
    return {
      success: false,
      error: 'QUOTA_EXCEEDED',
      message: 'تم تجاوز رصيد الحروف المجاني على ElevenLabs. يتم استخدام القارئ الصوتي المحلي السلس.',
      fallbackToBrowser: true,
    };
  }

  console.log('[DEBUG] Generating ElevenLabs Audio. Original text:', text);
  const clean = text.replace(/[*_#`~«»\[\]{}()]/g, ' ').replace(/\s+/g, ' ').trim();
  console.log('[DEBUG] Cleaned text:', clean);
  if (!clean) {
    return { success: false, error: 'NO_TEXT' };
  }
  const isArabic = options?.lang === 'ar' || (options?.lang !== 'fr' && /[\u0600-\u06FF]/.test(clean));
  const defaultVoice = isArabic
    ? (config.selectedArabicVoiceId || 'pNInz6obpgDQGcFmaJgB')
    : (config.selectedFrenchVoiceId || config.selectedVoiceId || '21m00Tcm4TlvDq8ikWAM');

  const voiceId = options?.voiceId || defaultVoice;
  const modelId = options?.modelId || config.selectedModelId || 'eleven_multilingual_v2';

  const cacheKey = `${voiceId}:${modelId}:${clean.slice(0, 80)}:${clean.length}`;
  if (clientAudioCache.has(cacheKey)) {
    return {
      success: true,
      audioUrl: clientAudioCache.get(cacheKey)!,
      fromCache: true,
    };
  }

  try {
    const res = await fetch('/api/elevenlabs/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': config.apiKey || '',
      },
      body: JSON.stringify({
        text: clean,
        voiceId,
        modelId,
        clientApiKey: config.apiKey,
        voiceSettings: {
          stability: config.stability,
          similarity_boost: config.similarityBoost,
          style: config.style,
          use_speaker_boost: config.useSpeakerBoost,
        },
        bookId: options?.bookId || 'la_boite_a_merveilles',
        pageNumber: options?.pageNumber || 1,
      }),
    });

    const data = await res.json();
    if (data.success && data.audioBase64) {
      const dataUrl = `data:${data.mimeType || 'audio/mpeg'};base64,${data.audioBase64}`;
      clientAudioCache.set(cacheKey, dataUrl);
      return {
        success: true,
        audioUrl: dataUrl,
        fromCache: data.fromCache,
      };
    }

    if (data.error === 'QUOTA_EXCEEDED' || data.error === 'INVALID_KEY') {
      globalQuotaExhausted = true;
      saveElevenLabsConfig({ enabled: false });
    }

    return {
      success: false,
      error: data.error,
      message: data.message,
      fallbackToBrowser: true,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message,
      fallbackToBrowser: true,
    };
  }
}

/**
 * Dedicated ElevenLabs Audio Player
 */
class ElevenLabsPlayerInstance {
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private isPaused = false;
  private subscribers = new Set<(state: { isPlaying: boolean; isPaused: boolean; progress: number }) => void>();

  public subscribe(cb: (state: { isPlaying: boolean; isPaused: boolean; progress: number }) => void): () => void {
    this.subscribers.add(cb);
    cb(this.getState());
    return () => {
      this.subscribers.delete(cb);
    };
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      progress: this.currentAudio && this.currentAudio.duration ? (this.currentAudio.currentTime / this.currentAudio.duration) : 0,
    };
  }

  private notify() {
    const st = this.getState();
    this.subscribers.forEach((cb) => cb(st));
  }

  public async playUrl(url: string, speed = 1.0, onEnd?: () => void): Promise<void> {
    this.stop();
    const audio = new Audio(url);
    this.currentAudio = audio;
    audio.playbackRate = speed;

    audio.onplay = () => {
      this.isPlaying = true;
      this.isPaused = false;
      this.notify();
    };

    audio.onended = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.notify();
      onEnd?.();
    };

    audio.ontimeupdate = () => {
      this.notify();
    };

    audio.onerror = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.notify();
    };

    await audio.play();
  }

  public pause(): void {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      this.isPlaying = false;
      this.isPaused = true;
      this.notify();
    }
  }

  public resume(): void {
    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.play().catch(console.error);
      this.isPlaying = true;
      this.isPaused = false;
      this.notify();
    }
  }

  public stop(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = '';
      } catch {}
      this.currentAudio = null;
    }
    this.isPlaying = false;
    this.isPaused = false;
    this.notify();
  }

  public setSpeed(speed: number): void {
    if (this.currentAudio) {
      this.currentAudio.playbackRate = speed;
    }
  }
}

export const elevenLabsPlayer = new ElevenLabsPlayerInstance();

/**
 * STRICT REQUIREMENT IMPLEMENTATION:
 * Plays Modern Standard Arabic text using ElevenLabs API with forced multilingual model,
 * proper UTF-8 JSON encoding, Blob URL creation, and robust autoplay & catch error handling.
 */
export async function playElevenLabsArabicAudio(
  text: string,
  apiKey: string,
  voiceId: string = 'pNInz6obpgDQGcFmaJgB' // Default Arabic Adam voice
): Promise<HTMLAudioElement | null> {
  const cleanText = (text || '').replace(/[*_#`~«»\[\]{}()]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleanText || !apiKey) {
    console.warn('[ElevenLabs] Missing text or API key for Arabic TTS');
    return null;
  }

  try {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`;
    
    // 1. FORCE MULTILINGUAL MODEL & 2. PROPER ARABIC UTF-8 ENCODING
    const payload = {
      text: cleanText,
      model_id: 'eleven_multilingual_v2', // STRICT REQUIREMENT: Forced multilingual model for Arabic support
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.05,
        use_speaker_boost: true,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[ElevenLabs API Error]:', errText);
      throw new Error(`ElevenLabs API failed with status ${response.status}: ${errText}`);
    }

    // 3. AUDIO PLAYBACK FIX: Handle API response as an Audio Blob & add diagnostic traces
    const audioBlob = await response.blob();
    console.log('[ElevenLabs Diagnostic] Status:', response.status, 'ContentType:', response.headers.get('content-type'), 'BlobSize:', audioBlob.size);
    
    const objectUrl = URL.createObjectURL(audioBlob);

    // 4. BROWSER AUTOPLAY HANDLING: Play immediately with .catch error handling
    const audioElement = new Audio(objectUrl);
    audioElement.playbackRate = 1.0;

    await audioElement.play().catch((autoplayErr) => {
      console.warn('[ElevenLabs Autoplay Blocked / Error]:', autoplayErr);
    });

    return audioElement;
  } catch (error) {
    console.error('[ElevenLabs TTS Execution Error]:', error);
    return null;
  }
}

