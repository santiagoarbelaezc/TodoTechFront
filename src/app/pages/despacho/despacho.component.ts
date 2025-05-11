import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrdenVentaDTO } from '../../models/ordenventa.dto';

@Component({
  selector: 'app-despacho',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './despacho.component.html',
  styleUrl: './despacho.component.css'
})
export class DespachoComponent implements OnInit {
  ordenes: OrdenVentaDTO[] = [];
  ordenSeleccionada: OrdenVentaDTO | null = null;
  mostrarMensajeria = false;
  metodoDespacho = '';
  empresaMensajeria = 'servientrega';
  numeroGuia = '';
  fechaDespacho = '';
  codigoRastreo = '';
  estadoRastreo = false;
  eventosRastreo: any[] = [];

  currentOrderDetails = {
    seller: '',
    client: '',
    date: '',
    status: '',
    taxes: '',
    total: '',
    toPay: ''
  };

  menuItems = [
    { icon: 'fa-truck', text: 'Despachos Pendientes', active: true },
    { icon: 'fa-map-marker-alt', text: 'Rastrear Pedidos', active: false },
    { icon: 'fa-history', text: 'Historial de Despachos', active: false }
  ];

  constructor() {}

  ngOnInit(): void {
    // Cargar órdenes pendientes de despacho
    this.cargarOrdenes();
  }

  cargarOrdenes(): void {
    // Lógica para cargar órdenes pendientes de despacho
  }

  seleccionarOrden(orden: OrdenVentaDTO): void {
    this.ordenSeleccionada = orden;
  }

  mostrarCamposMensajeria(mostrar: boolean): void {
    this.mostrarMensajeria = mostrar;
  }

  selectItem(item: { icon: string; text: string; active: boolean }): void {
    this.menuItems.forEach(i => i.active = false);
    item.active = true;
}

  rastrearPedido(): void {
    if (this.codigoRastreo) {
      // Lógica para consultar estado de rastreo
      this.estadoRastreo = true;
      this.eventosRastreo = [
        { fecha: '2023-05-01 10:00', descripcion: 'Pedido recibido', estado: 'Recibido' },
        { fecha: '2023-05-02 09:30', descripcion: 'En tránsito', estado: 'En camino' },
        { fecha: '2023-05-03 14:15', descripcion: 'En reparto', estado: 'En reparto' }
      ];
    }
  }

  confirmarDespacho(): void {
    if (this.metodoDespacho === 'mensajeria' && !this.numeroGuia) {
      alert('Por favor ingrese el número de guía');
      return;
    }
    
    // Lógica para confirmar despacho
    alert('Despacho confirmado exitosamente');
  }

  cancelarDespacho(): void {
    if (confirm('¿Está seguro que desea cancelar este despacho?')) {
      // Lógica para cancelar despacho
      alert('Despacho cancelado');
    }
  }
}