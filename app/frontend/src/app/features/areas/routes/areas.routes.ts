import { Routes } from '@angular/router';

export const AREAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../components/areas-list.component').then(m => m.AreasListComponent)
  },
  {
    path: 'nueva',
    loadComponent: () => import('../components/area-create.component').then(m => m.AreaCreateComponent)
  }
];