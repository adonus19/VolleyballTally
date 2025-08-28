import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  get<T>(key: string, fallback: T) {
    const v = localStorage.getItem(key);
    if (v) {
      fallback = JSON.parse(v);
    }
    return (fallback) as T;
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
