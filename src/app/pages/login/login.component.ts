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
          localStorage.setItem('usuario', this.username);
          this.router.navigate(['/inicio']);
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
