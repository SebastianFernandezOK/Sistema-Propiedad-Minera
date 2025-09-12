export interface TipoNotificacion {
  IdTipoNotificacion: number;
  Descripcion: string;
  DescCorta?: string;
  AudUsuario?: number;
  AudFecha?: string;
}

export interface TipoNotificacionCreate {
  Descripcion: string;
  DescCorta?: string;
}