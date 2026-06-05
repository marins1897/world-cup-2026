export type BetStatus = 'pending' | 'win' | 'loss';
export type Stage = 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'third' | 'final';

export interface Player {
  id: string;
  name: string;
}

export interface Bet {
  id: string;        // uuid per bet row
  tip: string;       // free text – anything the player wants
  odds: number;      // decimal coefficient, e.g. 2.30
  status: BetStatus;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  group?: string;
  matchday?: number;
  stage: Stage;
  date: string;
  kickoffUTC?: string; // ISO UTC datetime, e.g. "2026-06-11T19:00:00Z"
  venue: string;
  isFinished: boolean;
  bets: Record<string, Bet[]>; // playerId → list of bets (can be empty [])
  isKnockout: boolean;
}

export interface LeagueState {
  players: Player[];
  matches: Match[];
  lastUpdated: string;
}

export const STAGE_LABELS: Record<Stage, string> = {
  group: 'Grupna faza',
  r32: 'Šesnaestina finala',
  r16: 'Osmina finala',
  qf: 'Četvrtfinale',
  sf: 'Polufinale',
  third: 'Za 3. mjesto',
  final: 'Finale',
};
