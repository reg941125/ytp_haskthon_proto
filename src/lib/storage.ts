import type { AppStorage } from "@/lib/types";

const STORAGE_KEY = "employa:v1";

const defaultStorage: AppStorage = {
  explore: {
    likedRoleIds: [],
    dislikedRoleIds: [],
  },
  dailyAnswers: {},
  planTodos: {},
  planWeekNotes: {},
  strike: {
    current: 0,
  },
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadStorage(): AppStorage {
  if (!canUseStorage()) return defaultStorage;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStorage;
    const parsed = JSON.parse(raw) as Partial<AppStorage>;
    return {
      ...defaultStorage,
      ...parsed,
      explore: { ...defaultStorage.explore, ...(parsed.explore ?? {}) },
      strike: { ...defaultStorage.strike, ...(parsed.strike ?? {}) },
      dailyAnswers: parsed.dailyAnswers ?? defaultStorage.dailyAnswers,
      planTodos: parsed.planTodos ?? defaultStorage.planTodos,
      planWeekNotes: parsed.planWeekNotes ?? defaultStorage.planWeekNotes,
    };
  } catch {
    return defaultStorage;
  }
}

export function saveStorage(next: AppStorage): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearStorage(): void {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function updateStorage(updater: (prev: AppStorage) => AppStorage): AppStorage {
  const prev = loadStorage();
  const next = updater(prev);
  saveStorage(next);
  return next;
}

