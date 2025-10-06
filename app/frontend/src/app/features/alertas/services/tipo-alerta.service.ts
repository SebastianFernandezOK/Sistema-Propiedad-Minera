import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/api.constants';

@Injectable({ providedIn: 'root' })
export class TipoAlertaService {
  private readonly baseUrl = `${API_BASE_URL}/tipo-alerta`;

  constructor(private http: HttpClient) {}

  getTiposAlerta(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
}
