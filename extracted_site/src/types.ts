export type BookId = 'la_boite_a_merveilles' | 'antigone' | 'le_dernier_jour_dun_condamne';

export interface BookTheme {
  themeName: string;
  themeTagline: string;
  eraBadge: string;
  bgLight: string;
  bgDark: string;
  primaryBrand: 'amber' | 'rose' | 'blue';
  accentHex: string;
  cardBgLight: string;
  cardBgDark: string;
  navbarBorderLight: string;
  navbarBorderDark: string;
  readerPageBgLight: string;
  readerPageBgDark: string;
  borderLight: string;
  borderDark: string;
  accentBtn: string;
  accentBadge: string;
  bannerGradient: string;
  motifStyle: 'zellij' | 'theban_stage' | 'gothic_iron';
  quote: {
    french: string;
    arabic: string;
    speaker?: string;
  };
}

export interface BookInfo {
  id: BookId;
  title: string;
  titleFrench: string;
  titleArabic: string;
  author: string;
  authorArabic: string;
  genre: string;
  genreArabic: string;
  year: string;
  totalPages: number;
  descriptionArabic: string;
  descriptionFrench: string;
  badge: string;
  theme: BookTheme;
  colorScheme: {
    primary: string;
    secondary: string;
    border: string;
    gradient: string;
    accentText: string;
  };
}

export type SelectionType = 'WORD' | 'SENTENCE' | 'PARAGRAPH';
export type TranslationMode = 'word-by-word' | 'full-sentence';

export interface SelfVerificationReport {
  detectedType: SelectionType;
  passed: boolean;
  completenessRatio: number; // 0 to 100%
  rule1Check: boolean; // Word check: strictly one contextual Arabic word/compound + dictionary entries
  rule2Check: boolean; // Sentence/Paragraph check: 100% complete, no omitted words, context accurate
  notes: string;
  autoCorrected: boolean;
}

export interface WordTranslationDetails {
  primaryArabic: string;
  partOfSpeech?: string;
  contextualMeaning: string;
  dictionaryDefinitions: string[];
  alternativeMeanings: string[];
  exampleContextFrench: string;
  exampleContextArabic: string;
}

export interface ChunkInfo {
  isChunked: boolean;
  totalChunks: number;
  chunks?: { index: number; french: string; arabic: string }[];
}

export interface WordBreakdownItem {
  frenchWord: string;
  arabicTranslation: string;
  partOfSpeech?: string;
  grammarNote?: string;
}

export interface TranslationResponse {
  type: SelectionType;
  translationMode?: TranslationMode;
  originalText: string;
  arabicTranslation: string;
  wordDetails?: WordTranslationDetails;
  wordByWordBreakdown?: WordBreakdownItem[];
  sideBySide?: {
    french: string;
    arabic: string;
  };
  literaryAnalysis?: {
    figureDeStyle?: string;
    explanation?: string;
  };
  chunkingInfo?: ChunkInfo;
  selfVerification: SelfVerificationReport;
  isContextExpanded?: boolean;
  expandedContextWindow?: {
    surroundingBefore?: string;
    surroundingAfter?: string;
    paragraphsCount?: number;
    windowSize?: number;
  };
}

export interface NovelPage {
  pageNumber: number;
  chapter: number;
  chapterTitle: string;
  text: string;
  arabicSummary: string;
  keyEventsArabic: string[];
  mainCharacters: string[];
}

export interface PageSummaryCharacter {
  name: string;
  roleArabic: string;
}

export interface PageSummaryResponse {
  pageNumber: number;
  bookId: BookId;
  novelTitle?: string;
  chapterTitle?: string;
  quickSynopsisArabic: string;
  situationDuPassageArabic?: string;
  keyEventsArabic: string[];
  mainCharacters?: PageSummaryCharacter[];
  regionalExamPointers?: string;
  thematicInsight?: string;
  generatedWithAI: boolean;
}

export interface ChapterMeta {
  chapter: number;
  title: string;
  titleArabic: string;
  startPage: number;
  endPage: number;
  mainThemeArabic: string;
}

export type QuizDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type QuizCategory =
  | 'Compréhension'
  | 'Figures de style'
  | 'Personnages'
  | 'Événements'
  | 'Causes & Motivations'
  | 'Chronologie & Contexte'
  | 'Dialogues & Interlocuteurs'
  | 'Langue & Grammaire'
  | 'Analyse & Citations';

export type QuizCategoryFilter =
  | 'ALL'
  | 'EVENTS'
  | 'EVENTS_CAUSES'
  | 'EVENTS_CHRONO'
  | 'EVENTS_DIALOGUE'
  | 'FIGURES_DE_STYLE'
  | 'COMPREHENSION'
  | 'CHARACTERS_THEMES';

