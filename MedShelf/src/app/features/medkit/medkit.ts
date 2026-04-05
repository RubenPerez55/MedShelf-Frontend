import { Component, OnInit, HostListener, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ThemeService, type Theme } from '../../shared/services/theme.service';
import { Clock4, LucideAngularModule, Plus, ThumbsUp, TriangleAlert, Trash, Pencil, CheckSquare, CircleCheck, MoreVertical } from 'lucide-angular';

interface Medicine {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  dosage: string;
  expiryDate: Date;
  status: 'valid' | 'expiringNext' | 'expired';
  instructions?: string;
  selected?: boolean;
}

@Component({
  selector: 'app-medkit',
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './medkit.html',
  styleUrl: './medkit.css',
})
export class Medkit implements OnInit {
  @ViewChild('userDropdown') userDropdown!: ElementRef;
  private themeService = inject(ThemeService);

  icons = {
    thumbsUp: ThumbsUp,
    clock: Clock4,
    alert: TriangleAlert,
    plus: Plus,
    trash: Trash,
    pencil: Pencil,
    checkSquare: CheckSquare,
    circleCheck: CircleCheck,
    moreVertical: MoreVertical
  };

  medicines: Medicine[] = [];
  private _filteredMedicines: Medicine[] = [];
  searchTerm: string = '';

  expired: number = 0;
  expiringNext: number = 0;
  valid: number = 0;

  showUserMenu: boolean = false;
  openMedDropdowns: Set<number> = new Set();
  selectedMedicinesCount: number = 0;
  private readonly LOCAL_STORAGE_KEY = 'medshelf_medicamentos';

  get filteredMedicines(): Medicine[] {
    return this._filteredMedicines;
  }

  set filteredMedicines(value: Medicine[]) {
    this._filteredMedicines = value;
  }

  constructor(private router: Router) {}

  ngOnInit() {
    // Suscribirse a cambios de tema para forzar detección de cambios de Angular
    this.themeService.theme$.subscribe();
    this.loadMedicines();
    this.filteredMedicines = [...this.medicines];
    this.calculateStatistics();
  }

