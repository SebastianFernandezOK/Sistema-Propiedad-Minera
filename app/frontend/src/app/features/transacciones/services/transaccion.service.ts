import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/api.constants';

export interface TransaccionInfo {
  IdTransaccion: number;
  IdTransaccionPadre: number;
  Tabla: string;
  Detalle: string;
  IdTransaccion1?: number;
  IdTransaccionPadre1?: number;
  Tabla1?: string;
  Detalle1?: string;
  IdTransaccion2?: number;
  IdTransaccionPadre2?: number;
  Tabla2?: string;
  Detalle2?: string;
}

export interface Transaccion {
  IdTransaccion: number;
  Tabla: string;
  // Agregar otros campos según tu modelo
}

@Injectable({ providedIn: 'root' })
export class TransaccionService {
  private readonly baseUrl = `${API_BASE_URL}/transacciones`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene información básica de una transacción por ID
   */
  getTransaccion(id: number): Observable<Transaccion> {
    return this.http.get<Transaccion>(`${this.baseUrl}/${id}`);
  }

  /**
   * Obtiene información completa de una transacción usando el procedure
   */
  getInformacionTransaccion(tabla: string, idTransaccion: number): Observable<TransaccionInfo[]> {
    return this.http.get<TransaccionInfo[]>(`${this.baseUrl}/informacion/${tabla}/${idTransaccion}`);
  }

  /**
   * Obtiene información completa de una transacción a partir de solo el ID de transacción
   * Primero obtiene la tabla de la transacción, luego su información completa
   */
  async getInformacionCompletaTransaccion(idTransaccion: number): Promise<TransaccionInfo[]> {
    try {
      // Primero obtenemos la transacción para saber el tipo de tabla
      const transaccion = await this.getTransaccion(idTransaccion).toPromise();
      
      if (!transaccion || !transaccion.Tabla) {
        throw new Error('No se pudo obtener la información de la transacción');
      }

      // Luego obtenemos la información completa usando el procedure
      const infoCompleta = await this.getInformacionTransaccion(transaccion.Tabla, idTransaccion).toPromise();
      
      return infoCompleta || [];
    } catch (error) {
      console.error('Error obteniendo información completa de transacción:', error);
      throw error;
    }
  }
}