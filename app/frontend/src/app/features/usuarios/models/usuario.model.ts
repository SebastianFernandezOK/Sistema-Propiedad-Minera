export interface Usuario {
  IdUsuario: number;
  NombreCompleto: string;
  NombreUsuario: string;
  Email: string;
  Rol: string;
  Activo: boolean;
  FechaCreacion: string;
  UltimaConexion?: string;
  Telefono?: string;
  Observacion?: string;
  Descripcion?: string;
}

export interface UsuarioCreate {
  NombreCompleto: string;
  NombreUsuario: string;
  Email: string;
  Password: string;
  Rol: string;
  Activo: boolean;
  FechaCreacion?: string;  // Opcional porque se genera automáticamente
  UltimaConexion?: string;
  Telefono?: string;
  Observacion?: string;
  Descripcion?: string;
}

export interface UsuarioUpdate {
  NombreCompleto?: string;
  NombreUsuario?: string;
  Email?: string;
  Password?: string;
  Rol?: string;
  Activo?: boolean;
  FechaCreacion?: string;
  UltimaConexion?: string;
  Telefono?: string;
  Observacion?: string;
  Descripcion?: string;
}

export interface UsuarioLogin {
  NombreUsuario: string;
  Password: string;
}

export interface CambiarPasswordRequest {
  password_actual: string;
  password_nueva: string;
}

export interface ActivarUsuarioRequest {
  activo: boolean;
}