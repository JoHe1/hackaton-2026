import { useState } from 'react';
import { AlertTriangle, Sparkles, X } from 'lucide-react';
import { DisaLogo } from '../../components/DisaLogo';
import { BUDGET_LEVELS, FICTIONAL_DATA_LABEL, METRICS, RISK_ALERTS, WHEEL_ODDS, type BudgetLevel } from '../../data/admin';
import { PARTNER_PRIZES, PRIZE_EMOJI, WHEEL } from '../../data/rewards';
import { formatDecimal, formatEur, formatInt, formatPercent } from '../../lib/format';
import { useDemoStore } from '../../store/demoStore';

const KPIS = [
  { label: 'Usuarios nuevos traídos por copilotos', value: formatInt(METRICS.newUsersFromCopilots) },
  { label: 'Copilotos por conductor', value: formatDecimal(METRICS.copilotsPerDriver) },
  { label: 'Canje de premios en tienda', value: formatPercent(METRICS.storeRedemptionRate) },
  { label: 'Coste por usuario nuevo', value: formatEur(METRICS.costPerNewUser) },
  { label: 'Usuarios de 15 a 24 años', value: formatPercent(METRICS.share15to24) },
];

export function AdminPanel({ onClose }: { onClose?: () => void }) {
  const highlighted = useDemoStore((s) => s.highlightedAlert);
  const [level, setLevel] = useState<BudgetLevel>('medio');
  const odds = WHEEL_ODDS[level];
  const maxOdd = Math.max(...Object.values(odds));
  return (
    <div className="min-h-full bg-disa-bg">
      <header className="flex items-center gap-4 border-b border-disa-line bg-white px-6 py-3">
        <DisaLogo width={92} />
        <div className="flex-1">
          <h1 className="font-display text-[24px] font-medium text-disa-blue">Panel DISA · Copilotos</h1>
          <p className="text-[13px] text-disa-gray">Seguimiento del piloto</p>
        </div>
        <span className="rounded-full bg-disa-yellow px-3 py-1 text-[13px] font-bold text-disa-ink">{FICTIONAL_DATA_LABEL}</span>
        {onClose && (
          <button type="button" aria-label="Cerrar panel" onClick={onClose} className="rounded-full p-2 hover:bg-disa-bg">
            <X size={22} />
          </button>
        )}
      </header>

      <div className="mx-auto grid max-w-6xl gap-5 p-6">
        <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {KPIS.map((k) => (
            <div key={k.label} className="rounded-2xl border border-disa-line bg-white p-4">
              <p className="font-display text-[32px] font-semibold leading-none text-disa-blue">{k.value}</p>
              <p className="mt-2 text-[13px] text-disa-gray">{k.label}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-disa-line bg-white p-5">
            <h2 className="flex items-center gap-2 font-display text-[20px] font-medium text-disa-blue">
              <Sparkles size={20} /> Alertas de la IA · detección de abuso
            </h2>
            <ul className="mt-3 space-y-2">
              {RISK_ALERTS.map((a) => (
                <li
                  key={a.pass}
                  className={`flex items-center gap-3 rounded-xl border p-3 ${
                    highlighted === a.pass ? 'animate-pulse-ring border-disa-red bg-[#FDECEC]' : 'border-disa-line'
                  }`}
                >
                  <AlertTriangle size={20} className={a.score >= 0.9 ? 'text-disa-red' : 'text-[#E8902A]'} />
                  <div className="flex-1">
                    <p className="text-[14px] font-medium">
                      Pase sospechoso <span className="font-mono">{a.pass}</span>
                    </p>
                    <p className="text-[13px] text-disa-gray">{a.reason}</p>
                  </div>
                  <div className="w-20 text-right">
                    <p className="font-mono text-[15px] font-bold">{formatDecimal(a.score)}</p>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-disa-line">
                      <div className="h-full bg-disa-red" style={{ width: `${a.score * 100}%` }} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-disa-line bg-white p-5">
            <h2 className="font-display text-[20px] font-medium text-disa-blue">Presupuesto mensual de la ruleta</h2>
            <p className="text-[13px] text-disa-gray">La IA ajusta las probabilidades. Cine y conciertos los financian marcas socias.</p>
            <input
              type="range"
              min={0}
              max={BUDGET_LEVELS.length - 1}
              step={1}
              value={BUDGET_LEVELS.indexOf(level)}
              onChange={(e) => setLevel(BUDGET_LEVELS[Number(e.target.value)])}
              className="mt-4 w-full accent-[#1D5798]"
              aria-label="Presupuesto de la ruleta"
            />
            <div className="flex justify-between text-[13px] font-medium capitalize">
              {BUDGET_LEVELS.map((l) => (
                <span key={l} className={l === level ? 'text-disa-blue' : 'text-disa-gray'}>{l}</span>
              ))}
            </div>
            <ul className="mt-4 space-y-1.5">
              {WHEEL.map((prize) => (
                <li key={prize} className="flex items-center gap-2 text-[13px]">
                  <span className="w-5">{PRIZE_EMOJI[prize]}</span>
                  <span className="w-40 whitespace-nowrap">
                    {prize}
                    {PARTNER_PRIZES.includes(prize) && <span className="ml-1 rounded bg-disa-yellow px-1 text-[10px] font-bold">SOCIO</span>}
                  </span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-disa-bg">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${PARTNER_PRIZES.includes(prize) ? 'bg-disa-yellow' : 'bg-disa-blue'}`}
                      style={{ width: `${(odds[prize] / maxOdd) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono">{odds[prize]} %</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
