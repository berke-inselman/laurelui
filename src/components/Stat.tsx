import type { ReactNode } from 'react';
import Link from 'next/link';
import { cx } from '../lib/cx';
import { toRoman } from '../lib/roman';
import { IconArrowDown, IconArrowUp } from '../lib/icons';

export interface StatProps {
  label: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
  /** Köşedeki soluk Roma rakamı (sayı verilirse çevrilir: 3 → III) */
  numeral?: number | string;
  delta?: { value: ReactNode; direction: 'up' | 'down' | 'flat' };
  foot?: ReactNode;
  /** Verilirse kart tıklanabilir bir bağlantı olur */
  href?: string;
  gilded?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Delta({ value, direction }: { value: ReactNode; direction: 'up' | 'down' | 'flat' }) {
  return (
    <span className={cx('lu-delta', direction !== 'flat' && `lu-delta--${direction}`)}>
      {direction === 'up' && <IconArrowUp size={12} />}
      {direction === 'down' && <IconArrowDown size={12} />}
      {value}
    </span>
  );
}

export function Stat({ label, value, icon, numeral, delta, foot, href, gilded, className, children }: StatProps) {
  const cls = cx('lu-card lu-stat', href && 'lu-card--interactive', gilded && 'lu-card--gilded', className);
  const body = (
    <>
      {numeral !== undefined && (
        <span className="lu-stat-numeral" aria-hidden="true">
          {typeof numeral === 'number' ? toRoman(numeral) : numeral}
        </span>
      )}
      <span className="lu-stat-label">
        {icon && <span className="lu-stat-icon">{icon}</span>}
        {label}
      </span>
      <span className="lu-row" style={{ justifyContent: 'space-between' }}>
        <span className="lu-stat-value">{value}</span>
        {delta && <Delta {...delta} />}
      </span>
      {children}
      {foot && <span className="lu-stat-foot">{foot}</span>}
    </>
  );
  return href ? (
    <Link href={href} className={cls}>{body}</Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}
