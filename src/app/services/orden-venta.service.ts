import { Injectable } from '@angular/core';
import { OrdenVentaDTO, EstadoOrden } from '../models/ordenventa.dto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdenVentaService {
  private apiUrl = 'https://todotechshopprojectsoftware.onrender.com/api/ordenes';
  private ordenActual: OrdenVentaDTO | null = null;

  constructor(private http: HttpClient) { }

  // Métodos existentes
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

  obtenerUltimaOrden(): Observable<OrdenVentaDTO> {
    return this.http.get<OrdenVentaDTO>(`${this.apiUrl}/ultima`);
  }

  // Nuevos métodos para los filtros
  obtenerOrdenesPorFecha(): Observable<OrdenVentaDTO[]> {
    return this.http.get<OrdenVentaDTO[]>(`${this.apiUrl}/por-fecha`);
  }

  obtenerOrdenesPorValor(): Observable<OrdenVentaDTO[]> {
    return this.http.get<OrdenVentaDTO[]>(`${this.apiUrl}/por-valor`);
  }

  obtenerOrdenesPorEstado(estado: EstadoOrden): Observable<OrdenVentaDTO[]> {
    return this.http.get<OrdenVentaDTO[]>(`${this.apiUrl}/estado/${estado}`);
  }

  // Métodos específicos para los estados comunes
  obtenerOrdenesPagadas(): Observable<OrdenVentaDTO[]> {
    return this.obtenerOrdenesPorEstado('PAGADA');
  }

  obtenerOrdenesPendientes(): Observable<OrdenVentaDTO[]> {
    return this.obtenerOrdenesPorEstado('PENDIENTE');
  }

  obtenerOrdenesDespachadas(): Observable<OrdenVentaDTO[]> {
    return this.obtenerOrdenesPorEstado('DESPACHADA');
  }

  obtenerOrdenesCerradas(): Observable<OrdenVentaDTO[]> {
    return this.obtenerOrdenesPorEstado('CERRADA');
  }

  // Método para crear una orden completa
  crearOrden(ordenData: any): Observable<OrdenVentaDTO> {
    return this.http.post<OrdenVentaDTO>(`${this.apiUrl}/crear`, ordenData);
  }
}