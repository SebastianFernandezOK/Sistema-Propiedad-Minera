from backend.models.expediente_model import Expediente
from sqlalchemy.orm import Session
from backend.models.propiedad_minera_model import PropiedadMinera
from backend.schemas.propiedad_minera_schema import PropiedadMineraCreate

class PropiedadMineraRepositorie:
    model_class = PropiedadMinera
    def get_filtered_paginated(self, filters=None, offset=0, limit=10):
        query = self.db.query(PropiedadMinera)
        if filters:
            if filters.get("nombre"):
                query = query.filter(PropiedadMinera.Nombre.ilike(f"%{filters['nombre']}%"))
            if filters.get("provincia"):
                query = query.filter(PropiedadMinera.Provincia == filters["provincia"])
            if filters.get("id_titular"):
                query = query.filter(PropiedadMinera.IdTitular == filters["id_titular"])
            if filters.get("expediente"):
                expediente_val = filters["expediente"]
                # Join con Expediente y filtrar por CodigoExpediente o IdExpediente
                query = query.join(Expediente, PropiedadMinera.IdPropiedadMinera == Expediente.IdPropiedadMinera)
                from sqlalchemy import or_, cast, String as SAString
                query = query.filter(
                    or_(
                        Expediente.CodigoExpediente.ilike(f"%{expediente_val}%"),
                        cast(Expediente.IdExpediente, SAString) == str(expediente_val)
                    )
                )
        total = query.distinct().count()
        items = query.order_by(PropiedadMinera.Referente.desc()).offset(offset).limit(limit).all()
        return items, total
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        # Ordenar por Referente descendente (True primero, luego False, luego NULL)
        return self.db.query(PropiedadMinera).order_by(PropiedadMinera.Referente.desc()).all()

    def get_by_id(self, id_propiedad: int):
        return self.db.query(PropiedadMinera).filter(PropiedadMinera.IdPropiedadMinera == id_propiedad).first()

    def create(self, propiedad_data: PropiedadMineraCreate):
        propiedad = PropiedadMinera(**propiedad_data.model_dump())
        self.db.add(propiedad)
        self.db.commit()
        self.db.refresh(propiedad)
        return propiedad

    def update(self, id_propiedad: int, propiedad_data: dict):
        propiedad = self.get_by_id(id_propiedad)
        if not propiedad:
            return None
        for key, value in propiedad_data.items():
            setattr(propiedad, key, value)
        self.db.commit()
        self.db.refresh(propiedad)
        return propiedad

    def delete(self, id_propiedad: int):
        propiedad = self.get_by_id(id_propiedad)
        if not propiedad:
            return None
        self.db.delete(propiedad)
        self.db.commit()
        return True