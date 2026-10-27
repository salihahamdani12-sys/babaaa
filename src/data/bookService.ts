import { BookId, BookInfo, ChapterMeta, NovelPage } from '../types';
import { BOOKS, getBookById } from './books';
import { ALL_NOVEL_PAGES, getChapterForPage as getBoiteChapterForPage } from './novelData';
import { ALL_ANTIGONE_PAGES, getAntigoneSceneForPage } from './antigone/antigoneData';
import { ALL_CONDAMNE_PAGES, getCondamnePage } from './condamne/condamneData';
import { CHAPTERS_META as BOITE_CHAPTERS } from './chaptersMeta';
import { ANTIGONE_SCENES_META } from './antigone/antigoneMeta';
import { CONDAMNE_CHAPTERS_META, getCondamneChapterForPage } from './condamne/condamneMeta';

export function getBookInfo(bookId: BookId): BookInfo {
  return getBookById(bookId);
}

export function getAllPages(bookId: BookId): NovelPage[] {
  if (bookId === 'antigone') {
    return ALL_ANTIGONE_PAGES;
  }
  if (bookId === 'le_dernier_jour_dun_condamne') {
    return ALL_CONDAMNE_PAGES;
  }
  return ALL_NOVEL_PAGES;
}

export function getPage(bookId: BookId, pageNumber: number): NovelPage {
  const pages = getAllPages(bookId);
  const found = pages.find((p) => p.pageNumber === pageNumber);
  return found || pages[0];
}

export function getBookChapters(bookId: BookId): ChapterMeta[] {
  if (bookId === 'antigone') {
    return ANTIGONE_SCENES_META;
  }
  if (bookId === 'le_dernier_jour_dun_condamne') {
    return CONDAMNE_CHAPTERS_META;
  }
  return BOITE_CHAPTERS;
}

export function getChapterForBookPage(bookId: BookId, pageNumber: number): ChapterMeta {
  if (bookId === 'antigone') {
    return getAntigoneSceneForPage(pageNumber);
  }
  if (bookId === 'le_dernier_jour_dun_condamne') {
    return getCondamneChapterForPage(pageNumber);
  }
  return getBoiteChapterForPage(pageNumber);
}

/**
 * Retrieves an extended window of surrounding paragraphs (before and after the selected text)
 * strictly bound within the CURRENT ACTIVE PAGE to prevent multi-page spillover while providing
 * clear context for ambiguous pronouns or short clauses.
 */
export function getSurroundingExtendedContext(
  bookId: BookId,
  pageNumber: number,
  selectedText: string,
  windowParagraphsCount: number = 2
): {
  fullExtendedContext: string;
  surroundingBefore: string;
  surroundingAfter: string;
  paragraphsCount: number;
} {
  const currPage = getPage(bookId, pageNumber);
  const pageText = currPage.text || selectedText;

  const allParas = pageText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const cleanSel = selectedText.trim().toLowerCase();
  let matchedIndex = allParas.findIndex((p) => p.toLowerCase().includes(cleanSel));

  if (matchedIndex === -1) {
    const shortPrefix = cleanSel.substring(0, Math.min(35, cleanSel.length));
    matchedIndex = allParas.findIndex((p) => p.toLowerCase().includes(shortPrefix));
  }

  if (matchedIndex === -1) {
    return {
      fullExtendedContext: pageText.slice(0, 1200),
      surroundingBefore: (allParas[0] || '').slice(0, 300),
      surroundingAfter: (allParas[allParas.length - 1] || '').slice(0, 300),
      paragraphsCount: allParas.length,
    };
  }

  const startIdx = Math.max(0, matchedIndex - windowParagraphsCount);
  const endIdx = Math.min(allParas.length, matchedIndex + windowParagraphsCount + 1);

  const beforeParas = allParas.slice(startIdx, matchedIndex);
  const afterParas = allParas.slice(matchedIndex + 1, endIdx);
  const windowParas = allParas.slice(startIdx, endIdx);

  return {
    fullExtendedContext: windowParas.join('\n\n').slice(0, 1500),
    surroundingBefore: beforeParas.join('\n\n').slice(0, 400),
    surroundingAfter: afterParas.join('\n\n').slice(0, 400),
    paragraphsCount: windowParas.length,
  };
}

export { BOOKS };
