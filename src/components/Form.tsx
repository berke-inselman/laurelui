import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../lib/cx';

/* ------------------------------------------------------------------ Field */

export interface FieldProps {
  label?: ReactNode;
  /** Etiketin bağlanacağı alanın id'si */
  htmlFor?: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, hint, error, required, className, children }: FieldProps) {
  return (
    <div className={cx('lu-field', className)}>
      {label && (
        <label className={cx('lu-label', required && 'lu-label-required')} htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {error ? <p className="lu-error-text" role="alert">{error}</p> : hint ? <p className="lu-hint">{hint}</p> : null}
    </div>
  );
}

export function Label({ className, required, ...rest }: ComponentPropsWithRef<'label'> & { required?: boolean }) {
  return <label className={cx('lu-label', required && 'lu-label-required', className)} {...rest} />;
}

/* ------------------------------------------------------- Input / Textarea */

export type ControlSize = 'sm' | 'md' | 'lg';

export function inputClass({ size = 'md', mono, num, className }: { size?: ControlSize; mono?: boolean; num?: boolean; className?: string } = {}) {
  return cx('lu-input', size !== 'md' && `lu-input--${size}`, mono && 'lu-input--mono', num && 'lu-input--num', className);
}

export interface InputProps extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
  size?: ControlSize;
  mono?: boolean;
  /** Sayısal: sağa yaslı, sabit genişlikli rakamlar */
  num?: boolean;
  invalid?: boolean;
  /** Soldaki simge */
  icon?: ReactNode;
  /** Sağdaki ek (ör. şifreyi göster düğmesi, birim) */
  affix?: ReactNode;
}

export function Input({ size, mono, num, invalid, icon, affix, className, ...rest }: InputProps) {
  const input = <input className={inputClass({ size, mono, num, className })} aria-invalid={invalid || undefined} {...rest} />;
  if (!icon && !affix) return input;
  return (
    <div className="lu-input-group">
      {icon && <span className="lu-input-icon" aria-hidden="true">{icon}</span>}
      {input}
      {affix && <span className="lu-input-affix">{affix}</span>}
    </div>
  );
}

export interface TextareaProps extends ComponentPropsWithRef<'textarea'> {
  invalid?: boolean;
  mono?: boolean;
}

export function Textarea({ invalid, mono, className, ...rest }: TextareaProps) {
  return <textarea className={inputClass({ mono, className })} aria-invalid={invalid || undefined} {...rest} />;
}

export interface SelectProps extends Omit<ComponentPropsWithRef<'select'>, 'size'> {
  size?: ControlSize;
  invalid?: boolean;
}

export function Select({ size, invalid, className, ...rest }: SelectProps) {
  return <select className={inputClass({ size, className })} aria-invalid={invalid || undefined} {...rest} />;
}

/* ------------------------------------------------------ Checkbox / Switch */

export interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> {
  label?: ReactNode;
  description?: ReactNode;
  /** Kenarlıklı, kart biçiminde seçenek */
  card?: boolean;
}

export function Checkbox({ label, description, card, className, ...rest }: CheckboxProps) {
  return (
    <label className={cx('lu-check', card && 'lu-check--card', className)}>
      <input type="checkbox" {...rest} />
      {(label || description) && (
        <span>
          {label}
          {description && <span className="lu-hint" style={{ display: 'block' }}>{description}</span>}
        </span>
      )}
    </label>
  );
}

export interface SwitchProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'role'> {
  label?: ReactNode;
}

export function Switch({ label, className, ...rest }: SwitchProps) {
  const control = <input type="checkbox" role="switch" className={cx('lu-switch', !label && className)} {...rest} />;
  if (!label) return control;
  return (
    <label className={cx('lu-check', className)} style={{ alignItems: 'center' }}>
      {control}
      <span>{label}</span>
    </label>
  );
}
