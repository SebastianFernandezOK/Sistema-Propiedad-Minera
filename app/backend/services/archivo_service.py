from sqlalchemy.orm import Session
from backend.repositories.archivo_repositorie import ArchivoRepositorie
from backend.schemas.archivo_schema import ArchivoCreate, ArchivoUpdate
from typing import List, Optional

class ArchivoService:
    def __init__(self, db: Session):
        self.repo = ArchivoRepositorie(db)

    def get_archivo(self, id_archivo: int):
        return self.repo.get(id_archivo)

    def get_archivos(self, skip: int = 0, limit: int = 100):
        return self.repo.get_all(skip, limit)

    def get_archivos_by_transaccion(self, id_transaccion: int):
        return self.repo.get_by_transaccion(id_transaccion)

    def get_archivos_by_transaccion_and_tipo(self, id_transaccion: int, tipo: str):
        return self.repo.get_by_transaccion_and_tipo(id_transaccion, tipo)

    def get_archivos_by_transaccion_and_tipo_paginated(self, id_transaccion: int, tipo: str, skip: int = 0, limit: int = 10):
        return self.repo.get_by_transaccion_and_tipo_paginated(id_transaccion, tipo, skip, limit)

    def count_archivos_by_transaccion_and_tipo(self, id_transaccion: int, tipo: str):
        return self.repo.count_by_transaccion_and_tipo(id_transaccion, tipo)

    def get_archivos_by_expediente(self, id_transaccion: int, codigo_expediente: str):
        return self.repo.get_by_expediente(id_transaccion, codigo_expediente)

    def create_archivo(self, archivo: ArchivoCreate):
        # Truncar descripción si es necesario
        if hasattr(archivo, 'Descripcion') and archivo.Descripcion:
            archivo.Descripcion = archivo.Descripcion[:150]
        return self.repo.create(archivo)

    def update_archivo(self, id_archivo: int, archivo: ArchivoUpdate):
        # Truncar descripción si es necesario
        if hasattr(archivo, 'Descripcion') and archivo.Descripcion:
            archivo.Descripcion = archivo.Descripcion[:150]
        return self.repo.update(id_archivo, archivo)

    def delete_archivo(self, id_archivo: int):
        return self.repo.delete(id_archivo)
