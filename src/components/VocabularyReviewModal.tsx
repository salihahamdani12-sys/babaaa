import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Sparkles,
  BookOpen,
  Plus,
  Trash2,
  Search,
  Filter,
  Volume2,
  VolumeX,
  ArrowRight,
  ArrowLeft,
  Shuffle,
  Eye,
  EyeOff,
  Award,
  ChevronLeft,
  ChevronRight,
  FileText,
  Sliders,
  Play,
  Pause,
  Mic,
  MicOff,
  Headphones,
  Zap,
  BookmarkCheck,
  Compass,
  UserCheck,
  Languages,
  Check,
  RefreshCw,
  Flame,
  Coffee,
  Trophy,
  XCircle,
  RotateCcw,
  Download
} from 'lucide-react';
import { VocabularyExportModal } from './VocabularyExportModal';
import {
  BookId,
  BookInfo,
  FlashcardWord,
  VocabQuizQuestion,
  VocabQuizType,
  VocabCategory
} from '../types';
import { BOOKS } from '../data/books';
import { getBookChapters } from '../data/bookService';
import {
  getStoredFlashcards,
  updateCardMastery,
  deleteCard,
  addCustomCard,
  subscribeToVocabularyUpdates,
  generateVocabularyQuiz,
  inferCategory,
  translateFlashcardWithAI,
  syncAllHighlightsToVocabulary
} from '../data/vocabularyService';

interface VocabularyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'relax' | 'voice_test' | 'cards' | 'quiz' | 'list' | string;
  initialCardId?: string;
  activeBookId?: BookId;
  currentPage?: number;
  bookInfo?: BookInfo;
}

