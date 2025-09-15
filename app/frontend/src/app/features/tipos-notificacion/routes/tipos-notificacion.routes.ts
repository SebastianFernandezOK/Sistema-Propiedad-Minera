import { Routes } from '@angular/router';

export const TIPOS_NOTIFICACION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../components/tipos-notificacion-list.component').then(m => m.TiposNotificacionListComponent)
  },
  {
    path: 'nuevo',
    loadComponent: () => import('../components/tipo-notificacion-create.component').then(m => m.TipoNotificacionCreateComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('../components/tipo-notificacion-detail.component').then(m => m.TipoNotificacionDetailComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () => import('../components/tipo-notificacion-edit.component').then(m => m.TipoNotificacionEditComponent)
  }
];