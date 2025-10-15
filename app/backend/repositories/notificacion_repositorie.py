from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.models.notificacion_model import Notificacion
from backend.models.titular_minero_model import TitularMinero
from backend.schemas.notificacion_schema import NotificacionCreate, NotificacionUpdate
from typing import List, Optional

class NotificacionRepositorie:
    def __init__(self, db: Session):
        self.db = db

    def get(self, id_notificacion: int) -> Optional[dict]:
        """Obtiene una notificación por ID con el nombre del titular incluido"""
        result = self.db.query(
            Notificacion.IdNotificacion,
            Notificacion.Emision,
            Notificacion.Plazo,
            Notificacion.CodExp,
            Notificacion.Titular.label('TitularId'),
            TitularMinero.Nombre.label('TitularNombre'),
            Notificacion.Funcionario,
            Notificacion.IdTransaccion
        ).outerjoin(
            TitularMinero, 
            Notificacion.Titular == TitularMinero.IdTitular
        ).filter(Notificacion.IdNotificacion == id_notificacion).first()
        
        if result:
            return {
                'IdNotificacion': result.IdNotificacion,
                'Emision': result.Emision,
                'Plazo': result.Plazo,
                'CodExp': result.CodExp,
                'TitularId': result.TitularId,
                'Titular': result.TitularNombre or 'No especificado',
                'Funcionario': result.Funcionario,
                'IdTransaccion': result.IdTransaccion
            }
        return None

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Notificacion]:
        return self.db.query(Notificacion).order_by(Notificacion.IdNotificacion).offset(skip).limit(limit).all()
    
    def get_paginated(self, skip: int = 0, limit: int = 10, funcionario: str = None, expediente: str = None):
        # Consulta base con JOIN para obtener el nombre del titular
        query = self.db.query(
            Notificacion.IdNotificacion,
            Notificacion.Emision,
            Notificacion.Plazo,
            Notificacion.CodExp,
            Notificacion.Titular.label('TitularId'),
            TitularMinero.Nombre.label('TitularNombre'),
            Notificacion.Funcionario
        ).outerjoin(
            TitularMinero, 
            Notificacion.Titular == TitularMinero.IdTitular
        )
        
        # Aplicar filtro de funcionario si se proporciona
        if funcionario and funcionario.strip():
            query = query.filter(Notificacion.Funcionario.ilike(f"%{funcionario}%"))
        
        # Aplicar filtro de expediente si se proporciona
        if expediente and expediente.strip():
            query = query.filter(Notificacion.CodExp.ilike(f"%{expediente}%"))
        
        # Contar total de registros (antes de aplicar offset/limit)
        total = query.count()
        
        # Aplicar paginación y ordenamiento
        raw_items = query.order_by(Notificacion.IdNotificacion.desc()).offset(skip).limit(limit).all()
        
        # Convertir los resultados a diccionarios
        items = []
        for item in raw_items:
            items.append({
                "IdNotificacion": item.IdNotificacion,
                "Emision": item.Emision,
                "Plazo": item.Plazo,
                "CodExp": item.CodExp,
                "Titular": item.TitularNombre or f"ID: {item.TitularId}" if item.TitularId else "-",
                "Funcionario": item.Funcionario
            })
        
        return {
            "data": items,
            "total": total,
            "page": skip // limit,
            "size": limit,
            "pages": (total + limit - 1) // limit  # Cálculo de páginas totales
        }

    def create(self, notificacion: NotificacionCreate) -> Notificacion:
        notificacion_dict = notificacion.dict()
        print(f"[REPO DEBUG] Datos para crear notificación: {notificacion_dict}")
        
        db_obj = Notificacion(**notificacion_dict)
        print(f"[REPO DEBUG] Objeto DB creado - IdTransaccion: {getattr(db_obj, 'IdTransaccion', 'NO_EXISTE')}")
        
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        
        print(f"[REPO DEBUG] Después de commit/refresh - IdTransaccion: {getattr(db_obj, 'IdTransaccion', 'NO_EXISTE')}")
        return db_obj

    def update(self, id_notificacion: int, notificacion: NotificacionUpdate) -> Optional[Notificacion]:
        db_obj = self.get(id_notificacion)
        if not db_obj:
            return None
        for field, value in notificacion.dict(exclude_unset=True).items():
            setattr(db_obj, field, value)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def delete(self, id_notificacion: int) -> bool:
        db_obj = self.get(id_notificacion)
        if not db_obj:
            return False
        self.db.delete(db_obj)
        self.db.commit()
        return True