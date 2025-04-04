import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orden-venta',
  templateUrl: './orden-venta.component.html',
  styleUrls: ['./orden-venta.component.css']
})
export class OrdenVentaComponent implements OnInit {
  fechaHora: string = '';

  ngOnInit(): void {
    this.actualizarFechaHora();
    setInterval(() => this.actualizarFechaHora(), 1000);
  }

  actualizarFechaHora(): void {
    const ahora = new Date();
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    this.fechaHora = ahora.toLocaleDateString('es-ES', opciones);
  }

  onSubmit(): void {
    // Lógica para procesar la orden de venta
    console.log('Orden de venta creada');
  }
}
