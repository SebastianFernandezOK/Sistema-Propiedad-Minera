export interface TipoAlerta {
  IdTipoAlerta: number;
  Descripcion: string;
  IdArea?: number;
  Asunto?: string;
  Mensaje?: string;
  Obs?: string;
  AudFecha?: string;
  AudUsuario?: number;
}

export interface TipoAlertaCreate {
  Descripcion: string;
  IdArea?: number;
  Asunto?: string;
  Mensaje?: string;
  Obs?: string;
}

export interface Area {
  IdArea: number;
  Descripcion: string;
  AudFecha?: string;
  AudUsuario?: number;
}