export const VocabularyReviewModal: React.FC<VocabularyReviewModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'relax',
  initialCardId,
  activeBookId = 'la_boite_a_merveilles',
  currentPage = 1,
  bookInfo
}) => {
  const [cards, setCards] = useState<FlashcardWord[]>(() => getStoredFlashcards());
  const [activeTab, setActiveTab] = useState<'relax' | 'voice_test' | 'cards' | 'quiz' | 'list'>(
    initialTab === 'relax' || initialTab === 'voice_test' || initialTab === 'cards' || initialTab === 'quiz' || initialTab === 'list'
      ? initialTab
      : 'relax'
  );

  const [selectedBookFilter, setSelectedBookFilter] = useState<BookId | 'all'>(activeBookId);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<VocabCategory>('all');
  const [selectedMasteryFilter, setSelectedMasteryFilter] = useState<'all' | 'new' | 'learning' | 'mastered'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Scope selection state (defaults to "all" so all words and user highlights are always available)
  const totalPages = bookInfo?.totalPages || 99;
  const [vocabScope, setVocabScope] = useState<'reached' | 'page' | 'chapter' | 'range' | 'all'>('all');
  const [selectedScopePage, setSelectedScopePage] = useState<number>(currentPage || 1);
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number>(1);
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(currentPage || 1);

  const chapters = getBookChapters(selectedBookFilter === 'all' ? activeBookId : selectedBookFilter);

  // Flashcard carousel state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inspectedCard, setInspectedCard] = useState<FlashcardWord | null>(null);
  const [showOnlyHighlights, setShowOnlyHighlights] = useState<boolean>(false);
  const [translatingCardId, setTranslatingCardId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // Sync highlights into flashcards whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const synced = syncAllHighlightsToVocabulary();
      setCards(synced);
    }
  }, [isOpen]);

  // React to novel highlights updates in real-time
  useEffect(() => {
    const handleHlUpdate = () => {
      const synced = syncAllHighlightsToVocabulary();
      setCards(synced);
    };
    window.addEventListener('novel_highlights_updated', handleHlUpdate);
    return () => window.removeEventListener('novel_highlights_updated', handleHlUpdate);
  }, []);

  const handleTranslateCard = async (cardToTranslate: FlashcardWord, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (translatingCardId) return;
    setTranslatingCardId(cardToTranslate.id);
    try {
      const updated = await translateFlashcardWithAI(cardToTranslate);
      setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      if (inspectedCard && inspectedCard.id === updated.id) {
        setInspectedCard(updated);
      }
    } catch (err) {
      console.warn('Translation error:', err);
    } finally {
      setTranslatingCardId(null);
    }
  };

  // ==========================================
  // RELAX / 3AYAN CONTINUOUS AUDIO AUTO-PLAYER
  // ==========================================
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayLanguage, setAutoPlayLanguage] = useState<'bilingual' | 'fr' | 'ar'>('bilingual');
  const [autoPlaySpeed, setAutoPlaySpeed] = useState<number>(1.0);
  const autoPlayTimeoutRef = useRef<any>(null);

  // ==========================================
  // VOICE DEFINITION SELF-TEST (AUDIO RECORDING / SPEECH RECOGNITION)
  // ==========================================
  const [isVoiceTestingActive, setIsVoiceTestingActive] = useState(false);
  const [voiceTestIndex, setVoiceTestIndex] = useState(0);
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [speechLang, setSpeechLang] = useState<'ar-SA' | 'fr-FR'>('ar-SA');
  const [isVoiceRevealed, setIsVoiceRevealed] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Custom Card Add Form
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newFrenchWord, setNewFrenchWord] = useState('');
  const [newArabicMeaning, setNewArabicMeaning] = useState('');
  const [newCategory, setNewCategory] = useState<'verb' | 'adverb' | 'term' | 'character'>('verb');
  const [newSynonyms, setNewSynonyms] = useState('');
  const [newContextFrench, setNewContextFrench] = useState('');
  const [newDefFrench, setNewDefFrench] = useState('');
  const [newDefArabic, setNewDefArabic] = useState('');
  const [newPartOfSpeech, setNewPartOfSpeech] = useState('Verbe');
  const [newBookId, setNewBookId] = useState<BookId>(activeBookId);

  // Quiz State
  const [quizType, setQuizType] = useState<VocabQuizType>('ALL');
  const [quizQuestionCount, setQuizQuestionCount] = useState<number>(5);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<VocabQuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [quizHistory, setQuizHistory] = useState<{ question: VocabQuizQuestion; selected: number; isCorrect: boolean }[]>([]);
  const [showVocabQuizHint, setShowVocabQuizHint] = useState<boolean>(false);

  // TTS Speech helpers (declared before useEffect to avoid temporal dead zone)
  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const playSpeech = (text: string, lang: 'fr-FR' | 'ar-SA', onEndCallback?: () => void) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = autoPlaySpeed;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEndCallback) onEndCallback();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        if (onEndCallback) onEndCallback();
      };
      window.speechSynthesis.speak(utterance);
    } else if (onEndCallback) {
      onEndCallback();
    }
  };

  // Auto-player logic for "3ayan / Relax" mode
  const stopAutoPlayer = () => {
    setIsAutoPlaying(false);
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
      autoPlayTimeoutRef.current = null;
    }
    stopSpeech();
  };

  // Subscribe to storage changes
  useEffect(() => {
    setCards(getStoredFlashcards());
    const unsubscribe = subscribeToVocabularyUpdates((updatedCards) => {
      setCards(updatedCards);
    });
    return () => {
      unsubscribe();
      stopSpeech();
      stopAutoPlayer();
    };
  }, [isOpen]);

  useEffect(() => {
    if (initialCardId && cards.length > 0) {
      const idx = cards.findIndex((c) => c.id === initialCardId);
      if (idx !== -1) {
        setCurrentCardIndex(idx);
        setActiveTab('cards');
      }
    }
  }, [initialCardId, cards]);

  // Clean up auto player on unmount or tab switch
  useEffect(() => {
    if (activeTab !== 'relax') {
      stopAutoPlayer();
    }
  }, [activeTab]);

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechRecognitionSupported(false);
      }
    }
  }, []);

  if (!isOpen) return null;

  // Filter cards based on Book, Mastery, Scope, Category, and Search Query
  const filteredCards = cards.filter((card) => {
    const matchesBook = selectedBookFilter === 'all' || card.bookId === selectedBookFilter;
    const matchesMastery = selectedMasteryFilter === 'all' || card.masteryLevel === selectedMasteryFilter;

    // Category filter
    const cat = card.category || inferCategory(card);
    const matchesCategory = selectedCategoryFilter === 'all' || cat === selectedCategoryFilter;

    // Scope check:
    const cardPage = card.pageNumber || 1;
    let matchesScope = true;
    const isUserHighlight = card.isHighlight || (card.id && (card.id.startsWith('hl-card-') || card.id.startsWith('custom-')));

    if (showOnlyHighlights && !isUserHighlight) {
      return false;
    }

    if (isUserHighlight) {
      matchesScope = true;
    } else if (vocabScope === 'reached') {
      matchesScope = cardPage <= (currentPage || 1);
    } else if (vocabScope === 'page') {
      matchesScope = cardPage === selectedScopePage;
    } else if (vocabScope === 'chapter') {
      const ch = chapters.find((c) => c.chapter === selectedChapterNumber) || chapters[0];
      if (ch) {
        const s = Math.min(ch.startPage, ch.endPage);
        const e = Math.max(ch.startPage, ch.endPage);
        matchesScope = cardPage >= s && cardPage <= e;
      }
    } else if (vocabScope === 'range') {
      const s = Math.min(rangeStart, rangeEnd);
      const e = Math.max(rangeStart, rangeEnd);
      matchesScope = cardPage >= s && cardPage <= e;
    }

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      card.frenchWord.toLowerCase().includes(q) ||
      card.arabicMeaning.toLowerCase().includes(q) ||
      (card.synonyms && card.synonyms.some((s) => s.toLowerCase().includes(q))) ||
      (card.contextualMeaning && card.contextualMeaning.toLowerCase().includes(q)) ||
      (card.definitionFrench && card.definitionFrench.toLowerCase().includes(q)) ||
      (card.definitionArabic && card.definitionArabic.toLowerCase().includes(q));

    return matchesBook && matchesMastery && matchesCategory && matchesScope && matchesSearch;
  });

  const activeCard: FlashcardWord | undefined = filteredCards[currentCardIndex] || filteredCards[0];
  const activeVoiceCard: FlashcardWord | undefined = filteredCards[voiceTestIndex] || filteredCards[0];

  // Count items per category in current scope
  const countVerbs = filteredCards.filter((c) => (c.category || inferCategory(c)) === 'verb').length;
  const countAdverbs = filteredCards.filter((c) => (c.category || inferCategory(c)) === 'adverb').length;
  const countTerms = filteredCards.filter((c) => (c.category || inferCategory(c)) === 'term').length;
  const countCharacters = filteredCards.filter((c) => (c.category || inferCategory(c)) === 'character').length;
  const countHighlights = cards.filter((c) => c.isHighlight || (c.id && (c.id.startsWith('hl-card-') || c.id.startsWith('custom-')))).length;

  // Speak Definition Model
  const speakModelDefinition = (card: FlashcardWord, lang: 'fr' | 'ar') => {
    if (lang === 'fr') {
      const def = card.definitionFrench || card.contextualMeaning || card.frenchWord;
      playSpeech(`${card.frenchWord}. Définition : ${def}`, 'fr-FR');
    } else {
      const def = card.definitionArabic || card.arabicMeaning;
      playSpeech(`${card.arabicMeaning}. الشرح والسياق: ${def}`, 'ar-SA');
    }
  };

  const startAutoPlayer = (startIndex: number = 0) => {
    if (filteredCards.length === 0) return;
    setIsAutoPlaying(true);
    playAutoStep(startIndex);
  };

  const playAutoStep = (index: number) => {
    if (index >= filteredCards.length) {
      stopAutoPlayer();
      return;
    }

    setCurrentCardIndex(index);
    const card = filteredCards[index];

    if (autoPlayLanguage === 'bilingual') {
      // Step 1: French word
      playSpeech(card.frenchWord, 'fr-FR', () => {
        autoPlayTimeoutRef.current = setTimeout(() => {
          // Step 2: Arabic meaning and definition
          const arText = card.arabicMeaning + ' : ' + (card.definitionArabic || card.contextualMeaning || '');
          playSpeech(arText, 'ar-SA', () => {
            autoPlayTimeoutRef.current = setTimeout(() => {
              playAutoStep(index + 1);
            }, 1200);
          });
        }, 600);
      });
    } else if (autoPlayLanguage === 'fr') {
      const frText = card.frenchWord + '. ' + (card.definitionFrench || card.contextualMeaning || '');
      playSpeech(frText, 'fr-FR', () => {
        autoPlayTimeoutRef.current = setTimeout(() => {
          playAutoStep(index + 1);
        }, 1200);
      });
    } else {
      const arText = card.frenchWord + ' تعني ' + card.arabicMeaning + '. ' + (card.definitionArabic || card.contextualMeaning || '');
      playSpeech(arText, 'ar-SA', () => {
        autoPlayTimeoutRef.current = setTimeout(() => {
          playAutoStep(index + 1);
        }, 1200);
      });
    }
  };

  // Speech Recognition recording for student oral test
  const startListeningVoice = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('ميزة التسميع الصوتي غير مدعومة في هذا المتصفح. يمكنك الاستماع للتعريف النموذجي بالصوت مباشرة.');
      return;
    }

    try {
      stopSpeech();
      const recognition = new SpeechRecognition();
      recognition.lang = speechLang;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListeningSpeech(true);
        setSpokenTranscript('');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setSpokenTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error', event);
        setIsListeningSpeech(false);
      };

      recognition.onend = () => {
        setIsListeningSpeech(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition failed to start:', err);
      setIsListeningSpeech(false);
    }
  };

  const stopListeningVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListeningSpeech(false);
    }
  };

  // Card Navigation
  const handleNextCard = () => {
    setIsFlipped(false);
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
    } else {
      setCurrentCardIndex(filteredCards.length - 1);
    }
  };

  const handleShuffleCards = () => {
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * filteredCards.length);
    setCurrentCardIndex(randomIndex);
  };

  const handleRateMastery = (rating: 'learning' | 'mastered' | 'correct' | 'incorrect') => {
    if (!activeCard) return;
    updateCardMastery(activeCard.id, rating);
    setCards(getStoredFlashcards());
    handleNextCard();
  };

  const handleRateVoiceMastery = (rating: 'learning' | 'mastered' | 'correct' | 'incorrect') => {
    if (!activeVoiceCard) return;
    updateCardMastery(activeVoiceCard.id, rating);
    setCards(getStoredFlashcards());
    setIsVoiceRevealed(false);
    setSpokenTranscript('');
    if (voiceTestIndex < filteredCards.length - 1) {
      setVoiceTestIndex((prev) => prev + 1);
    } else {
      setVoiceTestIndex(0);
    }
  };

  const handleDeleteCard = (cardId: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه البطاقة؟')) {
      deleteCard(cardId);
      setCards(getStoredFlashcards());
      if (currentCardIndex >= filteredCards.length - 1) {
        setCurrentCardIndex(Math.max(0, filteredCards.length - 2));
      }
    }
  };

  const handleAddCustomCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFrenchWord.trim() || !newArabicMeaning.trim()) return;

    const synList = newSynonyms
      .split(/[,،]/)
      .map((s) => s.trim())
      .filter(Boolean);

    addCustomCard({
      bookId: newBookId,
      frenchWord: newFrenchWord.trim(),
      arabicMeaning: newArabicMeaning.trim(),
      category: newCategory,
      partOfSpeech: newPartOfSpeech,
      synonyms: synList.length > 0 ? synList : ['Synonyme littéraire'],
      contextualMeaning: `مفردة مضافة من قبل التلميذ في سياق ${newBookId === 'antigone' ? 'أنتيجون' : newBookId === 'le_dernier_jour_dun_condamne' ? 'آخر يوم لمحكوم عليه' : 'علبة العجائب'}.`,
      definitionFrench: newDefFrench.trim() || `Définition littéraire de « ${newFrenchWord.trim()} »`,
      definitionArabic: newDefArabic.trim() || newArabicMeaning.trim(),
      exampleContextFrench: newContextFrench || `Exemple : « ${newFrenchWord.trim()} »`,
      exampleContextArabic: `سياق المفردة بالعربية.`,
      pageNumber: currentPage,
      masteryLevel: 'new'
    });

    setCards(getStoredFlashcards());
    setNewFrenchWord('');
    setNewArabicMeaning('');
    setNewSynonyms('');
    setNewContextFrench('');
    setNewDefFrench('');
    setNewDefArabic('');
    setIsAddingCard(false);
  };

  // Quiz Handlers
  const handleStartQuiz = () => {
    const targetCards = filteredCards.length > 0 ? filteredCards : cards;
    const generated = generateVocabularyQuiz(targetCards, quizType, quizQuestionCount);
    if (generated.length === 0) {
      alert('لا توجد مفردات كافية في هذا النطاق المحدد. يرجى اختيار نطاق أوسع.');
      return;
    }
    setQuizQuestions(generated);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    setShowVocabQuizHint(false);
    setUserScore(0);
    setQuizHistory([]);
    setIsQuizCompleted(false);
    setIsQuizActive(true);
  };

  const handleSelectQuizOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionIndex(index);
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedOptionIndex === null || isAnswerSubmitted) return;
    const currentQ = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedOptionIndex === currentQ.correctAnswerIndex;

    setIsAnswerSubmitted(true);
    if (isCorrect) {
      setUserScore((prev) => prev + 1);
      updateCardMastery(currentQ.cardId, 'correct');
    } else {
      updateCardMastery(currentQ.cardId, 'incorrect');
    }

    setQuizHistory((prev) => [
      ...prev,
      {
        question: currentQ,
        selected: selectedOptionIndex,
        isCorrect
      }
    ]);
  };

  const handleNextQuizQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswerSubmitted(false);
      setShowVocabQuizHint(false);
    } else {
      setIsQuizCompleted(true);
      setShowVocabQuizHint(false);
      setCards(getStoredFlashcards());
    }
  };

  // Category Badge helper
  const renderCategoryBadge = (category?: 'verb' | 'adverb' | 'term' | 'character' | string) => {
    switch (category) {
      case 'verb':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
            <Zap className="w-3 h-3 text-amber-600" />
            <span>فعل (Verbe)</span>
          </span>
        );
      case 'adverb':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border border-indigo-500/30">
            <Compass className="w-3 h-3 text-indigo-600" />
            <span>ظرف / رابط (Adverbe)</span>
          </span>
        );
      case 'character':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-500/30">
            <UserCheck className="w-3 h-3 text-rose-600" />
            <span>شخصية (Personnage)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
            <BookmarkCheck className="w-3 h-3 text-emerald-600" />
            <span>مصطلح ومفردة (Terme)</span>
          </span>
        );
    }
  };

  // Stats calculation
  const totalCardsCount = cards.length;
  const masteredCount = cards.filter((c) => c.masteryLevel === 'mastered').length;
  const learningCount = cards.filter((c) => c.masteryLevel === 'learning').length;
  const newCount = cards.filter((c) => c.masteryLevel === 'new').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#faf7ef] dark:bg-stone-900 w-full max-w-5xl rounded-3xl border-2 border-amber-800/40 dark:border-stone-700 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header Bar */}
        <div className="bg-linear-to-r from-amber-950 via-stone-900 to-emerald-950 text-white px-5 sm:px-7 py-4 flex items-center justify-between border-b border-amber-800/60 shrink-0">
          <div className="flex items-center gap-3 text-right">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-arabic">
                  نظام حفظ واستيعاب مفردات الامتحان الجهوي
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-bold font-serif border border-amber-400/30">
                  1ère Bac
                </span>
              </div>
              <p className="text-xs text-amber-200/80 font-arabic flex items-center gap-2">
                <span>تكيّف ذكي مع حالتك: استرخاء وقراءة تلقائية · اختبار صوتي · بطاقات وكويز</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopAutoPlayer();
              stopSpeech();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-amber-100 flex items-center justify-center transition-all cursor-pointer border border-white/10"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scope and Progress Selector Bar ("thab3a fi nitha9 safahat li wsalt lihom") */}
        <div className="bg-amber-50/90 dark:bg-stone-900/90 border-b border-amber-200/80 dark:border-stone-800 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-amber-950 dark:text-amber-300 flex items-center gap-1 font-arabic">
              <Sliders className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>نطاق الصفحات:</span>
            </span>

            <div className="flex items-center gap-1 bg-white dark:bg-stone-800 p-1 rounded-xl border border-amber-300/80 dark:border-stone-700 shadow-2xs">
              <button
                onClick={() => setVocabScope('reached')}
                className={`px-3 py-1 rounded-lg font-arabic font-bold transition-all ${
                  vocabScope === 'reached'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700'
                }`}
              >
                📍 حتى الصفحة التي وصلت إليها (1 إلى {currentPage})
              </button>

              <button
                onClick={() => setVocabScope('page')}
                className={`px-2.5 py-1 rounded-lg font-arabic font-bold transition-all ${
                  vocabScope === 'page'
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700'
                }`}
              >
                📄 الصفحة {currentPage} فقط
              </button>

              <button
                onClick={() => setVocabScope('all')}
                className={`px-2.5 py-1 rounded-lg font-arabic font-bold transition-all ${
                  vocabScope === 'all'
                    ? 'bg-indigo-800 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700'
                }`}
              >
                📚 كامل الرواية
              </button>
            </div>
          </div>

          {/* Book switcher */}
          <div className="flex items-center gap-2">
            <span className="text-stone-600 dark:text-stone-400 font-arabic">المؤلف:</span>
            <select
              value={selectedBookFilter}
              onChange={(e) => setSelectedBookFilter(e.target.value as BookId | 'all')}
              className="bg-white dark:bg-stone-800 border border-amber-300 dark:border-stone-700 rounded-lg px-2.5 py-1 text-xs text-amber-950 dark:text-stone-200 font-bold focus:outline-hidden"
            >
              <option value="la_boite_a_merveilles">علبة العجائب (La Boîte à Merveilles)</option>
              <option value="antigone">أنتيجون (Antigone)</option>
              <option value="le_dernier_jour_dun_condamne">آخر يوم لمحكوم عليه (Le Dernier Jour)</option>
              <option value="all">كل الروايات المقررة</option>
            </select>
          </div>
        </div>

        {/* Main Mode Navigation Tabs (Level / Mode switcher) */}
        <div className="bg-amber-100/70 dark:bg-stone-850 px-4 sm:px-6 py-2 border-b border-amber-200 dark:border-stone-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* 1. RELAX MODE (3ayan) */}
            <button
              onClick={() => {
                setActiveTab('relax');
                setIsQuizActive(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-arabic flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'relax'
                  ? 'bg-amber-800 text-white shadow-md scale-105'
                  : 'bg-white/80 dark:bg-stone-800 text-amber-950 dark:text-stone-200 hover:bg-amber-200/60 dark:hover:bg-stone-700 border border-amber-300/60 dark:border-stone-700'
              }`}
            >
              <Coffee className="w-4 h-4 text-amber-300" />
              <span>وضع الاسترخاء (Mode 3ayan)</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-950/30 text-[10px]">استماع تلقائي</span>
            </button>

            {/* 2. VOICE DEFINITION TEST MODE */}
            <button
              onClick={() => {
                setActiveTab('voice_test');
                setIsQuizActive(false);
                stopAutoPlayer();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-arabic flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'voice_test'
                  ? 'bg-indigo-900 text-white shadow-md scale-105'
                  : 'bg-white/80 dark:bg-stone-800 text-indigo-950 dark:text-stone-200 hover:bg-indigo-100/60 dark:hover:bg-stone-700 border border-indigo-300/60 dark:border-stone-700'
              }`}
            >
              <Mic className="w-4 h-4 text-indigo-300" />
              <span>التسميع والاختبار الصوتي</span>
              <span className="px-1.5 py-0.2 rounded bg-indigo-950/30 text-[10px]">Définition Audio</span>
            </button>

            {/* 3. FLASHCARDS 3D MODE */}
            <button
              onClick={() => {
                setActiveTab('cards');
                setIsQuizActive(false);
                stopAutoPlayer();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-arabic flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'cards'
                  ? 'bg-emerald-900 text-white shadow-md scale-105'
                  : 'bg-white/80 dark:bg-stone-800 text-emerald-950 dark:text-stone-200 hover:bg-emerald-100/60 dark:hover:bg-stone-700 border border-emerald-300/60 dark:border-stone-700'
              }`}
            >
              <RotateCw className="w-4 h-4 text-emerald-300" />
              <span>بطاقات الفلاش كارد</span>
            </button>

            {/* 4. QUIZ MODE */}
            <button
              onClick={() => {
                setActiveTab('quiz');
                stopAutoPlayer();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-arabic flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-rose-900 text-white shadow-md scale-105'
                  : 'bg-white/80 dark:bg-stone-800 text-rose-950 dark:text-stone-200 hover:bg-rose-100/60 dark:hover:bg-stone-700 border border-rose-300/60 dark:border-stone-700'
              }`}
            >
              <Award className="w-4 h-4 text-rose-300" />
              <span>كويز المفردات (QCM)</span>
            </button>

            {/* 5. FULL LIST MODE */}
            <button
              onClick={() => {
                setActiveTab('list');
                setIsQuizActive(false);
                stopAutoPlayer();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-arabic flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-stone-800 text-white shadow-md'
                  : 'bg-white/80 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>كل المفردات ({filteredCards.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-arabic flex items-center gap-1.5 transition-all shadow-xs cursor-pointer hover:scale-102"
              title="تصدير وتحميل بطاقات المفردات (Excel, PDF, Anki)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-200" />
              <span>تصدير المفردات (Export)</span>
            </button>

            <button
              onClick={() => setIsAddingCard(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold font-arabic flex items-center gap-1 transition-all shadow-xs cursor-pointer hover:scale-102"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة بطاقة خاصة</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills (Verbes, Adverbes, Termes, Personnages) */}
        <div className="bg-[#f5eedc]/80 dark:bg-stone-900/80 px-4 sm:px-6 py-2 border-b border-amber-200/60 dark:border-stone-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 font-arabic ml-1">التصنيف:</span>

            <button
              onClick={() => {
                setShowOnlyHighlights(false);
                setSelectedCategoryFilter('all');
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold font-arabic transition-all cursor-pointer ${
                !showOnlyHighlights && selectedCategoryFilter === 'all'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-white/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-white border border-stone-300 dark:border-stone-700'
              }`}
            >
              🌟 الكل ({filteredCards.length})
            </button>

            <button
              onClick={() => {
                setShowOnlyHighlights((prev) => !prev);
              }}
              className={`px-3.5 py-1 rounded-full text-xs font-bold font-arabic transition-all flex items-center gap-1.5 cursor-pointer ${
                showOnlyHighlights
                  ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-400 font-black'
                  : 'bg-amber-100/70 dark:bg-stone-800 text-amber-900 dark:text-amber-300 hover:bg-amber-200/60 border border-amber-300/80 dark:border-stone-700'
              }`}
              title="عرض الكلمات والجمل التي ظللتها فقط"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>✨ تظليلاتي الخاصة ({countHighlights})</span>
            </button>

            <button
              onClick={() => setSelectedCategoryFilter('verb')}
              className={`px-3 py-1 rounded-full text-xs font-bold font-arabic transition-all flex items-center gap-1 ${
                selectedCategoryFilter === 'verb'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white/70 dark:bg-stone-800 text-amber-900 dark:text-amber-300 hover:bg-white border border-amber-300 dark:border-stone-700'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>الأفعال - Verbes ({countVerbs})</span>
            </button>

            <button
              onClick={() => setSelectedCategoryFilter('adverb')}
              className={`px-3 py-1 rounded-full text-xs font-bold font-arabic transition-all flex items-center gap-1 ${
                selectedCategoryFilter === 'adverb'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-white/70 dark:bg-stone-800 text-indigo-900 dark:text-indigo-300 hover:bg-white border border-indigo-300 dark:border-stone-700'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>الظروف والروابط - Adverbes ({countAdverbs})</span>
            </button>

            <button
              onClick={() => setSelectedCategoryFilter('term')}
              className={`px-3 py-1 rounded-full text-xs font-bold font-arabic transition-all flex items-center gap-1 ${
                selectedCategoryFilter === 'term'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white/70 dark:bg-stone-800 text-emerald-900 dark:text-emerald-300 hover:bg-white border border-emerald-300 dark:border-stone-700'
              }`}
            >
              <BookmarkCheck className="w-3 h-3" />
              <span>المصطلحات والمفردات - Termes ({countTerms})</span>
            </button>

            <button
              onClick={() => setSelectedCategoryFilter('character')}
              className={`px-3 py-1 rounded-full text-xs font-bold font-arabic transition-all flex items-center gap-1 ${
                selectedCategoryFilter === 'character'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-white/70 dark:bg-stone-800 text-rose-900 dark:text-rose-300 hover:bg-white border border-rose-300 dark:border-stone-700'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              <span>الشخصيات والمواقف - Personnages ({countCharacters})</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في المفردات..."
              className="bg-white dark:bg-stone-800 border border-amber-300 dark:border-stone-700 rounded-xl px-3 py-1 text-xs text-right pr-8 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden w-40 sm:w-56"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-2" />
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {/* ========================================================================= */}
          {/* TAB 1: RELAX MODE (وضع الاسترخاء والتصفح الهادئ مع المشغل التلقائي)       */}
          {/* ========================================================================= */}
          {activeTab === 'relax' && (
            <div className="space-y-5">
              {/* Relax Mode Banner & Hands-Free Audio Bar */}
              <div className="bg-linear-to-r from-amber-900/90 via-stone-900/95 to-emerald-950/90 text-white rounded-2xl p-4 sm:p-5 border border-amber-700/50 shadow-lg">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30">
                        <Coffee className="w-5 h-5" />
                      </span>
                      <h3 className="font-bold text-base sm:text-lg font-arabic text-amber-200">
                        وضع المراجعة الهادئة للمتعبين (Mode Relax / 3ayan)
                      </h3>
                    </div>
                    <p className="text-xs text-stone-300 font-arabic leading-relaxed max-w-2xl">
                      إذا كنت متعباً أو تشعر بالإرهاق، لا داعي للضغط أو الكتابة! شغّل <strong className="text-amber-300">القارئ التلقائي المستمر</strong> واستمع براحة تامة إلى نطق المفردة الفرنسية مع ترجمتها وشرحها بالعربية في نطاق الصفحات المقروءة.
                    </p>
                  </div>

                  {/* Audio Auto-Player Controls */}
                  <div className="flex items-center gap-2 bg-stone-950/60 p-2 rounded-2xl border border-amber-500/30 shrink-0">
                    <button
                      onClick={() => {
                        if (isAutoPlaying) {
                          stopAutoPlayer();
                        } else {
                          startAutoPlayer(currentCardIndex);
                        }
                      }}
                      className={`px-4 py-2.5 rounded-xl font-bold font-arabic text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                        isAutoPlaying
                          ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {isAutoPlaying ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>إيقاف القراءة التلقائية</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>تشغيل القارئ التلقائي المستمر</span>
                        </>
                      )}
                    </button>

                    {/* Language format dropdown */}
                    <select
                      value={autoPlayLanguage}
                      onChange={(e) => setAutoPlayLanguage(e.target.value as any)}
                      className="bg-stone-900 border border-stone-700 rounded-xl px-2 py-2 text-[11px] text-amber-200 font-arabic focus:outline-hidden"
                    >
                      <option value="bilingual">🔊 فرنسية ثم عربية (Bilingue)</option>
                      <option value="fr">🇫🇷 فرنسية فقط (FR)</option>
                      <option value="ar">🇲🇦 عربية فقط (AR)</option>
                    </select>

                    {/* Speed dropdown */}
                    <select
                      value={autoPlaySpeed}
                      onChange={(e) => setAutoPlaySpeed(Number(e.target.value))}
                      className="bg-stone-900 border border-stone-700 rounded-xl px-2 py-2 text-[11px] text-amber-200 font-mono focus:outline-hidden"
                    >
                      <option value={0.8}>0.8x (بطيء)</option>
                      <option value={1.0}>1.0x (عادي)</option>
                      <option value={1.2}>1.2x (سريع)</option>
                    </select>
                  </div>
                </div>

                {/* Auto Play status info */}
                {isAutoPlaying && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-amber-300 font-arabic">
                    <span className="flex items-center gap-2">
                      <Headphones className="w-4 h-4 animate-bounce" />
                      <span>جاري القراءة التلقائية للمفردات... استرخِ واستمع! (المفردة {currentCardIndex + 1} من {filteredCards.length})</span>
                    </span>
                    <button
                      onClick={() => {
                        stopSpeech();
                        if (currentCardIndex < filteredCards.length - 1) {
                          playAutoStep(currentCardIndex + 1);
                        } else {
                          stopAutoPlayer();
                        }
                      }}
                      className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-amber-100 flex items-center gap-1"
                    >
                      <span>تخطي إلى التالية</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Categorized Easy-Browse Grid */}
              {filteredCards.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-stone-850 rounded-2xl border border-dashed border-amber-300 dark:border-stone-700 p-6 space-y-2">
                  <Layers className="w-10 h-10 text-amber-400 mx-auto opacity-50" />
                  <p className="font-bold text-amber-950 dark:text-stone-200 font-arabic">لا توجد مفردات في هذا النطاق المحدد</p>
                  <p className="text-xs text-stone-500 font-arabic">اختر نطاقاً أوسع كـ «حتى الصفحة التي وصلت إليها» أو اختر كل التصنيفات.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCards.map((card, idx) => {
                    const cat = card.category || inferCategory(card);
                    const isCurrent = idx === currentCardIndex;
                    return (
                      <div
                        key={card.id || idx}
                        className={`bg-white dark:bg-stone-850 rounded-2xl p-4 border transition-all duration-200 shadow-sm flex flex-col justify-between ${
                          isCurrent && isAutoPlaying
                            ? 'border-2 border-amber-500 ring-4 ring-amber-500/20 bg-amber-50/50 dark:bg-stone-800'
                            : 'border-amber-200/80 dark:border-stone-700/80 hover:border-amber-400'
                        }`}
                      >
                        <div className="space-y-2.5">
                          {/* Header pill & page */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {renderCategoryBadge(cat)}
                              {card.pageNumber && (
                                <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 text-[10px] font-serif">
                                  صفحة {card.pageNumber}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => {
                                playSpeech(card.frenchWord, 'fr-FR', () => {
                                  setTimeout(() => {
                                    playSpeech(card.arabicMeaning, 'ar-SA');
                                  }, 400);
                                });
                              }}
                              className="w-8 h-8 rounded-full bg-amber-100 dark:bg-stone-700 hover:bg-amber-200 text-amber-900 dark:text-amber-300 flex items-center justify-center transition-all cursor-pointer"
                              title="استماع للنطق"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* French word & Arabic meaning */}
                          <div className="border-b border-amber-100 dark:border-stone-700/60 pb-2">
                            <div className="flex items-baseline justify-between gap-2">
                              <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                                {card.frenchWord}
                              </h4>
                              <span className="font-arabic font-bold text-base text-emerald-800 dark:text-emerald-400">
                                {card.arabicMeaning}
                              </span>
                            </div>
                            {card.partOfSpeech && (
                              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-serif italic">
                                {card.partOfSpeech}
                              </p>
                            )}
                          </div>

                          {/* Definitions and Context */}
                          <div className="space-y-1.5 text-xs">
                            {(card.definitionArabic || card.contextualMeaning) && (
                              <div className="text-stone-700 dark:text-stone-300 font-arabic text-right leading-relaxed bg-amber-50/60 dark:bg-stone-800 p-2 rounded-xl border border-amber-200/40 dark:border-stone-700">
                                <strong className="text-amber-900 dark:text-amber-400 block text-[11px] mb-0.5">
                                  {cat === 'character' ? '📌 الدور والموقف في الرواية:' : '📖 الشرح والدلالة في النص:'}
                                </strong>
                                <span>{card.definitionArabic || card.contextualMeaning}</span>
                              </div>
                            )}

                            {card.exampleContextFrench && (
                              <div className="text-stone-600 dark:text-stone-400 font-serif text-xs italic bg-stone-50 dark:bg-stone-800/50 p-2 rounded-xl border border-stone-200/50 dark:border-stone-700">
                                <span className="font-bold font-arabic not-italic text-[10px] text-stone-500 block mb-0.5">سياق الرواية:</span>
                                <span>« {card.exampleContextFrench} »</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Synonyms pills */}
                        {card.synonyms && card.synonyms.length > 0 && (
                          <div className="pt-2.5 mt-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] text-stone-400 font-arabic">مرادفات:</span>
                            {card.synonyms.slice(0, 3).map((s, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-serif border border-stone-200 dark:border-stone-700"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: VOICE TEST MODE (وضع التسميع والاختبار الصوتي والمطابقة)           */}
          {/* ========================================================================= */}
          {activeTab === 'voice_test' && (
            <div className="space-y-5 max-w-3xl mx-auto">
              {/* Header card */}
              <div className="bg-linear-to-r from-indigo-950 via-stone-900 to-indigo-900 text-white rounded-2xl p-4 sm:p-5 border border-indigo-700/50 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-400/30">
                    <Mic className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg font-arabic text-indigo-200">
                      وضع التسميع الصوتي والاختبار الشفوي الذاتي
                    </h3>
                    <p className="text-xs text-indigo-100/80 font-arabic">
                      انطق تعريف المفردة بصوتك بالعربية أو بالفرنسية، ثم استمع للتعريف النموذجي وقارن استيعابك!
                    </p>
                  </div>
                </div>
              </div>

              {activeVoiceCard ? (
                <div className="bg-white dark:bg-stone-850 rounded-3xl p-6 border-2 border-indigo-200 dark:border-indigo-950 shadow-xl space-y-6">
                  {/* Word Banner */}
                  <div className="text-center space-y-2 border-b border-indigo-100 dark:border-stone-700 pb-4">
                    <div className="flex items-center justify-center gap-2">
                      {renderCategoryBadge(activeVoiceCard.category || inferCategory(activeVoiceCard))}
                      {activeVoiceCard.pageNumber && (
                        <span className="px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 text-xs font-serif">
                          الصفحة {activeVoiceCard.pageNumber}
                        </span>
                      )}
                      <span className="text-xs font-mono text-stone-400">
                        {voiceTestIndex + 1} / {filteredCards.length}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <h2 className="font-serif font-bold text-3xl sm:text-4xl text-stone-900 dark:text-stone-100">
                        {activeVoiceCard.frenchWord}
                      </h2>
                      <button
                        onClick={() => playSpeech(activeVoiceCard.frenchWord, 'fr-FR')}
                        className="p-2 rounded-full bg-indigo-100 dark:bg-stone-700 hover:bg-indigo-200 text-indigo-900 dark:text-indigo-300 transition-all cursor-pointer"
                        title="نطق الكلمة بالفرنسية"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-xs text-stone-500 font-arabic">
                      ما هو معنى هذا المصطلح وسياقه في الرواية؟ قل تعريفك بصوتك أو استمع للحل النموذجي:
                    </p>
                  </div>

                  {/* Speech Recording / Oral Practice Section */}
                  <div className="bg-indigo-50/70 dark:bg-stone-800/70 rounded-2xl p-4 sm:p-5 border border-indigo-200 dark:border-stone-700 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-bold text-xs font-arabic text-indigo-950 dark:text-indigo-300 flex items-center gap-1.5">
                        <Mic className="w-4 h-4 text-indigo-600" />
                        <span>التسميع الصوتي المباشر (Enregistrement vocal):</span>
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSpeechLang('ar-SA')}
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-arabic font-bold ${
                            speechLang === 'ar-SA' ? 'bg-indigo-700 text-white' : 'bg-white dark:bg-stone-700 text-stone-600'
                          }`}
                        >
                          تسميع بالعربية 🇲🇦
                        </button>
                        <button
                          onClick={() => setSpeechLang('fr-FR')}
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-arabic font-bold ${
                            speechLang === 'fr-FR' ? 'bg-indigo-700 text-white' : 'bg-white dark:bg-stone-700 text-stone-600'
                          }`}
                        >
                          تسميع بالفرنسية 🇫🇷
                        </button>
                      </div>
                    </div>

                    {/* Mic button and live transcription */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <button
                        onClick={() => {
                          if (isListeningSpeech) {
                            stopListeningVoice();
                          } else {
                            startListeningVoice();
                          }
                        }}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg shrink-0 ${
                          isListeningSpeech
                            ? 'bg-rose-600 text-white ring-8 ring-rose-300 animate-pulse'
                            : 'bg-indigo-700 hover:bg-indigo-800 text-white hover:scale-105'
                        }`}
                        title={isListeningSpeech ? 'إيقاف التسجيل' : 'بدء التسميع الصوتي'}
                      >
                        {isListeningSpeech ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                      </button>

                      <div className="flex-1 w-full bg-white dark:bg-stone-900 rounded-xl p-3 border border-indigo-200 dark:border-stone-700 min-h-[64px] flex items-center justify-center text-center">
                        {isListeningSpeech ? (
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-arabic flex items-center justify-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                              <span>جارٍ الاستماع إليك... قل تعريفك الآن!</span>
                            </span>
                            <p className="text-sm font-arabic text-stone-800 dark:text-stone-200">{spokenTranscript || '...'}</p>
                          </div>
                        ) : spokenTranscript ? (
                          <div className="space-y-1 text-right w-full">
                            <span className="text-[10px] text-stone-400 font-arabic block">ما قلته بصوتك:</span>
                            <p className="text-sm font-arabic font-bold text-indigo-950 dark:text-indigo-200">« {spokenTranscript} »</p>
                          </div>
                        ) : (
                          <p className="text-xs text-stone-400 font-arabic">
                            اضغط على أيقونة الميكروفون وانطق تعريفك، أو استمع للنموذج بالصوت أدناه.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Audio Model Answer Buttons */}
                    <div className="pt-2 border-t border-indigo-200/60 dark:border-stone-700 flex flex-wrap items-center justify-center gap-2">
                      <button
                        onClick={() => speakModelDefinition(activeVoiceCard, 'fr')}
                        className="px-3 py-2 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-arabic font-bold flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <Volume2 className="w-4 h-4 text-indigo-300" />
                        <span>استماع للتعريف بالفرنسية (Définition FR)</span>
                      </button>

                      <button
                        onClick={() => speakModelDefinition(activeVoiceCard, 'ar')}
                        className="px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-arabic font-bold flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <Volume2 className="w-4 h-4 text-emerald-300" />
                        <span>استماع للشرح بالعربية (Définition AR)</span>
                      </button>

                      <button
                        onClick={() => setIsVoiceRevealed((prev) => !prev)}
                        className="px-3 py-2 rounded-xl bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-800 dark:text-stone-200 text-xs font-arabic font-bold flex items-center gap-1.5 transition-all"
                      >
                        {isVoiceRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        <span>{isVoiceRevealed ? 'إخفاء الحل المكتوب' : 'إظهار الحل المكتوب كاملاً'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Revealed Solution Card */}
                  {isVoiceRevealed && (
                    <div className="bg-emerald-50/80 dark:bg-stone-800 rounded-2xl p-4 sm:p-5 border-2 border-emerald-300 dark:border-emerald-800 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between border-b border-emerald-200 dark:border-stone-700 pb-2">
                        <span className="font-bold text-xs font-arabic text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>التعريف والترجمة النموذجية للامتحان الجهوي:</span>
                        </span>
                        <span className="font-arabic font-bold text-emerald-800 text-sm">
                          {activeVoiceCard.arabicMeaning}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <p className="text-stone-700 dark:text-stone-300 font-arabic leading-relaxed">
                          <strong>الشرح في سياق المؤلف:</strong> {activeVoiceCard.definitionArabic || activeVoiceCard.contextualMeaning}
                        </p>

                        {activeVoiceCard.definitionFrench && (
                          <p className="text-stone-600 dark:text-stone-400 font-serif italic bg-white/70 dark:bg-stone-900 p-2 rounded-lg">
                            <strong>Définition littéraire :</strong> {activeVoiceCard.definitionFrench}
                          </p>
                        )}

                        {activeVoiceCard.exampleContextFrench && (
                          <p className="text-stone-600 dark:text-stone-400 font-serif italic">
                            <strong>Exemple dans l’œuvre :</strong> « {activeVoiceCard.exampleContextFrench} »
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Rating / Next Word Actions */}
                  <div className="pt-3 border-t border-stone-100 dark:border-stone-700 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-500 font-arabic">تقييمك لمستواك في هذه المفردة:</span>
                      <button
                        onClick={() => handleRateVoiceMastery('mastered')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-arabic font-bold transition-all"
                      >
                        ✅ حفظتها تماماً
                      </button>
                      <button
                        onClick={() => handleRateVoiceMastery('learning')}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-arabic font-bold transition-all"
                      >
                        🟡 في طور الحفظ
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsVoiceRevealed(false);
                          setSpokenTranscript('');
                          setVoiceTestIndex((prev) => (prev > 0 ? prev - 1 : filteredCards.length - 1));
                        }}
                        className="p-2 rounded-xl bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 text-stone-700 dark:text-stone-200"
                        title="المفردة السابقة"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setIsVoiceRevealed(false);
                          setSpokenTranscript('');
                          setVoiceTestIndex((prev) => (prev < filteredCards.length - 1 ? prev + 1 : 0));
                        }}
                        className="px-4 py-2 rounded-xl bg-indigo-800 hover:bg-indigo-900 text-white text-xs font-arabic font-bold flex items-center gap-1.5"
                      >
                        <span>المفردة التالية</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-stone-850 rounded-2xl p-6">
                  <p className="font-bold text-stone-700 dark:text-stone-300 font-arabic">لا توجد مفردات متاحة للاختبار في هذا النطاق.</p>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: 3D FLASHCARDS MODE (وضع البطاقات التفاعلية)                         */}
          {/* ========================================================================= */}
          {activeTab === 'cards' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {activeCard ? (
                <>
                  {/* Card Index & Shuffle Bar */}
                  <div className="flex items-center justify-between text-xs text-stone-500 font-arabic">
                    <span className="font-mono">
                      البطاقة {currentCardIndex + 1} من {filteredCards.length}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleShuffleCards}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-amber-50 flex items-center gap-1 transition-all"
                      >
                        <Shuffle className="w-3.5 h-3.5" />
                        <span>ترتيب عشوائي</span>
                      </button>
                    </div>
                  </div>

                  {/* 3D Flip Card */}
                  <div
                    onClick={() => setIsFlipped((prev) => !prev)}
                    className="min-h-[340px] w-full cursor-pointer perspective-1000 group select-none"
                  >
                    <div
                      className={`relative w-full h-full min-h-[340px] rounded-3xl p-6 transition-all duration-500 transform-style-3d shadow-xl border-2 ${
                        isFlipped
                          ? 'bg-emerald-950 text-white border-emerald-700'
                          : 'bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 border-amber-300/80 dark:border-stone-700'
                      }`}
                    >
                      {/* Front of card (French) */}
                      {!isFlipped ? (
                        <div className="flex flex-col justify-between h-full space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-wrap">
                              {renderCategoryBadge(activeCard.category || inferCategory(activeCard))}
                              {(activeCard.isHighlight || (activeCard.id && (activeCard.id.startsWith('hl-card-') || activeCard.id.startsWith('custom-')))) && (
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/25 text-amber-900 dark:text-amber-300 border border-amber-400/60 text-xs font-bold font-arabic flex items-center gap-1 shadow-2xs">
                                  <Sparkles className="w-3 h-3 text-amber-500" />
                                  <span>مظللة في الرواية 🖍️</span>
                                </span>
                              )}
                              {activeCard.pageNumber && (
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-stone-700 text-amber-950 dark:text-stone-300 text-xs font-serif font-bold">
                                  صفحة {activeCard.pageNumber}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playSpeech(activeCard.frenchWord, 'fr-FR');
                              }}
                              className="w-9 h-9 rounded-full bg-amber-100 dark:bg-stone-700 hover:bg-amber-200 text-amber-900 dark:text-amber-300 flex items-center justify-center transition-all"
                              title="استماع للنطق"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-center py-4 space-y-2">
                            <h3 className="font-serif font-bold text-3xl sm:text-4xl text-stone-900 dark:text-stone-50">
                              {activeCard.frenchWord}
                            </h3>
                            {activeCard.partOfSpeech && (
                              <p className="font-serif italic text-xs text-stone-500 dark:text-stone-400">
                                {activeCard.partOfSpeech}
                              </p>
                            )}

                            {/* Direct AI Translation Trigger Button */}
                            <div className="pt-2 flex justify-center">
                              <button
                                onClick={(e) => handleTranslateCard(activeCard, e)}
                                disabled={translatingCardId === activeCard.id}
                                className="px-3.5 py-1.5 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white text-xs font-arabic font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer hover:scale-103"
                                title="ترجمة المفردة وشرح سياقها بالذكاء الاصطناعي"
                              >
                                <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${translatingCardId === activeCard.id ? 'animate-spin' : ''}`} />
                                <span>{translatingCardId === activeCard.id ? 'جاري التحليل والترجمة بالـ AI...' : 'ترجمة بالـ AI حسب السياق 🪄'}</span>
                              </button>
                            </div>
                          </div>

                          <div className="text-center">
                            <span className="inline-flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-400 font-arabic font-bold bg-amber-100/60 dark:bg-stone-800 px-4 py-1.5 rounded-full">
                              <RotateCw className="w-3.5 h-3.5" />
                              <span>انقر لقلب البطاقة ورؤية الترجمة والشرح</span>
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Back of card (Arabic & Context) */
                        <div className="flex flex-col justify-between h-full space-y-3.5 text-right">
                          <div className="flex items-center justify-between border-b border-emerald-800 pb-2.5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playSpeech(activeCard.arabicMeaning, 'ar-SA');
                                }}
                                className="w-9 h-9 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 flex items-center justify-center transition-all shadow-xs cursor-pointer"
                                title="استماع للنطق بالعربية الفصحى"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={(e) => handleTranslateCard(activeCard, e)}
                                disabled={translatingCardId === activeCard.id}
                                className="px-2.5 py-1.5 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/80 text-xs font-arabic font-bold flex items-center gap-1 transition-all cursor-pointer"
                                title="إعادة تدقيق وتعميق الترجمة بالذكاء الاصطناعي"
                              >
                                <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${translatingCardId === activeCard.id ? 'animate-spin' : ''}`} />
                                <span>{translatingCardId === activeCard.id ? 'جاري التدقيق...' : 'تدقيق بالـ AI 🪄'}</span>
                              </button>
                            </div>

                            <div className="space-y-0.5">
                              <span className="text-[10px] text-emerald-400 font-arabic font-bold block">
                                المعنى والترجمة السياقية الفصيحة:
                              </span>
                              <h3 className="font-arabic font-black text-2xl sm:text-3xl text-emerald-300 leading-tight">
                                {activeCard.arabicMeaning}
                              </h3>
                            </div>
                          </div>

                          <div className="space-y-2.5 text-xs leading-relaxed text-emerald-100 flex-1 overflow-y-auto pr-1">
                            {/* Synonyms if available */}
                            {activeCard.synonyms && activeCard.synonyms.length > 0 && (
                              <div className="bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-800/80 space-y-1">
                                <span className="text-[11px] font-bold text-emerald-300 block font-arabic">
                                  المرادفات بالفرنسية (Les Synonymes):
                                </span>
                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                  {activeCard.synonyms.map((syn, sIdx) => (
                                    <span
                                      key={sIdx}
                                      className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-200 text-[11px] font-serif border border-emerald-700/60"
                                    >
                                      {syn}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Context and Meaning */}
                            {(activeCard.definitionArabic || activeCard.contextualMeaning) && (
                              <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-800 space-y-1">
                                <strong className="text-emerald-300 block text-[11px] font-arabic">
                                  الدلالة والشرح في سياق الرواية:
                                </strong>
                                <p className="text-emerald-100 font-arabic text-xs leading-relaxed">
                                  {activeCard.definitionArabic || activeCard.contextualMeaning}
                                </p>
                              </div>
                            )}

                            {activeCard.exampleContextFrench && (
                              <div className="p-2.5 bg-emerald-950/70 rounded-xl border border-emerald-800/60 text-left dir-ltr">
                                <p className="font-serif italic text-emerald-200 text-xs">
                                  « {activeCard.exampleContextFrench} »
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="text-center pt-1 border-t border-emerald-900/80">
                            <span className="text-[11px] text-emerald-300/80 font-arabic flex items-center justify-center gap-1">
                              <RotateCw className="w-3 h-3" />
                              <span>انقر للعودة للوجه الأول (الفرنسية)</span>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Navigation & Rating Controls */}
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={handlePrevCard}
                      className="px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 text-stone-800 dark:text-stone-200 text-xs font-arabic font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                      <span>السابقة</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRateMastery('mastered')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-arabic font-bold transition-all shadow-xs"
                      >
                        ✅ أتقنتها
                      </button>
                      <button
                        onClick={() => handleRateMastery('learning')}
                        className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-arabic font-bold transition-all shadow-xs"
                      >
                        🟡 في طور الحفظ
                      </button>
                    </div>

                    <button
                      onClick={handleNextCard}
                      className="px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-arabic font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <span>التالية</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-stone-850 rounded-2xl p-6">
                  <p className="font-bold text-stone-700 dark:text-stone-300 font-arabic">لا توجد بطاقات في هذا النطاق.</p>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: QUIZ QCM 1ÈRE BAC (كويز الامتحان الجهوي - نظام التقييم المعياري)    */}
          {/* ========================================================================= */}
          {activeTab === 'quiz' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {!isQuizActive ? (
                <div className="bg-white dark:bg-stone-850 rounded-3xl p-6 sm:p-8 border-2 border-rose-200 dark:border-stone-700 text-center space-y-6 shadow-xl animate-in fade-in duration-200">
                  <div className="w-16 h-16 rounded-3xl bg-linear-to-br from-rose-500 to-rose-700 text-white flex items-center justify-center mx-auto shadow-md">
                    <Trophy className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 text-xs font-bold font-arabic">
                        نظام التقييم المعياري للامتحان الجهوي (1ère Bac)
                      </span>
                    </div>
                    <h3 className="font-black text-xl sm:text-2xl font-arabic text-stone-900 dark:text-stone-100">
                      اختبار المعجم والمفردات الأدبية
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-arabic max-w-lg mx-auto leading-relaxed">
                      اختبار دقيق يقيس قدرتك على تحديد المرادفات الفرنسية الدقيقة والمعاني السياقية وشواهد الروايات بدون أي تكرار عشوائي، وفق معايير الامتحان الجهوي الرسمي.
                    </p>
                  </div>

                  {/* Quiz Configuration Panel */}
                  <div className="bg-stone-50 dark:bg-stone-900/80 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-750 text-right space-y-4">
                      {/* Mode Selector */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-800 dark:text-stone-200 font-arabic flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-rose-600" />
                            <span>نمط ونوعية الأسئلة (Type de questions):</span>
                          </span>
                          <span className="text-[11px] text-rose-700 dark:text-rose-400 font-normal">
                            8 أنماط تقييمية مطابقة للامتحان الجهوي
                          </span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-arabic">
                          <button
                            onClick={() => setQuizType('ALL')}
                            className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between gap-2 cursor-pointer ${
                              quizType === 'ALL'
                                ? 'bg-rose-700 text-white border-rose-800 font-bold shadow-xs scale-[1.01]'
                                : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-rose-50/50'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span>🌟</span>
                              <span>شامل ومتنوع (Mixte Bac)</span>
                            </span>
                            {quizType === 'ALL' && <Check className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => setQuizType('SYNONYMS')}
                            className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between gap-2 cursor-pointer ${
                              quizType === 'SYNONYMS'
                                ? 'bg-rose-700 text-white border-rose-800 font-bold shadow-xs scale-[1.01]'
                                : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-rose-50/50'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span>📖</span>
                              <span>المرادفات بالفرنسية (Synonymes)</span>
                            </span>
                            {quizType === 'SYNONYMS' && <Check className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => setQuizType('ANTONYMS')}
                            className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between gap-2 cursor-pointer ${
                              quizType === 'ANTONYMS'
                                ? 'bg-rose-700 text-white border-rose-800 font-bold shadow-xs scale-[1.01]'
                                : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-rose-50/50'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span>⚡</span>
                              <span>الأضداد والعكوس (Antonymes)</span>
                            </span>
                            {quizType === 'ANTONYMS' && <Check className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => setQuizType('CHAMPS_LEXICAUX')}
                            className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between gap-2 cursor-pointer ${
                              quizType === 'CHAMPS_LEXICAUX'
                                ? 'bg-rose-700 text-white border-rose-800 font-bold shadow-xs scale-[1.01]'
                                : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-rose-50/50'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span>🎯</span>
                              <span>الحقول الدلالية (Champs Lexicaux)</span>
                            </span>
                            {quizType === 'CHAMPS_LEXICAUX' && <Check className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => setQuizType('REGISTRES')}
                            className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between gap-2 cursor-pointer ${
                              quizType === 'REGISTRES'
                                ? 'bg-rose-700 text-white border-rose-800 font-bold shadow-xs scale-[1.01]'
                                : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-rose-50/50'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span>🎭</span>
                              <span>السجلات والنبرة (Registres)</span>
                            </span>
                            {quizType === 'REGISTRES' && <Check className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => setQuizType('CONTEXT_COMPLETION')}
                            className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between gap-2 cursor-pointer ${
                              quizType === 'CONTEXT_COMPLETION'
                                ? 'bg-rose-700 text-white border-rose-800 font-bold shadow-xs scale-[1.01]'
                                : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-rose-50/50'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span>📝</span>
                              <span>شواهد واستكمال النص (En contexte)</span>
                            </span>
                            {quizType === 'CONTEXT_COMPLETION' && <Check className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => setQuizType('ARABIC_MEANINGS')}
                            className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between gap-2 cursor-pointer ${
                              quizType === 'ARABIC_MEANINGS'
                                ? 'bg-rose-700 text-white border-rose-800 font-bold shadow-xs scale-[1.01]'
                                : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-rose-50/50'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span>🇲🇦</span>
                              <span>المعنى والترجمة (Traduction)</span>
                            </span>
                            {quizType === 'ARABIC_MEANINGS' && <Check className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => setQuizType('DEFINITIONS')}
                            className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between gap-2 cursor-pointer ${
                              quizType === 'DEFINITIONS'
                                ? 'bg-rose-700 text-white border-rose-800 font-bold shadow-xs scale-[1.01]'
                                : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-rose-50/50'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span>💡</span>
                              <span>المفاهيم والتعريفات (Définitions)</span>
                            </span>
                            {quizType === 'DEFINITIONS' && <Check className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                    {/* Question Count Selector */}
                    <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-750">
                      <label className="text-xs font-bold text-stone-800 dark:text-stone-200 font-arabic flex items-center justify-between">
                        <span>عدد الأسئلة:</span>
                        <span className="font-mono text-rose-700 dark:text-rose-400 font-bold">{quizQuestionCount} أسئلة</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {[5, 10, 15, 20].map((count) => (
                          <button
                            key={count}
                            onClick={() => setQuizQuestionCount(count)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                              quizQuestionCount === count
                                ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-xs scale-102'
                                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                            }`}
                          >
                            {count}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleStartQuiz}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-linear-to-r from-rose-600 to-rose-800 hover:from-rose-700 hover:to-rose-900 text-white font-arabic font-black text-sm shadow-xl transition-all hover:scale-103 cursor-pointer flex items-center justify-center gap-2 mx-auto"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>بدء الاختبار المعياري الآن ({filteredCards.length} مفردة في النطاق)</span>
                    </button>
                  </div>
                </div>
              ) : !isQuizCompleted ? (
                /* Active Quiz Question */
                <div className="bg-white dark:bg-stone-850 rounded-3xl p-5 sm:p-7 border-2 border-amber-300/80 dark:border-stone-700 shadow-xl space-y-5 animate-in fade-in duration-200">
                  {/* Top Bar: Progress, Points, Category */}
                  <div className="flex items-center justify-between text-xs font-arabic border-b border-stone-200 dark:border-stone-700 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-stone-900 dark:bg-stone-700 text-white font-mono font-bold">
                        {currentQuestionIndex + 1} / {quizQuestions.length}
                      </span>
                      {quizQuestions[currentQuestionIndex].categoryLabel && (
                        <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900">
                          {quizQuestions[currentQuestionIndex].categoryLabel}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => playSpeech(quizQuestions[currentQuestionIndex].frenchWord, 'fr-FR')}
                        className="p-1.5 rounded-lg bg-indigo-50 dark:bg-stone-800 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-stone-700 transition-colors cursor-pointer"
                        title="استماع لنطق المفردة"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-stone-700 dark:text-stone-300 font-mono">
                        النقاط: <strong className="text-rose-600 dark:text-rose-400">{userScore}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Target Word & Prompt Box */}
                  <div className="space-y-3 text-right">
                    <div className="p-4 bg-amber-50/80 dark:bg-stone-800/80 rounded-2xl border border-amber-200 dark:border-stone-700 space-y-1">
                      <span className="text-[11px] font-bold text-stone-500 font-arabic block">
                        المفردة المستهدفة (Mot cible):
                      </span>
                      <h3 className="font-serif font-black text-xl sm:text-2xl text-stone-900 dark:text-stone-100 text-left dir-ltr">
                        « {quizQuestions[currentQuestionIndex].frenchWord} »
                      </h3>
                    </div>

                    <h4 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 font-arabic leading-relaxed">
                      {quizQuestions[currentQuestionIndex].prompt}
                    </h4>
                  </div>

                  {/* Helper Hint: Contextual Translation & Synonyms */}
                  <div className="bg-amber-100/70 dark:bg-stone-800 p-3 rounded-2xl border border-amber-300 dark:border-stone-700 space-y-2">
                    <button
                      onClick={() => setShowVocabQuizHint((prev) => !prev)}
                      className="w-full py-2 px-3 rounded-xl bg-amber-900 hover:bg-amber-950 text-amber-100 font-arabic font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>{showVocabQuizHint ? 'إخفاء التلميح والترجمة' : '💡 هل نسيت؟ عرض الترجمة حسب السياق والمرادفات'}</span>
                    </button>

                    {showVocabQuizHint && quizQuestions[currentQuestionIndex]?.relatedCard && (
                      <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-amber-300 dark:border-stone-700 space-y-2 text-xs font-arabic animate-in fade-in duration-150">
                        <div className="space-y-1">
                          <strong className="text-amber-900 dark:text-amber-300 block">الترجمة حسب السياق (Traduction contextuelle):</strong>
                          <p className="text-stone-800 dark:text-stone-200 font-bold bg-amber-50 dark:bg-stone-850 p-2 rounded-lg">
                            {quizQuestions[currentQuestionIndex].relatedCard?.contextualMeaning || quizQuestions[currentQuestionIndex].relatedCard?.arabicMeaning}
                          </p>
                        </div>

                        {quizQuestions[currentQuestionIndex].relatedCard?.synonyms && quizQuestions[currentQuestionIndex].relatedCard.synonyms.length > 0 && (
                          <div className="space-y-1">
                            <strong className="text-amber-900 dark:text-amber-300 block">المرادفات الفرنسية (Les Synonymes):</strong>
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              {quizQuestions[currentQuestionIndex].relatedCard.synonyms.map((syn, sIdx) => (
                                <span key={sIdx} className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-900 text-[11px] font-serif">
                                  {syn}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 4 Distinct, Pedagogically Sound Options */}
                  <div className="space-y-2.5">
                    {quizQuestions[currentQuestionIndex].options.map((opt, oIdx) => {
                      const isSelected = selectedOptionIndex === oIdx;
                      const isCorrect = oIdx === quizQuestions[currentQuestionIndex].correctAnswerIndex;
                      const optionLetter = ['A', 'B', 'C', 'D'][oIdx] || String(oIdx + 1);

                      let btnStyle = 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-amber-400 text-stone-800 dark:text-stone-200';
                      if (isAnswerSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold ring-2 ring-emerald-400';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-100 dark:bg-rose-950/80 border-rose-500 text-rose-950 dark:text-rose-100 ring-2 ring-rose-400';
                        } else {
                          btnStyle = 'opacity-60 bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 font-bold ring-2 ring-indigo-400 text-indigo-950 dark:text-indigo-200';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isAnswerSubmitted}
                          onClick={() => handleSelectQuizOption(oIdx)}
                          className={`w-full p-3.5 rounded-2xl border text-right text-xs sm:text-sm font-arabic transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <span className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                              {optionLetter}
                            </span>
                            <span className="leading-snug text-right">{opt}</span>
                          </div>

                          {isAnswerSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                          {isAnswerSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Detailed Post-Answer Pedagogical Feedback Box */}
                  {isAnswerSubmitted && (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2 animate-in fade-in duration-150 text-right">
                      <div className="font-bold text-xs text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>التعليل والشرح البيداغوجي للامتحان الجهوي:</span>
                      </div>
                      <p className="text-xs text-stone-800 dark:text-stone-200 font-arabic leading-relaxed">
                        {quizQuestions[currentQuestionIndex].explanation}
                      </p>
                      {quizQuestions[currentQuestionIndex].exampleExcerpt && (
                        <div className="p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-emerald-200 dark:border-emerald-900/60 text-[11px] font-serif italic text-left text-stone-700 dark:text-stone-300 dir-ltr">
                          « {quizQuestions[currentQuestionIndex].exampleExcerpt} »
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submit / Next Actions */}
                  <div className="pt-3 border-t border-stone-200 dark:border-stone-750 flex items-center justify-between">
                    <button
                      onClick={() => {
                        if (confirm('هل ترغب في مغادرة هذا الاختبار والعودة لقائمة الإعدادات؟')) {
                          setIsQuizActive(false);
                        }
                      }}
                      className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 font-arabic"
                    >
                      إلغاء الاختبار
                    </button>

                    {!isAnswerSubmitted ? (
                      <button
                        disabled={selectedOptionIndex === null}
                        onClick={handleSubmitQuizAnswer}
                        className={`px-6 py-2.5 rounded-xl font-arabic font-bold text-xs transition-all ${
                          selectedOptionIndex !== null
                            ? 'bg-rose-700 hover:bg-rose-800 text-white shadow-md cursor-pointer hover:scale-102'
                            : 'bg-stone-300 dark:bg-stone-700 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        تأكيد الإجابة
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuizQuestion}
                        className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-arabic font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-102"
                      >
                        <span>{currentQuestionIndex < quizQuestions.length - 1 ? 'السؤال التالي' : 'عرض النتيجة والتقرير'}</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Enhanced Quiz Results & Review Screen */
                <div className="bg-white dark:bg-stone-850 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 dark:border-stone-700 text-center space-y-6 shadow-xl animate-in fade-in duration-200">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-lg ${
                    userScore / quizQuestions.length >= 0.8
                      ? 'bg-emerald-600 text-white'
                      : userScore / quizQuestions.length >= 0.5
                      ? 'bg-amber-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}>
                    {userScore / quizQuestions.length >= 0.8 ? (
                      <Trophy className="w-10 h-10" />
                    ) : (
                      <Award className="w-10 h-10" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-black text-2xl font-arabic text-stone-900 dark:text-stone-100">
                      {userScore / quizQuestions.length >= 0.8
                        ? '🎉 نتيجة ممتازة وجاهزية عالية!'
                        : userScore / quizQuestions.length >= 0.5
                        ? '👍 أداء جيد، واصل التدريب!'
                        : '🔄 تحتاج لمراجعة إضافية لضبط المفردات'}
                    </h3>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-3xl font-black font-mono text-stone-900 dark:text-stone-100">
                        {userScore} / {quizQuestions.length}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-mono font-bold text-sm">
                        {Math.round((userScore / quizQuestions.length) * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Review breakdown of questions answered */}
                  <div className="text-right space-y-3 pt-2">
                    <h4 className="font-bold text-xs text-stone-600 dark:text-stone-400 font-arabic">
                      مراجعة الأسئلة والإجابات:
                    </h4>
                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {quizHistory.map((item, hIdx) => (
                        <div
                          key={hIdx}
                          className={`p-3 rounded-xl border text-xs font-arabic space-y-1 text-right ${
                            item.isCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span className="font-serif">« {item.question.frenchWord} »</span>
                            <span className={item.isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}>
                              {item.isCorrect ? '✓ إجابة صحيحة' : '✗ إجابة خاطئة'}
                            </span>
                          </div>
                          <p className="text-stone-600 dark:text-stone-300">
                            الإجابة الصحيحة: <strong className="text-stone-900 dark:text-stone-100">{item.question.options[item.question.correctAnswerIndex]}</strong>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                    <button
                      onClick={handleStartQuiz}
                      className="px-6 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-arabic font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>إعادة اختبار بأسئلة جديدة</span>
                    </button>

                    <button
                      onClick={() => setIsQuizActive(false)}
                      className="px-5 py-2.5 rounded-xl bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-800 dark:text-stone-200 font-arabic font-bold text-xs transition-colors cursor-pointer"
                    >
                      تغيير إعدادات الاختبار
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: ALL WORDS LIST (المستودع الكامل والمفردات المظللة)                   */}
          {/* ========================================================================= */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 font-arabic flex-wrap gap-2">
                <span>
                  المفردات والتظليلات المعروضة:{' '}
                  <strong className="text-amber-900 dark:text-amber-300 font-mono text-sm">{filteredCards.length}</strong>
                </span>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="px-3 py-1 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all hover:scale-102"
                    title="تصدير هذه القائمة كملف Excel أو PDF أو بطاقات Anki"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-300" />
                    <span>تصدير هذه القائمة ({filteredCards.length})</span>
                  </button>
                  <span className="text-[11px] text-amber-900/80 dark:text-amber-400/80 hidden sm:inline">
                    💡 انقر على أي كلمة أو تظليل لعرض الشرح الكامل والسياق في الرواية
                  </span>
                </div>
              </div>

              {filteredCards.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-stone-850 rounded-2xl p-6 space-y-3 border border-stone-200 dark:border-stone-700">
                  <p className="font-bold text-stone-700 dark:text-stone-300 font-arabic">
                    لا توجد مفردات أو تظليلات مطابقة للفلتر المحدد.
                  </p>
                  {showOnlyHighlights && (
                    <p className="text-xs text-stone-500 font-arabic">
                      لم تقم بتظليل أي مقطع بعد في هذا النطاق. يمكنك تظليل أي كلمة أو عبارة في صفحات الرواية وستظهر هنا فوراً!
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredCards.map((card, cIdx) => {
                    const isHl = card.id && (card.id.startsWith('hl-card-') || card.id.startsWith('custom-'));
                    const cat = card.category || inferCategory(card);

                    return (
                      <div
                        key={card.id}
                        onClick={() => setInspectedCard(card)}
                        className={`bg-white dark:bg-stone-850 rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer hover:shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
                          isHl
                            ? 'border-amber-400/90 dark:border-amber-500/80 ring-2 ring-amber-400/25 bg-amber-50/30 dark:bg-stone-800/90'
                            : 'border-stone-200 dark:border-stone-700 hover:border-amber-400'
                        }`}
                      >
                        <div className="space-y-2 text-right flex-1">
                          {/* Header tags */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {renderCategoryBadge(cat)}
                            {isHl && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-400/50 text-[11px] font-bold font-arabic flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                <span>تظليلك الخاص (Highlight)</span>
                              </span>
                            )}
                            {card.pageNumber && (
                              <span className="px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 text-[11px] font-serif font-bold">
                                صفحة {card.pageNumber}
                              </span>
                            )}
                          </div>

                          {/* Term & Arabic Meaning */}
                          <div className="flex items-baseline justify-between gap-3 flex-wrap">
                            <h4 className="font-serif font-black text-lg sm:text-xl text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                              « {card.frenchWord} »
                            </h4>
                            <span className="font-arabic font-black text-base sm:text-lg text-emerald-800 dark:text-emerald-400">
                              {card.arabicMeaning}
                            </span>
                          </div>

                          {/* Contextual Meaning Box */}
                          <div className="bg-amber-50/80 dark:bg-stone-800 p-3 rounded-xl border border-amber-200/60 dark:border-stone-700 text-xs font-arabic leading-relaxed text-stone-800 dark:text-stone-200">
                            <strong className="text-amber-950 dark:text-amber-300 block text-[11px] mb-1 font-bold">
                              📖 المعنى والشرح حسب سياق الرواية:
                            </strong>
                            <p className="font-normal text-stone-700 dark:text-stone-300">
                              {card.contextualMeaning || card.definitionArabic || card.arabicMeaning}
                            </p>
                          </div>

                          {/* Synonyms */}
                          {card.synonyms && card.synonyms.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] font-serif">
                              <span className="text-[10px] text-stone-400 font-arabic">مرادفات:</span>
                              {card.synonyms.slice(0, 4).map((s, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] border border-stone-200 dark:border-stone-700"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-stone-800">
                          {/* AI Contextual Translation Button */}
                          <button
                            onClick={(e) => handleTranslateCard(card, e)}
                            disabled={translatingCardId === card.id}
                            className="px-3 py-1.5 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white text-xs font-arabic font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer hover:scale-102"
                            title="ترجمة المفردة وتحليل سياقها بالذكاء الاصطناعي"
                          >
                            <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${translatingCardId === card.id ? 'animate-spin' : ''}`} />
                            <span>{translatingCardId === card.id ? 'جاري الترجمة...' : 'ترجمة AI 🪄'}</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setInspectedCard(card);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-arabic font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer hover:scale-102"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                            <span>معاينة السياق</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentCardIndex(cIdx);
                              setActiveTab('cards');
                              setIsFlipped(true);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-arabic font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer hover:scale-102"
                          >
                            <RotateCw className="w-3.5 h-3.5 text-emerald-300" />
                            <span>بطاقة 3D</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playSpeech(card.frenchWord, 'fr-FR', () => {
                                setTimeout(() => playSpeech(card.arabicMeaning, 'ar-SA'), 400);
                              });
                            }}
                            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 text-stone-800 dark:text-stone-200 cursor-pointer"
                            title="استماع للنطق"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CARD CONTEXT INSPECTION MODAL (معاينة السياق والشرح الشامل للمفردة)        */}
        {/* ========================================================================= */}
        {inspectedCard && (
          <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#faf7ef] dark:bg-stone-900 w-full max-w-2xl rounded-3xl p-6 sm:p-7 border-2 border-amber-800/80 dark:border-stone-700 shadow-2xl space-y-5 text-right font-arabic max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-amber-200 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {renderCategoryBadge(inspectedCard.category || inferCategory(inspectedCard))}
                  {inspectedCard.id && (inspectedCard.id.startsWith('hl-card-') || inspectedCard.id.startsWith('custom-')) && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-400/50 text-[11px] font-bold font-arabic flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>تظليلك الخاص من النص</span>
                    </span>
                  )}
                  {inspectedCard.pageNumber && (
                    <span className="px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-serif font-bold">
                      الصفحة {inspectedCard.pageNumber}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setInspectedCard(null)}
                  className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-stone-700 dark:text-stone-200 flex items-center justify-center transition-all cursor-pointer"
                  title="إغلاق"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Word & Direct Meaning Banner */}
              <div className="bg-amber-100/70 dark:bg-stone-800 rounded-2xl p-4 sm:p-5 border border-amber-300/80 dark:border-stone-700 space-y-2">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playSpeech(inspectedCard.frenchWord, 'fr-FR')}
                      className="p-2 rounded-full bg-amber-200 dark:bg-stone-700 hover:bg-amber-300 text-amber-950 dark:text-amber-200 transition-all cursor-pointer"
                      title="استماع للنطق بالفرنسية"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <h3 className="font-serif font-black text-2xl sm:text-3xl text-stone-900 dark:text-stone-50">
                      « {inspectedCard.frenchWord} »
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-arabic font-black text-xl sm:text-2xl text-emerald-800 dark:text-emerald-400">
                      {inspectedCard.arabicMeaning}
                    </span>
                    <button
                      onClick={() => playSpeech(inspectedCard.arabicMeaning, 'ar-SA')}
                      className="p-2 rounded-full bg-emerald-100 dark:bg-stone-700 hover:bg-emerald-200 text-emerald-900 dark:text-emerald-300 transition-all cursor-pointer"
                      title="استماع للنطق بالعربية"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {inspectedCard.partOfSpeech && (
                  <p className="text-xs text-stone-500 font-serif italic text-left dir-ltr">
                    {inspectedCard.partOfSpeech}
                  </p>
                )}
              </div>

              {/* Detailed Contextual Meaning Section */}
              <div className="bg-white dark:bg-stone-850 rounded-2xl p-4 sm:p-5 border-2 border-emerald-300 dark:border-emerald-800 space-y-2 shadow-xs">
                <div className="flex items-center justify-between border-b border-emerald-100 dark:border-stone-700 pb-2">
                  <strong className="text-emerald-900 dark:text-emerald-300 font-bold text-sm flex items-center gap-1.5 font-arabic">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>المعنى والدلالة في سياق أحداث الرواية:</span>
                  </strong>
                  <button
                    onClick={() => {
                      const textToSpeak = inspectedCard.contextualMeaning || inspectedCard.definitionArabic || inspectedCard.arabicMeaning;
                      playSpeech(`الشرح السياقي: ${textToSpeak}`, 'ar-SA');
                    }}
                    className="text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>استماع للشرح</span>
                  </button>
                </div>
                <p className="text-stone-800 dark:text-stone-200 font-arabic text-sm leading-relaxed pt-1">
                  {inspectedCard.contextualMeaning || inspectedCard.definitionArabic || inspectedCard.arabicMeaning}
                </p>
              </div>

              {/* Literary Synonyms */}
              {inspectedCard.synonyms && inspectedCard.synonyms.length > 0 && (
                <div className="bg-indigo-50/70 dark:bg-stone-800 rounded-2xl p-4 border border-indigo-200 dark:border-stone-700 space-y-2">
                  <strong className="text-indigo-950 dark:text-indigo-300 font-bold text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>المرادفات الأدبية بالفرنسية (Les Synonymes) :</span>
                  </strong>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {inspectedCard.synonyms.map((syn, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-3 py-1 rounded-xl bg-white dark:bg-stone-900 text-indigo-900 dark:text-indigo-200 font-serif font-bold text-xs border border-indigo-200 dark:border-stone-700 shadow-2xs"
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Excerpt context */}
              {inspectedCard.exampleContextFrench && (
                <div className="bg-stone-100 dark:bg-stone-800/80 rounded-2xl p-4 border border-stone-200 dark:border-stone-700 space-y-1.5 text-left dir-ltr">
                  <span className="text-[10px] font-bold text-stone-500 font-arabic uppercase tracking-wider block text-right dir-rtl">
                    سياق النص في الصفحة {inspectedCard.pageNumber || 1}:
                  </span>
                  <p className="font-serif italic text-stone-800 dark:text-stone-200 text-xs sm:text-sm">
                    « {inspectedCard.exampleContextFrench} »
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-amber-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInspectedCard(null)}
                    className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-stone-800 dark:text-stone-200 font-bold text-xs cursor-pointer"
                  >
                    إغلاق
                  </button>

                  <button
                    onClick={(e) => handleTranslateCard(inspectedCard, e)}
                    disabled={translatingCardId === inspectedCard.id}
                    className="px-4 py-2 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-102"
                  >
                    <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${translatingCardId === inspectedCard.id ? 'animate-spin' : ''}`} />
                    <span>{translatingCardId === inspectedCard.id ? 'جاري الترجمة بالـ AI...' : 'ترجمة وتدقيق بالذكاء الاصطناعي 🪄'}</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    const idx = filteredCards.findIndex((c) => c.id === inspectedCard.id);
                    if (idx !== -1) setCurrentCardIndex(idx);
                    setActiveTab('cards');
                    setIsFlipped(true);
                    setInspectedCard(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-102"
                >
                  <RotateCw className="w-4 h-4 text-emerald-300" />
                  <span>فتح في وضع البطاقات التفاعلية (3D Flashcard)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Card Add Modal Popup */}
        {isAddingCard && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#faf7ef] dark:bg-stone-900 w-full max-w-lg rounded-3xl p-6 border-2 border-amber-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-base font-arabic text-amber-950 dark:text-amber-200">
                  إضافة مفردة جديدة إلى مراجعتك
                </h3>
                <button onClick={() => setIsAddingCard(false)}>
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              <form onSubmit={handleAddCustomCardSubmit} className="space-y-3 text-right">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 font-arabic block mb-1">الكلمة بالفرنسية:</label>
                  <input
                    type="text"
                    required
                    value={newFrenchWord}
                    onChange={(e) => setNewFrenchWord(e.target.value)}
                    placeholder="Ex: Songer, Échafaud, Sépulture..."
                    className="w-full bg-white dark:bg-stone-800 border rounded-xl p-2.5 text-xs text-left font-serif font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 font-arabic block mb-1">المعنى بالعربية:</label>
                  <input
                    type="text"
                    required
                    value={newArabicMeaning}
                    onChange={(e) => setNewArabicMeaning(e.target.value)}
                    placeholder="المعنى الدقيق بالعربية..."
                    className="w-full bg-white dark:bg-stone-800 border rounded-xl p-2.5 text-xs text-right font-arabic"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 font-arabic block mb-1">نوع الكلمة / التصنيف:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-white dark:bg-stone-800 border rounded-xl p-2.5 text-xs font-arabic"
                  >
                    <option value="verb">⚡ فعل (Verbe)</option>
                    <option value="adverb">🧭 ظرف أو رابط (Adverbe)</option>
                    <option value="term">📖 مصطلح ومفردة (Terme)</option>
                    <option value="character">👤 شخصية وموقف (Personnage)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 font-arabic block mb-1">الشرح والسياق في الرواية:</label>
                  <textarea
                    value={newDefArabic}
                    onChange={(e) => setNewDefArabic(e.target.value)}
                    placeholder="شرح مبسط للسياق..."
                    rows={2}
                    className="w-full bg-white dark:bg-stone-800 border rounded-xl p-2.5 text-xs text-right font-arabic"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCard(false)}
                    className="px-4 py-2 rounded-xl bg-stone-200 text-stone-800 text-xs font-arabic font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-800 text-white text-xs font-arabic font-bold"
                  >
                    حفظ المفردة
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Vocabulary Export Modal */}
        <VocabularyExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          filteredCards={filteredCards}
          allCards={cards}
          activeBookId={selectedBookFilter === 'all' ? activeBookId : selectedBookFilter}
        />
      </div>
    </div>
  );
};
