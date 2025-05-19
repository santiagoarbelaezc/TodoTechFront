// src/app/components/orden-venta/orden-venta.component.ts
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

  private crearOrdenUrl = 'https://todotechshopprojectsoftware.onrender.com/api/ordenes/crear';
  ordenes: OrdenVentaDTO[] = [];

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private ordenVentaService: OrdenVentaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.actualizarFechaHora();
    setInterval(() => this.actualizarFechaHora(), 1000);
    this.cargarOrdenes();
  }

  cargarOrdenes() {
  this.ordenVentaService.obtenerOrdenes().subscribe({
    next: (data) => this.ordenes = data,
    error: (err) => {
      console.error('Error al obtener órdenes:', err);
      alert('Error al cargar las órdenes');
    }
  });
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

    this.http.post<OrdenVentaDTO>(this.crearOrdenUrl, request).subscribe({
      next: (ordenCreada) => {
        console.log('Orden creada:', ordenCreada);

        // Guardar la orden en el servicio y en localStorage
        this.ordenVentaService.setOrden(ordenCreada);
        this.ordenVentaService.setOrdenIdEnLocalStorage(ordenCreada.id);

        // Redirigir
        this.router.navigate(['/inicio']);
      },
      error: (error) => {
        console.error('Error al crear la orden:', error);
        alert('Error al crear la orden');
      }
    });
  }
}
