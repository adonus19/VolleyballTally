import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { Player, Session, PointEntry, Settings, SessionType } from '../models/types';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  players = signal<Player[]>([]);
  sessions = signal<Session[]>([]);
  settings = signal<Settings>({ teamPrimary: '#3880ff', teamSecondary: '#5260ff', darkMode: false, winnersCount: 3 });

  constructor(private storage: StorageService) { }

  init(): void {
    this.players.set(this.storage.get<Player[]>('players', []));
    this.sessions.set(this.storage.get<Session[]>('sessions', []));
    this.settings.set(this.storage.get<Settings>('settings', this.settings()));
  }

  private persist(): void {
    this.storage.set('players', this.players());
    this.storage.set('sessions', this.sessions());
    this.storage.set('settings', this.settings());
  }

  // Players
  addPlayer(name: string, number?: string): void {
    const p: Player = { id: uuid(), name: name.trim(), number: number?.trim() || undefined };
    this.players.update(list => [...list, p]); this.persist();
  }
  updatePlayer(updated: Player): void {
    this.players.update(list => list.map(p => p.id === updated.id ? updated : p)); this.persist();
  }
  deletePlayer(id: string): void {
    this.players.update(list => list.filter(p => p.id !== id)); this.persist();
  }

  // Sessions
  addSession(type: SessionType, title?: string, dateISO = new Date().toISOString()): string {
    const s: Session = { id: uuid(), type, date: dateISO, title: title?.trim() || undefined, points: [] };
    this.sessions.update(list => [s, ...list]); this.persist();
    return s.id;
  }

  updateSession(updated: Session): void {
    this.sessions.update(list => list.map(s => s.id === updated.id ? updated : s));
    this.persist();
  }

  deleteSession(id: string): void {
    this.sessions.update(list => list.filter(s => s.id !== id)); this.persist();
  }

  // Points
  awardPoint(sessionId: string, playerId: string, note?: string): void {
    const s = this.sessions().find(x => x.id === sessionId);
    console.log('session', s);
    if (!s) return;
    const entry: PointEntry = { id: uuid(), playerId, timestamp: Date.now(), note: note?.slice(0, 100) || undefined };
    console.log('entry', entry);
    s.points = [...s.points, entry];
    console.log('points', s.points);
    this.updateSession(s);
  }

  decrementPoint(sessionId: string, playerId: string): void {
    const s = this.sessions().find(x => x.id === sessionId);
    if (!s) return;

    const idx = [...s.points].reverse().findIndex(p => p.playerId === playerId);
    if (idx === -1) return;

    const removeAt = s.points.length - 1 - idx;
    s.points.splice(removeAt, 1);
    this.updateSession(s);
  }

  // Computations
  getSessionCounts(session: Session): Map<string, number> {
    const m = new Map<string, number>();
    for (const p of session.points) m.set(p.playerId, (m.get(p.playerId) ?? 0) + 1);
    return m;
  }

  getFirstPointTimeByPlayer(session: Session): Map<string, number> {
    const m = new Map<string, number>();
    for (const p of session.points) if (!m.has(p.playerId)) m.set(p.playerId, p.timestamp);
    return m;
  }

  getTopForSession(session: Session, topN: number): { playerId: string; count: number; firstTs: number }[] {
    const counts = this.getSessionCounts(session);
    const firsts = this.getFirstPointTimeByPlayer(session);
    return [...counts.entries()]
      .map(([playerId, count]) => ({ playerId, count, firstTs: firsts.get(playerId) ?? Number.MAX_SAFE_INTEGER }))
      .sort((a, b) => b.count - a.count || a.firstTs - b.firstTs)
      .slice(0, Math.max(0, topN));
  }

  getTotals(): { playerId: string; count: number }[] {
    const m = new Map<string, number>();
    for (const s of this.sessions()) for (const p of s.points) m.set(p.playerId, (m.get(p.playerId) ?? 0) + 1);
    return [...m.entries()].map(([playerId, count]) => ({ playerId, count }))
      .sort((a, b) => b.count - a.count);
  }

  // Settings
  setSettings(next: Partial<Settings>): void {
    this.settings.update(s => ({ ...s, ...next })); this.persist();
  }
}
