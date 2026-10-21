/** Sınıf adlarını birleştirir; false / null / undefined / '' değerleri atlanır. */
export function cx(...parts: Array<string | false | null | undefined | 0>): string {
  let out = '';
  for (const p of parts) {
    if (p) out = out ? `${out} ${p}` : p;
  }
  return out;
}
