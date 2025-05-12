import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval, switchMap } from 'rxjs';
import { ProductoDTO } from '../models/producto.dto';
import { CarruselService } from './carrusel.service';
import { CrearProductoDTO } from '../models/crearProducto.dto';
import { ProductoReporteRequest } from '../models/productoReporteRequest.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  // private apiUrl = 'http://localhost:8080/api/productos'; // URL de la API
  private apiUrl = 'http://localhost:8080/api/productos';
  private productosSubject = new BehaviorSubject<ProductoDTO[]>([]);
  public productos$ = this.productosSubject.asObservable(); // Exponemos el observable

  private productos: ProductoDTO[] = []; // Almacena los productos obtenidos de la API

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<ProductoDTO[]> {
    return this.http.get<ProductoDTO[]>(this.apiUrl);
  }

  obtenerProductosPorMarca(marca: string): Observable<ProductoDTO[]> {
    return this.http.get<ProductoDTO[]>(`${this.apiUrl}/marca/${marca}`);
  }

  obtenerProductoPorId(id: number): Observable<ProductoDTO> {
    return this.http.get<ProductoDTO>(`${this.apiUrl}/productos/${id}`);
  }

  eliminarProducto(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/eliminar/${id}`);
}

  cargarProductosGenerales(): Observable<ProductoDTO[]> {
    return this.obtenerProductos();
  }

  crearProducto(producto: CrearProductoDTO): Observable<CrearProductoDTO> {
    return this.http.post<CrearProductoDTO>(`${this.apiUrl}/crear`, producto);
  }

  cargarProductosPorMarcaConCarrusel(
    marca: string,
    carruselSelector: string,
    prevBtn: string,
    nextBtn: string,
    carruselService: CarruselService
  ): Observable<ProductoDTO[]> {
    return new Observable(observer => {
      this.obtenerProductosPorMarca(marca).subscribe({
        next: productos => {
          observer.next(productos);
          setTimeout(() => carruselService.initCarruselGeneral(carruselSelector, prevBtn, nextBtn), 0);
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }

  // Método original
  actualizarProductos(productos: ProductoDTO[]): void {
    this.productosSubject.next(productos);
  }

  

  iniciarActualizacionPeriodica(): void {
    interval(5000)
      .pipe(switchMap(() => this.obtenerProductos()))
      .subscribe({
        next: productos => this.productosSubject.next(productos),
        error: err => console.error('Error en actualización periódica de productos:', err)
      });
  }

  setProductos(productos: ProductoDTO[]): void {
    this.productos = productos;
    this.productosSubject.next(this.productos); // emite para que el componente se actualice
  }
  
  actualizarStockLocal(productoId: number, cantidad: number): void {
    const index = this.productos.findIndex(p => p.id === productoId);
    if (index !== -1 && this.productos[index].stock > 0) {
      this.productos[index].stock -= cantidad;
      this.productosSubject.next([...this.productos]); // emite nuevo array
    }
  }
  
  restaurarStockLocal(productoId: number, cantidad: number): void {
    const index = this.productos.findIndex(p => p.id === productoId);
    if (index !== -1) {
      this.productos[index].stock += cantidad;
      this.productosSubject.next([...this.productos]); // emite nuevo array
    }
  }
  

  obtenerProductosActualizados(): void {
    this.obtenerProductos().subscribe({
      next: productos => this.productosSubject.next(productos),
      error: err => console.error('Error al obtener productos:', err)
    });
  }

  // Método para obtener el stock de un producto por su ID
  obtenerStockPorId(id: number): Observable<number> {
    return this.http.get<ProductoDTO>(`${this.apiUrl}/productos/${id}`).pipe(
      switchMap(producto => {
        if (producto) {
          return new Observable<number>(observer => {
            observer.next(producto.stock);
            observer.complete();
          });
        } else {
          throw new Error('Producto no encontrado');
        }
      })
    );
  }


  obtenerReporteVentas(): Observable<ProductoReporteRequest[]> {
  return this.http.get<ProductoReporteRequest[]>(`${this.apiUrl}/reporte/ventas`);
}


}
  