// Escenas de seguridad del modo presentador. Solo se escenifican.
export const SECURITY_MESSAGES = {
  screenshot: 'Código caducado, escanea el QR en directo',
  farAway: (km: string) => `Tienes que estar en el coche con el conductor (a ${km})`,
  repeated: 'Hoy ya has sido copiloto',
  smallRefuel: (minLiters: number) => `Mínimo ${minLiters} L para aplicar el pase`,
  expired: 'Caducado',
  locked: 'Se desbloquea cuando tu conductor reposte',
  noQr: 'Tu conductor aún no ha generado el QR',
  passFull: 'El coche ya está lleno: máximo de copilotos alcanzado',
};
export const FAR_AWAY_KM = 2.3;
export const SMALL_REFUEL_LITERS = 8;
export const AI_ALERT_PASS = 'P-8812';
