import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { ClienteDTO } from '../../models/cliente.dto';
import { UsuarioDTO } from '../../models/usuario.dto';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CrearOrdenDTO } from '../../models/CrearOrden.dto';

@Component({
  selector: 'app-orden-venta',
  templateUrl: './orden-venta.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./orden-venta.component.css']
})
export class OrdenVentaComponent implements OnInit {
  fechaHora: string = '';

  cliente: ClienteDTO = {
    nombre: '',
    correo: '',
    telefono: '',
    clave: ''
  };

  private apiUrl = 'http://localhost:8080/api/ordenes/crear';

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.actualizarFechaHora();
    setInterval(() => this.actualizarFechaHora(), 1000);
  }

  actualizarFechaHora(): void {
    const ahora = new Date();
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    this.fechaHora = ahora.toLocaleDateString('es-ES', opciones);
  }

  onSubmit(): void {
    const vendedor: UsuarioDTO | null = this.usuarioService.getUsuario();

    if (!vendedor || !vendedor.usuario) {
      alert('Error: no se encontró el usuario autenticado.');
      return;
    }

    const request: CrearOrdenDTO = {
      cliente: this.cliente,
      vendedor: vendedor.usuario // solo el nombre de usuario
    };

    this.http.post(this.apiUrl, request).subscribe({
      next: (respuesta) => {
        console.log('Orden creada con éxito:', respuesta);
        alert('Orden creada correctamente');
        this.router.navigate(['/inicio']); // Redirigir si deseas
      },
      error: (error) => {
        console.error('Error al crear la orden:', error);
        alert('Error al crear la orden');
      }
    });
  }
}
