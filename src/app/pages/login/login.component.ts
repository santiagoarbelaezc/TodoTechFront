import { Component, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit, OnInit {
  username: string = '';
  password: string = '';
  private hasSwapped: boolean = false;
  currentTheme: string = 'light';

  constructor(
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    // Cargar el tema guardado al inicializar el componente
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initSmoothSwap();
    }, 500);
  }

  private initSmoothSwap(): void {
    const loginContainer = this.elementRef.nativeElement.querySelector('.login-container');
    
    if (loginContainer && !this.hasSwapped) {
      // Primero preparamos la animación
      loginContainer.classList.add('swap-init');
      
      // Luego ejecutamos la transición completa
      setTimeout(() => {
        loginContainer.classList.remove('swap-init');
        loginContainer.classList.add('swap-completed');
        this.hasSwapped = true;
        
        // Activamos efectos secundarios
        this.activateSecondaryEffects();
      }, 1200);
    }
  }

  private activateSecondaryEffects(): void {
    this.activateWaves();
    this.activateOrbitalDots();
  }

  private activateWaves(): void {
    const waveCircles = this.elementRef.nativeElement.querySelectorAll('.wave-circle');
    
    waveCircles.forEach((circle: HTMLElement, index: number) => {
      setTimeout(() => {
        circle.style.animationPlayState = 'running';
      }, index * 400);
    });
  }

  private activateOrbitalDots(): void {
    const dots = this.elementRef.nativeElement.querySelectorAll('.dot');
    const orbitContainer = this.elementRef.nativeElement.querySelector('.orbit-dots');
    
    if (orbitContainer) {
      orbitContainer.style.animationPlayState = 'running';
    }
    
    dots.forEach((dot: HTMLElement, index: number) => {
      setTimeout(() => {
        dot.style.animationPlayState = 'running';
      }, index * 200);
    });
  }

  setTheme(theme: string): void {
  this.currentTheme = theme;
  
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    console.log('Tema oscuro activado');
  } else {
    document.body.classList.remove('dark-theme');
    console.log('Tema claro activado');
  }
  
  // Guardar preferencia del tema
  localStorage.setItem('theme', theme);
}

  onLogin(): void {
    if (!this.username || !this.password) {
      alert('Por favor ingresa usuario y contraseña');
      return;
    }
  
    this.authService.login(this.username, this.password).subscribe({
      next: (usuario) => {
        if (!usuario) {
          alert('Usuario o contraseña incorrectos');
        }
      },
      error: (error) => {
        console.error('Error en login:', error);
        alert('Error al intentar iniciar sesión');
      }
    });
  }
}