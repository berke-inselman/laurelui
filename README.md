# Laurel-UI V1.0

Antik Roma'dan esinlenen, **Next.js (App Router)** için React bileşen kütüphanesi.
Hedef: performans, kullanım kolaylığı, özgünlük ve göze doyurucu bir arayüz.

> *An Ancient Rome–inspired React component library for Next.js — Obsidian identity, Stone White canvas, Steel Blue details and just enough Antique Gold.*

- Trajan sütunu kitabelerinden gelen başlıklar (Cinzel), okunaklı arayüz metni ve sabit genişlikli rakamlar (Manrope)
- Menderes (meander) bantları, defne çelengi, yivli sütun dokusu, kemerli nişler, Roma rakamları — hepsi saf CSS/SVG, görsel dosya yok
- Gündüz (**Dies**) ve gece (**Nox**) temaları; alt ağaç bazında tema (`.lu-nox`, `.lu-dies`)
- Sunucu bileşenleriyle uyumlu: etkileşim gerektirmeyenler (Button, Card, Badge…) Server Component'te doğrudan kullanılır; etkileşimliler kendi `"use client"` sınırını taşır
- Tüm CSS `@layer laurel.*` katmanlarında: uygulamanızın sıradan CSS'i, özgüllükten bağımsız olarak her zaman Laurel'i ezer
- Dış bağımlılık yok (ikonlar dahil); yalnızca `react`, `react-dom`, `next` eş bağımlılıkları

## Palet

| Renk | Kod | Oran | Kullanım |
| --- | --- | --- | --- |
| Obsidian | `#171C25` | %45 | Ana kimlik ve güçlü yüzeyler |
| Stone White | `#EDEBE5` | %35 | Açık arka planlar |
| Steel Blue | `#536779` | %15 | Yardımcı grafikler, etkileşim vurgusu |
| Antique Gold | `#B59A69` | %5 | Premium vurgu detayları |

Durum tonları klasik pigmentlerden gelir: **Laurel** (başarı), **Pompeii** (tehlike), **Ochre** (uyarı), **Tyrian** (özel), **Aqua** (bilgi).
Tüm metin eşleşmeleri WCAG AA kontrastını sağlar.

## Kurulum

```bash
npm install github:berke-inselman/laurelui
```

Yerel klasörden (ör. aynı makinedeki başka bir proje):

```bash
npm install ../laurelui --install-links
```

Paket TypeScript kaynağı olarak gelir; Next.js'e derlemesini söyleyin:

```ts
// next.config.ts
const nextConfig = {
  transpilePackages: ['laurel-ui'],
};
export default nextConfig;
```

## Next.js'e bağlama

```tsx
// app/layout.tsx
import { Cinzel, Manrope } from 'next/font/google';
import { ThemeScript, ThemeProvider, Toaster, ConfirmHost } from 'laurel-ui';
import 'laurel-ui/styles.css'; // uygulama CSS'inden önce
import './globals.css';

const display = Cinzel({ subsets: ['latin', 'latin-ext'], variable: '--font-laurel-display' });
const sans = Manrope({ subsets: ['latin', 'latin-ext'], variable: '--font-laurel-sans' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript /> {/* tema ilk boyamadan önce: yanıp sönme yok */}
      </head>
      <body>
        <ThemeProvider>
          {children}
          <Toaster />
          <ConfirmHost />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

`lang="tr"` önemlidir: kitabe başlıkları `text-transform: uppercase` kullanır ve tarayıcı Türkçe kuralını (i → İ) ancak böyle uygular.

## Kullanım

```tsx
import Link from 'next/link';
import { Button, Card, CardHeader, CardBody, Badge, Stat, PageHeader, buttonClass } from 'laurel-ui';
import { Plus, Users } from 'lucide-react';

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Finans"
        title="Kasa ve Kâr / Zarar"
        subtitle="Bu ayın özeti"
        actions={<Button variant="primary" icon={<Plus size={16} />}>Yeni kayıt</Button>}
      />
      <Stat numeral={1} label="Toplam müşteri" value="1.284" icon={<Users size={15} />} delta={{ value: '%4,2', direction: 'up' }} />
      <Card gilded>
        <CardHeader title="Satınalma" actions={<Badge tone="success" dot>Teslim alındı</Badge>} />
        <CardBody>…</CardBody>
      </Card>
      {/* Bağlantıyı düğme gibi göstermek */}
      <Link href="/rapor" className={buttonClass({ variant: 'outline', size: 'sm' })}>Rapor</Link>
    </>
  );
}
```

İstemci tarafında, bileşen dışından da çağrılabilen yardımcılar:

```ts
import { toast, confirmDialog } from 'laurel-ui';

