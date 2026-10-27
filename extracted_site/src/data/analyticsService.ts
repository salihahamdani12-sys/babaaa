import { BookId, BookInfo, ChapterMeta } from '../types';
import { getFocusSessionState, getPageReadingSeconds, formatFocusTime } from './focusService';
import { getStoredFlashcards } from './vocabularyService';
import { getBookChapters, getAllPages } from './bookService';
import { BOOKS, getBookById } from './books';

export interface ChapterReadingStats {
  bookId: BookId;
  chapterNumber: number;
  chapterTitle: string;
  chapterTitleArabic: string;
  startPage: number;
  endPage: number;
  totalPages: number;
  pagesVisited: number;
  totalSeconds: number;
  formattedTime: string;
  averageSecondsPerPage: number;
  completionPercent: number;
  status: 'not_started' | 'in_progress' | 'completed';
  estimatedRemainingSeconds: number;
}

export interface DailyDayRecord {
  date: string; // YYYY-MM-DD
  dayLabelArabic: string;
  totalMinutes: number;
  totalSeconds: number;
  goalMinutes: number;
  goalReached: boolean;
  pagesVisited: number;
}

export interface VocabularyProgressStats {
  totalWords: number;
  masteredCount: number;
  learningCount: number;
  newCount: number;
  masteryRatePercent: number;
  quizAccuracyPercent: number;
  totalReviews: number;
  categoryDistribution: {
    nameArabic: string;
    count: number;
    color: string;
  }[];
}

export interface ReadingVelocityPageItem {
  pageNumber: number;
  bookId: BookId;
  seconds: number;
  wordsPerMinute: number;
  isSlow: boolean;
}

export interface ReadingVelocityStats {
  averageWPM: number;
  fastestWPM: number;
  slowestWPM: number;
  recentPagesVelocity: ReadingVelocityPageItem[];
  fatigueDetected: boolean;
  fatigueMessageArabic: string;
}

export interface AnalyticsSummaryData {
  bookId: BookId | 'ALL';
  totalReadingSeconds: number;
  formattedTotalTime: string;
  totalPagesRead: number;
  totalBookPages: number;
  overallCompletionPercent: number;
  streakDays: number;
  dailyGoalMinutes: number;
  todaySeconds: number;
  todayCompletionPercent: number;
  chapterStats: ChapterReadingStats[];
  dailyHistory: DailyDayRecord[];
  vocabStats: VocabularyProgressStats;
  readingVelocity: ReadingVelocityStats;
  bookComparison: {
    bookId: BookId;
    titleArabic: string;
    titleFrench: string;
    readingSeconds: number;
    formattedTime: string;
    pagesRead: number;
    totalPages: number;
    completionPercent: number;
    color: string;
  }[];
}

const ARABIC_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

/**
 * Computes chapter-by-chapter actual reading analytics
 */
export function getChapterReadingStats(bookId: BookId): ChapterReadingStats[] {
  const chapters = getBookChapters(bookId);
  const focusState = getFocusSessionState();
  const pageMap = focusState.pageSecondsMap || {};

  return chapters.map((ch) => {
    let totalSeconds = 0;
    let pagesVisited = 0;
    const totalPages = Math.max(1, ch.endPage - ch.startPage + 1);

    for (let p = ch.startPage; p <= ch.endPage; p++) {
      const key = `${bookId}_${p}`;
      const sec = pageMap[key] || 0;
      if (sec > 0) {
        totalSeconds += sec;
        pagesVisited += 1;
      }
    }

    const completionPercent = Math.min(100, Math.round((pagesVisited / totalPages) * 100));
    const avgSecPerPage = pagesVisited > 0 ? Math.round(totalSeconds / pagesVisited) : 0;
    const remainingPages = Math.max(0, totalPages - pagesVisited);
    const estimatedRemainingSeconds = avgSecPerPage > 0 ? remainingPages * avgSecPerPage : remainingPages * 120; // fallback 2 mins/page

    let status: 'not_started' | 'in_progress' | 'completed' = 'not_started';
    if (pagesVisited >= totalPages && completionPercent >= 100) {
      status = 'completed';
    } else if (pagesVisited > 0 || totalSeconds > 0) {
      status = 'in_progress';
    }

    return {
      bookId,
      chapterNumber: ch.chapter,
      chapterTitle: ch.title,
      chapterTitleArabic: ch.titleArabic,
      startPage: ch.startPage,
      endPage: ch.endPage,
      totalPages,
      pagesVisited,
      totalSeconds,
      formattedTime: formatFocusTime(totalSeconds),
      averageSecondsPerPage: avgSecPerPage,
      completionPercent,
      status,
      estimatedRemainingSeconds,
    };
  });
}

/**
 * Computes last 7-14 days completion records
 */
