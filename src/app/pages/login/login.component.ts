import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule,FormsModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        // Si la autenticación es exitosa, redirige a la página de inicio
        this.router.navigate(['/inicio']);
      },
      (error) => {
        // Muestra un mensaje de error si el login falla
        this.errorMessage = 'Usuario o contraseña incorrectos';
        console.error('Error de autenticación:', error);
      }
    );
  }
}
