import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PwaInstallService {
  private deferred = signal<BeforeInstallPromptEvent | null>(null);
  canPrompt = signal(false);

  constructor() {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferred.set(e as BeforeInstallPromptEvent);
      this.canPrompt.set(true);
    });
  }

  async promptInstall() {
    const evt = this.deferred();
    if (!evt) return;
    const { outcome } = await evt.prompt();
    // outcome: 'accepted' | 'dismissed'
    this.deferred.set(null);
    this.canPrompt.set(false);
    return outcome;
  }
}

// Type for TS
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
