from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AreaBase(BaseModel):
    Descripcion: str
    AudFecha: Optional[datetime] = None
    AudUsuario: Optional[int] = None

class AreaCreate(AreaBase):
    pass

class AreaUpdate(BaseModel):
    Descripcion: Optional[str] = None
    AudFecha: Optional[datetime] = None
    AudUsuario: Optional[int] = None

class AreaOut(AreaBase):
    IdArea: int
    class Config:
        orm_mode = True