  loadMedicines() {
    // Intentar cargar desde localStorage
    const datosGuardados = localStorage.getItem(this.LOCAL_STORAGE_KEY);

    if (datosGuardados) {
      try {
        const medicamentosGuardados = JSON.parse(datosGuardados);
        // Convertir strings de fechas nuevamente a Date y mapear propiedades antiguas a nuevas
        this.medicines = medicamentosGuardados.map((med: any) => {
          // Obtener el estado y convertir valores antiguos a nuevos
          let statusValue = med.status || med.estado || 'valid';
          
          // Mapear valores antiguos de estado a los nuevos
          if (statusValue === 'vigente') statusValue = 'valid';
          if (statusValue === 'proximoVencer') statusValue = 'expiringNext';
          if (statusValue === 'caducado') statusValue = 'expired';
          
          // Mapear propiedades antiguas (en español) a nuevas (en inglés)
          const mappedMed: Medicine = {
            id: med.id,
            name: med.name || med.nombre || '',
            quantity: med.quantity || med.cantidad || 0,
            unit: med.unit || med.unidad || '',
            dosage: med.dosage || med.dosis || '',
            expiryDate: new Date(med.expiryDate || med.fechaVencimiento),
            status: statusValue as 'valid' | 'expiringNext' | 'expired',
            instructions: med.instructions || med.indicaciones,
            selected: med.selected || false,
          };
          
          return mappedMed;
        });
        console.log('Medicamentos cargados desde localStorage:', this.medicines.length);
        return;
      } catch (e) {
        console.error('Error al cargar medicamentos desde localStorage:', e);
      }
    }

    // Si no hay datos en localStorage o hubo error, cargar datos por defecto
    const hoy = new Date();
    const mañana = new Date(hoy.getTime() + 24 * 60 * 60 * 1000);
    const quinceDias = new Date(hoy.getTime() + 15 * 24 * 60 * 60 * 1000);
    const tresMeses = new Date(hoy.getTime() + 90 * 24 * 60 * 60 * 1000);
    const unAño = new Date(hoy.getTime() + 365 * 24 * 60 * 60 * 1000);

    this.medicines = [
      {
        id: 1,
        name: 'Paracetamol 500mg',
        quantity: 20,
        unit: 'tabletas',
        dosage: '500mg cada 6-8 horas',
        expiryDate: tresMeses,
        status: 'valid' as const,
        instructions: 'Para dolor y fiebre',
        selected: false,
      },
      {
        id: 2,
        name: 'Ibuprofeno 200mg',
        quantity: 15,
        unit: 'cápsulas',
        dosage: '200mg cada 4-6 horas',
        expiryDate: quinceDias,
        status: 'expiringNext' as const,
        instructions: 'Antiinflamatorio',
        selected: false,
      },
      {
        id: 3,
        name: 'Amoxicilina 500mg',
        quantity: 10,
        unit: 'cápsulas',
        dosage: '500mg cada 8 horas',
        expiryDate: mañana,
        status: 'expired' as const,
        instructions: 'Antibiótico',
        selected: false,
      },
      {
        id: 4,
        name: 'Vitamina C 1000mg',
        quantity: 30,
        unit: 'tabletas',
        dosage: '1000mg diarios',
        expiryDate: unAño,
        status: 'valid' as const,
        instructions: 'Suplemento inmunológico',
        selected: false,
      },
      {
        id: 5,
        name: 'Loratadina 10mg',
        quantity: 8,
        unit: 'tabletas',
        dosage: '10mg una vez al día',
        expiryDate: quinceDias,
        status: 'expiringNext' as const,
        instructions: 'Antihistamínico',
        selected: false,
      },
      {
        id: 6,
        name: 'Omeprazol 20mg',
        quantity: 14,
        unit: 'cápsulas',
        dosage: '20mg cada 12 horas',
        expiryDate: new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000),
        status: 'expired' as const,
        instructions: 'Para acidez estomacal',
        selected: false,
      },
      {
        id: 7,
        name: 'Metformina 500mg',
        quantity: 60,
        unit: 'tabletas',
        dosage: '500mg dos veces al día',
        expiryDate: unAño,
        status: 'valid' as const,
        instructions: 'Para diabetes',
        selected: false,
      },
      {
        id: 8,
        name: 'Dipirona 500mg',
        quantity: 12,
        unit: 'tabletas',
        dosage: '500mg cada 6 horas',
        expiryDate: tresMeses,
        status: 'valid' as const,
        instructions: 'Analgésico',
        selected: false,
      },
      {
        id: 9,
        name: 'Ceptriaxona 800mg',
        quantity: 24,
        unit: 'tabletas',
        dosage: '800mg cada 12 horas',
        expiryDate: unAño,
        status: 'valid' as const,
        instructions: 'Antibiótico',
        selected: false,
      },
      {
        id: 10,
        name: 'Paracetamola 500mg',
        quantity: 20,
        unit: 'tabletas',
        dosage: '500mg cada 6-8 horas',
        expiryDate: tresMeses,
        status: 'valid' as const,
        instructions: 'Para dolor y fiebre',
        selected: false,
      },
    ];

