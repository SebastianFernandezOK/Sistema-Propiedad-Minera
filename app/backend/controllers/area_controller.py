from fastapi import APIRouter, Depends, HTTPException, Response, Query
from sqlalchemy.orm import Session
from backend.schemas.area_schema import AreaOut, AreaCreate, AreaUpdate
from backend.services import area_service
from backend.database.connection import get_db
from typing import List
from backend.services.auth_jwt import get_current_user

router = APIRouter(
    prefix="/areas",
    tags=["areas"]
)

@router.get("", response_model=List[AreaOut])
def listar_areas(
    db: Session = Depends(get_db),
    response: Response = None,
    range: str = Query(None, alias="range"),
    _: int = Depends(get_current_user)
):
    items = area_service.get_areas(db)
    total = len(items)
    # Parse range param (ejemplo: '[0,9]')
    start, end = 0, total - 1
    if range:
        import json
        try:
            start, end = json.loads(range)
        except Exception:
            pass
    paginated_items = items[start:end+1]
    if response is not None:
        response.headers["Content-Range"] = f"areas {start}-{end}/{total}"
    return paginated_items

@router.get("/{id}", response_model=AreaOut)
def obtener_area(id: int, db: Session = Depends(get_db), _: int = Depends(get_current_user)):
    area = area_service.get_area(db, id)
    if not area:
        raise HTTPException(status_code=404, detail="Area no encontrada")
    return area

@router.post("/", response_model=AreaOut)
def crear_area(area_data: AreaCreate, db: Session = Depends(get_db), _: int = Depends(get_current_user)):
    return area_service.create_area(db, area_data)

@router.put("/{id}", response_model=AreaOut)
def actualizar_area(id: int, area_data: AreaUpdate, db: Session = Depends(get_db), _: int = Depends(get_current_user)):
    updated = area_service.update_area(db, id, area_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Area no encontrada")
    return updated

@router.delete("/{id}")
def borrar_area(id: int, db: Session = Depends(get_db), _: int = Depends(get_current_user)):
    deleted = area_service.delete_area(db, id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Area no encontrada")
    return {"ok": True}