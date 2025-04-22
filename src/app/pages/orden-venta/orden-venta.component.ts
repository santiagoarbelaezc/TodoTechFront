import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../../services/usuario.service';
import { OrdenVentaService } from '../../services/orden-venta.service';
import { Router } from '@angular/router';

import { ClienteDTO } from '../../models/cliente.dto';
import { UsuarioDTO } from '../../models/usuario.dto';
import { CrearOrdenDTO } from '../../models/CrearOrden.dto';
import { OrdenVentaDTO } from '../../models/ordenventa.dto';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  private crearOrdenUrl = 'http://localhost:8080/api/ordenes/crear';
  private ultimaOrdenUrl = 'http://localhost:8080/api/ordenes/ultima'; // tu endpoint para recuperar la orden recién creada

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private ordenVentaService: OrdenVentaService,
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
      vendedor: vendedor.usuario
    };

    // Paso 1: Crear la orden
    this.http.post(this.crearOrdenUrl, request).subscribe({
      next: () => {
        console.log('Orden creada con éxito');

        // Paso 2: Obtener la orden recién creada
        this.http.get<OrdenVentaDTO>(this.ultimaOrdenUrl).subscribe({
          next: (orden) => {
            console.log('Orden recuperada:', orden);

            // Paso 3: Guardarla en el servicio
            this.ordenVentaService.setOrden(orden);

            // Paso 4: Redirigir o continuar flujo
            this.router.navigate(['/inicio']); // ejemplo: ruta a componente de detalles
          },
          error: (error) => {
            console.error('Error al obtener la orden recién creada:', error);
            alert('Error al obtener los datos de la orden');
          }
        });
      },
      error: (error) => {
        console.error('Error al crear la orden:', error);
        alert('Error al crear la orden');
      }
    });
  }
}
