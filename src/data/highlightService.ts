import { BookId, HighlightColor, TextHighlight } from '../types';
import { addHighlightAsFlashcard } from './vocabularyService';

export const HIGHLIGHT_COLORS: HighlightColor[] = [
  {
    id: 'yellow',
    name: 'Jaune Fluo',
    nameArabic: 'أصفر كلاسيكي',
    bgLight: 'rgba(254, 240, 138, 0.65)',
    bgDark: 'rgba(202, 138, 4, 0.35)',
    borderLight: '#fde047',
    borderDark: '#ca8a04',
    textLight: '#713f12',
    textDark: '#fef08a',
    hex: '#fef08a',
  },
  {
    id: 'emerald',
    name: 'Vert Pastel',
    nameArabic: 'أخضر زمردي',
    bgLight: 'rgba(187, 247, 208, 0.70)',
    bgDark: 'rgba(22, 101, 52, 0.40)',
    borderLight: '#86efac',
    borderDark: '#15803d',
    textLight: '#14532d',
    textDark: '#bbf7d0',
    hex: '#bbf7d0',
  },
  {
    id: 'sky',
    name: 'Bleu Ciel',
    nameArabic: 'أزرق سماوي',
    bgLight: 'rgba(186, 230, 253, 0.75)',
    bgDark: 'rgba(7, 89, 133, 0.40)',
    borderLight: '#7dd3fc',
    borderDark: '#0284c7',
    textLight: '#0c4a6e',
    textDark: '#bae6fd',
    hex: '#bae6fd',
  },
  {
    id: 'pink',
    name: 'Rose Vif',
    nameArabic: 'وردي لطيف',
    bgLight: 'rgba(251, 207, 232, 0.70)',
    bgDark: 'rgba(157, 23, 77, 0.40)',
    borderLight: '#f472b6',
    borderDark: '#db2777',
    textLight: '#831843',
    textDark: '#fbcfe8',
    hex: '#fbcfe8',
  },
  {
    id: 'orange',
    name: 'Orange Pêche',
    nameArabic: 'برتقالي دافئ',
    bgLight: 'rgba(254, 215, 170, 0.75)',
    bgDark: 'rgba(154, 52, 18, 0.40)',
    borderLight: '#fdba74',
    borderDark: '#ea580c',
    textLight: '#7c2d12',
    textDark: '#fed7aa',
    hex: '#fed7aa',
  },
  {
    id: 'purple',
    name: 'Violet Lavande',
    nameArabic: 'بنفسجي لافندر',
    bgLight: 'rgba(233, 213, 255, 0.70)',
    bgDark: 'rgba(107, 33, 168, 0.40)',
    borderLight: '#d8b4fe',
    borderDark: '#9333ea',
    textLight: '#581c87',
    textDark: '#e9d5ff',
    hex: '#e9d5ff',
  },
];

const STORAGE_PREFIX = 'novel_highlights_';

// Event dispatch for reactivity across components
const HIGHLIGHTS_UPDATED_EVENT = 'novel_highlights_updated';

function getStorageKey(bookId: BookId): string {
  return `${STORAGE_PREFIX}${bookId}`;
}

export function getAllHighlights(bookId: BookId): TextHighlight[] {
  try {
    const raw = localStorage.getItem(getStorageKey(bookId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Error reading highlights from localStorage:', err);
    return [];
  }
}

export function getPageHighlights(bookId: BookId, pageNumber: number): TextHighlight[] {
  const all = getAllHighlights(bookId);
  return all.filter((h) => h.pageNumber === pageNumber);
}

function saveHighlights(bookId: BookId, highlights: TextHighlight[]): void {
  try {
    localStorage.setItem(getStorageKey(bookId), JSON.stringify(highlights));
    window.dispatchEvent(new CustomEvent(HIGHLIGHTS_UPDATED_EVENT, { detail: { bookId } }));
  } catch (err) {
    console.warn('Error saving highlights to localStorage:', err);
  }
}

export function addHighlight(
  bookId: BookId,
  pageNumber: number,
  text: string,
  colorId: string = 'yellow',
  customColorHex?: string,
  note?: string
): TextHighlight {
  const cleanText = text.trim();
  const all = getAllHighlights(bookId);

  // Check if identical highlight exists on this page
  const existingIndex = all.findIndex(
    (h) => h.pageNumber === pageNumber && h.text.trim() === cleanText
  );

  const newHighlight: TextHighlight = {
    id: existingIndex >= 0 ? all[existingIndex].id : `hl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    bookId,
    pageNumber,
    text: cleanText,
    colorId,
    customColorHex,
    createdAt: Date.now(),
    note: note || (existingIndex >= 0 ? all[existingIndex].note : undefined),
  };

  let updatedList: TextHighlight[];
  if (existingIndex >= 0) {
    updatedList = [...all];
    updatedList[existingIndex] = newHighlight;
  } else {
    updatedList = [newHighlight, ...all];
  }

  saveHighlights(bookId, updatedList);

  // Automatically add/sync this highlight into Vocabulary & Flashcards system
  try {
    addHighlightAsFlashcard(bookId, pageNumber, cleanText, newHighlight.note);
  } catch (e) {
    // Ignore sync errors
  }

  return newHighlight;
}

export function updateHighlight(
  bookId: BookId,
  id: string,
  updates: Partial<Pick<TextHighlight, 'colorId' | 'customColorHex' | 'note'>>
): TextHighlight | null {
  const all = getAllHighlights(bookId);
  const idx = all.findIndex((h) => h.id === id);
  if (idx === -1) return null;

  const updated: TextHighlight = {
    ...all[idx],
    ...updates,
  };

  const updatedList = [...all];
  updatedList[idx] = updated;
  saveHighlights(bookId, updatedList);
  return updated;
}

export function deleteHighlight(bookId: BookId, id: string): void {
  const all = getAllHighlights(bookId);
  const filtered = all.filter((h) => h.id !== id);
  saveHighlights(bookId, filtered);
}

export function clearPageHighlights(bookId: BookId, pageNumber: number): void {
  const all = getAllHighlights(bookId);
  const filtered = all.filter((h) => h.pageNumber !== pageNumber);
  saveHighlights(bookId, filtered);
}

export function clearAllHighlights(bookId: BookId): void {
  saveHighlights(bookId, []);
}

export function subscribeToHighlights(
  bookId: BookId,
  callback: (highlights: TextHighlight[]) => void
): () => void {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent;
    if (!customEvent.detail || customEvent.detail.bookId === bookId) {
      callback(getAllHighlights(bookId));
    }
  };

  window.addEventListener(HIGHLIGHTS_UPDATED_EVENT, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(HIGHLIGHTS_UPDATED_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
