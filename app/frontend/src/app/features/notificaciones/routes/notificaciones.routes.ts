import { Routes } from '@angular/router';

export const NOTIFICACIONES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../components/notificacion-list.component').then(m => m.NotificacionListComponent)
  },
  {
    path: 'crear',
    loadComponent: () => import('../components/notificacion-create/notificacion-create.component').then(m => m.NotificacionCreateComponent)
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('../components/notificacion-edit/notificacion-edit.component').then(m => m.NotificacionEditComponent)
  },
  {
    path: 'detalle/:id',
    loadComponent: () => import('../components/notificacion-detail.component').then(m => m.NotificacionDetailComponent)
  }
];