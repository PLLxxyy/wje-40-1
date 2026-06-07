export function formatPrice(n: number): string {
  return n.toFixed(2);
}

export function formatVolume(n: number): string {
  if (n >= 100000000) return (n / 100000000).toFixed(2) + '亿';
  if (n >= 10000) return (n / 10000).toFixed(2) + '万';
  return String(n);
}

export function changePercent(price: number, prev: number): number {
  return prev ? Math.round(((price - prev) / prev) * 10000) / 100 : 0;
}
