import { Component, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { ProductoDTO } from '../../models/producto.dto';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements AfterViewInit {

  productos: ProductoDTO[] = [];

  mostrarCarrito = false;
  carritoVisible = false;

  constructor(private productoService: ProductoService, private router: Router) {}

  @HostListener('window:scroll', [])
  onScroll(): void {
    const bannerAltura = document.getElementById('banner')?.clientHeight || 0;
    this.mostrarCarrito = window.scrollY > bannerAltura;
  }

  ngAfterViewInit(): void {
    this.initCarousel('.carousel', '#prevBtn', '#nextBtn');
    this.initCarousel('.carouselCelulares', '#prevBtnCel', '#nextBtnCel');

    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
        console.log('Productos cargados:', this.productos);
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  toggleCarrito(): void {
    this.carritoVisible = !this.carritoVisible;
  }

  irAInicio(): void {
    this.router.navigate(['/inicio']);
  }

  irAPhone(): void {
    this.router.navigate(['/phone']);
  }

  irAGaming(): void {
    this.router.navigate(['/gaming']);
  }

  irAAccesorios(): void {
    this.router.navigate(['/accesorios']);
  }

  irALaptops(): void {
    this.router.navigate(['/laptops']);
  }

  private initCarousel(carouselSelector: string, prevBtnSelector: string, nextBtnSelector: string): void {
    const carousel = document.querySelector(carouselSelector) as HTMLElement;
    const prevBtn = document.querySelector(prevBtnSelector) as HTMLElement;
    const nextBtn = document.querySelector(nextBtnSelector) as HTMLElement;

    if (!carousel || !prevBtn || !nextBtn) return;

    let index = 0;
    const items = carousel.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    const visibleItems = 3;
    const itemWidth = items[0].clientWidth + 20;

    function updateCarousel() {
      const offset = -index * itemWidth;
      carousel.style.transform = `translateX(${offset}px)`;
    }

    nextBtn.addEventListener('click', () => {
      if (index < totalItems - visibleItems) {
        index++;
        updateCarousel();
      }
    });

    prevBtn.addEventListener('click', () => {
      if (index > 0) {
        index--;
        updateCarousel();
      }
    });

    updateCarousel();
  }
}
