import { Routes } from '@angular/router';

export const TIPOS_EXPEDIENTE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../components/tipos-expediente-list.component').then(m => m.TiposExpedienteListComponent)
  },
  {
    path: 'nuevo',
    loadComponent: () => import('../components/tipo-expediente-create.component').then(m => m.TipoExpedienteCreateComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('../components/tipo-expediente-detail.component').then(m => m.TipoExpedienteDetailComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () => import('../components/tipo-expediente-edit.component').then(m => m.TipoExpedienteEditComponent)
  }
];