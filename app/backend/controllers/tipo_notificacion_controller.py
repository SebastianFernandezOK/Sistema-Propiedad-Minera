from fastapi import APIRouter, Depends, HTTPException, Response, Query
from sqlalchemy.orm import Session
from backend.services.tipo_notificacion_service import TipoNotificacionService
from backend.schemas.tipo_notificacion_schema import TipoNotificacionCreate, TipoNotificacionUpdate, TipoNotificacionOut
from backend.database.connection import get_db
from typing import List

router = APIRouter(
    prefix="/tipos-notificacion",
    tags=["Tipo Notificacion"]
)

@router.get("/", response_model=List[TipoNotificacionOut])
def list_tipos_notificacion(
    db: Session = Depends(get_db),
    response: Response = None,
    range: str = Query(None, alias="range")
):
    print(f"Controller: list_tipos_notificacion called with range={range}")
    service = TipoNotificacionService(db)
    items = service.get_tipos_notificacion()
    print(f"Controller: Service returned {len(items)} items")
    total = len(items)
    start, end = 0, total - 1
    if range:
        import json
        try:
            start, end = json.loads(range)
        except Exception:
            pass
    paginated_items = items[start:end+1]
    if response is not None:
        response.headers["Content-Range"] = f"tipos-notificacion {start}-{end}/{total}"
        print(f"Controller: Setting Content-Range header: tipos-notificacion {start}-{end}/{total}")
    print(f"Controller: Returning {len(paginated_items)} paginated items")
    return paginated_items

@router.get("/{id}", response_model=TipoNotificacionOut)
def get_tipo_notificacion(id: int, db: Session = Depends(get_db)):
    service = TipoNotificacionService(db)
    obj = service.get_tipo_notificacion(id)
    if not obj:
        raise HTTPException(status_code=404, detail="TipoNotificacion not found")
    return obj

@router.post("/", response_model=TipoNotificacionOut)
def create_tipo_notificacion(tipo_notificacion: TipoNotificacionCreate, db: Session = Depends(get_db)):
    service = TipoNotificacionService(db)
    created = service.create_tipo_notificacion(tipo_notificacion)
    if not created:
        raise HTTPException(status_code=400, detail="TipoNotificacion with given ID already exists")
    return created

@router.put("/{id}", response_model=TipoNotificacionOut)
def update_tipo_notificacion(id: int, tipo_notificacion: TipoNotificacionUpdate, db
    : Session = Depends(get_db)):
    service = TipoNotificacionService(db)
    obj = service.update_tipo_notificacion(id, tipo_notificacion)
    if not obj:
        raise HTTPException(status_code=404, detail="TipoNotificacion not found")
    return obj

@router.delete("/{id}", response_model=TipoNotificacionOut)
def delete_tipo_notificacion(id: int, db: Session = Depends(get_db)):
    service = TipoNotificacionService(db)
    obj = service.delete_tipo_notificacion(id)
    if not obj:
        raise HTTPException(status_code=404, detail="TipoNotificacion not found")
    return obj

