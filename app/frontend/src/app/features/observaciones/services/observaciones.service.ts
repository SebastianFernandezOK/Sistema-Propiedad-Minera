import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Observacion } from '../models/observacion.model';

@Injectable({ providedIn: 'root' })
export class ObservacionesService {
  private apiUrl = 'http://localhost:9000/observaciones';

  constructor(private http: HttpClient) {}

  getByTransaccion(idTransaccion: number): Observable<Observacion[]> {
    return this.http.get<Observacion[]>(`${this.apiUrl}?idTransaccion=${idTransaccion}`);
  }

  createObservacion(observacion: Observacion) {
    return this.http.post<Observacion>(this.apiUrl, observacion);
  }

  updateObservacion(id: number, observacion: Observacion) {
    return this.http.put<Observacion>(`${this.apiUrl}/${id}`, observacion);
  }
}
