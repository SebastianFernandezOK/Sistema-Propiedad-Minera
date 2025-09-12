import { Routes } from '@angular/router';
import { TiposAlertaListComponent } from '../components/tipos-alerta-list.component';
import { TipoAlertaCreateComponent } from '../components/tipo-alerta-create.component';

export const TIPOS_ALERTA_ROUTES: Routes = [
  {
    path: '',
    component: TiposAlertaListComponent
  },
  {
    path: 'nuevo',
    component: TipoAlertaCreateComponent
  }
];