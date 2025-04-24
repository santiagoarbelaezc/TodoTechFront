import { Injectable } from '@angular/core';
import { DetalleOrdenService } from './detalle-orden.service';
import { ProductoService } from './producto.service';
import { OrdenVentaService } from './orden-venta.service';
import { ProductoDTO } from '../models/producto.dto';
import { DetalleOrdenDTO } from '../models/detalle-orden.dto';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  carrito: { detalle: DetalleOrdenDTO, producto: ProductoDTO }[] = [];

  constructor(
    private detalleOrdenService: DetalleOrdenService,
    private productoService: ProductoService,
    private ordenVentaService: OrdenVentaService
  ) {}

  agregarAlCarrito(producto: ProductoDTO): Observable<boolean> {
    const ordenVenta = this.ordenVentaService.getOrden();

    if (!ordenVenta) {
      console.error('No hay una orden de venta activa');
      return of(false);
    }

    const request = { producto, ordenVentaId: ordenVenta.id };

    return new Observable(observer => {
      this.detalleOrdenService.crearDetalle(request).subscribe({
        next: (detalleOrden) => {
          console.log('Detalle de orden creado:', detalleOrden);

          this.productoService.obtenerProductoPorId(detalleOrden.productoId).subscribe({
            next: (productoCompleto) => {
              this.carrito.push({ detalle: detalleOrden, producto: productoCompleto });
              observer.next(true);
              observer.complete();
            },
            error: (err) => {
              console.error('Error al obtener detalles del producto:', err);
              observer.error(err);
            }
          });
        },
        error: (err) => {
          console.error('Error al crear detalle de orden:', err);
          observer.error(err);
        }
      });
    });
  }

  obtenerCarrito(): { detalle: DetalleOrdenDTO, producto: ProductoDTO }[] {
    return this.carrito;
  }
}