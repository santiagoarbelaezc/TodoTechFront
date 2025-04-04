import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioDTO } from '../models/usuario.dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  obtenerUsuarios(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(this.apiUrl);
  }

  // Obtener usuario por nombre
  obtenerUsuarioPorNombre(usuario: string): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.apiUrl}/${usuario}`);
  }

  // Crear un usuario
  crearUsuario(usuario: UsuarioDTO): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/crear`, usuario);
  }

  // Eliminar un usuario
  eliminarUsuario(usuario: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/eliminar/${usuario}`);
  }
}
