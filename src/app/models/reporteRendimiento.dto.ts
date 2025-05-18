// src/app/models/reporte-rendimiento.dto.ts
import { VendedorDTO } from "./vendedor.dto";

export interface ReporteRendimientoDTO {
  vendedorDTO: VendedorDTO;
  totalVentas: number;
}
