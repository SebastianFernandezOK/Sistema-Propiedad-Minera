from fastapi import APIRouter, Depends, HTTPException, Response, Query
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.schemas.observaciones_schema import ObservacionesCreate, ObservacionesUpdate, ObservacionesOut
from backend.services.observaciones_service import ObservacionesService
from backend.services.auth_jwt import get_current_user

router = APIRouter(prefix="/observaciones", tags=["Observaciones"])

@router.get("/{id_transaccion}", response_model=list[ObservacionesOut])
def get_observaciones_by_transaccion(
    id_transaccion: int,
    db: Session = Depends(get_db),
    response: Response = None,
    range: str = Query(None, alias="range"),
    current_user: int = Depends(get_current_user)
):
    # Obtiene todas las observaciones de la transacción
    obs_list = ObservacionesService(db).get_observaciones_by_transaccion(id_transaccion)
    total = len(obs_list)
    start, end = 0, total - 1
    if range:
        import json
        try:
            start, end = json.loads(range)
        except Exception:
            pass
    paginated = obs_list[start:end+1]
    if response is not None:
        response.headers["Content-Range"] = f"observaciones {start}-{end}/{total}"
    return paginated

@router.post("/", response_model=ObservacionesOut)
def create_observacion(observacion: ObservacionesCreate, db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        return ObservacionesService(db).create_observacion(observacion)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.put("/{id_transaccion}", response_model=ObservacionesOut)
def update_observacion(id_transaccion: int, observacion: ObservacionesUpdate, db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):
    obs = ObservacionesService(db).update_observacion(id_transaccion, observacion)
    if not obs:
        raise HTTPException(status_code=404, detail="Observación no encontrada")
    return obs

@router.delete("/{id_transaccion}", response_model=ObservacionesOut)
def delete_observacion(id_transaccion: int, db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):
    obs = ObservacionesService(db).delete_observacion(id_transaccion)
    if not obs:
        raise HTTPException(status_code=404, detail="Observación no encontrada")
    return obs

@router.get("/", response_model=list[ObservacionesOut])
def get_all_observaciones(db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):
    return ObservacionesService(db).get_all_observaciones()
