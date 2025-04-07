// src/app/models/detalle-orden.dto.ts
import { ProductoDTO } from './producto.dto'; // si ya lo tienes creado

export interface DetalleOrdenDTO {
  id: number;
  producto: ProductoDTO;
  cantidad: number;
  subtotal: number;
}
