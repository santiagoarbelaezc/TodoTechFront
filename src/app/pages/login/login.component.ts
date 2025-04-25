// src/app/components/login/login.component.ts

import { Component } from '@angular/core';
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
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    if (!this.username || !this.password) {
      alert('Por favor ingresa usuario y contraseña');
      return;
    }
  
    this.authService.login(this.username, this.password).subscribe(usuario => {
      if (!usuario) {
        alert('Usuario o contraseña incorrectos');
      }
      // La redirección ya se hace dentro del servicio
    });
  }

  
}
