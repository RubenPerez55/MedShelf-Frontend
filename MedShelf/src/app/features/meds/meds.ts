import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { LucideAngularModule, Plus, ChevronDown, ArrowLeft, Pill, PillBottle } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { TreatmentsService, TreatmentResponse } from '../../core/services/treatments.service';
import { ProfilesService } from '../../core/services/profiles.service';
import { ItemsService } from '../../core/services/items.service';
import { ConsumptionsService } from '../../core/services/consumptions.service';

interface ExpandedItem {
  id: string;
  product?: {
    id: string;
    name: string;
  };
  place?: {
    id: string;
    name: string;
  };
  availableContent?: number;
  expirationDate?: string;
}

@Component({
  selector: 'app-meds',
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './meds.html',
  styleUrl: './meds.css',
})
export class Meds implements OnInit, OnDestroy {
  private readonly treatmentsService = inject(TreatmentsService);
  private readonly profilesService = inject(ProfilesService);
  private readonly itemsService = inject(ItemsService);
  private readonly consumptionsService = inject(ConsumptionsService);
  private currentQrObjectUrl: string | null = null;

  icons = { plus: Plus, chevronDown: ChevronDown, arrowLeft: ArrowLeft, pillBottle: PillBottle, pill: Pill };
  isLoading = false;
  qrLoading = signal(false);
  showQrModal = signal(false);
  selectedQrTreatment = signal<TreatmentResponse | null>(null);
  qrImageUrl = signal<string | null>(null);
  errorMessage = '';
  treatments = signal<TreatmentResponse[]>([]);
  expandedId = signal<string | null>(null);

  // map de treatmentId -> items del medicamento
  itemDetails = signal<Record<string, ExpandedItem[]>>({});

  get activeTreatments(): TreatmentResponse[] {
    return this.treatments().filter((t) => t.status === 'active');
  }

  get hasMore(): boolean {
    return this.treatmentsService.hasMore();
  }

  ngOnInit(): void {
    this.loadTreatments();
  }

  ngOnDestroy(): void {
    this.revokeQrObjectUrl();
  }

  isActive(treatment: TreatmentResponse): boolean {
    return treatment.status === 'active';
  }

  loadTreatments(): void {
    this.isLoading = true;
    this.treatmentsService.getAllTreatments().subscribe({
      next: () => {
        this.treatments.set(this.treatmentsService.treatments());
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar los tratamientos';
        this.isLoading = false;
      },
    });
  }

  loadTreatmentsByProfile(profileId: string): void {
    this.isLoading = true;
    this.treatmentsService.getTreatmentsByProfile(profileId).subscribe({
      next: () => {
        this.treatments.set(this.treatmentsService.treatments());
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar los tratamientos por perfil';
        this.isLoading = false;
      },
    });
  }

  toggleExpand(treatment: TreatmentResponse): void {
    const treatmentId = treatment.id;

    // colapsar si ya está abierto
    if (this.expandedId() === treatmentId) {
      this.expandedId.set(null);
      return;
    }

    // si ya tenemos los items cacheados, solo expandir
    if (this.itemDetails()[treatmentId] !== undefined) {
      this.expandedId.set(treatmentId);
      return;
    }

    this.loadTreatmentItems(treatment, true);
  }

  registerConsumption(itemId: string, amount: number, treatment: TreatmentResponse): void {
    this.consumptionsService.addConsumption(itemId, amount).subscribe({
      next: () => {
        this.loadTreatmentItems(treatment, false);
        this.loadTreatments();
      },
      error: () => {
        this.errorMessage = 'Error al registrar el consumo';
      },
    });
  }

  private loadTreatmentItems(treatment: TreatmentResponse, expandAfterLoad: boolean): void {
    this.itemsService
      .getItemsInMedkit(treatment.product.id, { 'filter[productId]': treatment.product.id })
      .subscribe({
        next: (response: any) => {
          const availableItems = ((response?.items ?? []) as ExpandedItem[]).filter(
            (item) => (item.availableContent ?? 0) > 0,
          );

          this.itemDetails.update((prev) => ({
            ...prev,
            [treatment.id]: availableItems,
          }));

          if (expandAfterLoad) {
            this.expandedId.set(treatment.id);
          }
        },
        error: () => {
          this.itemDetails.update((prev) => ({
            ...prev,
            [treatment.id]: [],
          }));

          if (expandAfterLoad) {
            this.expandedId.set(treatment.id);
          }
        },
      });
  }

  openQrModal(treatment: TreatmentResponse): void {
    this.selectedQrTreatment.set(treatment);
    this.showQrModal.set(true);
    this.qrLoading.set(true);
    this.errorMessage = '';

    this.revokeQrObjectUrl();

    this.treatmentsService.getTreatmentQr(treatment.id).subscribe({
      next: (blob) => {
        const objectUrl = URL.createObjectURL(blob);
        this.currentQrObjectUrl = objectUrl;
        this.qrImageUrl.set(objectUrl);
        this.qrLoading.set(false);
      },
      error: () => {
        this.qrLoading.set(false);
        this.errorMessage = 'No se pudo generar el QR del tratamiento.';
      },
    });
  }

  closeQrModal(): void {
    this.showQrModal.set(false);
    this.selectedQrTreatment.set(null);
    this.qrImageUrl.set(null);
    this.qrLoading.set(false);
    this.revokeQrObjectUrl();
  }

  private revokeQrObjectUrl(): void {
    if (this.currentQrObjectUrl) {
      URL.revokeObjectURL(this.currentQrObjectUrl);
      this.currentQrObjectUrl = null;
    }
  }
}
