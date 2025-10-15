from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime
from backend.repositories.notificacion_repositorie import NotificacionRepositorie
from backend.models.expediente_model import Expediente
from backend.models.transaccion_model import Transaccion
from backend.schemas.notificacion_schema import NotificacionCreate, NotificacionUpdate

class NotificacionService:
    def __init__(self, db: Session):
        self.repo = NotificacionRepositorie(db)
        self.db = db

    def get_notificacion(self, id_notificacion: int):
        return self.repo.get(id_notificacion)

    def get_notificaciones(self, skip: int = 0, limit: int = 100):
        return self.repo.get_all(skip, limit)
    
    def get_notificaciones_paginated(self, skip: int = 0, limit: int = 10, funcionario: str = None, expediente: str = None):
        return self.repo.get_paginated(skip, limit, funcionario, expediente)

    def create_notificacion(self, notificacion: NotificacionCreate):
        print(f"[DEBUG] Creando notificación con datos: {notificacion}")
        
        try:
            # PASO 1: Crear la notificación PRIMERO
            nueva_notificacion = self.repo.create(notificacion)
            print(f"[DEBUG] Notificación creada con ID: {nueva_notificacion.IdNotificacion}")
            
            # PASO 2: Si hay código de expediente, crear la transacción con el ID correcto
            id_transaccion_creada = None
            if notificacion.CodExp and nueva_notificacion.IdNotificacion:
                print(f"[DEBUG] Código de expediente encontrado: {notificacion.CodExp}")
                # Crear la transacción CON el IdRegistro correcto desde el inicio
                id_transaccion_creada = self._crear_transaccion_para_notificacion(notificacion.CodExp, nueva_notificacion.IdNotificacion)
                print(f"[DEBUG] Transacción creada con ID: {id_transaccion_creada}")
                
                # PASO 3: Actualizar la notificación con el IdTransaccion
                if id_transaccion_creada:
                    print(f"[DEBUG] Actualizando notificación {nueva_notificacion.IdNotificacion} con IdTransaccion: {id_transaccion_creada}")
                    
                    # Actualizar directamente en la base de datos
                    query = text("UPDATE Notificacion SET IdTransaccion = :id_transaccion WHERE IdNotificacion = :id_notificacion")
                    result = self.db.execute(query, {
                        "id_transaccion": id_transaccion_creada, 
                        "id_notificacion": nueva_notificacion.IdNotificacion
                    })
                    self.db.commit()
                    print(f"[DEBUG] Filas afectadas: {result.rowcount}")
                    
                    # Refrescar el objeto desde la base de datos
                    self.db.refresh(nueva_notificacion)
                    print(f"[DEBUG] Notificación actualizada - IdTransaccion: {nueva_notificacion.IdTransaccion}")
            
            print(f"[SUCCESS] Notificación completada - ID: {nueva_notificacion.IdNotificacion}, IdTransaccion: {nueva_notificacion.IdTransaccion}")
            return nueva_notificacion
            
        except Exception as e:
            print(f"[ERROR] Error general en create_notificacion: {e}")
            import traceback
            print(f"[ERROR] Traceback: {traceback.format_exc()}")
            raise
    
    def _crear_transaccion_para_notificacion(self, codigo_expediente: str, id_notificacion: int) -> int:
        """Crea un registro en Transaccion para una notificación con el IdRegistro correcto desde el inicio.
        Retorna el ID de la transacción creada o None si no se pudo crear."""
        print(f"[DEBUG] Iniciando creación de transacción para expediente: {codigo_expediente}, notificación: {id_notificacion}")
        try:
            # Buscar el expediente por código
            expediente = self.db.query(Expediente).filter(
                Expediente.CodigoExpediente == codigo_expediente
            ).first()
            
            print(f"[DEBUG] Expediente encontrado: {expediente}")
            if expediente:
                print(f"[DEBUG] IdTransaccion del expediente: {expediente.IdTransaccion}")
            
            if expediente and expediente.IdTransaccion:
                print(f"[DEBUG] Creando nueva transacción con padre: {expediente.IdTransaccion}, IdRegistro: {id_notificacion}")
                # Crear nueva transacción con el IdRegistro correcto desde el inicio
                nueva_transaccion = Transaccion(
                    IdTransaccionPadre=expediente.IdTransaccion,
                    Descripcion=f"Notificación #{id_notificacion} para expediente {codigo_expediente}",
                    IdRegistro=id_notificacion,  # ID real de la notificación
                    Tabla="Notificacion",
                    AudFecha=datetime.now(),
                    AudUsuario="SYSTEM"  # O el usuario actual si está disponible
                )
                
                print(f"[DEBUG] Objeto transacción creado: {nueva_transaccion.__dict__}")
                self.db.add(nueva_transaccion)
                self.db.commit()
                self.db.refresh(nueva_transaccion)
                
                print(f"[DEBUG] Transacción guardada exitosamente: ID={nueva_transaccion.IdTransaccion}, IdRegistro={id_notificacion}")
                return nueva_transaccion.IdTransaccion
            else:
                print(f"[WARNING] Expediente {codigo_expediente} no encontrado o sin IdTransaccion")
                if expediente:
                    print(f"[WARNING] Expediente existe pero IdTransaccion es: {expediente.IdTransaccion}")
                return None
                
        except Exception as e:
            print(f"[ERROR] Error al crear transacción: {e}")
            import traceback
            print(f"[ERROR] Traceback: {traceback.format_exc()}")
            self.db.rollback()
            return None
    
    def _actualizar_notificacion_con_transaccion(self, id_notificacion: int, id_transaccion: int):
        """Actualiza la notificación con el IdTransaccion"""
        try:
            print(f"[DEBUG] Actualizando notificación {id_notificacion} con IdTransaccion: {id_transaccion}")
            
            # Actualizar directamente en la base de datos
            query = text("UPDATE Notificacion SET IdTransaccion = :id_transaccion WHERE IdNotificacion = :id_notificacion")
            result = self.db.execute(query, {
                "id_transaccion": id_transaccion, 
                "id_notificacion": id_notificacion
            })
            self.db.commit()
            print(f"[DEBUG] Notificación actualizada - filas afectadas: {result.rowcount}")
                
        except Exception as e:
            print(f"[ERROR] Error al actualizar notificación: {e}")
            import traceback
            print(f"[ERROR] Traceback: {traceback.format_exc()}")
            self.db.rollback()

    def update_notificacion(self, id_notificacion: int, notificacion: NotificacionUpdate):
        return self.repo.update(id_notificacion, notificacion)

    def delete_notificacion(self, id_notificacion: int):
        return self.repo.delete(id_notificacion)