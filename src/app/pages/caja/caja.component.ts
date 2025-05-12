import { CommonModule } from '@angular/common';
import { 
  ChangeDetectionStrategy, 
  ChangeDetectorRef, 
  Component, 
  OnInit 
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrdenVentaDTO } from '../../models/ordenventa.dto';
import { OrdenVentaService } from '../../services/orden-venta.service';
import { PagoService } from '../../services/pago.service';
import { CrearPagoDTO, MetodoPago} from '../../models/crearPago.dto';

interface MenuItem {
  icon: string;
  text: string;
  active: boolean;
}

interface CardDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
  referenceNumber?: string;  // Nuevo campo
  securityCode?: string;    // Nuevo campo
}

interface OrderDetails {
  seller: string;
  client: string;
  date: string;
  status: string;
  taxes: string;
  total: string;
  toPay: string;
}

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
  selectedPaymentMethod: string = 'No seleccionado';
  
  cardDetails: CardDetails = {
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  };

  showCardForm: boolean = false;
  cardFormValid: boolean = false;
  
  currentOrderDetails: OrderDetails = {
    seller: '',
    client: '',
    date: '',
    status: '',
    taxes: '',
    total: '',
    toPay: ''
  };

  menuItems: MenuItem[] = [
    { icon: 'fa-receipt', text: 'Órdenes de Venta', active: true },
    { icon: 'fa-cash-register', text: 'Registrar Pago', active: false },
    { icon: 'fa-history', text: 'Historial de Transacciones', active: false },
    { icon: 'fa-exchange-alt', text: 'Reembolsos', active: false },
    { icon: 'fa-coins', text: 'Caja Diaria', active: false },
    { icon: 'fa-cog', text: 'Configuración', active: false }
  ];

  cashAmount: number = 0;
  changeAmount: number = 0;
  
  constructor(
    private ordenVentaService: OrdenVentaService, 
    private pagoService: PagoService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.refreshPage();
  }

  // Main refresh function
  refreshPage(): void {
    this.resetComponentState();
    this.loadInitialData();
  }

  private resetComponentState(): void {
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
    this.cashAmount = 0;
    this.changeAmount = 0;
    this.resetCardForm();
    this.cdRef.detectChanges();
  }

  private resetCardForm(): void {
  this.cardDetails = {
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
    referenceNumber: '',
    securityCode: ''
  };
  this.showCardForm = false;
  this.cardFormValid = false;
}

  get orden(): OrdenVentaDTO | null {
    return this._orden;
  }

  set orden(value: OrdenVentaDTO | null) {
    this._orden = value;
    this.updateOrderDetails();
  }

  private loadInitialData(): void {
    this.loadOrderFromMemoryOrStorage();
    this.loadAllOrders();
  }

  private loadOrderFromMemoryOrStorage(): void {
    const ordenMemoria = this.ordenVentaService.getOrden();
    if (ordenMemoria) {
      this.orden = ordenMemoria;
    } else {
      const id = this.ordenVentaService.getOrdenIdDesdeLocalStorage();
      if (id !== null) {
        this.ordenVentaService.obtenerOrdenPorId(id).subscribe({
          next: (orden) => {
            this.orden = orden;
          },
          error: (err) => console.error('Error al recuperar la orden', err)
        });
      }
    }
  }

  private loadAllOrders(): void {
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

    const impuestos = Math.round(this._orden.total * 0.19);
    const totalConImpuestos = Math.round(this._orden.total + impuestos);
    
    this.currentOrderDetails = {
      seller: this._orden.vendedor?.nombre ?? 'No asignado',
      client: this._orden.cliente?.nombre ?? 'Cliente no registrado',
      date: this._orden.fecha,
      status: this._orden.estado,
      taxes: this.formatCurrency(impuestos),
      total: this.formatCurrency(Math.round(this._orden.total)),
      toPay: this.formatCurrency(totalConImpuestos)
    };

    this.cdRef.detectChanges();
  }

  private formatCurrency(value: number): string {
    return value.toLocaleString('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  selectItem(selectedItem: MenuItem): void {
    this.menuItems.forEach(item => item.active = false);
    selectedItem.active = true;
    this.cdRef.detectChanges();
  }

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
    this.showCardForm = ['Visa', 'MasterCard', 'Visa Débito'].includes(method);
    
    // Reset cash-related fields when not using cash
    if (method !== 'Efectivo') {
      this.cashAmount = 0;
      this.changeAmount = 0;
    }
    
    if (this.showCardForm) {
      this.validateCardForm();
    }
    
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
    if (!this.validatePaymentPreconditions()) {
      return;
    }

    this.ordenVentaService.obtenerUltimaOrden().subscribe({
      next: (ultimaOrden) => this.processOrderPayment(ultimaOrden),
      error: (error) => this.handleOrderRetrievalError(error)
    });
  }

 private validatePaymentPreconditions(): boolean {
  if (this.selectedPaymentMethod === 'No seleccionado') {
    alert('Por favor seleccione un método de pago');
    return false;
  }

  if (this.showCardForm && !this.cardFormValid) {
    alert('Por favor complete correctamente todos los datos de pago con tarjeta');
    return false;
  }

  return true;
}

  private processOrderPayment(ultimaOrden: OrdenVentaDTO | null): void {
    if (!ultimaOrden?.id) {
      alert('No se encontró la orden de venta');
      return;
    }

    const montoConIva = Math.round(ultimaOrden.total * 1.19);

    if (this.selectedPaymentMethod === 'Efectivo') {
      if (!this.validateCashPayment(montoConIva)) {
        return;
      }
      this.changeAmount = this.cashAmount - montoConIva;
      this.cdRef.detectChanges();
    }

   const pagoData: CrearPagoDTO & { detallesTarjeta?: any } = {
  ordenId: ultimaOrden.id,
  monto: montoConIva,
  metodoPago: this.mapMetodoPagoToEnum(this.selectedPaymentMethod),
  detallesTarjeta: this.showCardForm ? {
    numero: this.cardDetails.cardNumber,
    nombreTitular: this.cardDetails.cardName,
    fechaExpiracion: this.cardDetails.expiryDate,
    cvv: this.cardDetails.cvv
  } : undefined
};

    this.pagoService.crearPago(pagoData).subscribe({
      next: (respuesta) => this.handlePaymentSuccess(respuesta.mensaje),
      error: (error) => this.handlePaymentError(error)
    });
  }

  private validateCashPayment(montoConIva: number): boolean {
    if (this.cashAmount === null || this.cashAmount === undefined || this.cashAmount <= 0) {
      alert('Debe ingresar el monto en efectivo recibido');
      return false;
    }

    if (this.cashAmount < montoConIva) {
      const faltante = montoConIva - this.cashAmount;
      alert(`Monto insuficiente. Faltan ${this.formatCurrency(faltante)}`);
      this.changeAmount = 0;
      return false;
    }

    return true;
  }

  private handlePaymentSuccess(message: string): void {
    alert(`Pago exitoso: ${message}\nCambio: ${this.formatCurrency(this.changeAmount)}`);
    this.resetAfterPayment();
  }

  private handleOrderRetrievalError(error: any): void {
    console.error('Error al obtener última orden:', error);
    alert('No se pudo obtener la orden para procesar el pago');
  }

  private handlePaymentError(error: any): void {
    if (error.error?.includes?.('ORA-01400')) {
      alert('Error: El ID de la orden no fue enviado correctamente al servidor');
    } else {
      alert(`Error al procesar el pago: ${error.error?.message || 'Por favor intente nuevamente.'}`);
    }
  }

  private resetAfterPayment(): void {
    this.orden = null;
    this.selectedPaymentMethod = 'No seleccionado';
    this.cashAmount = 0;
    this.changeAmount = 0;
    this.resetCardForm();
    this.cdRef.detectChanges();
  }

  private mapMetodoPagoToEnum(metodo: string): MetodoPago {
  switch (metodo) {
    case 'Visa':
    case 'MasterCard':
    case 'Visa Débito':
    case 'PayPal':
      return MetodoPago.TARJETA_BANCARIA; // Usar el enum directamente
    case 'RedCompra':
      return MetodoPago.REDCOMPRA;
    case 'Efectivo':
      return MetodoPago.EFECTIVO;
    default:
      return MetodoPago.EFECTIVO;
  }
}
  validateCardForm(): void {
  const cardNumberValid = this.cardDetails.cardNumber.trim().length > 0;
  const cardNameValid = this.cardDetails.cardName.trim().length > 0;

  this.cardFormValid = cardNumberValid && cardNameValid;
  this.cdRef.detectChanges();
}


  calculateChange(): void {
    if (!this._orden || this.cashAmount <= 0) {
      this.changeAmount = 0;
      this.cdRef.detectChanges();
      return;
    }

    const iva = this._orden.total * 0.19;
    const totalConIva = this._orden.total + iva;
    this.changeAmount = Math.max(0, Math.round(this.cashAmount - totalConIva));
    
    this.cdRef.detectChanges();
  }

  onPaymentMethodChange(method: string): void {
    this.selectedPaymentMethod = method;
    this.showCardForm = ['Visa', 'MasterCard', 'Visa Débito'].includes(method);
    this.validateCardForm();
    this.cdRef.detectChanges();
  }
}