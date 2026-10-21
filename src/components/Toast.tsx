'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { cx } from '../lib/cx';
import { IconAlert, IconCircleCheck, IconCircleX, IconInfo, IconX } from '../lib/icons';

export type ToastTone = 'info' | 'success' | 'warning' | 'error';

export interface ToastOptions {
  tone?: ToastTone;
  /** Varsayılan başlık yerine */
  title?: string;
  /** Milisaniye; verilmezse metin uzunluğuna göre hesaplanır */
  duration?: number;
}

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
  title?: string;
  duration: number;
  leaving?: boolean;
}

let items: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const EMPTY: ToastItem[] = [];
const MAX_VISIBLE = 5;

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** Bildirim gösterir; kimliğini döndürür. Uygulamanın her yerinden (bileşen dışından da) çağrılabilir. */
export function showToast(message: string, { tone = 'info', title, duration }: ToastOptions = {}): number {
  const base = tone === 'error' ? 6500 : 4500;
  const ms = duration ?? Math.min(14000, base + Math.max(0, message.length - 80) * 35);
  const id = nextId++;
  items = [...items, { id, message, tone, title, duration: ms }].slice(-MAX_VISIBLE);
  emit();
  return id;
}

export function dismissToast(id: number) {
  items = items.map((t) => (t.id === id ? { ...t, leaving: true } : t));
  emit();
  window.setTimeout(() => {
    items = items.filter((t) => t.id !== id);
    emit();
  }, 240);
}

export const toast = {
  info: (message: string, o?: Omit<ToastOptions, 'tone'>) => showToast(message, { ...o, tone: 'info' }),
  success: (message: string, o?: Omit<ToastOptions, 'tone'>) => showToast(message, { ...o, tone: 'success' }),
  warning: (message: string, o?: Omit<ToastOptions, 'tone'>) => showToast(message, { ...o, tone: 'warning' }),
  error: (message: string, o?: Omit<ToastOptions, 'tone'>) => showToast(message, { ...o, tone: 'error' }),
};

const DEFAULT_TITLES: Record<ToastTone, string> = {
  success: 'Başarılı',
  error: 'Bir sorun oluştu',
  warning: 'Dikkat',
  info: 'Bilgi',
};

const ICONS = {
  success: IconCircleCheck,
  error: IconCircleX,
  warning: IconAlert,
  info: IconInfo,
};

function ToastCard({ item, titles, closeLabel }: { item: ToastItem; titles: Record<ToastTone, string>; closeLabel: string }) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(item.duration);
  const startedAt = useRef(0);

  // Üzerine gelince süre durur, ayrılınca kalan süreden devam eder
  useEffect(() => {
    if (paused || item.leaving) return;
    startedAt.current = Date.now();
    const timer = window.setTimeout(() => dismissToast(item.id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, item.id, item.leaving]);

  const Icon = ICONS[item.tone];
  return (
    <div
      className={cx('lu-toast', `lu-toast--${item.tone}`, item.leaving && 'is-leaving')}
      role={item.tone === 'error' ? 'alert' : 'status'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span className="lu-toast-icon"><Icon size={18} /></span>
      <div className="lu-toast-body">
        <p className="lu-toast-title">{item.title ?? titles[item.tone]}</p>
        <p className="lu-toast-message">{item.message}</p>
      </div>
      <button type="button" className="lu-toast-close" onClick={() => dismissToast(item.id)} aria-label={closeLabel}>
        <IconX size={14} />
      </button>
      <span
        className="lu-toast-progress"
        style={{ animationDuration: `${item.duration}ms`, animationPlayState: paused ? 'paused' : 'running' }}
      />
    </div>
  );
}

/** Kök layout'a bir kez yerleştirin. */
export function Toaster({ titles, closeLabel = 'Kapat', className }: { titles?: Partial<Record<ToastTone, string>>; closeLabel?: string; className?: string }) {
  const list = useSyncExternalStore(subscribe, () => items, () => EMPTY);
  const merged = { ...DEFAULT_TITLES, ...titles };
  return (
    <div className={cx('lu-toaster', className)} aria-live="polite">
      {list.map((item) => (
        <ToastCard key={item.id} item={item} titles={merged} closeLabel={closeLabel} />
      ))}
    </div>
  );
}
