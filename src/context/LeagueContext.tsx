import {
  createContext, useContext, useReducer, useEffect,
  useRef, useState, useCallback,
} from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../firebase';
import { LeagueState, Player, Bet, BetStatus } from '../types';
import { BASE_MATCHES } from '../matchesFixture';

// ── League code from URL ─────────────────────────────────────────────────────
// Each league lives at /?code=XXXXXX in the URL and leagues/XXXXXX in Firebase.
// On first visit (no code) we generate one and rewrite the URL silently.
function initLeagueCode(): string {
  const params = new URLSearchParams(window.location.search);
  let code = params.get('code');
  if (!code) {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const next = new URL(window.location.href);
    next.searchParams.set('code', code);
    window.history.replaceState({}, '', next.toString());
  }
  return code;
}

export const LEAGUE_CODE = initLeagueCode();
const leagueRef = ref(db, `leagues/${LEAGUE_CODE}`);

// ── Initial state (used only when the Firebase node is empty) ────────────────
const EMPTY_LEAGUE: LeagueState = {
  players: [],
  matches: BASE_MATCHES,
  lastUpdated: '',
};

// ── Reducer ──────────────────────────────────────────────────────────────────
function newBet(): Bet {
  return { id: crypto.randomUUID(), tip: '', odds: 2.0, status: 'pending' };
}

type Action =
  | { type: 'ADD_PLAYER'; name: string }
  | { type: 'REMOVE_PLAYER'; id: string }
  | { type: 'ADD_BET'; matchId: string; playerId: string }
  | { type: 'REMOVE_BET'; matchId: string; playerId: string; betId: string }
  | { type: 'UPDATE_BET'; matchId: string; playerId: string; betId: string; patch: Partial<Pick<Bet, 'tip' | 'odds'>> }
  | { type: 'CYCLE_STATUS'; matchId: string; playerId: string; betId: string }
  | { type: 'TOGGLE_FINISHED'; matchId: string }
  | { type: 'UPDATE_KNOCKOUT_TEAMS'; matchId: string; homeTeam: string; awayTeam: string }
  | { type: 'RESET' }
  | { type: '_SYNC'; state: LeagueState };

const STATUS_NEXT: Record<BetStatus, BetStatus> = { pending: 'win', win: 'loss', loss: 'pending' };

function stamp(s: LeagueState): LeagueState {
  return { ...s, lastUpdated: new Date().toISOString() };
}

function patchBets(
  bets: Record<string, Bet[]>,
  pid: string,
  fn: (arr: Bet[]) => Bet[],
): Record<string, Bet[]> {
  return { ...bets, [pid]: fn(bets[pid] ?? []) };
}

function patchMatch(
  matches: LeagueState['matches'],
  id: string,
  fn: (m: LeagueState['matches'][number]) => LeagueState['matches'][number],
) {
  return matches.map(m => (m.id === id ? fn(m) : m));
}

