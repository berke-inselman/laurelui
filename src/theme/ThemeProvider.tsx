'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { DEFAULT_THEME_KEY, type ThemeMode, type ThemeName } from './ThemeScript';

export interface PointerOrigin {
  clientX?: number;
  clientY?: number;
}

interface ThemeContextValue {
  /** Ekranda uygulanan tema */
  theme: ThemeName;
  /** Kullanıcı tercihi: 'system' ise işletim sistemi temasını canlı izler */
  mode: ThemeMode;
  setTheme: (next: ThemeName, origin?: PointerOrigin) => void;
  setMode: (next: ThemeMode, origin?: PointerOrigin) => void;
  toggleTheme: (origin?: PointerOrigin) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ViewTransitionDocument = Document & {
  startViewTransition?: (cb: () => void | Promise<void>) => { ready: Promise<void>; finished: Promise<void> };
};

const DARK_QUERY = '(prefers-color-scheme: dark)';
const MODE_EVENT = 'lu-theme-mode';
const systemTheme = (): ThemeName => (window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light');

export interface ThemeProviderProps {
  children: ReactNode;
  storageKey?: string;
  attribute?: string;
  /** Kayıtlı tercih yokken kullanılan mod (ThemeScript'in defaultTheme'i ile aynı olmalı) */
  defaultMode?: ThemeMode;
  /** ⌘/Ctrl + bu tuş temayı değiştirir; false: kısayol yok */
  hotkey?: string | false;
  /** Tıklanan noktadan dairesel tema geçişi (View Transitions API varsa) */
  transition?: 'circle' | 'none';
}

export function ThemeProvider({
  children,
  storageKey = DEFAULT_THEME_KEY,
  attribute = 'data-theme',
  defaultMode = 'system',
  hotkey = 'j',
  transition = 'circle',
}: ThemeProviderProps) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const observer = new MutationObserver(cb);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: [attribute] });
      return () => observer.disconnect();
    },
    [attribute],
  );
  const theme = useSyncExternalStore(
    subscribe,
    () => (document.documentElement.getAttribute(attribute) === 'dark' ? 'dark' : 'light') as ThemeName,
    () => 'light' as ThemeName,
  );

  const readMode = useCallback((): ThemeMode => {
    try {
      const v = localStorage.getItem(storageKey);
      if (v === 'light' || v === 'dark' || v === 'system') return v;
    } catch {
      /* depolama kapalı olabilir */
    }
    return defaultMode;
  }, [storageKey, defaultMode]);
  const subscribeMode = useCallback((cb: () => void) => {
    window.addEventListener(MODE_EVENT, cb);
    window.addEventListener('storage', cb);
    return () => {
      window.removeEventListener(MODE_EVENT, cb);
      window.removeEventListener('storage', cb);
    };
  }, []);
  const mode = useSyncExternalStore(subscribeMode, readMode, () => defaultMode);

  // Temayı uygular. Gece yönünde gece tıklanan noktadan daire olarak yayılır;
  // gündüz yönünde gece katmanı aynı noktaya çekilerek kaybolur.
  const applyTheme = useCallback(
    (next: ThemeName, origin?: PointerOrigin) => {
      const root = document.documentElement;
      if (root.getAttribute(attribute) === next) return;
      const apply = () => root.setAttribute(attribute, next);
      const doc = document as ViewTransitionDocument;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (transition === 'none' || !doc.startViewTransition || reduceMotion) {
        apply();
        return;
      }
      const x = origin?.clientX ?? window.innerWidth - 48;
      const y = origin?.clientY ?? 32;
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      const toDark = next === 'dark';
      const dirClass = toDark ? 'lu-theme-to-dark' : 'lu-theme-to-light';
      root.classList.add('lu-theme-transition', dirClass);
      // Yeni görüntü yakalanmadan önce bir görev beklenir: temaya bağlı React çizimi yakalamadan önce biter,
      // animasyon sırasında ana iş parçacığını meşgul etmez ve bitişte canlı sayfa yakalanan görüntüden farklı çıkmaz.
      const vt = doc.startViewTransition(() => {
        apply();
        return new Promise<void>((resolve) => setTimeout(resolve, 0));
      });
      vt.ready
        .then(() => {
          const small = `circle(0px at ${x}px ${y}px)`;
          const full = `circle(${radius}px at ${x}px ${y}px)`;
          if (toDark) {
            // Akşam: gece yumuşak başlayıp köşelere yaklaşırken yavaşlayarak yayılır
            root.animate(
              { clipPath: [small, full] },
              { duration: 700, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'both', pseudoElement: '::view-transition-new(root)' },
            );
          } else {
            // Şafak: gece katmanı önce ağır, sonra hızlanarak tıklanan noktaya çekilir ve söner
            root.animate(
              { clipPath: [full, small] },
              { duration: 650, easing: 'cubic-bezier(0.55, 0, 0.45, 1)', fill: 'both', pseudoElement: '::view-transition-old(root)' },
            );
          }
        })
        .catch(() => {});
      vt.finished.catch(() => {}).finally(() => root.classList.remove('lu-theme-transition', dirClass));
    },
    [attribute, transition],
  );

  const setMode = useCallback(
    (next: ThemeMode, origin?: PointerOrigin) => {
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        /* depolama kapalı olabilir */
      }
      window.dispatchEvent(new Event(MODE_EVENT));
      applyTheme(next === 'system' ? systemTheme() : next, origin);
    },
    [storageKey, applyTheme],
  );

  const setTheme = useCallback((next: ThemeName, origin?: PointerOrigin) => setMode(next, origin), [setMode]);

  const toggleTheme = useCallback(
    (origin?: PointerOrigin) => {
      const current = document.documentElement.getAttribute(attribute) === 'dark' ? 'dark' : 'light';
      setMode(current === 'dark' ? 'light' : 'dark', origin);
    },
    [attribute, setMode],
  );

  // 'system' modunda işletim sistemi teması değişince canlı izlenir (başka sekmedeki mod değişikliği de)
  useEffect(() => {
    if (mode !== 'system') return;
    const mq = window.matchMedia(DARK_QUERY);
    const sync = () => applyTheme(mq.matches ? 'dark' : 'light');
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [mode, applyTheme]);

  useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === hotkey.toLowerCase() || e.code === `Key${hotkey.toUpperCase()}`)) {
        e.preventDefault();
        toggleTheme();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hotkey, toggleTheme]);

  const value = useMemo(() => ({ theme, mode, setTheme, setMode, toggleTheme }), [theme, mode, setTheme, setMode, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme, <ThemeProvider> içinde kullanılmalıdır.');
  return ctx;
}
