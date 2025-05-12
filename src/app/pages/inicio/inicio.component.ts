import { Component, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { ProductoDTO } from '../../models/producto.dto';
import { CarritoService } from '../../services/carrito.service';
import { CarruselService } from '../../services/carrusel.service';
import { DetalleOrdenService } from '../../services/detalle-orden.service';
import { OrdenVentaService } from '../../services/orden-venta.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements AfterViewInit {


  carrito: { detalle: any, nombreProducto: string }[] = [];

  productos: ProductoDTO[] = [];
  productosAsus: ProductoDTO[] = [];
  productosIphone: ProductoDTO[] = [];
  productosSamsung: ProductoDTO[] = [];
  productosHp: ProductoDTO[] = [];

  mostrarCarrito = false;
  carritoVisible = false;

  // Añade esto en las propiedades de tu clase InicioComponent
mostrarInputDescuento: boolean = false;
codigoDescuento: string = '';
aplicandoDescuento: boolean = false; // <-- Esta es la propiedad faltante
errorDescuento: string = '';

// Añade esto en las propiedades de tu clase
descuentosValidos: { [codigo: string]: number } = {
  '11': 20,
  'DESC20': 20,
  'NAVIDAD': 15,
  'BLACKFRIDAY': 30,
  'VIP15': 15
};



  constructor(
    private productoService: ProductoService,
    private router: Router,
    private carritoService: CarritoService,
    private carruselService: CarruselService,
    private detalleOrdenService: DetalleOrdenService,
    private ordenVentaService: OrdenVentaService
  ) {}

  @HostListener('window:scroll', [])
  onScroll(): void {
    const bannerAltura = document.getElementById('banner')?.clientHeight || 0;
    this.mostrarCarrito = window.scrollY > bannerAltura;
  }

  ngAfterViewInit(): void {
    this.inicializarCarruseles();

    this.productoService.cargarProductosGenerales().subscribe({
      next: productos => {
        this.productos = productos;
        console.log('Productos cargados:', this.productos);
        this.productoService.setProductos(productos); // Guardar productos en el servicio
        
      }
    });

    // Suscribirse al método de actualizar productos para actualizar el componente automáticamente
    this.productoService.productos$.subscribe({
      next: productos => {
        this.productos = productos;
        console.log('Productos actualizados automáticamente:', this.productos);
      }
    });
    
    
  
    const ordenEnMemoria = this.ordenVentaService.getOrden();
    const ordenIdLocal = this.ordenVentaService.getOrdenIdDesdeLocalStorage();
  
    if (ordenEnMemoria) {
      this.cargarDetallesCarrito(ordenEnMemoria.id);
    } else if (ordenIdLocal) {
      this.ordenVentaService.obtenerOrdenPorId(ordenIdLocal).subscribe({
        next: ordenRecuperada => {
          this.ordenVentaService.setOrden(ordenRecuperada);
          this.cargarDetallesCarrito(ordenRecuperada.id);
        },
        error: err => console.error('Error al obtener la orden por ID:', err)
      });
    } else {
      this.ordenVentaService.crearOrdenTemporal().subscribe({
        next: nuevaOrden => {
          this.ordenVentaService.setOrden(nuevaOrden);
          this.ordenVentaService.setOrdenIdEnLocalStorage(nuevaOrden.id);
          this.cargarDetallesCarrito(nuevaOrden.id);
        },
        error: err => console.error('Error al crear orden temporal:', err)
      });
    }

     // Suscribirse al carrito observable
     this.carritoService.carrito$.subscribe(carrito => {
      this.carrito = carrito;
      console.log('Carrito actualizado:', this.carrito);
    });
  }    
  
  private inicializarCarruseles(): void {
    this.productoService.cargarProductosPorMarcaConCarrusel('asus', '.carouselAsus', '#prevBtnAsus', '#nextBtnAsus', this.carruselService)
      .subscribe({ next: productos => this.productosAsus = productos });
  
    this.productoService.cargarProductosPorMarcaConCarrusel('iphone', '.carouselIphone', '#prevBtnIphone', '#nextBtnIphone', this.carruselService)
      .subscribe({ next: productos => this.productosIphone = productos });
  
    this.productoService.cargarProductosPorMarcaConCarrusel('galaxy', '.carouselSamsung', '#prevBtnSamsung', '#nextBtnSamsung', this.carruselService)
      .subscribe({ next: productos => this.productosSamsung = productos });
  
    this.productoService.cargarProductosPorMarcaConCarrusel('hp', '.carouselHp', '#prevBtnHp', '#nextBtnHp', this.carruselService)
      .subscribe({ next: productos => this.productosHp = productos });
  
    this.carruselService.initCarruselGeneral('.carousel', '#prevBtnInicio', '#nextBtnInicio');
  }
  
  cargarDetallesCarrito(ordenId: number): void {
    this.detalleOrdenService.obtenerCarritoConProductos(ordenId).subscribe({
      next: carritoCompleto => {
        this.carrito = carritoCompleto;
        console.log('Carrito cargado correctamente:', this.carrito);
      },
      error: err => console.error('Error al cargar el carrito:', err)
    });
  }
  
  agregarAlCarrito(producto: ProductoDTO): void {
    const orden = this.ordenVentaService.getOrden();
    const ordenId = orden?.id;
  
    if (!orden || !ordenId) {
      console.error('No hay orden activa para agregar al carrito.');
      return;
    }
  
    if (producto.stock <= 0) {
      console.warn('Producto sin stock disponible.');
      return;
    }
  
    this.carritoService.agregarAlCarrito(producto).subscribe({
      next: (ok) => {
        if (ok) {
          this.cargarDetallesCarrito(ordenId);
          this.productoService.actualizarStockLocal(producto.id, 1); // Restar 1 unidad del stock local
        }
      },
      error: err => console.error('Error al agregar al carrito:', err)
    });
    
  }
    


  actualizarCarrito(): void {
    const orden = this.ordenVentaService.getOrden();
    const ordenId = orden?.id;

    if (ordenId) {
      this.cargarDetallesCarrito(ordenId);
    } else {
      console.error('No hay una orden activa para actualizar el carrito');
    }
  }

  eliminarProducto(index: number): void {
    const item = this.carrito[index];
    const ordenId = this.ordenVentaService.getOrden()?.id;
  
    const productoId = item?.detalle?.producto?.id;

    if (!ordenId || !productoId) {
      console.error('No se puede eliminar: faltan datos.');
      return;
    }

    const request = {
      productoId: productoId,
      ordenVentaId: ordenId
    };

    const cantidad = item.detalle.cantidad || 1;
    this.detalleOrdenService.eliminarDetalle(request).subscribe({
      next: () => {
        this.cargarDetallesCarrito(ordenId);
        this.productoService.restaurarStockLocal(productoId, cantidad);
      },
      error: err => console.error('Error al eliminar el producto del carrito:', err)
    });

  }


  ajustarCantidad(index: number, cambio: number): void {
    const item = this.carrito[index];
    const ordenId = this.ordenVentaService.getOrden()?.id;
    const productoId = item?.detalle?.producto?.id;
  
    if (!ordenId || !productoId) {
      console.error('Faltan datos para ajustar cantidad.');
      return;
    }
  
    const request = {
      productoId: productoId,
      ordenVentaId: ordenId
    };
  
    const llamada = cambio > 0
      ? this.detalleOrdenService.aumentarCantidad(request)
      : this.detalleOrdenService.disminuirCantidad(request);
  
      llamada.subscribe({
        next: () => {
          this.cargarDetallesCarrito(ordenId);
          if (cambio > 0) {
            this.productoService.actualizarStockLocal(productoId, 1);
          } else {
            this.productoService.restaurarStockLocal(productoId, 1);
          }
        },
        error: err => console.error('Error al ajustar cantidad:', err)
      });
      
  }
  

  toggleCarrito(): void {
    this.carritoVisible = !this.carritoVisible;
  }

  // Métodos actualizados para manejar descuentos
aplicarDescuento() {
  this.mostrarInputDescuento = true;
  // Focus al input cuando aparece
  setTimeout(() => {
    const input = document.querySelector('.discount-input');
    if (input) (input as HTMLElement).focus();
  });
}

validarDescuento() {
  console.log('[1] Iniciando validarDescuento() - Código ingresado:', this.codigoDescuento);

  if (!this.codigoDescuento.trim()) {
    this.errorDescuento = 'Por favor ingresa un código de descuento';
    console.log('[2] Validación fallida: Código vacío');
    return;
  }

  this.aplicandoDescuento = true;
  this.errorDescuento = '';

  const orden = this.ordenVentaService.getOrden();
  console.log('[3] Orden obtenida del servicio:', orden);

  if (!orden || !orden.id) {
    this.errorDescuento = 'No hay una orden activa';
    this.aplicandoDescuento = false;
    console.log('[4] Validación fallida: No hay orden activa o falta ID');
    return;
  }

  // Convertir a mayúsculas para hacer la comparación insensible a mayúsculas/minúsculas
  const codigo = this.codigoDescuento.toUpperCase().trim();
  const porcentaje = this.descuentosValidos[codigo];
  console.log('[5] Código procesado y porcentaje encontrado:', { codigo, porcentaje });

  if (porcentaje === undefined) {
    this.errorDescuento = 'Código no válido';
    this.aplicandoDescuento = false;
    console.log('[6] Validación fallida: Código no existe en descuentosValidos');
    return;
  }

  console.log('[7] Preparando para aplicar descuento:', {
    ordenId: orden.id,
    porcentajeDescuento: porcentaje
  });

  this.detalleOrdenService.aplicarDescuento(orden.id, porcentaje).subscribe({
    next: () => {
      console.log('[8] Descuento aplicado con éxito');
      this.cargarDetallesCarrito(orden.id);
      this.mostrarInputDescuento = false;
      this.codigoDescuento = '';
    },
    error: (err) => {
      console.error('[9] Error al aplicar descuento:', err);
      console.log('[10] Respuesta completa del error:', {
        status: err.status,
        error: err.error,
        message: err.message
      });
      this.errorDescuento = err.error?.message || 'Error al aplicar descuento';
    },
    complete: () => {
      console.log('[11] Operación completada (éxito o error)');
      this.aplicandoDescuento = false;
    }
  });
}
  
  pagarCarrito() {
  // Navega al componente y recarga los datos
  this.router.navigate(['/caja']).then(() => {
    window.location.reload(); // Solución simple pero efectiva
  });
}
  
  cancelarOrden(): void {
    // TODO: Lógica para cancelar la orden y limpiar el carrito
    console.log('Cancelar orden clickeado');
  }

  

  irAInicio(): void { this.router.navigate(['/inicio']); }
  irAPhone(): void { this.router.navigate(['/phone']); }
  irAGaming(): void { this.router.navigate(['/gaming']); }
  irAAccesorios(): void { this.router.navigate(['/accesorios']); }
  irALaptops(): void { this.router.navigate(['/laptops']); }

  
}
