import { Fragment, type ReactNode } from 'react';
import Link from 'next/link';
import { cx } from '../lib/cx';

/* ------------------------------------------------------------- PageHeader */

export interface PageHeaderProps {
  title: ReactNode;
  /** Başlığın üstündeki altın küçük başlık (ör. bölüm adı) */
  eyebrow?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, eyebrow, subtitle, actions, className }: PageHeaderProps) {
  return (
    <header className={cx('lu-page-header', className)}>
      <div className="lu-page-header-main">
        {eyebrow && <p className="lu-eyebrow">{eyebrow}</p>}
        <h1 className="lu-page-title">{title}</h1>
        {subtitle && <p className="lu-page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="lu-page-actions">{actions}</div>}
    </header>
  );
}

export function SectionTitle({ children, icon, className, as: Tag = 'h2' }: { children: ReactNode; icon?: ReactNode; className?: string; as?: 'h2' | 'h3' | 'h4' | 'p' }) {
  return (
    <Tag className={cx('lu-section-title', className)}>
      {icon}
      {children}
    </Tag>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx('lu-eyebrow', className)}>{children}</p>;
}

/* ------------------------------------------------------------- Breadcrumb */

export interface Crumb {
  label: ReactNode;
  href?: string;
}

/** Latin kitabelerindeki gibi orta nokta (·) ayırıcılı gezinti izi */
export function Breadcrumb({ items, className, label = 'Konum' }: { items: Crumb[]; className?: string; label?: string }) {
  return (
    <nav className={cx('lu-breadcrumb', className)} aria-label={label}>
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={i}>
            {i > 0 && <span className="lu-breadcrumb-sep" aria-hidden="true">·</span>}
            {last || !c.href ? (
              <span aria-current={last ? 'page' : undefined}>{c.label}</span>
            ) : (
              <Link href={c.href}>{c.label}</Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}

/* ---------------------------------------------------------------- Tooltip */

/** Yalnızca CSS ile çalışan ipucu; istemci JavaScript'i gerektirmez. */
export function Tooltip({ content, children, placement = 'top', className }: { content: ReactNode; children: ReactNode; placement?: 'top' | 'bottom'; className?: string }) {
  return (
    <span className={cx('lu-tooltip', placement === 'bottom' && 'lu-tooltip--bottom', className)}>
      {children}
      <span className="lu-tooltip-bubble" role="tooltip">{content}</span>
    </span>
  );
}
