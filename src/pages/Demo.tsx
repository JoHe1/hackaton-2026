import { BarChart3, RotateCcw, ScanLine, ImageIcon } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { DisaLogo } from '../components/DisaLogo';
import { FRAME_HEIGHT, FRAME_WIDTH, PhoneFrame } from '../components/PhoneFrame';
import { PresenterMenu } from '../components/PresenterMenu';
import { COPILOT_REWARDS } from '../data/rewards';
import { getUser, type UserId } from '../data/users';
import { useFitScale } from '../lib/useFitScale';
import { useDemoStore, isRewardUnlocked } from '../store/demoStore';
import { AdminPanel } from '../screens/admin/AdminPanel';
import { DisaApp } from '../screens/app/DisaApp';
import { PosScreen } from '../screens/pos/PosScreen';

const GAP = 36;
const LABEL_HEIGHT = 40;
const PHONES: { key: string; label: string; render: () => JSX.Element }[] = [
  { key: 'u1', label: `${getUser('u1').name} · conductora`, render: () => <DisaApp userId="u1" /> },
  { key: 'u2', label: `${getUser('u2').name} · copiloto`, render: () => <DisaApp userId="u2" /> },
  { key: 'u3', label: `${getUser('u3').name} · copiloto`, render: () => <DisaApp userId="u3" /> },
  { key: 'pos', label: 'Caja · surtidor', render: () => <PosScreen /> },
];
const STAGE_WIDTH = PHONES.length * FRAME_WIDTH + (PHONES.length - 1) * GAP;
const STAGE_HEIGHT = FRAME_HEIGHT + LABEL_HEIGHT;

/** Presenter mode: 4 phones sharing the same store. */
export default function Demo() {
  const { ref, scale } = useFitScale<HTMLDivElement>(STAGE_WIDTH, STAGE_HEIGHT);
  const restart = useDemoStore((s) => s.reset);
  const panelOpen = useDemoStore((s) => s.panelOpen);
  const setPanelOpen = useDemoStore((s) => s.setPanelOpen);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-disa-bg">
      <header className="flex items-center gap-4 border-b border-disa-line bg-white px-5 py-2">
        <DisaLogo width={84} />
        <div className="mr-auto">
          <p className="font-display text-[20px] font-medium leading-tight text-disa-blue">DISA Copilotos</p>
          <p className="font-display text-[13px] italic text-disa-gray">Modo presentador · Llena el coche, no solo el depósito</p>
        </div>
        <PabloControl />
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          className="flex items-center gap-2 rounded-full bg-disa-blue px-4 py-2 text-[14px] font-medium text-white"
        >
          <BarChart3 size={16} /> Panel DISA
        </button>
        <button
          type="button"
          onClick={restart}
          className="flex items-center gap-2 rounded-full border border-disa-line px-4 py-2 text-[14px] font-medium text-disa-blue"
        >
          <RotateCcw size={16} /> Reiniciar demo
        </button>
      </header>
      <main ref={ref} className="flex flex-1 items-center justify-center overflow-hidden p-4">
        <div style={{ width: STAGE_WIDTH * scale, height: STAGE_HEIGHT * scale }}>
          <div className="flex origin-top-left" style={{ width: STAGE_WIDTH, gap: GAP, transform: `scale(${scale})` }}>
            {PHONES.map((p) => (
              <div key={p.key} className="flex flex-col items-center">
                <p className="mb-2 h-[32px] font-display text-[22px] font-medium text-disa-blue">{p.label}</p>
                <PhoneFrame>{p.render()}</PhoneFrame>
              </div>
            ))}
          </div>
        </div>
      </main>
      {panelOpen && (
        <div className="animate-fade-in fixed inset-0 z-50 overflow-y-auto bg-disa-bg">
          <AdminPanel onClose={() => setPanelOpen(false)} />
        </div>
      )}
      <PresenterMenu />
    </div>
  );
}

const PABLO: UserId = 'u4';

/** Pablo (17) has no phone on stage: his scans are triggered from here. */
function PabloControl() {
  const scan = useDemoStore((s) => s.scan);
  const toast = useDemoStore((s) => s.toasts[PABLO]);
  const joined = useDemoStore((s) => s.joined.includes(PABLO));
  const unlocked = useDemoStore((s) => isRewardUnlocked(s, PABLO));
  const pablo = getUser(PABLO);
  const reward = COPILOT_REWARDS[PABLO];
  const status = toast?.text ?? (unlocked && reward ? `Cupón directo: ${reward.result}` : joined ? 'En el coche ✓' : `${pablo.age} años · copiloto`);
  const statusTone = toast?.tone === 'error' ? 'text-disa-red' : toast?.tone === 'success' || joined ? 'text-disa-green' : 'text-disa-gray';
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-disa-line bg-disa-bg px-3 py-1.5">
      <Avatar userId={PABLO} size={34} checked={joined} />
      <div className="w-[230px]">
        <p className="text-[13px] font-medium">Móvil de {pablo.name}</p>
        <p className={`truncate text-[12px] ${statusTone}`}>{status}</p>
      </div>
      <button
        type="button"
        onClick={() => scan(PABLO, 'screenshot')}
        className="flex items-center gap-1 rounded-full border border-disa-line bg-white px-3 py-1.5 text-[13px]"
      >
        <ImageIcon size={14} /> Escanear captura
      </button>
      <button
        type="button"
        onClick={() => scan(PABLO, 'live')}
        className="flex items-center gap-1 rounded-full bg-disa-yellow px-3 py-1.5 text-[13px] font-medium"
      >
        <ScanLine size={14} /> Escanear
      </button>
    </div>
  );
}
