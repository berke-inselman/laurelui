export type ThemeName = 'light' | 'dark';

export interface ThemeScriptOptions {
  /** localStorage anahtarı */
  storageKey?: string;
  /** Kayıtlı tercih yoksa: sabit tema ya da işletim sistemi tercihi */
  defaultTheme?: ThemeName | 'system';
  /** Temanın yazılacağı <html> özniteliği */
  attribute?: string;
}

export const DEFAULT_THEME_KEY = 'lu-theme';

/**
 * İlk boyamadan önce temayı <html>'e yazan küçük betiğin kaynağı.
 * Kendi önyükleme betiğinize eklemek için dize olarak da kullanılabilir.
 */
export function themeScript({ storageKey = DEFAULT_THEME_KEY, defaultTheme = 'system', attribute = 'data-theme' }: ThemeScriptOptions = {}): string {
  const key = JSON.stringify(storageKey);
  const attr = JSON.stringify(attribute);
  const fallback = defaultTheme === 'system'
    ? `matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'`
    : JSON.stringify(defaultTheme);
  return `(function(){try{var d=document.documentElement;var t=localStorage.getItem(${key});if(t!=='light'&&t!=='dark'){t=${fallback}}d.setAttribute(${attr},t)}catch(e){}})()`;
}

/**
 * Next.js kök layout'unda <head> içine koyun; tema yanıp sönmeden uygulanır:
 * <html lang="tr" suppressHydrationWarning><head><ThemeScript /></head>…
 */
export function ThemeScript(props: ThemeScriptOptions & { extra?: string }) {
  const { extra, ...options } = props;
  return <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeScript(options) + (extra ? `;${extra}` : '') }} />;
}
