import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioDTO } from '../../models/usuario.dto';
import { UsuarioService } from '../../services/usuario.service';
import { PersonaDTO } from '../../models/persona.dto';
import { ProductoService } from '../../services/producto.service';
import { ProductoDTO } from '../../models/producto.dto';
import { CrearProductoDTO } from '../../models/crearProducto.dto';
import { OrdenVentaService } from '../../services/orden-venta.service';
import { OrdenVentaDTO } from '../../models/ordenventa.dto';
import { ReporteService } from '../../services/reporte.service';
import { ReporteRendimientoDTO } from '../../models/reporteRendimiento.dto';
import { VendedorService } from '../../services/vendedor.service';
import { DespachadorService } from '../../services/despachador.service';
import { CajeroService } from '../../services/cajero.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'] // <- corregido
})
export class AdminComponent implements OnInit {
  
  // Información personal del usuario
  nombre: string = '';
  correo: string = '';
  telefono: string = '';
  seccionActiva: string = 'bienvenida';

  // Listas
  usuarios: UsuarioDTO[] = [];
  productos: ProductoDTO[] = [];
  ordenes: OrdenVentaDTO[] = [];
  reportesPorVendedor: ReporteRendimientoDTO[] = [];

  // Objetos de trabajo
  usuario: UsuarioDTO = {
    usuario: '',
    password: '',
    tipoUsuario: 'ADMINISTRADOR'
  };

  persona: PersonaDTO = {
    nombre: '',
    correo: '',
    telefono: '',
    usuario: this.usuario
  };

  nuevoProducto: CrearProductoDTO = {
    id: 0,
    nombre: '',
    codigo: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoria: '',
    imagen: ''
  };

  constructor(
    private usuarioService: UsuarioService,
    private productoService: ProductoService,
    private ordenVentaService: OrdenVentaService,
    private reporteService: ReporteService,
    private vendedorService: VendedorService,
    private despachadorService: DespachadorService,
    private cajeroService: CajeroService,
    private router: Router // <- inyectado aquí
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarReportePorVendedor();
  }

  mostrarSeccion(seccion: string) {
    this.seccionActiva = seccion;
    switch (seccion) {
      case 'usuarios':
        this.cargarUsuarios();
        break;
      case 'productos':
        this.cargarProductos();
        break;
      case 'ordenes':
        this.cargarOrdenes();
        break;
      case 'reportes':
        this.cargarReportePorVendedor();
        break;
    }
  }

  cargarUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
        alert('Error al cargar los usuarios');
      }
    });
  }

  cargarProductos() {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => this.productos = data,
      error: (err) => {
        console.error('Error al obtener productos:', err);
        alert('Error al cargar los productos');
      }
    });
  }

  cargarOrdenes() {
    this.ordenVentaService.obtenerOrdenes().subscribe({
      next: (data) => this.ordenes = data,
      error: (err) => {
        console.error('Error al obtener órdenes de venta:', err);
        alert('Error al cargar las órdenes de venta');
      }
    });
  }

  cargarReportePorVendedor() {
    console.log('Cargando reporte de rendimiento por vendedor...');
    this.reporteService.obtenerReporteRendimiento().subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        this.reportesPorVendedor = data;
      },
      error: (err) => {
        console.error('Error al cargar reporte por vendedor:', err);
        alert('Error al obtener el reporte');
      },
      complete: () => console.log('Carga de reporte finalizada')
    });
  }

  guardarProducto() {
    const p = this.nuevoProducto;
    if (!p.nombre || !p.codigo || !p.precio || !p.stock || !p.categoria || !p.imagen) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    this.productoService.crearProducto(p).subscribe({
      next: () => {
        alert('Producto creado exitosamente');
        this.cargarProductos();
        this.nuevoProducto = {
          id: 0,
          nombre: '',
          codigo: '',
          descripcion: '',
          precio: 0,
          stock: 0,
          categoria: '',
          imagen: ''
        };
      },
      error: (err) => {
        console.error('Error al crear el producto:', err);
        alert('Error al crear el producto. Intenta de nuevo.');
      }
    });
  }

  editarProducto(producto: ProductoDTO) {
    console.log('Editar producto:', producto);
    // Implementar lógica
  }

 // tu-componente.component.ts
