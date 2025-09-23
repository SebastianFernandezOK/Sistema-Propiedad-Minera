from fastapi import APIRouter, Depends, HTTPException, Response, Query
from sqlalchemy.orm import Session
from backend.schemas.usuario_schema import UsuarioOut, UsuarioCreate, UsuarioUpdate, UsuarioLogin
from backend.services import usuario_service
from backend.database.connection import get_db
from typing import List
from pydantic import BaseModel

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"]
)

class CambiarPasswordRequest(BaseModel):
    password_actual: str
    password_nueva: str

class ActivarUsuarioRequest(BaseModel):
    activo: bool

@router.get("", response_model=List[UsuarioOut])
def listar_usuarios(
    db: Session = Depends(get_db),
    response: Response = None,
    range: str = Query(None, alias="range")
):
    try:
        items = usuario_service.get_usuarios(db)
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
            response.headers["Content-Range"] = f"usuarios {start}-{end}/{total}"
        return paginated_items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{id_usuario}", response_model=UsuarioOut)
def obtener_usuario(id_usuario: int, db: Session = Depends(get_db)):
    try:
        usuario = usuario_service.get_usuario(db, id_usuario)
        if usuario is None:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return usuario
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/username/{nombre_usuario}", response_model=UsuarioOut)
def obtener_usuario_por_username(nombre_usuario: str, db: Session = Depends(get_db)):
    try:
        usuario = usuario_service.get_usuario_by_username(db, nombre_usuario)
        if usuario is None:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return usuario
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=UsuarioOut)
def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    try:
        nuevo_usuario = usuario_service.create_usuario(db, usuario)
        return nuevo_usuario
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{id_usuario}", response_model=UsuarioOut)
def actualizar_usuario(id_usuario: int, usuario: UsuarioUpdate, db: Session = Depends(get_db)):
    try:
        usuario_actualizado = usuario_service.update_usuario(db, id_usuario, usuario)
        if usuario_actualizado is None:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return usuario_actualizado
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{id_usuario}")
def eliminar_usuario(id_usuario: int, db: Session = Depends(get_db)):
    try:
        resultado = usuario_service.delete_usuario(db, id_usuario)
        if not resultado:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return {"message": "Usuario eliminado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=UsuarioOut)
def login_usuario(usuario_login: UsuarioLogin, db: Session = Depends(get_db)):
    try:
        usuario = usuario_service.authenticate_usuario(db, usuario_login)
        if usuario is None:
            raise HTTPException(status_code=401, detail="Credenciales incorrectas")
        return usuario
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{id_usuario}/cambiar-password", response_model=UsuarioOut)
def cambiar_password(
    id_usuario: int, 
    request: CambiarPasswordRequest, 
    db: Session = Depends(get_db)
):
    try:
        usuario_actualizado = usuario_service.cambiar_password(
            db, id_usuario, request.password_actual, request.password_nueva
        )
        if usuario_actualizado is None:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return usuario_actualizado
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{id_usuario}/activar", response_model=UsuarioOut)
def activar_desactivar_usuario(
    id_usuario: int, 
    request: ActivarUsuarioRequest, 
    db: Session = Depends(get_db)
):
    try:
        usuario_actualizado = usuario_service.activar_desactivar_usuario(
            db, id_usuario, request.activo
        )
        if usuario_actualizado is None:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return usuario_actualizado
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))