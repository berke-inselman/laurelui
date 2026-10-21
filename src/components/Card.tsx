import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface CardStyleOptions {
  /** Üzerine gelince yükselir (tıklanabilir kart) */
  interactive?: boolean;
  /** Üst kenarda altın varak çizgi */
  gilded?: boolean;
  /** Gölgesiz */
  flat?: boolean;
  /** Çukur (iç dolgu rengi) */
  sunken?: boolean;
  /** Hafif mermer dokusu */
  grain?: boolean;
  /** Bu kartın içi her zaman gece (Nox) temasında */
  nox?: boolean;
  className?: string;
}

export function cardClass({ interactive, gilded, flat, sunken, grain, nox, className }: CardStyleOptions = {}) {
  return cx(
    'lu-card',
    interactive && 'lu-card--interactive',
    gilded && 'lu-card--gilded',
    flat && 'lu-card--flat',
    sunken && 'lu-card--sunken',
    grain && 'lu-grain',
    nox && 'lu-nox',
    className,
  );
}

type CardProps<T extends ElementType> = CardStyleOptions & {
  as?: T;
} & Omit<ComponentPropsWithRef<T>, 'as' | 'className'>;

export function Card<T extends ElementType = 'div'>({ as, interactive, gilded, flat, sunken, grain, nox, className, ...rest }: CardProps<T>) {
  const Tag: ElementType = as ?? 'div';
  return <Tag className={cardClass({ interactive, gilded, flat, sunken, grain, nox, className })} {...rest} />;
}

export function CardHeader({
  title,
  subtitle,
  actions,
  icon,
  className,
  children,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cx('lu-card-header', className)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', minWidth: 0 }}>
        {icon}
        <div style={{ minWidth: 0 }}>
          {title && <h3 className="lu-card-title">{title}</h3>}
          {subtitle && <p className="lu-card-subtitle">{subtitle}</p>}
          {children}
        </div>
      </div>
      {actions && <div className="lu-row">{actions}</div>}
    </div>
  );
}

export function CardBody({ className, ...rest }: ComponentPropsWithRef<'div'>) {
  return <div className={cx('lu-card-body', className)} {...rest} />;
}

export function CardFooter({ className, ...rest }: ComponentPropsWithRef<'div'>) {
  return <div className={cx('lu-card-footer', className)} {...rest} />;
}
