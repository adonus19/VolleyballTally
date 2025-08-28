import { Injectable, inject } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private data = inject(DataService);

  applyCurrentTheme(): void {
    const s = this.data.settings();
    this.applyCssVars(s.teamPrimary, s.teamSecondary);
    document.body.classList.toggle('dark', s.darkMode);
  }

  applyCssVars(primary: string, secondary: string): void {
    const r = document.documentElement;
    r.style.setProperty('--ion-color-primary', primary);
    r.style.setProperty('--ion-color-primary-contrast', '#ffffff');
    r.style.setProperty('--ion-color-secondary', secondary);
    r.style.setProperty('--ion-color-secondary-contrast', '#ffffff');
  }
}
