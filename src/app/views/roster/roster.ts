import { Component, computed, inject, signal, Signal } from '@angular/core';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from "@angular/material/icon";

import { DataService } from '../../services/data.service';
import { MatButton } from "@angular/material/button";
import { MatTableModule } from '@angular/material/table';
import { MatIconButton } from "@angular/material/button";
import { Player } from '../../models/types';

@Component({
  selector: 'app-roster',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIcon, MatButton, MatTableModule, MatIconButton],
  templateUrl: './roster.html',
  styleUrl: './roster.scss'
})
export class Roster {
  private data = inject(DataService);
  private fb = inject(FormBuilder);
  playerForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    jersey: ['', [Validators.required]]
  });
  players: Signal<Player[]> = signal([]);
  displayedColumns: string[] = ['player', 'number', 'edit'];
  playerId = '';

  ngOnInit() {
    this.players = computed(() => this.data.players());
  }

  add() {
    if (this.playerForm.invalid) {
      alert('Name required or jersey is missing');
      return;
    }

    if (this.playerId) {
      this.rename(this.playerId);
      this.playerId = '';
      return;
    }

    this.data.addPlayer(
      `${this.playerForm.get('firstName')?.value} ${this.playerForm.get('lastName')?.value}`,
      this.playerForm.get('jersey')?.value || undefined
    );
    this.clearForm();
  }

  clearForm() {
    this.playerForm.reset();
    this.playerForm.updateValueAndValidity();
  }

  rename(id: string) {
    const p = this.players().find(x => x.id === id)!;
    p.name = `${this.playerForm.get('firstName')?.value!} ${this.playerForm.get('lastName')?.value!}`;
    p.number = this.playerForm.get('jersey')?.value!;

    this.data.updatePlayer({ ...p, name: p.name, number: p.number || undefined });
  }

  editPlayer(player: Player) {
    this.playerForm.setValue({
      firstName: player.name.split(' ')[0],
      lastName: player.name.split(' ')[1],
      jersey: player.number || ''
    });
    this.playerId = player.id;
  }

  remove(id: string) {
    if (confirm('Delete player? Historical points will remain attributed.')) this.data.deletePlayer(id);
  }

}
