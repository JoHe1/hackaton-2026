import { CONFIG } from '../data/config';

export interface TicketBreakdown {
  liters: number;
  pricePerLiter: number;
  copilots: number;
  passApplies: boolean;
  gross: number;
  discountPerLiter: number;
  discount: number;
  total: number;
  pointsIfAccumulate: number;
}

const round2 = (value: number) => Math.round(value * 100) / 100;

/** Discount = copilots × 2 c/L × liters, only when the pass applies. */
export function computeTicket(liters: number, pricePerLiter: number, copilots: number): TicketBreakdown {
  const effectiveCopilots = Math.min(copilots, CONFIG.maxCopilots);
  const passApplies = effectiveCopilots > 0 && liters >= CONFIG.minLiters;
  const discountCentsPerLiter = passApplies ? effectiveCopilots * CONFIG.centsPerLiterPerCopilot : 0;
  const gross = round2(liters * pricePerLiter);
  const discount = round2((discountCentsPerLiter * liters) / 100);
  return {
    liters,
    pricePerLiter,
    copilots: effectiveCopilots,
    passApplies,
    gross,
    discountPerLiter: discountCentsPerLiter / 100,
    discount,
    total: round2(gross - discount),
    // 1 punto = 1 céntimo
    pointsIfAccumulate: Math.round(discount * 100),
  };
}

/** 1 driver spin per 10 € actually paid: floor(total / 10). */
export function driverSpinsFor(amountPaid: number): number {
  return Math.floor(amountPaid / CONFIG.euroPerDriverSpin);
}

export function discountCentsPerLiter(copilots: number): number {
  return Math.min(copilots, CONFIG.maxCopilots) * CONFIG.centsPerLiterPerCopilot;
}
