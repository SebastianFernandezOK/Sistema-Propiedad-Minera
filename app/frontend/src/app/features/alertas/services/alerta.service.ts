import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertaCreate } from '../models/alerta.model';

@Injectable({ providedIn: 'root' })
export class AlertaService {
  private readonly baseUrl = 'http://localhost:9000/alertas';

  constructor(private http: HttpClient) {}

  createAlerta(alerta: AlertaCreate): Observable<any> {
    return this.http.post<any>(this.baseUrl, alerta);
  }

  updateAlerta(id: number, alerta: Partial<AlertaCreate>): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, alerta);
  }
}
