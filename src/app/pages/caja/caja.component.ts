import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrdenVentaDTO } from '../../models/ordenventa.dto';
import { OrdenVentaService } from '../../services/orden-venta.service';
import { PagoService } from '../../services/pago.service';
import { CrearPagoDTO } from '../../models/crearPago.dto';

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CajaComponent implements OnInit {
  private _orden: OrdenVentaDTO | null = null;
  ordenes: OrdenVentaDTO[] = [];
  selectedPaymentMethod = 'No seleccionado';
  
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
    { icon: 'fa-receipt', text: 'Órdenes de Venta', active: true },
    { icon: 'fa-cash-register', text: 'Registrar Pago', active: false },
    { icon: 'fa-history', text: 'Historial de Transacciones', active: false },
    { icon: 'fa-exchange-alt', text: 'Reembolsos', active: false },
    { icon: 'fa-coins', text: 'Caja Diaria', active: false },
    { icon: 'fa-cog', text: 'Configuración', active: false }
  ];


  
  
  constructor(
    private ordenVentaService: OrdenVentaService, 
    private pagoService: PagoService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.refreshPage();
  }

  // Función para refrescar toda la página al ingresar
  refreshPage(): void {
    console.log('Refrescando datos del componente...');
    
    // Limpiar datos existentes
    this._orden = null;
    this.ordenes = [];
    this.selectedPaymentMethod = 'No seleccionado';
    this.currentOrderDetails = {
      seller: '',
      client: '',
      date: '',
      status: '',
      taxes: '',
      total: '',
      toPay: ''
    };
    
    // Forzar detección de cambios
    this.cdRef.detectChanges();
    
    // Cargar datos frescos
    this.loadInitialData();
  }

  get orden(): OrdenVentaDTO | null {
    return this._orden;
  }

  set orden(value: OrdenVentaDTO | null) {
    this._orden = value;
    this.updateOrderDetails();
    this.cdRef.detectChanges();
  }

  private loadInitialData(): void {
    const ordenMemoria = this.ordenVentaService.getOrden();
    if (ordenMemoria) {
      this.orden = ordenMemoria;
    } else {
      const id = this.ordenVentaService.getOrdenIdDesdeLocalStorage();
      if (id !== null) {
        this.ordenVentaService.obtenerOrdenPorId(id).subscribe({
          next: (orden) => {
            this.orden = orden;
            this.cdRef.detectChanges();
          },
          error: (err) => console.error('Error al recuperar la orden', err)
        });
      }
    }

    this.ordenVentaService.obtenerOrdenes().subscribe({
      next: (data) => {
        this.ordenes = data;
        this.cdRef.detectChanges();
      },
      error: (err) => console.error('Error al cargar órdenes', err)
    });
  }

  private updateOrderDetails(): void {
  if (!this._orden) {
    this.currentOrderDetails = {
      seller: '',
      client: '',
      date: '',
      status: '',
      taxes: '',
      total: '',
      toPay: ''
    };
    this.cdRef.detectChanges();
    return;
  }

  // Calcular valores como enteros
  const impuestos = Math.round(this._orden.total * 0.19);
  const totalConImpuestos = Math.round(this._orden.total + impuestos);
  
  // Función para formatear como moneda sin decimales
  const formatearValor = (valor: number) => 
    valor.toLocaleString('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

  this.currentOrderDetails = {
    seller: this._orden.vendedor?.nombre ?? '',
    client: this._orden.cliente?.nombre ?? '',
    date: this._orden.fecha,
    status: this._orden.estado,
    taxes: formatearValor(impuestos),
    total: formatearValor(Math.round(this._orden.total)),
    toPay: formatearValor(totalConImpuestos)
  };

  this.cdRef.detectChanges();
}

  // ... (resto de métodos se mantienen igual)
  selectItem(selectedItem: { icon: string; text: string; active: boolean }) {
    this.menuItems.forEach(item => item.active = false);
    selectedItem.active = true;
    this.cdRef.detectChanges();
  }

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
    this.cdRef.detectChanges();
  }

  cancelOrder(): void {
    if (confirm('¿Está seguro que desea cancelar la orden?')) {
      this.ordenVentaService.limpiarOrden();
      this.ordenVentaService.limpiarOrdenId();
      this.orden = null;
      alert('Orden cancelada');
      this.cdRef.detectChanges();
    }
  }

  processPayment(): void {
  this.ordenVentaService.obtenerUltimaOrden().subscribe({
    next: (ultimaOrden) => {
      console.log('Última orden recibida:', ultimaOrden);
      
      if (!ultimaOrden?.id) {
        throw new Error('Orden no tiene ID válido');
      }

      if (this.selectedPaymentMethod === 'No seleccionado') {
        alert('Por favor seleccione un método de pago');
        return;
      }

      // Redondear valores a enteros
      const montoRedondeado = Math.round(ultimaOrden.total * 1.19);
      
      const pagoData = {
        ordenId: ultimaOrden.id,
        monto: montoRedondeado, // Usamos el valor redondeado
        metodoPago: this.mapMetodoPagoToEnum(this.selectedPaymentMethod)
      };

      console.log('Enviando pago:', pagoData);

      this.pagoService.crearPago(pagoData).subscribe({
        next: (respuesta) => {
          alert(`Pago exitoso: ${respuesta.mensaje}`);
          this.resetAfterPayment();
        },
        error: (error) => {
          console.error('Error en el pago:', error);
          alert('Error al procesar el pago');
        }
      });
    },
    error: (error) => {
      console.error('Error al obtener última orden:', error);
      alert('No se pudo obtener la orden para procesar el pago');
    }
  });
}

private resetAfterPayment(): void {
  this.orden = null;
  this.selectedPaymentMethod = 'No seleccionado';
  this.cdRef.detectChanges();
}

private handlePaymentError(error: any): void {
  if (error.error.includes('ORA-01400')) {
    alert('Error: El ID de la orden no fue enviado correctamente al servidor');
  } else {
    alert('Error al procesar el pago. Por favor intente nuevamente.');
  }
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
        return 'EFECTIVO';
    }
  }
}