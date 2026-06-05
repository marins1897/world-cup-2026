import { Match, Stage } from './types';

// Official 2026 FIFA World Cup groups (draw: Dec 5, 2025, Washington D.C.)
// Schedule sourced from ESPN / FOX Sports / beIN Sports / Sky Sports
// kickoffUTC = UTC ISO datetime; display converts to Europe/Zagreb (CEST = UTC+2 in summer)

function gm(
  id: string, ht: string, at: string,
  group: string, md: number,
  date: string, venue: string,
  kickoffUTC: string,
): Match {
  return { id, homeTeam: ht, awayTeam: at, group, matchday: md, stage: 'group', date, venue, kickoffUTC, isFinished: false, bets: {}, isKnockout: false };
}

function km(
  id: string, ht: string, at: string,
  stage: Stage, date: string, venue: string,
  kickoffUTC: string,
): Match {
  return { id, homeTeam: ht, awayTeam: at, stage, date, venue, kickoffUTC, isFinished: false, bets: {}, isKnockout: true };
}

export const BASE_MATCHES: Match[] = [

  // ══════════════════════════════════════════════════════════════════
  //  GROUP STAGE
  // ══════════════════════════════════════════════════════════════════

  // ── GROUP A: Mexico · South Africa · South Korea · Czech Republic ─
  gm('a11','Mexico','South Africa','A',1,'2026-06-11','Estadio Azteca, Mexico City','2026-06-11T19:00:00Z'),
  gm('a12','South Korea','Czech Republic','A',1,'2026-06-11','Estadio Akron, Guadalajara','2026-06-12T02:00:00Z'),
  gm('a21','Czech Republic','South Africa','A',2,'2026-06-18','Mercedes-Benz Stadium, Atlanta','2026-06-18T16:00:00Z'),
  gm('a22','Mexico','South Korea','A',2,'2026-06-18','Estadio Akron, Guadalajara','2026-06-19T01:00:00Z'),
  gm('a31','Mexico','Czech Republic','A',3,'2026-06-24','Estadio Azteca, Mexico City','2026-06-25T01:00:00Z'),
  gm('a32','South Korea','South Africa','A',3,'2026-06-24','Estadio BBVA, Monterrey','2026-06-25T01:00:00Z'),

  // ── GROUP B: Canada · Bosnia & Herzegovina · Qatar · Switzerland ──
  gm('b11','Canada','Bosnia & Herzegovina','B',1,'2026-06-12','BMO Field, Toronto','2026-06-12T19:00:00Z'),
  gm('b12','Qatar','Switzerland','B',1,'2026-06-12','Levi\'s Stadium, San Francisco Bay Area','2026-06-13T19:00:00Z'),
  gm('b21','Switzerland','Bosnia & Herzegovina','B',2,'2026-06-18','SoFi Stadium, Los Angeles','2026-06-18T19:00:00Z'),
  gm('b22','Canada','Qatar','B',2,'2026-06-18','BC Place, Vancouver','2026-06-18T22:00:00Z'),
  gm('b31','Switzerland','Canada','B',3,'2026-06-24','BC Place, Vancouver','2026-06-24T19:00:00Z'),
  gm('b32','Bosnia & Herzegovina','Qatar','B',3,'2026-06-24','Lumen Field, Seattle','2026-06-24T19:00:00Z'),

  // ── GROUP C: Brazil · Morocco · Haiti · Scotland ─────────────────
  gm('c11','Brazil','Morocco','C',1,'2026-06-13','MetLife Stadium, New Jersey','2026-06-13T22:00:00Z'),
  gm('c12','Haiti','Scotland','C',1,'2026-06-13','Gillette Stadium, Boston','2026-06-14T01:00:00Z'),
  gm('c21','Scotland','Morocco','C',2,'2026-06-19','Gillette Stadium, Boston','2026-06-19T22:00:00Z'),
  gm('c22','Brazil','Haiti','C',2,'2026-06-19','Lincoln Financial Field, Philadelphia','2026-06-20T01:00:00Z'),
  gm('c31','Brazil','Scotland','C',3,'2026-06-24','Hard Rock Stadium, Miami','2026-06-24T22:00:00Z'),
  gm('c32','Morocco','Haiti','C',3,'2026-06-24','Mercedes-Benz Stadium, Atlanta','2026-06-24T22:00:00Z'),

  // ── GROUP D: USA · Paraguay · Australia · Türkiye ─────────────────
  gm('d11','USA','Paraguay','D',1,'2026-06-12','SoFi Stadium, Los Angeles','2026-06-13T01:00:00Z'),
  gm('d12','Australia','Türkiye','D',1,'2026-06-13','BC Place, Vancouver','2026-06-14T04:00:00Z'),
  gm('d21','USA','Australia','D',2,'2026-06-19','Lumen Field, Seattle','2026-06-19T19:00:00Z'),
  gm('d22','Türkiye','Paraguay','D',2,'2026-06-19','Levi\'s Stadium, San Francisco Bay Area','2026-06-20T04:00:00Z'),
  gm('d31','USA','Türkiye','D',3,'2026-06-25','SoFi Stadium, Los Angeles','2026-06-26T02:00:00Z'),
  gm('d32','Paraguay','Australia','D',3,'2026-06-25','Levi\'s Stadium, San Francisco Bay Area','2026-06-26T02:00:00Z'),

  // ── GROUP E: Germany · Curaçao · Ivory Coast · Ecuador ───────────
  gm('e11','Germany','Curaçao','E',1,'2026-06-14','NRG Stadium, Houston','2026-06-14T17:00:00Z'),
  gm('e12','Ivory Coast','Ecuador','E',1,'2026-06-14','Lincoln Financial Field, Philadelphia','2026-06-14T23:00:00Z'),
  gm('e21','Germany','Ivory Coast','E',2,'2026-06-20','BMO Field, Toronto','2026-06-20T20:00:00Z'),
  gm('e22','Ecuador','Curaçao','E',2,'2026-06-20','Arrowhead Stadium, Kansas City','2026-06-21T02:00:00Z'),
  gm('e31','Ecuador','Germany','E',3,'2026-06-25','MetLife Stadium, New Jersey','2026-06-25T20:00:00Z'),
  gm('e32','Curaçao','Ivory Coast','E',3,'2026-06-25','Lincoln Financial Field, Philadelphia','2026-06-25T20:00:00Z'),

  // ── GROUP F: Netherlands · Japan · Sweden · Tunisia ───────────────
  gm('f11','Netherlands','Japan','F',1,'2026-06-14','AT&T Stadium, Dallas','2026-06-14T20:00:00Z'),
  gm('f12','Tunisia','Sweden','F',1,'2026-06-14','Estadio BBVA, Monterrey','2026-06-15T02:00:00Z'),
  gm('f21','Netherlands','Sweden','F',2,'2026-06-20','NRG Stadium, Houston','2026-06-20T17:00:00Z'),
  gm('f22','Tunisia','Japan','F',2,'2026-06-20','Estadio BBVA, Monterrey','2026-06-21T04:00:00Z'),
  gm('f31','Tunisia','Netherlands','F',3,'2026-06-25','Arrowhead Stadium, Kansas City','2026-06-25T23:00:00Z'),
  gm('f32','Japan','Sweden','F',3,'2026-06-25','AT&T Stadium, Dallas','2026-06-25T23:00:00Z'),

  // ── GROUP G: Belgium · Egypt · Iran · New Zealand ─────────────────
  gm('g11','Belgium','Egypt','G',1,'2026-06-15','Lumen Field, Seattle','2026-06-15T19:00:00Z'),
  gm('g12','Iran','New Zealand','G',1,'2026-06-15','SoFi Stadium, Los Angeles','2026-06-16T01:00:00Z'),
  gm('g21','Belgium','Iran','G',2,'2026-06-21','SoFi Stadium, Los Angeles','2026-06-21T19:00:00Z'),
  gm('g22','New Zealand','Egypt','G',2,'2026-06-21','BC Place, Vancouver','2026-06-22T01:00:00Z'),
  gm('g31','New Zealand','Belgium','G',3,'2026-06-26','BC Place, Vancouver','2026-06-27T03:00:00Z'),
  gm('g32','Egypt','Iran','G',3,'2026-06-26','Lumen Field, Seattle','2026-06-27T03:00:00Z'),

  // ── GROUP H: Spain · Cape Verde · Saudi Arabia · Uruguay ─────────
  gm('h11','Spain','Cape Verde','H',1,'2026-06-15','Mercedes-Benz Stadium, Atlanta','2026-06-15T16:00:00Z'),
  gm('h12','Saudi Arabia','Uruguay','H',1,'2026-06-15','Hard Rock Stadium, Miami','2026-06-15T22:00:00Z'),
  gm('h21','Spain','Saudi Arabia','H',2,'2026-06-21','Mercedes-Benz Stadium, Atlanta','2026-06-21T16:00:00Z'),
  gm('h22','Uruguay','Cape Verde','H',2,'2026-06-21','Hard Rock Stadium, Miami','2026-06-21T22:00:00Z'),
  gm('h31','Uruguay','Spain','H',3,'2026-06-26','Estadio Akron, Guadalajara','2026-06-27T00:00:00Z'),
  gm('h32','Cape Verde','Saudi Arabia','H',3,'2026-06-26','NRG Stadium, Houston','2026-06-27T00:00:00Z'),

  // ── GROUP I: France · Senegal · Iraq · Norway ─────────────────────
  gm('i11','France','Senegal','I',1,'2026-06-16','MetLife Stadium, New Jersey','2026-06-16T19:00:00Z'),
  gm('i12','Iraq','Norway','I',1,'2026-06-16','Gillette Stadium, Boston','2026-06-16T22:00:00Z'),
  gm('i21','France','Iraq','I',2,'2026-06-22','Lincoln Financial Field, Philadelphia','2026-06-22T21:00:00Z'),
  gm('i22','Norway','Senegal','I',2,'2026-06-22','MetLife Stadium, New Jersey','2026-06-23T00:00:00Z'),
  gm('i31','Norway','France','I',3,'2026-06-26','Gillette Stadium, Boston','2026-06-26T19:00:00Z'),
  gm('i32','Senegal','Iraq','I',3,'2026-06-26','BMO Field, Toronto','2026-06-26T19:00:00Z'),

  // ── GROUP J: Argentina · Algeria · Austria · Jordan ──────────────
  gm('j11','Argentina','Algeria','J',1,'2026-06-16','Arrowhead Stadium, Kansas City','2026-06-17T01:00:00Z'),
  gm('j12','Austria','Jordan','J',1,'2026-06-16','Levi\'s Stadium, San Francisco Bay Area','2026-06-17T04:00:00Z'),
  gm('j21','Argentina','Austria','J',2,'2026-06-22','AT&T Stadium, Dallas','2026-06-22T17:00:00Z'),
  gm('j22','Jordan','Algeria','J',2,'2026-06-22','Levi\'s Stadium, San Francisco Bay Area','2026-06-23T03:00:00Z'),
  gm('j31','Argentina','Jordan','J',3,'2026-06-27','AT&T Stadium, Dallas','2026-06-28T02:00:00Z'),
  gm('j32','Algeria','Austria','J',3,'2026-06-27','Arrowhead Stadium, Kansas City','2026-06-28T02:00:00Z'),

  // ── GROUP K: Portugal · DR Congo · Uzbekistan · Colombia ─────────
  gm('k11','Portugal','DR Congo','K',1,'2026-06-17','NRG Stadium, Houston','2026-06-17T17:00:00Z'),
  gm('k12','Uzbekistan','Colombia','K',1,'2026-06-17','Estadio Azteca, Mexico City','2026-06-18T02:00:00Z'),
  gm('k21','Portugal','Uzbekistan','K',2,'2026-06-23','NRG Stadium, Houston','2026-06-23T17:00:00Z'),
  gm('k22','Colombia','DR Congo','K',2,'2026-06-23','Estadio Akron, Guadalajara','2026-06-24T02:00:00Z'),
  gm('k31','Colombia','Portugal','K',3,'2026-06-27','Hard Rock Stadium, Miami','2026-06-27T23:30:00Z'),
  gm('k32','DR Congo','Uzbekistan','K',3,'2026-06-27','Mercedes-Benz Stadium, Atlanta','2026-06-27T23:30:00Z'),

  // ── GROUP L: England · Croatia · Ghana · Panama ───────────────────
  gm('l11','England','Croatia','L',1,'2026-06-17','AT&T Stadium, Dallas','2026-06-17T20:00:00Z'),
  gm('l12','Ghana','Panama','L',1,'2026-06-17','BMO Field, Toronto','2026-06-17T23:00:00Z'),
  gm('l21','England','Ghana','L',2,'2026-06-23','Gillette Stadium, Boston','2026-06-23T20:00:00Z'),
  gm('l22','Panama','Croatia','L',2,'2026-06-23','BMO Field, Toronto','2026-06-23T23:00:00Z'),
  gm('l31','Panama','England','L',3,'2026-06-27','MetLife Stadium, New Jersey','2026-06-27T21:00:00Z'),
  gm('l32','Croatia','Ghana','L',3,'2026-06-27','Lincoln Financial Field, Philadelphia','2026-06-27T21:00:00Z'),

  // ══════════════════════════════════════════════════════════════════
  //  ROUND OF 32  (matches 73-88)
  //  Bracket per FIFA Annex C pre-set pairings
  // ══════════════════════════════════════════════════════════════════
  km('r32-73','Runner-up Group A','Runner-up Group B','r32','2026-06-28','SoFi Stadium, Los Angeles','2026-06-28T19:00:00Z'),
  km('r32-74','Winner Group C','Runner-up Group F','r32','2026-06-29','Gillette Stadium, Boston','2026-06-29T17:00:00Z'),
  km('r32-75','Winner Group E','3rd Place (A/B/C/D/F)','r32','2026-06-29','Estadio BBVA, Monterrey','2026-06-29T20:30:00Z'),
  km('r32-76','Winner Group F','Runner-up Group C','r32','2026-06-29','NRG Stadium, Houston','2026-06-30T01:00:00Z'),
  km('r32-77','Runner-up Group E','Runner-up Group I','r32','2026-06-30','MetLife Stadium, New Jersey','2026-06-30T17:00:00Z'),
  km('r32-78','Winner Group I','3rd Place (C/D/F/G/H)','r32','2026-06-30','AT&T Stadium, Dallas','2026-06-30T21:00:00Z'),
  km('r32-79','Winner Group A','3rd Place (C/E/F/H/I)','r32','2026-06-30','Estadio Azteca, Mexico City','2026-07-01T01:00:00Z'),
  km('r32-80','Winner Group L','3rd Place (E/H/I/J/K)','r32','2026-07-01','Mercedes-Benz Stadium, Atlanta','2026-07-01T16:00:00Z'),
  km('r32-81','Winner Group G','3rd Place (A/E/H/I/J)','r32','2026-07-01','Levi\'s Stadium, San Francisco Bay Area','2026-07-01T20:00:00Z'),
  km('r32-82','Winner Group D','3rd Place (B/E/F/I/J)','r32','2026-07-01','Lumen Field, Seattle','2026-07-02T00:00:00Z'),
  km('r32-83','Winner Group H','Runner-up Group J','r32','2026-07-02','BMO Field, Toronto','2026-07-02T19:00:00Z'),
  km('r32-84','Runner-up Group K','Runner-up Group L','r32','2026-07-02','SoFi Stadium, Los Angeles','2026-07-02T23:00:00Z'),
  km('r32-85','Winner Group B','3rd Place (E/F/G/I/J)','r32','2026-07-02','BC Place, Vancouver','2026-07-03T03:00:00Z'),
  km('r32-86','Runner-up Group D','Runner-up Group G','r32','2026-07-03','Hard Rock Stadium, Miami','2026-07-03T18:00:00Z'),
  km('r32-87','Winner Group J','Runner-up Group H','r32','2026-07-03','Arrowhead Stadium, Kansas City','2026-07-03T22:00:00Z'),
  km('r32-88','Winner Group K','3rd Place (D/E/I/J/L)','r32','2026-07-03','AT&T Stadium, Dallas','2026-07-03T20:00:00Z'),

  // ══════════════════════════════════════════════════════════════════
  //  ROUND OF 16  (matches 89-96)
  // ══════════════════════════════════════════════════════════════════
  km('r16-89','Winner R32-73','Winner R32-74','r16','2026-07-04','Lincoln Financial Field, Philadelphia','2026-07-04T21:00:00Z'),
  km('r16-90','Winner R32-75','Winner R32-76','r16','2026-07-04','NRG Stadium, Houston','2026-07-04T17:00:00Z'),
  km('r16-91','Winner R32-77','Winner R32-78','r16','2026-07-05','MetLife Stadium, New Jersey','2026-07-05T20:00:00Z'),
  km('r16-92','Winner R32-79','Winner R32-80','r16','2026-07-05','Estadio Azteca, Mexico City','2026-07-06T00:00:00Z'),
  km('r16-93','Winner R32-81','Winner R32-82','r16','2026-07-06','AT&T Stadium, Dallas','2026-07-06T19:00:00Z'),
  km('r16-94','Winner R32-83','Winner R32-84','r16','2026-07-06','Lumen Field, Seattle','2026-07-07T00:00:00Z'),
  km('r16-95','Winner R32-85','Winner R32-86','r16','2026-07-07','Mercedes-Benz Stadium, Atlanta','2026-07-07T16:00:00Z'),
  km('r16-96','Winner R32-87','Winner R32-88','r16','2026-07-07','BC Place, Vancouver','2026-07-07T20:00:00Z'),

  // ══════════════════════════════════════════════════════════════════
  //  QUARTER-FINALS  (matches 97-100)
  // ══════════════════════════════════════════════════════════════════
  km('qf-97','Winner R16-89','Winner R16-90','qf','2026-07-09','Gillette Stadium, Boston','2026-07-09T20:00:00Z'),
  km('qf-98','Winner R16-91','Winner R16-92','qf','2026-07-10','SoFi Stadium, Los Angeles','2026-07-10T19:00:00Z'),
  km('qf-99','Winner R16-93','Winner R16-94','qf','2026-07-11','Hard Rock Stadium, Miami','2026-07-11T21:00:00Z'),
  km('qf-100','Winner R16-95','Winner R16-96','qf','2026-07-11','Arrowhead Stadium, Kansas City','2026-07-12T01:00:00Z'),

  // ══════════════════════════════════════════════════════════════════
  //  SEMI-FINALS  (matches 101-102)
  // ══════════════════════════════════════════════════════════════════
  km('sf-101','Winner QF-97','Winner QF-98','sf','2026-07-14','AT&T Stadium, Dallas','2026-07-14T19:00:00Z'),
  km('sf-102','Winner QF-99','Winner QF-100','sf','2026-07-15','Mercedes-Benz Stadium, Atlanta','2026-07-15T19:00:00Z'),

  // ── THIRD PLACE  (match 103) ──────────────────────────────────────
  km('3rd-103','Loser SF-101','Loser SF-102','third','2026-07-18','Hard Rock Stadium, Miami','2026-07-18T21:00:00Z'),

  // ── FINAL  (match 104) ───────────────────────────────────────────
  km('final-104','Winner SF-101','Winner SF-102','final','2026-07-19','MetLife Stadium, New Jersey','2026-07-19T19:00:00Z'),
];
