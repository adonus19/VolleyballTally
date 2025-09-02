import { Component, OnInit, computed, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-sessions',
  imports: [FormsModule, DatePipe, MatTabsModule, NgTemplateOutlet, MatDividerModule, MatListModule, MatButtonModule, MatMenuModule, MatIcon],
  templateUrl: './sessions.html',
  styleUrl: './sessions.scss'
})
export class Sessions {

  private data = inject(DataService);
  private router = inject(Router);
  filter: 'all' | 'practice' | 'game' = 'all';
  toggleFab = false;
  sessions = computed(() => this.data.sessions());

  ngOnInit() {
    this.data.init();
  }

  filteredSessions() {
    const list = this.sessions() ?? [];
    return this.filter === 'all' ? list : list.filter(s => s.type === this.filter);
  }

  open(id: string) {
    this.router.navigate(['/session', id]);
  }

  create(type: 'practice' | 'game') {
    // Avoid empty sessions confusion.
    if (!this.data.players().length) {
      alert('Add players in Roster first.');
      return;
    }

    const id = this.data.addSession(type);
    this.open(id);
  }
}
