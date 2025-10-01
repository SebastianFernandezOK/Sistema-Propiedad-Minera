import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstadoAlerta } from '../models/estado-alerta.model';
import { API_BASE_URL } from '../../../core/api.constants';

@Injectable({ providedIn: 'root' })
export class EstadoAlertaService {
  private readonly baseUrl = `${API_BASE_URL}/estado-alerta`;

  constructor(private http: HttpClient) {}

  getEstadosAlerta(): Observable<EstadoAlerta[]> {
    return this.http.get<EstadoAlerta[]>(this.baseUrl);
  }
}
