from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime
from backend.database.connection import Base

class Usuario(Base):
    __tablename__ = "Usuario"

    IdUsuario = Column(Integer, primary_key=True, index=True, autoincrement=True)
    NombreCompleto = Column(String(60), nullable=False)
    NombreUsuario = Column(String(30), unique=True, nullable=False)
    Email = Column(String(100), unique=True, nullable=False)
    Password = Column(String(255), nullable=False)  # Aumentado para almacenar hash
    Rol = Column(String(50), nullable=False)
    Activo = Column(Boolean, default=False, nullable=False)
    FechaCreacion = Column(Date, nullable=False)
    UltimaConexion = Column(DateTime, nullable=True)
    Telefono = Column(String(25), nullable=True)
    Observacion = Column(String(200), nullable=True)
    Descripcion = Column(String(200), nullable=True)