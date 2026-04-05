import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Check } from 'lucide-angular';

interface Location {
  id: number;
  name: string;
  description: string;
  icon: string;
  quantity: number;
}

@Component({
  selector: 'app-add-medicine-form',
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './add-medicine-form.html',
  styleUrl: './add-medicine-form.css',
})
export class AddMedicineForm implements OnInit {
  icons = { arrowLeft: ArrowLeft, check: Check };
  
  locations: Location[] = [];
  
  ngOnInit() {
    // Cargar ubicaciones desde localStorage
    this.loadLocations();
  }
  
  loadLocations() {
    // Obtener ubicaciones del localStorage creadas en add-ubication
    const storedLocations = localStorage.getItem('locations');
    
    if (storedLocations) {
      this.locations = JSON.parse(storedLocations);
    } else {
      // Si no hay ubicaciones guardadas, usar ubicaciones por defecto
      this.locations = [
        { id: 1, name: 'main room', description: 'Main room description', icon: 'house', quantity: 23 },
        { id: 2, name: 'living room', description: 'Living room description', icon: 'house', quantity: 30 },
      ];
    }
  }
}
