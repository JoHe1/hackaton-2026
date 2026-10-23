import { create } from 'zustand';
import { CONFIG } from '../data/config';
import { COPILOT_IDS, DRIVER_ID, getUser, type UserId } from '../data/users';
import { DEMO_TICKET } from '../data/ticket';
import { MYSTERY_STATION } from '../data/explorer';
import { AI_ALERT_PASS, FAR_AWAY_KM, SECURITY_MESSAGES, SMALL_REFUEL_LITERS } from '../data/security';
import { formatKm } from '../lib/format';

export type DeviceId = UserId | 'pos' | 'panel' | 'presenter';
export type AppTab = 'inicio' | 'ofertas' | 'copilotos';
export type HubTab = 'pase' | 'retos' | 'ranking' | 'premios';
export type Overlay = null | 'actions' | 'scanner' | 'summer';
export type Phase = 'idle' | 'qr' | 'pass' | 'done';
export type PosStep = 'idle' | 'card' | 'ticket';
export type SavingsChoice = 'discount' | 'points';
export type ToastTone = 'info' | 'success' | 'error';
export type ScanMode = 'live' | 'screenshot';

export type SceneId =
  | 'jumpQr' | 'jumpPass' | 'jumpDone'
  | 'screenshot' | 'farAway' | 'repeated' | 'smallRefuel' | 'expired' | 'locked' | 'aiAlert';

export interface NavState {
  tab: AppTab;
  hubTab: HubTab;
  overlay: Overlay;
}

export interface Toast {
  id: number;
  text: string;
  tone: ToastTone;
}

export interface RejectedScan {
  userId: UserId;
  reason: string;
}

export interface PosTicket {
  liters: number;
  copilotsApplied: number;
  closed: boolean;
}

export interface DemoData {
  phase: Phase;
  joined: UserId[];
  rejected: RejectedScan[];
  passStartedAt: number | null;
  passForcedExpired: boolean;
  posStep: PosStep;
  ticket: PosTicket | null;
  choice: SavingsChoice | null;
  spun: Partial<Record<UserId, boolean>>;
  driverSpinsUsed: number;
  nav: Record<UserId, NavState>;
  toasts: Partial<Record<DeviceId, Toast>>;
  highlightedAlert: string | null;
  panelOpen: boolean;
}

interface DemoActions {
  startCopilots: () => void;
  scan: (userId: UserId, mode: ScanMode) => void;
  confirmPass: () => void;
  swipeCard: () => void;
  charge: (liters: number) => void;
  chooseSavings: (choice: SavingsChoice) => void;
  markCopilotSpun: (userId: UserId) => void;
  markDriverSpun: () => void;
  setNav: (userId: UserId, nav: Partial<NavState>) => void;
  showToast: (device: DeviceId, text: string, tone?: ToastTone) => void;
  dismissToast: (device: DeviceId, id: number) => void;
  setPanelOpen: (open: boolean) => void;
  runScene: (scene: SceneId) => void;
  reset: () => void;
}

export type DemoState = DemoData & DemoActions;

const TOAST_MS = 3500;
const homeNav = (): NavState => ({ tab: 'inicio', hubTab: 'pase', overlay: null });
const passNav = (): NavState => ({ tab: 'copilotos', hubTab: 'pase', overlay: null });

function initialData(): DemoData {
  return {
    phase: 'idle',
    joined: [],
    rejected: [],
    passStartedAt: null,
    passForcedExpired: false,
    posStep: 'idle',
    ticket: null,
    choice: null,
    spun: {},
    driverSpinsUsed: 0,
    nav: { u1: homeNav(), u2: homeNav(), u3: homeNav(), u4: homeNav() },
    toasts: {},
    highlightedAlert: null,
    panelOpen: false,
  };
}

// ---------- selectors (pure, reused by screens) ----------

export function passRemainingSeconds(state: Pick<DemoData, 'passStartedAt' | 'passForcedExpired'>, now: number): number {
  if (state.passForcedExpired || state.passStartedAt === null) return 0;
  const end = state.passStartedAt + CONFIG.passMinutes * 60_000;
  return Math.max(0, (end - now) / 1000);
}

export function isPassUsable(state: DemoData, now: number): boolean {
  return state.phase === 'pass' && passRemainingSeconds(state, now) > 0;
}

