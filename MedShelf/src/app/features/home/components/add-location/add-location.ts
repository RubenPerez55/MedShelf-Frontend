import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';

interface Location {
  id: number;
  name: string;
  description: string;
  icon: string;
  quantity: number;
}

@Component({
  selector: 'app-add-location',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './add-location.html',
  styleUrl: './add-location.css',
})
export class AddLocation {
  icons = { arrowLeft: ArrowLeft };

  locationData = {
    name: '',
    description: '',
    icon: 'house',
  };

  icons_options = ['house', 'office', 'warehouse', 'cabinet', 'drawer'];

  constructor(private router: Router) {}

  // Agregar nueva ubicación
  addLocation() {
    if (!this.locationData.name.trim() || !this.locationData.description.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    const locations = JSON.parse(localStorage.getItem('locations') || '[]');
    locations.push({
      ...this.locationData,
      id: Date.now(),
      quantity: 0,
    });
    localStorage.setItem('locations', JSON.stringify(locations));

    // Volver a la página principal
    this.router.navigate(['/']);
  }

  // Cancelar
  cancel() {
    this.router.navigate(['/']);
  }
}
