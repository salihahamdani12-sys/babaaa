import { BookId, BookmarkItem } from '../types';

const STORAGE_KEY = 'bac1_study_bookmarked_pages';

let memoryBookmarks: BookmarkItem[] = [];
let isInitialized = false;

function loadFromStorage(): BookmarkItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load bookmarks from localStorage:', e);
    return [];
  }
}

function saveToStorage(bookmarks: BookmarkItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (e) {
    console.error('Failed to save bookmarks to localStorage:', e);
  }
}

function notifyListeners() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bookmarks-changed'));
  }
}

function initIfNeeded() {
  if (!isInitialized) {
    memoryBookmarks = loadFromStorage();
    isInitialized = true;
  }
}

/**
 * Get all bookmarks, optionally filtered by bookId
 */
export function getBookmarks(bookId?: BookId): BookmarkItem[] {
  initIfNeeded();
  if (!bookId) {
    return [...memoryBookmarks].sort((a, b) => b.createdAt - a.createdAt);
  }
  return memoryBookmarks
    .filter((b) => b.bookId === bookId)
    .sort((a, b) => a.pageNumber - b.pageNumber);
}

/**
 * Check if a specific page of a book is bookmarked
 */
export function isPageBookmarked(bookId: BookId, pageNumber: number): boolean {
  initIfNeeded();
  return memoryBookmarks.some((b) => b.bookId === bookId && b.pageNumber === pageNumber);
}

/**
 * Toggle bookmark status for a page. Returns the new bookmarked state (true = added, false = removed).
 */
export function toggleBookmark(
  bookId: BookId,
  pageNumber: number,
  data?: {
    chapterTitle?: string;
    chapterTitleArabic?: string;
    snippet?: string;
    arabicSummary?: string;
    note?: string;
  }
): boolean {
  initIfNeeded();
  const exists = memoryBookmarks.some((b) => b.bookId === bookId && b.pageNumber === pageNumber);

  if (exists) {
    memoryBookmarks = memoryBookmarks.filter((b) => !(b.bookId === bookId && b.pageNumber === pageNumber));
    saveToStorage(memoryBookmarks);
    notifyListeners();
    return false;
  } else {
    const newBookmark: BookmarkItem = {
      bookId,
      pageNumber,
      createdAt: Date.now(),
      chapterTitle: data?.chapterTitle,
      chapterTitleArabic: data?.chapterTitleArabic,
      snippet: data?.snippet ? data.snippet.slice(0, 280) : undefined,
      arabicSummary: data?.arabicSummary ? data.arabicSummary.slice(0, 200) : undefined,
      note: data?.note,
    };
    memoryBookmarks.push(newBookmark);
    saveToStorage(memoryBookmarks);
    notifyListeners();
    return true;
  }
}

/**
 * Remove a bookmark
 */
export function removeBookmark(bookId: BookId, pageNumber: number): void {
  initIfNeeded();
  memoryBookmarks = memoryBookmarks.filter((b) => !(b.bookId === bookId && b.pageNumber === pageNumber));
  saveToStorage(memoryBookmarks);
  notifyListeners();
}

/**
 * Update note for a bookmark
 */
export function updateBookmarkNote(bookId: BookId, pageNumber: number, note: string): void {
  initIfNeeded();
  const target = memoryBookmarks.find((b) => b.bookId === bookId && b.pageNumber === pageNumber);
  if (target) {
    target.note = note.trim() || undefined;
    saveToStorage(memoryBookmarks);
    notifyListeners();
  }
}

/**
 * Subscribe to bookmark change events
 */
export function subscribeToBookmarks(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      memoryBookmarks = loadFromStorage();
      listener();
    }
  };

  const handleCustom = () => {
    listener();
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener('bookmarks-changed', handleCustom);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('bookmarks-changed', handleCustom);
  };
}
