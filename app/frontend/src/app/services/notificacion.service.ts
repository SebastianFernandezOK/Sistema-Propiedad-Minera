import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.constants';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  private readonly baseUrl = `${API_BASE_URL}/notificaciones`;

  constructor(private http: HttpClient) {}

  // Obtener todas las notificaciones
  getNotificaciones(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // Obtener notificaciones con paginación
  getNotificacionesPaginated(page: number, size: number, funcionario?: string, expediente?: string): Observable<any> {
    let params = `?skip=${page * size}&limit=${size}`;
    if (funcionario && funcionario.trim()) {
      params += `&funcionario=${encodeURIComponent(funcionario)}`;
    }
    if (expediente && expediente.trim()) {
      params += `&expediente=${encodeURIComponent(expediente)}`;
    }
    return this.http.get<any>(`${this.baseUrl}/paginated${params}`);
  }

  // Obtener una notificación por ID
  getNotificacion(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Crear una nueva notificación
  createNotificacion(notificacion: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, notificacion);
  }

  // Actualizar una notificación existente
  updateNotificacion(id: number, notificacion: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, notificacion);
  }

  // Eliminar una notificación
  deleteNotificacion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}