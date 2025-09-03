import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatButton } from "@angular/material/button";

import { DataService } from '../../services/data.service';
import { LongPressDirective } from '../../shared/long-press.directive';

@Component({
  selector: 'app-session-detail',
  imports: [DatePipe, LongPressDirective, MatGridListModule, MatCardModule, MatRippleModule, MatButton],
  templateUrl: './session-detail.html',
  styleUrl: './session-detail.scss'
})
export class SessionDetail {
  private route = inject(ActivatedRoute);
  private data = inject(DataService);
  id = this.route.snapshot.paramMap.get('id')!;
  session = computed(() => this.data.sessions().find(s => s.id === this.id)!);
  players = computed(() => this.data.players());
  winnersCount = computed(() => this.data.settings().winnersCount);

  headerTitle() {
    const s = this.session(); if (!s) return '';
    return `${s.type.toUpperCase()} — ${new Date(s.date).toLocaleString()}`;
  }

  countFor(pid: string) {
    return this.data.getSessionCounts(this.session()).get(pid) ?? 0;
  }

  leaderboard() {
    return this.data.getTopForSession(this.session(), this.players().length || 0);
  }

  recentPoints() {
    return [...this.session().points].sort((a, b) => b.timestamp - a.timestamp).slice(0, 20);
  }

  addPoint(playerId: string) {
    this.data.awardPoint(this.session().id, playerId);
  }

  addPointWithNote(playerId: string) {
    const note = prompt('Optional note (max 100 chars):') ?? '';
    this.data.awardPoint(this.session().id, playerId, note.trim() || undefined);
  }

  decPoint(playerId: string) {
    this.data.decrementPoint(this.session().id, playerId);
  }

  nameFor(pid: string) {
    return this.players().find(p => p.id === pid)?.name || '(Removed)';
  }

  deleteSession() {
    if (confirm('Delete this session? This cannot be undone.')) this.data.deleteSession(this.session().id);
    history.back();
  }
}
