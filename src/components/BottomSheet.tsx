import type { ReactNode } from 'react';

export function BottomSheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <button type="button" aria-label="Cerrar" className="animate-fade-in absolute inset-0 bg-disa-ink/45" onClick={onClose} />
      <div className="animate-sheet-in relative rounded-t-3xl bg-white px-5 pb-6 pt-3">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-disa-line" />
        <h2 className="mb-3 font-display text-[22px] font-medium text-disa-blue">{title}</h2>
        {children}
      </div>
    </div>
  );
}