export function isRewardUnlocked(state: DemoData, userId: UserId): boolean {
  return state.phase === 'done' && state.joined.includes(userId);
}

let toastSeq = 0;
const toastTimers = new Map<DeviceId, ReturnType<typeof setTimeout>>();

export const useDemoStore = create<DemoState>()((set, get) => {
  const toast = (device: DeviceId, text: string, tone: ToastTone = 'info') => {
    const id = ++toastSeq;
    set((s) => ({ toasts: { ...s.toasts, [device]: { id, text, tone } } }));
    const previous = toastTimers.get(device);
    if (previous) clearTimeout(previous);
    toastTimers.set(device, setTimeout(() => get().dismissToast(device, id), TOAST_MS));
  };

  const withNav = (s: DemoData, ids: UserId[], nav: NavState) => {
    const next = { ...s.nav };
    ids.forEach((id) => { next[id] = nav; });
    return next;
  };

  /** Puts the demo in "pass active with every copilot on board" (base state for several scenes). */
  const clearToasts = () => {
    toastTimers.forEach((timer) => clearTimeout(timer));
    toastTimers.clear();
  };

  const forcePassActive = () => {
    clearToasts();
    set((s) => ({
      ...initialData(),
      phase: 'pass',
      joined: [...COPILOT_IDS],
      passStartedAt: Date.now(),
      nav: withNav(s, [DRIVER_ID, ...COPILOT_IDS], passNav()),
    }));
  };

  const forceQrActive = () => {
    clearToasts();
    set((s) => ({
      ...initialData(),
      phase: 'qr',
      nav: { ...withNav(s, [DRIVER_ID], passNav()), u2: homeNav(), u3: homeNav(), u4: homeNav() },
    }));
  };

  return {
    ...initialData(),

    startCopilots: () => {
      if (get().phase !== 'idle') {
        set((s) => ({ nav: withNav(s, [DRIVER_ID], passNav()) }));
        return;
      }
      set((s) => ({ phase: 'qr', nav: withNav(s, [DRIVER_ID], passNav()) }));
    },

    scan: (userId, mode) => {
      const state = get();
      const driver = getUser(DRIVER_ID);
      const user = getUser(userId);
      if (mode === 'screenshot') {
        set((s) => ({ rejected: [...s.rejected, { userId, reason: SECURITY_MESSAGES.screenshot }] }));
        toast(userId, SECURITY_MESSAGES.screenshot, 'error');
        toast(DRIVER_ID, `${user.name}: ${SECURITY_MESSAGES.screenshot}`, 'error');
        return;
      }
      if (state.phase !== 'qr') {
        toast(userId, SECURITY_MESSAGES.noQr, 'error');
        return;
      }
      if (state.joined.includes(userId)) {
        set((s) => ({ nav: withNav(s, [userId], passNav()) }));
        return;
      }
      if (state.joined.length >= CONFIG.maxCopilots) {
        toast(userId, SECURITY_MESSAGES.passFull, 'error');
        return;
      }
      set((s) => ({
        joined: [...s.joined, userId],
        rejected: s.rejected.filter((r) => r.userId !== userId),
        nav: withNav(s, [userId], passNav()),
      }));
      toast(userId, `Te has unido al coche de ${driver.name}`, 'success');
      toast(DRIVER_ID, `${user.name} se ha unido como copiloto`, 'success');
    },

    confirmPass: () => {
      const state = get();
      if (state.phase !== 'qr' || state.joined.length === 0) return;
      set({ phase: 'pass', passStartedAt: Date.now(), passForcedExpired: false });
    },

    swipeCard: () => set({ posStep: 'card', ticket: null, choice: null }),

    charge: (liters) => {
      const state = get();
      const usable = isPassUsable(state, Date.now());
      const applies = usable && liters >= CONFIG.minLiters;
      set({
        posStep: 'ticket',
        ticket: { liters, copilotsApplied: applies ? state.joined.length : 0, closed: !applies },
        choice: null,
      });
      if (usable && !applies) {
        const message = SECURITY_MESSAGES.smallRefuel(CONFIG.minLiters);
        toast('pos', message, 'error');
        toast(DRIVER_ID, message, 'error');
      }
    },

    chooseSavings: (choice) => {
      const state = get();
      if (!state.ticket || state.ticket.closed) return;
      set((s) => ({
        choice,
        ticket: s.ticket ? { ...s.ticket, closed: true } : null,
        phase: 'done',
        nav: withNav(s, [DRIVER_ID, ...s.joined], passNav()),
      }));
      toast('pos', 'Ticket cerrado · pase consumido', 'success');
      if (DEMO_TICKET.station === MYSTERY_STATION.stationId) {
        toast(DRIVER_ID, `¡Gasolinera sorpresa! Entráis en el sorteo: ${MYSTERY_STATION.prize}`, 'success');
      }
      state.joined.forEach((id) => {
        const label = getUser(id).minor ? 'Tu premio ya está disponible' : 'Tu ruleta ya está desbloqueada';
        toast(id, label, 'success');
      });
    },

    markCopilotSpun: (userId) => set((s) => ({ spun: { ...s.spun, [userId]: true } })),
    markDriverSpun: () => set((s) => ({ driverSpinsUsed: s.driverSpinsUsed + 1 })),

    setNav: (userId, nav) => set((s) => ({ nav: { ...s.nav, [userId]: { ...s.nav[userId], ...nav } } })),

    showToast: toast,
    dismissToast: (device, id) =>
      set((s) => {
        if (s.toasts[device]?.id !== id) return s;
        const next = { ...s.toasts };
        delete next[device];
        return { toasts: next };
      }),

    setPanelOpen: (open) => set((s) => ({ panelOpen: open, highlightedAlert: open ? s.highlightedAlert : null })),

    runScene: (scene) => {
      switch (scene) {
        case 'jumpQr':
          forceQrActive();
          return;
        case 'jumpPass':
          forcePassActive();
          return;
        case 'jumpDone':
          forcePassActive();
          get().swipeCard();
          get().charge(DEMO_TICKET.liters);
          get().chooseSavings('discount');
          return;
        // Security scenes always start from a clean base so they never inherit a previous scene.
        case 'screenshot':
          forceQrActive();
          get().scan('u4', 'screenshot');
          return;
        case 'farAway':
          forceQrActive();
          set((s) => ({ nav: withNav(s, ['u2'], { ...homeNav(), overlay: 'scanner' }) }));
          toast('u2', SECURITY_MESSAGES.farAway(formatKm(FAR_AWAY_KM)), 'error');
          return;
        case 'repeated':
          forceQrActive();
          set((s) => ({ nav: withNav(s, ['u3'], { ...homeNav(), overlay: 'scanner' }) }));
          toast('u3', SECURITY_MESSAGES.repeated, 'error');
          return;
        case 'smallRefuel':
          forcePassActive();
          get().swipeCard();
          get().charge(SMALL_REFUEL_LITERS);
          return;
        case 'expired':
          forcePassActive();
          set((s) => ({ passForcedExpired: true, nav: withNav(s, [DRIVER_ID], passNav()) }));
          return;
        case 'locked':
          forcePassActive();
          return;
        case 'aiAlert':
          set({ panelOpen: true, highlightedAlert: AI_ALERT_PASS });
          return;
      }
    },

    reset: () => {
      clearToasts();
      set(initialData());
    },
  };
});

// ---------- cross-tab sync (same browser): /demo and /panel in two tabs stay in step ----------

const CHANNEL_NAME = 'disa-copilotos-demo';
let applyingRemote = false;

function serializable(state: DemoState): DemoData {
  const { phase, joined, rejected, passStartedAt, passForcedExpired, posStep, ticket, choice, spun,
    driverSpinsUsed, nav, toasts, highlightedAlert, panelOpen } = state;
  return { phase, joined, rejected, passStartedAt, passForcedExpired, posStep, ticket, choice, spun,
    driverSpinsUsed, nav, toasts, highlightedAlert, panelOpen };
}

if (typeof BroadcastChannel !== 'undefined') {
  const channel = new BroadcastChannel(CHANNEL_NAME);
  channel.onmessage = (event: MessageEvent<DemoData>) => {
    applyingRemote = true;
    useDemoStore.setState(event.data);
    applyingRemote = false;
  };
  useDemoStore.subscribe((state) => {
    if (applyingRemote) return;
    channel.postMessage(serializable(state));
  });
}