function reducer(state: LeagueState, action: Action): LeagueState {
  switch (action.type) {
    case '_SYNC':
      return action.state;

    case 'ADD_PLAYER': {
      const p: Player = { id: crypto.randomUUID(), name: action.name.trim() };
      return stamp({ ...state, players: [...state.players, p] });
    }
    case 'REMOVE_PLAYER':
      return stamp({
        ...state,
        players: state.players.filter(p => p.id !== action.id),
        matches: state.matches.map(m => {
          const b = { ...m.bets };
          delete b[action.id];
          return { ...m, bets: b };
        }),
      });

    case 'ADD_BET':
      return stamp({
        ...state,
        matches: patchMatch(state.matches, action.matchId, m => ({
          ...m, bets: patchBets(m.bets, action.playerId, arr => [...arr, newBet()]),
        })),
      });
    case 'REMOVE_BET':
      return stamp({
        ...state,
        matches: patchMatch(state.matches, action.matchId, m => ({
          ...m, bets: patchBets(m.bets, action.playerId, arr => arr.filter(b => b.id !== action.betId)),
        })),
      });
    case 'UPDATE_BET':
      return stamp({
        ...state,
        matches: patchMatch(state.matches, action.matchId, m => ({
          ...m, bets: patchBets(m.bets, action.playerId, arr =>
            arr.map(b => b.id === action.betId ? { ...b, ...action.patch } : b)),
        })),
      });
    case 'CYCLE_STATUS':
      return stamp({
        ...state,
        matches: patchMatch(state.matches, action.matchId, m => ({
          ...m, bets: patchBets(m.bets, action.playerId, arr =>
            arr.map(b => b.id === action.betId ? { ...b, status: STATUS_NEXT[b.status] } : b)),
        })),
      });

    case 'TOGGLE_FINISHED':
      return stamp({
        ...state,
        matches: state.matches.map(m =>
          m.id === action.matchId ? { ...m, isFinished: !m.isFinished } : m),
      });
    case 'UPDATE_KNOCKOUT_TEAMS':
      return stamp({
        ...state,
        matches: state.matches.map(m =>
          m.id === action.matchId ? { ...m, homeTeam: action.homeTeam, awayTeam: action.awayTeam } : m),
      });

    case 'RESET':
      return stamp({ ...EMPTY_LEAGUE });

    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────────────────────
interface LeagueContextValue {
  state: LeagueState;
  dispatch: React.Dispatch<Action>;
  getScore: (playerId: string) => number;
  loading: boolean;
  connected: boolean;
}

const LeagueContext = createContext<LeagueContextValue | null>(null);

export function LeagueProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, EMPTY_LEAGUE);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  // lastSynced tracks the lastUpdated timestamp we most recently wrote to or
  // received from Firebase, so we can tell local changes from remote echoes.
  const lastSynced = useRef('');

  // ── Firebase → local ──────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onValue(leagueRef, snapshot => {
      const remote = snapshot.val() as LeagueState | null;

      if (!remote) {
        // Brand-new league node — seed it with the base fixture.
        const seed = stamp({ ...EMPTY_LEAGUE });
        lastSynced.current = seed.lastUpdated;
        set(leagueRef, seed);
        dispatch({ type: '_SYNC', state: seed });
      } else {
        // Firebase drops empty arrays → normalize to safe defaults.
        const normalized: LeagueState = {
          lastUpdated: remote.lastUpdated ?? '',
          players: remote.players ?? [],
          // Firebase drops empty objects/arrays — ensure bets is always {}
          matches: (remote.matches ?? BASE_MATCHES).map((m: LeagueState['matches'][number]) => ({
            ...m,
            bets: m.bets ?? {},
          })),
        };
        if (normalized.lastUpdated !== lastSynced.current) {
          lastSynced.current = normalized.lastUpdated;
          dispatch({ type: '_SYNC', state: normalized });
        }
      }

      setLoading(false);
    });

    // Connection status
    const connRef = ref(db, '.info/connected');
    const unsubConn = onValue(connRef, snap => setConnected(snap.val() === true));

    return () => { unsub(); unsubConn(); };
  }, []);

  // ── Local → Firebase ──────────────────────────────────────────────────────
  useEffect(() => {
    if (loading) return;
    if (!state.lastUpdated) return;
    if (state.lastUpdated === lastSynced.current) return; // already in Firebase

    lastSynced.current = state.lastUpdated;
    set(leagueRef, state).catch(err => console.error('Firebase write failed:', err));
  }, [state, loading]);

  const getScore = useCallback(
    (playerId: string) =>
      state.matches.reduce((total, m) =>
        ((m.bets ?? {})[playerId] ?? []).reduce((t, b) => {
          if (b.status === 'win') return t + b.odds;
          if (b.status === 'loss') return t - b.odds;
          return t;
        }, total), 0),
    [state.matches],
  );

  return (
    <LeagueContext.Provider value={{ state, dispatch, getScore, loading, connected }}>
      {children}
    </LeagueContext.Provider>
  );
}

export function useLeague() {
  const ctx = useContext(LeagueContext);
  if (!ctx) throw new Error('useLeague must be used within LeagueProvider');
  return ctx;
}
