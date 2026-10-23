export type UserId = 'u1' | 'u2' | 'u3' | 'u4';

export interface User {
  id: UserId;
  name: string;
  age: number;
  role: 'conductora' | 'copiloto';
  car?: string;
  avatar?: string;
  minor?: boolean;
}

export const USERS: User[] = [
  { id: 'u1', name: 'Lucía',  age: 19, role: 'conductora', car: 'Seat Ibiza', avatar: '🧑' },
  { id: 'u2', name: 'Dani',   age: 20, role: 'copiloto' },
  { id: 'u3', name: 'Aitana', age: 19, role: 'copiloto' },
  { id: 'u4', name: 'Pablo',  age: 17, role: 'copiloto', minor: true }, // sin ruleta: cupón directo
];

export const DRIVER_ID: UserId = 'u1';
export const COPILOT_IDS: UserId[] = ['u2', 'u3', 'u4'];

export function getUser(id: UserId): User {
  const user = USERS.find((u) => u.id === id);
  if (!user) throw new Error(`Unknown user ${id}`);
  return user;
}
