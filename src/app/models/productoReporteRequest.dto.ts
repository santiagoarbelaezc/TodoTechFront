// src/app/models/detalle-orden.dto.ts
import { ProductoDTO } from './producto.dto'; // si ya lo tienes creado

export interface ProductoReporteRequest {

  producto: ProductoDTO;
  cantidadVentas: number;
  valorVentas: number;
  
}
