from pydantic import BaseModel
from typing import Optional
from datetime import datetime,date

class TipoNotificacionBase(BaseModel):
    IdTipoNotificacion: int
    Descripcion: str
    DescCorta: Optional[str] = None
    AudUsuario: Optional[int] = None
    AudFecha: Optional[datetime] = None

class TipoNotificacionCreate(TipoNotificacionBase):
    pass

class TipoNotificacionUpdate(BaseModel):
    Descripcion: Optional[str] = None
    DescCorta: Optional[str] = None
    AudUsuario: Optional[int] = None
    AudFecha: Optional[datetime] = None

class TipoNotificacionOut(TipoNotificacionBase):
    IdTipoNotificacion: int
    class Config:
        orm_mode = True