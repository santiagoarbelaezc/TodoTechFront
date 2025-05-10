import { OrdenVentaDTO } from "./ordenventa.dto";

export interface CrearPagoDTO {
    orden: OrdenVentaDTO;
    monto: number;
    metodoPago: string;
  }