from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend.services.archivo_service import ArchivoService
from backend.services.expediente_service import ExpedienteService
from backend.schemas.archivo_schema import ArchivoCreate, ArchivoUpdate, ArchivoOut, ArchivosPaginatedResponse
from backend.database.connection import get_db
from typing import List, Optional
import os
from datetime import datetime
from fastapi.responses import FileResponse

router = APIRouter(prefix="/archivos", tags=["archivos"])
BASE_UPLOAD_DIR = r"C:\Users\marcc\OneDrive\Documentos\JULIAN\Aisa\Sistema-Propiedad-Minera\app\backend\uploads"
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
    entidades_permitidas = ["expediente", "acta"]
    if entidad not in entidades_permitidas:
        raise HTTPException(status_code=400, detail=f"Entidad '{entidad}' no permitida. Entidades válidas: {entidades_permitidas}")

    try:
        if entidad == "expediente":
            return _upload_archivo_expediente(id_entidad, file, descripcion, aud_usuario, db)
        elif entidad == "acta":
            # id_entidad es el id de transaccion de acta
            return _upload_archivo_acta(id_entidad, file, descripcion, aud_usuario, db)
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
    
    # Generar nombre temporal del archivo
    codigo_expediente = expediente.CodigoExpediente or f"EXP-{id_expediente}"
    file_extension = os.path.splitext(file.filename)[1] if file.filename else ""
    original_name_without_ext = os.path.splitext(file.filename)[0] if file.filename else "archivo"
    temp_nombre = f"{codigo_expediente}_{original_name_without_ext}{file_extension}"
    
    # Guardar archivo temporalmente
    temp_file_path = os.path.join(expediente_folder, temp_nombre)
    with open(temp_file_path, "wb") as buffer:
        buffer.write(file.file.read())
    
    try:
        # Crear registro en la base de datos primero
        archivo_data = ArchivoCreate(
            IdTransaccion=expediente.IdTransaccion,
            Nombre=temp_nombre,  # Nombre temporal
            Descripcion=descripcion,
            Tipo="expediente",
            Link="/uploads/expedientes/",
            AudFecha=datetime.utcnow(),
            AudUsuario=aud_usuario
        )
        
        archivo_service = ArchivoService(db)
        archivo_creado = archivo_service.create_archivo(archivo_data)
        
        # Ahora generar el nombre final con el ID del archivo
        nuevo_nombre = f"{archivo_creado.IdArchivo}_{codigo_expediente}_{original_name_without_ext}{file_extension}"
        
        # Asegurar que el nombre no exceda 255 caracteres para la BD
        if len(nuevo_nombre) > 255:
            # Truncar el nombre manteniendo la extensión y el ID
            max_name_length = 255 - len(file_extension)
            nuevo_nombre = nuevo_nombre[:max_name_length] + file_extension
        
        # Renombrar el archivo físico
        nuevo_file_path = os.path.join(expediente_folder, nuevo_nombre)
        os.rename(temp_file_path, nuevo_file_path)
        
        # Actualizar el nombre en la base de datos
        archivo_creado.Nombre = nuevo_nombre
        db.commit()
        db.refresh(archivo_creado)
        
        return archivo_creado
        
    except Exception as e:
        # Si falla algo, eliminar el archivo físico
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=f"Error al crear registro en BD: {str(e)}")

