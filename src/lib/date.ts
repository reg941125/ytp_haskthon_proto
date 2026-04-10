export function toLocalDateString(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(dateString: string, days: number): string {
  const [y, m, d] = dateString.split("-").map((x) => Number(x));
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return toLocalDateString(dt);
}

export function isYesterday(prev?: string, today: string = toLocalDateString()): boolean {
  if (!prev) return false;
  return prev === addDays(today, -1);
}

