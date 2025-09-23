import { Routes } from '@angular/router';

export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../components/usuarios-list.component').then(m => m.UsuariosListComponent)
  },
  {
    path: 'nuevo',
    loadComponent: () => import('../components/usuario-create.component').then(m => m.UsuarioCreateComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('../components/usuario-detail.component').then(m => m.UsuarioDetailComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () => import('../components/usuario-edit.component').then(m => m.UsuarioEditComponent)
  },
  {
    path: ':id/cambiar-password',
    loadComponent: () => import('../components/cambiar-password.component').then(m => m.CambiarPasswordComponent)
  }
];