export const METRICS = {
  newUsersFromCopilots: 1240, copilotsPerDriver: 2.3, storeRedemptionRate: 0.41,
  costPerNewUser: 1.95, share15to24: 0.11, // datos ficticios de un piloto imaginario
};
export const RISK_ALERTS = [
  { pass: 'P-8812', score: 0.93, reason: 'Copiloto con 9 conductores distintos esta semana' },
  { pass: 'P-8790', score: 0.81, reason: 'Ubicación del copiloto salta 40 km en 2 minutos' },
  { pass: 'P-8754', score: 0.77, reason: '3 cuentas creadas desde el mismo dispositivo' },
];
export type BudgetLevel = 'bajo' | 'medio' | 'alto';
export const WHEEL_ODDS: Record<BudgetLevel, Record<string, number>> = {   // % por premio; cine y concierto son raros y van con socios
  bajo:  { Chicles: 35, Papas: 25, Café: 20, Refresco: 12, Helado: 5, '+1 tirada': 2, 'Cine 2x1': 1, 'Concierto −20 %': 0 },
  medio: { Chicles: 28, Papas: 22, Café: 18, Refresco: 14, Helado: 8, '+1 tirada': 5, 'Cine 2x1': 3, 'Concierto −20 %': 2 },
  alto:  { Chicles: 20, Papas: 18, Café: 16, Refresco: 14, Helado: 12, '+1 tirada': 8, 'Cine 2x1': 7, 'Concierto −20 %': 5 },
};
export const BUDGET_LEVELS: BudgetLevel[] = ['bajo', 'medio', 'alto'];
export const FICTIONAL_DATA_LABEL = 'Datos ficticios de un piloto simulado';
