import { Component, OnInit, HostListener, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../shared/services/theme.service';
import { signal } from '@angular/core';
import {
  Clock4,
  LucideAngularModule,
  Plus,
  ThumbsUp,
  TriangleAlert,
  Trash,
  Pencil,
  CheckSquare,
  CircleCheck,
  MoreVertical,
  Download,
} from 'lucide-angular';
import { ItemsService } from '../../core/services/items.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Medicine {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate: Date;
  status: 'valid' | 'expiringNext' | 'expired';
  placeName: string;
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
  private itemsService = inject(ItemsService);

  icons = {
    thumbsUp: ThumbsUp,
    clock: Clock4,
    alert: TriangleAlert,
    plus: Plus,
    trash: Trash,
    pencil: Pencil,
    checkSquare: CheckSquare,
    circleCheck: CircleCheck,
    moreVertical: MoreVertical,
    download: Download,
  };

  medicines = signal<Medicine[]>([]);
  filteredMedicines = signal<Medicine[]>([]);
  searchTerm = signal('');

  expired = signal(0);
  expiringNext = signal(0);
  valid = signal(0);

  showUserMenu = signal(false);
  openMedDropdowns = signal<Set<string>>(new Set());
  selectedMedicinesCount = signal(0);

  ngOnInit() {
    this.themeService.theme$.subscribe();
    this.loadMedicines();
  }

  @HostListener('document:click')
  closeAllDropdowns() {
    this.openMedDropdowns.set(new Set());
    this.showUserMenu.set(false);
  }

  loadMedicines() {
    this.itemsService.getItemsByHouse().subscribe({
      next: (response: any) => {
        const items = response?.items ?? [];
        const mapped = items.map((item: any) => this.mapItemToMedicine(item));
        this.medicines.set(mapped);
        this.filteredMedicines.set(mapped);
        this.calculateStatistics();
      },
      error: () => {
        this.medicines.set([]);
        this.filteredMedicines.set([]);
        this.calculateStatistics();
      },
    });
  }

  mapItemToMedicine(item: any): Medicine {
    const expiryDate = new Date(item.expirationDate ?? Date.now());
    const status = this.getMedicineStatus(expiryDate);
    const productName = item.product?.name ?? `Medicamento ${item.id}`;
    const placeName = item.place?.name ?? 'Sin lugar';
    const quantity = Number(item.availableContent ?? 0);

    return {
      id: String(item.id),
      name: productName,
      quantity,
      unit: 'unidades',   
      expiryDate,
      status,
      placeName,
    };
  }

  getMedicineStatus(expiryDate: Date): Medicine['status'] {
    const now = new Date();
    const diffInDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffInDays < 0) return 'expired';
    if (diffInDays <= 30) return 'expiringNext';
    return 'valid';
  }

  calculateStatistics() {
    const meds = this.medicines();
    this.expired.set(meds.filter((m) => m.status === 'expired').length);
    this.expiringNext.set(meds.filter((m) => m.status === 'expiringNext').length);
    this.valid.set(meds.filter((m) => m.status === 'valid').length);
  }

  filterMedicines() {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      this.filteredMedicines.set([...this.medicines()]);
    } else {
      this.filteredMedicines.set(
        this.medicines().filter((med) =>
          med.name.toLowerCase().includes(term) ||
          med.placeName.toLowerCase().includes(term)
        ),
      );
    }
  }

  toggleMedDropdown(medicineId: string) {
    const current = new Set(this.openMedDropdowns());
    if (current.has(medicineId)) {
      current.delete(medicineId);
    } else {
      current.add(medicineId);
    }
    this.openMedDropdowns.set(current);
  }

  isMedDropdownOpen(medicineId: string) {
    return this.openMedDropdowns().has(medicineId);
  }

  isMedicineSelected(medicineId: string) {
    return this.medicines().some((m) => m.id === medicineId && m.selected);
  }

  toggleSelectMedicine(medicineId: string) {
    this.medicines.update((meds) =>
      meds.map((m) => (m.id === medicineId ? { ...m, selected: !m.selected } : m)),
    );
    this.selectedMedicinesCount.set(this.medicines().filter((m) => m.selected).length);
  }

  clearSelection() {
    this.medicines.update((meds) => meds.map((m) => ({ ...m, selected: false })));
    this.selectedMedicinesCount.set(0);
  }

  deleteSelectedMedicines() {
    this.medicines()
      .filter((m) => m.selected)
      .forEach((m) => this.deleteMedicine(m.id));
    this.clearSelection();
  }

  editMedicine(medicineId: string) {
    console.log('Editar medicamento:', medicineId);
  }

  deleteMedicine(medicineId: string) {
    this.itemsService.deleteItem(medicineId).subscribe({
      next: () => this.loadMedicines(),
      error: (error) => console.error('Error eliminando medicamento:', error),
    });
  }

  downloadPDF() {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const primaryColor: [number, number, number] = [24, 95, 165];
    const secondaryColor: [number, number, number] = [42, 157, 143];
    const darkText: [number, number, number] = [33, 37, 41];
    const mutedText: [number, number, number] = [108, 117, 125];
    const lightGray: [number, number, number] = [245, 247, 250];
    const borderGray: [number, number, number] = [226, 232, 240];
    const statusColors = {
      valid: { fill: [220, 252, 231] as [number, number, number], text: [22, 101, 52] as [number, number, number] },
      expiringNext: { fill: [255, 247, 205] as [number, number, number], text: [146, 64, 14] as [number, number, number] },
      expired: { fill: [254, 226, 226] as [number, number, number], text: [153, 27, 27] as [number, number, number] },
    };
    const generatedAt = new Date().toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const addPageChrome = () => {
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, 28, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Reporte de Botiquín', margin, 12);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generado: ${generatedAt}`, margin, 18);

      doc.setFontSize(9);
      doc.text(`MedShelf`, pageWidth - margin, 12, { align: 'right' });
    };

    const addFooter = () => {
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(...borderGray);
        doc.setLineWidth(0.3);
        doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

        doc.setTextColor(...mutedText);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('MedShelf · Botiquín', margin, pageHeight - 7);
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
      }
    };

    addPageChrome();

    let yPos = 38;

    doc.setFillColor(...lightGray);
    doc.setDrawColor(...borderGray);
    doc.roundedRect(margin, yPos, pageWidth - margin * 2, 22, 3, 3, 'FD');
    doc.setTextColor(...darkText);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Resumen general', margin + 4, yPos + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...mutedText);
    doc.text('Vista rápida del estado actual del botiquín.', margin + 4, yPos + 13);

    yPos += 30;

    const summaryCards = [
      { label: 'Vigentes', value: this.valid(), color: secondaryColor },
      { label: 'Por vencer', value: this.expiringNext(), color: [245, 158, 11] as [number, number, number] },
      { label: 'Caducados', value: this.expired(), color: [220, 53, 69] as [number, number, number] },
    ];

    const cardWidth = (pageWidth - margin * 2 - 8) / 3;
    summaryCards.forEach((card, index) => {
      const x = margin + index * (cardWidth + 4);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(...borderGray);
      doc.roundedRect(x, yPos, cardWidth, 22, 3, 3, 'FD');
      doc.setFillColor(...card.color);
      doc.roundedRect(x, yPos, 3.5, 22, 3, 3, 'F');

      doc.setTextColor(...darkText);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(card.label, x + 6, yPos + 8);

      doc.setTextColor(...card.color);
      doc.setFontSize(16);
      doc.text(String(card.value), x + 6, yPos + 16);
    });

    yPos += 30;

    doc.setTextColor(...darkText);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Detalle de medicamentos', margin, yPos);
    yPos += 6;

    // Tabla de medicamentos
    const tableData = this.medicines().map((med) => [
      med.name,
      med.quantity,
      med.unit,
      med.placeName,
      med.expiryDate.toLocaleDateString('es-ES'),
      this.getStatusLabel(med.status),
    ]);

    if (tableData.length === 0) {
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(...borderGray);
      doc.roundedRect(margin, yPos, pageWidth - margin * 2, 16, 3, 3, 'FD');
      doc.setFontSize(10);
      doc.setTextColor(...mutedText);
      doc.setFont('helvetica', 'normal');
      doc.text('No hay medicamentos registrados', pageWidth / 2, yPos + 10, { align: 'center' });
    } else {
      autoTable(doc, {
        head: [['Medicamento', 'Cantidad', 'Unidad', 'Ubicación', 'Vencimiento', 'Estado']],
        body: tableData,
        startY: yPos,
        margin: { left: margin, right: margin },
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 2.6,
          textColor: [33, 37, 41],
          lineColor: borderGray,
          lineWidth: 0.2,
          valign: 'middle',
        },
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center',
        },
        bodyStyles: {
          fillColor: [255, 255, 255],
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { cellWidth: 48 },
          1: { cellWidth: 18, halign: 'center' },
          2: { cellWidth: 18, halign: 'center' },
          3: { cellWidth: 34 },
          4: { cellWidth: 28, halign: 'center' },
          5: { cellWidth: 28, halign: 'center' },
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 5) {
            const status = tableData[data.row.index]?.[5] as string;
            const normalizedStatus = this.medicines()[data.row.index]?.status;
            if (normalizedStatus && statusColors[normalizedStatus]) {
              data.cell.styles.fillColor = statusColors[normalizedStatus].fill;
              data.cell.styles.textColor = statusColors[normalizedStatus].text;
              data.cell.styles.fontStyle = 'bold';
            }
          }
        },
        didDrawPage: () => {
          addPageChrome();
        },
      });
    }

    // Descargar
    const fileName = `botiquin_${new Date().getTime()}.pdf`;
    addFooter();
    doc.save(fileName);
  }

  private getStatusLabel(status: Medicine['status']): string {
    switch (status) {
      case 'valid':
        return 'Vigente';
      case 'expiringNext':
        return 'Próx. a vencer';
      case 'expired':
        return 'Caducado';
      default:
        return 'Desconocido';
    }
  }
}