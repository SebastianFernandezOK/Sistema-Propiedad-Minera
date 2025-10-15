from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NotificacionBase(BaseModel):
    Emision: Optional[datetime] = None
    Plazo: Optional[int] = None
    CodExp: Optional[str] = None
    Titular: Optional[int] = None
    Funcionario: str
    IdTransaccion: Optional[int] = None

class NotificacionCreate(NotificacionBase):
    pass

class NotificacionUpdate(NotificacionBase):
    pass

class NotificacionOut(BaseModel):
    IdNotificacion: int
    Emision: Optional[datetime] = None
    Plazo: Optional[int] = None
    CodExp: Optional[str] = None
    TitularId: Optional[int] = None  # ID del titular
    Titular: Optional[str] = None    # Nombre del titular
    Funcionario: str
    IdTransaccion: Optional[int] = None

    class Config:
        orm_mode = True