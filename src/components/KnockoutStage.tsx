import { useState } from 'react';
import { useLeague } from '../context/LeagueContext';
import MatchCard from './MatchCard';
import { Stage, STAGE_LABELS } from '../types';

const KNOCKOUT_ORDER: Stage[] = ['r32', 'r16', 'qf', 'sf', 'third', 'final'];

function byKickoff(a: { kickoffUTC?: string }, b: { kickoffUTC?: string }) {
  if (!a.kickoffUTC) return 1;
  if (!b.kickoffUTC) return -1;
  return a.kickoffUTC < b.kickoffUTC ? -1 : a.kickoffUTC > b.kickoffUTC ? 1 : 0;
}

const STAGE_ICONS: Record<Stage, string> = {
  group: '🏟',
  r32: '⚔️',
  r16: '16',
  qf: '🏅',
  sf: '🌟',
  third: '🥉',
  final: '🏆',
};

export default function KnockoutStage() {
  const { state } = useLeague();
  const [sortUpcoming, setSortUpcoming] = useState(false);

  const knockoutMatches = state.matches.filter(m => m.isKnockout);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-slate-500 text-sm flex-1 min-w-0">
          Klikni <strong className="text-slate-300">✏ Uredi timove</strong> na utakmici za unos
          kvalificiranih ekipa nakon završetka grupne faze.
        </p>
        <button
          onClick={() => setSortUpcoming(v => !v)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-sm font-medium border transition-all whitespace-nowrap ${
            sortUpcoming
              ? 'bg-indigo-600 text-white border-indigo-500 shadow'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-700'
          }`}
        >
          ⏱ Nadolazeće
        </button>
      </div>

      {KNOCKOUT_ORDER.map(stage => {
        const raw = knockoutMatches.filter(m => m.stage === stage);
        if (raw.length === 0) return null;
        const now = Date.now();
        const matches = sortUpcoming
          ? [...raw]
              .filter(m => !m.kickoffUTC || new Date(m.kickoffUTC).getTime() > now)
              .sort(byKickoff)
          : raw;

        return (
          <section key={stage}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{STAGE_ICONS[stage]}</span>
              <h3 className="font-bold text-slate-200 text-lg">{STAGE_LABELS[stage]}</h3>
              <div className="flex-1 h-px bg-slate-700" />
              <span className="text-slate-500 text-xs">{matches.length} utakmica</span>
            </div>

            <div className={`grid gap-3 ${stage === 'final' ? '' : 'sm:grid-cols-2 lg:grid-cols-2'}`}>
              {matches.map(m => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
