import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TipoExpediente, TipoExpedienteCreate } from '../models/tipo-expediente.model';
import { API_BASE_URL } from '../../../core/api.constants';

@Injectable({ providedIn: 'root' })
export class TipoExpedienteService {
  private apiUrl = `${API_BASE_URL}/tipos-expediente`;

  constructor(private http: HttpClient) {}

  getAll(page: number = 0, size: number = 10): Observable<{ data: TipoExpediente[], total: number }> {
    const start = page * size;
    const end = start + size - 1;
    let params = new HttpParams().set('range', `[${start},${end}]`);
    return this.http.get<TipoExpediente[]>(this.apiUrl, { params, observe: 'response' }).pipe(
      map((response: HttpResponse<TipoExpediente[]>) => {
        const contentRange = response.headers.get('Content-Range') || '';
        const total = this.extractTotalFromRange(contentRange);
        return { data: response.body || [], total };
      })
    );
  }

  getAllSimple(): Observable<TipoExpediente[]> {
    return this.http.get<TipoExpediente[]>(this.apiUrl);
  }

  getById(id: number): Observable<TipoExpediente> {
    return this.http.get<TipoExpediente>(`${this.apiUrl}/${id}`);
  }

  create(tipoExpediente: TipoExpedienteCreate): Observable<TipoExpediente> {
    const body = {
      Nombre: tipoExpediente.Nombre,
      Descripcion: tipoExpediente.Descripcion,
      Activo: tipoExpediente.Activo,
      AudFecha: new Date().toISOString(),
      AudUsuario: 0
    };
    return this.http.post<TipoExpediente>(`${this.apiUrl}/`, body);
  }

  update(id: number, tipoExpediente: TipoExpedienteCreate): Observable<TipoExpediente> {
    const body = {
      Nombre: tipoExpediente.Nombre,
      Descripcion: tipoExpediente.Descripcion,
      Activo: tipoExpediente.Activo,
      AudFecha: new Date().toISOString(),
      AudUsuario: 0
    };
    return this.http.put<TipoExpediente>(`${this.apiUrl}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private extractTotalFromRange(contentRange: string): number {
    const match = contentRange.match(/\/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  }
}