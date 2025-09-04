import { Component, computed } from '@angular/core';
import { PwaInstallService } from '../../services/pwa-install-service';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  canInstall = computed(() => this.pwa.canPrompt());

  constructor(private pwa: PwaInstallService) { }

  install() {
    this.pwa.promptInstall();
  }
}
