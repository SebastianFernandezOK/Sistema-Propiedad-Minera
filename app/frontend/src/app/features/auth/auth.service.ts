import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { API_BASE_URL } from '../../core/api.constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${API_BASE_URL}/usuarios/login`;
  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { usuario: username, Password: password }).pipe(
      tap(res => {
        if (res && res.access_token) {
          localStorage.setItem(this.tokenKey, res.access_token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    // Aquí puedes agregar lógica para verificar expiración si lo deseas
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Opcional: decodificar el JWT para obtener datos del usuario
  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  getUserRole(): string | null {
    const decoded = this.decodeToken();
    return decoded?.rol || null;
  }
}
