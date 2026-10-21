'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { cx } from '../lib/cx';
import { IconAlert, IconHelp } from '../lib/icons';

export interface ConfirmOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  tone?: 'danger' | 'default';
  /** Onay için kullanıcının yazması gereken metin (ör. "SİL") */
  requireText?: string;
}

interface ConfirmRequest extends ConfirmOptions {
  id: number;
  message: string;
  resolve: (value: boolean) => void;
}

let current: ConfirmRequest | null = null;
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/**
 * window.confirm yerine: await confirmDialog('Silinsin mi?', { tone: 'danger' })
 * Ekranda <ConfirmHost /> bulunmalıdır.
 */
export function confirmDialog(message: string, options: ConfirmOptions = {}): Promise<boolean> {
  current?.resolve(false);
  return new Promise((resolve) => {
    current = { id: nextId++, message, resolve, ...options };
    emit();
  });
}

function settle(value: boolean) {
  if (!current) return;
  current.resolve(value);
  current = null;
  emit();
}

const upper = (s: string) => s.trim().toLocaleUpperCase('tr-TR');

function ConfirmPanel({ req }: { req: ConfirmRequest }) {
  const danger = req.tone === 'danger';
  const [typed, setTyped] = useState('');
  const confirmRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const matches = !req.requireText || upper(typed) === upper(req.requireText);

  useEffect(() => {
    // Açan öğe: odak zaten penceredeyse (StrictMode'da efektin ikinci çalışması) önceki kayıt korunur
    const active = document.activeElement as HTMLElement | null;
    const previous = panelRef.current?.contains(active) ? restoreRef.current : active;
    restoreRef.current = previous;
    (req.requireText ? inputRef.current : confirmRef.current)?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        settle(false);
      }
    };
    // Yakalama aşamasında: alttaki diyalogun Esc dinleyicisinden önce çalışır
    window.addEventListener('keydown', onKey, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      // Odağı bir sonraki turda geri ver: kapatan tuş olayı açan düğmeye ulaşmasın
      // Yalnızca odak gerçekten kaybolduysa (pencere kaldırıldı, odak body'ye düştü) geri ver
      window.setTimeout(() => {
        const lost = !document.activeElement || document.activeElement === document.body;
        if (lost && previous && document.contains(previous)) previous.focus({ preventScroll: true });
      }, 0);
    };
  }, [req.requireText]);

  const Icon = danger ? IconAlert : IconHelp;
  return (
    <div className="lu-dialog-backdrop lu-confirm-backdrop" onMouseDown={(e) => e.target === e.currentTarget && settle(false)}>
      <div ref={panelRef} className={cx('lu-dialog lu-confirm', danger && 'lu-confirm--danger')} role="alertdialog" aria-modal="true" aria-labelledby={titleId}>
        <span className="lu-confirm-icon"><Icon size={22} /></span>
        <h3 id={titleId} className="lu-confirm-title">{req.title ?? (danger ? 'Emin misiniz?' : 'Onaylıyor musunuz?')}</h3>
        <p className="lu-confirm-message">{req.message}</p>
        {req.requireText && (
          <input
            ref={inputRef}
            className="lu-input lu-confirm-input"
            placeholder={`Onaylamak için "${req.requireText}" yazın`}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && matches) {
                // Aynı Enter, odak geri döndüğünde açan düğmeyi yeniden tetiklemesin
                e.preventDefault();
                settle(true);
              }
            }}
          />
        )}
        <div className="lu-confirm-actions">
          <button type="button" className="lu-btn lu-btn--outline" onClick={() => settle(false)}>
            {req.cancelText ?? 'Vazgeç'}
          </button>
          <button
            ref={confirmRef}
            type="button"
            className={cx('lu-btn', danger ? 'lu-btn--danger' : 'lu-btn--primary')}
            disabled={!matches}
            onClick={() => settle(true)}
          >
            {req.confirmText ?? (danger ? 'Evet, sil' : 'Onayla')}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Kök layout'a bir kez yerleştirin. */
export function ConfirmHost() {
  const req = useSyncExternalStore(subscribe, () => current, () => null);
  if (!req) return null;
  return <ConfirmPanel key={req.id} req={req} />;
}
