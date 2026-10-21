import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../lib/cx';
import { toRoman } from '../lib/roman';

/* ----------------------------------------------------------- LaurelWreath */

interface Leaf {
  x: number;
  y: number;
  angle: number;
  scale: number;
}

const C = { x: 50, y: 52, r: 37 };
const BRANCH_START = 104; // derece; 90° = alt orta (SVG'de y aşağı)
const BRANCH_SWEEP = 138;

const rad = (deg: number) => (deg * Math.PI) / 180;
const pt = (deg: number, r = C.r) => [C.x + r * Math.cos(rad(deg)), C.y + r * Math.sin(rad(deg))] as const;

// Bir dal: yay boyunca dış ve iç sırada, uca doğru küçülen yapraklar
function branch(side: 1 | -1, count = 8): Leaf[] {
  const leaves: Leaf[] = [];
  const start = side === 1 ? BRANCH_START : 180 - BRANCH_START;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const deg = start + side * BRANCH_SWEEP * t;
    const scale = 1 - t * 0.4;
    for (const ring of [1, -1] as const) {
      const [x, y] = pt(deg, C.r + ring * 5.2 * scale);
      // Yaprak ucu büyüme yönünde, dış sıra dışa / iç sıra içe açılır
      leaves.push({ x, y, angle: deg - side * ring * 28, scale: scale * (ring === 1 ? 1 : 0.86) });
    }
  }
  return leaves;
}

function stem(side: 1 | -1) {
  const a = side === 1 ? BRANCH_START : 180 - BRANCH_START;
  const b = a + side * BRANCH_SWEEP;
  const [x1, y1] = pt(a);
  const [x2, y2] = pt(b);
  return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${C.r} ${C.r} 0 0 ${side === 1 ? 1 : 0} ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

const LEAVES = [...branch(1), ...branch(-1)];
const STEMS = [stem(1), stem(-1)];
const LEAF_PATH = 'M0 -8.6C3.6 -5 3.8 3.6 0 8.6C-3.8 3.6 -3.6 -5 0 -8.6Z';

/**
 * Defne çelengi. Rengi `color` ile (varsayılan antik altın).
 * İçine içerik (ör. logo, harf, Roma rakamı) konabilir.
 */
export function LaurelWreath({
  size = 64,
  className,
  style,
  children,
  title,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  title?: string;
}) {
  const svg = (
    <svg
      className={cx('lu-laurel', !children && className)}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={children ? undefined : style}
    >
      {STEMS.map((d, i) => (
        <path key={`s${i}`} d={d} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />
      ))}
      {LEAVES.map((l, i) => (
        <path
          key={i}
          d={LEAF_PATH}
          transform={`translate(${l.x.toFixed(2)} ${l.y.toFixed(2)}) rotate(${l.angle.toFixed(1)}) scale(${l.scale.toFixed(3)})`}
        />
      ))}
      {/* Dalların buluştuğu bağ */}
      <path d="M46.5 88.5 50 92.5 53.5 88.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (!children) return svg;
  return (
    <span className={cx('lu-laurel-frame', className)} style={{ position: 'relative', display: 'inline-grid', placeItems: 'center', width: size, height: size, ...style }}>
      <span style={{ position: 'absolute', inset: 0 }}>{svg}</span>
      <span style={{ position: 'relative', display: 'inline-flex' }}>{children}</span>
    </span>
  );
}

/* ---------------------------------------------------------------- Meander */

/** Menderes (meander) bandı — başlık altı, kenar süslemesi */
export function Meander({ faint, vertical, height, className, style }: { faint?: boolean; vertical?: boolean; height?: number; className?: string; style?: CSSProperties }) {
  return (
    <span
      className={cx('lu-meander', faint && 'lu-meander--faint', vertical && 'lu-meander--vertical', className)}
      style={{ ...(height ? (vertical ? { width: height } : { height }) : null), ...style }}
      aria-hidden="true"
    />
  );
}

/* ----------------------------------------------------------- RomanNumeral */

export function RomanNumeral({ value, className, style }: { value: number; className?: string; style?: CSSProperties }) {
  return (
    <span className={cx('lu-numeral', className)} style={style} title={String(value)}>
      {toRoman(value)}
    </span>
  );
}

/* ---------------------------------------------------------------- Divider */

/** Süslü ayırıcı: altın çizgiler arasında kitabe yazısı veya elmas işareti */
export function Divider({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cx('lu-divider', className)} role="separator">
      {children ?? (
        <span className="lu-divider-mark" aria-hidden="true">
          <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor"><path d="M5 0 10 5 5 10 0 5Z" /></svg>
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ Inscription */

/** Kitabe yazısı: Trajan sütunu gibi büyük harf, geniş aralık */
export function Inscription({ children, as: Tag = 'span', className, style }: { children: ReactNode; as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'div'; className?: string; style?: CSSProperties }) {
  return (
    <Tag className={cx('lu-inscription', className)} style={style}>
      {children}
    </Tag>
  );
}
