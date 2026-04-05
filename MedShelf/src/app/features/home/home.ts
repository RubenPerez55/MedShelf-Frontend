import { Component, inject, OnInit } from '@angular/core';
import { LucideAngularModule, House, Plus } from 'lucide-angular';
import { ThemeService } from '../../shared/services/theme.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private themeService = inject(ThemeService);

  ngOnInit() {
    this.themeService.theme$.subscribe();
  }
  profiles = [
    {
      id: 1,
      name: 'Ana',
      initials: 'A',
      medicines: ['Paracetamol', 'Ibuprofeno'],
      route: '/admin',
    },
    {
      id: 2,
      name: 'Juan',
      initials: 'J',
      medicines: ['Amoxicilina', 'Loratadina'],
      route: '/user',
    },
  ];

  locations = [
    {
      id: 1,
      name: 'main room',
      icon: 'house',
      quantity: 23,
      description: 'Main room description',
    },
    {
      id: 2,
      name: 'living room',
      icon: 'house',
      quantity: 30,
      description: 'Living room description',
    },
  ];

  icons = {
    house: House,
    plus: Plus,
  };
}
