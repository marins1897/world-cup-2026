import { useState } from 'react';
import { Match, Bet, BetStatus, STAGE_LABELS } from '../types';
import { useLeague } from '../context/LeagueContext';

const STATUS_CFG: Record<BetStatus, { label: string; cls: string; next: BetStatus }> = {
  pending: {
    label: 'Na čekanju',
    cls: 'bg-slate-600/80 text-slate-300 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/30 border border-transparent',
    next: 'win',
  },
  win: {
    label: '✓ Dobitno',
    cls: 'bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/30',
    next: 'loss',
  },
  loss: {
    label: '✗ Izgubljeno',
    cls: 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30',
    next: 'pending',
  },
};

const GROUP_COLORS: Record<string, string> = {
  A: 'bg-violet-500/20 text-violet-300', B: 'bg-blue-500/20 text-blue-300',
  C: 'bg-cyan-500/20 text-cyan-300',     D: 'bg-teal-500/20 text-teal-300',
  E: 'bg-green-500/20 text-green-300',   F: 'bg-yellow-500/20 text-yellow-300',
  G: 'bg-orange-500/20 text-orange-300', H: 'bg-red-500/20 text-red-300',
  I: 'bg-pink-500/20 text-pink-300',     J: 'bg-rose-500/20 text-rose-300',
  K: 'bg-indigo-500/20 text-indigo-300', L: 'bg-purple-500/20 text-purple-300',
};

function playerNet(bets: Bet[]): number {
  return bets.reduce((t, b) => {
    if (b.status === 'win') return t + b.odds;
    if (b.status === 'loss') return t - b.odds;
    return t;
  }, 0);
}

interface Props { match: Match }