export function getDailyFocusTrend(daysCount: number = 7): DailyDayRecord[] {
  const focusState = getFocusSessionState();
  const history = focusState.history || [];
  const result: DailyDayRecord[] = [];

  const now = new Date();

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayName = ARABIC_DAYS[d.getDay()];

    if (i === 0) {
      // Today
      const todaySec = focusState.todaySeconds || 0;
      const todayMins = Math.round((todaySec / 60) * 10) / 10;
      const goalMins = focusState.dailyGoalMinutes || 20;
      result.push({
        date: dateStr,
        dayLabelArabic: 'اليوم',
        totalSeconds: todaySec,
        totalMinutes: todayMins,
        goalMinutes: goalMins,
        goalReached: todaySec >= goalMins * 60,
        pagesVisited: Object.keys(focusState.pageSecondsMap || {}).length,
      });
    } else {
      const match = history.find((h) => h.date === dateStr);
      if (match) {
        result.push({
          date: dateStr,
          dayLabelArabic: dayName,
          totalSeconds: match.totalSeconds,
          totalMinutes: Math.round((match.totalSeconds / 60) * 10) / 10,
          goalMinutes: match.goalMinutes,
          goalReached: match.goalReached,
          pagesVisited: match.pagesVisited || 0,
        });
      } else {
        // No recorded session for that past day
        result.push({
          date: dateStr,
          dayLabelArabic: dayName,
          totalSeconds: 0,
          totalMinutes: 0,
          goalMinutes: focusState.dailyGoalMinutes || 20,
          goalReached: false,
          pagesVisited: 0,
        });
      }
    }
  }

  return result;
}

/**
 * Computes vocabulary mastery metrics
 */
export function getVocabularyProgressMetrics(bookFilter?: BookId): VocabularyProgressStats {
  const allCards = getStoredFlashcards();
  const filtered = bookFilter ? allCards.filter((c) => c.bookId === bookFilter) : allCards;

  const totalWords = filtered.length;
  const mastered = filtered.filter((c) => c.masteryLevel === 'mastered');
  const learning = filtered.filter((c) => c.masteryLevel === 'learning');
  const newWords = filtered.filter((c) => c.masteryLevel === 'new');

  const totalReviews = filtered.reduce((acc, c) => acc + (c.reviewCount || 0), 0);
  const totalCorrect = filtered.reduce((acc, c) => acc + (c.correctCount || 0), 0);
  const quizAccuracyPercent = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 100;
  const masteryRatePercent = totalWords > 0 ? Math.round((mastered.length / totalWords) * 100) : 0;

  // Category distribution
  const catCount: Record<string, number> = {
    'المفردات والتيمات': 0,
    'الشخصيات والأدوار': 0,
    'المحسنات البديعية': 0,
    'مصطلحات عامة': 0,
  };

  filtered.forEach((c) => {
    const cat = (c.category || '').toUpperCase();
    if (cat.includes('FIGURE') || (c.partOfSpeech || '').includes('Figure')) {
      catCount['المحسنات البديعية'] += 1;
    } else if (cat.includes('CHAR') || c.characterRoleArabic || (c.partOfSpeech || '').includes('personnage')) {
      catCount['الشخصيات والأدوار'] += 1;
    } else if (cat.includes('THEME') || cat.includes('VOCAB')) {
      catCount['المفردات والتيمات'] += 1;
    } else {
      catCount['مصطلحات عامة'] += 1;
    }
  });

  const categoryDistribution = [
    { nameArabic: 'المفردات والتيمات', count: catCount['المفردات والتيمات'], color: '#f59e0b' },
    { nameArabic: 'الشخصيات والأدوار', count: catCount['الشخصيات والأدوار'], color: '#10b981' },
    { nameArabic: 'المحسنات البديعية', count: catCount['المحسنات البديعية'], color: '#ec4899' },
    { nameArabic: 'مصطلحات عامة', count: catCount['مصطلحات عامة'], color: '#6366f1' },
  ].filter((c) => c.count > 0);

  return {
    totalWords,
    masteredCount: mastered.length,
    learningCount: learning.length,
    newCount: newWords.length,
    masteryRatePercent,
    quizAccuracyPercent,
    totalReviews,
    categoryDistribution,
  };
}

/**
 * Returns comprehensive aggregated dashboard data
 */
