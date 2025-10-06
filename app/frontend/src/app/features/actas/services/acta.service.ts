import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/api.constants';

export interface Alerta {
  idAlerta: number;
  Estado: string;
  Mensaje: string;
  Asunto?: string;
}

export interface Acta {
  IdActa: number;
  IdExpediente: number;
  Fecha: string;
  IdTipoActa: string;
  Descripcion: string;
  Lugar: string;
  IdAutoridad: string;
  Obs?: string;
  AudFecha?: string;
  AudUsuario?: number;
  RepresentanteLegal?: string;
}

export interface ActaDetalleResponse extends Acta {
  alertas?: Alerta[];
  IdTransaccion?: number; // Para evitar errores de tipado, agregamos IdTransaccion como opcional en ActaDetalleResponse
}

@Injectable({ providedIn: 'root' })
export class ActaService {
  getArchivosByEntidad(entidad: string, idEntidad: number, page: number = 1, limit: number = 10): Observable<any> {
    // El backend debe aceptar parámetros ?page=1&limit=10
    return this.http.get<any>(`${API_BASE_URL}/archivos/${entidad}/${idEntidad}?page=${page}&limit=${limit}`);
  }
  private apiUrl = `${API_BASE_URL}/actas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Acta[]> {
    return this.http.get<Acta[]>(this.apiUrl);
  }

  getById(id: number): Observable<ActaDetalleResponse> {
    return this.http.get<ActaDetalleResponse>(`${this.apiUrl}/${id}`);
  }

  create(acta: Acta): Observable<Acta> {
    return this.http.post<Acta>(this.apiUrl, acta);
  }

  update(id: number, acta: Acta): Observable<Acta> {
    return this.http.put<Acta>(`${this.apiUrl}/${id}`, acta);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getActaById(id: number): Observable<ActaDetalleResponse> {
    return this.http.get<ActaDetalleResponse>(`${this.apiUrl}/${id}`);
  }

  getActasByExpedientePaged(idExpediente: number, pageIndex: number, pageSize: number): Observable<any> {
    const filter = encodeURIComponent(JSON.stringify({ IdExpediente: idExpediente }));
    const range = `[${pageIndex * pageSize},${(pageIndex + 1) * pageSize - 1}]`;
    return this.http.get<any>(
      `${this.apiUrl}?filter=${filter}&range=${range}`,
      { observe: 'response' }
    );
  }
}
