import { Injectable } from '@angular/core';
import { UsuarioDTO } from '../models/usuario.dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioActual: UsuarioDTO | null = null;

  setUsuario(usuario: UsuarioDTO): void {
    this.usuarioActual = usuario;
  }

  getUsuario(): UsuarioDTO | null {
    return this.usuarioActual;
  }

  limpiarUsuario(): void {
    this.usuarioActual = null;
  }
}
