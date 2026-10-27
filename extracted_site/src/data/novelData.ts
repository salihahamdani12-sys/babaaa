import { NovelPage } from '../types';
import { NOVEL_PAGES_1_25 } from './novelPages1_25';
import { NOVEL_PAGES_26_60 } from './novelPages26_60';
import { NOVEL_PAGES_51_99 } from './novelPages51_99';
import { CHAPTERS_META } from './chaptersMeta';

// Combine explicit curated pages
const CURATED_MAP = new Map<number, NovelPage>();

[...NOVEL_PAGES_1_25, ...NOVEL_PAGES_26_60, ...NOVEL_PAGES_51_99].forEach((p) => {
  CURATED_MAP.set(p.pageNumber, p);
});

// Helper to find which chapter a page belongs to
export function getChapterForPage(pageNumber: number) {
  const ch = CHAPTERS_META.find(
    (c) => pageNumber >= c.startPage && pageNumber <= c.endPage
  );
  return ch || CHAPTERS_META[0];
}

// Generate the complete 1 to 99 pages array
export const ALL_NOVEL_PAGES: NovelPage[] = Array.from({ length: 99 }, (_, i) => {
  const pageNum = i + 1;
  if (CURATED_MAP.has(pageNum)) {
    return CURATED_MAP.get(pageNum)!;
  }

  // Synthesize for in-between pages from chapter context
  const chapterMeta = getChapterForPage(pageNum);
  return {
    pageNumber: pageNum,
    chapter: chapterMeta.chapter,
    chapterTitle: chapterMeta.title,
    text: `[Page ${pageNum} - ${chapterMeta.title}]\n\n${chapterMeta.mainThemeArabic}\n\nDans cette partie du roman d'Ahmed Sefrioui (La Boîte à Merveilles), le narrateur Sidi Mohammed continue de dépeindre avec finesse la vie quotidienne de la médina de Fès dans les années 1920. Les péripéties s'enchaînent entre Dar Chouafa, le Msid et les ruelles animées de la ville sainte, rythmées par les traditions ancestrales, les croyances populaires et les émotions intimes d'un enfant solitaire fasciné par le mystère des êtres et des objets.`,
    arabicSummary: `الصفحة ${pageNum} من الرواية (${chapterMeta.titleArabic}): يسترسل السرد في توثيق مظاهر الحياة الفاسية في عشرينات القرن العشرين بين فضاء دار الشوافة، المسيد، والدروب العتيقة، مع استبطان مشاعر سيدي محمد وعوالمه الخيالية.`,
    keyEventsArabic: [
      `أحداث الصفحة ${pageNum} ضمن سياق ${chapterMeta.titleArabic}`,
      "استمرار تدفق السرد وتفاعل الشخصيات الرئيسية في فضاء المدينة القديمة بفاس",
      "رصد العادات والتقاليد الشعبية المغربية الأصيلة ومشاعر الراوي الطفل"
    ],
    mainCharacters: ["Sidi Mohammed", "Lalla Zoubida", "Maâlem Abdeslem"]
  };
});

export function getNovelPage(pageNumber: number): NovelPage {
  const found = ALL_NOVEL_PAGES.find((p) => p.pageNumber === pageNumber);
  return found || ALL_NOVEL_PAGES[0];
}
