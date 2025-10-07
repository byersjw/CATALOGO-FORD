import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Home
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
  },

  // Catálogo
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./pages/catalogo/catalogo.component').then(m => m.CatalogoComponent),
  },

  // Login
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent),
  },

  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
