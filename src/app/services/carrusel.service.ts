import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarruselService {
  initCarruselGeneral(carouselSelector: string, prevBtnSelector: string, nextBtnSelector: string): void {
    const carousel = document.querySelector(carouselSelector) as HTMLElement;
    const prevBtn = document.querySelector(prevBtnSelector) as HTMLElement;
    const nextBtn = document.querySelector(nextBtnSelector) as HTMLElement;

    if (!carousel || !prevBtn || !nextBtn) {
      console.error(`Error al inicializar carrusel: elementos no encontrados. Selector: ${carouselSelector}`);
      return;
    }

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