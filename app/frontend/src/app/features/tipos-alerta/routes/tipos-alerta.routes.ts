import { Routes } from '@angular/router';

export const TIPOS_ALERTA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../components/tipos-alerta-list.component').then(m => m.TiposAlertaListComponent)
  },
  {
    path: 'nuevo',
    loadComponent: () => import('../components/tipo-alerta-create.component').then(m => m.TipoAlertaCreateComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('../components/tipo-alerta-detail.component').then(m => m.TipoAlertaDetailComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () => import('../components/tipo-alerta-edit.component').then(m => m.TipoAlertaEditComponent)
  }
];