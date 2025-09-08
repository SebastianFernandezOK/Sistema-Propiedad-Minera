from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from backend.models.tipo_notificacion_model import TipoNotificacion
from backend.schemas.tipo_notificacion_schema import TipoNotificacionCreate, TipoNotificacionUpdate
from typing import List, Optional
from datetime import datetime

class TipoNotificacionRepositorie:
    def __init__(self, db: Session):
        self.db = db

    def get(self, id_tipo_notificacion: int) -> Optional[TipoNotificacion]:
        """Obtiene un tipo de notificación por su ID"""
        try:
            return self.db.query(TipoNotificacion).filter(
                TipoNotificacion.IdTipoNotificacion == id_tipo_notificacion
            ).first()
        except SQLAlchemyError:
            return None

    def get_all(self, skip: int = 0, limit: int = 100) -> List[TipoNotificacion]:
        """Obtiene todos los tipos de notificación con paginación"""
        try:
            return self.db.query(TipoNotificacion).order_by(
                TipoNotificacion.IdTipoNotificacion
            ).offset(skip).limit(limit).all()
        except SQLAlchemyError:
            return []

    def get_by_descripcion(self, descripcion: str) -> Optional[TipoNotificacion]:
        """Busca un tipo de notificación por su descripción"""
        try:
            return self.db.query(TipoNotificacion).filter(
                TipoNotificacion.Descripcion.ilike(f"%{descripcion}%")
            ).first()
        except SQLAlchemyError:
            return None

    def create(self, tipo_notificacion: TipoNotificacionCreate) -> Optional[TipoNotificacion]:
        """Crea un nuevo tipo de notificación"""
        try:
            # Verificar si ya existe un tipo con el mismo ID
            existing = self.get(tipo_notificacion.IdTipoNotificacion)
            if existing:
                return None
            
            # Crear el objeto con todos los campos del modelo
            db_obj = TipoNotificacion(
                IdTipoNotificacion=tipo_notificacion.IdTipoNotificacion,
                Descripcion=tipo_notificacion.Descripcion,
                DescCorta=tipo_notificacion.DescCorta,
                AudFecha=tipo_notificacion.AudFecha or datetime.now(),
                AudUsuario=tipo_notificacion.AudUsuario
            )
            
            self.db.add(db_obj)
            self.db.commit()
            self.db.refresh(db_obj)
            return db_obj
        except SQLAlchemyError:
            self.db.rollback()
            return None

    def update(self, id_tipo_notificacion: int, tipo_notificacion: TipoNotificacionUpdate) -> Optional[TipoNotificacion]:
        """Actualiza un tipo de notificación existente"""
        try:
            db_obj = self.get(id_tipo_notificacion)
            if not db_obj:
                return None
            
            # Actualizar solo los campos que tienen valores
            update_data = tipo_notificacion.model_dump(exclude_unset=True)
            
            for field, value in update_data.items():
                if hasattr(db_obj, field):
                    setattr(db_obj, field, value)
            
            # Actualizar AudFecha automáticamente en updates
            if update_data:
                db_obj.AudFecha = datetime.now()
            
            self.db.commit()
            self.db.refresh(db_obj)
            return db_obj
        except SQLAlchemyError:
            self.db.rollback()
            return None

    def delete(self, id_tipo_notificacion: int) -> bool:
        """Elimina un tipo de notificación"""
        try:
            db_obj = self.get(id_tipo_notificacion)
            if not db_obj:
                return False
            
            self.db.delete(db_obj)
            self.db.commit()
            return True
        except SQLAlchemyError:
            self.db.rollback()
            return False

    def exists(self, id_tipo_notificacion: int) -> bool:
        """Verifica si existe un tipo de notificación con el ID dado"""
        try:
            return self.db.query(TipoNotificacion).filter(
                TipoNotificacion.IdTipoNotificacion == id_tipo_notificacion
            ).count() > 0
        except SQLAlchemyError:
            return False

    def count(self) -> int:
        """Cuenta el total de tipos de notificación"""
        try:
            return self.db.query(TipoNotificacion).count()
        except SQLAlchemyError:
            return 0