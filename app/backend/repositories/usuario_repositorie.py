from sqlalchemy.orm import Session
from backend.models.usuario_model import Usuario
from backend.schemas.usuario_schema import UsuarioCreate, UsuarioUpdate
import hashlib

class UsuarioRepositorie:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(Usuario).all()

    def get_by_id(self, id_usuario: int):
        return self.db.query(Usuario).filter(Usuario.IdUsuario == id_usuario).first()

    def get_by_username(self, nombre_usuario: str):
        return self.db.query(Usuario).filter(Usuario.NombreUsuario == nombre_usuario).first()

    def get_by_email(self, email: str):
        return self.db.query(Usuario).filter(Usuario.Email == email).first()

    def create(self, usuario_data: UsuarioCreate):
        # Hash de la contraseña
        password_hash = self._hash_password(usuario_data.Password)
        
        # Crear diccionario con los datos del usuario
        usuario_dict = usuario_data.dict()
        usuario_dict['Password'] = password_hash
        
        usuario = Usuario(**usuario_dict)
        self.db.add(usuario)
        self.db.commit()
        self.db.refresh(usuario)
        return usuario

    def update(self, id_usuario: int, usuario_data: dict):
        usuario = self.get_by_id(id_usuario)
        if not usuario:
            return None
        
        # Si se está actualizando la contraseña, hashearla
        if 'Password' in usuario_data and usuario_data['Password']:
            usuario_data['Password'] = self._hash_password(usuario_data['Password'])
        
        for key, value in usuario_data.items():
            if value is not None:
                setattr(usuario, key, value)
        
        self.db.commit()
        self.db.refresh(usuario)
        return usuario

    def delete(self, id_usuario: int):
        usuario = self.get_by_id(id_usuario)
        if not usuario:
            return None
        self.db.delete(usuario)
        self.db.commit()
        return True

    def verify_password(self, usuario: Usuario, password: str) -> bool:
        """Verifica si la contraseña proporcionada coincide con la hash almacenada"""
        return usuario.Password == self._hash_password(password)

    def _hash_password(self, password: str) -> str:
        """Hashea la contraseña usando SHA-256"""
        return hashlib.sha256(password.encode()).hexdigest()