export function getAnalyticsDashboardData(selectedBookId: BookId | 'ALL' = 'la_boite_a_merveilles'): AnalyticsSummaryData {
  const focusState = getFocusSessionState();
  const pageMap = focusState.pageSecondsMap || {};

  const booksList: BookId[] = ['la_boite_a_merveilles', 'antigone', 'le_dernier_jour_dun_condamne'];

  const bookComparison = booksList.map((bid) => {
    const bInfo = getBookById(bid);
    const totalP = bInfo.totalPages;
    let sec = 0;
    let pagesR = 0;

    for (let p = 1; p <= totalP; p++) {
      const s = pageMap[`${bid}_${p}`] || 0;
      if (s > 0) {
        sec += s;
        pagesR += 1;
      }
    }

    const pct = Math.min(100, Math.round((pagesR / totalP) * 100));

    let color = '#d97706';
    if (bid === 'antigone') color = '#e11d48';
    if (bid === 'le_dernier_jour_dun_condamne') color = '#0284c7';

    return {
      bookId: bid,
      titleArabic: bInfo.titleArabic,
      titleFrench: bInfo.titleFrench,
      readingSeconds: sec,
      formattedTime: formatFocusTime(sec),
      pagesRead: pagesR,
      totalPages: totalP,
      completionPercent: pct,
      color,
    };
  });

  // Calculate totals
  let totalReadingSeconds = 0;
  let totalPagesRead = 0;
  let totalBookPages = 0;

  if (selectedBookId === 'ALL') {
    totalReadingSeconds = bookComparison.reduce((acc, b) => acc + b.readingSeconds, 0);
    totalPagesRead = bookComparison.reduce((acc, b) => acc + b.pagesRead, 0);
    totalBookPages = bookComparison.reduce((acc, b) => acc + b.totalPages, 0);
  } else {
    const match = bookComparison.find((b) => b.bookId === selectedBookId);
    if (match) {
      totalReadingSeconds = match.readingSeconds;
      totalPagesRead = match.pagesRead;
      totalBookPages = match.totalPages;
    }
  }

  const overallCompletionPercent = totalBookPages > 0 ? Math.min(100, Math.round((totalPagesRead / totalBookPages) * 100)) : 0;
  const todaySeconds = focusState.todaySeconds || 0;
  const dailyGoalSeconds = (focusState.dailyGoalMinutes || 20) * 60;
  const todayCompletionPercent = Math.min(100, Math.round((todaySeconds / dailyGoalSeconds) * 100));

  const targetBookForChapters: BookId = selectedBookId === 'ALL' ? 'la_boite_a_merveilles' : selectedBookId;
  const chapterStats = getChapterReadingStats(targetBookForChapters);
  const dailyHistory = getDailyFocusTrend(7);
  const vocabStats = getVocabularyProgressMetrics(selectedBookId === 'ALL' ? undefined : selectedBookId);

  // Compute Reading Velocity & Fatigue Detection
  const velocityPages: ReadingVelocityPageItem[] = [];
  
  Object.entries(pageMap).forEach(([key, sec]) => {
    if (sec > 5 && sec < 1200) {
      const [bid, pStr] = key.split('_');
      const pNum = Number(pStr);
      if (selectedBookId === 'ALL' || bid === selectedBookId) {
        const wpm = Math.round((160 / (sec / 60)));
        velocityPages.push({
          pageNumber: pNum,
          bookId: bid as BookId,
          seconds: sec,
          wordsPerMinute: Math.min(400, Math.max(20, wpm)),
          isSlow: sec > 180,
        });
      }
    }
  });

  velocityPages.sort((a, b) => b.pageNumber - a.pageNumber);
  const recentSlice = velocityPages.slice(0, 10);
  const averageWPM = recentSlice.length > 0 
    ? Math.round(recentSlice.reduce((acc, p) => acc + p.wordsPerMinute, 0) / recentSlice.length) 
    : 110;
  
  const fastestWPM = velocityPages.length > 0 ? Math.max(...velocityPages.map(p => p.wordsPerMinute)) : 140;
  const slowestWPM = velocityPages.length > 0 ? Math.min(...velocityPages.map(p => p.wordsPerMinute)) : 60;

  const last3 = recentSlice.slice(0, 3);
  const avgLast3Sec = last3.length > 0 ? last3.reduce((acc, p) => acc + p.seconds, 0) / last3.length : 90;
  const fatigueDetected = avgLast3Sec > 160 || (averageWPM < 75 && velocityPages.length >= 3);

  const fatigueMessageArabic = fatigueDetected
    ? '⚠️ مؤشر إرهاق واستنزاف التركيز: لوحظ تباطؤ ملحوظ في سرعة القراءة (Reading Velocity) في الصفحات الأخيرة، مما قد يدل على التعب الذهني. نقترح أخذ استراحة تركيز قصيرة (Focus Mode Break).'
    : '✨ سرعة القراءة مستقرة وممتازة! أنت تحافظ على إيقاع ذهني رائع للاستيعاب والتحصيل.';

  const readingVelocity: ReadingVelocityStats = {
    averageWPM,
    fastestWPM,
    slowestWPM,
    recentPagesVelocity: recentSlice,
    fatigueDetected,
    fatigueMessageArabic,
  };

  return {
    bookId: selectedBookId,
    totalReadingSeconds,
    formattedTotalTime: formatFocusTime(totalReadingSeconds),
    totalPagesRead,
    totalBookPages,
    overallCompletionPercent,
    streakDays: focusState.streakDays || 1,
    dailyGoalMinutes: focusState.dailyGoalMinutes || 20,
    todaySeconds,
    todayCompletionPercent,
    chapterStats,
    dailyHistory,
    vocabStats,
    readingVelocity,
    bookComparison,
  };
}
