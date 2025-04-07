// src/app/models/ordenventa.dto.ts
import { ClienteDTO } from './cliente.dto';
import { VendedorDTO } from './vendedor.dto';
import { DetalleOrdenDTO } from './detalle-orden.dto';

export type EstadoOrden = 'PENDIENTE' | 'PAGADA' | 'DESPACHADA' | 'CERRADA';

export interface OrdenVentaDTO {
  id: number;
  fecha: string; // o Date si lo manejas como objeto Date en Angular
  cliente: ClienteDTO;
  vendedor: VendedorDTO;
  productos: DetalleOrdenDTO[];
  estado: EstadoOrden;
  total: number;
}
