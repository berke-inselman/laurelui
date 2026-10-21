import type { CSSProperties } from 'react';
import { cx } from '../lib/cx';

// Avatarlar gökkuşağı yerine klasik pigment paletinden renk alır
const AVATAR_TONES = [
  'var(--lu-steel)',
  'var(--lu-obsidian-600)',
  'var(--lu-laurel)',
  'var(--lu-tyrian)',
  'var(--lu-aqua)',
  'var(--lu-gold-600)',
  'var(--lu-pompeii)',
  'var(--lu-steel-700)',
];

/** Ad soyaddan baş harfler, Türkçe büyük harf kurallarıyla: "ayşe işık" → "Aİ", "Ali Rıza Kaya" → "AK" */
export function initialsOf(name: string): string {
  const words = name
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0][0];
  const second = words.length > 1 ? words[words.length - 1][0] : words[0][1] || '';
  return (first + second).toLocaleUpperCase('tr-TR');
}

export function toneOf(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) | 0;
  return AVATAR_TONES[Math.abs(hash) % AVATAR_TONES.length];
}

export interface AvatarProps {
  name: string;
  src?: string | null;
  size?: number;
  /** Altın defne halkası (ör. oturumdaki kullanıcı) */
  ring?: boolean;
  shape?: 'circle' | 'arch' | 'square';
  className?: string;
  style?: CSSProperties;
}

export function Avatar({ name, src, size = 36, ring, shape = 'circle', className, style }: AvatarProps) {
  const label = name || '?';
  return (
    <span
      className={cx('lu-avatar', ring && 'lu-avatar--ring', shape !== 'circle' && `lu-avatar--${shape}`, className)}
      style={{ '--_size': `${size}px`, '--_bg': toneOf(label), ...style } as CSSProperties}
      aria-hidden="true"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" referrerPolicy="no-referrer" />
      ) : (
        initialsOf(label)
      )}
    </span>
  );
}
