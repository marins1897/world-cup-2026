import { useState } from 'react';
import { useLeague } from '../context/LeagueContext';

export default function PlayerManager() {
  const { state, dispatch } = useLeague();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const exists = state.players.some(
      p => p.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      setError('Igrač već postoji');
      return;
    }
    dispatch({ type: 'ADD_PLAYER', name: trimmed });
    setName('');
    setError('');
  }

  function handleRemove(id: string, playerName: string) {
    if (!confirm(`Ukloniti "${playerName}" i sve njegove oklade?`)) return;
    dispatch({ type: 'REMOVE_PLAYER', id });
  }

  function handleReset() {
    if (!confirm('Resetirati cijelu ligu? Ovo briše sve igrače i oklade.')) return;
    dispatch({ type: 'RESET' });
  }

  return (
    <div className="card">
      <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">👥</span>
          <h2 className="font-semibold text-slate-200 tracking-wide uppercase text-sm">Igrači</h2>
        </div>
        {state.players.length > 0 && (
          <button className="btn-danger text-xs" onClick={handleReset}>
            Resetiraj ligu
          </button>
        )}
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Add player */}
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="Ime igrača (npr. Brko)"
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            maxLength={32}
          />
          <button
            className="btn-primary"
            onClick={handleAdd}
            disabled={!name.trim()}
          >
            + Dodaj
          </button>
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        {/* Player chips */}
        {state.players.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {state.players.map(p => (
              <div
                key={p.id}
                className="flex items-center gap-1.5 bg-slate-700 rounded-full px-3 py-1 text-sm font-medium text-slate-200"
              >
                <span>{p.name}</span>
                <button
                  onClick={() => handleRemove(p.id, p.name)}
                  className="text-slate-400 hover:text-red-400 transition-colors leading-none ml-0.5"
                  title={`Ukloni ${p.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {state.players.length === 0 && (
          <p className="text-slate-500 text-sm">
            Dodaj igrače za klađenje na utakmice ispod.
          </p>
        )}
      </div>
    </div>
  );
}
