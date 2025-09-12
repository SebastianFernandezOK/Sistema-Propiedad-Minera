import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TipoNotificacion, TipoNotificacionCreate } from '../models/tipo-notificacion.model';

@Injectable({ providedIn: 'root' })
export class TipoNotificacionService {
  private apiUrl = 'http://localhost:9000/tipos-notificacion';

  constructor(private http: HttpClient) {}

  getAll(page: number = 0, size: number = 10): Observable<{ data: TipoNotificacion[], total: number }> {
    const start = page * size;
    const end = start + size - 1;
    let params = new HttpParams().set('range', `[${start},${end}]`);
    return this.http.get<TipoNotificacion[]>(this.apiUrl, { params, observe: 'response' }).pipe(
      map((response: HttpResponse<TipoNotificacion[]>) => {
        const contentRange = response.headers.get('Content-Range') || '';
        const total = this.extractTotalFromRange(contentRange);
        return { data: response.body || [], total };
      })
    );
  }

  getById(id: number): Observable<TipoNotificacion> {
    return this.http.get<TipoNotificacion>(`${this.apiUrl}/${id}`);
  }

  create(tipoNotificacion: TipoNotificacionCreate): Observable<TipoNotificacion> {
    const body = {
      Descripcion: tipoNotificacion.Descripcion,
      DescCorta: tipoNotificacion.DescCorta || null,
      AudUsuario: null, // Se carga como nulo por el momento
      AudFecha: new Date().toISOString() // Fecha actual automática
    };
    return this.http.post<TipoNotificacion>(this.apiUrl, body);
  }

  update(id: number, tipoNotificacion: TipoNotificacionCreate): Observable<TipoNotificacion> {
    const body = {
      Descripcion: tipoNotificacion.Descripcion,
      DescCorta: tipoNotificacion.DescCorta || null,
      AudUsuario: null,
      AudFecha: new Date().toISOString()
    };
    return this.http.put<TipoNotificacion>(`${this.apiUrl}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private extractTotalFromRange(contentRange: string): number {
    const match = contentRange.match(/\/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  }
}