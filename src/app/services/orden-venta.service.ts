// src/app/services/orden-venta.service.ts
import { Injectable } from '@angular/core';
import { OrdenVentaDTO } from '../models/ordenventa.dto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdenVentaService {
  private apiUrl = 'http://localhost:8080/api/ordenes'; // Ajusta la URL si es diferente
  private ordenActual: OrdenVentaDTO | null = null;

  constructor(private http: HttpClient) { }

  setOrden(orden: OrdenVentaDTO): void {
    this.ordenActual = orden;
  }

  getOrden(): OrdenVentaDTO | null {
    return this.ordenActual;
  }

  obtenerOrdenPorId(id: number): Observable<OrdenVentaDTO> {
    return this.http.get<OrdenVentaDTO>(`${this.apiUrl}/${id}`);
  }
  

  limpiarOrden(): void {
    this.ordenActual = null;
  }

  getOrdenIdDesdeLocalStorage(): number | null {
    const id = localStorage.getItem('ordenId');
    return id ? parseInt(id, 10) : null;
  }

  setOrdenIdEnLocalStorage(ordenId: number): void {
    localStorage.setItem('ordenId', ordenId.toString());
  }

  limpiarOrdenId(): void {
    localStorage.removeItem('ordenId');
  }

  crearOrdenTemporal(): Observable<OrdenVentaDTO> {
    return this.http.post<OrdenVentaDTO>(`${this.apiUrl}/crear-temporal`, {});
  }

  obtenerOrdenes(): Observable<OrdenVentaDTO[]> {
    return this.http.get<OrdenVentaDTO[]>(`${this.apiUrl}/obtenerTodos`);
  }

  // Nuevo método para obtener la última orden
  obtenerUltimaOrden(): Observable<OrdenVentaDTO> {
    return this.http.get<OrdenVentaDTO>(`${this.apiUrl}/ultima`);
  }
  
}
