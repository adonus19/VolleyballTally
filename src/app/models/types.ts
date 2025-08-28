export type SessionType = 'practice' | 'game';
export interface Player { id: string; name: string; number?: string; }
export interface PointEntry { id: string; playerId: string; timestamp: number; note?: string; }
export interface Session { id: string; type: SessionType; date: string; title?: string; points: PointEntry[]; }
export interface Settings { teamPrimary: string; teamSecondary: string; darkMode: boolean; winnersCount: number; }