export interface QuizQuestion {
  id: string;
  pageNumber: number;
  questionFrench: string;
  questionArabic: string;
  options: string[];
  correctIndex: number;
  explanationFrench: string;
  explanationArabic: string;
  category: QuizCategory;
  difficulty?: QuizDifficulty;
  quoteExcerpt?: string; // المقتطف الدقيق من الصفحة
  targetConcept?: string; // المفهوم المستهدف (استعارة، سبب الحدث، وصف الحالة النفسية...)
  reasoningBreakdown?: {
    whyCorrectArabic?: string;
    whyIncorrectArabic?: string;
  };
}

export interface QuizResult {
  totalQuestions: number;
  score: number;
  userAnswers: { [questionId: string]: number };
}

export interface QuizPageText {
  pageNumber: number;
  text: string;
  arabicSummary?: string;
  keyEventsArabic?: string[];
  chapterTitle?: string;
}

export interface QuizRequest {
  selectedPages: number[];
  numberOfQuestions?: number;
  categoryFilter?: QuizCategoryFilter;
  difficulty?: QuizDifficulty;
  category?: string;
  bookId?: BookId;
  pageTexts?: QuizPageText[];
  scopeType?: 'current' | 'range' | 'chapter' | 'all';
  chapterNumber?: number;
}

export type VocabCategory = 'VOCABULARY' | 'THEME' | 'FIGURE_DE_STYLE' | 'CHARACTER' | 'CHAPTER' | string;

export interface FlashcardWord {
  id: string;
  bookId: BookId;
  frenchWord: string;
  arabicMeaning: string;
  partOfSpeech?: string;
  category?: VocabCategory;
  definitionArabic?: string;
  definitionFrench?: string;
  characterRoleArabic?: string;
  contextualMeaning?: string;
  synonyms: string[];
  dictionaryDefinitions?: string[];
  alternativeMeanings?: string[];
  exampleContextFrench?: string;
  exampleContextArabic?: string;
  pageNumber?: number;
  addedAt: number;
  masteryLevel: 'new' | 'learning' | 'mastered';
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  lastReviewedAt?: number;
  isAiTranslated?: boolean;
  lastAiTranslatedAt?: number;
  isHighlight?: boolean;
}

export type VocabQuizType =
  | 'ALL'
  | 'SYNONYMS'
  | 'ANTONYMS'
  | 'CHAMPS_LEXICAUX'
  | 'REGISTRES'
  | 'ARABIC_MEANINGS'
  | 'CONTEXT_COMPLETION'
  | 'DEFINITIONS';

export interface VocabQuizQuestion {
  id: string;
  cardId: string;
  type:
    | 'FRENCH_SYNONYM'
    | 'ANTONYM'
    | 'CHAMP_LEXICAL'
    | 'REGISTRE'
    | 'ARABIC_MEANING'
    | 'CONTEXT_COMPLETION'
    | 'DEFINITIONS';
  frenchWord: string;
  prompt: string;
  promptLanguage: 'fr' | 'ar';
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  categoryLabel?: string;
  exampleExcerpt?: string;
  relatedCard: FlashcardWord;
}

export interface HighlightColor {
  id: string;
  name: string;
  nameArabic: string;
  bgLight: string;
  bgDark: string;
  borderLight: string;
  borderDark: string;
  textLight: string;
  textDark: string;
  hex: string;
}

export interface TextHighlight {
  id: string;
  bookId: BookId;
  pageNumber: number;
  text: string;
  colorId: string;
  customColorHex?: string;
  createdAt: number;
  note?: string;
}

export interface BookmarkItem {
  bookId: BookId;
  pageNumber: number;
  createdAt: number;
  chapterTitle?: string;
  chapterTitleArabic?: string;
  snippet?: string;
  arabicSummary?: string;
  note?: string;
}

export interface PageReadingTimeRecord {
  bookId: BookId;
  pageNumber: number;
  seconds: number;
  lastReadTimestamp: number;
}

export interface DayFocusHistory {
  date: string; // YYYY-MM-DD
  totalSeconds: number;
  goalMinutes: number;
  goalReached: boolean;
  pagesVisited: number;
}

export interface FocusSessionState {
  dailyGoalMinutes: number;
  todaySeconds: number;
  todayDate: string;
  pageSecondsMap: Record<string, number>; // key: `${bookId}_${pageNumber}` -> seconds
  streakDays: number;
  lastActiveDate: string;
  history: DayFocusHistory[];
  isTimerRunning: boolean;
  activeSessionMode: 'stopwatch' | 'pomodoro';
  pomodoroDurationMinutes: number;
  pomodoroSecondsRemaining: number;
  soundEnabled: boolean;
}



