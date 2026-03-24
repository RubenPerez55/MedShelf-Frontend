import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'medshelf-theme';
  private themeSignal = signal<Theme>(this.getInitialTheme());

  constructor() {
    // Efecto que se ejecuta cada vez que cambia el tema
    effect(() => {
      const theme = this.themeSignal();
      this.applyTheme(theme);
      localStorage.setItem(this.THEME_KEY, theme);
    });
  }

  private getInitialTheme(): Theme {
    // Intenta obtener del localStorage
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;
    if (savedTheme) {
      return savedTheme;
    }

    // Si no hay guardado, detecta la preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  private applyTheme(theme: Theme) {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-theme', theme);
  }

  getCurrentTheme() {
    return this.themeSignal();
  }

  toggleTheme() {
    const currentTheme = this.themeSignal();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.themeSignal.set(newTheme);
  }

  setTheme(theme: Theme) {
    this.themeSignal.set(theme);
  }
}