import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService, type Theme } from '../../shared/services/theme.service';

interface Medicamento {
  id: number;
  nombre: string;
  cantidad: number;
  unidad: string;
  dosis: string;
  fechaVencimiento: Date;
  estado: 'vigente' | 'proximoVencer' | 'caducado';
  indicaciones?: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  @ViewChild('userDropdown') userDropdown!: ElementRef;
  
  medicamentos: Medicamento[] = [];
  medicamentosFiltrados: Medicamento[] = [];
  searchTerm: string = '';

  caducados: number = 0;
  proximosVencer: number = 0;
  vigentes: number = 0;

  showUserMenu: boolean = false;
  currentTheme: Theme = 'light';

  constructor(private router: Router, private themeService: ThemeService) {
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  ngOnInit() {
    this.cargarMedicamentos();
    this.calcularEstadisticas();
  }

  cargarMedicamentos() {
    const hoy = new Date();
    const mañana = new Date(hoy.getTime() + 24 * 60 * 60 * 1000);
    const quinceDias = new Date(hoy.getTime() + 15 * 24 * 60 * 60 * 1000);
    const tresMeses = new Date(hoy.getTime() + 90 * 24 * 60 * 60 * 1000);
    const unAño = new Date(hoy.getTime() + 365 * 24 * 60 * 60 * 1000);

    this.medicamentos = [
      {
        id: 1,
        nombre: 'Paracetamol 500mg',
        cantidad: 20,
        unidad: 'tabletas',
        dosis: '500mg cada 6-8 horas',
        fechaVencimiento: tresMeses,
        estado: 'vigente',
        indicaciones: 'Para dolor y fiebre'
      },
      {
        id: 2,
        nombre: 'Ibuprofeno 200mg',
        cantidad: 15,
        unidad: 'cápsulas',
        dosis: '200mg cada 4-6 horas',
        fechaVencimiento: quinceDias,
        estado: 'proximoVencer',
        indicaciones: 'Antiinflamatorio'
      },
      {
        id: 3,
        nombre: 'Amoxicilina 500mg',
        cantidad: 10,
        unidad: 'cápsulas',
        dosis: '500mg cada 8 horas',
        fechaVencimiento: mañana,
        estado: 'caducado',
        indicaciones: 'Antibiótico'
      },
      {
        id: 4,
        nombre: 'Vitamina C 1000mg',
        cantidad: 30,
        unidad: 'tabletas',
        dosis: '1000mg diarios',
        fechaVencimiento: unAño,
        estado: 'vigente',
        indicaciones: 'Suplemento inmunológico'
      },
      {
        id: 5,
        nombre: 'Loratadina 10mg',
        cantidad: 8,
        unidad: 'tabletas',
        dosis: '10mg una vez al día',
        fechaVencimiento: quinceDias,
        estado: 'proximoVencer',
        indicaciones: 'Antihistamínico'
      },
      {
        id: 6,
        nombre: 'Omeprazol 20mg',
        cantidad: 14,
        unidad: 'cápsulas',
        dosis: '20mg cada 12 horas',
        fechaVencimiento: new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000),
        estado: 'caducado',
        indicaciones: 'Para acidez estomacal'
      },
      {
        id: 7,
        nombre: 'Metformina 500mg',
        cantidad: 60,
        unidad: 'tabletas',
        dosis: '500mg dos veces al día',
        fechaVencimiento: unAño,
        estado: 'vigente',
        indicaciones: 'Para diabetes'
      },
      {
        id: 8,
        nombre: 'Dipirona 500mg',
        cantidad: 12,
        unidad: 'tabletas',
        dosis: '500mg cada 6 horas',
        fechaVencimiento: tresMeses,
        estado: 'vigente',
        indicaciones: 'Analgésico'
      },
      {
        id: 9,
        nombre: 'Ceptriaxona 800mg',
        cantidad: 24,
        unidad: 'tabletas',
        dosis: '800mg cada 12 horas',
        fechaVencimiento: unAño,
        estado: 'vigente',
        indicaciones: 'Antibiótico'
      }
    ];

    this.medicamentosFiltrados = [...this.medicamentos];
  }

  calcularEstadisticas() {
    this.caducados = this.medicamentos.filter(m => m.estado === 'caducado').length;
    this.proximosVencer = this.medicamentos.filter(m => m.estado === 'proximoVencer').length;
    this.vigentes = this.medicamentos.filter(m => m.estado === 'vigente').length;
  }

  filtrarMedicamentos() {
    if (this.searchTerm.trim() === '') {
      this.medicamentosFiltrados = [...this.medicamentos];
    } else {
      const termino = this.searchTerm.toLowerCase();
      this.medicamentosFiltrados = this.medicamentos.filter(med =>
        med.nombre.toLowerCase().includes(termino) ||
        med.indicaciones?.toLowerCase().includes(termino)
      );
    }
  }

  agregarMedicamento() {
    console.log('Abrir modal para agregar medicamento');
    // Aquí irá la navegación o modal para agregar
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.userDropdown && !this.userDropdown.nativeElement.contains(event.target)) {
      this.showUserMenu = false;
    }
  }

  cerrarSesion() {
    this.showUserMenu = false;
    console.log('Sesión cerrada');
    this.router.navigate(['']);
  }
}

