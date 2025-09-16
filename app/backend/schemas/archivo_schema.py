from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ArchivoBase(BaseModel):
    IdTransaccion: Optional[int] = None
    Nombre: Optional[str] = None
    Descripcion: Optional[str] = Field(None, max_length=255)
    Tipo: Optional[str] = None
    Link: str
    AudFecha: Optional[datetime] = None
    AudUsuario: Optional[int] = None

class ArchivoCreate(ArchivoBase):
    pass

class ArchivoUpdate(BaseModel):
    IdTransaccion: Optional[int] = None
    Nombre: Optional[str] = None
    Descripcion: Optional[str] = Field(None, max_length=255)
    Tipo: Optional[str] = None
    Link: Optional[str] = None
    AudFecha: Optional[datetime] = None
    AudUsuario: Optional[int] = None

class ArchivoOut(ArchivoBase):
    IdArchivo: int

    class Config:
        from_attributes = True
    
    @classmethod
    def from_orm(cls, obj):
        # Limpiar espacios en blanco del nombre si existe
        if hasattr(obj, 'Nombre') and obj.Nombre:
            obj.Nombre = obj.Nombre.strip()
        return super().from_orm(obj)

class PaginationInfo(BaseModel):
    current_page: int
    total_pages: int
    total_items: int
    items_per_page: int
    has_next: bool
    has_previous: bool

class ArchivosPaginatedResponse(BaseModel):
    archivos: List[ArchivoOut]
    pagination: PaginationInfo