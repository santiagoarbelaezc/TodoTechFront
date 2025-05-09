import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReporteRendimientoDTO } from '../models/reporteRendimiento.dto'; // Asegúrate de ajustar la ruta según tu estructura de carpetas

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private baseUrl = 'http://localhost:8080/api/vendedores'; // Base URL de la API

  constructor(private http: HttpClient) { }

  // Método reutilizable para hacer GET a cualquier endpoint dentro de la API
  private obtenerDesdeApi<T>(ruta: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${ruta}`);
  }

  // Método específico para obtener el reporte de rendimiento
  obtenerReporteRendimiento(): Observable<ReporteRendimientoDTO[]> {
    return this.obtenerDesdeApi<ReporteRendimientoDTO[]>('/reporteRendimiento');
  }

    // Método específico para obtener el reporte de rendimiento por vendedor

}
