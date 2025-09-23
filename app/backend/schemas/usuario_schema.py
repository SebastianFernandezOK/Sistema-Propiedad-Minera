from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, date

class UsuarioBase(BaseModel):
    NombreCompleto: str
    NombreUsuario: str
    Email: str
    Rol: str
    Activo: Optional[bool] = False
    FechaCreacion: date
    UltimaConexion: Optional[datetime] = None
    Telefono: Optional[str] = None
    Observacion: Optional[str] = None
    Descripcion: Optional[str] = None

class UsuarioCreate(BaseModel):
    NombreCompleto: str
    NombreUsuario: str
    Email: str
    Password: str
    Rol: str
    Activo: Optional[bool] = False
    FechaCreacion: date
    UltimaConexion: Optional[datetime] = None
    Telefono: Optional[str] = None
    Observacion: Optional[str] = None
    Descripcion: Optional[str] = None

class UsuarioUpdate(BaseModel):
    NombreCompleto: Optional[str] = None
    NombreUsuario: Optional[str] = None
    Email: Optional[str] = None
    Password: Optional[str] = None
    Rol: Optional[str] = None
    Activo: Optional[bool] = None
    FechaCreacion: Optional[date] = None
    UltimaConexion: Optional[datetime] = None
    Telefono: Optional[str] = None
    Observacion: Optional[str] = None
    Descripcion: Optional[str] = None

class UsuarioOut(UsuarioBase):
    IdUsuario: int
    
    class Config:
        orm_mode = True

class UsuarioLogin(BaseModel):
    NombreUsuario: str
    Password: str