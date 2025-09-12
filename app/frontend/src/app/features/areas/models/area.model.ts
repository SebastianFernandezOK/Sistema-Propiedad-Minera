export interface Area {
  IdArea: number;
  Descripcion: string;
  AudFecha?: string;
  AudUsuario?: number;
}

export interface AreaCreate {
  Descripcion: string;
}