import { BookId, PageSummaryResponse, NovelPage } from '../types';
import { getPage, getBookInfo } from './bookService';

const summaryCache = new Map<string, PageSummaryResponse>();
const SUMMARY_STORAGE_PREFIX = 'bac_page_summary_cache:';

export async function fetchPageSummary(params: {
  pageNumber: number;
  bookId: BookId;
  forceRefresh?: boolean;
}): Promise<PageSummaryResponse> {
  const { pageNumber, bookId, forceRefresh = false } = params;
  const cacheKey = `${bookId}_page_${pageNumber}`;
  const storageKey = `${SUMMARY_STORAGE_PREFIX}${bookId}:p${pageNumber}`;

  if (!forceRefresh) {
    // 1. Check in-memory cache
    if (summaryCache.has(cacheKey)) {
      return summaryCache.get(cacheKey)!;
    }
    // 2. Check localStorage cache
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed: PageSummaryResponse = JSON.parse(stored);
          if (parsed && parsed.quickSynopsisArabic) {
            summaryCache.set(cacheKey, parsed);
            return parsed;
          }
        }
      }
    } catch {}
  }

  const pageData: NovelPage = getPage(bookId, pageNumber);
  const bookInfo = getBookInfo(bookId);

  // Construct instant base fallback
  const localFallback: PageSummaryResponse = {
    pageNumber,
    bookId,
    novelTitle: bookInfo.titleFrench,
    chapterTitle: pageData.chapterTitle,
    quickSynopsisArabic: pageData.arabicSummary || `ملخص لأحداث الصفحة ${pageNumber} من مؤلف ${bookInfo.titleFrench}.`,
    situationDuPassageArabic: `يندرج هذا المقطع في سياق ${pageData.chapterTitle} من رواية ${bookInfo.titleFrench} المقررة للامتحان الجهوي.`,
    keyEventsArabic: pageData.keyEventsArabic || [
      `أحداث الصفحة ${pageNumber}`,
      `تطورات الموقف السردي في ${pageData.chapterTitle}`,
    ],
    mainCharacters: (pageData.mainCharacters || []).map((name) => ({
      name,
      roleArabic: 'شخصية حاضرة أو مذكورة في الصفحة',
    })),
    regionalExamPointers:
      bookId === 'antigone'
        ? 'في هذا المقطع ركز على موقف أنتيجون ومواجهتها، ونوع الحوار وتناوب الخطاب التراجيدي.'
        : bookId === 'le_dernier_jour_dun_condamne'
        ? 'ركز على الحالة النفسية للمحكوم بالإعدام، أسلوب المونولوج الداخلي والاستعارات المعبرة عن الخوف.'
        : 'ركز على ثنائية عالم الطفل وعالم الكبار، واستعمال المعجم التقليدي المغربي، ودور علبة العجائب.',
    thematicInsight:
      bookId === 'antigone'
        ? 'تيمة الواجب والمأساة / Le devoir tragique'
        : bookId === 'le_dernier_jour_dun_condamne'
        ? 'تيمة انتظار الإعدام والحرية / L’angoisse et la peine de mort'
        : 'تيمة العزلة والطفولة / La solitude et l’enfance',
    generatedWithAI: false,
  };

  try {
    const response = await fetch('/api/page-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageNumber,
        bookId,
        pageText: pageData.text,
        chapterTitle: pageData.chapterTitle,
        novelTitle: bookInfo.titleFrench,
        existingSummary: pageData.arabicSummary,
        existingEvents: pageData.keyEventsArabic,
        existingCharacters: pageData.mainCharacters,
      }),
    });

    if (response.ok) {
      const data: PageSummaryResponse = await response.json();
      if (data && data.quickSynopsisArabic) {
        summaryCache.set(cacheKey, data);
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(storageKey, JSON.stringify(data));
          }
        } catch {}
        return data;
      }
    }
  } catch (err) {
    console.warn('[Page Summary Service] Network request failed, using local fallback:', err);
  }

  summaryCache.set(cacheKey, localFallback);
  return localFallback;
}
