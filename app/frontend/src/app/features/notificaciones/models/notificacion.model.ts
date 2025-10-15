export interface Notificacion {
  IdNotificacion: number;
  IdTransaccion: number;
  alertas?: Alerta[];
}

export interface Alerta {
  idAlerta: number;
  IdTransaccion: number;
  Estado: string;
  // Otros campos según el modelo de alerta
}