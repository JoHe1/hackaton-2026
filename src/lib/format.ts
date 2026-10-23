const eur = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });
const pricePerLiter = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const integer = new Intl.NumberFormat('es-ES', { useGrouping: 'always' } as unknown as Intl.NumberFormatOptions);
const decimal = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 });
const percent = new Intl.NumberFormat('es-ES', { style: 'percent', maximumFractionDigits: 0 });

export const formatEur = (value: number) => eur.format(value);
export const formatPricePerLiter = (value: number) => `${pricePerLiter.format(value)} €/L`;
export const formatInt = (value: number) => integer.format(value);
export const formatDecimal = (value: number) => decimal.format(value);
export const formatPercent = (value: number) => percent.format(value);
export const formatKm = (value: number) => `${decimal.format(value)} km`;

export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
