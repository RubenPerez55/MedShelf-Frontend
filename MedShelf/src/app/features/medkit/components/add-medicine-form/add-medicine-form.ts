import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Check } from 'lucide-angular';

@Component({
  selector: 'app-add-medicine-form',
  imports: [RouterModule, LucideAngularModule],
  templateUrl: './add-medicine-form.html',
  styleUrl: './add-medicine-form.css',
})
export class AddMedicineForm {
icons = { arrowLeft: ArrowLeft, check: Check };
}
