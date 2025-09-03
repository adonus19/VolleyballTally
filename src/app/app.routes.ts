import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'sessions', pathMatch: 'full' },
  { path: 'sessions', loadComponent: () => import('./views/sessions/sessions').then(m => m.Sessions) },
  { path: 'session/:id', loadComponent: () => import('./views/session-detail/session-detail').then(m => m.SessionDetail) },
  { path: 'roster', loadComponent: () => import('./views/roster/roster').then(m => m.Roster) },
  { path: 'leaderboard', loadComponent: () => import('./views/leaderboard/leaderboard').then(m => m.Leaderboard) },
  { path: 'settings', loadComponent: () => import('./views/settings/settings').then(m => m.Settings) },
];
