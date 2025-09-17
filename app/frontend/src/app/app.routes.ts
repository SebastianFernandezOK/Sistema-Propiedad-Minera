import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: '/propiedades',
        pathMatch: 'full'
      },
      {
        path: 'propiedades',
        loadChildren: () => import('./features/propiedades/propiedades.routes').then(r => r.PROPIEDADES_ROUTES)
      },
      {
        path: 'expedientes',
        loadChildren: () => import('./features/expedientes/routes/expedientes.routes').then(r => r.EXPEDIENTES_ROUTES)
      },
      {
        path: 'titulares',
        loadChildren: () => import('./features/titulares/titulares.routes').then(r => r.TITULARES_ROUTES)
      },
      {
        path: 'alertas',
        loadComponent: () => import('./features/alertas/components/alertas-global-list.component').then(m => m.AlertasGlobalListComponent)
      },
      {
        path: 'tipos-notificacion',
        loadChildren: () => import('./features/tipos-notificacion/routes/tipos-notificacion.routes').then(r => r.TIPOS_NOTIFICACION_ROUTES)
      },
      {
        path: 'tipos-alerta',
        loadChildren: () => import('./features/tipos-alerta/routes/tipos-alerta.routes').then(r => r.TIPOS_ALERTA_ROUTES)
      },
      {
        path: 'areas',
        loadChildren: () => import('./features/areas/routes/areas.routes').then(r => r.AREAS_ROUTES)
      },
      {
        path: 'tipos-expediente',
        loadChildren: () => import('./features/tipos-expediente/routes/tipos-expediente.routes').then(r => r.TIPOS_EXPEDIENTE_ROUTES)
      }
    ]
  }
];
