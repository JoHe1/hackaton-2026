export const GROUP = { driver: 'u1', copilots: ['u2','u3','u4'], refuelsTogether: 4 };
export const CHALLENGES = [
  { at: 3, prize: 'Chicles', done: true },
  { at: 5, prize: 'Papas', done: false },     // 4/5 → tras la demo pasa a 5/5
  { at: 10, prize: 'Refresco', done: false },
];
export const ACHIEVEMENTS = ['Primer viaje en grupo', 'Coche lleno', 'Racha de 4 fines de semana', 'Conductor del mes'];
export const AI_GROUP_TIP = 'Repostáis juntos los viernes: este viernes, 1 más y papas para todos';
// Reto personalizado (IA): aviso de racha en peligro.
export const AI_STREAK_TIP = 'Este finde mantenéis la racha si llenáis el coche';
