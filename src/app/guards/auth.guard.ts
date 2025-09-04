// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const usuario = this.authService.getUsuarioActual();
    console.log('AuthGuard: Usuario actual ->', usuario);

    if (usuario) {
      return true; // ✅ Usuario autenticado y sesión válida
    } else {
      this.router.navigate(['/login']); // 🔒 No autenticado o sesión expirada
      return false;
    }
  }
}
