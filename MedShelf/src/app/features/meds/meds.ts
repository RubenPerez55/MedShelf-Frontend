import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-meds',
  imports: [NgClass, LucideAngularModule, RouterLink ],
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
      progress: 50,
      daysLeft: 5,
      dosage: '500mg',
      time: '08:00 AM',
      status: 'pending',
    },
    {
      id: 2,
      name: 'Ibuprofeno',
      progress: 100,
      daysLeft: 0,
      dosage: '200mg',
      time: '12:00 PM',
      status: 'taken',
    },
    {
      id: 3,
      name: 'Amoxicilina',
      progress: 0,
      daysLeft: 10,
      dosage: '250mg',
      time: '06:00 PM',
      status: 'pending',
    },
  ];
}
