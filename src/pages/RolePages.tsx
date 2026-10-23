import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FRAME_HEIGHT, FRAME_WIDTH, PhoneFrame } from '../components/PhoneFrame';
import { PresenterMenu } from '../components/PresenterMenu';
import { COPILOT_IDS, type UserId } from '../data/users';
import { useFitScale } from '../lib/useFitScale';
import { useIsPhone } from '../lib/useIsPhone';
import { AdminPanel } from '../screens/admin/AdminPanel';
import { DisaApp } from '../screens/app/DisaApp';
import { PosScreen } from '../screens/pos/PosScreen';

/** Full screen on a real phone; a drawn device centred on a laptop. */
function SinglePhone({ children }: { children: ReactNode }) {
  const isPhone = useIsPhone();
  const { ref, scale } = useFitScale<HTMLDivElement>(FRAME_WIDTH, FRAME_HEIGHT);
  if (isPhone) {
    return (
      <>
        <PhoneFrame bare>{children}</PhoneFrame>
        <PresenterMenu corner="top-center" />
      </>
    );
  }
  return (
    <div ref={ref} className="flex h-screen items-center justify-center overflow-hidden bg-disa-bg p-4">
      <div style={{ width: FRAME_WIDTH * scale, height: FRAME_HEIGHT * scale }}>
        <div className="origin-top-left" style={{ transform: `scale(${scale})` }}>
          <PhoneFrame>{children}</PhoneFrame>
        </div>
      </div>
      <PresenterMenu />
    </div>
  );
}

export function DriverPage() {
  return (
    <SinglePhone>
      <DisaApp userId="u1" />
    </SinglePhone>
  );
}

export function CopilotPage() {
  const { id } = useParams();
  const userId: UserId | undefined = COPILOT_IDS.find((c) => c === id);
  if (!userId) return <NotFound />;
  return (
    <SinglePhone>
      <DisaApp userId={userId} />
    </SinglePhone>
  );
}

export function PosPage() {
  return (
    <SinglePhone>
      <PosScreen />
    </SinglePhone>
  );
}

export function PanelPage() {
  return (
    <div className="h-screen overflow-y-auto">
      <AdminPanel />
      <PresenterMenu />
    </div>
  );
}

export function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 bg-disa-bg text-center">
      <p className="font-display text-[22px] text-disa-blue">Pantalla no encontrada</p>
      <p className="text-disa-gray">Copilotos disponibles: {COPILOT_IDS.map((c) => `/copiloto/${c}`).join(', ')}</p>
      <Link to="/demo" className="text-disa-blue underline">
        Ir al modo presentador
      </Link>
    </div>
  );
}
