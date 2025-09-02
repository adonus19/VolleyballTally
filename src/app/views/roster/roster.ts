import { Component, computed, inject } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-roster',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './roster.html',
  styleUrl: './roster.scss'
})
export class Roster {
  private data = inject(DataService);
  private fb = inject(FormBuilder);
  playerForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    jersey: [null, [Validators.required]]
  });
  players = computed(() => this.data.players());

  add() {
    if (this.playerForm.invalid) {
      alert('Name required or jersey is missing');
      return;
    }

    this.data.addPlayer(
      `${this.playerForm.get('firstName')?.value} ${this.playerForm.get('lastName')?.value}`,
      this.playerForm.get('jersey')?.value || undefined
    );
    this.playerForm.reset();
  }

  rename(id: string) {
    const p = this.players().find(x => x.id === id)!;
    const name = prompt('Player name:', p.name)?.trim();
    if (!name) return;

    const num = prompt('Jersey # (blank for none):', p.number ?? '')?.trim();
    this.data.updatePlayer({ ...p, name, number: num || undefined });
  }

  remove(id: string) {
    if (confirm('Delete player? Historical points will remain attributed.')) this.data.deletePlayer(id);
  }

}
