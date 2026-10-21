/**
 * Laurel-UI V1.0 — Antik Roma'dan esinlenen, Next.js (App Router) için React bileşen kütüphanesi.
 *
 * Bu dosya "use client" içermez: sunucu bileşenleri (Button, Card, Badge…) doğrudan
 * Server Component'lerde, etkileşimli olanlar (Dialog, Menu, Tabs, Toaster…) kendi
 * dosyalarındaki "use client" sınırıyla her yerde kullanılabilir.
 */

export const LAUREL_VERSION = '1.0.0';

// Yardımcılar
export { cx } from './lib/cx';
export { toRoman, fromRoman, romanYear } from './lib/roman';

// Tema
export { ThemeScript, themeScript, DEFAULT_THEME_KEY } from './theme/ThemeScript';
export type { ThemeName, ThemeScriptOptions } from './theme/ThemeScript';
export { ThemeProvider, useTheme } from './theme/ThemeProvider';
export type { ThemeProviderProps, PointerOrigin } from './theme/ThemeProvider';

// Sunucu uyumlu bileşenler
export { Button, IconButton, buttonClass, iconButtonClass } from './components/Button';
export type { ButtonProps, ButtonVariant, ButtonSize, IconButtonProps, IconButtonVariant, IconButtonSize } from './components/Button';
export { Card, CardHeader, CardBody, CardFooter, cardClass } from './components/Card';
export type { CardStyleOptions } from './components/Card';
export { Badge, Chip, badgeClass } from './components/Badge';
export type { BadgeProps, BadgeTone } from './components/Badge';
export { Field, Label, Input, Textarea, Select, Checkbox, Switch, inputClass } from './components/Form';
export type { FieldProps, InputProps, TextareaProps, SelectProps, CheckboxProps, SwitchProps, ControlSize } from './components/Form';
export { Avatar, initialsOf, toneOf } from './components/Avatar';
export type { AvatarProps } from './components/Avatar';
export { Spinner, Skeleton, Progress, Alert, EmptyState, Kbd } from './components/Feedback';
export type { ProgressTone, AlertTone } from './components/Feedback';
export { Stat, Delta } from './components/Stat';
export type { StatProps } from './components/Stat';
export { PageHeader, SectionTitle, Eyebrow, Breadcrumb, Tooltip } from './components/Layout';
export type { PageHeaderProps, Crumb } from './components/Layout';

// Süslemeler
export { LaurelWreath, Meander, RomanNumeral, Divider, Inscription } from './ornaments/Ornaments';

// İstemci bileşenleri
export { Dialog } from './components/Dialog';
export type { DialogProps } from './components/Dialog';
export { Menu, MenuItem, MenuLabel, MenuSeparator } from './components/Menu';
export type { MenuProps, MenuItemProps, MenuTriggerProps } from './components/Menu';
export { Tabs } from './components/Tabs';
export type { TabsProps, TabItem } from './components/Tabs';
export { Toaster, toast, showToast, dismissToast } from './components/Toast';
export type { ToastTone, ToastOptions } from './components/Toast';
export { ConfirmHost, confirmDialog } from './components/Confirm';
export type { ConfirmOptions } from './components/Confirm';
