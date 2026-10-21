import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../lib/cx';
import { Spinner } from './Feedback';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'gold'
  | 'danger'
  | 'success'
  | 'warning'
  | 'danger-outline'
  | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  /** Kare, yalnızca simgeli düğme */
  iconOnly?: boolean;
  active?: boolean;
  className?: string;
}

/**
 * Düğme sınıflarını üretir. Bağlantıları (next/link) düğme gibi göstermek için:
 * <Link href="/x" className={buttonClass({ variant: 'primary' })}>…</Link>
 */
export function buttonClass({ variant = 'outline', size = 'md', block, iconOnly, active, className }: ButtonStyleOptions = {}) {
  return cx(
    'lu-btn',
    `lu-btn--${variant}`,
    size !== 'md' && `lu-btn--${size}`,
    block && 'lu-btn--block',
    iconOnly && 'lu-btn--icon',
    active && 'is-active',
    className,
  );
}

export interface ButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'className'>, ButtonStyleOptions {
  /** İşlem sürerken döner halka gösterir ve düğmeyi kilitler */
  loading?: boolean;
  /** Metnin solundaki simge */
  icon?: ReactNode;
  /** Metnin sağındaki simge */
  trailingIcon?: ReactNode;
}

export function Button({
  variant,
  size,
  block,
  iconOnly,
  active,
  className,
  loading = false,
  icon,
  trailingIcon,
  disabled,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClass({ variant, size, block, iconOnly, active, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner size={size === 'lg' ? 18 : 15} /> : icon}
      {children}
      {!loading && trailingIcon}
    </button>
  );
}

export type IconButtonVariant = 'ghost' | 'outline' | 'danger';
export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'aria-label'> {
  /** Ekran okuyucu ve ipucu metni (zorunlu) */
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

export function iconButtonClass({ variant = 'ghost', size = 'md', className }: { variant?: IconButtonVariant; size?: IconButtonSize; className?: string } = {}) {
  return cx('lu-icon-btn', variant !== 'ghost' && `lu-icon-btn--${variant}`, size !== 'md' && `lu-icon-btn--${size}`, className);
}

export function IconButton({ label, variant, size, className, type = 'button', title, children, ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={title ?? label}
      className={iconButtonClass({ variant, size, className })}
      {...rest}
    >
      {children}
    </button>
  );
}
