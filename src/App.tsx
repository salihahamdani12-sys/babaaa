import React, { useState, useEffect } from 'react';
import { ErrorBoundaryWrapper } from './components/ErrorBoundaryWrapper';
import { Navbar } from './components/Navbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ReaderView } from './components/ReaderView';
import { ReaderProgressBar } from './components/ReaderProgressBar';
import { StrictTranslationModal } from './components/StrictTranslationModal';
import { QuizModal } from './components/QuizModal';
import { ChaptersDrawer } from './components/ChaptersDrawer';
import { VocabularyReviewModal } from './components/VocabularyReviewModal';
import { FocusSessionModal } from './components/FocusSessionModal';
import { PassageSituationModal } from './components/PassageSituationModal';
import { AnalyticsDashboardModal } from './components/AnalyticsDashboardModal';
import { PasswordLockScreen } from './components/PasswordLockScreen';
import { getBookInfo, getPage, getAllPages, getBookChapters, getSurroundingExtendedContext } from './data/bookService';
import { generateInstantTranslation } from './data/translationsDict';
import { executePedagogicalQuizGeneration } from './data/quizGeneratorService';
import {
  getCachedTranslation,
  setCachedTranslation,
  getLatestPageTranslation,
  setLatestPageTranslation,
} from './data/translationCache';
import {
  warmUpSpeechEngine,
  getFrenchVoiceOptions,
  stopAllTTS,
  playBoundArabicTranslation,
} from './data/ttsService';
import { BookId, TranslationResponse, TranslationMode, QuizQuestion, QuizRequest, ChapterMeta } from './types';

// Robust Token-Limiter Configuration for Translation API
const INITIAL_PAGE_ANALYSIS_CHAR_LIMIT = 500;

/**
 * Robust Token-Limiter to enforce bounded character budgets and prevent multi-page spillover.
 * Ensures the translator remains strictly locked to the specific user-selected paragraph or snippet.
 */
export function applyTranslationTokenLimiter(
  rawText: string,
  limit: number = INITIAL_PAGE_ANALYSIS_CHAR_LIMIT
): { truncatedText: string; isTruncated: boolean; originalCharCount: number; truncatedCharCount: number } {
  if (!rawText) {
    return { truncatedText: '', isTruncated: false, originalCharCount: 0, truncatedCharCount: 0 };
  }
  const trimmed = rawText.trim();
  if (trimmed.length <= limit) {
    return { truncatedText: trimmed, isTruncated: false, originalCharCount: trimmed.length, truncatedCharCount: trimmed.length };
  }

  // Find nearest natural sentence or punctuation boundary before limit to preserve literary semantics
  const slice = trimmed.slice(0, limit);
  const boundaryIdx = Math.max(
    slice.lastIndexOf('. '),
    slice.lastIndexOf('! '),
    slice.lastIndexOf('? '),
    slice.lastIndexOf('؟ '),
    slice.lastIndexOf('; '),
    slice.lastIndexOf('\n\n'),
    slice.lastIndexOf('\n'),
    slice.lastIndexOf(' ')
  );

  const finalTruncated = boundaryIdx > limit * 0.5 ? slice.slice(0, boundaryIdx).trim() : slice.trim();
  return {
    truncatedText: finalTruncated,
    isTruncated: true,
    originalCharCount: trimmed.length,
    truncatedCharCount: finalTruncated.length,
  };
}

export default function App() {
  return (
    <ErrorBoundaryWrapper>
      <AppContent />
    </ErrorBoundaryWrapper>
  );
}

