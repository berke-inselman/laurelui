'use client';

import { useEffect, useId, useRef, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../lib/cx';
import { IconX } from '../lib/icons';

const subscribeNoop = () => () => {};
const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Başlığın solundaki simge */
  icon?: ReactNode;
  /** En fazla genişlik (px) */
  width?: number;
  children: ReactNode;
  footer?: ReactNode;
  /** Başlık ile kapat düğmesi arasındaki alan (ör. sayfalama) */
  headerExtra?: ReactNode;
  className?: string;
  /** Arka plana tıklayınca kapanma (varsayılan: açık) */
  dismissOnBackdrop?: boolean;
  closeLabel?: string;
  /** Açılınca odaklanacak öğe; verilmezse ilk odaklanabilir alan */
  initialFocus?: React.RefObject<HTMLElement | null>;
  style?: CSSProperties;
}

/**
 * Erişilebilir diyalog: portal, Esc ile kapanma, Tab döngüsü, kapanınca odağı geri verme.
 */
export function Dialog({
  open,
  onClose,
  title,
  subtitle,
  icon,
  width = 560,
  children,
  footer,
  headerExtra,
  className,
  dismissOnBackdrop = true,
  closeLabel = 'Kapat',
  initialFocus,
  style,
}: DialogProps) {
  // SSR ve hidrasyon sırasında false, istemcide true
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open || !mounted) return;
    const panel = panelRef.current;
    // Açan öğe: odak zaten diyalogdaysa (StrictMode'da efektin ikinci çalışması) önceki kayıt korunur
    const active = document.activeElement as HTMLElement | null;
    const previous = panel?.contains(active) ? restoreRef.current : active;
    restoreRef.current = previous;
    // autoFocus ile içeride bir alan zaten odaktaysa dokunma; değilse formun ilk alanına, o da yoksa diyaloga odaklan
    if (!panel?.contains(document.activeElement)) {
      const target = initialFocus?.current
        ?? panel?.querySelector<HTMLElement>('.lu-dialog-body ' + FOCUSABLE.split(', ').join(', .lu-dialog-body '))
        ?? panel;
      target?.focus({ preventScroll: true });
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // İç içe diyaloglarda yalnızca en üstteki kapanır
        const all = document.querySelectorAll('.lu-dialog');
        if (all[all.length - 1] === panel) {
          e.stopPropagation();
          onCloseRef.current();
        }
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      // Odağı bir sonraki turda geri ver: kapatan tuş (Enter / Esc) açan düğmeyi yeniden tetiklemesin
      // Yalnızca odak gerçekten kaybolduysa (diyalog kaldırıldı, odak body'ye düştü) geri ver
      window.setTimeout(() => {
        const lost = !document.activeElement || document.activeElement === document.body;
        if (lost && previous && document.contains(previous)) previous.focus({ preventScroll: true });
      }, 0);
    };
  }, [open, mounted, initialFocus]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="lu-dialog-backdrop"
      onMouseDown={(e) => {
        if (dismissOnBackdrop && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className={cx('lu-dialog', className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{ maxWidth: width, ...style }}
      >
        <header className="lu-dialog-header">
          <div className="lu-dialog-heading">
            {icon}
            <div style={{ minWidth: 0 }}>
              <h2 id={titleId} className="lu-dialog-title">{title}</h2>
              {subtitle && <p className="lu-dialog-subtitle">{subtitle}</p>}
            </div>
          </div>
          {headerExtra}
          <button type="button" className="lu-icon-btn lu-icon-btn--sm" onClick={onClose} aria-label={closeLabel} title={closeLabel}>
            <IconX size={17} />
          </button>
        </header>
        <div className="lu-dialog-body">{children}</div>
        {footer && <footer className="lu-dialog-footer">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
