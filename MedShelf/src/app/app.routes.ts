import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Home } from './core/home/home';
import { Register } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard';


export const routes: Routes = [
    {
        path: '',
        component: Home,
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register,
    },
    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
