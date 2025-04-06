import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioDTO } from '../../models/usuario.dto'; // Asegúrate de importar el DTO

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

  constructor(private http: HttpClient, private router: Router) {}

  obtenerUsuario(usuario: string): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.apiUrl}/${usuario}`);
  }

  

  onLogin() {
    if (!this.username || !this.password) {
      alert('Por favor ingresa usuario y contraseña');
      return;
    }

    this.obtenerUsuario(this.username).subscribe({
      next: (usuario) => {
        console.log(usuario)
        if (usuario.password === this.password) {
          localStorage.setItem('usuario', JSON.stringify(usuario));
          this.router.navigate(['/inicio']);
        } else {
          alert('Contraseña incorrecta');
        }
      },
      error: () => {
        console.log('no lo trajo')
        alert('Usuario no encontrado');
      }
    });
  }
}
