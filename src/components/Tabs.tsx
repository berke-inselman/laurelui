'use client';

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface TabItem<V extends string = string> {
  value: V;
  label: ReactNode;
  icon?: ReactNode;
  /** Etiketin yanında sayı / rozet */
  badge?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps<V extends string = string> {
  items: TabItem<V>[];
  value?: V;
  defaultValue?: V;
  onChange?: (value: V) => void;
  /** underline: altın alt çizgili sekmeler; segmented: bölümlü seçici */
  variant?: 'underline' | 'segmented';
  /** Bölümlü seçici tüm genişliği kaplasın */
  block?: boolean;
  label?: string;
  className?: string;
}

/**
 * Sekmeler: ← → Home End ile gezinme, kontrollü veya kontrolsüz kullanım.
 */
export function Tabs<V extends string = string>({
  items,
  value,
  defaultValue,
  onChange,
  variant = 'underline',
  block,
  label,
  className,
}: TabsProps<V>) {
  const [inner, setInner] = useState<V | undefined>(defaultValue ?? items[0]?.value);
  const current = value ?? inner;
  const listRef = useRef<HTMLDivElement>(null);

  const select = (v: V) => {
    if (value === undefined) setInner(v);
    onChange?.(v);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.filter((i) => !i.disabled);
    const idx = enabled.findIndex((i) => i.value === current);
    let next: TabItem<V> | undefined;
    if (e.key === 'ArrowRight') next = enabled[(idx + 1) % enabled.length];
    else if (e.key === 'ArrowLeft') next = enabled[(idx - 1 + enabled.length) % enabled.length];
    else if (e.key === 'Home') next = enabled[0];
    else if (e.key === 'End') next = enabled[enabled.length - 1];
    if (!next) return;
    e.preventDefault();
    select(next.value);
    listRef.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(next.value)}"]`)?.focus();
  };

  const segmented = variant === 'segmented';
  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      className={cx(segmented ? 'lu-segmented' : 'lu-tabs', segmented && block && 'lu-segmented--block', className)}
      onKeyDown={onKeyDown}
    >
      {items.map((item) => {
        const selected = item.value === current;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            data-value={item.value}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            disabled={item.disabled}
            className={segmented ? undefined : 'lu-tab'}
            onClick={() => select(item.value)}
          >
            {item.icon}
            {item.label}
            {item.badge}
          </button>
        );
      })}
    </div>
  );
}
