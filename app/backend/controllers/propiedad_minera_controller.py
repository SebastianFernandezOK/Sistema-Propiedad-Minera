from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from backend.services.propiedad_minera_service import PropiedadMineraService
from backend.schemas.propiedad_minera_schema import PropiedadMineraRead, PropiedadMineraCreate
from backend.database.connection import get_db
from typing import List
from fastapi import Query, APIRouter, Request
import json
from sqlalchemy import or_, func
from sqlalchemy.dialects.postgresql import UUID
from backend.models.expediente_model import Expediente
from sqlalchemy import or_, func, String as SAString
from backend.models.expediente_model import Expediente
from backend.services.auth_jwt import get_current_user, require_role

router = APIRouter(prefix="/propiedades-mineras", tags=["Propiedades Mineras"])

@router.get("", response_model=List[PropiedadMineraRead])
def listar_propiedades(
    db: Session = Depends(get_db),
    response: Response = None,
    range: str = Query(None, alias="range"),
    filter: str = Query(None)
):
    service = PropiedadMineraService(db)
    filters = {}
    if filter:
        filters_json = json.loads(filter)
        if "Nombre" in filters_json:
            filters["nombre"] = filters_json["Nombre"]
        if "Provincia" in filters_json:
            filters["provincia"] = filters_json["Provincia"]
        if "IdTitular" in filters_json:
            try:
                filters["id_titular"] = int(filters_json["IdTitular"])
            except Exception:
                pass
        if "Expediente" in filters_json:
            filters["expediente"] = filters_json["Expediente"]
    start, end = 0, 9
    if range:
        try:
            start, end = json.loads(range)
        except Exception:
            pass
    limit = end - start + 1
    items, total = service.get_filtered_paginated(filters, offset=start, limit=limit)
    response.headers["Content-Range"] = f"propiedades-mineras {start}-{start+len(items)-1}/{total}"
    return items

@router.get("/{id_propiedad}", response_model=PropiedadMineraRead)
def obtener_propiedad(id_propiedad: int, db: Session = Depends(get_db)):
    service = PropiedadMineraService(db)
    propiedad = service.get_by_id(id_propiedad)
    if not propiedad:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    return propiedad


@router.post("/", response_model=PropiedadMineraRead)
@router.post("", response_model=PropiedadMineraRead)
def crear_propiedad(
    propiedad_data: PropiedadMineraCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "maestro"]))
):
    service = PropiedadMineraService(db)
    try:
        return service.create(propiedad_data)
    except ValueError as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{id_propiedad}", response_model=PropiedadMineraRead)
def actualizar_propiedad(
    id_propiedad: int,
    propiedad_data: dict,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "maestro"]))
):
    service = PropiedadMineraService(db)
    try:
        updated = service.update(id_propiedad, propiedad_data)
        if not updated:
            raise HTTPException(status_code=404, detail="Propiedad no encontrada")
        return updated
    except ValueError as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{id_propiedad}")
def borrar_propiedad(id_propiedad: int, db: Session = Depends(get_db)):
    service = PropiedadMineraService(db)
    deleted = service.delete(id_propiedad)
    if not deleted:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    return {"ok": True}