import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TipoAlerta, TipoAlertaCreate } from '../models/tipo-alerta.model';

@Injectable({ providedIn: 'root' })
export class TipoAlertaService {
  private apiUrl = 'http://localhost:9000/tipo-alerta';

  constructor(private http: HttpClient) {}

  getAll(page: number = 0, size: number = 10): Observable<{ data: TipoAlerta[], total: number }> {
    const start = page * size;
    const end = start + size - 1;
    let params = new HttpParams().set('range', `[${start},${end}]`);
    return this.http.get<TipoAlerta[]>(this.apiUrl, { params, observe: 'response' }).pipe(
      map((response: HttpResponse<TipoAlerta[]>) => {
        const contentRange = response.headers.get('Content-Range') || '';
        const total = this.extractTotalFromRange(contentRange);
        return { data: response.body || [], total };
      })
    );
  }

  getById(id: number): Observable<TipoAlerta> {
    return this.http.get<TipoAlerta>(`${this.apiUrl}/${id}`);
  }

  create(tipoAlerta: TipoAlertaCreate): Observable<TipoAlerta> {
    const body = {
      Descripcion: tipoAlerta.Descripcion,
      IdArea: tipoAlerta.IdArea || 0,
      Asunto: tipoAlerta.Asunto || '',
      Mensaje: tipoAlerta.Mensaje || '',
      Obs: tipoAlerta.Obs || '',
      AudFecha: new Date().toISOString(),
      AudUsuario: 0 // Se carga como 0 por el momento
    };
    return this.http.post<TipoAlerta>(this.apiUrl, body);
  }

  update(id: number, tipoAlerta: TipoAlertaCreate): Observable<TipoAlerta> {
    const body = {
      Descripcion: tipoAlerta.Descripcion,
      IdArea: tipoAlerta.IdArea || 0,
      Asunto: tipoAlerta.Asunto || '',
      Mensaje: tipoAlerta.Mensaje || '',
      Obs: tipoAlerta.Obs || '',
      AudFecha: new Date().toISOString(),
      AudUsuario: 0
    };
    return this.http.put<TipoAlerta>(`${this.apiUrl}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private extractTotalFromRange(contentRange: string): number {
    const match = contentRange.match(/\/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  }
}