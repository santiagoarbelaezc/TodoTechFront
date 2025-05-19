import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearPagoDTO } from '../models/crearPago.dto';
import { PagoDTO } from '../models/pago.dto';


@Injectable({
  providedIn: 'root',
})
export class PagoService {
  private apiUrl = 'https://todotechshopprojectsoftware.onrender.com/api/pagos';

  constructor(private http: HttpClient) {}

  listarPagos(): Observable<PagoDTO[]> {
    return this.http.get<PagoDTO[]>(this.apiUrl);
  }

  crearPago(pago: CrearPagoDTO): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/crear`, pago);
  }

  obtenerPagoPorId(id: number): Observable<PagoDTO> {
    return this.http.get<PagoDTO>(`${this.apiUrl}/${id}`);
  }

  eliminarPago(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/eliminar/${id}`, { responseType: 'text' });
  }
}