    // Guardar datos por defecto en localStorage
    this.saveMedicinesToLocalStorage();
  }

  private saveMedicinesToLocalStorage() {
    try {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(this.medicines));
      console.log('Medicamentos guardados en localStorage');
    } catch (e) {
      console.error('Error al guardar medicamentos en localStorage:', e);
    }
  }

  calculateStatistics() {
    this.expired = this.medicines.filter((m) => m.status === 'expired').length;
    this.expiringNext = this.medicines.filter((m) => m.status === 'expiringNext').length;
    this.valid = this.medicines.filter((m) => m.status === 'valid').length;
  }

  filterMedicines() {
    if (this.searchTerm.trim() === '') {
      this.filteredMedicines = [...this.medicines];
    } else {
      const termino = this.searchTerm.toLowerCase();
      this.filteredMedicines = this.medicines.filter(
        (med) =>
          med.name.toLowerCase().includes(termino) ||
          med.instructions?.toLowerCase().includes(termino),
      );
    }
    console.log('Filtrado aplicado. Mostrar:', this.filteredMedicines.length);
  }

  addMedicine() {}

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleMedDropdown(medId: number) {
    if (this.openMedDropdowns.has(medId)) {
      this.openMedDropdowns.delete(medId);
    } else {
      this.openMedDropdowns.add(medId);
    }
  }

  isMedDropdownOpen(medId: number): boolean {
    return this.openMedDropdowns.has(medId);
  }

  closeMedDropdown(medId: number) {
    this.openMedDropdowns.delete(medId);
  }

  editMedicine(medId: number) {
    console.log('Editar medicamento', medId);
    this.closeMedDropdown(medId);
  }

  deleteMedicine(medId: number) {
    console.log('Eliminar medicamento', medId);
    this.medicines = this.medicines.filter((m) => m.id !== medId);
    this.saveMedicinesToLocalStorage();
    this.filterMedicines();
    this.calculateStatistics();
    this.closeMedDropdown(medId);
  }

  toggleSelectMedicine(medId: number) {
    const med = this.medicines.find((m) => m.id === medId);
    if (med) {
      med.selected = !med.selected;
      this.updateSelectedCount();
      this.closeMedDropdown(medId);
    }
  }

  isMedicineSelected(medId: number): boolean {
    const med = this.medicines.find((m) => m.id === medId);
    return med?.selected || false;
  }

  updateSelectedCount() {
    this.selectedMedicinesCount = this.medicines.filter((m) => m.selected).length;
  }

  deleteSelectedMedicines() {
    this.medicines = this.medicines.filter((m) => !m.selected);
    this.selectedMedicinesCount = 0;
    this.saveMedicinesToLocalStorage();
    this.filterMedicines();
    this.calculateStatistics();
  }

  clearSelection() {
    this.medicines.forEach((m) => (m.selected = false));
    this.selectedMedicinesCount = 0;
  }

  updateMedicine(medicamentoActualizado: Medicine) {
    const indice = this.medicines.findIndex((m) => m.id === medicamentoActualizado.id);
    if (indice !== -1) {
      this.medicines[indice] = medicamentoActualizado;
      this.saveMedicinesToLocalStorage();
      this.filterMedicines();
      this.calculateStatistics();
      console.log('Medicamento actualizado:', medicamentoActualizado.name);
    }
  }

  addNewMedicine({
    name,
    quantity,
    unit,
    dosage,
    expiryDate,
    status,
    instructions,
  }: {
    name: string;
    quantity: number;
    unit: string;
    dosage: string;
    expiryDate: Date;
    status: 'valid' | 'expiringNext' | 'expired';
    instructions: string;
  }) {
    const nuevoId = Math.max(...this.medicines.map((m) => m.id), 0) + 1;
    const nuevoMedicamento: Medicine = {
      id: nuevoId,
      name,
      quantity,
      unit,
      dosage,
      expiryDate,
      status,
      instructions,
      selected: false,
    };
    this.medicines.push(nuevoMedicamento);
    this.saveMedicinesToLocalStorage();
    this.filterMedicines();
    this.calculateStatistics();
    console.log('Nuevo medicamento agregado:', name);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.userDropdown && !this.userDropdown.nativeElement.contains(event.target)) {
      this.showUserMenu = false;
    }

    const medActionsElements = document.querySelectorAll('.med-actions-container');
    let clickedInsideMedActions = false;

    medActionsElements.forEach((element) => {
      if (element.contains(event.target as Node)) {
        clickedInsideMedActions = true;
      }
    });

    if (!clickedInsideMedActions) {
      this.openMedDropdowns.clear();
    }
  }

  logout() {
    this.showUserMenu = false;
    console.log('Sesión cerrada');
    this.router.navigate(['']);
  }
}
