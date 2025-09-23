import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario, UsuarioCreate, UsuarioUpdate, UsuarioLogin, CambiarPasswordRequest, ActivarUsuarioRequest } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:9000/usuarios';

  constructor(private http: HttpClient) {}

  getAll(page: number = 0, size: number = 10): Observable<{ data: Usuario[], total: number }> {
    const start = page * size;
    const end = start + size - 1;
    let params = new HttpParams().set('range', `[${start},${end}]`);
    return this.http.get<Usuario[]>(this.apiUrl, { params, observe: 'response' }).pipe(
      map((response: HttpResponse<Usuario[]>) => {
        const contentRange = response.headers.get('Content-Range') || '';
        const total = this.extractTotalFromRange(contentRange);
        return { data: response.body || [], total };
      })
    );
  }

  getAllSimple(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  getByUsername(username: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/username/${username}`);
  }

  create(usuario: UsuarioCreate): Observable<Usuario> {
    const body = {
      NombreCompleto: usuario.NombreCompleto,
      NombreUsuario: usuario.NombreUsuario,
      Email: usuario.Email,
      Password: usuario.Password,
      Rol: usuario.Rol,
      Activo: usuario.Activo,
      FechaCreacion: usuario.FechaCreacion,
      UltimaConexion: usuario.UltimaConexion,
      Telefono: usuario.Telefono,
      Observacion: usuario.Observacion,
      Descripcion: usuario.Descripcion
    };
    return this.http.post<Usuario>(`${this.apiUrl}`, body);
  }

  update(id: number, usuario: UsuarioUpdate): Observable<Usuario> {
    const body = {
      NombreCompleto: usuario.NombreCompleto,
      NombreUsuario: usuario.NombreUsuario,
      Email: usuario.Email,
      Password: usuario.Password,
      Rol: usuario.Rol,
      Activo: usuario.Activo,
      FechaCreacion: usuario.FechaCreacion,
      UltimaConexion: usuario.UltimaConexion,
      Telefono: usuario.Telefono,
      Observacion: usuario.Observacion,
      Descripcion: usuario.Descripcion
    };
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  login(usuarioLogin: UsuarioLogin): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, usuarioLogin);
  }

  cambiarPassword(id: number, request: CambiarPasswordRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}/cambiar-password`, request);
  }

  activarDesactivar(id: number, request: ActivarUsuarioRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}/activar`, request);
  }

  private extractTotalFromRange(contentRange: string): number {
    const match = contentRange.match(/\/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  }
}