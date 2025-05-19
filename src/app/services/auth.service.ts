// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UsuarioDTO } from '../models/usuario.dto';
import { Observable, of, catchError, tap } from 'rxjs';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://todotechshopprojectsoftware.onrender.com/api/usuarios';
  private usuarioActual: UsuarioDTO | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<UsuarioDTO | null> {
    return this.http.get<UsuarioDTO>(`${this.apiUrl}/login/${username}/${password}`).pipe(
      tap(usuario => {
        this.usuarioActual = usuario;
        localStorage.setItem('usuario', JSON.stringify(usuario));
        this.redirigirPorRol(usuario.tipoUsuario); // <- Redirige automáticamente
      }),
      catchError(() => of(null))
    );
  }

  redirigirPorRol(rol: UsuarioDTO['tipoUsuario']): void {
    switch (rol) {
      case 'ADMINISTRADOR':
      this.router.navigate(['/admin']);
      break;
      case 'VENDEDOR':
      this.router.navigate(['/ordenVenta']);
      break;
      case 'CAJERO':
      this.router.navigate(['/caja']);
      break;
      case 'DESPACHADOR':
      this.router.navigate(['/despacho']);
      break;
      default:
      this.router.navigate(['/']);
      break;
    }

    // Setear el usuario actual en UsuarioService
    if (this.usuarioActual) {
      const usuarioService = new UsuarioService(this.http); // Crear instancia de UsuarioService
      usuarioService.setUsuario(this.usuarioActual); // Setear el usuario actual
    }
  }

  getUsuarioActual(): UsuarioDTO | null {
    if (this.usuarioActual) return this.usuarioActual;
    const usuarioStr = localStorage.getItem('usuario');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  }

  logout(): void {
    this.usuarioActual = null;
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
