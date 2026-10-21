import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../lib/cx';
import { IconAlert, IconCircleCheck, IconCircleX, IconInfo } from '../lib/icons';

/* ---------------------------------------------------------------- Spinner */

export function Spinner({ size = 18, gold, className, label }: { size?: number; gold?: boolean; className?: string; label?: string }) {
  return (
    <span
      className={cx('lu-spinner', gold && 'lu-spinner--gold', className)}
      style={{ '--_size': `${size}px` } as CSSProperties}
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}

/* --------------------------------------------------------------- Skeleton */

export function Skeleton({ width, height = 14, radius, className, style }: { width?: number | string; height?: number | string; radius?: number | string; className?: string; style?: CSSProperties }) {
  return <span className={cx('lu-skeleton', className)} style={{ width, height, borderRadius: radius, ...style }} aria-hidden="true" />;
}

/* --------------------------------------------------------------- Progress */

export type ProgressTone = 'accent' | 'gold' | 'success' | 'danger' | 'warning';

export function Progress({ value, max = 100, tone = 'accent', label, className, height }: { value?: number; max?: number; tone?: ProgressTone; label?: string; className?: string; height?: number }) {
  const indeterminate = value === undefined;
  const pct = indeterminate ? 0 : Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className={cx('lu-progress', tone !== 'accent' && `lu-progress--${tone}`, indeterminate && 'lu-progress--indeterminate', className)}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : value}
      style={{ height }}
    >
      <span style={{ '--value': `${pct}%` } as CSSProperties} />
    </div>
  );
}

/* ------------------------------------------------------------------ Alert */

export type AlertTone = 'accent' | 'success' | 'danger' | 'warning' | 'violet' | 'info' | 'gold';

const ALERT_ICONS: Partial<Record<AlertTone, typeof IconInfo>> = {
  success: IconCircleCheck,
  danger: IconCircleX,
  warning: IconAlert,
};

export function Alert({
  tone = 'accent',
  title,
  icon,
  children,
  className,
  role,
}: {
  tone?: AlertTone;
  title?: ReactNode;
  /** false: simge yok; verilmezse tona uygun simge */
  icon?: ReactNode | false;
  children?: ReactNode;
  className?: string;
  role?: 'alert' | 'status';
}) {
  const Fallback = ALERT_ICONS[tone] ?? IconInfo;
  return (
    <div className={cx('lu-alert', tone !== 'accent' && `lu-alert--${tone}`, className)} role={role}>
      {icon === false ? null : icon ?? <Fallback size={17} />}
      <div className="lu-alert-body">
        {title && <p className="lu-alert-title">{title}</p>}
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- EmptyState */

export function EmptyState({
  icon,
  title,
  children,
  actions,
  tone,
  className,
}: {
  icon?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  tone?: 'success';
  className?: string;
}) {
  return (
    <div className={cx('lu-empty', className)}>
      {icon && <span className={cx('lu-empty-icon', tone && `lu-empty-icon--${tone}`)}>{icon}</span>}
      <p className="lu-empty-title">{title}</p>
      {children && <p className="lu-empty-text">{children}</p>}
      {actions && <div className="lu-empty-actions">{actions}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------- Kbd */

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return <kbd className={className}>{children}</kbd>;
}
