import type { ComponentPropsWithRef } from 'react';
import { cx } from '../lib/cx';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'danger' | 'warning' | 'violet' | 'info' | 'gold';

export interface BadgeProps extends ComponentPropsWithRef<'span'> {
  tone?: BadgeTone;
  /** Başta küçük durum noktası */
  dot?: boolean;
  /** Dolu zemin */
  solid?: boolean;
  /** Kitabe harfleriyle (büyük harf, geniş aralık) */
  caps?: boolean;
}

export function badgeClass({ tone = 'neutral', dot, solid, caps, className }: Omit<BadgeProps, 'children'> = {}) {
  return cx('lu-badge', `lu-badge--${tone}`, dot && 'lu-badge--dot', solid && 'lu-badge--solid', caps && 'lu-badge--caps', className);
}

export function Badge({ tone, dot, solid, caps, className, ...rest }: BadgeProps) {
  return <span className={badgeClass({ tone, dot, solid, caps, className })} {...rest} />;
}

export function Chip({ tone, className, ...rest }: ComponentPropsWithRef<'span'> & { tone?: 'accent' | 'gold' }) {
  return <span className={cx('lu-chip', tone && `lu-chip--${tone}`, className)} {...rest} />;
}
