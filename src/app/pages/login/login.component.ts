import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioDTO } from '../../models/usuario.dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  username: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  validarCredenciales(usuario: string, password: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${usuario}/${password}`);
  }

  onLogin() {
    if (!this.username || !this.password) {
      alert('Por favor ingresa usuario y contraseña');
      return;
    }

    this.validarCredenciales(this.username, this.password).subscribe({
      next: (esValido) => {
        if (esValido) {
          // Solo si es válido, solicitamos el DTO completo
          this.http.get<UsuarioDTO>(`${this.apiUrl}/login/${this.username}/${this.password}`).subscribe({
            next: (usuario) => {
              this.usuarioService.setUsuario(usuario);
              localStorage.setItem('usuario', JSON.stringify(usuario)); // opcional
              this.router.navigate(['/ordenVenta']);
            },
            error: () => {
              alert('Error al obtener los datos del usuario');
            }
          });
        } else {
          alert('Usuario o contraseña incorrectos');
        }
      },
      error: () => {
        alert('Error al comunicarse con el servidor');
      }
    });
  }
}
