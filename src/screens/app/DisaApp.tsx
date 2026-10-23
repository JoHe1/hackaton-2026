import { useEffect, useRef } from 'react';
import { SYSTEM_NAV_HEIGHT, SystemNavBar } from '../../components/StatusBar';
import { SummerWrapped } from '../../components/SummerWrapped';
import { ToastHost } from '../../components/ToastHost';
import { DEMO_UNAVAILABLE } from '../../data/home';
import { SUMMER_WRAPPED } from '../../data/summer';
import { DRIVER_ID, type UserId } from '../../data/users';
import { usePhone } from '../../lib/phoneContext';
import { useDemoStore } from '../../store/demoStore';
import { ScannerOverlay } from '../copilot/ScannerOverlay';
import { ActionsSheet } from './ActionsSheet';
import { BOTTOM_NAV_HEIGHT, BottomNav } from './BottomNav';
import { CopilotosHub } from './CopilotosHub';
import { HomeScreen } from './HomeScreen';
import { OffersScreen } from './OffersScreen';

// Keeps snackbars above the raised "+" button of the bottom navigation.
const FAB_CLEARANCE = 56;

/** Mi Energía DISA app shell for one user, with DISA Copilotos integrated. */
export function DisaApp({ userId }: { userId: UserId }) {
  const nav = useDemoStore((s) => s.nav[userId]);
  const setNav = useDemoStore((s) => s.setNav);
  const showToast = useDemoStore((s) => s.showToast);
  const startCopilots = useDemoStore((s) => s.startCopilots);
  const { framed } = usePhone();
  const scroller = useRef<HTMLDivElement>(null);
  const isDriver = userId === DRIVER_ID;

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [nav.tab, nav.hubTab]);

  const unavailable = () => showToast(userId, DEMO_UNAVAILABLE);
  const openCopilotos = () => setNav(userId, { tab: 'copilotos', hubTab: 'pase', overlay: null });
  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: SUMMER_WRAPPED.title, text: SUMMER_WRAPPED.shareText });
        return;
      }
      await navigator.clipboard?.writeText(SUMMER_WRAPPED.shareText);
      showToast(userId, 'Texto copiado: listo para tu historia', 'success');
    } catch {
      // The user closed the native share sheet: nothing to do.
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-white">
      <div ref={scroller} className="no-scrollbar relative flex-1 overflow-y-auto">
        {nav.tab === 'inicio' && <HomeScreen userId={userId} onOpenCopilotos={openCopilotos} onUnavailable={unavailable} />}
        {nav.tab === 'ofertas' && <OffersScreen userId={userId} />}
        {nav.tab === 'copilotos' && <CopilotosHub userId={userId} />}
      </div>
      <BottomNav
        tab={nav.tab}
        onTab={(tab) => setNav(userId, { tab, overlay: null })}
        onActions={() => setNav(userId, { overlay: 'actions' })}
        onUnavailable={unavailable}
      />
      <SystemNavBar />
      {nav.overlay === 'actions' && (
        <ActionsSheet
          isDriver={isDriver}
          onStart={startCopilots}
          onJoin={() => setNav(userId, { overlay: 'scanner' })}
          onUnavailable={unavailable}
          onClose={() => setNav(userId, { overlay: null })}
        />
      )}
      {nav.overlay === 'scanner' && <ScannerOverlay userId={userId} />}
      {nav.overlay === 'summer' && <SummerWrapped onShare={share} onClose={() => setNav(userId, { overlay: null })} />}
      <ToastHost device={userId} bottom={(framed ? SYSTEM_NAV_HEIGHT : 0) + BOTTOM_NAV_HEIGHT + FAB_CLEARANCE} />
    </div>
  );
}
