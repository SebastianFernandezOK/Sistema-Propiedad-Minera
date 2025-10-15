from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.models.transaccion_model import Transaccion
from backend.schemas.transaccion_schema import TransaccionCreate, TransaccionUpdate
from typing import List, Optional, Dict, Any

class TransaccionRepositorie:
    def __init__(self, db: Session):
        self.db = db

    def get(self, id_transaccion: int) -> Optional[Transaccion]:
        return self.db.query(Transaccion).filter(Transaccion.IdTransaccion == id_transaccion).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Transaccion]:
        return self.db.query(Transaccion).offset(skip).limit(limit).all()

    def create(self, transaccion: TransaccionCreate) -> Transaccion:
        db_obj = Transaccion(**transaccion.model_dump())
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def update(self, id_transaccion: int, transaccion) -> Optional[Transaccion]:
        db_obj = self.get(id_transaccion)
        if not db_obj:
            return None
        # Permitir dict o Pydantic
        update_data = transaccion.model_dump(exclude_unset=True) if hasattr(transaccion, 'model_dump') else transaccion
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def delete(self, id_transaccion: int) -> bool:
        db_obj = self.get(id_transaccion)
        if not db_obj:
            return False
        self.db.delete(db_obj)
        self.db.commit()
        return True

    def get_informacion_transaccion(self, tabla: str, id_transaccion: int) -> List[Dict[str, Any]]:
        """
        Ejecuta el procedure InformacionTransaccion para obtener información de transacciones
        """
        try:
            # Ejecutar el stored procedure
            sql = text("EXEC InformacionTransaccion :tabla, :id_transaccion")
            result = self.db.execute(sql, {"tabla": tabla, "id_transaccion": id_transaccion})
            
            # Convertir resultados a lista de diccionarios
            columns = result.keys()
            rows = result.fetchall()
            
            return [dict(zip(columns, row)) for row in rows]
        except Exception as e:
            # En caso de error, retornar lista vacía y loggear el error si es necesario
            print(f"Error ejecutando procedure InformacionTransaccion: {e}")
            return []
