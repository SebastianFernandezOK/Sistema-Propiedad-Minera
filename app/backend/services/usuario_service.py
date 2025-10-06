from sqlalchemy.orm import Session
from backend.repositories.usuario_repositorie import UsuarioRepositorie
from backend.schemas.usuario_schema import UsuarioCreate, UsuarioUpdate, UsuarioLogin
from backend.models.usuario_model import Usuario
from datetime import datetime

def get_usuario(db: Session, id: int):
    repo = UsuarioRepositorie(db)
    return repo.get_by_id(id)

def get_usuarios(db: Session, skip: int = 0, limit: int = 100):
    repo = UsuarioRepositorie(db)
    return repo.get_all()

def get_usuario_by_username(db: Session, nombre_usuario: str):
    repo = UsuarioRepositorie(db)
    return repo.get_by_username(nombre_usuario)

def get_usuario_by_email(db: Session, email: str):
    repo = UsuarioRepositorie(db)
    return repo.get_by_email(email)

def create_usuario(db: Session, usuario: UsuarioCreate):
    repo = UsuarioRepositorie(db)
    
    # Verificar si el nombre de usuario ya existe
    existing_user = repo.get_by_username(usuario.NombreUsuario)
    if existing_user:
        raise ValueError("El nombre de usuario ya existe")
    
    # Verificar si el email ya existe
    existing_email = repo.get_by_email(usuario.Email)
    if existing_email:
        raise ValueError("El email ya existe")
    
    return repo.create(usuario)

def update_usuario(db: Session, id: int, usuario_update: UsuarioUpdate):
    repo = UsuarioRepositorie(db)
    
    # Si se está actualizando el nombre de usuario, verificar que no exista
    if usuario_update.NombreUsuario:
        existing_user = repo.get_by_username(usuario_update.NombreUsuario)
        if existing_user and existing_user.IdUsuario != id:
            raise ValueError("El nombre de usuario ya existe")
    
    # Si se está actualizando el email, verificar que no exista
    if usuario_update.Email:
        existing_email = repo.get_by_email(usuario_update.Email)
        if existing_email and existing_email.IdUsuario != id:
            raise ValueError("El email ya existe")
    
    return repo.update(id, usuario_update.dict(exclude_unset=True))

def delete_usuario(db: Session, id: int):
    repo = UsuarioRepositorie(db)
    return repo.delete(id)

def authenticate_usuario(db: Session, usuario_login: UsuarioLogin):
    """Autentica por nombre de usuario o email y actualiza última conexión"""
    repo = UsuarioRepositorie(db)
    # Buscar por nombre de usuario o email
    usuario = repo.get_by_username(usuario_login.usuario)
    if not usuario:
        usuario = repo.get_by_email(usuario_login.usuario)
    if not usuario:
        return None
    if not repo.verify_password(usuario, usuario_login.Password):
        return None
    if not usuario.Activo:
        raise ValueError("Usuario inactivo")
    # Actualizar última conexión
    repo.update(usuario.IdUsuario, {"UltimaConexion": datetime.now()})
    
    return usuario

def cambiar_password(db: Session, id: int, password_actual: str, password_nueva: str):
    """Cambia la contraseña de un usuario verificando la contraseña actual"""
    repo = UsuarioRepositorie(db)
    usuario = repo.get_by_id(id)
    
    if not usuario:
        raise ValueError("Usuario no encontrado")
    
    if not repo.verify_password(usuario, password_actual):
        raise ValueError("Contraseña actual incorrecta")
    
    return repo.update(id, {"Password": password_nueva})

def activar_desactivar_usuario(db: Session, id: int, activo: bool):
    """Activa o desactiva un usuario"""
    repo = UsuarioRepositorie(db)
    return repo.update(id, {"Activo": activo})