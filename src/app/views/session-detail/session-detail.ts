import { Component, computed, inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatButton } from "@angular/material/button";
import { MatDialog } from '@angular/material/dialog';

import { DataService } from '../../services/data.service';
import { DeleteDialog } from '../../shared/delete-dialog/delete-dialog';

@Component({
  selector: 'app-session-detail',
  imports: [MatGridListModule, MatCardModule, MatRippleModule, MatButton],
  templateUrl: './session-detail.html',
  styleUrl: './session-detail.scss'
})
export class SessionDetail {
  private route = inject(ActivatedRoute);
  private data = inject(DataService);
  readonly dialog = inject(MatDialog);
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
    this.openDialog();
    // this.data.deleteSession(this.session().id);
    history.back();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DeleteDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result) {
        console.log(result);
        this.data.deleteSession(this.session().id);
        history.back();
      }
    });
  }
}
