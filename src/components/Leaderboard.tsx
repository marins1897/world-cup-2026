import { useLeague } from '../context/LeagueContext';
import { Match } from '../types';

export default function Leaderboard() {
  const { state, getScore } = useLeague();

  if (state.players.length === 0) return null;

  const ranked = [...state.players]
    .map(p => ({ ...p, score: getScore(p.id) }))
    .sort((a, b) => b.score - a.score);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="card">
      <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-2">
        <span className="text-lg">🏆</span>
        <h2 className="font-semibold text-slate-200 tracking-wide uppercase text-sm">Ljestvica</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-slate-700">
        {ranked.map((player, i) => {
          const isPositive = player.score > 0;
          const isNegative = player.score < 0;
          const { wins, losses, pending } = getBetStats(player.id, state.matches);

          return (
            <div
              key={player.id}
              className={`flex items-center gap-3 px-4 py-4 bg-slate-800 ${i === 0 ? 'border-t-2 border-indigo-500' : ''}`}
            >
              <span className="text-xl w-7 text-center">
                {medals[i] ?? <span className="text-slate-500 text-sm font-bold">#{i + 1}</span>}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-100 truncate">{player.name}</p>
                <p className="text-xs text-slate-500">
                  {[wins && `${wins}P`, losses && `${losses}G`, pending && `${pending} na čekanju`]
                    .filter(Boolean)
                    .join(' · ') || 'Nema oklada'}
                </p>
              </div>
              <span className={`text-lg font-bold tabular-nums ${isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-slate-400'}`}>
                {isPositive ? '+' : ''}{player.score.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getBetStats(playerId: string, matches: Match[]) {
  let wins = 0, losses = 0, pending = 0;
  for (const m of matches) {
    for (const bet of (m.bets ?? {})[playerId] ?? []) {
      if (bet.status === 'win') wins++;
      else if (bet.status === 'loss') losses++;
      else pending++;
    }
  }
  return { wins, losses, pending };
}
