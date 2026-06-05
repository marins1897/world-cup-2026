import { useState } from 'react';
import { useLeague } from './context/LeagueContext';
import Leaderboard from './components/Leaderboard';
import PlayerManager from './components/PlayerManager';
import GroupStage from './components/GroupStage';
import KnockoutStage from './components/KnockoutStage';
import ShareLeague from './components/ShareLeague';

type Tab = 'group' | 'knockout';

export default function App() {
  const { loading } = useLeague();
  const [tab, setTab] = useState<Tab>('group');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">⚽</div>
          <p className="text-slate-400 text-sm">Spajanje na ligu…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* ─── Header ───────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-lg shadow-black/30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-2xl flex-shrink-0">⚽</span>
            <div className="min-w-0">
              <h1 className="font-extrabold text-slate-100 text-lg leading-tight tracking-tight">
                SP 2026 Kladionica
              </h1>
              <p className="text-slate-500 text-[11px]">FIFA Svjetsko prvenstvo · Kanada · Meksiko · SAD</p>
            </div>
          </div>
          <ShareLeague />
        </div>
      </header>

      {/* ─── Main ─────────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        <Leaderboard />
        <PlayerManager />

        <div className="flex gap-1 bg-slate-800 rounded-xl p-1 border border-slate-700 w-fit">
          <TabBtn active={tab === 'group'} onClick={() => setTab('group')}>
            🏟 Grupna faza
          </TabBtn>
          <TabBtn active={tab === 'knockout'} onClick={() => setTab('knockout')}>
            ⚔️ Nokaut faza
          </TabBtn>
        </div>

        {tab === 'group' ? <GroupStage /> : <KnockoutStage />}
      </main>

      <footer className="border-t border-slate-800 mt-16 py-6 text-center text-slate-600 text-xs">
        SP 2026 Kladionica · Sinkronizacija uživo putem Firebase · Podijeli link i igraj s prijateljima
      </footer>
    </div>
  );
}

function TabBtn({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
        active
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
      }`}
    >
      {children}
    </button>
  );
}
