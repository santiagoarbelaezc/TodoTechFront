// crearPago.dto.ts
import { OrdenVentaDTO } from "./ordenventa.dto";

export interface CrearPagoDTO {
  ordenId: number;
  monto: number;
  metodoPago: string;
}