toast.success('Fatura kaydedildi.');
if (await confirmDialog('Bu kayıt silinecek.', { tone: 'danger', requireText: 'SİL' })) { /* … */ }
```

## Bileşenler

| Grup | Bileşenler |
| --- | --- |
| Eylem | `Button`, `IconButton`, `buttonClass`, `iconButtonClass` |
| Yüzey | `Card`, `CardHeader`, `CardBody`, `CardFooter`, `Stat`, `Delta` |
| Form | `Field`, `Label`, `Input`, `Textarea`, `Select`, `Checkbox`, `Switch` |
| Durum | `Badge`, `Chip`, `Alert`, `Progress`, `Spinner`, `Skeleton`, `EmptyState`, `Kbd` |
| Düzen | `PageHeader`, `SectionTitle`, `Eyebrow`, `Breadcrumb`, `Tooltip` |
| Etkileşim (istemci) | `Dialog`, `Menu`, `MenuItem`, `MenuLabel`, `MenuSeparator`, `Tabs`, `Toaster` / `toast`, `ConfirmHost` / `confirmDialog` |
| Süsleme | `LaurelWreath`, `Meander`, `RomanNumeral`, `Divider`, `Inscription` |
| Tema | `ThemeScript`, `themeScript`, `ThemeProvider`, `useTheme` |
| Yardımcı | `cx`, `toRoman`, `fromRoman`, `romanYear`, `Avatar`, `initialsOf`, `toneOf` |

Her bileşenin sınıfları React olmadan da kullanılabilir (`lu-btn lu-btn--primary`, `lu-card`, `lu-input`, `lu-badge lu-badge--success`, `lu-table`, `lu-meander` …).

## Token'lar ve temalar

Tüm değerler CSS değişkenidir (`--lu-*`) ve `laurel.tokens` katmanındadır; ezmek için kendi CSS'inizde yeniden tanımlayın:

```css
:root { --lu-radius-md: 8px; --lu-accent: #4a5f72; }
```

| Grup | Örnekler |
| --- | --- |
| Yüzey | `--lu-canvas`, `--lu-surface`, `--lu-surface-2`, `--lu-surface-3`, `--lu-elevated`, `--lu-field` |
| Metin | `--lu-ink`, `--lu-ink-2`, `--lu-ink-3` |
| Çizgi | `--lu-line`, `--lu-line-strong`, `--lu-line-gold` |
| Vurgu | `--lu-accent`, `--lu-primary`, `--lu-gold`, `--lu-gold-ink`, `--lu-ring` |
| Durum | `--lu-success`, `--lu-danger`, `--lu-warning`, `--lu-violet`, `--lu-info` (+ `-soft`) |
| Grafik | `--lu-chart-1` … `--lu-chart-8` |
| Biçim | `--lu-radius-*`, `--lu-shadow-*`, `--lu-font-sans`, `--lu-font-display` |

- Gece teması: `<html data-theme="dark">` (ThemeScript / ThemeProvider yönetir, ⌘/Ctrl + J kısayolu dahil).
- Bir bölümü her temada gece göstermek için (ör. kenar çubuğu): `class="lu-nox"`; gündüze sabitlemek için `lu-dies`.

## Lisans

[MIT](./LICENSE) — © 2026 Berke İnselman / INSLMN Software Solutions & Experience Consultancy.
Ticari ve kapalı kaynak projeler dahil, telif bildirimini koruyarak özgürce kullanabilir, değiştirebilir ve dağıtabilirsiniz.
