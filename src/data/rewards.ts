import type { UserId } from './users';

export const WHEEL = ['Chicles', 'Papas', 'Café', 'Refresco', 'Helado', 'Cine 2x1', 'Concierto −20 %', '+1 tirada'];
export const DRIVER_SPINS = { total: 48.60, spins: 4 };       // 1 pase por cada 10 € pagados
export const DRIVER_SPIN_RESULT = 'Helado';                    // la tirada que se enseña en la demo

export interface CopilotReward {
  type: 'ruleta' | 'cupon';
  result: string;
  why: string;
}

export const COPILOT_REWARDS: Partial<Record<UserId, CopilotReward>> = {
  u2: { type: 'ruleta', result: 'Refresco', why: 'Sueles venir por la tarde y canjeas bebidas' },
  u3: { type: 'ruleta', result: 'Cine 2x1', why: 'Premio poco frecuente: socio de cine' },   // momento "wow"
  u4: { type: 'cupon',  result: 'Papas',    why: 'Menor de edad: premio directo, sin ruleta' },
};

// Premios de estilo de vida financiados por socios.
export const PARTNER_PRIZES = ['Cine 2x1', 'Concierto −20 %'];

export const PRIZE_EMOJI: Record<string, string> = {
  Chicles: '🍬', Papas: '🥔', Café: '☕', Refresco: '🥤', Helado: '🍦',
  'Cine 2x1': '🎬', 'Concierto −20 %': '🎤', '+1 tirada': '🔁',
};
