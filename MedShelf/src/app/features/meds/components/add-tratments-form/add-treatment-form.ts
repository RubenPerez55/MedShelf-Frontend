import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Check } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Medicine {
  id: string;
  name: string;
  dose: string;
  quantity: number;
  notes?: string;
}

interface Treatment {
  medicineId: string;
  medicineName: string;
  frequency: number;
  startTime: string;
  duration: number;
  durationUnit: 'dias' | 'semanas' | 'meses';
  notes?: string;
}

@Component({
  selector: 'app-add-treatment-form',
  imports: [RouterLink, LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './add-treatment-form.html',
  styleUrl: './add-treatment-form.css',
})
export class AddTreatmentForm implements OnInit {
  icons = { arrowLeft: ArrowLeft, check: Check };
  
  medicines: Medicine[] = [];
  treatments: Treatment[] = [];
  
  treatment: Treatment = {
    medicineId: '',
    medicineName: '',
    frequency: 8,
    startTime: '08:00',
    duration: 1,
    durationUnit: 'dias',
    notes: ''
  };

  ngOnInit() {
    this.loadMedicines();
    this.loadTreatments();
  }

  loadMedicines() {
    this.medicines = [
      {
        id: '1',
        name: 'Paracetamol',
        dose: '500 mg',
        quantity: 10,
        notes: 'Tabletas'
      },
      {
        id: '2',
        name: 'Ibuprofeno',
        dose: '400 mg',
        quantity: 15,
        notes: 'Tabletas'
      },
      {
        id: '3',
        name: 'Amoxicilina',
        dose: '250 mg',
        quantity: 20,
        notes: 'Cápsulas'
      },
      {
        id: '4',
        name: 'Loratadina',
        dose: '10 mg',
        quantity: 30,
        notes: 'Tabletas'
      },
      {
        id: '5',
        name: 'Omeprazol',
        dose: '20 mg',
        quantity: 28,
        notes: 'Cápsulas'
      }
    ];
  }

  loadTreatments() {
    this.treatments = [
      {
        medicineId: '1',
        medicineName: 'Paracetamol',
        frequency: 8,
        startTime: '08:00',
        duration: 7,
        durationUnit: 'dias',
        notes: 'Después de comer'
      }
    ];
  }

  onMedicineChange() {
    const selected = this.medicines.find(m => m.id === this.treatment.medicineId);
    if (selected) {
      this.treatment.medicineName = selected.name;
    }
  }

  saveTreatment() {
    if (!this.treatment.medicineId) {
      alert('Por favor selecciona un medicamento');
      return;
    }

    this.treatments.push({ ...this.treatment });
    
    const durationText = `${this.treatment.duration} ${this.treatment.durationUnit}`;
    const startText = `Cada ${this.treatment.frequency} horas a partir de las ${this.treatment.startTime}`;
    alert(`Tratamiento guardado\n${this.treatment.medicineName}\n${startText}\nDuración: ${durationText}`);
    
    this.treatment = {
      medicineId: '',
      medicineName: '',
      frequency: 8,
      startTime: '08:00',
      duration: 1,
      durationUnit: 'dias',
      notes: ''
    };
  }

  getNextScheduledTimes(): string[] {
    const times: string[] = [];
    const [hours, minutes] = this.treatment.startTime.split(':').map(Number);
    let currentHours = hours;
    
    for (let i = 0; i < 3; i++) {
      const timeStr = `${String(currentHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      times.push(timeStr);
      currentHours += this.treatment.frequency;
      if (currentHours >= 24) {
        currentHours -= 24;
      }
    }
    return times;
  }
}
