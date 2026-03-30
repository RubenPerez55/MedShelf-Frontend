import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Plus } from 'lucide-angular';

@Component({
  selector: 'app-meds',
  imports: [NgClass, LucideAngularModule, RouterLink],
  templateUrl: './meds.html',
  styleUrl: './meds.css',
})
export class Meds {
  icons = {
    plus: Plus,
  };

  meds = [
    {
      id: 1,
      name: 'Paracetamol',
      dosage: '500mg',
      time: '08:00 AM',
      status: 'pending',
    },
    {
      id: 2,
      name: 'Ibuprofeno',
      dosage: '200mg',
      time: '12:00 PM',
      status: 'taken',
    },
    {
      id: 3,
      name: 'Amoxicilina',
      dosage: '250mg',
      time: '06:00 PM',
      status: 'pending',
    },
  ];
}