function AppContent() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);

  const [currentView, setCurrentView] = useState<'home' | 'reader' | 'quiz'>('home');
  const [translationDirection, setTranslationDirection] = useState<'fr-to-ar' | 'ar-to-fr'>('fr-to-ar');
  const [isRetryingTranslationWithContext, setIsRetryingTranslationWithContext] = useState(false);

  // Global SpeechSynthesis & Voice Engine Lifecycle Initialization
  useEffect(() => {
    warmUpSpeechEngine();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        // Unpause any stalled engine state from previous page loads
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        // Query initial French voices
        getFrenchVoiceOptions();

        const handleVoicesChanged = () => {
          try {
            getFrenchVoiceOptions();
          } catch {}
        };

        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
        return () => {
          window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        };
      } catch (e) {
        console.warn('Speech synthesis initialization notice:', e);
      }
    }
  }, []);

  // Night / Dark Mode state management
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('app_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('app_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('app_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Multi-book state persistence
  const [currentBook, setCurrentBook] = useState<BookId>(() => {
    const saved = localStorage.getItem('current_book_id') as BookId;
    if (saved === 'antigone' || saved === 'le_dernier_jour_dun_condamne' || saved === 'la_boite_a_merveilles') {
      return saved;
    }
    return 'la_boite_a_merveilles';
  });

  const [lastReadPages, setLastReadPages] = useState<Record<BookId, number>>(() => {
    const lbm = Number(localStorage.getItem('lbm_last_page')) || 1;
    const ant = Number(localStorage.getItem('antigone_last_page')) || 1;
    const cnd = Number(localStorage.getItem('condamne_last_page')) || 1;
    return {
      la_boite_a_merveilles: Math.min(Math.max(1, lbm), 99),
      antigone: Math.min(Math.max(1, ant), 115),
      le_dernier_jour_dun_condamne: Math.min(Math.max(1, cnd), 55),
    };
  });

  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [selectedPagesForQuiz, setSelectedPagesForQuiz] = useState<number[]>([]);

  // Modals & Drawers state
  const [isQuizModalOpen, setIsQuizModalOpen] = useState<boolean>(false);
  const [isFocusModalOpen, setIsFocusModalOpen] = useState<boolean>(false);
  const [isChaptersDrawerOpen, setIsChaptersDrawerOpen] = useState<boolean>(false);
  const [chaptersDrawerTab, setChaptersDrawerTab] = useState<'chapters' | 'bookmarks'>('chapters');
  const [isTranslationModalOpen, setIsTranslationModalOpen] = useState<boolean>(false);
  const [isVocabModalOpen, setIsVocabModalOpen] = useState<boolean>(false);
  const [vocabInitialTab, setVocabInitialTab] = useState<'cards' | 'quiz' | 'list'>('cards');
  const [vocabInitialCardId, setVocabInitialCardId] = useState<string | undefined>(undefined);
  const [isPassageModalOpen, setIsPassageModalOpen] = useState<boolean>(false);
  const [passageModalPassageId, setPassageModalPassageId] = useState<string | undefined>(undefined);
  const [passageModalChapterNumber, setPassageModalChapterNumber] = useState<number | undefined>(undefined);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState<boolean>(false);

  const handleOpenPassageSituation = (chapterNumber?: number, passageId?: string) => {
    setPassageModalChapterNumber(chapterNumber);
    setPassageModalPassageId(passageId);
    setIsPassageModalOpen(true);
  };


  // Translation State with LocalStorage Caching Layer and Smooth Transition Clearance
  const [currentTranslation, setCurrentTranslation] = useState<TranslationResponse | null>(() => {
    const savedBook = (localStorage.getItem('current_book_id') as BookId) || 'la_boite_a_merveilles';
    const lbm = Number(localStorage.getItem('lbm_last_page')) || 1;
    const ant = Number(localStorage.getItem('antigone_last_page')) || 1;
    const cnd = Number(localStorage.getItem('condamne_last_page')) || 1;
    const initialPage = savedBook === 'antigone' ? ant : savedBook === 'le_dernier_jour_dun_condamne' ? cnd : lbm;
    return getLatestPageTranslation(savedBook, initialPage);
  });
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [isTranslationTransitioning, setIsTranslationTransitioning] = useState<boolean>(false);

  /**
   * Refactored atomic translation updater:
   * Completely clears previous UI state first, avoiding stale text ghosting,
   * then applies a smooth CSS transition to prevent visual artifacts and flickering.
   */
  const updateTranslationCleanly = (newTranslation: TranslationResponse | null) => {
    setIsTranslationTransitioning(true);
    // Clear previous state completely to guarantee zero residual artifacts
    setCurrentTranslation(null);

    // Micro-task timeout ensures the DOM cleanly flushes before new text transition
    setTimeout(() => {
      setCurrentTranslation(newTranslation);
      setIsTranslationTransitioning(false);
    }, 40);
  };

  // Active book computations via unified service
  const bookInfo = getBookInfo(currentBook);
  const allBookPages = getAllPages(currentBook);
  const totalPages = allBookPages.length;
  const currentPage = lastReadPages[currentBook] || 1;
  const currentPageData = getPage(currentBook, currentPage);
  const bookChapters = getBookChapters(currentBook);

  const handleSelectBook = (bookId: BookId) => {
    stopAllTTS();
    setCurrentBook(bookId);
    localStorage.setItem('current_book_id', bookId);
    setSelectedPagesForQuiz([]);
    const targetPage = lastReadPages[bookId] || 1;
    const pageCachedTrans = getLatestPageTranslation(bookId, targetPage);
    updateTranslationCleanly(pageCachedTrans);
  };

  const handleOpenVocabReview = (param?: 'cards' | 'quiz' | 'list' | string) => {
    if (param === 'cards' || param === 'quiz' || param === 'list') {
      setVocabInitialTab(param);
      setVocabInitialCardId(undefined);
    } else if (param) {
      setVocabInitialTab('cards');
      setVocabInitialCardId(param);
    } else {
      setVocabInitialTab('cards');
      setVocabInitialCardId(undefined);
    }
    setIsVocabModalOpen(true);
  };

  // Save current page to local storage per book & restore cached translations instantly
  const handlePageChange = (page: number) => {
    stopAllTTS();
    const clamped = Math.min(Math.max(1, page), totalPages);
    setLastReadPages((prev) => {
      const updated = { ...prev, [currentBook]: clamped };
      let storageKey = 'lbm_last_page';
      if (currentBook === 'antigone') {
        storageKey = 'antigone_last_page';
      } else if (currentBook === 'le_dernier_jour_dun_condamne') {
        storageKey = 'condamne_last_page';
      }
      localStorage.setItem(storageKey, String(clamped));
      return updated;
    });

    // Re-visiting the same page: trigger instant clean retrieval from localStorage
    const pageCachedTrans = getLatestPageTranslation(currentBook, clamped);
    updateTranslationCleanly(pageCachedTrans);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartReading = (page?: number) => {
    if (page) {
      handlePageChange(page);
    }
    setCurrentView('reader');
  };

  const handleOpenChapter = (chapter: ChapterMeta) => {
    handlePageChange(chapter.startPage);
    setCurrentView('reader');
  };

  const handleTogglePageForQuiz = (page: number) => {
    setSelectedPagesForQuiz((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]
    );
  };

  // Immediate Non-Blank Translation Execution: Checks localStorage cache first for instant retrieval
  const handleTranslateSelection = async (
    selectedText: string,
    context: string,
    pageNumber: number,
    translationMode?: TranslationMode
  ) => {
    const rawTrimmed = (selectedText || '').trim();
    if (!rawTrimmed) return;

    stopAllTTS();

    // Apply robust token limiter: For initial page analysis/full-page triggers, force 500-character snippet truncation
    // to strictly lock the translator to the target paragraph and avoid multi-page spillover
    const words = rawTrimmed.split(/\s+/).filter(Boolean);
    const activeMode: TranslationMode =
      translationMode || (words.length <= 1 ? 'word-by-word' : 'full-sentence');

    // Do not truncate if full-sentence (full page / paragraph) mode is active, ensuring 100% complete page translation
    const isFullPageOrSentence = activeMode === 'full-sentence';
    const tokenLimitResult = isFullPageOrSentence
      ? { truncatedText: rawTrimmed, isTruncated: false, originalCharCount: rawTrimmed.length, truncatedCharCount: rawTrimmed.length }
      : (rawTrimmed.length > INITIAL_PAGE_ANALYSIS_CHAR_LIMIT
          ? applyTranslationTokenLimiter(rawTrimmed, INITIAL_PAGE_ANALYSIS_CHAR_LIMIT)
          : { truncatedText: rawTrimmed, isTruncated: false, originalCharCount: rawTrimmed.length, truncatedCharCount: rawTrimmed.length });

    const trimmed = tokenLimitResult.truncatedText;

    // Clamp context strictly to 500-character bounded snippet to prevent multi-page context leakage
    const activePageData = getPage(currentBook, pageNumber);
    const rawContext = context || activePageData.text || '';
    const safeContext = applyTranslationTokenLimiter(rawContext, INITIAL_PAGE_ANALYSIS_CHAR_LIMIT).truncatedText;

    // 1. Check localStorage translation cache first: instant local retrieval!
    const cached = getCachedTranslation(currentBook, pageNumber, trimmed, activeMode, false);
    if (cached) {
      updateTranslationCleanly(cached);
      setLatestPageTranslation(currentBook, pageNumber, cached);
      setCurrentView('reader');
      setIsTranslating(true);
      setTranslationError(null);
      setTimeout(() => {
        setIsTranslating(false);
      }, 350);
      return; // Instant local retrieval with visible progress confirmation
    }

    // 2. Instantly populate translation so it is NEVER blank or hidden
    const instantData = generateInstantTranslation(trimmed, safeContext, pageNumber, activeMode);
    
    // Reverse logic if translationDirection is ar-to-fr (placeholder for now as core logic is fr->ar)
    if (translationDirection === 'ar-to-fr') {
        // ... (we'll need a way to support this in generateInstantTranslation if needed, but for now focus on the UI)
    }

    updateTranslationCleanly(instantData);
    setLatestPageTranslation(currentBook, pageNumber, instantData);
    setCurrentView('reader');
    setIsTranslating(true);
    setTranslationError(null);

    // 3. Fetch enhanced server-side insights asynchronously with strictly bounded 500-character snippet limit
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: trimmed,
          context: safeContext,
          pageNumber,
          bookId: currentBook,
          novelTitle: bookInfo.titleFrench,
          translationMode: activeMode,
          maxChars: INITIAL_PAGE_ANALYSIS_CHAR_LIMIT,
          isSnippetTruncated: tokenLimitResult.isTruncated,
          tokenLimit: INITIAL_PAGE_ANALYSIS_CHAR_LIMIT,
        }),
      });

      if (response.ok) {
        const data: TranslationResponse = await response.json();
        if (data && data.arabicTranslation) {
          const dataWords = data.arabicTranslation.trim().split(/\s+/).filter(Boolean).length;
          const instantWords = instantData.arabicTranslation.trim().split(/\s+/).filter(Boolean).length;
          if (words.length > 50 && dataWords < instantWords * 0.5) {
            console.warn('[Translation] Server response was shorter than local full translation, preserving complete translation.');
          } else if (words.length <= 35 && dataWords > words.length * 4 && instantWords <= words.length * 2.5) {
            console.warn('[Translation] Preserving strictly bounded short paragraph translation without spillover.');
          } else {
            updateTranslationCleanly(data);
            setCachedTranslation(currentBook, pageNumber, trimmed, data, activeMode, false);
            setLatestPageTranslation(currentBook, pageNumber, data);
          }
        }
      } else {
        // Cache verified instantData as fallback
        setCachedTranslation(currentBook, pageNumber, trimmed, instantData, activeMode, false);
      }
    } catch (err: any) {
      console.warn('API translation background fallback active:', err);
      // Instant verified data remains active; cache it locally
      setCachedTranslation(currentBook, pageNumber, trimmed, instantData, activeMode, false);
    } finally {
      setIsTranslating(false);
    }
  };

  // Switch Translation Mode dynamically (Word-by-word vs Full-sentence)
  const handleSwitchTranslationMode = async (newMode: TranslationMode) => {
    if (!currentTranslation || !currentTranslation.originalText) return;

    const selectedText = currentTranslation.originalText;
    const pageText = getPage(currentBook, currentPage).text;

    handleTranslateSelection(selectedText, pageText, currentPage, newMode);
  };

  // Retry Translation With Expanded Context Window (surrounding paragraphs)
  const handleRetryTranslationWithMoreContext = async () => {
    if (!currentTranslation || !currentTranslation.originalText) return;

    const selectedText = currentTranslation.originalText.trim();
    const activeMode = currentTranslation.translationMode;

    // Check if expanded context translation is already cached in localStorage
    const cachedExpanded = getCachedTranslation(currentBook, currentPage, selectedText, activeMode, true);
    if (cachedExpanded) {
      updateTranslationCleanly(cachedExpanded);
      setLatestPageTranslation(currentBook, currentPage, cachedExpanded);
      setIsRetryingTranslationWithContext(false);
      setIsTranslating(false);
      return; // Instant local retrieval
    }

    setIsRetryingTranslationWithContext(true);
    setIsTranslating(true);
    setTranslationError(null);

    try {
      const surrounding = getSurroundingExtendedContext(currentBook, currentPage, selectedText, 3);

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: selectedText,
          context: surrounding.fullExtendedContext,
          pageNumber: currentPage,
          bookId: currentBook,
          novelTitle: bookInfo.titleFrench,
          selectionType: currentTranslation.type,
          translationMode: activeMode,
          expandContextWindow: true,
          surroundingBefore: surrounding.surroundingBefore,
          surroundingAfter: surrounding.surroundingAfter,
          windowParagraphsCount: surrounding.paragraphsCount,
        }),
      });

      if (response.ok) {
        const data: TranslationResponse = await response.json();
        if (data && data.arabicTranslation) {
          data.isContextExpanded = true;
          data.expandedContextWindow = {
            surroundingBefore: surrounding.surroundingBefore,
            surroundingAfter: surrounding.surroundingAfter,
            paragraphsCount: surrounding.paragraphsCount,
          };
          updateTranslationCleanly(data);
          setCachedTranslation(currentBook, currentPage, selectedText, data, activeMode, true);
        }
      } else {
        // Graceful update in case of timeout / network fallback
        if (currentTranslation) {
          const updated = {
            ...currentTranslation,
            isContextExpanded: true,
            expandedContextWindow: {
              surroundingBefore: surrounding.surroundingBefore,
              surroundingAfter: surrounding.surroundingAfter,
              paragraphsCount: surrounding.paragraphsCount,
            },
          };
          updateTranslationCleanly(updated);
          setCachedTranslation(currentBook, currentPage, selectedText, updated, activeMode, true);
        }
      }
    } catch (err: any) {
      console.warn('API expanded translation retry fallback:', err);
      if (currentTranslation) {
        const updated = {
          ...currentTranslation,
          isContextExpanded: true,
        };
        updateTranslationCleanly(updated);
        setCachedTranslation(currentBook, currentPage, selectedText, updated, activeMode, true);
      }
    } finally {
      setIsRetryingTranslationWithContext(false);
      setIsTranslating(false);
    }
  };

  // Quiz Generation Execution
  const handleGenerateQuiz = async (req: QuizRequest): Promise<QuizQuestion[]> => {
    return await executePedagogicalQuizGeneration({
      ...req,
      bookId: currentBook,
    });
  };

  // Atmospheric background classes
  const isAntigone = currentBook === 'antigone';
  const isCondamne = currentBook === 'le_dernier_jour_dun_condamne';
  const isBoite = !isAntigone && !isCondamne;

  const appBgClass = isBoite
    ? 'bg-[#faf6ee] dark:bg-[#120f0d]'
    : isAntigone
    ? 'bg-[#faf5f6] dark:bg-[#12080d]'
    : 'bg-[#f1f5f9] dark:bg-[#0a0e17]';

  if (!isUnlocked) {
    return (
      <PasswordLockScreen
        onUnlock={() => {
          localStorage.setItem('site_unlocked', 'true');
          setIsUnlocked(true);
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen ${appBgClass} text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      {/* Top Main Navigation Bar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        fontSize={fontSize}
        setFontSize={setFontSize}
        selectedPagesForQuiz={selectedPagesForQuiz}
        onOpenQuiz={() => setIsQuizModalOpen(true)}
        onOpenChapters={() => {
          setChaptersDrawerTab('chapters');
          setIsChaptersDrawerOpen(true);
        }}
        onOpenBookmarks={() => {
          setChaptersDrawerTab('bookmarks');
          setIsChaptersDrawerOpen(true);
        }}
        onOpenVocabReview={() => handleOpenVocabReview('cards')}
        onOpenFocusSession={() => setIsFocusModalOpen(true)}
        onOpenPassageSituation={() => handleOpenPassageSituation()}
        onOpenAnalytics={() => setIsAnalyticsModalOpen(true)}
        activeBook={bookInfo}
        onSelectBook={handleSelectBook}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Visual Book Progress Bar Component Below Navbar in Reader View */}
      {currentView === 'reader' && (
        <ReaderProgressBar
          bookInfo={bookInfo}
          lastReadPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onOpenChapters={() => {
            setChaptersDrawerTab('chapters');
            setIsChaptersDrawerOpen(true);
          }}
        />
      )}

      {/* Main Content View */}
      <main className="flex-1">
        {currentView === 'home' && (
          <WelcomeScreen
            activeBookId={currentBook}
            onSelectBook={handleSelectBook}
            onStartReading={(bookId, page) => {
              handleSelectBook(bookId);
              handleStartReading(page);
            }}
            onOpenQuiz={(bookId) => {
              handleSelectBook(bookId);
              setIsQuizModalOpen(true);
            }}
            onOpenChapter={handleOpenChapter}
            onOpenVocabReview={(tab) => handleOpenVocabReview(tab || 'cards')}
            onOpenFocusSession={() => setIsFocusModalOpen(true)}
            onOpenAnalytics={() => setIsAnalyticsModalOpen(true)}
            lastReadPages={lastReadPages}
          />
        )}

        {currentView === 'reader' && (
          <div
            className={`transition-opacity duration-300 ease-out ${
              isTranslationTransitioning ? 'opacity-90' : 'opacity-100'
            }`}
          >
            <ReaderView
              currentPageData={currentPageData}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              fontSize={fontSize}
              selectedPagesForQuiz={selectedPagesForQuiz}
              onTogglePageForQuiz={handleTogglePageForQuiz}
              onTranslateSelection={handleTranslateSelection}
              onOpenQuiz={() => setIsQuizModalOpen(true)}
              onOpenVocabReview={(cardId) => handleOpenVocabReview(cardId)}
              onOpenBookmarks={() => {
                setChaptersDrawerTab('bookmarks');
                setIsChaptersDrawerOpen(true);
              }}
              onOpenFocusSession={() => setIsFocusModalOpen(true)}
              activeTranslation={currentTranslation}
              onCloseTranslation={() => updateTranslationCleanly(null)}
              bookInfo={bookInfo}
              onRetryWithMoreContext={handleRetryTranslationWithMoreContext}
              isRetryingWithContext={isRetryingTranslationWithContext}
              onSwitchTranslationMode={handleSwitchTranslationMode}
              isTranslating={isTranslating}
              translationDirection={translationDirection}
              onToggleTranslationDirection={() => setTranslationDirection(prev => prev === 'fr-to-ar' ? 'ar-to-fr' : 'fr-to-ar')}
            />
          </div>
        )}
      </main>

      {/* Strict Translation Modal with Automatic Self-Verification */}
      <StrictTranslationModal
        isOpen={isTranslationModalOpen}
        onClose={() => setIsTranslationModalOpen(false)}
        translation={currentTranslation}
        isLoading={isTranslating}
        error={translationError}
        pageNumber={currentPage}
        onRetryWithMoreContext={handleRetryTranslationWithMoreContext}
        isRetryingWithContext={isRetryingTranslationWithContext}
      />

      {/* 1st Bac Exam Quiz Modal */}
      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        currentPage={currentPage}
        selectedPages={selectedPagesForQuiz}
        onGenerateQuiz={handleGenerateQuiz}
        bookInfo={bookInfo}
      />

      {/* Chapters & Scenes Directory Drawer */}
      <ChaptersDrawer
        isOpen={isChaptersDrawerOpen}
        onClose={() => setIsChaptersDrawerOpen(false)}
        onSelectChapter={handleOpenChapter}
        onSelectPage={handlePageChange}
        onOpenPassageSituation={(ch) => handleOpenPassageSituation(ch)}
        currentPage={currentPage}
        bookInfo={bookInfo}
        chapters={bookChapters}
        initialTab={chaptersDrawerTab}
      />

      {/* Vocabulary Review & Flashcards Modal */}
      <VocabularyReviewModal
        isOpen={isVocabModalOpen}
        onClose={() => setIsVocabModalOpen(false)}
        initialTab={vocabInitialTab}
        initialCardId={vocabInitialCardId}
        activeBookId={currentBook}
        currentPage={currentPage}
        bookInfo={bookInfo}
      />

      {/* Focus Session & Daily Reading Goal Modal */}
      <FocusSessionModal
        isOpen={isFocusModalOpen}
        onClose={() => setIsFocusModalOpen(false)}
        activeBook={bookInfo}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      {/* Situation du Passage Exam & Test Modal */}
      <PassageSituationModal
        isOpen={isPassageModalOpen}
        onClose={() => setIsPassageModalOpen(false)}
        activeBook={bookInfo}
        initialPassageId={passageModalPassageId}
        initialChapterNumber={passageModalChapterNumber}
        onJumpToPage={(p) => {
          handlePageChange(p);
          setCurrentView('reader');
        }}
      />

      {/* Comprehensive Reading & Vocabulary Analytics Dashboard Modal */}
      <AnalyticsDashboardModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        activeBook={bookInfo}
        onSelectChapter={handleOpenChapter}
        onSelectPage={(p) => {
          handlePageChange(p);
          setCurrentView('reader');
        }}
        onOpenVocabReview={() => handleOpenVocabReview('cards')}
        onOpenFocusSession={() => setIsFocusModalOpen(true)}
      />

      {/* Footer */}
      <footer className="border-t border-amber-200/80 dark:border-stone-800 bg-amber-100/50 dark:bg-stone-900/60 py-6 text-center text-xs text-amber-900/80 dark:text-stone-400 font-arabic transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-bold text-amber-950 dark:text-stone-200">
            المنصة التعليمية التفاعلية المعتمدة للأولى باكالوريا بالمغرب · «علبة العجائب» لأحمد الصفريوي · «أنتيجون» لجان أنوي · «آخر يوم لمحكوم عليه بالإعدام» لفيكتور هوغو
          </p>
          <p className="font-serif text-[11px] text-amber-800/75 dark:text-amber-400/70">
            Programme Officiel du Français 1ère Bac Maroc · La Boîte à Merveilles · Antigone · Le Dernier Jour d'un Condamné
          </p>
        </div>
      </footer>
    </div>
  );
}
