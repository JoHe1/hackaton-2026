import { ArrowLeft } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { DRIVER_ID, type UserId } from '../../data/users';
import { useDemoStore, type HubTab } from '../../store/demoStore';
import { DriverPassTab } from '../driver/DriverPassTab';
import { CopilotPassTab } from '../copilot/CopilotPassTab';
import { PremiosTab, RankingTab, RetosTab } from './HubTabs';

const TABS: { id: HubTab; label: string }[] = [
  { id: 'pase', label: 'Pase' },
  { id: 'retos', label: 'Retos' },
  { id: 'ranking', label: 'Ranking' },
  { id: 'premios', label: 'Premios' },
];

export function CopilotosHub({ userId }: { userId: UserId }) {
  const hubTab = useDemoStore((s) => s.nav[userId].hubTab);
  const setNav = useDemoStore((s) => s.setNav);
  const isDriver = userId === DRIVER_ID;
  return (
    <div className="min-h-full bg-disa-bg">
      <div className="sticky top-0 z-20">
        <div className="bg-disa-blue text-white">
          <StatusBar tone="light" />
          <div className="flex items-center gap-3 px-4 pb-3 pt-2">
            <button type="button" aria-label="Volver" onClick={() => setNav(userId, { tab: 'inicio' })}>
              <ArrowLeft size={24} />
            </button>
            <div>
              <p className="font-display text-[22px] font-medium leading-tight">DISA Copilotos</p>
              <p className="font-display text-[13px] italic text-disa-yellow">Llena el coche, no solo el depósito</p>
            </div>
          </div>
        </div>
        <div className="flex border-b border-disa-line bg-white">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setNav(userId, { hubTab: t.id })}
              className={`flex-1 py-3 text-[15px] font-medium ${
                hubTab === t.id ? 'border-b-[3px] border-disa-yellow text-disa-blue' : 'border-b-[3px] border-transparent text-disa-gray'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        {hubTab === 'pase' && (isDriver ? <DriverPassTab /> : <CopilotPassTab userId={userId} />)}
        {hubTab === 'retos' && <RetosTab userId={userId} onOpenSummer={() => setNav(userId, { overlay: 'summer' })} />}
        {hubTab === 'ranking' && <RankingTab />}
        {hubTab === 'premios' && <PremiosTab userId={userId} />}
      </div>
    </div>
  );
}
