import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Area, AreaCreate } from '../models/area.model';

@Injectable({ providedIn: 'root' })
export class AreaService {
  private apiUrl = 'http://localhost:9000/areas';

  constructor(private http: HttpClient) {}

  getAll(page: number = 0, size: number = 10): Observable<{ data: Area[], total: number }> {
    const start = page * size;
    const end = start + size - 1;
    let params = new HttpParams().set('range', `[${start},${end}]`);
    return this.http.get<Area[]>(this.apiUrl, { params, observe: 'response' }).pipe(
      map((response: HttpResponse<Area[]>) => {
        const contentRange = response.headers.get('Content-Range') || '';
        const total = this.extractTotalFromRange(contentRange);
        return { data: response.body || [], total };
      })
    );
  }

  getAllSimple(): Observable<Area[]> {
    return this.http.get<Area[]>(this.apiUrl);
  }

  getById(id: number): Observable<Area> {
    return this.http.get<Area>(`${this.apiUrl}/${id}`);
  }

  create(area: AreaCreate): Observable<Area> {
    const body = {
      Descripcion: area.Descripcion,
      AudFecha: new Date().toISOString(),
      AudUsuario: null, // Por el momento nulo
      IdArea: 0 // No debería registrarse según tu especificación
    };
    return this.http.post<Area>(`${this.apiUrl}/`, body);
  }

  update(id: number, area: AreaCreate): Observable<Area> {
    const body = {
      Descripcion: area.Descripcion,
      AudFecha: new Date().toISOString(),
      AudUsuario: null
    };
    return this.http.put<Area>(`${this.apiUrl}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private extractTotalFromRange(contentRange: string): number {
    const match = contentRange.match(/\/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  }
}