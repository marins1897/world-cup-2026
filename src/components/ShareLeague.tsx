import { useState } from 'react';
import { useLeague } from '../context/LeagueContext';
import { LEAGUE_CODE } from '../context/LeagueContext';

export default function ShareLeague() {
  const { connected } = useLeague();
  const [copied, setCopied] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const url = window.location.href;

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(
      `Pridruži se našoj SP 2026 Kladionici! ⚽🏆\nOtvori ovaj link — oklade se sinkroniziraju uživo za sve:\n${url}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  return (
    <div className="flex flex-col items-start sm:items-end gap-1.5 relative">
      <div className="flex items-center gap-2">
        {/* Connection dot */}
        <span
          title={connected ? 'Uživo — sinkronizirano' : 'Spajanje…'}
          className={`w-2 h-2 rounded-full flex-shrink-0 ${connected ? 'bg-green-400 shadow-[0_0_6px_#4ade80]' : 'bg-amber-400 animate-pulse'}`}
        />

        <button
          className="text-slate-400 hover:text-slate-200 transition-colors text-sm leading-none"
          onClick={() => setShowHelp(v => !v)}
          title="Kako dijeljenje funkcionira?"
        >
          ❓
        </button>

        <button
          className={`btn-ghost text-xs ${copied ? 'text-green-400' : ''}`}
          onClick={handleCopy}
        >
          {copied ? '✓ Kopirano!' : '🔗 Kopiraj link'}
        </button>

        <button className="btn-primary text-xs" onClick={handleWhatsApp}>
          💬 WhatsApp
        </button>
      </div>

      <p className="text-slate-600 text-[11px] tracking-wide">
        Kod lige: <span className="text-slate-500 font-mono font-bold">{LEAGUE_CODE}</span>
      </p>

      {/* Help popover */}
      {showHelp && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setShowHelp(false)} />
          <div className="absolute top-full right-0 mt-2 z-30 w-[min(380px,94vw)] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl shadow-black/50 p-5 space-y-3">
            <h3 className="font-bold text-slate-200 text-sm">Kako dijeljenje funkcionira</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Svi koji otvore <strong className="text-slate-200">isti link</strong> vide iste oklade, ažurirane uživo — kao Google Docs, ali za klađenje na nogomet.
            </p>
            <ul className="text-slate-400 text-sm space-y-1.5">
              <li>📤 <strong className="text-slate-300">Podijeli link</strong> putem WhatsAppa (koristi gumb iznad).</li>
              <li>👥 <strong className="text-slate-300">Svako s linkom</strong> može dodavati igrače, postavljati oklade i označavati rezultate.</li>
              <li>⚡ <strong className="text-slate-300">Promjene se pojavljuju odmah</strong> za sve prijatelje — bez osvježavanja.</li>
              <li>⚔️ <strong className="text-slate-300">Ekipe nokaut faze:</strong> klikni "✏ Uredi timove" na utakmici nokaut faze nakon završetka grupne faze. Svi vide odmah.</li>
            </ul>
            <p className="text-slate-500 text-xs">
              Želiš posebnu ligu? Otvori aplikaciju u novom tabu bez koda i stvorit će se nova liga.
            </p>
            <button className="btn-ghost text-xs w-full" onClick={() => setShowHelp(false)}>Zatvori</button>
          </div>
        </>
      )}
    </div>
  );
}
