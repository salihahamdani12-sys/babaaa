import { NovelPage } from '../../types';
import { ANTIGONE_PAGES_1_30 } from './antigonePages1_30';
import { ANTIGONE_PAGES_31_60 } from './antigonePages31_60';
import { ANTIGONE_PAGES_61_90 } from './antigonePages61_90';
import { ANTIGONE_PAGES_91_115 } from './antigonePages91_115';
import { ANTIGONE_SCENES_META } from './antigoneMeta';

const ANTIGONE_MAP = new Map<number, NovelPage>();

[
  ...ANTIGONE_PAGES_1_30,
  ...ANTIGONE_PAGES_31_60,
  ...ANTIGONE_PAGES_61_90,
  ...ANTIGONE_PAGES_91_115
].forEach((p) => {
  ANTIGONE_MAP.set(p.pageNumber, p);
});

export function getAntigoneSceneForPage(pageNumber: number) {
  const scene = ANTIGONE_SCENES_META.find(
    (s) => pageNumber >= s.startPage && pageNumber <= s.endPage
  );
  return scene || ANTIGONE_SCENES_META[0];
}

export const ALL_ANTIGONE_PAGES: NovelPage[] = Array.from({ length: 115 }, (_, i) => {
  const pageNum = i + 1;
  if (ANTIGONE_MAP.has(pageNum)) {
    return ANTIGONE_MAP.get(pageNum)!;
  }

  const sceneMeta = getAntigoneSceneForPage(pageNum);
  return {
    pageNumber: pageNum,
    chapter: sceneMeta.chapter,
    chapterTitle: sceneMeta.title,
    text: `[Page ${pageNum} - ${sceneMeta.title}]\n\n${sceneMeta.mainThemeArabic}\n\nDans cette scène magistrale d'Antigone de Jean Anouilh, la tragédie moderne se déploie à travers la confrontation poignante entre la pureté sans compromis de la jeune fille et la raison d'État pragmatique incarnée par le roi Créon.`,
    arabicSummary: `الصفحة ${pageNum} من مسرحية أنتيجون (${sceneMeta.titleArabic}): تستمر فصول المسرحية التراجيدية لجان أنوي في تجسيد الصراع الخالد بين نقاء الموقف الإنساني وسلطة القانون الوضعي.`,
    keyEventsArabic: [
      `أحداث الصفحة ${pageNum} ضمن ${sceneMeta.titleArabic}`,
      "تصاعد وتيرة الحوار التراجيدي والتوتر الدرامي بين الشخصيات",
      "بلورة الدوافع الفلسفية والأبعاد الرمزية لأنتيجون"
    ],
    mainCharacters: ["Antigone", "Créon"]
  };
});

export function getAntigonePage(pageNumber: number): NovelPage {
  const found = ALL_ANTIGONE_PAGES.find((p) => p.pageNumber === pageNumber);
  return found || ALL_ANTIGONE_PAGES[0];
}
