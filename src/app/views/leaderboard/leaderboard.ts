import { Component, computed, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from "@angular/material/icon";
import { MatChipsModule } from '@angular/material/chips';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-leaderboard',
  imports: [MatListModule, MatIcon, MatChipsModule],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.scss'
})
export class Leaderboard {
  private data = inject(DataService);
  rows = computed(() => this.data.getTotals());

  nameFor(pid: string) {
    return this.data.players().find(p => p.id === pid)?.name || '(Removed)';
  }
}
