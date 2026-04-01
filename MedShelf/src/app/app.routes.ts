import { Routes } from '@angular/router';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { Home } from './features/home/home';
import { Medkit } from './features/medkit/medkit';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Profile } from './features/profile/profile';
import { Meds } from './features/meds/meds';
import { AddMedicineForm } from './features/medkit/components/add-medicine-form/add-medicine-form';
import { AddTreatmentForm } from './features/meds/components/add-tratments-form/add-treatment-form';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'medkit', component: Medkit },
      { path: 'medkit/add-medicine', component: AddMedicineForm },
      { path: 'profile', component: Profile },
      { path: 'meds', component: Meds },
      { path: 'meds/add-treatment', component: AddTreatmentForm },
    ],
  },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
];
