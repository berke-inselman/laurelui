'use client';

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../lib/cx';

interface MenuCtx {
  close: () => void;
}
const MenuContext = createContext<MenuCtx | null>(null);

export interface MenuTriggerProps {
  onClick: () => void;
  'aria-haspopup': 'menu';
  'aria-expanded': boolean;
  'aria-controls': string;
}

export interface MenuProps {
  /** Tetikleyici: verilen özellikleri kendi düğmenize yayın */
  trigger: (props: MenuTriggerProps) => ReactNode;
  children: ReactNode;
  align?: 'start' | 'end';
  width?: number;
  className?: string;
}

/**
 * Açılır menü: dışarı tıklayınca / Esc ile kapanır, ↑ ↓ Home End ile gezinilir.
 */
export function Menu({ trigger, children, align = 'end', width, className }: MenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('.lu-menu-item:not(:disabled)') ?? []);
      const index = items.indexOf(document.activeElement as HTMLElement);
      if (e.key === 'Escape') {
        setOpen(false);
        (rootRef.current?.querySelector('[aria-haspopup="menu"]') as HTMLElement | null)?.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[(index + 1) % items.length]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[(index - 1 + items.length) % items.length]?.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        items[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        items[items.length - 1]?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const panelStyle: CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    [align === 'end' ? 'right' : 'left']: 0,
    zIndex: 60,
    width,
    transformOrigin: align === 'end' ? 'top right' : 'top left',
  };

  return (
    <MenuContext.Provider value={{ close }}>
      <div ref={rootRef} className={cx('lu-menu-root', className)} style={{ position: 'relative', display: 'inline-flex' }}>
        {trigger({ onClick: () => setOpen((o) => !o), 'aria-haspopup': 'menu', 'aria-expanded': open, 'aria-controls': id })}
        {open && (
          <div ref={panelRef} id={id} className="lu-menu" role="menu" style={panelStyle}>
            {children}
          </div>
        )}
      </div>
    </MenuContext.Provider>
  );
}

export interface MenuItemProps {
  children: ReactNode;
  icon?: ReactNode;
  onSelect?: () => void;
  danger?: boolean;
  disabled?: boolean;
  /** Sağda kısayol / açıklama */
  hint?: ReactNode;
  /** Seçince menü açık kalsın */
  keepOpen?: boolean;
}

export function MenuItem({ children, icon, onSelect, danger, disabled, hint, keepOpen }: MenuItemProps) {
  const ctx = useContext(MenuContext);
  return (
    <button
      type="button"
      role="menuitem"
      className={cx('lu-menu-item', danger && 'lu-menu-item--danger')}
      disabled={disabled}
      onClick={() => {
        onSelect?.();
        if (!keepOpen) ctx?.close();
      }}
    >
      {icon}
      <span style={{ flex: 1 }}>{children}</span>
      {hint && <span className="lu-hint">{hint}</span>}
    </button>
  );
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return <div className="lu-menu-label">{children}</div>;
}

export function MenuSeparator() {
  return <div className="lu-menu-sep" role="separator" />;
}
