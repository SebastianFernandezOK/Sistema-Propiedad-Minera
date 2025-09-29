export interface AlertaCreate {
  IdTransaccion?: number;
  IdTipoAlerta?: number;
  IdEstado?: number;
  Asunto?: string;
  Mensaje?: string;
  Medio?: string;
  IdPeriodicidad: number;  // Cambiado: ahora es obligatorio y es un ID numérico
  DiasPers?: number;       // Nuevo campo para días personalizados
  FechaInicio?: string;
  FechaFin?: string;
  Destinatarios?: string;  // Nuevo campo agregado
  Obs?: string;
  AudFecha?: string;
  AudUsuario?: number;
}

export interface Alerta extends AlertaCreate {
  idAlerta: number;
  DiasPers?: number;  // Asegurar que también esté en la interfaz Alerta
}

export interface AlertaUpdate {
  IdTransaccion?: number;
  IdTipoAlerta?: number;
  IdEstado?: number;
  Asunto?: string;
  Mensaje?: string;
  Medio?: string;
  IdPeriodicidad?: number;
  DiasPers?: number;       // Nuevo campo para días personalizados
  FechaInicio?: string;
  FechaFin?: string;
  Destinatarios?: string;
  Obs?: string;
  AudFecha?: string;
  AudUsuario?: number;
}
