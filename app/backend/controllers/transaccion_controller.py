from fastapi import APIRouter, Depends, HTTPException, Response, Query
from sqlalchemy.orm import Session
from backend.services.transaccion_service import TransaccionService
from backend.schemas.transaccion_schema import TransaccionCreate, TransaccionUpdate, TransaccionOut
from backend.database.connection import get_db
from typing import List, Dict, Any
from backend.services.auth_jwt import get_current_user

router = APIRouter(
    prefix="/transacciones",
    tags=["transacciones"]
)

@router.get("/", response_model=List[TransaccionOut])
def list_transacciones(
    db: Session = Depends(get_db),
    response: Response = None,
    range: str = Query(None, alias="range"),
    current_user: int = Depends(get_current_user)
):
    service = TransaccionService(db)
    items = service.get_transacciones()
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
        response.headers["Content-Range"] = f"transacciones {start}-{end}/{total}"
    return paginated_items

@router.get("/{id}", response_model=TransaccionOut)
def get_transaccion(id: int, db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):
    service = TransaccionService(db)
    obj = service.get_transaccion(id)
    if not obj:
        raise HTTPException(status_code=404, detail="Transaccion not found")
    return obj

@router.post("/", response_model=TransaccionOut)
def create_transaccion(transaccion: TransaccionCreate, db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):
    service = TransaccionService(db)
    return service.create_transaccion(transaccion)

@router.put("/{id}", response_model=TransaccionOut)
def update_transaccion(id: int, transaccion: TransaccionUpdate, db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):
    service = TransaccionService(db)
    obj = service.update_transaccion(id, transaccion)
    if not obj:
        raise HTTPException(status_code=404, detail="Transaccion not found")
    return obj

@router.delete("/{id}", response_model=TransaccionOut)
def delete_transaccion(id: int, db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):
    service = TransaccionService(db)
    obj = service.delete_transaccion(id)
    if not obj:
        raise HTTPException(status_code=404, detail="Transaccion not found")
    return obj

@router.get("/informacion/{tabla}/{id_transaccion}", response_model=List[Dict[str, Any]])
def get_informacion_transaccion(
    tabla: str, 
    id_transaccion: int, 
    db: Session = Depends(get_db), 
    current_user: int = Depends(get_current_user)
):
    """
    Ejecuta el procedure InformacionTransaccion para obtener información específica
    de una transacción en una tabla determinada.
    
    Parameters:
    - tabla: Nombre de la tabla (ej: 'Expediente', 'Acta', 'PropiedadMinera')
    - id_transaccion: ID de la transacción a consultar
    """
    service = TransaccionService(db)
    try:
        result = service.get_informacion_transaccion(tabla, id_transaccion)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error ejecutando procedure: {str(e)}")
