# backend/models/notificacion_model.py

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from backend.database.connection import Base

class Notificacion(Base):
    __tablename__ = 'Notificacion'

    IdNotificacion = Column(Integer, primary_key=True, autoincrement=True)
    Emision = Column(DateTime, nullable=True)
    Plazo = Column(Integer, nullable=True)
    CodExp = Column(String(50), nullable=True)
    Titular = Column(Integer, nullable=True)
    Funcionario = Column(String(50), nullable=False)
    IdTransaccion = Column(Integer, nullable=True)