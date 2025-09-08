from sqlalchemy import Column, Integer, String, Text, Date, DateTime
from backend.database.connection import Base

class TipoNotificacion(Base):
    __tablename__ = "TipoNotificacion"

    IdTipoNotificacion = Column(Integer, primary_key=True, index=True, autoincrement=False)
    Descripcion = Column(String(50), nullable=False)
    DescCorta = Column(String(15), nullable=True)
    AudFecha = Column(DateTime, nullable=True)
    AudUsuario = Column(Integer, nullable=True)