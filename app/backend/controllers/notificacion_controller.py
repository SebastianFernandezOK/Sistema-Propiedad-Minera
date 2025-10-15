from fastapi import APIRouter, Depends, HTTPException, Response, Query
from sqlalchemy.orm import Session
from backend.services.notificacion_service import NotificacionService
from backend.schemas.notificacion_schema import NotificacionCreate, NotificacionUpdate, NotificacionOut
from backend.database.connection import get_db
from typing import List
from backend.schemas.alerta_schema import AlertaCreate, AlertaOut
from backend.models.alerta_model import Alerta
from backend.schemas.observaciones_schema import ObservacionesCreate, ObservacionesOut




router = APIRouter(
    prefix="/notificaciones",
    tags=["notificaciones"]
)






@router.get("/")
def list_notificaciones(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    service = NotificacionService(db)
    return service.get_notificaciones(skip, limit)

@router.get("/paginated")
def list_notificaciones_paginated(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    funcionario: str = Query(None, description="Filtrar por funcionario"),
    expediente: str = Query(None, description="Filtrar por código de expediente")
):
    service = NotificacionService(db)
    return service.get_notificaciones_paginated(skip, limit, funcionario, expediente)

@router.get("/{id}")
def get_notificacion(id: int, db: Session = Depends(get_db)):
    service = NotificacionService(db)
    obj = service.get_notificacion(id)
    if not obj:
        raise HTTPException(status_code=404, detail="Notificacion not found")
    return obj

@router.post("/", response_model=NotificacionOut)
def create_notificacion(notificacion: NotificacionCreate, db: Session = Depends(get_db)):
    print(f"[DEBUG] Datos recibidos para crear notificación: {notificacion}")
    service = NotificacionService(db)
    result = service.create_notificacion(notificacion)
    print(f"[DEBUG] Notificación creada: {result}")
    return result

@router.put("/{id}", response_model=NotificacionOut)
def update_notificacion(id: int, notificacion: NotificacionUpdate, db: Session = Depends(get_db)):
    service = NotificacionService(db)
    obj = service.update_notificacion(id, notificacion)
    if not obj:
        raise HTTPException(status_code=404, detail="Notificacion not found")
    return obj

@router.delete("/{id}", response_model=bool)
def delete_notificacion(id: int, db: Session = Depends(get_db)):
    service = NotificacionService(db)
    return service.delete_notificacion(id)

@router.post("/{id}/alertas", response_model=AlertaOut)
def create_alerta_for_notificacion(
    id: int, alerta: AlertaCreate, db: Session = Depends(get_db)
):
    print(f"[DEBUG] Creando alerta para notificación ID: {id}")
    print(f"[DEBUG] Datos de alerta recibidos: {alerta}")
    
    service = NotificacionService(db)
    notificacion = service.get_notificacion(id)
    print(f"[DEBUG] Notificación obtenida: {notificacion}")
    
    if not notificacion:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")

    # Asignar el IdTransaccion de la notificación a la alerta
    id_transaccion = notificacion.get('IdTransaccion') if isinstance(notificacion, dict) else getattr(notificacion, 'IdTransaccion', None)
    print(f"[DEBUG] IdTransaccion extraído: {id_transaccion}")
    
    if not id_transaccion:
        raise HTTPException(status_code=400, detail=f"La notificación no tiene IdTransaccion válido. Notificación: {notificacion}")
    
    print(f"[DEBUG] Asignando IdTransaccion {id_transaccion} a la alerta")
    alerta.IdTransaccion = id_transaccion

    # Crear la alerta en la base de datos usando el servicio
    from backend.services.alerta_service import AlertaService
    alerta_service = AlertaService(db)
    alerta_obj = alerta_service.create_alerta(alerta)

    return alerta_obj

@router.post("/{id}/observaciones", response_model=ObservacionesOut)
def create_observacion_for_notificacion(
    id: int, observacion: ObservacionesCreate, db: Session = Depends(get_db)
):
    print(f"[DEBUG] Creando observación para notificación ID: {id}")
    print(f"[DEBUG] Datos de observación recibidos: {observacion}")
    
    service = NotificacionService(db)
    notificacion = service.get_notificacion(id)
    print(f"[DEBUG] Notificación obtenida: {notificacion}")
    
    if not notificacion:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")

    # Asignar el IdTransaccion de la notificación a la observación
    id_transaccion = notificacion.get('IdTransaccion') if isinstance(notificacion, dict) else getattr(notificacion, 'IdTransaccion', None)
    print(f"[DEBUG] IdTransaccion extraído: {id_transaccion}")
    
    if not id_transaccion:
        raise HTTPException(status_code=400, detail=f"La notificación no tiene IdTransaccion válido. Notificación: {notificacion}")
    
    print(f"[DEBUG] Asignando IdTransaccion {id_transaccion} a la observación")
    observacion.IdTransaccion = id_transaccion

    # Crear la observación en la base de datos usando el servicio
    from backend.services.observaciones_service import ObservacionesService
    observacion_service = ObservacionesService(db)
    observacion_obj = observacion_service.create_observacion(observacion)

    return observacion_obj