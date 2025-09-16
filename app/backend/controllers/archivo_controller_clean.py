from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend.services.archivo_service import ArchivoService
from backend.services.expediente_service import ExpedienteService
from backend.schemas.archivo_schema import ArchivoCreate, ArchivoUpdate, ArchivoOut
from backend.database.connection import get_db
from typing import List, Optional
import os
from datetime import datetime
from fastapi.responses import FileResponse

router = APIRouter(prefix="/archivos", tags=["archivos"])
BASE_UPLOAD_DIR = r"C:\Users\SebastianCarlosFerna\Documents\sistema-propiedad-minera-angular\Sistema-Propiedad-Minera\app\backend\uploads"
os.makedirs(BASE_UPLOAD_DIR, exist_ok=True)

# Endpoint genérico para subir archivos por entidad
@router.post("/upload/{entidad}/{id_entidad}", response_model=ArchivoOut, status_code=status.HTTP_201_CREATED)
def upload_archivo_entidad(
    entidad: str,
    id_entidad: int,
    file: UploadFile = File(...),
    descripcion: Optional[str] = Form(None),
    aud_usuario: int = Form(1),
    db: Session = Depends(get_db)
):
    # Validar entidades permitidas
    entidades_permitidas = ["expediente"]
    if entidad not in entidades_permitidas:
        raise HTTPException(status_code=400, detail=f"Entidad '{entidad}' no permitida. Entidades válidas: {entidades_permitidas}")
    
    try:
        if entidad == "expediente":
            return _upload_archivo_expediente(id_entidad, file, descripcion, aud_usuario, db)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al subir archivo: {str(e)}")

def _upload_archivo_expediente(id_expediente: int, file: UploadFile, descripcion: Optional[str], aud_usuario: int, db: Session):
    # Obtener datos del expediente
    expediente_service = ExpedienteService(db)
    expediente = expediente_service.get_by_id(id_expediente)
    if not expediente:
        raise HTTPException(status_code=404, detail="Expediente no encontrado")
    
    # Crear carpeta de expedientes si no existe
    expediente_folder = os.path.join(BASE_UPLOAD_DIR, "expedientes")
    os.makedirs(expediente_folder, exist_ok=True)
    
    # Generar nombre del archivo modificado
    codigo_expediente = expediente.CodigoExpediente or f"EXP-{id_expediente}"
    file_extension = os.path.splitext(file.filename)[1] if file.filename else ""
    original_name_without_ext = os.path.splitext(file.filename)[0] if file.filename else "archivo"
    nuevo_nombre = f"{codigo_expediente}_{original_name_without_ext}{file_extension}"
    
    # Guardar archivo físico
    file_path = os.path.join(expediente_folder, nuevo_nombre)
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())
    
    # Crear registro en la base de datos
    archivo_data = ArchivoCreate(
        IdTransaccion=expediente.IdTransaccion,
        Nombre=nuevo_nombre,
        Descripcion=descripcion,
        Tipo="expediente",
        Link="/uploads/expedientes/",
        AudFecha=datetime.utcnow(),
        AudUsuario=aud_usuario
    )
    
    archivo_service = ArchivoService(db)
    return archivo_service.create_archivo(archivo_data)

# Endpoint genérico para obtener archivos por entidad
@router.get("/{entidad}/{id_entidad}", response_model=List[ArchivoOut])
def get_archivos_entidad(entidad: str, id_entidad: int, db: Session = Depends(get_db)):
    # Validar entidades permitidas
    entidades_permitidas = ["expediente"]
    if entidad not in entidades_permitidas:
        raise HTTPException(status_code=400, detail=f"Entidad '{entidad}' no permitida")
    
    if entidad == "expediente":
        # Obtener el IdTransaccion del expediente
        expediente_service = ExpedienteService(db)
        expediente = expediente_service.get_by_id(id_entidad)
        if not expediente:
            raise HTTPException(status_code=404, detail="Expediente no encontrado")
        
        # Obtener archivos por IdTransaccion y Tipo
        archivo_service = ArchivoService(db)
        return archivo_service.get_archivos_by_transaccion_and_tipo(expediente.IdTransaccion, "expediente")

# Endpoint para descargar archivos
@router.get("/download")
def download_archivo(link: str, nombre: str):
    # Concatenar link + nombre para obtener la ruta completa
    file_path = os.path.join(BASE_UPLOAD_DIR, link.replace("/uploads/", ""), nombre)
    file_path = os.path.normpath(file_path)
    
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    
    return FileResponse(file_path, media_type='application/octet-stream', filename=nombre)

# Endpoints básicos de CRUD
@router.get("/", response_model=List[ArchivoOut])
def list_archivos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    service = ArchivoService(db)
    return service.get_archivos(skip, limit)

@router.get("/by-id/{id_archivo}", response_model=ArchivoOut)
def get_archivo(id_archivo: int, db: Session = Depends(get_db)):
    service = ArchivoService(db)
    archivo = service.get_archivo(id_archivo)
    if not archivo:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    return archivo

@router.delete("/{id_archivo}", status_code=status.HTTP_204_NO_CONTENT)
def delete_archivo(id_archivo: int, db: Session = Depends(get_db)):
    service = ArchivoService(db)
    deleted = service.delete_archivo(id_archivo)
    if not deleted:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    return None
