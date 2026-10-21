const NUMERALS: Array<[number, string]> = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

/** 1–3999 arası tam sayıyı Roma rakamına çevirir (aralık dışı: sayının kendisi). */
export function toRoman(value: number): string {
  let n = Math.trunc(value);
  if (!Number.isFinite(n) || n < 1 || n > 3999) return String(value);
  let out = '';
  for (const [v, s] of NUMERALS) {
    while (n >= v) {
      out += s;
      n -= v;
    }
  }
  return out;
}

/** Roma rakamını sayıya çevirir; geçersiz girişte NaN. */
export function fromRoman(input: string): number {
  const s = input.trim().toUpperCase();
  if (!/^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(s) || !s) return NaN;
  let total = 0;
  let i = 0;
  for (const [v, sym] of NUMERALS) {
    while (s.startsWith(sym, i)) {
      total += v;
      i += sym.length;
    }
  }
  return total;
}

/** Yılı Roma rakamıyla verir: 2026 → "MMXXVI". */
export function romanYear(date: Date = new Date()): string {
  return toRoman(date.getFullYear());
}
