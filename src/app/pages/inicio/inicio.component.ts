import { Component, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { ProductoDTO } from '../../models/producto.dto';
import { CarritoService } from '../../services/carrito.service';
import { CarruselService } from '../../services/carrusel.service';
import { DetalleOrdenService } from '../../services/detalle-orden.service';
import { OrdenVentaService } from '../../services/orden-venta.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements AfterViewInit {

  carrito: { detalle: any, producto: ProductoDTO }[] = [];
  productos: ProductoDTO[] = [];
  productosAsus: ProductoDTO[] = [];
  productosIphone: ProductoDTO[] = [];
  productosSamsung: ProductoDTO[] = [];
  productosHp: ProductoDTO[] = [];

  mostrarCarrito = false;
  carritoVisible = false;

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
    this.productoService.cargarProductosPorMarcaConCarrusel('asus', '.carouselAsus', '#prevBtnAsus', '#nextBtnAsus', this.carruselService)
      .subscribe({ next: productos => this.productosAsus = productos });

    this.productoService.cargarProductosPorMarcaConCarrusel('iphone', '.carouselIphone', '#prevBtnIphone', '#nextBtnIphone', this.carruselService)
      .subscribe({ next: productos => this.productosIphone = productos });

    this.productoService.cargarProductosPorMarcaConCarrusel('galaxy', '.carouselSamsung', '#prevBtnSamsung', '#nextBtnSamsung', this.carruselService)
      .subscribe({ next: productos => this.productosSamsung = productos });

    this.productoService.cargarProductosPorMarcaConCarrusel('hp', '.carouselHp', '#prevBtnHp', '#nextBtnHp', this.carruselService)
      .subscribe({ next: productos => this.productosHp = productos });

    this.carruselService.initCarruselGeneral('.carousel', '#prevBtnInicio', '#nextBtnInicio');

    this.productoService.cargarProductosGenerales().subscribe({
      next: productos => this.productos = productos
    });

    let ordenId = this.ordenVentaService.getOrdenIdDesdeLocalStorage();

    if (!ordenId) {
      this.ordenVentaService.crearOrdenTemporal().subscribe({
        next: nuevaOrden => {
          ordenId = nuevaOrden.id;
          this.ordenVentaService.setOrdenIdEnLocalStorage(ordenId);
          this.cargarDetallesCarrito(ordenId);
        },
        error: err => console.error('Error al crear orden temporal:', err)
      });
    } else {
      this.cargarDetallesCarrito(ordenId);
    }
  }

  cargarDetallesCarrito(ordenId: number): void {
    this.carrito = [];

    this.detalleOrdenService.obtenerCarritoConProductos(ordenId).subscribe({
      next: carritoCompleto => {
        this.carrito = carritoCompleto;
        console.log('Carrito cargado:', this.carrito);
      },
      error: err => console.error('Error al cargar el carrito:', err)
    });
  }

  toggleCarrito(): void {
    this.carritoVisible = !this.carritoVisible;
  }

  irAInicio(): void { this.router.navigate(['/inicio']); }
  irAPhone(): void { this.router.navigate(['/phone']); }
  irAGaming(): void { this.router.navigate(['/gaming']); }
  irAAccesorios(): void { this.router.navigate(['/accesorios']); }
  irALaptops(): void { this.router.navigate(['/laptops']); }

  agregarAlCarrito(producto: ProductoDTO): void {
    let ordenId = this.ordenVentaService.getOrdenIdDesdeLocalStorage();

    if (!ordenId) {
      console.log('No hay orden activa, redirigiendo a la orden 1');
      ordenId = 1;
      this.ordenVentaService.setOrdenIdEnLocalStorage(ordenId);
      this.router.navigate(['/orden-venta', ordenId]);
    }

    this.carritoService.agregarAlCarrito(producto).subscribe({
      next: () => {
        console.log('Producto agregado correctamente');
        this.cargarDetallesCarrito(ordenId); // Opcional: recargar el carrito
      },
      error: (err) => {
        console.error('Error al agregar al carrito:', err);
      }
    });
  }
}
