import { useState } from 'react';
import { useLeague } from '../context/LeagueContext';
import MatchCard from './MatchCard';

const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'] as const;

function byKickoff(a: { kickoffUTC?: string }, b: { kickoffUTC?: string }) {
  if (!a.kickoffUTC) return 1;
  if (!b.kickoffUTC) return -1;
  return a.kickoffUTC < b.kickoffUTC ? -1 : a.kickoffUTC > b.kickoffUTC ? 1 : 0;
}

export default function GroupStage() {
  const { state } = useLeague();
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedMD, setSelectedMD] = useState<number>(0); // 0 = all
  const [sortUpcoming, setSortUpcoming] = useState(false);

  const groupMatches = state.matches.filter(m => m.stage === 'group');

  const filtered = groupMatches.filter(m => {
    const groupOk = selectedGroup === 'all' || m.group === selectedGroup;
    const mdOk = selectedMD === 0 || m.matchday === selectedMD;
    return groupOk && mdOk;
  });

  const now = Date.now();
  const displayed = sortUpcoming
    ? [...filtered]
        .filter(m => !m.kickoffUTC || new Date(m.kickoffUTC).getTime() > now)
        .sort(byKickoff)
    : filtered;

  return (
    <div className="space-y-4">
      {/* ─── Filters ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        {/* Group filter */}
        <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1 border border-slate-700 overflow-x-auto scrollbar-thin">
          <FilterBtn active={selectedGroup === 'all'} onClick={() => setSelectedGroup('all')}>
            Sve
          </FilterBtn>
          {GROUPS.map(g => (
            <FilterBtn
              key={g}
              active={selectedGroup === g}
              onClick={() => setSelectedGroup(g)}
            >
              {g}
            </FilterBtn>
          ))}
        </div>

        {/* Matchday filter */}
        <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1 border border-slate-700">
          {[['Sve', 0], ['1. kolo', 1], ['2. kolo', 2], ['3. kolo', 3]].map(([label, val]) => (
            <FilterBtn
              key={val}
              active={selectedMD === val}
              onClick={() => setSelectedMD(val as number)}
            >
              {label}
            </FilterBtn>
          ))}
        </div>

        {/* Sort toggle */}
        <button
          onClick={() => setSortUpcoming(v => !v)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-sm font-medium border transition-all ${
            sortUpcoming
              ? 'bg-indigo-600 text-white border-indigo-500 shadow'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-700'
          }`}
        >
          ⏱ Nadolazeće
        </button>
      </div>

      {/* ─── Count ────────────────────────────────────────────────────── */}
      <p className="text-slate-500 text-xs">
        Prikazano {displayed.length} od {groupMatches.length} grupnih utakmica
        {sortUpcoming && ' · samo nadolazeće'}
      </p>

      {/* ─── Match Cards ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        {displayed.map(m => (
          <MatchCard key={m.id} match={m} />
        ))}
        {displayed.length === 0 && (
          <div className="text-center py-12 text-slate-500">Nema utakmica za ovaj odabir.</div>
        )}
      </div>
    </div>
  );
}

function FilterBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
        active
          ? 'bg-indigo-600 text-white shadow'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
      }`}
    >
      {children}
    </button>
  );
}
