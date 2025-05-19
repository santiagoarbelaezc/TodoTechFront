import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioDTO } from '../models/usuario.dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl: string = 'https://todotechshopprojectsoftware.onrender.com/api/usuarios'; // URL base para la API
  private usuarioActual: UsuarioDTO | null = null; // Propiedad privada para almacenar el usuario actual

  constructor(private http: HttpClient) {}

  crearUsuario(usuarioDTO: UsuarioDTO): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/crear`, usuarioDTO);
  }


  obtenerUltimoUsuario(): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.apiUrl}/ultimo`);
  }
  
  obtenerUsuarios(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(this.apiUrl);
  }
  

  // Métodos para manipular la propiedad usuarioActual
  setUsuario(usuario: UsuarioDTO): void {
    this.usuarioActual = usuario;
  }


  getUsuario(): UsuarioDTO | null {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) as UsuarioDTO : null;
  }

  limpiarUsuario(): void {
    this.usuarioActual = null;
  }
}
// src/app/services/usuario.service.ts