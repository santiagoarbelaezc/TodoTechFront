// src/app/services/orden-venta.service.ts
import { Injectable } from '@angular/core';
import { OrdenVentaDTO } from '../models/ordenventa.dto';

@Injectable({
  providedIn: 'root'
})
export class OrdenVentaService {
  private ordenActual: OrdenVentaDTO | null = null;

  setOrden(orden: OrdenVentaDTO): void {
    this.ordenActual = orden;
  }

  getOrden(): OrdenVentaDTO | null {
    return this.ordenActual;
  }

  limpiarOrden(): void {
    this.ordenActual = null;
  }
}
