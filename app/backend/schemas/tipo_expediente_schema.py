from pydantic import BaseModel
from typing import Optional

class TipoExpedienteBase(BaseModel):
    Nombre: str
    Descripcion: Optional[str]
    Activo: Optional[bool]

class TipoExpedienteCreate(TipoExpedienteBase):
    pass

class TipoExpedienteRead(BaseModel):
    IdTipoExpediente: int
    Nombre: str
    Descripcion: Optional[str]
    Activo: Optional[bool]
    
    class Config:
        orm_mode = True
    
class TipoExpedienteOut(TipoExpedienteBase):    
    class Config:
        orm_mode = True