export default function MatchCard({ match }: Props) {
  const { state, dispatch } = useLeague();
  const [editingTeams, setEditingTeams] = useState(false);
  const [editHome, setEditHome] = useState(match.homeTeam);
  const [editAway, setEditAway] = useState(match.awayTeam);

  function saveTeamEdit() {
    if (!editHome.trim() || !editAway.trim()) return;
    dispatch({ type: 'UPDATE_KNOCKOUT_TEAMS', matchId: match.id, homeTeam: editHome.trim(), awayTeam: editAway.trim() });
    setEditingTeams(false);
  }

  const tz = 'Europe/Zagreb';
  const dt = match.kickoffUTC ? new Date(match.kickoffUTC) : null;
  const dateStr = dt
    ? dt.toLocaleDateString('hr-HR', { timeZone: tz, day: 'numeric', month: 'short', year: 'numeric' })
    : new Date(match.date + 'T12:00:00').toLocaleDateString('hr-HR', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = dt
    ? dt.toLocaleTimeString('hr-HR', { timeZone: tz, hour: '2-digit', minute: '2-digit' })
    : null;

  const stageBadge = match.stage === 'group' ? `K${match.matchday}` : STAGE_LABELS[match.stage];
  const hasPlayers = state.players.length > 0;

  return (
    <div className={`card transition-opacity ${match.isFinished ? 'opacity-75' : ''}`}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="px-4 py-2.5 bg-slate-900/50 border-b border-slate-700 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
          {stageBadge}
        </span>
        {match.group && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${GROUP_COLORS[match.group] ?? 'bg-slate-600 text-slate-300'}`}>
            Grupa {match.group}
          </span>
        )}
        {match.isFinished && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-600 text-slate-500">
            ZAKLJUČANO
          </span>
        )}
        <div className="flex-1 min-w-0 text-right text-xs text-slate-500 truncate">
          {dateStr}{timeStr ? ` · ${timeStr} CET` : ''} · {match.venue}
        </div>
        <button
          title={match.isFinished ? 'Otključaj utakmicu' : 'Označi kao završenu (zaključava oklade)'}
          onClick={() => dispatch({ type: 'TOGGLE_FINISHED', matchId: match.id })}
          className={`text-base leading-none transition-colors ${match.isFinished ? 'text-amber-400 hover:text-amber-300' : 'text-slate-600 hover:text-slate-400'}`}
        >
          {match.isFinished ? '🔒' : '🔓'}
        </button>
      </div>

      {/* ── Match title ─────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-slate-700">
        {editingTeams ? (
          <div className="flex flex-wrap items-center gap-2">
            <input className="input flex-1 min-w-[110px] font-semibold" value={editHome} onChange={e => setEditHome(e.target.value)} placeholder="Domaćin" />
            <span className="text-slate-500 font-bold">vs</span>
            <input className="input flex-1 min-w-[110px] font-semibold" value={editAway} onChange={e => setEditAway(e.target.value)} placeholder="Gost" />
            <button className="btn-primary text-xs" onClick={saveTeamEdit}>Spremi</button>
            <button className="btn-ghost text-xs" onClick={() => { setEditHome(match.homeTeam); setEditAway(match.awayTeam); setEditingTeams(false); }}>Odustani</button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="font-bold text-base flex-1 text-slate-100">
              {match.homeTeam}
              <span className="text-slate-500 font-normal mx-2 text-sm">vs</span>
              {match.awayTeam}
            </span>
            {match.isKnockout && !match.isFinished && (
              <button className="btn-ghost text-xs" onClick={() => { setEditHome(match.homeTeam); setEditAway(match.awayTeam); setEditingTeams(true); }}>
                ✏ Uredi timove
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Betting section ─────────────────────────────────────────── */}
      {!hasPlayers ? (
        <div className="px-4 py-4 text-slate-500 text-sm italic">
          Dodaj igrače gore za klađenje.
        </div>
      ) : (
        <div className="divide-y divide-slate-700/60">
          {state.players.map(player => {
            const bets: Bet[] = match.bets[player.id] ?? [];
            const net = playerNet(bets);
            const hasSettled = bets.some(b => b.status !== 'pending');

            return (
              <div key={player.id} className="px-4 py-3 space-y-2">
                {/* Player row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-200 text-sm">{player.name}</span>
                  <div className="flex items-center gap-2">
                    {hasSettled && (
                      <span className={`text-xs font-bold tabular-nums ${net > 0 ? 'text-green-400' : net < 0 ? 'text-red-400' : 'text-slate-500'}`}>
                        {net > 0 ? '+' : ''}{net.toFixed(2)} bod
                      </span>
                    )}
                    {!match.isFinished && (
                      <button
                        className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors px-2 py-0.5 rounded border border-indigo-500/30 hover:border-indigo-400/50 bg-indigo-500/10"
                        onClick={() => dispatch({ type: 'ADD_BET', matchId: match.id, playerId: player.id })}
                      >
                        + Dodaj okladu
                      </button>
                    )}
                  </div>
                </div>

                {/* Bet rows */}
                {bets.length > 0 && (
                  <div className="space-y-1.5 pl-2 border-l-2 border-slate-700">
                    {bets.map(bet => (
                      <BetRow
                        key={bet.id}
                        bet={bet}
                        matchId={match.id}
                        playerId={player.id}
                        locked={match.isFinished}
                        dispatch={dispatch}
                      />
                    ))}
                  </div>
                )}

                {bets.length === 0 && !match.isFinished && (
                  <p className="text-slate-600 text-xs pl-2">Nema oklada — klikni + Dodaj okladu.</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Individual bet row ────────────────────────────────────────────────────────
interface BetRowProps {
  bet: Bet;
  matchId: string;
  playerId: string;
  locked: boolean;
  dispatch: React.Dispatch<Parameters<typeof import('../context/LeagueContext').useLeague extends () => { dispatch: infer D } ? D : never>[0]>;
}

function BetRow({ bet, matchId, playerId, locked, dispatch }: BetRowProps) {
  const cfg = STATUS_CFG[bet.status];

  return (
    <div className={`flex flex-wrap sm:flex-nowrap items-center gap-1.5 rounded-lg px-2 py-1.5 transition-colors ${
      bet.status === 'win' ? 'bg-green-500/5' : bet.status === 'loss' ? 'bg-red-500/5' : 'bg-slate-700/30'
    }`}>
      {/* Tip input */}
      <input
        className="input flex-1 min-w-[140px] text-sm h-8 px-2 bg-slate-800/80"
        placeholder="npr. Brazil pobijedi, Više od 2.5 gola, Oba daju gol…"
        value={bet.tip}
        disabled={locked}
        maxLength={64}
        onChange={e => dispatch({ type: 'UPDATE_BET', matchId, playerId, betId: bet.id, patch: { tip: e.target.value } })}
      />

      {/* Odds input */}
      <div className="relative">
        <input
          type="number"
          className="input w-20 text-sm h-8 px-2 text-right pr-1 bg-slate-800/80 tabular-nums"
          placeholder="2.00"
          value={bet.odds}
          disabled={locked}
          step="0.01"
          min="1.01"
          onChange={e => {
            const v = parseFloat(e.target.value);
            dispatch({ type: 'UPDATE_BET', matchId, playerId, betId: bet.id, patch: { odds: isNaN(v) ? 1.0 : v } });
          }}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 pointer-events-none">×</span>
      </div>

      {/* Status cycle button */}
      <button
        className={`text-xs font-bold px-3 h-8 rounded-lg whitespace-nowrap transition-all ${cfg.cls} ${locked ? 'cursor-default' : 'cursor-pointer'}`}
        onClick={() => !locked && dispatch({ type: 'CYCLE_STATUS', matchId, playerId, betId: bet.id })}
        disabled={locked}
        title="Klikni za promjenu: Na čekanju → Dobitno → Izgubljeno → Na čekanju"
      >
        {cfg.label}
      </button>

      {/* Delete */}
      {!locked && (
        <button
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
          onClick={() => dispatch({ type: 'REMOVE_BET', matchId, playerId, betId: bet.id })}
          title="Ukloni okladu"
        >
          ✕
        </button>
      )}
    </div>
  );
}
