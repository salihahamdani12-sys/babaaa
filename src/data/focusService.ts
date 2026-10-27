import { BookId, FocusSessionState, DayFocusHistory } from '../types';

const STORAGE_KEY = 'bac1_study_focus_session_data_v1';

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const DEFAULT_STATE: FocusSessionState = {
  dailyGoalMinutes: 20,
  todaySeconds: 0,
  todayDate: getTodayString(),
  pageSecondsMap: {},
  streakDays: 1,
  lastActiveDate: getTodayString(),
  history: [],
  isTimerRunning: true,
  activeSessionMode: 'stopwatch',
  pomodoroDurationMinutes: 25,
  pomodoroSecondsRemaining: 25 * 60,
  soundEnabled: true,
};

let currentState: FocusSessionState = { ...DEFAULT_STATE };
let isInitialized = false;
let timerInterval: any = null;
let currentActiveBook: BookId = 'la_boite_a_merveilles';
let currentActivePage: number = 1;

// Web Audio API Chime Synth
export function playChimeSound(type: 'success' | 'milestone' | 'tick' | 'start') {
  if (!currentState.soundEnabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'success' || type === 'milestone') {
      // Pleasant Major Triad Chime
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.85);
      });
    } else if (type === 'start') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (e) {
    // AudioContext might be restricted until user gesture
  }
}

function loadState(): FocusSessionState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    const today = getTodayString();

    // Check if day changed
    if (parsed.todayDate !== today) {
      // Archive previous day into history
      const prevDate = parsed.todayDate;
      const prevSeconds = parsed.todaySeconds || 0;
      const prevGoal = parsed.dailyGoalMinutes || 20;
      const prevReached = prevSeconds >= prevGoal * 60;

      const updatedHistory: DayFocusHistory[] = parsed.history || [];
      if (prevDate && prevSeconds > 0 && !updatedHistory.some((h) => h.date === prevDate)) {
        updatedHistory.unshift({
          date: prevDate,
          totalSeconds: prevSeconds,
          goalMinutes: prevGoal,
          goalReached: prevReached,
          pagesVisited: Object.keys(parsed.pageSecondsMap || {}).length,
        });
      }

      // Calculate streak
      const yesterday = getYesterdayString();
      let newStreak = parsed.streakDays || 1;
      if (parsed.lastActiveDate === yesterday && prevReached) {
        newStreak += 1;
      } else if (parsed.lastActiveDate !== yesterday && parsed.lastActiveDate !== today) {
        newStreak = 1;
      }

      return {
        ...parsed,
        todayDate: today,
        todaySeconds: 0,
        streakDays: newStreak,
        history: updatedHistory.slice(0, 30),
        isTimerRunning: true,
        pomodoroSecondsRemaining: (parsed.pomodoroDurationMinutes || 25) * 60,
      };
    }

    return {
      ...DEFAULT_STATE,
      ...parsed,
      todayDate: today,
    };
  } catch (e) {
    console.error('Failed to parse focus session state:', e);
    return DEFAULT_STATE;
  }
}

function saveState() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
  } catch (e) {
    console.error('Failed to save focus session state:', e);
  }
}

function notifySubscribers() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('focus-session-updated', {
        detail: { ...currentState },
      })
    );
  }
}

export function initFocusServiceIfNeeded() {
  if (isInitialized) return;
  isInitialized = true;
  currentState = loadState();

  // Setup heartbeat interval (every 1 second)
  if (typeof window !== 'undefined') {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      // If timer is running and page is visible, increment seconds
      if (currentState.isTimerRunning && typeof document !== 'undefined' && document.visibilityState === 'visible') {
        incrementFocusTime(1);
      }
    }, 1000);

    // Visibility listener: auto pause / resume gracefully
    document.addEventListener('visibilitychange', () => {
      notifySubscribers();
    });
  }
}

function incrementFocusTime(deltaSeconds: number = 1) {
  const today = getTodayString();
  if (currentState.todayDate !== today) {
    currentState = loadState();
  }

  const prevSeconds = currentState.todaySeconds;
  const newTodaySeconds = prevSeconds + deltaSeconds;
  const goalSeconds = currentState.dailyGoalMinutes * 60;

  // Check if daily goal was just reached
  const wasGoalReached = prevSeconds >= goalSeconds;
  const isGoalReachedNow = newTodaySeconds >= goalSeconds;
  if (!wasGoalReached && isGoalReachedNow) {
    playChimeSound('success');
  }

  // Update specific page time
  const pageKey = `${currentActiveBook}_${currentActivePage}`;
  const currentPageSeconds = (currentState.pageSecondsMap[pageKey] || 0) + deltaSeconds;
  const updatedPageMap = {
    ...currentState.pageSecondsMap,
    [pageKey]: currentPageSeconds,
  };

  // Update Pomodoro countdown if active
  let newPomodoroSecs = currentState.pomodoroSecondsRemaining;
  if (currentState.activeSessionMode === 'pomodoro') {
    newPomodoroSecs = Math.max(0, newPomodoroSecs - deltaSeconds);
    if (newPomodoroSecs === 0 && currentState.pomodoroSecondsRemaining > 0) {
      playChimeSound('milestone');
    }
  }

  currentState = {
    ...currentState,
    todaySeconds: newTodaySeconds,
    pageSecondsMap: updatedPageMap,
    lastActiveDate: today,
    pomodoroSecondsRemaining: newPomodoroSecs,
  };

  // Throttle save to storage every 5 seconds to reduce I/O
  if (newTodaySeconds % 5 === 0) {
    saveState();
  }
  notifySubscribers();
}

