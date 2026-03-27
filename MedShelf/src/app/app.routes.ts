import { Routes } from '@angular/router';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { Home } from './features/home/home';
import { Dashboard } from './features/dashboard/dashboard';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'dashboard', component: Dashboard },
    ],
  },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
];
