import { CheckCircle2, Info, ShieldAlert } from 'lucide-react';
import { useDemoStore, type DeviceId } from '../store/demoStore';

const TONES = {
  info: { bg: 'bg-disa-ink', Icon: Info },
  success: { bg: 'bg-disa-green', Icon: CheckCircle2 },
  error: { bg: 'bg-disa-red', Icon: ShieldAlert },
};

/** Android-style snackbar anchored above the bottom navigation. */
export function ToastHost({ device, bottom }: { device: DeviceId; bottom: number }) {
  const toast = useDemoStore((s) => s.toasts[device]);
  if (!toast) return null;
  const { bg, Icon } = TONES[toast.tone];
  return (
    <div className="pointer-events-none absolute inset-x-3 z-50 flex justify-center" style={{ bottom }}>
      <div
        key={toast.id}
        role="status"
        className={`animate-toast-in flex items-start gap-2 rounded-xl px-4 py-3 text-[14px] font-medium leading-snug text-white shadow-card ${bg}`}
      >
        <Icon size={18} className="mt-px shrink-0" />
        <span>{toast.text}</span>
      </div>
    </div>
  );
}