eliminarProducto(producto: ProductoDTO) {
  if (!producto.id) {
    console.error('El producto no tiene ID');
    return;
  }

  const confirmacion = confirm(`¿Estás seguro de eliminar el producto "${producto.nombre}"?`);
  
  if (confirmacion) {
    this.productoService.eliminarProducto(producto.id).subscribe({
      next: () => {
        // Actualizar la lista de productos después de eliminar
        this.cargarProductos; // Asume que tienes este método para refrescar la lista
        this.mostrarMensaje(`Producto "${producto.nombre}" eliminado correctamente`);
      },
      error: (err) => {
        console.error('Error al eliminar producto:', err);
        this.mostrarError(`Error al eliminar producto: ${err.error?.error || err.message}`);
      }
    });
  }
}

// Métodos auxiliares (deberías tenerlos o implementarlos)
mostrarMensaje(mensaje: string) {
  // Puedes usar un snackbar, toast, alert, etc.
  alert(mensaje);
}

mostrarError(mensaje: string) {
  alert(mensaje);
}

  verDetallesProducto(producto: ProductoDTO) {
    console.log('Detalles del producto:', producto);
    // Implementar lógica
  }

  verDetallesOrden(orden: OrdenVentaDTO) {
    console.log('Orden seleccionada:', orden);
    // Implementar lógica
  }

  guardarUsuario() {
    if (!this.usuario.usuario || !this.usuario.password || !this.usuario.tipoUsuario) {
      alert('Por favor completa todos los campos');
      return;
    }
  
    // Verificar si los campos de persona están completos
    if (!this.persona.nombre || !this.persona.correo || !this.persona.telefono) {
      alert('Por favor completa todos los campos de información personal.');
      return;
    }
  
    this.usuarioService.crearUsuario(this.usuario).subscribe({
      next: (response) => {
        alert(response.mensaje);
        this.usuarioService.obtenerUltimoUsuario().subscribe({
          next: (usuarioCreado) => {
            const persona: PersonaDTO = {
              nombre: this.persona.nombre,  // Usar persona.nombre, persona.correo, persona.telefono
              correo: this.persona.correo,
              telefono: this.persona.telefono,
              usuario: usuarioCreado
            };
  
            console.log('PersonaDTO a enviar:', persona);  // Para depurar
  
            switch (usuarioCreado.tipoUsuario) {
              case 'VENDEDOR':
                this.vendedorService.crearVendedor(persona).subscribe(
                  () => alert('Vendedor creado con éxito'),
                  (error) => {
                    console.error('Error al crear el vendedor:', error);
                    alert('Error al crear el vendedor');
                  }
                );
                break;
              case 'CAJERO':
                this.cajeroService.crearCajero(persona).subscribe(
                  () => alert('Cajero creado con éxito'),
                  (error) => {
                    console.error('Error al crear el cajero:', error);
                    alert('Error al crear el cajero');
                  }
                );
                break;
              case 'DESPACHADOR':
                this.despachadorService.crearDespachador(persona).subscribe(
                  () => alert('Despachador creado con éxito'),
                  (error) => {
                    console.error('Error al crear el despachador:', error);
                    alert('Error al crear el despachador');
                  }
                );
                break;
              default:
                alert('Tipo de usuario no reconocido');
            }
          },
          error: (err) => {
            console.error('Error al obtener el usuario recién creado:', err);
            alert('Error al recuperar el usuario creado.');
          }
        });
      },
      error: (err) => {
        console.error('Error al guardar el usuario:', err);
        alert('Error al crear el usuario. Por favor intenta de nuevo.');
      }
    });
  }


  actualizarProducto() {
  // Lógica para actualizar el producto
  }

  
}
