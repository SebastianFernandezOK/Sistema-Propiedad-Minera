from sqlalchemy import Column, Integer, String, DateTime, SmallInteger
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Archivo(Base):
    __tablename__ = 'Archivo'

    IdArchivo = Column(Integer, primary_key=True, autoincrement=True)
    IdTransaccion = Column(Integer, nullable=True)
    Nombre = Column(String(255), nullable=True)
    Descripcion = Column(String(150), nullable=True)
    Tipo = Column(String(1500), nullable=True)
    Link = Column(String(500), nullable=False)
    AudFecha = Column(DateTime, nullable=True)
    AudUsuario = Column(SmallInteger, nullable=True)
