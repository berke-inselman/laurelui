'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { DEFAULT_THEME_KEY, type ThemeName } from './ThemeScript';

export interface PointerOrigin {
  clientX?: number;
  clientY?: number;
}

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (next: ThemeName, origin?: PointerOrigin) => void;
  toggleTheme: (origin?: PointerOrigin) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ViewTransitionDocument = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> };
};

export interface ThemeProviderProps {
  children: ReactNode;
  storageKey?: string;
  attribute?: string;
  /** ⌘/Ctrl + bu tuş temayı değiştirir; false: kısayol yok */
  hotkey?: string | false;
  /** Tıklanan noktadan dairesel tema geçişi (View Transitions API varsa) */
  transition?: 'circle' | 'none';
}

export function ThemeProvider({
  children,
  storageKey = DEFAULT_THEME_KEY,
  attribute = 'data-theme',
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

  const apply = useCallback(
    (next: ThemeName) => {
      document.documentElement.setAttribute(attribute, next);
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        /* depolama kapalı olabilir */
      }
    },
    [attribute, storageKey],
  );

  const setTheme = useCallback(
    (next: ThemeName, origin?: PointerOrigin) => {
      const root = document.documentElement;
      if (root.getAttribute(attribute) === next) return;
      const doc = document as ViewTransitionDocument;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (transition === 'none' || !doc.startViewTransition || reduceMotion) {
        apply(next);
        return;
      }
      const x = origin?.clientX ?? window.innerWidth - 48;
      const y = origin?.clientY ?? 32;
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      root.classList.add('lu-theme-transition');
      const vt = doc.startViewTransition(() => apply(next));
      vt.ready
        .then(() => {
          root.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
          );
        })
        .catch(() => {});
      vt.finished.catch(() => {}).finally(() => root.classList.remove('lu-theme-transition'));
    },
    [apply, attribute, transition],
  );

  const toggleTheme = useCallback(
    (origin?: PointerOrigin) => {
      const current = document.documentElement.getAttribute(attribute) === 'dark' ? 'dark' : 'light';
      setTheme(current === 'dark' ? 'light' : 'dark', origin);
    },
    [attribute, setTheme],
  );

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

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme, <ThemeProvider> içinde kullanılmalıdır.');
  return ctx;
}
