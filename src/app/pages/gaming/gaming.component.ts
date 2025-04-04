import { Component, AfterViewInit, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gaming',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gaming.component.html',
  styleUrl: './gaming.component.css'
})

export class GamingComponent implements AfterViewInit, OnInit {

  phrases: string[] = ["-30% en Portátiles", "Descuentos en Gaming", "Ofertas en Smartphones", "Accesorios al mejor precio"];
  currentText: string = this.phrases[0];
  index: number = 0;

  ngOnInit(): void {
    this.startTextRotation();
  }

  startTextRotation(): void {
    setInterval(() => {
      this.index = (this.index + 1) % this.phrases.length;
      this.currentText = this.phrases[this.index];
    }, 3000); // Cambia cada 2 segundos
  }

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
    this.initCarousel('.carouselHP', '#prevBtnHP', '#nextBtnHP');
    this.initCarousel('.carouselAsus', '#prevBtnAsus', '#nextBtnAsus');
  }

  private initCarousel(carouselSelector: string, prevBtnSelector: string, nextBtnSelector: string): void {
      const carousel = document.querySelector(carouselSelector) as HTMLElement;
      const prevBtn = document.querySelector(prevBtnSelector) as HTMLElement;
      const nextBtn = document.querySelector(nextBtnSelector) as HTMLElement;

      if (!carousel || !prevBtn || !nextBtn) return;

      let index = 0;
      const items = Array.from(carousel.querySelectorAll('.carousel-item')) as HTMLElement[];
      const totalItems = items.length;

      // Obtener el ancho del contenedor completo y de un item
      const itemWidth = items[0].getBoundingClientRect().width;
      const gap = parseInt(window.getComputedStyle(carousel).gap) || 20;
      const visibleItems = Math.floor(carousel.clientWidth / (itemWidth + gap));

      function updateCarousel() {
          const offset = -index * (itemWidth + gap);
          carousel.style.transform = `translateX(${offset}px)`;
      }

      nextBtn.addEventListener('click', () => {
          // Mover solo si el índice permite ver más elementos
          if (index < totalItems - visibleItems) {
              index++;
          } else {
              // Si llega al final, vuelve al inicio
              index = 0;
          }
          updateCarousel();
      });

      prevBtn.addEventListener('click', () => {
          // Mover hacia atrás solo si el índice no es 0
          if (index > 0) {
              index--;
          } else {
              // Si está en el inicio, ir al final
              index = totalItems - visibleItems;
          }
          updateCarousel();
      });

      updateCarousel();
  }


}

