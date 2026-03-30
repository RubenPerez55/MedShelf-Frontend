import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { Home } from './features/home/home';
import { ThemeService } from './shared/services/theme.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Home, RouterLinkWithHref],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('MedShelf');

  constructor(private themeService: ThemeService) {
    // El servicio se inicializa automáticamente en el constructor
  }
}
