import { OrdenVentaDTO } from "./ordenventa.dto";

export interface PagoDTO {
    id: number;
    orden: OrdenVentaDTO;
    monto: number;
    metodoPago: string;
  }