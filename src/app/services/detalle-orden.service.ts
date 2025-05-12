import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ProductoDTO } from '../models/producto.dto';
import { DetalleOrdenDTO } from '../models/detalle-orden.dto';
import { AplicarDescuentoRequestDTO } from '../models/aplicarDescuentoRequest.dto';

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

  aumentarCantidad(request: { productoId: number, ordenVentaId: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/aumentar-cantidad`, request);
  }
  
  disminuirCantidad(request: { productoId: number, ordenVentaId: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/disminuir-cantidad`, request);
  }
  
  eliminarDetalle(request: { productoId: number, ordenVentaId: number }): Observable<any> {
    return this.http.request('delete', `${this.apiUrl}/eliminar`, { body: request, responseType: 'text' }).pipe(
      map(response => JSON.parse(response)) // Analizar la respuesta como JSON
    );
  }

  aplicarDescuento(ordenVentaId: number, porcentajeDescuento: number): Observable<any> {
  const body: AplicarDescuentoRequestDTO = {
        ordenVentaId: ordenVentaId,       // Nombre exacto que espera el backend
        porcentajeDescuento: porcentajeDescuento  // Nombre exacto que espera el backend
    };
  
  return this.http.post(`${this.apiUrl}/aplicar-descuento`, body);
}

  
  
  obtenerCarritoConProductos(ordenId: number): Observable<{ detalle: DetalleOrdenDTO, nombreProducto: string }[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orden/${ordenId}`).pipe(
      map(detalles => detalles.map(d => ({
        detalle: d,
        nombreProducto: d.producto?.nombre || 'Desconocido'
      })))
    );
  }
  
  
}