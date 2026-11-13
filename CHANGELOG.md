# Değişiklik günlüğü

## Yayımlanmamış

- ThemeProvider: `mode` / `setMode` ve `'system'` modu; işletim sistemi teması değişince canlı izlenir. ThemeScript kayıtlı `'system'` tercihini tanır. Yeni tür: `ThemeMode`.
- Tema geçişi yöne göre: geceye geçerken daire yayılır, gündüze dönerken gece katmanı tıklanan noktaya çekilir.
- ThemeProvider: dairesel tema geçişi yumuşatıldı. Önde yüklü expo eğrisi yerine yumuşak başlayıp yumuşak biten eğri (700 ms); yeni görüntü, temaya bağlı çizim bittikten sonra yakalanıyor.

## 1.0.0 — 2026-10-21

İlk sürüm. Lisans: MIT.

- Palet (Obsidian, Stone White, Steel Blue, Antique Gold) ve klasik durum pigmentleri; Dies (gündüz) / Nox (gece) temaları
- `@layer laurel.*` katmanlı CSS: reset, token, temel, bileşen, süsleme, yardımcı
- Bileşenler: Button, IconButton, Card, Stat, Badge, Chip, Field, Input, Textarea, Select, Checkbox, Switch, Alert, Progress, Spinner, Skeleton, EmptyState, PageHeader, Breadcrumb, Tooltip, Dialog, Menu, Tabs, Toaster, ConfirmHost
- Süslemeler: LaurelWreath, Meander, RomanNumeral, Divider, Inscription
- Tema: ThemeScript (yanıp sönmeyen tema), ThemeProvider (dairesel geçiş, ⌘/Ctrl + J)
