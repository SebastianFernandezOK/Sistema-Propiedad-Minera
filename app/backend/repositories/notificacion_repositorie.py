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

    def create(self, notificacion: NotificacionCreate) -> dict:
        notificacion_dict = notificacion.dict()
        print(f"[REPO DEBUG] Datos para crear notificación: {notificacion_dict}")
        
        db_obj = Notificacion(**notificacion_dict)
        print(f"[REPO DEBUG] Objeto DB creado - IdTransaccion: {getattr(db_obj, 'IdTransaccion', 'NO_EXISTE')}")
        
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        
        print(f"[REPO DEBUG] Después de commit/refresh - IdTransaccion: {getattr(db_obj, 'IdTransaccion', 'NO_EXISTE')}")
        
        # Obtener el nombre del titular si existe
        titular_nombre = None
        if db_obj.Titular:
            titular = self.db.query(TitularMinero).filter(TitularMinero.IdTitular == db_obj.Titular).first()
            titular_nombre = titular.Nombre if titular else None
        
        # Retornar el mismo formato que el método get
        return {
            'IdNotificacion': db_obj.IdNotificacion,
            'Emision': db_obj.Emision,
            'Plazo': db_obj.Plazo,
            'CodExp': db_obj.CodExp,
            'TitularId': db_obj.Titular,
            'Titular': titular_nombre or 'No especificado' if db_obj.Titular else None,
            'Funcionario': db_obj.Funcionario,
            'IdTransaccion': db_obj.IdTransaccion
        }

    def update(self, id_notificacion: int, notificacion: NotificacionUpdate) -> Optional[dict]:
        # Primero obtener el objeto para actualizar
        db_obj = self.db.query(Notificacion).filter(Notificacion.IdNotificacion == id_notificacion).first()
        if not db_obj:
            return None
        
        # Actualizar los campos
        for field, value in notificacion.dict(exclude_unset=True).items():
            setattr(db_obj, field, value)
        self.db.commit()
        self.db.refresh(db_obj)
        
        # Retornar el mismo formato que get()
        return self.get(id_notificacion)

    def delete(self, id_notificacion: int) -> bool:
        db_obj = self.db.query(Notificacion).filter(Notificacion.IdNotificacion == id_notificacion).first()
        if not db_obj:
            return False
        self.db.delete(db_obj)
        self.db.commit()
        return True