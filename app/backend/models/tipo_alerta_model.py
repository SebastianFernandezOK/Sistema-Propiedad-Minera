class TipoAlerta:
    def __init__(self, id_tipo_alerta: int, nombre: str, descripcion: str = ""):
        self.id_tipo_alerta = id_tipo_alerta
        self.nombre = nombre
        self.descripcion = descripcion

    def to_dict(self):
        return {
            "id_tipo_alerta": self.id_tipo_alerta,
            "nombre": self.nombre,
            "descripcion": self.descripcion
        }