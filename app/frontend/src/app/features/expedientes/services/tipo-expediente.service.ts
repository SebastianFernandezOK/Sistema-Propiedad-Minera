import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/api.constants';

export interface TipoExpediente {
  IdTipoExpediente: number;
  Nombre: string;
  Descripcion?: string;
  Activo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class TipoExpedienteService {
  private readonly baseUrl = `${API_BASE_URL}/tipos-expediente`;

  constructor(private http: HttpClient) {}

  getTipos(): Observable<TipoExpediente[]> {
    return this.http.get<TipoExpediente[]>(this.baseUrl);
  }
}
