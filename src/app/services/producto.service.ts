import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoDTO } from '../models/producto.dto';
import { CarruselService } from './carrusel.service';
import { CrearProductoDTO } from '../models/crearProducto.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:8080/api/productos';

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

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
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
}
