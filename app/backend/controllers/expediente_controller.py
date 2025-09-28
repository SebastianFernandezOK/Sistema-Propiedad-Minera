from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from backend.services.expediente_service import ExpedienteService
from backend.schemas.expediente_schema import ExpedienteRead, ExpedienteCreate
from backend.schemas.alerta_schema import AlertaOut
from backend.models.alerta_model import Alerta
from backend.schemas.observaciones_schema import ObservacionesOut
from backend.models.observaciones_model import Observaciones
from backend.models.acta_model import Acta
from backend.database.connection import get_db
from typing import List
from fastapi import Query
from typing import Dict, Any
from backend.services.auth_jwt import get_current_user

router = APIRouter(prefix="/expedientes", tags=["Expedientes"])

@router.get("/", response_model=List[ExpedienteRead])
def listar_expedientes(
    db: Session = Depends(get_db),
    response: Response = None,
    range: str = Query(None, alias="range"),
    CodigoExpediente: str = Query(None)
):
    service = ExpedienteService(db)
    items = service.get_all()
    
    # Aplicar filtro de código expediente si se proporciona
    if CodigoExpediente:
        items = [item for item in items if CodigoExpediente.lower() in (item.CodigoExpediente or "").lower()]
    
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
    response.headers["Content-Range"] = f"expedientes {start}-{end}/{total}"
    # Serializar cada expediente usando Pydantic para asegurar nombres y valores correctos
    return [ExpedienteRead.from_orm(e).dict() for e in paginated_items]



@router.get("/{id_expediente}", response_model=Dict[str, Any])
def obtener_expediente(id_expediente: int, db: Session = Depends(get_db)):
    service = ExpedienteService(db)
    expediente = service.get_by_id(id_expediente)
    if not expediente:
        raise HTTPException(status_code=404, detail="Expediente no encontrado")
    # Buscar alertas relacionadas por IdTransaccion
    id_transaccion = getattr(expediente, "IdTransaccion", None)
    alertas = []
    observaciones = []
    if id_transaccion:
        try:
            alertas_db = db.query(Alerta).filter(Alerta.IdTransaccion == id_transaccion).order_by(Alerta.idAlerta).all()
            print(f"[DEBUG] Alertas encontradas para IdTransaccion={id_transaccion}: {len(alertas_db)}")
            for a in alertas_db:
                print(f"[DEBUG] Alerta cruda: idAlerta={a.idAlerta}, IdTransaccion={a.IdTransaccion}, Estado={a.Estado}")
            alertas = [AlertaOut.from_orm(a).dict() for a in alertas_db]
            # Buscar observaciones relacionadas por IdTransaccion
            observaciones_db = db.query(Observaciones).filter(Observaciones.IdTransaccion == id_transaccion).all()
            print(f"[DEBUG] Observaciones crudas para IdTransaccion={id_transaccion}: {observaciones_db}")
            print(f"[DEBUG] Observaciones encontradas para IdTransaccion={id_transaccion}: {len(observaciones_db)}")
            observaciones = [ObservacionesOut.from_orm(o).dict() for o in observaciones_db]
        except Exception as e:
            print(f"[ERROR] Al procesar alertas/observaciones para expediente {id_expediente}: {e}")
            alertas = []
            observaciones = []
    # Serializar expediente usando Pydantic (from_orm para SQLAlchemy)
    expediente_data = ExpedienteRead.from_orm(expediente).dict()
    expediente_data["alertas"] = alertas
    expediente_data["observaciones"] = observaciones
    print(f"[DEBUG] Expediente response: {expediente_data}")
    return expediente_data

@router.post("/", response_model=ExpedienteRead)
def crear_expediente(expediente_data: ExpedienteCreate, db: Session = Depends(get_db)):
    print('DEBUG Expediente recibido:', expediente_data)
    service = ExpedienteService(db)
    return service.create(expediente_data)

@router.put("/{id_expediente}", response_model=ExpedienteRead)
def actualizar_expediente(id_expediente: int, expediente_data: dict, db: Session = Depends(get_db)):
    service = ExpedienteService(db)
    updated = service.update(id_expediente, expediente_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Expediente no encontrado")
    return updated

@router.delete("/{id_expediente}")
def borrar_expediente(id_expediente: int, db: Session = Depends(get_db)):
    service = ExpedienteService(db)
    deleted = service.delete(id_expediente)
    if not deleted:
        raise HTTPException(status_code=404, detail="Expediente no encontrado")
    return {"ok": True}

@router.get("/propiedad-minera/{id_propiedad}", response_model=List[ExpedienteRead])
def listar_expedientes_por_propiedad_minera(id_propiedad: int, db: Session = Depends(get_db)):
    service = ExpedienteService(db)
    items = service.get_by_propiedad_minera(id_propiedad)
    return [ExpedienteRead.from_orm(e).dict() for e in items]