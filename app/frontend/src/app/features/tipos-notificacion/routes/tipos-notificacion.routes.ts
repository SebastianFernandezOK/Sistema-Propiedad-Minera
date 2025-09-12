import { Routes } from '@angular/router';
import { TiposNotificacionListComponent } from '../components/tipos-notificacion-list.component';
import { TipoNotificacionCreateComponent } from '../components/tipo-notificacion-create.component';

export const TIPOS_NOTIFICACION_ROUTES: Routes = [
  {
    path: '',
    component: TiposNotificacionListComponent
  },
  {
    path: 'nuevo',
    component: TipoNotificacionCreateComponent
  }
];