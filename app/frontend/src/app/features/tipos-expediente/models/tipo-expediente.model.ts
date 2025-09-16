export interface TipoExpediente {
  IdTipoExpediente: number;
  Nombre: string;
  Descripcion: string;
  Activo: boolean;
  AudFecha?: string;
  AudUsuario?: number;
}

export interface TipoExpedienteCreate {
  Nombre: string;
  Descripcion: string;
  Activo: boolean;
}

export interface TipoExpedienteUpdate {
  Nombre: string;
  Descripcion: string;
  Activo: boolean;
}