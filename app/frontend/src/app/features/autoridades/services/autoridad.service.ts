import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/api.constants';

export interface Autoridad {
  IdAutoridad: string;
  Nombre: string;
}

@Injectable({ providedIn: 'root' })
export class AutoridadService {
  private apiUrl = `${API_BASE_URL}/autoridades`;

  constructor(private http: HttpClient) {}

  searchByNombre(nombre: string): Observable<Autoridad[]> {
    return this.http.get<Autoridad[]>(`${this.apiUrl}/search`, { params: { nombre } });
  }

  getAll(): Observable<Autoridad[]> {
    return this.http.get<Autoridad[]>(this.apiUrl);
  }
}
