import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { OrdenVentaDTO } from '../../models/ordenventa.dto';
import { OrdenVentaService } from '../../services/orden-venta.service';
import { PagoService } from '../../services/pago.service';


@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit {

  orden: OrdenVentaDTO | null = null;
  ordenes: OrdenVentaDTO[] = [];
  selectedPaymentMethod = 'No seleccionado';

  menuItems = [
    { icon: 'fa-receipt', text: 'Órdenes de Venta', active: true },
    { icon: 'fa-cash-register', text: 'Registrar Pago', active: false },
    { icon: 'fa-history', text: 'Historial de Transacciones', active: false },
    { icon: 'fa-exchange-alt', text: 'Reembolsos', active: false },
    { icon: 'fa-coins', text: 'Caja Diaria', active: false },
    { icon: 'fa-cog', text: 'Configuración', active: false }
  ];

  constructor(private ordenVentaService: OrdenVentaService, private pagoService: PagoService,
    private cdRef: ChangeDetectorRef // Inyección de ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.orderDetails;

    const ordenMemoria = this.ordenVentaService.getOrden();
    if (ordenMemoria) {
      this.orden = ordenMemoria;
    } else {
      const id = this.ordenVentaService.getOrdenIdDesdeLocalStorage();
      if (id !== null) {
        this.ordenVentaService.obtenerOrdenPorId(id).subscribe({
          next: (orden) => this.orden = orden,
          error: (err) => console.error('Error al recuperar la orden', err)
        });
      }
    }

    this.ordenVentaService.obtenerOrdenes().subscribe({
      next: (data) => {
        console.log('Órdenes cargadas:', data);
        this.ordenes = data;
      },
      error: (err) => console.error('Error al cargar órdenes', err)
    });
  }

  get orderDetails() {
  if (!this.orden) {
    return {
      seller: '',
      client: '',
      date: '',
      status: '',
      taxes: '',
      total: '',
      toPay: ''
    };
  }

  const impuestos = this.orden.total * 0.19;
  const totalConImpuestos = this.orden.total + impuestos;

  // Formatear los valores a moneda con separador de miles
  const formatearValor = (valor: number) => valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

  return {
    seller: this.orden.vendedor?.nombre ?? '',
    client: this.orden.cliente?.nombre ?? '',
    date: this.orden.fecha,
    status: this.orden.estado,
    taxes: formatearValor(impuestos),
    total: formatearValor(this.orden.total),
    toPay: formatearValor(totalConImpuestos)
  };
}

  selectItem(selectedItem: { icon: string; text: string; active: boolean }) {
    this.menuItems.forEach(item => item.active = false);
    selectedItem.active = true;
  }

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
  }

  cancelOrder(): void {
    if (confirm('¿Está seguro que desea cancelar la orden?')) {
      this.ordenVentaService.limpiarOrden();
      this.ordenVentaService.limpiarOrdenId();
      this.orden = null;
      alert('Orden cancelada');
    }
  }

  processPayment(): void {
  if (!this.orden) {
    alert('No hay orden seleccionada');
    return;
  }

  if (this.selectedPaymentMethod === 'No seleccionado') {
    alert('Por favor seleccione un método de pago');
    return;
  }

  const metodoPagoEnum = this.mapMetodoPagoToEnum(this.selectedPaymentMethod);

  const crearPagoDTO = {
    orden: this.orden,
    monto: this.orden.total * 1.19,
    metodoPago: metodoPagoEnum
  };

  this.pagoService.crearPago(crearPagoDTO).subscribe({
    next: (respuesta) => {
      alert(respuesta.mensaje);
      console.log('Pago creado:', respuesta);

      // ✅ Limpiar formulario
      this.orden = null;
      this.selectedPaymentMethod = 'No seleccionado';

      // Si usas un formulario reactivo:
      // this.formularioPago.reset();

    },
    error: (error) => {
      console.error('Error al crear el pago:', error);
      alert('Error al procesar el pago');
    }
  });
  }



  private mapMetodoPagoToEnum(metodo: string): string {
  switch (metodo) {
    case 'Visa':
    case 'MasterCard':
    case 'Visa Débito':
    case 'PayPal':
      return 'TARJETA_BANCARIA';
    case 'RedCompra':
      return 'REDCOMPRA';
    case 'Efectivo':
      return 'EFECTIVO';
    default:
      return 'EFECTIVO'; // Valor por defecto o puedes lanzar un error
  }
}

}
