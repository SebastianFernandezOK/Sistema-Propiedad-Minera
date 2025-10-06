from sqlalchemy.orm import Session
from backend.repositories.propiedad_minera_repositorie import PropiedadMineraRepositorie

from backend.schemas.propiedad_minera_schema import PropiedadMineraCreate
from backend.repositories.titular_minero_repositorie import TitularMineroRepository
from backend.services.transaccion_service import TransaccionService
from backend.schemas.transaccion_schema import TransaccionCreate
from datetime import datetime

class PropiedadMineraService:
    def get_filtered_paginated(self, filters=None, offset=0, limit=10):
        items, total = self.repository.get_filtered_paginated(filters, offset, limit)
        for propiedad in items:
            propiedad.TitularNombre = propiedad.get_titular_nombre(self.repository.db)
        return items, total
    def __init__(self, db: Session):
        self.repository = PropiedadMineraRepositorie(db)

    def get_all(self):
        propiedades = self.repository.get_all()
        # Agregar nombre del titular a cada propiedad
        for propiedad in propiedades:
            propiedad.TitularNombre = propiedad.get_titular_nombre(self.repository.db)
        return propiedades

    def get_by_id(self, id_propiedad: int):
        propiedad = self.repository.get_by_id(id_propiedad)
        if propiedad:
            propiedad.TitularNombre = propiedad.get_titular_nombre(self.repository.db)
        return propiedad


    def create(self, propiedad_data: PropiedadMineraCreate):
        # Validación de referente único por titular minero
        if propiedad_data.Referente:
            existente = self.repository.db.query(self.repository.__class__.model_class)
            existente = existente.filter(
                self.repository.__class__.model_class.IdTitular == propiedad_data.IdTitular,
                self.repository.__class__.model_class.Referente == 1
            ).first()
            if existente:
                raise ValueError("Ya existe una propiedad minera referente para este titular minero.")

        # 1. Crear la propiedad minera
        propiedad = self.repository.create(propiedad_data)

        # 2. Obtener el IdTransaccion del titular minero padre
        titular_repo = TitularMineroRepository(self.repository.db)
        titular = titular_repo.get_by_id(propiedad.IdTitular)
        id_transaccion_padre = getattr(titular, 'IdTransaccion', None) if titular else None

        if id_transaccion_padre is None:
            raise ValueError("El titular minero no tiene una transacción asociada. No se puede crear la transacción hija para la propiedad minera.")

        # 3. Crear la transacción de la propiedad minera
        transaccion_service = TransaccionService(self.repository.db)
        transaccion_data = TransaccionCreate(
            IdTransaccionPadre=id_transaccion_padre,
            Descripcion="Creación de propiedad minera",
            IdRegistro=propiedad.IdPropiedadMinera,
            Tabla="PropiedadMinera",
            AudFecha=datetime.utcnow()
        )
        transaccion = transaccion_service.create_transaccion(transaccion_data)

        # 4. Actualizar la propiedad minera con el IdTransaccion generado
        self.repository.update(propiedad.IdPropiedadMinera, {"IdTransaccion": transaccion.IdTransaccion})

        return propiedad

    def update(self, id_propiedad: int, propiedad_data: dict):
        # Validación de referente único por titular minero al editar
        if propiedad_data.get("Referente"):
            # Obtener la propiedad actual para excluirla de la búsqueda
            actual = self.repository.get_by_id(id_propiedad)
            existente = self.repository.db.query(self.repository.__class__.model_class)
            existente = existente.filter(
                self.repository.__class__.model_class.IdTitular == actual.IdTitular,
                self.repository.__class__.model_class.Referente == 1,
                self.repository.__class__.model_class.IdPropiedadMinera != id_propiedad
            ).first()
            if existente:
                raise ValueError("Ya existe una propiedad minera referente para este titular minero.")
        return self.repository.update(id_propiedad, propiedad_data)

    def delete(self, id_propiedad: int):
        return self.repository.delete(id_propiedad)