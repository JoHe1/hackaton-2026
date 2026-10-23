import { Check } from 'lucide-react';
import { getUser, type UserId } from '../data/users';

const PALETTE: Record<UserId, string> = {
  u1: 'bg-disa-blue text-white',
  u2: 'bg-disa-yellow text-disa-ink',
  u3: 'bg-[#E8572A] text-white',
  u4: 'bg-disa-green text-white',
};

interface Props {
  userId: UserId;
  size?: number;
  checked?: boolean;
}

export function Avatar({ userId, size = 44, checked = false }: Props) {
  const user = getUser(userId);
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <span
        className={`flex h-full w-full items-center justify-center rounded-full font-display font-bold ${PALETTE[userId]}`}
        style={{ fontSize: size * 0.42 }}
      >
        {user.avatar ?? user.name.charAt(0)}
      </span>
      {checked && (
        <span className="animate-pop absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white bg-disa-green text-white">
          <Check size={11} strokeWidth={3.5} />
        </span>
      )}
    </span>
  );
}