/**
 * Set the currently active book and page being read
 */
export function setActiveReadingPage(bookId: BookId, pageNumber: number) {
  initFocusServiceIfNeeded();
  currentActiveBook = bookId;
  currentActivePage = pageNumber;
  notifySubscribers();
}

/**
 * Get current focus session state
 */
export function getFocusSessionState(): FocusSessionState {
  initFocusServiceIfNeeded();
  return { ...currentState };
}

/**
 * Get time in seconds spent on a specific page of a book
 */
export function getPageReadingSeconds(bookId: BookId, pageNumber: number): number {
  initFocusServiceIfNeeded();
  const pageKey = `${bookId}_${pageNumber}`;
  return currentState.pageSecondsMap[pageKey] || 0;
}

/**
 * Toggle timer running state (Play / Pause)
 */
export function toggleFocusTimer(): boolean {
  initFocusServiceIfNeeded();
  currentState = {
    ...currentState,
    isTimerRunning: !currentState.isTimerRunning,
  };
  saveState();
  notifySubscribers();
  if (currentState.isTimerRunning) {
    playChimeSound('start');
  }
  return currentState.isTimerRunning;
}

/**
 * Set timer state directly
 */
export function setFocusTimerRunning(running: boolean) {
  initFocusServiceIfNeeded();
  if (currentState.isTimerRunning !== running) {
    currentState = {
      ...currentState,
      isTimerRunning: running,
    };
    saveState();
    notifySubscribers();
  }
}

/**
 * Update daily reading goal in minutes
 */
export function setDailyReadingGoalMinutes(minutes: number) {
  initFocusServiceIfNeeded();
  const validMinutes = Math.max(1, Math.min(300, Math.round(minutes)));
  currentState = {
    ...currentState,
    dailyGoalMinutes: validMinutes,
  };
  saveState();
  notifySubscribers();
}

/**
 * Set Active Focus Session Mode: Stopwatch or Pomodoro
 */
export function setFocusMode(mode: 'stopwatch' | 'pomodoro', pomodoroDurationMinutes: number = 25) {
  initFocusServiceIfNeeded();
  currentState = {
    ...currentState,
    activeSessionMode: mode,
    pomodoroDurationMinutes,
    pomodoroSecondsRemaining: pomodoroDurationMinutes * 60,
  };
  saveState();
  notifySubscribers();
}

/**
 * Reset today's Pomodoro block
 */
export function resetPomodoro() {
  initFocusServiceIfNeeded();
  currentState = {
    ...currentState,
    pomodoroSecondsRemaining: currentState.pomodoroDurationMinutes * 60,
  };
  saveState();
  notifySubscribers();
}

/**
 * Toggle sound effects
 */
export function toggleFocusSound(): boolean {
  initFocusServiceIfNeeded();
  currentState = {
    ...currentState,
    soundEnabled: !currentState.soundEnabled,
  };
  saveState();
  notifySubscribers();
  return currentState.soundEnabled;
}

/**
 * Reset current page timer
 */
export function resetCurrentPageTimer(bookId: BookId, pageNumber: number) {
  initFocusServiceIfNeeded();
  const pageKey = `${bookId}_${pageNumber}`;
  const updated = { ...currentState.pageSecondsMap };
  delete updated[pageKey];
  currentState = {
    ...currentState,
    pageSecondsMap: updated,
  };
  saveState();
  notifySubscribers();
}

/**
 * Reset total session timer (today's reading time)
 */
export function resetTotalSessionTimer() {
  initFocusServiceIfNeeded();
  currentState = {
    ...currentState,
    todaySeconds: 0,
    pageSecondsMap: {},
    pomodoroSecondsRemaining: currentState.pomodoroDurationMinutes * 60,
  };
  saveState();
  notifySubscribers();
}

/**
 * Reset both page timer and session timer
 */
export function resetAllCurrentTimers(bookId?: BookId, pageNumber?: number) {
  initFocusServiceIfNeeded();
  const updatedMap = bookId && pageNumber ? { ...currentState.pageSecondsMap } : {};
  if (bookId && pageNumber) {
    delete updatedMap[`${bookId}_${pageNumber}`];
  }
  currentState = {
    ...currentState,
    todaySeconds: 0,
    pageSecondsMap: updatedMap,
    pomodoroSecondsRemaining: currentState.pomodoroDurationMinutes * 60,
  };
  saveState();
  notifySubscribers();
}

/**
 * Subscribe to Focus Session updates
 */
export function subscribeToFocusSession(callback: (state: FocusSessionState) => void): () => void {
  initFocusServiceIfNeeded();
  callback({ ...currentState });

  const handler = (e: any) => {
    callback(e.detail || { ...currentState });
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('focus-session-updated', handler);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus-session-updated', handler);
    }
  };
}

/**
 * Format seconds into a friendly Arabic / French human readable string
 * e.g., "14:25" or "14 د و 25 ث"
 */
export function formatFocusTime(totalSeconds: number, format: 'digital' | 'arabicShort' | 'arabicFull' = 'digital'): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (format === 'digital') {
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  if (format === 'arabicShort') {
    if (hours > 0) {
      return `${hours} س ${minutes} د`;
    }
    if (minutes > 0) {
      return `${minutes} د ${seconds} ث`;
    }
    return `${seconds} ث`;
  }

  if (format === 'arabicFull') {
    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours} ساعة`);
    if (minutes > 0) parts.push(`${minutes} دقيقة`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds} ثانية`);
    return parts.join(' و ');
  }

  return `${minutes} د`;
}
