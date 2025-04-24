import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ProductoDTO } from '../models/producto.dto';
import { DetalleOrdenDTO } from '../models/detalle-orden.dto';

interface CrearDetalleRequest {
  producto: ProductoDTO;
  ordenVentaId: number;
}

@Injectable({
  providedIn: 'root'
})
export class DetalleOrdenService {
  private apiUrl = 'http://localhost:8080/api/detalles'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  crearDetalle(request: CrearDetalleRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, request);
  }

  obtenerDetallesPorOrden(ordenId: number): Observable<DetalleOrdenDTO[]> {
    return this.http.get<DetalleOrdenDTO[]>(`${this.apiUrl}/orden/${ordenId}`);
  }
  

  obtenerCarritoConProductos(ordenId: number): Observable<{ detalle: DetalleOrdenDTO, producto: ProductoDTO }[]> {
    return this.obtenerDetallesPorOrden(ordenId).pipe(
      map(detalles =>
        detalles
          .filter(detalle => detalle.producto != null)
          .map(detalle => ({
            detalle: detalle,
            producto: detalle.producto
          }))
      )
    );
  }
}