def _upload_archivo_acta(id_acta: int, file: UploadFile, descripcion: Optional[str], aud_usuario: int, db: Session):
    archivo_service = ArchivoService(db)
    acta_folder = os.path.join(BASE_UPLOAD_DIR, "actas")
    os.makedirs(acta_folder, exist_ok=True)

    # Generar nombre temporal del archivo
    # Usar la descripción de la acta para el nombre
    from backend.services.acta_service import ActaService
    acta_service = ActaService(db)
    acta = acta_service.get_by_transaccion(id_acta)
    descripcion_acta = (acta.Descripcion or "ACTA").replace(" ", "_") if acta else f"ACTA_{id_acta}"
    file_extension = os.path.splitext(file.filename)[1] if file.filename else ""
    original_name_without_ext = os.path.splitext(file.filename)[0] if file.filename else "archivo"
    temp_nombre = f"{descripcion_acta}_{original_name_without_ext}{file_extension}"

    # Guardar archivo temporalmente
    temp_file_path = os.path.join(acta_folder, temp_nombre)
    with open(temp_file_path, "wb") as buffer:
        buffer.write(file.file.read())

    try:
        # Crear registro en la base de datos primero
        archivo_data = ArchivoCreate(
            IdTransaccion=id_acta,  # id_acta es el id de transaccion
            Nombre=temp_nombre,  # Nombre temporal
            Descripcion=descripcion,
            Tipo="acta",
            Link="/uploads/actas/",
            AudFecha=datetime.utcnow(),
            AudUsuario=aud_usuario
        )
        archivo_creado = archivo_service.create_archivo(archivo_data)

        # Generar el nombre final con el ID del archivo
        nuevo_nombre = f"{archivo_creado.IdArchivo}_{descripcion_acta}_{original_name_without_ext}{file_extension}"
        if len(nuevo_nombre) > 255:
            max_name_length = 255 - len(file_extension)
            nuevo_nombre = nuevo_nombre[:max_name_length] + file_extension

        # Renombrar el archivo físico
        nuevo_file_path = os.path.join(acta_folder, nuevo_nombre)
        os.rename(temp_file_path, nuevo_file_path)

        # Actualizar el nombre en la base de datos
        archivo_creado.Nombre = nuevo_nombre
        archivo_creado.Link = f"/uploads/actas/{nuevo_nombre}"
        db.commit()
        db.refresh(archivo_creado)

        return archivo_creado
    except Exception as e:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=f"Error al crear registro en BD: {str(e)}")
# Endpoint genérico para obtener archivos por entidad con paginación
@router.get("/{entidad}/{id_entidad}", response_model=ArchivosPaginatedResponse)
def get_archivos_entidad(
    entidad: str, 
    id_entidad: int, 
    page: int = 1, 
    limit: int = 10, 
    db: Session = Depends(get_db)
):
    # Validar entidades permitidas
    entidades_permitidas = ["expediente", "acta"]
    if entidad not in entidades_permitidas:
        raise HTTPException(status_code=400, detail=f"Entidad '{entidad}' no permitida")

    # Validar parámetros de paginación
    if page < 1:
        raise HTTPException(status_code=400, detail="La página debe ser mayor a 0")
    if limit < 1 or limit > 100:
        raise HTTPException(status_code=400, detail="El límite debe estar entre 1 y 100")

    if entidad == "expediente":
        expediente_service = ExpedienteService(db)
        expediente = expediente_service.get_by_id(id_entidad)
        if not expediente:
            raise HTTPException(status_code=404, detail="Expediente no encontrado")
        archivo_service = ArchivoService(db)
        skip = (page - 1) * limit
        archivos = archivo_service.get_archivos_by_transaccion_and_tipo_paginated(
            expediente.IdTransaccion, "expediente", skip, limit
        )
        total_archivos = archivo_service.count_archivos_by_transaccion_and_tipo(
            expediente.IdTransaccion, "expediente"
        )
        total_pages = (total_archivos + limit - 1) // limit
        return ArchivosPaginatedResponse(
            archivos=[ArchivoOut.model_validate(archivo) for archivo in archivos],
            pagination={
                "current_page": page,
                "total_pages": total_pages,
                "total_items": total_archivos,
                "items_per_page": limit,
                "has_next": page < total_pages,
                "has_previous": page > 1
            }
        )
    elif entidad == "acta":
        from backend.services.acta_service import ActaService
        acta_service = ActaService(db)
        acta = db.query(acta_service.repository.model).filter_by(IdTransaccion=id_entidad).first()
        if not acta:
            raise HTTPException(status_code=404, detail="Acta no encontrada para ese IdTransaccion")
        archivo_service = ArchivoService(db)
        skip = (page - 1) * limit
        archivos = archivo_service.get_archivos_by_transaccion_and_tipo_paginated(
            acta.IdTransaccion, "acta", skip, limit
        )
        total_archivos = archivo_service.count_archivos_by_transaccion_and_tipo(
            acta.IdTransaccion, "acta"
        )
        total_pages = (total_archivos + limit - 1) // limit
        return ArchivosPaginatedResponse(
            archivos=[ArchivoOut.model_validate(archivo) for archivo in archivos],
            pagination={
                "current_page": page,
                "total_pages": total_pages,
                "total_items": total_archivos,
                "items_per_page": limit,
                "has_next": page < total_pages,
                "has_previous": page > 1
            }
        )

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
