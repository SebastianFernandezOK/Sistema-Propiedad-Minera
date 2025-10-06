import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_BASE_URL } from '../../../core/api.constants';

@Injectable({ providedIn: 'root' })
export class AlertaGlobalService {
  private readonly baseUrl = `${API_BASE_URL}/alertas/`;

  constructor(private http: HttpClient) {}

  getAllPaginated(page: number = 0, size: number = 10, idEstado?: string): Observable<{ data: any[]; total: number }> {
    const start = page * size;
    const end = start + size - 1;
    let params = new HttpParams().set('range', `[${start},${end}]`);
    
    // Agregar filtro por estado si existe
    if (idEstado && idEstado !== '') {
      params = params.set('id_estado', idEstado);
    }
    
    return this.http
      .get<any[]>(this.baseUrl, { params, observe: 'response' })
      .pipe(
        map((response: HttpResponse<any[]>) => {
          const contentRange = response.headers.get('Content-Range') || '';
          const total = this.extractTotalFromRange(contentRange);
          return { data: response.body || [], total };
        })
      );
  }

  private extractTotalFromRange(contentRange: string): number {
    const match = contentRange.match(/\/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  }
}
