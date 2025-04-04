import { Component, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-accesorios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accesorios.component.html',
  styleUrl: './accesorios.component.css'
})
export class AccesoriosComponent implements AfterViewInit {

  mostrarCarrito = false; // Controla si el carrito aparece al bajar
  carritoVisible = false; // Controla si el carrito está desplegado

  constructor(private router: Router) {} // Inyectar el Router

  @HostListener('window:scroll', [])
  onScroll(): void {
    const bannerAltura = document.getElementById('banner')?.clientHeight || 0;
    this.mostrarCarrito = window.scrollY > bannerAltura;
  }

  toggleCarrito(): void {
    this.carritoVisible = !this.carritoVisible;
  }

  // Método para navegar a la página de PhoneComponent
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

  ngAfterViewInit(): void {
    this.initCarousel('.carousel', '#prevBtn', '#nextBtn');
    this.initCarousel('.carouselCelulares', '#prevBtnCel', '#nextBtnCel');
  }

  private initCarousel(carouselSelector: string, prevBtnSelector: string, nextBtnSelector: string): void {
    const carousel = document.querySelector(carouselSelector) as HTMLElement;
    const prevBtn = document.querySelector(prevBtnSelector) as HTMLElement;
    const nextBtn = document.querySelector(nextBtnSelector) as HTMLElement;

    if (!carousel || !prevBtn || !nextBtn) return; // Evitar errores si algún elemento no se encuentra

    let index = 0;
    const items = carousel.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    const visibleItems = 3; // Número de elementos visibles al mismo tiempo
    const itemWidth = items[0].clientWidth + 20; // Ancho del primer item + margen

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
