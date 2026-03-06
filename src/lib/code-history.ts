// Kod Tarama Geçmişi - localStorage yönetimi
import { createLogger } from './logger';

const codeHistoryLogger = createLogger('CODE_HISTORY');

export interface CodeHistoryItem {
  code: string;
  title: string;
  viewedAt: string;
  severity?: string;
}

const HISTORY_KEY = 'obd_code_history';
const MAX_HISTORY_ITEMS = 20;

// Geçmişi getir
export function getCodeHistory(): CodeHistoryItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// Geçmişe ekle
export function addToCodeHistory(item: Omit<CodeHistoryItem, 'viewedAt'>): void {
  if (typeof window === 'undefined') return;

  try {
    const history = getCodeHistory();

    // Aynı kod varsa çıkar
    const filteredHistory = history.filter(h => h.code.toUpperCase() !== item.code.toUpperCase());

    // Yeni öğeyi en başa ekle
    const newItem: CodeHistoryItem = {
      ...item,
      viewedAt: new Date().toISOString()
    };

    const newHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    codeHistoryLogger.error({ error }, 'Failed to save code history');
  }
}

// Tek öğe sil
export function removeFromCodeHistory(code: string): void {
  if (typeof window === 'undefined') return;

  try {
    const history = getCodeHistory();
    const newHistory = history.filter(h => h.code.toUpperCase() !== code.toUpperCase());
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    codeHistoryLogger.error({ error, code }, 'Failed to remove from code history');
  }
}

// Tüm geçmişi temizle
export function clearCodeHistory(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    codeHistoryLogger.error({ error }, 'Failed to clear code history');
  }
}

// Geçmişte var mı kontrol et
export function isInCodeHistory(code: string): boolean {
  const history = getCodeHistory();
  return history.some(h => h.code.toUpperCase() === code.toUpperCase());
}

// Geçmiş sayısını getir
export function getCodeHistoryCount(): number {
  return getCodeHistory().length;
}
