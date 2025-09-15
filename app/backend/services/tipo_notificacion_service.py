from sqlalchemy.orm import Session
from backend.repositories.tipo_notifacion_repositorie import TipoNotificacionRepositorie
from backend.schemas.tipo_notificacion_schema import TipoNotificacionCreate, TipoNotificacionUpdate

class TipoNotificacionService:
    def __init__(self, db: Session):
        self.repo = TipoNotificacionRepositorie(db)

    def get_tipo_notificacion(self, id_tipo_notificacion: int):
        return self.repo.get(id_tipo_notificacion)

    def get_tipos_notificacion(self, skip: int = 0, limit: int = 100):
        print(f"Service get_tipos_notificacion called with skip={skip}, limit={limit}")
        result = self.repo.get_all(skip, limit)
        print(f"Service returning {len(result)} records")
        return result

    def create_tipo_notificacion(self, tipo_notificacion: TipoNotificacionCreate):
        return self.repo.create(tipo_notificacion)

    def update_tipo_notificacion(self, id_tipo_notificacion: int, tipo_notificacion: TipoNotificacionUpdate):
        return self.repo.update(id_tipo_notificacion, tipo_notificacion)

    def delete_tipo_notificacion(self, id_tipo_notificacion: int):
        return self.repo.delete(id_tipo_notificacion)