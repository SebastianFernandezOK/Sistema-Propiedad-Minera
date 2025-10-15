import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor() { }

  getNotificaciones() {
    return [
      { id: 1, titulo: 'Notificación 1', descripcion: 'Descripción de la notificación 1', fecha: '2025-10-09' },
      { id: 2, titulo: 'Notificación 2', descripcion: 'Descripción de la notificación 2', fecha: '2025-10-08' },
      { id: 3, titulo: 'Notificación 3', descripcion: 'Descripción de la notificación 3', fecha: '2025-10-07' }
    ];
  }
}